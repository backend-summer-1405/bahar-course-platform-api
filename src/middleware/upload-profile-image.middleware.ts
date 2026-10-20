
import multer from "multer";
import { customError } from "../utils/customError.js";

const uploadProfileImageMiddleware = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024, 
    files: 1,
  },

  fileFilter: (_request, file, callback) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return callback(
        customError("Only JPEG, PNG, and WebP images are allowed", 400),
      );
    }

    callback(null, true);
  },
});

export { uploadProfileImageMiddleware };
