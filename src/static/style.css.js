export default `/* 友链申请系统样式 */
:root {
  --primary-color: #3b82f6;
  --primary-hover: #2563eb;
  --secondary-color: #6b7280;
  --success-color: #10b981;
  --error-color: #ef4444;
  --warning-color: #f59e0b;
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
    --background-color: #111827;
    --card-background: #1f2937;
    --text-primary: #f9fafb;
    --text-secondary: #9ca3af;
    --border-color: #374151;
  }
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: var(--background-color);
  color: var(--text-primary);
  line-height: 1.6;
  min-height: 100vh;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 头部样式 */
.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  background: linear-gradient(135deg, var(--primary-color), #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
}

/* 主要内容 */
.main {
  flex: 1;
}

/* 卡片样式 */
.login-card,
.form-card {
  background: var(--card-background);
  border-radius: var(--border-radius);
  padding: 30px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
  margin-bottom: 30px;
}

/* 认证状态 */
.auth-status {
  margin-bottom: 30px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: var(--card-background);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow);
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid var(--border-color);
}

.user-details {
  flex: 1;
}

.user-name {
  display: block;
  font-weight: 600;
  font-size: 1.1rem;
}

.user-login {
  display: block;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* 登录部分 */
.login-section {
  text-align: center;
}

.login-card h2 {
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.login-card p {
  color: var(--text-secondary);
  margin-bottom: 25px;
}

/* 按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

.btn-secondary {
  background-color: var(--secondary-color);
  color: white;
}

.btn-secondary:hover {
  background-color: #b91c1c;
}

.btn-admin {
  background-color: var(--warning-color);
  color: white;
  margin-right: 8px;
}

.btn-admin:hover {
  background-color: #d97706;
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.github-icon {
  width: 20px;
  height: 20px;
}

/* 表单样式 */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--text-primary);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
  background-color: var(--card-background);
  color: var(--text-primary);
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  text-align: right;
}

/* 消息提示 */
.message {
  padding: 15px;
  border-radius: var(--border-radius);
  margin-bottom: 20px;
  font-weight: 500;
}

.message.success {
  background-color: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.message.error {
  background-color: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}

/* 友链列表 */
.links-section {
  margin-top: 40px;
}

.links-section h2 {
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.links-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.link-item {
  background: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 20px;
  box-shadow: var(--shadow);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.link-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.link-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}

.link-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--border-color);
}

.link-info h3 {
  margin: 0;
  font-size: 1.1rem;
}

.link-info a {
  color: var(--primary-color);
  text-decoration: none;
}

.link-info a:hover {
  text-decoration: underline;
}

.link-description {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: 10px;
}

.loading {
  text-align: center;
  color: var(--text-secondary);
  padding: 40px;
}

/* 底部 */
.footer {
  text-align: center;
  margin-top: 40px;
  padding: 20px 0;
  border-top: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.footer a {
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer a:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

.footer svg {
  transition: transform 0.2s ease;
}

.footer a:hover svg {
  transform: scale(1.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 15px;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .login-card,
  .form-card {
    padding: 20px;
  }
  
  .user-info {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
  
  .links-list {
    grid-template-columns: 1fr;
  }
}

/* 动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.3s ease;
}
`;

