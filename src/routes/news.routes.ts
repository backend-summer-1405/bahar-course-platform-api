
import { Router } from "express";
import {
  checkAuthentication,
  optionalAuthentication,
} from "../middleware/checkAuthentication.middleware.js";
import { checkAuthorization } from "../middleware/checkAuthorization.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createNews } from "../controllers/news/create-news.controller.js";
import { updateNews } from "../controllers/news/update-news.controller.js";
import { deleteNews } from "../controllers/news/delete-news.controller.js";
import { getNews } from "../controllers/news/get-news.controller.js";
import { getNewsDetails } from "../controllers/news/get-news-details.controller.js";
import { createNewsValidator, updateNewsValidator } from "../validator/news.validator.js";
import { ratingValidator } from "../validator/rating.validator.js";
import { rateNews } from "../controllers/rating/rate-news.controller.js";
import { reactToNews } from "../controllers/reactions/reaction-news.controllers.js";
import { deleteNewsComment } from "../controllers/news/comment/delete-comment.controller.js";
import { updateNewsComment } from "../controllers/news/comment/update-comment.controller.js";
import { commentValidator } from "../validator/comment.validator.js";
import { getNewsComments } from "../controllers/news/comment/get-comments.controller.js";
import { createNewsComment } from "../controllers/news/comment/create-comment.controllor.js";



const newsRouter = Router();

// Get all news
newsRouter.get(
  "/",
  optionalAuthentication,
  getNews,
);

// Get news details
newsRouter.get(
  "/:newsId",
  optionalAuthentication,
  getNewsDetails,
);

// Create news
newsRouter.post(
  "/",
  checkAuthentication,
  checkAuthorization("ADMIN"),
  createNewsValidator,
  validate,
  createNews,
);

// Update news
newsRouter.patch(
  "/:newsId",
  checkAuthentication,
  checkAuthorization("ADMIN"),
  updateNewsValidator,
  validate,
  updateNews,
);

// Delete news
newsRouter.delete(
  "/:newsId",
  checkAuthentication,
  checkAuthorization("ADMIN"),
  deleteNews,
);
// Rate news
newsRouter.put(
  "/:newsId/rating",
  checkAuthentication,
  ratingValidator,
  validate,
  rateNews,
);

// Reaction news
newsRouter.put(
  "/:newsId/reaction",
  checkAuthentication,
  reactToNews,
);

// comments route
newsRouter.post(
  "/:newsId/comments",
  checkAuthentication,
  commentValidator,
  validate,
  createNewsComment,
);

newsRouter.get(
  "/:newsId/comments",
  optionalAuthentication,
  getNewsComments,
);

newsRouter.patch(
  "/:newsId/comments/:commentId",
  checkAuthentication,
  commentValidator,
  validate,
  updateNewsComment,
);

newsRouter.delete(
  "/:newsId/comments/:commentId",
  checkAuthentication,
  deleteNewsComment,
);
export { newsRouter };
