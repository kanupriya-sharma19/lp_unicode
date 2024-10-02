import multer from "multer";

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const image = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).fields([
  { name: "Profile_Image", maxCount: 1 },
  { name: "Resume", maxCount: 1 },
]);
export { image };
