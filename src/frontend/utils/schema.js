export const setSchema = (schemaData) => {
  const existingSchema = document.getElementById(
    "json-ld-schema"
  );

  if (existingSchema) {
    existingSchema.remove();
  }

  const script = document.createElement("script");

  script.type = "application/ld+json";
  script.id = "json-ld-schema";

  script.innerHTML = JSON.stringify(schemaData);

  document.head.appendChild(script);
};