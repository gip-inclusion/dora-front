export function getQuery(categoryId, subCategoryId, cityCode, cityLabel) {
  const parameters = {
    cat: categoryId,
    sub: subCategoryId,
    city: cityCode,
    cl: cityLabel,
  };
  const query = Object.entries(parameters)
    .filter(([_k, v]) => v != null)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");

  return query;
}
