export interface ProductCardData {
  name: string;
  description?: string;
  logo?: string;
  price?: string;
  badge?: string;
  gradient?: string;
}

export function render(data: ProductCardData): string {
  const {
    name,
    description = "",
    logo = "",
    price = "",
    badge = "",
    gradient = "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
  } = data;

  return `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: ${gradient};
    display: flex; align-items: center; justify-content: center;
    padding: 80px;
  }
  .card {
    background: rgba(255,255,255,0.95);
    border-radius: 24px;
    padding: 60px;
    width: 100%; height: 100%;
    display: flex; flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 25px 50px rgba(0,0,0,0.15);
  }
  .top { display: flex; align-items: center; gap: 20px; }
  .logo {
    width: 64px; height: 64px; border-radius: 16px;
    background: #f1f5f9; object-fit: contain;
  }
  .badge {
    display: inline-block;
    background: #10b981; color: white;
    font-size: 14px; font-weight: 600;
    padding: 4px 12px; border-radius: 12px;
  }
  .name {
    font-size: 48px; font-weight: 800;
    color: #0f172a; line-height: 1.2;
  }
  .description {
    font-size: 24px; color: #475569;
    line-height: 1.5;
  }
  .price {
    font-size: 32px; font-weight: 700;
    color: #6366f1;
  }
</style>
</head>
<body>
  <div class="card">
    <div>
      <div class="top">
        ${logo ? `<img class="logo" src="${logo}" />` : ""}
        ${badge ? `<span class="badge">${badge}</span>` : ""}
      </div>
    </div>
    <div class="name">${name}</div>
    <div class="description">${description}</div>
    ${price ? `<div class="price">${price}</div>` : ""}
  </div>
</body>
</html>`;
}
