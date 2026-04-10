function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function mapKeys<T extends Record<string, any>, U extends Record<string, any>>(
  obj: T,
  convertFunc: (key: string) => string
): U {
  const result = {} as U;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = convertFunc(key);
      (result as Record<string, any>)[newKey] = obj[key];
    }
  }
  return result;
}

export { toSnakeCase, toCamelCase, mapKeys };
