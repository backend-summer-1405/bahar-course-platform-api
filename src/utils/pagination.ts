import { customError } from "./customError.js";

interface PaginationParams {
  page?: unknown;
  limit?: unknown;
}

interface PaginationResult {
  page: number;
  limit: number;
  skip: number;
  take: number;
}

const getPagination = ({
  page: pageQuery,
  limit: limitQuery,
}: PaginationParams): PaginationResult => {
  if (
    (pageQuery !== undefined &&
      (typeof pageQuery !== "string" ||
        !/^[1-9]\d*$/.test(pageQuery))) ||
    (limitQuery !== undefined &&
      (typeof limitQuery !== "string" ||
        !/^[1-9]\d*$/.test(limitQuery)))
  ) {
    throw customError("Page and limit must be positive integers", 400);
  }

  const page = pageQuery === undefined ? 1 : Number(pageQuery);
  const requestedLimit =
    limitQuery === undefined ? 10 : Number(limitQuery);

  if (
    !Number.isSafeInteger(page) ||
    !Number.isSafeInteger(requestedLimit)
  ) {
    throw customError("Page and limit must be valid integers", 400);
  }

  if (requestedLimit > 100) {
    throw customError("Limit cannot exceed 100", 400);
  }

  const limit = requestedLimit;
  const skip = (page - 1) * limit;

  if (!Number.isSafeInteger(skip)) {
    throw customError("Page value is too large", 400);
  }

  return {
    page,
    limit,
    skip,
    take: limit,
  };
};

export { getPagination };