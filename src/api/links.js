import { verifyAuth, getTokenFromRequest } from '../auth/github.js';
import { jsonResponse, errorResponse } from '../utils/cors.js';

// 验证友链数据
function validateLinkData(data) {
  const errors = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('网站名称是必填项');
  }

  if (!data.link || typeof data.link !== 'string') {
    errors.push('网站链接是必填项');
  } else {
    try {
      new URL(data.link);
    } catch {
      errors.push('网站链接格式不正确');
    }
  }

  if (data.avatar && typeof data.avatar === 'string' && data.avatar.trim().length > 0) {
    try {
      new URL(data.avatar);
    } catch {
      errors.push('网站图标格式不正确');
    }
  }

  if (data.rss && typeof data.rss === 'string' && data.rss.trim().length > 0) {
    try {
      new URL(data.rss);
    } catch {
      errors.push('RSS 订阅链接格式不正确');
    }
  }

  if (data.name && data.name.length > 100) {
    errors.push('网站名称不能超过100个字符');
  }

  if (data.descr && data.descr.length > 500) {
    errors.push('网站描述不能超过500个字符');
  }

  return errors;
}

// 生成友链 ID
function generateLinkId() {
  return `link_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// 处理友链提交
export async function handleSubmitLink(request, env) {
  try {
    // 检查请求方法
    if (request.method !== 'POST') {
      return errorResponse('Method not allowed', 405);
    }

    // 获取并验证 token
    const token = getTokenFromRequest(request);
    if (!token) {
      return errorResponse('未登录，请先使用 GitHub 登录', 401);
    }

    // 创建临时请求对象用于验证
    const tempRequest = new Request(request.url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const user = await verifyAuth(tempRequest, env);
    if (!user) {
      return errorResponse('登录已过期，请重新登录', 401);
    }

    // 解析请求体
    const contentType = request.headers.get('Content-Type');
    let linkData;

    if (contentType && contentType.includes('application/json')) {
      linkData = await request.json();
    } else {
      return errorResponse('Content-Type 必须是 application/json', 400);
    }

    // 验证数据
    const validationErrors = validateLinkData(linkData);
    if (validationErrors.length > 0) {
      return errorResponse(validationErrors.join(', '), 400);
    }

    // 检查是否已存在相同链接
    const existingLinksData = await env.LINKS_KV.get('links_data');
    let existingLinks = [];

    if (existingLinksData) {
      try {
        existingLinks = JSON.parse(existingLinksData);
      } catch (error) {
        console.error('Error parsing existing links:', error);
        existingLinks = [];
      }
    }

    // 检查重复链接
    const duplicateLink = existingLinks.find(link =>
      link.link === linkData.link || link.name === linkData.name
    );

    if (duplicateLink) {
      return errorResponse('该网站链接或名称已存在', 409);
    }

    // 创建新友链记录
    const newLink = {
      id: generateLinkId(),
      name: linkData.name.trim(),
      link: linkData.link.trim(),
      avatar: linkData.avatar ? linkData.avatar.trim() : '',
      descr: linkData.descr ? linkData.descr.trim() : '',
      rss: linkData.rss ? linkData.rss.trim() : '',
      submittedBy: {
        id: user.id,
        login: user.login,
        name: user.name,
        avatar_url: user.avatar_url,
      },
      submittedAt: new Date().toISOString(),
      status: 'pending', // pending, approved, rejected
    };

    // 添加到友链列表
    existingLinks.push(newLink);

    // 保存到 KV
    await env.LINKS_KV.put('links_data', JSON.stringify(existingLinks));

    // 同时保存单个友链记录（便于管理）
    await env.LINKS_KV.put(`link:${newLink.id}`, JSON.stringify(newLink));

    // 记录提交日志
    const logEntry = {
      action: 'submit_link',
      linkId: newLink.id,
      userId: user.id,
      userLogin: user.login,
      timestamp: new Date().toISOString(),
      linkData: {
        name: newLink.name,
        link: newLink.link,
      },
    };

    await env.LINKS_KV.put(
      `log:${Date.now()}_${newLink.id}`,
      JSON.stringify(logEntry),
      { expirationTtl: 30 * 24 * 60 * 60 } // 30天过期
    );

    return jsonResponse({
      success: true,
      message: '友链提交成功！',
      linkId: newLink.id,
      link: {
        id: newLink.id,
        name: newLink.name,
        link: newLink.link,
        status: newLink.status,
        submittedAt: newLink.submittedAt,
      },
    });

  } catch (error) {
    console.error('Submit link error:', error);
    return errorResponse('提交友链时发生错误', 500);
  }
}

// 处理获取友链列表
export async function handleGetLinks(request, env) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status') || 'approved';

    // 如果请求所有状态或管理员状态，需要验证管理员权限
    if (status === 'all' || status === 'pending' || status === 'rejected') {
      const token = getTokenFromRequest(request);
      if (!token) {
        return errorResponse('需要管理员权限', 401);
      }

      const tempRequest = new Request(request.url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const user = await verifyAuth(tempRequest, env);
      if (!user) {
        return errorResponse('登录已过期', 401);
      }

      // 验证管理员权限
      const adminUsers = (env.ADMIN_USERS || '').split(',').map(u => u.trim());
      if (!adminUsers.includes(user.login)) {
        return errorResponse('权限不足，只有管理员可以查看', 403);
      }
    }

    // 获取友链数据
    const linksData = await env.LINKS_KV.get('links_data');
    if (!linksData) {
      return jsonResponse([]);
    }

    let links;
    try {
      links = JSON.parse(linksData);
    } catch (error) {
      console.error('Error parsing links data:', error);
      return jsonResponse([]);
    }

    // 过滤友链状态
    let filteredLinks = links;
    if (status !== 'all') {
      filteredLinks = links.filter(link => link.status === status);
    }

    // 移除敏感信息（对于非管理员请求）
    const isAdmin = status === 'all' || status === 'pending' || status === 'rejected';
    const publicLinks = filteredLinks.map(link => isAdmin ? ({
      id: link.id,
      name: link.name,
      link: link.link,
      avatar: link.avatar,
      descr: link.descr,
      rss: link.rss || '',
      submittedAt: link.submittedAt,
      status: link.status,
      recommend: link.recommend || false,
      submittedBy: link.submittedBy,
    }) : ({
      id: link.id,
      name: link.name,
      link: link.link,
      avatar: link.avatar,
      descr: link.descr,
      rss: link.rss || '',
      submittedAt: link.submittedAt,
      status: link.status,
      recommend: link.recommend || false,
    }));

    // 按提交时间排序
    publicLinks.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    return jsonResponse(publicLinks);
  } catch (error) {
    console.error('Get links error:', error);
    return errorResponse('获取友链列表时发生错误', 500);
  }
}

// 处理友链管理（批准/拒绝）
export async function handleManageLink(request, env) {
  try {
    // 检查请求方法
    if (request.method !== 'PUT') {
      return errorResponse('Method not allowed', 405);
    }

    // 获取并验证 token
    const token = getTokenFromRequest(request);
    if (!token) {
      return errorResponse('未登录，请先使用 GitHub 登录', 401);
    }

    // 创建临时请求对象用于验证
    const tempRequest = new Request(request.url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const user = await verifyAuth(tempRequest, env);
    if (!user) {
      return errorResponse('登录已过期，请重新登录', 401);
    }

    // 简单的管理员验证（可以根据需要修改）
    const adminUsers = (env.ADMIN_USERS || '').split(',').map(u => u.trim());
    if (!adminUsers.includes(user.login)) {
      return errorResponse('权限不足，只有管理员可以管理友链', 403);
    }

    // 获取友链 ID
    const url = new URL(request.url);
    const linkId = url.pathname.split('/').pop();

    if (!linkId) {
      return errorResponse('缺少友链 ID', 400);
    }

    // 解析请求体
    const { action, reason, name, link, avatar, descr, rss, recommend } = await request.json();

    if (!action || !['approve', 'reject', 'delete', 'edit', 'toggleRecommend'].includes(action)) {
      return errorResponse('无效的操作，支持的操作：approve, reject, delete, edit, toggleRecommend', 400);
    }

    // 获取友链数据
    const linksData = await env.LINKS_KV.get('links_data');
    if (!linksData) {
      return errorResponse('友链数据不存在', 404);
    }

    let links;
    try {
      links = JSON.parse(linksData);
    } catch (error) {
      return errorResponse('友链数据格式错误', 500);
    }

    // 查找目标友链
    const linkIndex = links.findIndex(link => link.id === linkId);
    if (linkIndex === -1) {
      return errorResponse('友链不存在', 404);
    }

    const targetLink = links[linkIndex];

    // 执行操作
    if (action === 'delete') {
      // 删除友链
      links.splice(linkIndex, 1);
      await env.LINKS_KV.delete(`link:${linkId}`);
    } else if (action === 'edit') {
      // 编辑友链
      const validationErrors = validateLinkData({ name, link, avatar, descr, rss });
      if (validationErrors.length > 0) {
        return errorResponse(validationErrors.join(', '), 400);
      }

      // 更新友链信息
      targetLink.name = name.trim();
      targetLink.link = link.trim();
      targetLink.avatar = avatar ? avatar.trim() : '';
      targetLink.descr = descr ? descr.trim() : '';
      targetLink.rss = rss ? rss.trim() : '';

      // 更新单个友链记录
      await env.LINKS_KV.put(`link:${linkId}`, JSON.stringify(targetLink));
    } else if (action === 'toggleRecommend') {
      // 切换推荐状态
      const currentRecommend = !!targetLink.recommend; // 转换为布尔值
      targetLink.recommend = !currentRecommend;

      // 更新单个友链记录
      await env.LINKS_KV.put(`link:${linkId}`, JSON.stringify(targetLink));
    } else {
      // 更新友链状态
      targetLink.status = action === 'approve' ? 'approved' : 'rejected';
      targetLink.managedBy = {
        id: user.id,
        login: user.login,
        name: user.name,
      };
      targetLink.managedAt = new Date().toISOString();
      if (reason) {
        targetLink.reason = reason;
      }

      // 更新单个友链记录
      await env.LINKS_KV.put(`link:${linkId}`, JSON.stringify(targetLink));
    }

    // 保存更新后的友链列表
    await env.LINKS_KV.put('links_data', JSON.stringify(links));

    // 记录管理日志
    const logEntry = {
      action: `manage_link_${action}`,
      linkId: linkId,
      managerId: user.id,
      managerLogin: user.login,
      timestamp: new Date().toISOString(),
      reason: reason || '',
      linkData: {
        name: targetLink.name,
        link: targetLink.link,
      },
    };

    await env.LINKS_KV.put(
      `log:${Date.now()}_manage_${linkId}`,
      JSON.stringify(logEntry),
      { expirationTtl: 90 * 24 * 60 * 60 } // 90天过期
    );

    return jsonResponse({
      success: true,
      message: action === 'toggleRecommend'
        ? `友链${targetLink.recommend ? '已推荐' : '已取消推荐'}`
        : `友链${action === 'approve' ? '批准' : action === 'reject' ? '拒绝' : action === 'edit' ? '修改' : '删除'}成功`,
      linkId: linkId,
      action: action,
      recommend: targetLink.recommend || false,
    });

  } catch (error) {
    console.error('Manage link error:', error);
    return errorResponse('管理友链时发生错误', 500);
  }
}

