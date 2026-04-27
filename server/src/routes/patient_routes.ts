import { Router } from "express";
import {
  getDoctors,
  bookAppointment,
  getMyAppointments,
  getMyNotifications,
  markNotificationRead,
  getMedicalHistory,
  getQueueStatus,
  cancelAppointment,
} from "../controllers/patient_controller";
import { authenticate, authorizeRole } from "../middlewares/auth_middleware";
import { UserRole } from "../types/system.types";

const router = Router();

router.use(authenticate);
router.use(authorizeRole(UserRole.PATIENT));

router.get("/doctors", getDoctors);
router.post("/appointments", bookAppointment);
router.get("/appointments", getMyAppointments);
router.delete("/appointments/:id", cancelAppointment);
router.get("/queue-status", getQueueStatus);
router.get("/notifications", getMyNotifications);
router.patch("/notifications/:id/read", markNotificationRead);
router.get("/medical-history", getMedicalHistory);

export default router;
