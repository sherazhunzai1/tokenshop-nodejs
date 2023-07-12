require("dotenv").config();
const multer = require('multer');
const baseUrl = require("../config/baseUrl");
const uploads = (req, res, next) => {
    var imageName = null;
    // Configure storage destination and filename
    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, `${baseUrl+process.env.PROFILE_PIC_PATH}`);
        },
        filename: function(req, file, cb) {
            imageName = Date.now() + file.originalname;
            cb(null, imageName);
        }
    });

    const multi_upload = multer({
        storage,
        // limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
        fileFilter: (req, file, cb) => {
            // console.log(file, 'INNER');
            if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
                cb(null, true);
            } else {
                cb(null, false);
                const err = new Error('Only image formats allowed!')
                err.name = 'ExtensionError'
                return cb(err);
            }
        },
    }).single('image');
    multi_upload(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            res.status(500).send({ error: { message: `Multer uploading error: ${err.message}` } }).end();
            return;
        } else if (err) {
            // An unknown error occurred when uploading.
            if (err.name == 'ExtensionError') {
                res.status(413).send({ error: { message: err.message } }).end();
            } else {
                res.status(500).send({ error: { message: `unknown uploading error: ${err.message}` } }).end();
            }


        }

        // Everything went fine.
        // show file `req.files`
        // show body `req.body`
        // res.status(200).end('Your files uploaded.');
        req.image = imageName;
        next();
    })


}


// Create and export multer instance
module.exports = uploads;