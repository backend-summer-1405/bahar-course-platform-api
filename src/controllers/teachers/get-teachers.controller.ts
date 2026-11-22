
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma.js";
import { getPagination } from "../../utils/pagination.js";

const getTeachers = async (
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

    const where = {
      userRoles: {
        some: {
          role: "TEACHER" as const,
        },
      },
      ...(search && {
        profile: {
          is: {
            OR: [
              {
                firstName: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                lastName: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            ],
          },
        },
      }),
    };

    const [teachers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        select: {
          id: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
              bio: true,
              images: {
                select: {
                  url: true,
                },
              },
            },
          },
          _count: {
            select: {
              courses: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.user.count({ where }),
    ]);

    return response.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      teachers: teachers.map((teacher) => ({
        id: teacher.id,
        firstName: teacher.profile?.firstName ?? null,
        lastName: teacher.profile?.lastName ?? null,
        bio: teacher.profile?.bio ?? null,
        images: teacher.profile?.images ?? [],
        coursesCount: teacher._count.courses,
      })),
    });
  } catch (error) {
    return next(error);
  }
};

export { getTeachers };
