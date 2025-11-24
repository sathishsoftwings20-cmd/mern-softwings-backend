import express from "express";
const router = express.Router();
import {
  register,
  login,
  checkName,
  userList,
  userDelete,
  logout,
} from "../../controller/User/userController.js";

router.post("/register", register);
router.post("/login", login);
router.post("/check-name", checkName);
router.get("/userList", userList);
router.delete("/user/:id", userDelete);
router.post("/logout", logout);
export default router;
