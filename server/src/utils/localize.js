// Localizes Swahili fields in place. When lang === 'sw', any field that has a
// matching "<field>Sw" value replaces the base field, and the Sw field is removed.
// Works recursively for nested objects and arrays (Prisma includes).
function localize(node, lang) {
  if (lang !== 'sw') return node;
  if (Array.isArray(node)) return node.map((n) => localize(n, lang));
  if (node && typeof node === 'object') {
    for (const key of Object.keys(node)) {
      node[key] = localize(node[key], lang);
    }
    for (const key of Object.keys(node)) {
      if (key.endsWith('Sw')) {
        const base = key.slice(0, -2);
        if (node[base] !== undefined && node[key] != null) {
          node[base] = node[key];
        }
        delete node[key];
      }
    }
  }
  return node;
}

module.exports = { localize };