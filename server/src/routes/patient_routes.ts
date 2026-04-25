import { Router } from "express";
import {
  getDoctors,
  bookAppointment,
  getMyAppointments,
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

export default router;
