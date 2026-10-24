
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma.js";
import { customError } from "../../utils/customError.js";
import { getPagination } from "../../utils/pagination.js";

const getUsers = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const {
      search: searchQuery,
      role: roleQuery,
      sortBy: sortByQuery,
      order: orderQuery,
    } = request.query;

    // Pagination
    const { page, limit, skip, take } = getPagination({
      page: request.query.page,
      limit: request.query.limit,
    });

    // Search validation
    if (searchQuery !== undefined && typeof searchQuery !== "string") {
      return next(customError("Search must be a string", 400));
    }

    const search = searchQuery?.trim();

    // Role validation
    const allowedRoles = ["USER", "TEACHER", "ADMIN", "STUDENT"];

    if (
      roleQuery !== undefined &&
      (typeof roleQuery !== "string" || !allowedRoles.includes(roleQuery))
    ) {
      return next(customError("Invalid role", 400));
    }

    // Sort validation
    const allowedSortFields = ["createdAt", "email"];
    const allowedOrders = ["asc", "desc"];

    if (
      sortByQuery !== undefined &&
      (typeof sortByQuery !== "string" ||
        !allowedSortFields.includes(sortByQuery))
    ) {
      return next(customError("Invalid sortBy value", 400));
    }

    if (
      orderQuery !== undefined &&
      (typeof orderQuery !== "string" || !allowedOrders.includes(orderQuery))
    ) {
      return next(customError("Invalid order value", 400));
    }

    const sortBy = sortByQuery ?? "createdAt";
    const order = orderQuery ?? "desc";

    // Search and Filter conditions
    const where = {
      ...(search
        ? {
            OR: [
              {
                email: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                profile: {
                  is: {
                    firstName: {
                      contains: search,
                      mode: "insensitive" as const,
                    },
                  },
                },
              },
              {
                profile: {
                  is: {
                    lastName: {
                      contains: search,
                      mode: "insensitive" as const,
                    },
                  },
                },
              },
            ],
          }
        : {}),
      ...(roleQuery
        ? {
            userRoles: {
              some: {
                role: roleQuery as
                  | "USER"
                  | "TEACHER"
                  | "ADMIN"
                  | "STUDENT",
              },
            },
          }
        : {}),
    };

    // Fetch users and count matching results
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        select: {
          id: true,
          email: true,
          emailVerifiedAt: true,
          createdAt: true,
          userRoles: {
            select: {
              role: true,
            },
          },
          profile: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          [sortBy]: order,
        },
      }),
      prisma.user.count({
        where,
      }),
    ]);

    const formattedUsers = users.map((user) => ({
      id: user.id,
      email: user.email,
      emailVerifiedAt: user.emailVerifiedAt,
      createdAt: user.createdAt,
      profile: user.profile,
      roles: user.userRoles.map((userRole) => userRole.role),
    }));

    return response.status(200).json({
      users: formattedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export { getUsers };
