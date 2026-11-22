
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma.js";
import { customError } from "../../utils/customError.js";

const getTeacherDetails = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const teacherId = request.params.teacherId;

    if (typeof teacherId !== "string") {
      return next(customError("Invalid teacher ID", 400));
    }

    const teacher = await prisma.user.findFirst({
      where: {
        id: teacherId,
        userRoles: {
          some: {
            role: "TEACHER",
          },
        },
      },
      select: {
        id: true,
        createdAt: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
            bio: true,
            telegram: true,
            linkedin: true,
            github: true,
            images: {
              select: {
                url: true,
              },
            },
          },
        },
        courses: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            price: true,
            image: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!teacher) {
      return next(customError("Teacher not found", 404));
    }

    return response.status(200).json({
      teacher: {
        id: teacher.id,
        firstName: teacher.profile?.firstName ?? null,
        lastName: teacher.profile?.lastName ?? null,
        bio: teacher.profile?.bio ?? null,
        telegram: teacher.profile?.telegram ?? null,
        linkedin: teacher.profile?.linkedin ?? null,
        github: teacher.profile?.github ?? null,
        images: teacher.profile?.images ?? [],
        coursesCount: teacher.courses.length,
        courses: teacher.courses,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export { getTeacherDetails };
