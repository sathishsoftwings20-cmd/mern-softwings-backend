// controller/User/userController.js
import userModel from "../../Models/User/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ================= REGISTER ==================
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check Email Exists
    const existing = await userModel.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Check if this is the FIRST USER → Make them SUPERADMIN
    const isFirstUser = (await userModel.countDocuments()) === 0;

    const hashedpass = await bcrypt.hash(password, 10);

    const created = await userModel.create({
      name,
      email,
      password: hashedpass,
      role: isFirstUser ? "superadmin" : role || "user",
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        _id: created._id,
        name: created.name,
        email: created.email,
        role: created.role,
      },
    });
  } catch (err) {
    console.error("register error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create user" });
  }
};

// ================= LOGIN ==================
export const login = async (req, res) => {
  try {
    const { name, password } = req.body;

    const user = await userModel.findOne({ name });

    if (!user) return res.json({ success: false, msg: "User Not Found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ success: false, msg: "Password Incorrect" });

    // Include role inside token
    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role },
      "mySecretKey",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      msg: "Login Successful",
      token,
      role: user.role,
    });
  } catch (err) {
    res.json({ success: false, msg: "Error", error: err });
  }
};

// ================= CHECK NAME ==================
export const checkName = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await userModel.findOne({ name });
    return res.json({ exists: !!user });
  } catch (error) {
    res.json({ success: false, msg: "Error", error });
  }
};

// ================= USER LIST ==================
export const userList = async (req, res) => {
  try {
    const user = await userModel.find();
    return res.status(200).json({
      success: true,
      message: "Users fetched",
      data: user,
    });
  } catch (error) {
    console.error("UserList error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Users",
    });
  }
};

// ================= DELETE USER ==================
export const userDelete = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);

    if (!user)
      return res.json({ success: false, msg: "User does not exist" });

    // Prevent deleting last superadmin
    if (user.role === "superadmin") {
      const count = await userModel.countDocuments({ role: "superadmin" });

      if (count === 1) {
        return res.json({
          success: false,
          msg: "You cannot delete the LAST SuperAdmin",
        });
      }
    }

    await userModel.findByIdAndDelete(req.params.id);

    res.json({ success: true, msg: "User deleted successfully" });
  } catch (err) {
    res.json({ success: false, msg: "Error", error: err });
  }
};

// ================= LOGOUT ==================
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ success: true, msg: "Logged out successfully" });
  } catch (err) {
    res.json({ success: false, msg: "Error", error: err });
  }
};
