export default `// 友链申请系统 JavaScript
class LinkApp {
  constructor() {
    this.token = null;
    this.user = null;
    this.init();
  }

  init() {
    // 检查 URL 中的 token
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    
    if (urlToken) {
      this.token = urlToken;
      // 保存到 localStorage
      localStorage.setItem('auth_token', urlToken);
      // 清除 URL 中的 token
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // 从 localStorage 获取 token
      this.token = localStorage.getItem('auth_token');
    }

    this.bindEvents();
    this.checkAuth();
    this.loadLinks();
  }

  bindEvents() {
    // 登录按钮
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => this.login());
    }

    // 退出登录按钮
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }

    // 管理面板按钮
    const adminBtn = document.getElementById('admin-btn');
    if (adminBtn) {
      adminBtn.addEventListener('click', () => window.location.href = '/admin');
    }

    // 表单提交
    const linkForm = document.getElementById('link-form');
    if (linkForm) {
      linkForm.addEventListener('submit', (e) => this.submitLink(e));
    }
  }

  async checkAuth() {
    if (!this.token) {
      this.showLoginSection();
      return;
    }

    try {
      console.log('Checking auth for user...');
      
      // 验证 token 并检查管理员权限
      const response = await fetch('/api/links?status=all', {
        headers: { 'Authorization': \`Bearer \${this.token}\` }
      });

      console.log('Admin check response status:', response.status);

      if (response.ok) {
        // 是管理员
        console.log('User is admin, showing admin button');
        this.user = this.parseTokenPayload(this.token);
        this.showAdminButton();
        this.showUserSection();
      } else if (response.status === 403) {
        // 普通用户，继续正常流程
        console.log('User is not admin, showing normal interface');
        this.user = this.parseTokenPayload(this.token);
        this.showUserSection();
      } else {
        // token 无效
        console.log('Token invalid, clearing auth');
        this.clearAuth();
        this.showLoginSection();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      this.clearAuth();
      this.showLoginSection();
    }
  }

  parseTokenPayload(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      console.error('Failed to parse token:', error);
      return null;
    }
  }

  login() {
    window.location.href = '/api/auth/github';
  }

  logout() {
    this.clearAuth();
    this.showLoginSection();
    this.showMessage('已退出登录', 'success');
  }

  clearAuth() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('auth_token');
  }

  showLoginSection() {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('auth-status').style.display = 'none';
    document.getElementById('submit-section').style.display = 'none';
    document.getElementById('admin-btn').style.display = 'none';
  }

  showAdminButton() {
    document.getElementById('admin-btn').style.display = 'inline-block';
  }

  showUserSection() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('auth-status').style.display = 'block';
    document.getElementById('submit-section').style.display = 'block';

    // 显示用户信息
    if (this.user) {
      document.getElementById('user-avatar').src = this.user.avatar_url || '';
      document.getElementById('user-name').textContent = this.user.name || this.user.login;
      document.getElementById('user-login').textContent = '@' + this.user.login;
    }
  }

  async submitLink(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('submit-btn');
    const originalText = submitBtn.textContent;
    
    try {
      submitBtn.disabled = true;
      submitBtn.textContent = '提交中...';

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
          'Authorization': \`Bearer \${this.token}\`
        },
        body: JSON.stringify(linkData)
      });

      const result = await response.json();

      if (response.ok) {
        this.showMessage('友链提交成功！等待管理员审核。', 'success');
        event.target.reset(); // 清空表单
        // 重新加载友链列表
        setTimeout(() => this.loadLinks(), 1000);
      } else {
        this.showMessage(\`提交失败：\${result.error}\`, 'error');
      }
    } catch (error) {
      console.error('Submit error:', error);
      this.showMessage('提交时发生网络错误，请稍后重试', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }

  async loadLinks() {
    const linksList = document.getElementById('links-list');
    
    try {
      linksList.innerHTML = '<div class="loading">加载中...</div>';
      
      const response = await fetch('/api/links?status=approved');
      const links = await response.json();

      if (response.ok && Array.isArray(links)) {
        this.renderLinks(links);
      } else {
        linksList.innerHTML = '<div class="loading">加载友链失败</div>';
      }
    } catch (error) {
      console.error('Load links error:', error);
      linksList.innerHTML = '<div class="loading">加载友链失败</div>';
    }
  }

  renderLinks(links) {
    const linksList = document.getElementById('links-list');
    
    if (links.length === 0) {
      linksList.innerHTML = '<div class="loading">暂无友链</div>';
      return;
    }

    const linksHTML = links.map(link => \`
      <div class="link-item fade-in">
        <div class="link-header">
          \${link.avatar ? \`<img src="\${this.escapeHtml(link.avatar)}" alt="\${this.escapeHtml(link.name)}" class="link-avatar" onerror="this.style.display='none'">\` : ''}
          <div class="link-info">
            <h3><a href="\${this.escapeHtml(link.link)}" target="_blank" rel="noopener noreferrer">\${this.escapeHtml(link.name)}</a></h3>
          </div>
        </div>
        \${link.descr ? \`<div class="link-description">\${this.escapeHtml(link.descr)}</div>\` : ''}
      </div>
    \`).join('');

    linksList.innerHTML = linksHTML;
  }

  showMessage(text, type = 'info') {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = \`message \${type}\`;
    messageEl.style.display = 'block';

    // 3秒后自动隐藏
    setTimeout(() => {
      messageEl.style.display = 'none';
    }, 3000);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
  new LinkApp();
});
`;



