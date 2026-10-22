export interface GoodNavItem {
  id: string;
  label: string;
  icon?: GoodIconName;
  route?: string;
  badge?: string;
  children?: readonly GoodNavItem[];
  disabled?: boolean;
}

export interface GoodSidebarSection {
  id: string;
  heading?: string;
  items: readonly GoodNavItem[];
}

export interface GoodTopbarItem {
  id: string;
  label: string;
  icon?: GoodIconName;
  route?: string;
  children?: readonly GoodTopbarItem[];
  separatorBefore?: boolean;
}

export interface GoodUser {
  name: string;
  email?: string;
  initials?: string;
  avatarUrl?: string;
  badge?: string;
}

export interface GoodNotification {
  id: string;
  title: string;
  description?: string;
  time?: string;
  read?: boolean;
  route?: string;
}

export interface GoodMenuAction {
  id: string;
  label: string;
  icon?: GoodIconName;
  route?: string;
  action?: () => void;
  children?: readonly GoodMenuAction[];
  detail?: string;
  separatorBefore?: boolean;
  variant?: 'default' | 'sign-out';
}

export interface GoodSearchItem {
  id: string;
  label: string;
  description?: string;
  route: string;
}

export type GoodIconName =
  | 'dashboard' | 'account' | 'network' | 'home' | 'settings'
  | 'search' | 'bell' | 'menu' | 'close' | 'chevron-down'
  | 'chevron-right' | 'sun' | 'moon' | 'grid' | 'logout'
  | 'calendar' | 'question' | 'card' | 'book' | 'contact' | 'star' | 'message' | 'globe';

export function goodRouteActive(route: string | undefined, current: string): boolean {
  if (!route) return false;
  const normalized = route === '/' ? '/' : route.replace(/\/$/, '');
  return current === normalized || (normalized !== '/' && current.startsWith(`${normalized}/`));
}

export function goodItemContainsRoute(item: GoodNavItem, current: string): boolean {
  return goodRouteActive(item.route, current) || !!item.children?.some(child => goodItemContainsRoute(child, current));
}

export function goodTopbarItemContainsRoute(item: GoodTopbarItem, current: string): boolean {
  return goodRouteActive(item.route, current) || !!item.children?.some(child => goodTopbarItemContainsRoute(child, current));
}
