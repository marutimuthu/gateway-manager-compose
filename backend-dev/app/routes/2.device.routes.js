module.exports = (app) => {
  const device = require("../controllers/device.controller.js");

  var router = require("express").Router();

  // Create Device
  router.post("/", device.register); 
  
  // Get one device
  router.get("/:deviceId", device.findDevice);
  
  // Update Device 
  router.put("/:deviceId", device.update);
  
  // Delete Device
  router.delete("/:deviceId", device.delete); 
  
  // Get all user devices
  router.get("/all/:userId", device.findByOIDarray); 
  
  // Update
  router.post("/cmd/:deviceId", device.mqttCommand); 
  
  // router.post("/ota", device.ota);

  app.use("/api/device", router);
};

// POST: /api/device
/**
 * @swagger
 * /api/device:
 *   post:
 *     tags:
 *     - : 'Device'
 *     summary: "Register new device [ device --> server ]"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              email:
 *                 type: string
 *                 example: admin
 *              password:
 *                 type: string
 *                 example: 1234
 *              data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Swagger Gateway
 *                     mac_id:
 *                       type: string
 *                       example: fa:33:sf:am:no:9f
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                message:
 *                   type: string
 *                   description: string 
 *                   example: Device Registered
 *                data:
 *                    type: object
 *                    properties:
 *                     deviceId:
 *                       type: string
 *                       description: string 
 *                       example: 66052968f2a436a810b67341
 *       '400':
 *          description: Bad Request
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: array
 *                    example: "Request Failed"
 *       '401':
 *         description: Unauthorised
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: array
 *                   example: Invalid Password
 *       '500':
 *          description: Internal Server Error!
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: array
 *                    example: Internal Server Error!
 */

// GET: /api/device/{deviceId}
/**
 * @swagger
 * /api/device/{deviceId}:
 *   get:
 *     tags:
 *     - : 'Device'
 *     summary: "Get device details [ frontend / device --> server ]"
 *     parameters:
 *      - in: path
 *        name: deviceId
 *        schema:
 *          type: string
 *        required: true
 *        description: deviceId
 *        example: 65f82016747bd453a99e5117
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
 *                     example: "Device Properties"
 *       '404':
 *          description: Not Found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: array
 *                    example: "Device Not Found"
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

// PUT: /api/device/{deviceId}
/**
 * @swagger
 * /api/device/{deviceId}:
 *   put:
 *     tags:
 *     - : 'Device'
 *     summary: "Update device properties [ device / frontend --> server ]"
 *     parameters:
 *      - in: path
 *        name: deviceId
 *        schema:
 *          type: string
 *        required: true
 *        description: deviceId
 *        example: 65f82016747bd453a99e5117
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              data:
 *                  type: object
 *                  properties:
 *                    name:
 *                      type: string
 *                      description: Property 1
 *                      example: Swagger Gateway Updated
 *                    firmware_version:
 *                      type: integer
 *                      description: Property 2
 *                      example: 3
 *                    gateway_type:
 *                      type: integer
 *                      description: Property 3
 *                      example: 1
 *                    http_refresh_interval_mins:
 *                      type: integer
 *                      description: Property 4
 *                      example: 2
 *     responses:
 *       '200':
 *         description: ok
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
 *                    example: "Request Failed"
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

// DELETE: /api/device/{deviceId}
/**
 * @swagger
 * /api/device/{deviceId}:
 *   delete:
 *     tags:
 *     - : 'Device'
 *     parameters:
 *      - in: path
 *        name: deviceId
 *        schema:
 *          type: string
 *        required: true
 *        description: deviceId
 *        example: 66052968f2a436a810b67341
 *     summary: "Delete device [ frontend --> server ]"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              email:
 *                 type: string
 *                 description: users email which they used for sigining up
 *                 example: admin
 *              password:
 *                 type: string
 *                 description: The password which they used while signing up
 *                 example: 1234
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
 *                   example: Device Deleted
 *       '400':
 *          description: Bad Request
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: array
 *                    example: "Request Failed"
 *       '401':
 *         description: Unauthorised
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: array
 *                   example: Invalid Password
 *       '404':
 *          description: Not Found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: array
 *                    example: "Device not found"
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

// GET: /api/device/all/{userId}
/**
 * @swagger
 * /api/device/all/{userId}:
 *   get:
 *     tags:
 *     - : 'Device'
 *     summary: "Get all user devices [ frontend --> server ]"
 *     parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: string
 *        required: true
 *        description: userId
 *        example: 660516916462250eeba926e0
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
 *                      
 *       '404':
 *          description: Not Found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: array
 *                    example: "Invalid id"
 *       '500':
 *          description: Internal Server Error!
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: array
 *                    example: Internal Server Error
 */

// POST: /api/device/cmd/{deviceId}
/**
 * @swagger
 * /api/device/cmd/{deviceId}:
 *   post:
 *     tags:
 *     - : 'Device Command'
 *     summary: "Publish MQTT Command to device - HTTP to MQTT bridge [ frontend --> server --> device ]"
 *     parameters:
 *      - in: path
 *        name: deviceId
 *        schema:
 *          type: string
 *        required: true
 *        description: deviceId
 *        example: 65f82016747bd453a99e5117
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              action:
 *                type: string
 *                example: network
 *              data:
 *                  type: object
 *                  properties:
 *                    wifi_ssid:
 *                      type: string
 *                      example: wifi_ssid
 *                    wifi_password:
 *                      type: integer
 *                      example: 32342342
 *                    network_mode:
 *                      type: integer
 *                      example: 1
 *     responses:
 *       '200':
 *         description: ok
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                message:
 *                   type: string
 *                   description: string 
 *                   example: Command Received
 *       '400':
 *          description: Bad Request
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: array
 *                    example: "Broker not connected"
 */
