import express from 'express';
import * as repoController from '../controllers/repoController';

const router = express.Router();

router.post('/', repoController.createRepo);
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
router.get('/user/:userId', repoController.getUserRepos);
router.put('/:id', repoController.updateRepo);

export default router;
