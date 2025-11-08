
export const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: "strict" as const,
    path: "/",
    secure: false,
    maxAge: 7*24*60*60*1000,
}