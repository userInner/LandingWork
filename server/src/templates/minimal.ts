export interface MinimalData {
  title: string;
  subtitle?: string;
  color?: string;
  bgColor?: string;
}

export function render(data: MinimalData): string {
  const { title, subtitle = "", color = "#10b981", bgColor = "#0f172a" } = data;

  return `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: ${bgColor};
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 80px;
    text-align: center;
  }
  .title {
    font-size: 64px; font-weight: 800;
    color: #f8fafc; line-height: 1.2;
    margin-bottom: 20px;
  }
  .subtitle {
    font-size: 28px; color: #94a3b8;
    line-height: 1.4;
  }
  .accent {
    width: 80px; height: 4px;
    background: ${color};
    border-radius: 2px;
    margin-bottom: 40px;
  }
</style>
</head>
<body>
  <div class="accent"></div>
  <div class="title">${title}</div>
  ${subtitle ? `<div class="subtitle">${subtitle}</div>` : ""}
</body>
</html>`;
}
