export function translatePattern(t, value) {
  if (value == null || value === "") return value;
  const key = `patterns.${value}`;
  const translated = t(key);
  return translated === key ? String(value).replace(/_/g, " ") : translated;
}
