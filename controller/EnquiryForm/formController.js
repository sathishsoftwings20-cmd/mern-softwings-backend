import formModel from "../../Models/Form/formModel.js";

// Get all forms
export const listForm = async (req, res) => {
  try {
    const forms = await formModel.find();
    return res
      .status(200)
      .json({ success: true, message: "Forms fetched", data: forms });
  } catch (error) {
    console.error("listForm error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch forms" });
  }
};

// Create a new form

export const createForm = async (req, res) => {
  try {
    // expect req.body.date to be ISO or convertible to Date
    const payload = {
      ...req.body,
      smsSent: false, // explicit but schema default will handle it
    };

    const newForm = await formModel.create(payload);
    return res
      .status(201)
      .json({ success: true, message: "Form created", data: newForm });
  } catch (error) {
    console.error("createForm error:", error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Validation failed",
          errors: error.errors,
        });
    }
    return res
      .status(400)
      .json({ success: false, message: "Failed to create form" });
  }
};

// Detail a form
export const detailForm = async (req, res) => {
  try {
    const detail = await formModel.findById(req.params.id);
    if (!detail) {
      return res
        .status(404)
        .json({ success: false, message: "Form not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Form fetched", data: detail });
  } catch (err) {
    console.error("detailForm error:", err);
    return res
      .status(400)
      .json({ success: false, message: "Failed to view form" });
  }
};

// Update a form
export const updateForm = async (req, res) => {
  try {
    const updated = await formModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, // optional: run schema validators on update
    });
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Form not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Form updated", data: updated });
  } catch (err) {
    console.error("updateForm error:", err);
    return res
      .status(400)
      .json({ success: false, message: "Failed to update form" });
  }
};

// Delete Form
export const deleteForm = async (req, res) => {
  try {
    const deleted = await formModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Form not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Form deleted successfully" });
  } catch (err) {
    console.error("deleteForm error:", err);
    return res
      .status(400)
      .json({ success: false, message: "Failed to delete form" });
  }
};
