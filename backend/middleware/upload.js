const multer = require("multer");
const path = require("path");

//Step-up Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

//File Filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /\.(pdf|csv|jpg|jpeg|png)$/;
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, CSV, JPG, JPEG, and PNG files are allowed!'));
  }
};


//create the multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

module.exports = upload;
