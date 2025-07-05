import multer from 'multer'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/') // set your upload directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true)
    } else {
        cb(new Error('Only PDF files are allowed!'), false)
    }
}

const limits = {
    fileSize: 10 * 1024 * 1024 // 10 MB limit for PDF files
}

const upload = multer({ storage, fileFilter, limits })

export default upload