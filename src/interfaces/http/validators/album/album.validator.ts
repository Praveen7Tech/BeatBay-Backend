import z from "zod";

const stringToArray = (val: unknown): unknown=>{
    if(typeof val === "string"){
        return [val]
    }
    return val
}

export const CreateAlbumRequestSchema = z.object({
    title: z.string().min(2, "Title must have at least 2 characters"),
    description: z.string().min(5, "brief about your track"),
    coverImageUrl:z.string().min(1, "cover image must be needed"),
    songs: z.preprocess(
        stringToArray,
        z.array(z.string().min(1,"Song ID can't be empty!"))
    )
})

export const EditAlbumRequestSchema = z.object({
    title: z.string().min(2, "Title must have at least 2 characters").optional(),
    description: z.string().min(5, "brief about your track").optional(),
    coverImageUrl:z.string().min(1, "cover image must be needed").optional(),
    songs: z.preprocess(
        stringToArray,
        z.array(z.string().min(1,"Song ID can't be empty!"))
    ).optional()
})