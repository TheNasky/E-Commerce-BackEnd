import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const multerStorage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../public/images"));
   },
   filename: function (req, file, cb) {
      const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniquesuffix + ".jpeg");
   },
});

const multerFilter = (req, file, cb) => {
   if (file.mimetype.startsWith("image")) {
      cb(null, true);
   } else {
      cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Unsupported file format"));
   }
};

const customMulter = multer({
   storage: multerStorage,
   fileFilter: multerFilter,
   limit: { fieldSize: 2000000 },
});

export const multerUploadImage = (req, res, next) => {
   customMulter.array("images", 10)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
         return res
            .status(400)
            .json({ success: false, message: "Unsupported file format", payload: {} });
      } else if (err) {
         return res.status(500).json({ message: "Internal Server Error" });
      }
      next();
   });
};
