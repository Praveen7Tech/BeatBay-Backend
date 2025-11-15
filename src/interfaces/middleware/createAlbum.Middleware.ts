import multer from "multer";
import path from "path";

const upLoadPath = path.join(__dirname, "../../../public/albums")

const storage = multer.diskStorage({
    destination:(req, res, cb)=>{
        cb(null, upLoadPath)
    },

    filename:(req, file, cb)=>{
        const name = Date.now()
        cb(null, `${name}-${path.extname(file.originalname)}`)
    }
})

export const CreateAlbumMiddleware = multer({storage})