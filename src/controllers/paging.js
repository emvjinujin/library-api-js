export function getPaging(query) {
  const page = positiveInteger(query.page, 1);
  const limit = Math.min(50, positiveInteger(query.limit, 10));
  return { page, limit, skip: (page - 1) * limit };
}

function positiveInteger(value, fallback) {
  if (typeof value !== "string" || !/^\d+$/.test(value)) return fallback;
  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0 ? number : fallback;
}

export async function findPage(model, query, options) {
  const { page, limit, skip } = getPaging(query);
  const { where } = options;
  const [data, total] = await Promise.all([
    skip > 2147483647 ? [] : model.findMany({ ...options, skip, take: limit }),
    model.count({ where }),
  ]);
  const pages = Math.ceil(total / limit);
  return {
    data,
    meta: { page, limit, total, pages, hasNext: page < pages, hasPrev: page > 1 },
  };
}
