import { render as blogCard, type BlogCardData } from "./blog-card.js";
import { render as minimal, type MinimalData } from "./minimal.js";
import { render as productCard, type ProductCardData } from "./product-card.js";

export type TemplateName = "blog-card" | "minimal" | "product-card";

type TemplateDataMap = {
  "blog-card": BlogCardData;
  "minimal": MinimalData;
  "product-card": ProductCardData;
};

const templates: Record<TemplateName, (data: any) => string> = {
  "blog-card": blogCard,
  "minimal": minimal,
  "product-card": productCard,
};

export function getTemplateNames(): TemplateName[] {
  return Object.keys(templates) as TemplateName[];
}

export function renderTemplate(name: string, data: Record<string, any>): string | null {
  const renderer = templates[name as TemplateName];
  if (!renderer) return null;
  return renderer(data);
}
