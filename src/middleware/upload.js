const multer = require('multer');
const path = require('path');

const baseUrl = process.env.DEVELOPMENT_BASE_URL || './';

// Profile picture upload
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(baseUrl, process.env.PROFILE_PIC_PATH || '/public/images/users'));
  },
  filename: (req, file, cb) => {
    const name = Date.now() + file.originalname;
    cb(null, name);
  },
});

const profileUpload = (req, res, next) => {
  const upload = multer({
    storage: profileStorage,
    fileFilter: (req, file, cb) => {
      const allowed = ['image/png', 'image/jpg', 'image/jpeg'];
      if (allowed.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only image formats allowed!'));
      }
    },
  }).single('image');

  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ error: { message: `Multer uploading error: ${err.message}` } });
    }
    if (err) {
      return res.status(413).json({ error: { message: err.message } });
    }
    req.image = req.file?.filename || null;
    next();
  });
};

// Cover picture upload
const coverStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(baseUrl, '/public/assets/coverPic/'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const coverUploadMiddleware = multer({
  storage: coverStorage,
  limits: { fileSize: 1024 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extOk = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = filetypes.test(file.mimetype);
    if (mimeOk && extOk) {
      cb(null, true);
    } else {
      cb({ code: 400, message: 'Please upload a file!' });
    }
  },
}).single('file');

const coverUpload = (req, res, next) => {
  coverUploadMiddleware(req, res, (err) => {
    if (err) {
      return next(err);
    }
    next();
  });
};

// Video upload
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(baseUrl, process.env.NFT_VIDEO_PATH || '/public/videos/nfts'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const videoUpload = (req, res, next) => {
  const upload = multer({
    storage: videoStorage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('video/')) {
        cb(null, true);
      } else {
        cb(new Error('Only video format allowed!'));
      }
    },
  }).single('video');

  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ error: { message: `Multer uploading error: ${err.message}` } });
    }
    if (err) {
      return res.status(413).json({ error: { message: err.message } });
    }
    req.video = req.file?.filename || null;
    next();
  });
};

// Form data parser (no files)
const formData = multer({ storage: multer.memoryStorage() });

module.exports = {
  profileUpload,
  coverUpload,
  videoUpload,
  formData,
};
