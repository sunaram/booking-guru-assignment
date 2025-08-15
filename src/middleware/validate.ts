import { type ZodType } from "zod";
import { type Request, type Response, type NextFunction } from "express"

type SchemaMap = {
    [key: string]: ZodType<any>;
}

export const validate = (schema: SchemaMap) => {
    const keys = Object.keys(schema);
    return (req: Request, res: Response, next: NextFunction) => {
        for(const key of keys) {
            const { error } = (schema as any)[key].safeParse((req as any)[key]);
            if (error) {
                return res.status(400).json({ error: error.message });
            }
        }        
        next();
    }
}