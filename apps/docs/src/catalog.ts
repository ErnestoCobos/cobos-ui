import catalogJson from './catalog.json';

export type ComponentStatus = 'stable' | 'planned';

export interface CatalogComponent {
  key: string;
  name: string;
  category: string;
  status: ComponentStatus;
  wave: number;
  description: string;
  /** Named export from `@cobos/react` (only present for stable components). */
  export?: string;
  /** Source directory within the library. */
  dir?: string;
  /** Element Plus component slug, used to build the reference link. */
  elementPlus?: string;
}

export interface Catalog {
  name: string;
  homepage: string;
  description: string;
  categories: string[];
  components: CatalogComponent[];
}

const catalog = catalogJson as Catalog;

export const CATEGORIES = catalog.categories;
export const COMPONENTS = catalog.components;

/** Components grouped by category, preserving the catalog category order. */
export interface CategoryGroup {
  category: string;
  components: CatalogComponent[];
}

export function groupByCategory(components: CatalogComponent[] = COMPONENTS): CategoryGroup[] {
  const groups: CategoryGroup[] = CATEGORIES.map((category) => ({
    category,
    components: components.filter((c) => c.category === category),
  }));
  return groups.filter((g) => g.components.length > 0);
}

export function findComponent(key: string): CatalogComponent | undefined {
  return COMPONENTS.find((c) => c.key === key);
}

export const STABLE_COMPONENTS = COMPONENTS.filter((c) => c.status === 'stable');

/** Build the Element Plus documentation reference URL for a component. */
export function elementPlusUrl(slug?: string): string | undefined {
  if (!slug) return undefined;
  return `https://element-plus.org/en-US/component/${slug}.html`;
}

export default catalog;
