export default `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>友链管理后台</title>
    <link rel="stylesheet" href="/static/style.css">
    <style>
        :root {
          --primary-color: #3b82f6;
          --primary-hover: #2563eb;
          --secondary-color: #6b7280;
          --success-color: #10b981;
          --error-color: #ef4444;
          --warning-color: #f59e0b;
          --bg-color: #ffffff;
          --background-color: #f9fafb;
          --card-background: #ffffff;
          --text-primary: #111827;
          --text-secondary: #6b7280;
          --border-color: #e5e7eb;
          --border-radius: 8px;
          --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        /* 暗色模式 */
        @media (prefers-color-scheme: dark) {
          :root {
            --bg-color: #1f2937;
            --background-color: #111827;
            --card-background: #1f2937;
            --text-primary: #f9fafb;
            --text-secondary: #9ca3af;
            --border-color: #374151;
          }
        }
        
        .admin-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .admin-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid var(--border-color);
        }
        
        .admin-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: var(--card-background);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: 20px;
            text-align: center;
            box-shadow: var(--shadow);
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: 700;
            color: var(--primary-color);
            margin-bottom: 5px;
        }
        
        .stat-label {
            color: var(--text-secondary);
            font-size: 0.9rem;
        }
        
        .filter-bar {
            display: flex;
            gap: 15px;
            margin-bottom: 20px;
            flex-wrap: wrap;
            align-items: center;
        }
        
        .filter-select {
            padding: 8px 12px;
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            background: var(--card-background);
            color: var(--text-primary);
            padding: 12px 24px;
            font-size: 1rem;
        }
        
        .admin-table {
            background: var(--card-background);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            overflow: hidden;
            box-shadow: var(--shadow);
        }
        
        .table-header {
            background: var(--card-background);
            padding: 15px;
            font-weight: 600;
            border-bottom: 1px solid var(--border-color);
        }
        
        .link-row {
            padding: 15px;
            border-bottom: 1px solid var(--border-color);
            display: grid;
            grid-template-columns: 1fr 2fr 1fr 1fr 150px;
            gap: 15px;
            align-items: center;
        }
        
        .link-row:last-child {
            border-bottom: none;
        }

        
        .status-badge {
            padding: 10px 20px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 500;
            text-align: center;
        }
        
        .status-pending {
            background: #fef3c7;
            color: #92400e;
        }
        
        .status-approved {
            background: #d1fae5;
            color: #065f46;
        }
        
        .status-rejected {
            background: #fee2e2;
            color: #991b1b;
        }
        
        .action-buttons {
            display: flex;
            gap: 5px;
        }
        
        .btn-small {
            padding: 10px 20px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 500;
            text-align: center;
        }
        
        .btn-approve {
            background: var(--success-color);
            color: white;
        }
        
        .btn-reject {
            background: var(--error-color);
            color: white;
        }
        
        .btn-delete {
            background: #6b7280;
            color: white;
            &:hover {
                background: #b91c1c;
            }
        }
        
        @media (max-width: 768px) {
            .link-row {
                grid-template-columns: 1fr;
                gap: 10px;
            }
            
            .filter-bar {
                flex-direction: column;
                align-items: stretch;
            }
        }

        /* 弹窗样式 */
        .modal {
            position: fixed;
            z-index: 9999;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .modal-content {
            background-color: var(--card-background);
            border-radius: 12px;
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            border: 1px solid var(--border-color);
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            border-bottom: 1px solid var(--border-color);
        }

        .modal-header h3 {
            margin: 0;
            color: var(--text-primary);
            font-size: 1.25rem;
            font-weight: 600;
        }

        .close {
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            color: var(--text-secondary);
            line-height: 1;
            padding: 0;
            background: none;
            border: none;
            transition: color 0.2s;
        }

        .close:hover {
            color: var(--text-primary);
        }

        .modal-body {
            padding: 24px;
        }

        .modal-body .form-group {
            margin-bottom: 20px;
        }

        .modal-body .form-group:last-child {
            margin-bottom: 0;
        }

        .modal-body label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: var(--text-primary);
            font-size: 14px;
        }

        .modal-body input,
        .modal-body textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid var(--border-color);
            border-radius: var(--border-radius);
            font-size: 14px;
            transition: border-color 0.2s, box-shadow 0.2s;
            background-color: var(--card-background);
            color: var(--text-primary);
            box-sizing: border-box;
            font-family: inherit;
        }

        .modal-body input:focus,
        .modal-body textarea:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .modal-body textarea {
            resize: vertical;
            min-height: 80px;
        }

        .form-actions {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            margin-top: 24px;
            padding-top: 20px;
            border-top: 1px solid var(--border-color);
        }

        .form-actions .btn {
            padding: 10px 20px;
            font-size: 14px;
            font-weight: 500;
        }

        /* 响应式弹窗 */
        @media (max-width: 768px) {
            .modal-content {
                width: 95%;
                margin: 20px;
            }
            
            .modal-header,
            .modal-body {
                padding: 16px;
            }
            
            .form-actions {
                flex-direction: column-reverse;
            }
            
            .form-actions .btn {
                width: 100%;
            }
        }
        .link-row a {
            color: var(--text-primary);
            text-decoration: none;
            font-weight: bold;
        }
        .link-row a:hover {
            color: var(--primary-color);
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="admin-container">
        <div class="admin-header">
            <div style="display: flex; align-items: center; gap: 15px;">
                <h1>🔗 友链管理后台</h1>
                <a href="/" class="btn btn-secondary" style="text-decoration: none; padding: 10px 20px; font-size: 0.9rem;">回到首页</a>
            </div>
            <div class="user-info" id="admin-user-info" style="display: none;">
                <img id="admin-avatar" src="" alt="管理员头像" class="user-avatar">
                <div class="user-details">
                    <span id="admin-name" class="user-name"></span>
                    <span id="admin-login" class="user-login"></span>
                </div>
                <button id="add-link-btn" class="btn btn-primary" style="margin-right: 10px;">增加友链</button>
                <button id="admin-logout" class="btn btn-secondary">退出登录</button>
            </div>
            <div id="admin-login-section">
                <button id="admin-login-btn" class="btn btn-primary">管理员登录</button>
            </div>
        </div>

        <div id="admin-content" style="display: none;">
            <!-- 统计信息 -->
            <div class="admin-stats">
                <div class="stat-card">
                    <div class="stat-number" id="stat-total">0</div>
                    <div class="stat-label">总友链数</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="stat-pending">0</div>
                    <div class="stat-label">待审核</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="stat-approved">0</div>
                    <div class="stat-label">已批准</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="stat-rejected">0</div>
                    <div class="stat-label">已拒绝</div>
                </div>
            </div>

            <!-- 过滤器 -->
            <div class="filter-bar">
                <label>状态筛选：</label>
                <select id="status-filter" class="filter-select">
                    <option value="all">全部</option>
                    <option value="pending">待审核</option>
                    <option value="approved">已批准</option>
                    <option value="rejected">已拒绝</option>
                </select>
                <button id="refresh-btn" class="btn btn-secondary">刷新数据</button>
            </div>

            <!-- 友链列表 -->
            <div class="admin-table">
                <div class="table-header">
                    <div class="link-row">
                        <div>网站信息</div>
                        <div>描述</div>
                        <div>提交者</div>
                        <div>状态</div>
                        <div>操作</div>
                    </div>
                </div>
                <div id="links-table-body">
                    <div class="loading" style="padding: 40px; text-align: center;">加载中...</div>
                </div>
            </div>
        </div>

        <!-- 消息提示 -->
        <div id="admin-message" class="message" style="display: none;"></div>

        <!-- 添加友链弹窗 -->
        <div id="add-link-modal" class="modal" style="display: none;">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>添加友链</h3>
                    <span class="close" id="close-modal">&times;</span>
                </div>
                <form id="add-link-form" class="modal-body">
                    <div class="form-group">
                        <label for="modal-name">网站名称 *</label>
                        <input type="text" id="modal-name" name="name" required maxlength="50" 
                               placeholder="请输入网站名称">
                    </div>
                    
                    <div class="form-group">
                        <label for="modal-link">网站链接 *</label>
                        <input type="url" id="modal-link" name="link" required 
                               placeholder="https://example.com">
                    </div>
                    
                    <div class="form-group">
                        <label for="modal-avatar">网站图标 *</label>
                        <input type="url" id="modal-avatar" name="avatar" required
                               placeholder="https://example.com/avatar.png">
                    </div>
                    
                    <div class="form-group">
                        <label for="modal-descr">网站描述</label>
                        <textarea id="modal-descr" name="descr" rows="3" maxlength="200" 
                                  placeholder="简单介绍一下网站 (可选)"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="modal-rss">RSS 订阅</label>
                        <input type="url" id="modal-rss" name="rss"
                               placeholder="https://example.com/rss.xml (可选)">
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" id="cancel-add" class="btn btn-secondary">取消</button>
                        <button type="submit" id="submit-add" class="btn btn-primary">添加友链</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- 编辑友链弹窗 -->
        <div id="edit-link-modal" class="modal" style="display: none;">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>编辑友链</h3>
                    <span class="close" id="close-edit-modal">&times;</span>
                </div>
                <form id="edit-link-form" class="modal-body">
                    <div class="form-group">
                        <label for="edit-name">网站名称 *</label>
                        <input type="text" id="edit-name" name="name" required maxlength="50" 
                               placeholder="请输入网站名称">
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-link">网站链接 *</label>
                        <input type="url" id="edit-link" name="link" required 
                               placeholder="https://example.com">
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-avatar">网站图标 *</label>
                        <input type="url" id="edit-avatar" name="avatar" required
                               placeholder="https://example.com/avatar.png">
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-descr">网站描述</label>
                        <textarea id="edit-descr" name="descr" rows="3" maxlength="200" 
                                  placeholder="简单介绍一下网站 (可选)"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-rss">RSS 订阅</label>
                        <input type="url" id="edit-rss" name="rss"
                               placeholder="https://example.com/rss.xml (可选)">
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" id="cancel-edit" class="btn btn-secondary">取消</button>
                        <button type="submit" id="submit-edit" class="btn btn-primary">保存修改</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        // 管理后台 JavaScript
        class AdminApp {
            constructor() {
                this.token = null;
                this.user = null;
                this.links = [];
                this.currentPage = 1;
                this.pageSize = 10;
                this.init();
            }

            init() {
                this.token = localStorage.getItem('auth_token');
                this.bindEvents();
                this.checkAdminAuth();
            }

            bindEvents() {
                document.getElementById('admin-login-btn').addEventListener('click', () => this.login());
                document.getElementById('admin-logout').addEventListener('click', () => this.logout());
                document.getElementById('status-filter').addEventListener('change', () => this.filterLinks());
                document.getElementById('refresh-btn').addEventListener('click', () => this.loadLinks());
                
                // 添加友链相关事件
                document.getElementById('add-link-btn').addEventListener('click', () => this.showAddLinkModal());
                document.getElementById('close-modal').addEventListener('click', () => this.hideAddLinkModal());
                document.getElementById('cancel-add').addEventListener('click', () => this.hideAddLinkModal());
                document.getElementById('add-link-form').addEventListener('submit', (e) => this.handleAddLink(e));
                
                // 编辑友链相关事件
                document.getElementById('close-edit-modal').addEventListener('click', () => this.hideEditLinkModal());
                document.getElementById('cancel-edit').addEventListener('click', () => this.hideEditLinkModal());
                document.getElementById('edit-link-form').addEventListener('submit', (e) => this.handleEditLink(e));
                
                // 友链操作按钮事件委托
                document.getElementById('links-table-body').addEventListener('click', (e) => {
                    const target = e.target;
                    console.log('Click event on:', target.tagName, target.className, target);
                    const button = target.closest('button[data-id]');
                    console.log('Found button:', button);
                    if (button) {
                        e.preventDefault();
                        e.stopPropagation();
                        const linkId = button.dataset.id;
                        const action = button.dataset.action;
                        console.log('Link ID:', linkId, 'Action:', action);
                        if (action === 'edit') {
                            this.showEditLinkModal(linkId);
                        } else {
                            this.manageLink(linkId, action);
                        }
                    } else {
                        console.log('No button found with data-id attribute');
                    }
                });
                
                // 点击弹窗外部关闭
                document.getElementById('add-link-modal').addEventListener('click', (e) => {
                    if (e.target.id === 'add-link-modal') {
                        this.hideAddLinkModal();
                    }
                });
                document.getElementById('edit-link-modal').addEventListener('click', (e) => {
                    if (e.target.id === 'edit-link-modal') {
                        this.hideEditLinkModal();
                    }
                });
            }

            async checkAdminAuth() {
                if (!this.token) {
                    this.showLoginSection();
                    return;
                }

                try {
                    const response = await fetch('/api/links?status=all', {
                        headers: { 'Authorization': 'Bearer ' + this.token }
                    });

                    if (response.ok) {
                        this.user = this.parseTokenPayload(this.token);
                        this.showAdminSection();
                        this.loadLinks();
                    } else {
                        this.clearAuth();
                        this.showLoginSection();
                    }
                } catch (error) {
                    console.error('Admin auth check failed:', error);
                    this.clearAuth();
                    this.showLoginSection();
                }
            }

            parseTokenPayload(token) {
                try {
                    return JSON.parse(atob(token.split('.')[1]));
                } catch (error) {
                    return null;
                }
            }

            login() {
                window.location.href = '/api/auth/github';
            }

            logout() {
                this.clearAuth();
                this.showLoginSection();
                // 重定向到首页
                window.location.href = '/';
            }

            clearAuth() {
                this.token = null;
                this.user = null;
                localStorage.removeItem('auth_token');
            }

            showLoginSection() {
                document.getElementById('admin-login-section').style.display = 'block';
                document.getElementById('admin-user-info').style.display = 'none';
                document.getElementById('admin-content').style.display = 'none';
            }

            showAdminSection() {
                document.getElementById('admin-login-section').style.display = 'none';
                document.getElementById('admin-user-info').style.display = 'flex';
                document.getElementById('admin-content').style.display = 'block';

                if (this.user) {
                    document.getElementById('admin-avatar').src = this.user.avatar_url || '';
                    document.getElementById('admin-name').textContent = this.user.name || this.user.login;
                    document.getElementById('admin-login').textContent = '@' + this.user.login;
                }
            }

            async loadLinks() {
                try {
                    const response = await fetch('/api/links?status=all', {
                        headers: { 'Authorization': 'Bearer ' + this.token }
                    });

                    if (response.ok) {
                        this.links = await response.json();
                        this.updateStats();
                        this.renderLinks();
                    } else {
                        this.showMessage('加载友链失败：权限不足', 'error');
                    }
                } catch (error) {
                    console.error('Load links error:', error);
                    this.showMessage('加载友链失败', 'error');
                }
            }

            updateStats() {
                const stats = this.links.reduce((acc, link) => {
                    acc.total++;
                    acc[link.status] = (acc[link.status] || 0) + 1;
                    return acc;
                }, { total: 0, pending: 0, approved: 0, rejected: 0 });

                document.getElementById('stat-total').textContent = stats.total;
                document.getElementById('stat-pending').textContent = stats.pending;
                document.getElementById('stat-approved').textContent = stats.approved;
                document.getElementById('stat-rejected').textContent = stats.rejected;
            }

            filterLinks() {
                const filter = document.getElementById('status-filter').value;
                this.currentPage = 1;
                this.renderLinks(filter);
            }

            renderLinks(statusFilter = 'all') {
                const tbody = document.getElementById('links-table-body');
                const filteredLinks = statusFilter === 'all'
                    ? this.links
                    : this.links.filter(function(link) { return link.status === statusFilter; });
                const totalPages = Math.ceil(filteredLinks.length / this.pageSize);
                const startIdx = (this.currentPage - 1) * this.pageSize;
                const pageLinks = filteredLinks.slice(startIdx, startIdx + this.pageSize);
                if (pageLinks.length === 0) {
                    tbody.innerHTML = '<div style="padding: 40px; text-align: center; color: var(--text-secondary);">暂无数据</div>';
                    this.renderPagination(totalPages);
                    return;
                }
                tbody.innerHTML = pageLinks.map(function(link) {
                    return '<div class="link-row">' +
                        '<div style="display: flex; align-items: center; gap: 10px;">' +
                            '<img src="' + (link.avatar || '') + '" alt="头像" style="width:32px;height:32px;border-radius:50%;object-fit:cover;background:#eee;">' +
                            '<div>' +
                                '<a href="' + link.link + '" target="_blank"><strong>' + link.name + '</strong></a>' +
                            '</div>' +
                        '</div>' +
                        '<div style="font-size: 0.9rem; color: var(--text-secondary);">' +
                            (link.descr ? link.descr : '无描述') +
                        '</div>' +
                        '<div style="font-size: 0.9rem;">' +
                            (link.submittedBy ? link.submittedBy.login : '未知') +
                        '</div>' +
                        '<div>' +
                            '<span class="status-badge status-' + link.status + '">' + (link.status === 'pending' ? '待审核' : (link.status === 'approved' ? '已批准' : '已拒绝')) + '</span>' +
                        '</div>' +
                        '<div class="action-buttons">' +
                            '<button class="btn btn-small" data-id="' + link.id + '" data-action="edit" style="background: #3b82f6;">编辑</button>' +
                            (link.status === 'pending'
                                ? '<button class="btn btn-small btn-approve" data-id="' + link.id + '" data-action="approve">批准</button>' +
                                  '<button class="btn btn-small btn-reject" data-id="' + link.id + '" data-action="reject">拒绝</button>'
                                : '') +
                            '<button class="btn btn-small btn-delete" data-id="' + link.id + '" data-action="delete">删除</button>' +
                        '</div>' +
                    '</div>';
                }).join('');
                this.renderPagination(totalPages);
            }
            renderPagination(totalPages) {
                const tbody = document.getElementById('links-table-body');
                var paginationHtml = '';
                if (totalPages > 1) {
                    paginationHtml += '<div class="pagination" style="text-align:center;padding:20px 0;">';
                    paginationHtml += '<button class="btn btn-small" ' + (this.currentPage === 1 ? 'disabled' : '') + ' onclick="adminApp.gotoPage(' + (this.currentPage - 1) + ')">上一页</button>';
                    for (var i = 1; i <= totalPages; i++) {
                        paginationHtml += '<button class="btn btn-small' + (i === this.currentPage ? ' btn-primary' : '') + '" onclick="adminApp.gotoPage(' + i + ')">' + i + '</button>';
                    }
                    paginationHtml += '<button class="btn btn-small" ' + (this.currentPage === totalPages ? 'disabled' : '') + ' onclick="adminApp.gotoPage(' + (this.currentPage + 1) + ')">下一页</button>';
                    paginationHtml += '</div>';
                }
                tbody.innerHTML += paginationHtml;
            }
            gotoPage(page) {
                this.currentPage = page;
                this.renderLinks(document.getElementById('status-filter').value);
            }
            async manageLink(linkId, action) {
                const reason = action === 'reject' ? prompt('请输入拒绝原因（可选）：') : '';
                
                if (action === 'delete' && !confirm('确定要删除这个友链吗？')) {
                    return;
                }

                try {
                    const response = await fetch('/api/links/' + linkId, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + this.token
                        },
                        body: JSON.stringify({ action, reason })
                    });

                    const result = await response.json();

                    if (response.ok) {
                        this.showMessage(result.message, 'success');
                        this.loadLinks(); // 重新加载数据
                    } else {
                        this.showMessage('操作失败：' + result.error, 'error');
                    }
                } catch (error) {
                    console.error('Manage link error:', error);
                    this.showMessage('操作失败', 'error');
                }
            }

            getStatusText(status) {
                const statusMap = {
                    'pending': '待审核',
                    'approved': '已批准',
                    'rejected': '已拒绝'
                };
                return statusMap[status] || status;
            }

            showMessage(text, type = 'info') {
                const messageEl = document.getElementById('admin-message');
                messageEl.textContent = text;
                messageEl.className = \`message \${type}\`;
                messageEl.style.display = 'block';

                setTimeout(() => {
                    messageEl.style.display = 'none';
                }, 3000);
            }

            escapeHtml(text) {
                const div = document.createElement('div');
                div.textContent = text;
                return div.innerHTML;
            }

            showAddLinkModal() {
                document.getElementById('add-link-modal').style.display = 'flex';
                document.getElementById('modal-name').focus();
            }

            hideAddLinkModal() {
                document.getElementById('add-link-modal').style.display = 'none';
                document.getElementById('add-link-form').reset();
            }

            showEditLinkModal(linkId) {
                console.log('showEditLinkModal called with linkId:', linkId);
                console.log('Available links:', this.links);
                const link = this.links.find(l => l.id === linkId);
                if (!link) {
                    console.log('Link not found for id:', linkId);
                    return;
                }
                console.log('Found link:', link);

                document.getElementById('edit-name').value = link.name;
                document.getElementById('edit-link').value = link.link;
                document.getElementById('edit-avatar').value = link.avatar;
                document.getElementById('edit-descr').value = link.descr || '';
                document.getElementById('edit-rss').value = link.rss || '';
                document.getElementById('edit-link-form').dataset.linkId = linkId;
                
                const modal = document.getElementById('edit-link-modal');
                console.log('Modal element:', modal);
                console.log('Modal before - display:', window.getComputedStyle(modal).display);
                
                // 强制显示，使用 !important 覆盖任何可能冲突的样式
                modal.style.setProperty('display', 'flex', 'important');
                modal.style.setProperty('z-index', '9999', 'important');
                
                // 延迟确保 DOM 更新
                setTimeout(() => {
                    console.log('Modal after timeout - display:', window.getComputedStyle(modal).display);
                    console.log('Modal computed styles:', window.getComputedStyle(modal));
                    console.log('Modal offset:', modal.offsetLeft, modal.offsetTop);
                    console.log('Modal dimensions:', modal.offsetWidth, modal.offsetHeight);
                    console.log('Modal rect:', modal.getBoundingClientRect());
                    document.getElementById('edit-name').focus();
                    console.log('Modal should be visible now, focus set');
                }, 100);
            }

            hideEditLinkModal() {
                document.getElementById('edit-link-modal').style.display = 'none';
                document.getElementById('edit-link-form').reset();
                delete document.getElementById('edit-link-form').dataset.linkId;
            }

            async handleEditLink(event) {
                event.preventDefault();
                
                const submitBtn = document.getElementById('submit-edit');
                const originalText = submitBtn.textContent;
                const linkId = document.getElementById('edit-link-form').dataset.linkId;
                
                if (!linkId) {
                    this.showMessage('无法获取友链 ID', 'error');
                    return;
                }
                
                try {
                    submitBtn.disabled = true;
                    submitBtn.textContent = '保存中...';

                    const formData = new FormData(event.target);
                    const linkData = {
                        name: formData.get('name').trim(),
                        link: formData.get('link').trim(),
                        avatar: formData.get('avatar').trim(),
                        descr: formData.get('descr').trim(),
                        rss: formData.get('rss').trim()
                    };

                    const response = await fetch('/api/links/' + linkId, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + this.token
                        },
                        body: JSON.stringify({
                            action: 'edit',
                            ...linkData
                        })
                    });

                    const result = await response.json();

                    if (response.ok) {
                        this.showMessage('友链修改成功！', 'success');
                        this.hideEditLinkModal();
                        this.loadLinks();
                    } else {
                        this.showMessage('修改失败：' + result.error, 'error');
                    }
                } catch (error) {
                    console.error('Edit link error:', error);
                    this.showMessage('修改友链时发生错误', 'error');
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            }

            async handleAddLink(event) {
                event.preventDefault();
                
                const submitBtn = document.getElementById('submit-add');
                const originalText = submitBtn.textContent;
                
                try {
                    submitBtn.disabled = true;
                    submitBtn.textContent = '添加中...';

                    const formData = new FormData(event.target);
                    const linkData = {
                        name: formData.get('name').trim(),
                        link: formData.get('link').trim(),
                        avatar: formData.get('avatar').trim(),
                        descr: formData.get('descr').trim(),
                        rss: formData.get('rss').trim()
                    };

                    const response = await fetch('/api/submit', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + this.token
                        },
                        body: JSON.stringify(linkData)
                    });

                    const result = await response.json();

                    if (response.ok) {
                        // 直接批准管理员添加的友链
                        await this.manageLink(result.linkId, 'approve');
                        this.showMessage('友链添加成功！', 'success');
                        this.hideAddLinkModal();
                        this.loadLinks();
                    } else {
                        this.showMessage('添加失败：' + result.error, 'error');
                    }
                } catch (error) {
                    console.error('Add link error:', error);
                    this.showMessage('添加友链时发生错误', 'error');
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            }
        }

        // 全局变量，供 onclick 事件使用
        let adminApp;

        document.addEventListener('DOMContentLoaded', () => {
            adminApp = new AdminApp();
        });
    </script>
</body>
</html>`;








