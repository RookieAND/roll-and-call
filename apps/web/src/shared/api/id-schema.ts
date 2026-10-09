import { z } from "zod";

// Postgres uuid 열과 같은 기준(버전 비트를 따지지 않는다).
export const idSchema = z.guid();
