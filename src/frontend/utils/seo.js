export const setSEO = ({
  title = "",
  description = "",
  image = "",
  type = "website",
  url = window.location.href, // Automatically defaults to current URL
}) => {
  // 1. Update Document Title
  if (title) document.title = title;

  // 2. Standard Meta Tags
  updateMeta("description", description, "name");

  // 3. Open Graph Tags (Facebook, LinkedIn, Discord)
  updateMeta("og:title", title, "property");
  updateMeta("og:description", description, "property");
  updateMeta("og:type", type, "property");
  updateMeta("og:url", url, "property");
  updateMeta("og:image", image, "property");

  // 4. Twitter Card Tags (X)
  updateMeta("twitter:card", "summary_large_image", "name");
  updateMeta("twitter:title", title, "name");
  updateMeta("twitter:description", description, "name");
  updateMeta("twitter:image", image, "name");

  // 5. Canonical Link Tag
  updateCanonical(url);
};

function updateMeta(key, content, attr) {
  let tag = document.querySelector(`meta[${attr}="${key}"]`);

  // If content is empty/falsy, remove the tag if it exists and exit
  if (!content) {
    if (tag) tag.remove();
    return;
  }

  // Create tag if it doesn't exist
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
}

function updateCanonical(url) {
  let link = document.querySelector("link[rel='canonical']");
  
  if (!url) {
    if (link) link.remove();
    return;
  }

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  
  link.setAttribute("href", url);
}