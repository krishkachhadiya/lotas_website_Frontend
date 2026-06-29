export function buildTree(categories, parent = null) {
  return categories
    .filter((item) =>
      parent === null
        ? item.parent === null
        : String(item.parent) === String(parent)
    )
    .map((item) => ({
      ...item,
      children: buildTree(categories, item._id),
    }));
}

export function getCategoryPath(categories, categoryId) {
  const path = [];

  let current = categories.find(
    (item) =>
      String(item._id) === String(categoryId)
  );

  while (current) {
    path.unshift(current.title);

    current = categories.find(
      (item) =>
        String(item._id) === String(current.parent)
    );
  }

  return path.join(" > ");
}