const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  app.get("/api/test/all", controller.allAccess);
  
  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);
  
  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );
  
  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};

/**
   * @swagger
   * /api/test/all:
   *   get:
   *     tags:
   *     - : 'User'
   *     summary: For public access
   *     description: For public access
   *     responses:
   *       '200':
   *         description: Content available for public.
   *         content:
   *           text/plain:
   *             schema:
   *               type: string
   *               example: Public Content.                 
   */

/**
   * @swagger
   * /api/test/user:
   *   get:
   *     security:
   *       - ApiKeyAuth: []
   *     tags:
   *     - : 'User'
   *     summary: Verifies the access token given and checks if the user is authenticated.
   *     description: Verifies the access token given and checks if the user is authenticated.
   *     responses:
   *       '200':
   *         description: The user is authenticaed.
   *         content:
   *           text/plain:
   *             schema:
   *               type: object
   *               properties:
   *               example: User Content.
   *       '401':
   *         description: The user is not authenticaed.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: array
   *                   example: Unauthorized!
   *       '403':
   *         description: The token is not provided.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: array
   *                   example: No token provided!
   *       '500':
   *         description: Internal Server Error!
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: array
   *                   example: Internal Server Error!
   * 
   */
  /**
   * @swagger
   * /api/test/mod:
   *   get:
   *     security:
   *       - ApiKeyAuth: []
   *     tags:
   *     - : 'User'
   *     summary: Checks if the user has moderator access
   *     description: Checks if the user has Moderator access
   *     responses:
   *       '200':
   *         description: The moderator is authenticaed.
   *         content:
   *           text/plain:
   *             schema:
   *               type: object
   *               properties:
   *               example: Moderator Content.
   *       '401':
   *         description: The Moderator is not authenticaed.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: array
   *                   example: Require Moderator Role!
   *       '403':
   *         description: Unauthorized! No moderator access
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: array
   *                   example: No token provided!
   *       '500':
   *         description: Internal Server Error!
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: array
   *                   example: Internal Server Error!
   *              
   */

  /**
   * @swagger
   * /api/test/admin:
   *   get:
   *     security:
   *       - ApiKeyAuth: []
   *     tags:
   *     - : 'User'
   *     summary: Checks if the user has admin access
   *     description: Checks if the user has admin access
   *     responses:
   *       '200':
   *         description: The Admin is authenticaed.
   *         content:
   *           text/plain:
   *             schema:
   *               type: object
   *               properties:
   *               example: Admin Content.
   *       '401':
   *         description: The Admin is not authenticaed.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: array
   *                   example: Require Admin Role!
   *       '403':
   *         description: Unauthorized! No Admin access
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: array
   *                   example: No token provided!
   *       '500':
   *         description: Internal Server Error!
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: array
   *                   example: Internal Server Error!
   */