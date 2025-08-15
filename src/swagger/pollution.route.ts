/**
 * @swagger
 * tags:
 *   name: Pollution
 *   description: Operations related to pollution data
 */

/**
 * @swagger
 * /cities:
 *   get:
 *     summary: Retrieve pollution data for cities in a specific country
 *     tags: [Pollution]
 *     parameters:
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         required: true
 *         description: The country to fetch pollution data for.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of items per page.
 *     responses:
 *       200:
 *         description: A paginated list of cities with their pollution data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CountryPollutionDataResult'
 *       400:
 *         description: Bad Request. Invalid or missing parameters.
 *       500:
 *         description: Internal Server Error.
 */