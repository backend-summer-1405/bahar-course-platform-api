import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma.js";
import { customError } from "../../utils/customError.js";

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name } = req.body;

    const existingCategory = await prisma.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      return next(customError("Category already exists", 409));
    }

    const category = await prisma.category.create({
      data: { name },
    });

    return res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return res.status(200).json({
      message: "Categories retrieved successfully",
      categories,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categoryId = req.params.categoryId;

    if (typeof categoryId !== "string") {
      return next(customError("Invalid category ID", 400));
    }
    const { name } = req.body;

    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      return next(customError("Category not found", 404));
    }

    const duplicateCategory = await prisma.category.findUnique({
      where: { name },
    });

    if (duplicateCategory && duplicateCategory.id !== categoryId) {
      return next(customError("Category name already exists", 409));
    }

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: { name },
    });

    return res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};
