const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Check file type
function checkFileType(file, cb) {
    console.log('Multer checkFileType - File info:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        extension: path.extname(file.originalname).toLowerCase()
    });

    // Allowed extensions
    const filetypes = /jpeg|jpg|png|webp|avif|heic|heif/;

    // Check extension
    const extName = path.extname(file.originalname).toLowerCase();
    const isExtensionAllowed = filetypes.test(extName);

    // Check mime type (Allow if it's an image, generic stream, or if the extension is definitely known)
    const isMimeAllowed = (file.mimetype && file.mimetype.startsWith('image/')) ||
        file.mimetype === 'application/octet-stream';

    if (isMimeAllowed || isExtensionAllowed) {
        return cb(null, true);
    } else {
        console.error(`Multer rejected file: ${file.originalname} (Mime: ${file.mimetype})`);
        cb(new Error(`File type not supported. Please upload an image (JPG, PNG, WebP, AVIF). Current mime: ${file.mimetype}`));
    }
}

// Initial upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

module.exports = upload;
