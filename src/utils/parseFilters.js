const parseType = (unknown) => {
  if (['work', 'home', 'personal'].includes(unknown)) return unknown;
};

const parseBoolean = (unknown) => {
  if (!['true', 'false'].includes(unknown)) return;
  return unknown === 'true' ? true : false;
};

export const parseFilters = (query) => {
  return {
    isFavourite: parseBoolean(query.isFavourite),
    type: parseType(query.contactType),
  };
};
