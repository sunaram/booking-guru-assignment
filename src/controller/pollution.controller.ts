import { type Request, type Response } from "express";
import * as pollutionService from "../service/pollution.service.js";
import { asyncHandler } from "../middleware/async-handler.js";


export const getPollutionData = asyncHandler(async (req: Request, res: Response) => {
    const country  = req.query.country as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const myData = await pollutionService.getPollutionData(country, page, limit);
    res.status(200).json(myData);
})