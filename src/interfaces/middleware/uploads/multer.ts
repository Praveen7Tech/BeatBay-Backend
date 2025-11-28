import multer from "multer";
import path from "path";

const uploadPath = path.join(__dirname, "../../../public/uploads")

const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, uploadPath)
    },

    filename:(req, file, cb)=> {
        const name = Date.now()
        cb(null, name+"-"+path.extname(file.originalname))
    }
})

export const upload = multer({storage})