import { cache } from "react";

import { getProfile } from "@/shared/server";

export const loadMyProfile = cache(getProfile);
