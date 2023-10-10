export const adminHandler = (req, res, next) => {
    if (req.user && req.user.role === "OWNER") {
      next();
    } else {
      res.status(401).json({ message: "Only Owner can perform this task" });
    }
  };