import type { PaginationQuery, PaginationResult } from "../types/pagination.type.js";

export const createPaginationResult = <T>(
  items: T[],
  totalItems: number,
  query: PaginationQuery,
): PaginationResult<T> => {
  const totalPages = Math.ceil(totalItems / query.limit);

  return {
    items,
    meta: {
      page: query.page,
      limit: query.limit,
      totalItems,
      totalPages,
      hasNextPage: query.page < totalPages,
      hasPreviousPage: query.page > 1,
    },
  };
};

export const getPaginationOffset = (query: PaginationQuery) => {
  return (query.page - 1) * query.limit;
};
