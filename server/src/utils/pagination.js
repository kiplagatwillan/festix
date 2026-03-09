/**
 * @desc    Professional pagination helper for Prisma
 * @param   {number} page - Current page number (starts at 1)
 * @param   {number} limit - Items per page
 * @returns {Object} { skip, take }
 */
export const getPagination = (page = 1, limit = 10) => {
  const take = limit > 100 ? 100 : limit; // Safety cap: max 100 items per request
  const skip = (page - 1) * take;

  return {
    skip: skip < 0 ? 0 : skip,
    take: take,
  };
};

/**
 * @desc    Helper to format the paginated response metadata
 */
export const getPagingData = (data, page, limit, totalCount) => {
  const currentPage = page ? +page : 1;
  const totalPages = Math.ceil(totalCount / limit);

  return {
    items: data,
    meta: {
      totalItems: totalCount,
      totalPages: totalPages,
      currentPage: currentPage,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    },
  };
};
