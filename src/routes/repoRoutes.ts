import express from 'express';
import * as repoController from '../controllers/repoController';
import { isAuthenticated } from '../middleware/authentication';
import { validateRepo } from '../middleware/validation';

const router = express.Router();

/**
 * @swagger
 * /repos:
 *   post:
 *     summary: Create a new repository
 *     description: Create a new repository for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - url
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               url:
 *                 type: string
 *               language:
 *                 type: string
 *     responses:
 *       201:
 *         description: Repository successfully created
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid input
 */
router.post('/', isAuthenticated, validateRepo, repoController.createRepo);

/**
 * @swagger
 * /repos/{id}:
 *   get:
 *     summary: Get repository by ID
 *     description: Retrieve a repository's details by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Repository details successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 url:
 *                   type: string
 *                 language:
 *                   type: string
 *                 stars:
 *                   type: integer
 *                 forks:
 *                   type: integer
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *       404:
 *         description: Repository not found
 */
router.get('/:id', repoController.getRepo);

/**
 * @swagger
 * /repos/user/{userId}:
 *   get:
 *     summary: Get user repositories
 *     description: Retrieve all repositories for a specific user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of repositories
 *       404:
 *         description: User not found
 */
router.get('/user/:userId', repoController.getUserRepos);

/**
 * @swagger
 * /repos/{id}:
 *   put:
 *     summary: Update repository
 *     description: Update a repository's details
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               url:
 *                 type: string
 *               language:
 *                 type: string
 *     responses:
 *       200:
 *         description: Repository successfully updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Repository not found
 */
router.put('/:id', isAuthenticated, validateRepo, repoController.updateRepo);

/**
 * @swagger
 * /repos/{id}:
 *   delete:
 *     summary: Delete repository
 *     description: Delete a repository by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Repository successfully deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Repository not found
 */
router.delete('/:id', isAuthenticated, repoController.deleteRepo);

export default router;
