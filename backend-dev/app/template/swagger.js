/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     tags:
 *     - : 'Auth'
 *     summary: API description
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              string: // replace with key name
 *                 type: string
 *                 description: string 
 *                 example: User1
 *              integer: // replace with key name
 *                 type: integer
 *                 description: Users phone no and its an optional field
 *                 example: 9090909090
 *              array: // replace with key name
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: user
 *     responses:
 *       '200':
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: array
 *                   example: User was registered successfully
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                string: // replace with key name
 *                   type: string
 *                   description: string 
 *                   example: User1
 *                integer: // replace with key name
 *                   type: integer
 *                   description: Users phone no and its an optional field
 *                   example: 9090909090
 *                array: // replace with key name
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: user
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
 *        '401':
 *          description: Unauthorised
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: array
 *                    example: Unauthorised
 * 
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