import multer from "multer";
import fs from "fs";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads";
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const encodedFileName = encodeURIComponent(file.originalname);
    cb(null, Date.now() + "-" + encodedFileName);
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB limit, adjust as needed
});
