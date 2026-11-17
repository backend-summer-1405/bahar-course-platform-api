
import { processImageService } from "./process-image.service.js";

const uploadCourseImageService = async (
  file: Express.Multer.File,
) => {
  return processImageService(file, {
    directory: "courses",
    width: 1200,
    height: 800,
  });
};

export { uploadCourseImageService };
