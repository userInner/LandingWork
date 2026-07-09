export interface BlogCardData {
  title: string;
  author?: string;
  avatar?: string;
  date?: string;
  domain?: string;
  tag?: string;
}

export function render(data: BlogCardData): string {
  const { title, author = "", avatar = "", date = "", domain = "", tag = "" } = data;

  return `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    display: flex; align-items: center; justify-content: center;
    padding: 60px;
  }
  .card {
    width: 100%; height: 100%;
    display: flex; flex-direction: column; justify-content: space-between;
  }
  .tag {
    display: inline-block;
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
    font-size: 18px; font-weight: 600;
    padding: 6px 16px; border-radius: 20px;
    border: 1px solid rgba(16, 185, 129, 0.3);
  }
  .title {
    font-size: 52px; font-weight: 800;
    color: #f8fafc; line-height: 1.2;
    max-height: 250px; overflow: hidden;
  }
  .footer {
    display: flex; align-items: center; gap: 16px;
  }
  .avatar {
    width: 48px; height: 48px; border-radius: 50%;
    background: #334155; object-fit: cover;
  }
  .meta {
    display: flex; flex-direction: column; gap: 2px;
  }
  .author { font-size: 20px; color: #e2e8f0; font-weight: 600; }
  .info { font-size: 16px; color: #94a3b8; }
</style>
</head>
<body>
  <div class="card">
    <div>${tag ? `<span class="tag">${tag}</span>` : ""}</div>
    <div class="title">${title}</div>
    <div class="footer">
      ${avatar ? `<img class="avatar" src="${avatar}" />` : `<div class="avatar"></div>`}
      <div class="meta">
        ${author ? `<span class="author">${author}</span>` : ""}
        <span class="info">${[date, domain].filter(Boolean).join(" · ")}</span>
      </div>
    </div>
  </div>
</body>
</html>`;
}
