export const setSEO = ({
  title = "",
  description = "",
  image = "",
  type = "website",
}) => {
  // Title
  document.title = title;

  // Meta Description
  updateMeta("description", description, "name");

  // Open Graph
  updateMeta("og:title", title, "property");
  updateMeta("og:description", description, "property");
  updateMeta("og:type", type, "property");

  if (image) {
    updateMeta("og:image", image, "property");
  }
};

function updateMeta(key, content, attr) {
  let tag = document.querySelector(
    `meta[${attr}="${key}"]`
  );

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content || "");
}