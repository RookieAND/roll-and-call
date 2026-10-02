export { USERNAME_MAX_LENGTH } from "@/entities/profile";
export const BIO_MAX_LENGTH = 200;

export const PROFILE_FIELD = { username: "username", bio: "bio" } as const;
export type ProfileField = (typeof PROFILE_FIELD)[keyof typeof PROFILE_FIELD];
