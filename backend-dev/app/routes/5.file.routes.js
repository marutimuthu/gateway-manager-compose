module.exports = (app) => {
  var router = require("express").Router();
  const file = require("../controllers/file.controller.js");
  const { upload } = require("../middlewares");

  // Create a new File
  router.post("/:deviceID", upload.single("file"), file.create);

  // Find Device Files
  router.get("/all", file.getAllFiles);

  // Download file
  router.get("/download/:fileID", file.download);

  // Download file
  // router.get("/download/config/:fileID", file.download);
  
  // Download file
  // router.get("/download/firmware/:fileID", file.download);

  // // Rename file
  // router.put("/:deviceID", file.getOneFile);

  // Delete file - Pending
  router.delete("/:fileID", file.delete);

  app.use("/api/file", router);
};

// POST: /api/file/{deviceID}
/**
 * @swagger
 * /api/file/{deviceID}:
 *   post:
 *     tags:
 *     - : 'Device Files'
 *     summary: "Upload file [ frontend / device --> server ]"
 *     parameters:
 *      - in: path
 *        name: deviceID
 *        schema:
 *          type: string
 *        required: true
 *        description: deviceID
 *        example: 6605593f6939f3447baeee4e
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                  type: file
 *                  format: file
 *
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
 *                   example: File Uploaded
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

// GET: /api/file/all
/**
 * @swagger
 * /api/file/all:
 *   get:
 *     tags:
 *     - : 'Device Files'
 *     summary: "Get all files details [ frontend --> server ]"
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

// GET: /api/file/download/{fileID}
/**
 * @swagger
 * /api/file/download/{fileID}:
 *   get:
 *     tags:
 *     - : 'Device Files'
 *     summary: "Download file [ frontend / device --> server ]"
 *     parameters:
 *      - in: path
 *        name: fileID
 *        schema:
 *          type: string
 *        required: true
 *        description: fileID
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

// DELETE: /api/file/{fileID}
/**
 * @swagger
 * /api/file/{fileID}:
 *   delete:
 *     tags:
 *     - : 'Device Files'
 *     summary: "Delete file [ frontend --> server ]"
 *     parameters:
 *      - in: path
 *        name: fileID
 *        schema:
 *          type: string
 *        required: true
 *        description: fileID
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
