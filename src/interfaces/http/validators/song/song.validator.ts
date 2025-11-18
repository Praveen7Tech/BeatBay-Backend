import z from "zod";

export const UploadSongRequestSchema = z.object({
    title: z.string().min(2, "Title must have at least 2 characters"),
    genre: z.string().min(1, "Genre is required"),
    releaseDate: z.string().min(1, "Release date is required"), 

    description: z.string().min(5, "brief about your track"),
    tags: z.string().min(1, "atleast 1 tag required"),
    duration: z.string().min(1, "track duration required"),

    songFilePath: z.string().min(1, "song file must be needed"),
    coverImagePath:z.string().min(1, "cover image must be needed"),
    lrcFilePath:z.string().min(1, "lrc file must be needed")
})