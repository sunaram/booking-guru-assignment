import { type Request, type Response, type NextFunction, type RequestHandler } from "express";

/*
* @description - middleware to handle async errors
* @param requestHandler - request handler
* @returns - request handler
*/
const asyncHandler = (requestHandler: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };