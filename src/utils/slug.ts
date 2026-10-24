
import { prisma } from "./prisma.js";

const generateSlug = (title: string): string => {
  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
};

const generateUniqueSlug = async (title: string): Promise<string> => {
  const baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 2;

  while (await prisma.course.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

export { generateSlug, generateUniqueSlug };
