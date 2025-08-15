import { Router } from "express";

import * as pollutionController from "../controller/pollution.controller.js";
import * as pollutionValidation from "../validation/pollution.validate.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.get('/cities', validate(pollutionValidation.getPollutionData), pollutionController.getPollutionData);

export default router;