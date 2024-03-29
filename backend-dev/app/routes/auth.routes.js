const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);

};

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     tags:
 *     - : 'Auth'
 *     summary: Registers a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              username:
 *                 type: string
 *                 description: Username
 *                 example: Admin
 *              email:
 *                 type: string
 *                 description: users email
 *                 example: admin
 *              phoneno:
 *                 type: integer
 *                 description: Users phone no and its an optional field
 *                 example: 99999999999
 *              password:
 *                 type: string
 *                 description: Users password
 *                 example: 1234
 *              roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: admin
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: array
 *                   example: User was registered successfully
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

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     tags:
 *     - : 'Auth'
 *     summary: Returns userID, deviceIDs and access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              email:
 *                 type: string
 *                 description: Users email 
 *                 example: admin
 *              password:
 *                 type: string
 *                 description: Users password
 *                 example: 1234
 *     responses:
 *        '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                id:
 *                   type: string
 *                   description: Unique User ID
 *                   example: 65f80ebfc2e8c8b743272d6c
 *                username:
 *                   type: string
 *                   description: Username
 *                   example: Admin
 *                email:
 *                   type: string
 *                   description: users email
 *                   example: admin
 *                phoneno:
 *                  type: integer
 *                  description: Users phone no and its an optional field
 *                  example: 9999999999
 *                devices:
 *                  type: array
 *                  items:
 *                    type: string
 *                    example: "Array of deviceIDs"
 *                roles:
 *                  type: array
 *                  items:
 *                    type: string
 *                    example: user
 *                accessToken:
 *                  type: string
 *                  example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZjkyOTQ5MmY3ZTYxZGYwNGM4YzVjOCIsImlhdCI6MTcxMTExMzUwMSwiZXhwIjoxNzExMTk5OTAxfQ.xbP9xWGZnfhoBzjyD9fEG_yTsR8fUjygyGIPLB-4BrU
 *        '400':
 *           description: Bad Request
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: array
 *                     example: "Request Failed"
 *        '401':
 *          description: Unauthorised
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: array
 *                    example: Invalid Password
 *        '404':
 *          description: Not Found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: array
 *                    example: User not found
 *        '500':
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
