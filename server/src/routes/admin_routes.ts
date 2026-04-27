import { Router } from "express";
import {
  addDoctor,
  getAllDoctors,
  getAllPatients,
  getSchedulingConflicts,
  getSystemStats,
  removeDoctor,
  resolveConflict,
  toggleDoctorStatus,
} from "../controllers/admin_controller";
import { authenticate, authorizeRole } from "../middlewares/auth_middleware";
import { UserRole } from "../types/system.types";

const router = Router();

router.use(authenticate);
router.use(authorizeRole(UserRole.ADMIN));

router.get("/stats", getSystemStats);
router.get("/doctors", getAllDoctors);
router.post("/doctors", addDoctor);
router.delete("/doctors/:id", removeDoctor);
router.patch("/doctors/:id/toggle-status", toggleDoctorStatus);
router.get("/patients", getAllPatients);
router.get("/conflicts", getSchedulingConflicts);
router.post("/conflicts/:id/resolve", resolveConflict);

export default router;
