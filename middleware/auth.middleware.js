import JWT from "jsonwebtoken"


// authHandler middleware
export const authHandler = (req, res, next) => {
    try {
     let token = req.headers.authorization;
     if (token) {
         token = token.split(" ")[1];
         let user = JWT.verify(token, process.env.JWT_SECRET);
         req.userId = user.id;
         next();
     } else {
         res.status(401).json({ message: "Unauthorized User" });
     }
    } catch (error) {
     res.status(500).json({ message: "Internal server error", error });
    }
 };
 