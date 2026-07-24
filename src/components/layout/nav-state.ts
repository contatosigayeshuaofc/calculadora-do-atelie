import { navItems } from "./nav-items";

export function getActiveNavHref(pathname: string | null) {
  const currentPath = pathname ?? "/painel";
  const matchingItems = navItems.filter((item) => {
    if (item.href === "/painel") {
      return currentPath === item.href;
    }

    return currentPath === item.href || currentPath.startsWith(`${item.href}/`);
  });

  return matchingItems.sort((a, b) => b.href.length - a.href.length)[0]?.href;
}
