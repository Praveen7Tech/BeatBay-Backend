import multer from "multer";
import path from "path";
import { file } from "zod";

const uploadPath = path.join(__dirname, "../../../public/songs")

const storage = multer.diskStorage({
    destination:(req,res,cb)=>{
        cb(null, uploadPath)
    },

    filename:(req, file, cb)=>{
        const name = Date.now()
        cb(null, `${name}-${path.extname(file.originalname)}`)
    }
})

export const uploadSongMiddleware = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 50 
    },
    fileFilter: (req, file, cb) => {
        cb(null, true);
    }
}).fields([ 
    { name: 'trackFile', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
    { name: 'lrcFile', maxCount: 1 },
]);