import { Router } from "express";
import { checkAuthentication } from "../middleware/checkAuthentication.middleware.js";
import {
  createReservation,
  getMyReservations,
} from "../controllers/reservations/reservation.controller.js";

const reservationRouter = Router();

reservationRouter.post(
  "/courses/:courseId",
  checkAuthentication,
  createReservation,
);

reservationRouter.get(
  "/me",
  checkAuthentication,
  getMyReservations,
);

export { reservationRouter };