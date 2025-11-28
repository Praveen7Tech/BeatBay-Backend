import multer from "multer";
import path from "path";

const uploadPath = path.join(__dirname, "../../../public/playList")

const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, uploadPath)
    },

    filename:(req, file, cb)=> {
        const name = Date.now()
        cb(null, name+"-"+path.extname(file.originalname))
    }
})

export const PlayList = multer({storage})