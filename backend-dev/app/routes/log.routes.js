module.exports = (app) => {
  const log = require("../controllers/log.controller.js");

  var router = require("express").Router();

  // Create Log
  router.post("/", log.create);

  // Retrieve all gateways from user device array
  router.get("/:deviceID", log.findByID);

  // Retrieve throughput
  router.get("/stats/:deviceID", log.getstats);

  app.use("/api/log", router);
};

// POST: /api/log
/**
 * @swagger
 * /api/log:
 *   post:
 *     tags:
 *     - : 'Device Logs'
 *     summary: Post Device Log
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              deviceID:
 *                 type: string
 *                 example: 6605593f6939f3447baeee4e
 *              wifi_rssi:
 *                 type: integer
 *                 example: -50
 *              lte_rssi:
 *                 type: integer
 *                 example: -20
 *              lat:
 *                 type: string
 *                 example: new
 *              long:
 *                 type: string
 *                 example: test
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                message:
 *                   type: string
 *                   description: string
 *                   example: Received
 *       '400':
 *          description: Bad Request
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: array
 *                    example: deviceID can not be empty
 *       '500':
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: array
 *                    example: Internal Server Error
 */

// GET: /api/log/{deviceID}
/**
 * @swagger
 * /api/log/{deviceID}:
 *   get:
 *     tags:
 *     - : 'Device Logs'
 *     summary: Get device Logs
 *     parameters:
 *      - in: path
 *        name: deviceID
 *        schema:
 *          type: string
 *        required: true
 *        description: deviceID
 *        example: 6605593f6939f3447baeee4e
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *          example: 1
 *        description: The number of page
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *          example: 10
 *        description: The numbers of items to return
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     example: "Array of objects"
 *       '400':
 *          description: Bad Request
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  data:
 *                    type: array
 *                    example: deviceID can not be empty
 *       '404':
 *          description: Not Found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: array
 *                    example: "Logs Not Found"
 *       '500':
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: array
 *                    example: Internal Server Error
 */

// GET: /api/log/stats/{deviceID}
/**
 * @swagger
 * /api/log/stats/{deviceID}:
 *   get:
 *     tags:
 *     - : 'Device Logs'
 *     summary: Get Log Stats
 *     parameters:
 *      - in: path
 *        name: deviceID
 *        schema:
 *          type: string
 *        required: true
 *        description: deviceID
 *        example: 6605593f6939f3447baeee4e
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                data:
 *                   type: object
 *                   properties:
 *                      throughput_1h:
 *                        type: integer
 *                        example: 5
 *                      throughput_24h:
 *                        type: integer
 *                        example: 10
 *                      throughput_7d:
 *                        type: integer
 *                        example: 10
 *       '400':
 *          description: Bad Request
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  data:
 *                    type: array
 *                    example: deviceID can not be empty
 *       '500':
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: array
 *                    example: Internal Server Error
 */
