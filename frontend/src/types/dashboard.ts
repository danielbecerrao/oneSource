import type { LayoutItem } from 'grid-layout-plus';

export interface InfoProps {
  title: string;
  value: number;
  variation: number;
}
export interface ChartProps {
  title?: string;
  categories: string[];
  data: number[];
}
export interface Product {
  id: number;
  name: string;
  total: number;
}
export interface TopProps {
  title?: string;
  products: Product[];
}

export type WidgetType = 'info' | 'chart' | 'top';

export type DashboardItem =
  | (LayoutItem & { type: 'info'; props: InfoProps })
  | (LayoutItem & { type: 'chart'; props: ChartProps })
  | (LayoutItem & { type: 'top'; props: TopProps });

export interface BackendWidget extends Omit<LayoutItem, 'i'> {
  id: string;
  type: WidgetType;
  config: InfoProps | ChartProps | TopProps;
}
