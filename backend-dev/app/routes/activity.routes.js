module.exports = (app) => {
  const activity = require("../controllers/activity.controller.js");

  var router = require("express").Router();
  
  // Create Activity
  router.post("/", activity.create);
  
  // Retrieve all gateways from user device array
  router.get("/:deviceID", activity.findByID);
  
  // Retrieve throughput
  router.get("/stats/:deviceID", activity.getstats);

  app.use("/api/activity", router);
};

// POST: /api/activity
/**
 * @swagger
 * /api/activity:
 *   post:
 *     tags:
 *     - : 'Device Activity'
 *     summary: Post Device Activity
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
 *              activity:
 *                 type: string
 *                 example: Testinngg
 *              old_value:
 *                 type: string
 *                 example: old
 *              new_value:
 *                 type: string
 *                 example: new
 *              type:
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

// GET: /api/activity/{deviceID}
/**
 * @swagger
 * /api/activity/{deviceID}:
 *   get:
 *     tags:
 *     - : 'Device Activity'
 *     summary: Get device Activities
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
 *                    example: "Activity Not Found"
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

// GET: /api/activity/stats/{deviceID}
/**
 * @swagger
 * /api/activity/stats/{deviceID}:
 *   get:
 *     tags:
 *     - : 'Device Activity'
 *     summary: Get Activities Stats
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
 *                      activity_past_24h:
 *                        type: integer
 *                        example: 5
 *                      activity_past_7d:
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
 *       '404':
 *          description: Not Found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: array
 *                    example: "Activity Not Found"
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
