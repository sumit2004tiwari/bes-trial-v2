type MenuNode = {
  id: number | string;
  name?: string;
  path?: string;
  parentPath?: string;
  isSeprateParentPath?: boolean;
  isActive?: boolean;
  isLink?: boolean;
  haveChildren?: string;
  subChildren?: MenuNode[];
};

type PathInfo = {
  node: MenuNode;
  fullPath: string;
};

/**
 * Resolves the full URL path of a menu node, given the path inherited from its
 * parent. A node marked `isSeprateParentPath` resolves against its own
 * `parentPath` instead of the inherited one.
 */
export function resolveMenuItemPath(node: MenuNode, inheritedParentPath = ""): string {
  if (!node) return "";
  const parentPath = node?.isSeprateParentPath ? node.parentPath || "" : inheritedParentPath;
  const cleanParent = parentPath.endsWith("/") ? parentPath.slice(0, -1) : parentPath;
  const child = (node.path || "").startsWith("/") ? node.path : "/" + (node.path || "");
  return cleanParent + child;
}

/**
 * Whether the current `pathname` lives inside `node`'s subtree (including an
 * exact match on the node itself). Walks the full sub-tree recursively, so a
 * node is considered a match when any of its resolved descendants equals the
 * pathname (or is a prefix of it, for deeper nesting).
 */
function isWithinSubtree(node: MenuNode, pathname: string, inheritedParentPath = ""): boolean {
  if (!node?.isActive) return false;
  const fullPath = resolveMenuItemPath(node, inheritedParentPath);

  // The node itself (or a segment under it) matches.
  if (
    fullPath !== "" &&
    (fullPath === pathname || pathname.startsWith(fullPath + "/"))
  ) {
    return true;
  }

  // Recurse into children, feeding the resolved path down the tree.
  return (node.subChildren || []).some((child) =>
    isWithinSubtree(
      child,
      pathname,
      node.isSeprateParentPath ? node.parentPath || "" : fullPath
    )
  );
}

/**
 * Returns the top-level menu item whose subtree most specifically contains the
 * current `pathname`. Among matching top-level items, the one with the longest
 * (deepest / most specific) resolved path wins — e.g. on
 * `/about_bes/contact_us` the "Contact" item (`/about_bes/contact_us`) beats
 * "BES India" (`/about_bes`), even though both contain that path.
 */
export function findActiveTopLevelItem(
  items: MenuNode[],
  pathname: string
): PathInfo | null {
  let best: PathInfo | null = null;

  (items || []).forEach((item) => {
    if (!item?.isActive || !isWithinSubtree(item, pathname)) return;

    // Home is special: it must be an exact match, never treated as a container.
    if (item.path === "/") {
      if (!best && pathname === "/") best = { node: item, fullPath: "/" };
      return;
    }

    if (!best || resolveMenuItemPath(item).length > best.fullPath.length) {
      best = { node: item, fullPath: resolveMenuItemPath(item) };
    }
  });

  return best;
}
