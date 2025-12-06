import multer from "multer";

const storage = multer.memoryStorage()

export const uploadSongMiddleware = multer({
    storage: storage,
    limits:{
        fileSize: 1024* 1024*50
    }
}).fields([
    {name: "trackFile", maxCount:1},
    {name: "coverImage", maxCount:1},
    {name: "lrcFile", maxCount: 1}
])