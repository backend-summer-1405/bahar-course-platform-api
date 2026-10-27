import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma.js";
import { getPagination } from "../../utils/pagination.js";

const getCourses = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { page, limit, skip, take } = getPagination({
      page: request.query.page,
      limit: request.query.limit,
    });

    const search =
      typeof request.query.search === "string"
        ? request.query.search.trim()
        : "";

    const categoryIds =
      typeof request.query.categoryIds === "string"
        ? request.query.categoryIds.split(",").filter(Boolean)
        : [];

    const teacherId =
      typeof request.query.teacherId === "string"
        ? request.query.teacherId.trim()
        : "";
    const courseType =
      typeof request.query.courseType === "string"
        ? request.query.courseType
        : undefined;

    if (courseType !== undefined && !["free", "paid"].includes(courseType)) {
      return response.status(400).json({
        message: "courseType must be either free or paid",
      });
    }
    const minPrice =
      typeof request.query.minPrice === "string" &&
      request.query.minPrice.trim() !== ""
        ? Number(request.query.minPrice)
        : undefined;

    const maxPrice =
      typeof request.query.maxPrice === "string" &&
      request.query.maxPrice.trim() !== ""
        ? Number(request.query.maxPrice)
        : undefined;

    if (
      (minPrice !== undefined &&
        (!Number.isFinite(minPrice) || minPrice < 0)) ||
      (maxPrice !== undefined && (!Number.isFinite(maxPrice) || maxPrice < 0))
    ) {
      return response.status(400).json({
        message: "Prices must be valid non-negative numbers",
      });
    }

    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      return response.status(400).json({
        message: "minPrice cannot be greater than maxPrice",
      });
    }
    const status =
      typeof request.query.status === "string"
        ? request.query.status
        : undefined;

    if (status !== undefined && !["active", "inactive"].includes(status)) {
      return response.status(400).json({
        message: "status must be either active or inactive",
      });
    }
    const sortBy =
      typeof request.query.sortBy === "string"
        ? request.query.sortBy
        : "createdAt";

    const order =
      typeof request.query.order === "string" ? request.query.order : "desc";

   if (!["createdAt", "price", "rating"].includes(sortBy)) {
  return response.status(400).json({
    message: "sortBy must be createdAt, price or rating",
  });
}

    if (!["asc", "desc"].includes(order)) {
      return response.status(400).json({
        message: "order must be asc or desc",
      });
    }

    const where = {
      ...(search && {
        title: {
          contains: search,
          mode: "insensitive" as const,
        },
      }),
      ...(categoryIds.length > 0 && {
        categories: {
          some: {
            id: {
              in: categoryIds,
            },
          },
        },
      }),
      ...(teacherId && {
        teacherId,
      }),
      ...((minPrice !== undefined ||
        maxPrice !== undefined ||
        courseType !== undefined) && {
        price: {
          ...(minPrice !== undefined && { gte: minPrice }),
          ...(maxPrice !== undefined && { lte: maxPrice }),
          ...(courseType === "free" && { equals: 0 }),
          ...(courseType === "paid" && { gt: 0 }),
        },
      }),
      ...(status !== undefined && {
        isActive: status === "active",
      }),
    };

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take,
        include: {
          categories: true,
        },
        orderBy: {
          [sortBy]: order,
        },
      }),
      prisma.course.count({
        where,
      }),
    ]);

    return response.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      courses,
    });
  } catch (error) {
    return next(error);
  }
};

export { getCourses };
