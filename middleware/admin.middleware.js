export const adminHandler = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      res.status(401).json({ message: "Only admin can perform this task" });
    }
  };