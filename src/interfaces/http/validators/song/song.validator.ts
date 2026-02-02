import z from "zod";

// export const UploadSongRequestSchema = z.object({
//     title: z.string().min(1, "Title is mandatory"),
//     description: z.string().min(5, "Description is mandatory"),
//     genre: z.string().min(1, "Genre is required"),
//     tags: z.string().min(1, "atleast 1 tag required"),
//     songFilePath: z.string().min(1, "Audio file URL is required"),
//     audioPublicId: z.string().min(1, "Audio Public ID is required"),
//     coverImagePath: z.string().min(1, "Cover image URL is required"),
//     coverImagePublicId: z.string().min(1, "Cover image Public ID is required"),
//     lrcFilePath: z.string().min(1, "Lyrics file URL is required"),
//     lyricsPublicId: z.string().min(1, "Lyrics Public ID is required"), 
//     duration: z.number().positive("Duration must be positive"),
// });

// Partial validation for updates
export const EditSongRequestSchema = z.object({
    title: z.string().min(1, "Title is mandatory").optional(),
    description: z.string().min(5, "Description must be at least 5 characters").optional(),
    genre: z.string().min(1, "Genre is required").optional(),
    tags: z.array(z.string().min(1)).optional(), 
    songFilePath: z.string().optional(),
    audioPublicId: z.string().optional(),
    coverImagePath: z.string().optional(),
    coverImagePublicId: z.string().optional(),
    lrcFilePath: z.string().optional(),
    lyricsPublicId: z.string().optional(),
    duration: z.number().positive("Duration must be positive").optional(),
}).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update"
});

export const UploadSongRequestSchema = z.object({
    title: z.string().min(1, "Title is mandatory"),
    description: z.string().min(5, "Description is mandatory"),
    genre: z.string().min(1, "Genre is required"),
    tags: z.string().min(1, "atleast 1 tag required"),
    trackKey: z.string().min(1, "Audio file URL is required"),
    coverKey: z.string().min(1, "Audio Public ID is required"),
    lyricsKey: z.string().min(1, "Cover image URL is required"),
    duration: z.number().positive("Duration must be positive"),
});
