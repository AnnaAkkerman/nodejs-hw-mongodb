const parseNumber = (unknown, defaultNumber) => {
  if (typeof unknown !== 'string') return defaultNumber;
  const parseNumber = parseInt(unknown);

  if (Number.isNaN(parseNumber)) return defaultNumber;
  return parseNumber;
};

export const parsePaginationParams = (query) => {
  const { page, perPage } = query;

  return {
    page: parseNumber(page, 1),
    perPage: parseNumber(perPage, 10),
  };
};
