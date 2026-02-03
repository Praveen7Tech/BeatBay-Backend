import z from "zod";

// Partial validation for updates
export const EditSongRequestSchema = z.object({
    uploadId: z.string().min(2, "upload id is missing"),
    title: z.string().min(1, "Title is mandatory").optional(),
    description: z.string().min(5, "Description must be at least 5 characters").optional(),
    genre: z.string().min(1, "Genre is required").optional(),
    tags: z.array(z.string().min(1)).optional(), 
    trackKey: z.string().min(1, "Audio file key is required").optional(),
    coverKey: z.string().min(1, "cover file key is required").optional(),
    lyricsKey: z.string().min(1, "lyrics file key is required").optional(),
    duration: z.number().positive("Duration must be positive").optional(),
}).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update"
});

export const UploadSongRequestSchema = z.object({
    uploadId: z.string().min(2, "upload id is missing"),
    title: z.string().min(1, "Title is mandatory"),
    description: z.string().min(5, "Description is mandatory"),
    genre: z.string().min(1, "Genre is required"),
    tags: z.string().min(1, "atleast 1 tag required"),
    trackKey: z.string().min(1, "Audio file key is required"),
    coverKey: z.string().min(1, "cover file key is required"),
    lyricsKey: z.string().min(1, "lyrics file key is required"),
    duration: z.number().positive("Duration must be positive"),
});
