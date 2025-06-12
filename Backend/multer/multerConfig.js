import multer from 'multer';
import path from 'path';

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

let fileFilter = (req, file, cb) => {
  let filetypes = /jpeg|jpg|png|gif/;
  let mimetype = filetypes.test(file.mimetype);
  let extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Разрешены только изображения (jpeg, jpg, png, gif)'));
};

let upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export { upload };