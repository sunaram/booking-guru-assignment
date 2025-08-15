/**
 * @swagger
 * components:
 *   schemas:
 *     CityPollution:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: London
 *         country:
 *           type: string
 *           example: United Kingdom
 *         pollution:
 *           type: number
 *           example: 55
 *         description:
 *           type: string
 *           example: Capital city of England
 *     CountryPollutionDataResult:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 10
 *         total:
 *           type: integer
 *           example: 100
 *         cities:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CityPollution'
 */
