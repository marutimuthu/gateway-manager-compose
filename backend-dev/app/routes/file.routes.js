module.exports = app => {
    const file = require("../controllers/file.controller.js");
    var router = require("express").Router();
    const multer = require('multer');

    //Configuration for Multer
    const multerStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "uploads");
        },
        filename: (req, file, cb) => {
            // console.log(file)
            const ext = file.mimetype.split("/")[1];
            // cb(null, `admin-${file.fieldname}-${Date.now()}.${ext}`);
            // cb(null, `${file.originalname}.${ext}`);
            cb(null, `${file.originalname}`);
        },
    });

    // Multer Filter
    const multerFilter = (req, file, cb) => {
        if (file.mimetype.split("/")[1] === "pdf") {
            cb(null, true);
        } else {
            cb(new Error("Not a PDF File!!"), false);
        }
    };

    // Calling the "multer" Function
    // const upload = multer({ dest: 'uploads/' })

    //Calling the "multer" Function
    const upload = multer({
        storage: multerStorage,
        // fileFilter: multerFilter,
    });

    // Create a new File
    router.post("/", upload.single('file'), file.create);

    // Find user Files
    router.get("/:id", file.findByUserid);

    // Download file
    router.get('/download/:filename', file.download);

    // Retrieve all device
    // router.get("/", file.findAll);

    // // Delete a file with id
    // router.delete("/:id", file.delete);

    app.use('/api/file', router);
};


// POST: /api/file
/**
 * @swagger
 * /api/file:
 *   post:
 *     tags:
 *     - : 'Device File'
 *     summary: Post Device File
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: file
 *             format: binary
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
