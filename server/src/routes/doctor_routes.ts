import { Router } from "express";
import {
  getDoctorQueue,
  getQueueStrategy,
  updateQueueStrategy,
  updateDoctorStatus,
  callNextPatient,
  completeConsultation,
  getWorkloadSummary,
  skipPatient,
  flagCriticalCase,
  getPatientHistory,
} from "../controllers/doctor_controller";
import { authenticate, authorizeRole } from "../middlewares/auth_middleware";
import { UserRole } from "../types/system.types";

const router = Router();

router.use(authenticate);
router.use(authorizeRole(UserRole.DOCTOR));

router.get("/queue", getDoctorQueue);
router.get("/strategy", getQueueStrategy); // Added
router.patch("/strategy", updateQueueStrategy); // Added
router.patch("/status", updateDoctorStatus);
router.post("/call-next", callNextPatient);
router.post("/skip/:id", skipPatient);
router.post("/flag/:id", flagCriticalCase);
router.post("/complete/:id", completeConsultation);
router.get("/summary", getWorkloadSummary);
router.get("/patient-history/:patientId", getPatientHistory);

export default router;
