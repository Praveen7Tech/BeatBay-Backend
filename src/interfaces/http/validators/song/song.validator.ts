import z from "zod";

export const UploadSongRequestSchema = z.object({
    title: z.string().min(1, "Title is mandatory"),
    description: z.string().min(5, "Description is mandatory"),
    genre: z.string().min(1, "Genre is required"),
    tags: z.string().min(1, "atleast 1 tag required"),
    songFilePath: z.string().min(1, "Audio file URL is required"),
    audioPublicId: z.string().min(1, "Audio Public ID is required"),
    coverImagePath: z.string().min(1, "Cover image URL is required"),
    coverImagePublicId: z.string().min(1, "Cover image Public ID is required"),
    lrcFilePath: z.string().min(1, "Lyrics file URL is required"),
    lyricsPublicId: z.string().min(1, "Lyrics Public ID is required"), 
    duration: z.number().positive("Duration must be positive"),
});

export const EditSongRequestSchema = z.object({
    title: z.string().min(1, "Title is mandatory").optional(),
    description: z.string().min(5, "Description is mandatory").optional(),
    genre: z.string().min(1, "Genre is required").optional(),
    tags: z.string().min(1, "atleast 1 tag required").optional(),
    songFilePath: z.string().min(1, "Audio file URL is required").optional(),
    audioPublicId: z.string().min(1, "Audio Public ID is required").optional(),
    coverImagePath: z.string().min(1, "Cover image URL is required").optional(),
    coverImagePublicId: z.string().min(1, "Cover image Public ID is required").optional(),
    lrcFilePath: z.string().min(1, "Lyrics file URL is required").optional(),
    lyricsPublicId: z.string().min(1, "Lyrics Public ID is required").optional(),
    duration: z.number().positive("Duration must be positive").optional(),
});