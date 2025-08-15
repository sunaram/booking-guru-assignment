import { z } from "zod";

export const getPollutionData = { 
    query: z.object({ 
        country: z.string(),
        page: z.string().optional(),
        limit: z.string().optional(),
    }),
};