import express from "express";
const router = express.Router();
import {
  createForm,
  deleteForm,
  detailForm,
  listForm,
  updateForm,
} from "../../controller/EnquiryForm/formController.js";

router.get("/", listForm);
router.post("/", createForm);
router.get("/:id", detailForm);
router.put("/:id", updateForm);
router.delete("/:id", deleteForm);

export default router;
