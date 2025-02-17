import { Request, Response } from 'express';
import * as repoService from '../services/repoService';

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
export const createRepo = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const repo = await repoService.createRepo({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json(repo);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message || 'Failed to create repository' });
    } else {
      res.status(500).json({ error: 'Failed to create repository' });
    }
  }
};

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
 *       404:
 *         description: Repository not found
 *       400:
 *         description: Invalid repository ID
 */
export const getRepo = async (req: Request, res: Response) => {
  try {
    const repoId = parseInt(req.params.id);
    if (isNaN(repoId)) {
      return res.status(400).json({ error: 'Invalid repository ID' });
    }

    const repo = await repoService.getRepoById(repoId);
    if (!repo) {
      return res.status(404).json({ error: 'Repository not found' });
    }
    res.json(repo);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message || 'Failed to get repository' });
    } else {
      res.status(500).json({ error: 'Failed to get repository' });
    }
  }
};

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
 *       400:
 *         description: Invalid user ID
 */
export const getUserRepos = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const repos = await repoService.getUserRepos(userId);
    res.json(repos);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message || 'Failed to get user repositories' });
    } else {
      res.status(500).json({ error: 'Failed to get user repositories' });
    }
  }
};

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
 *               stars:
 *                 type: integer
 *               forks:
 *                 type: integer
 *               language:
 *                 type: string
 *     responses:
 *       200:
 *         description: Repository updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not repository owner
 *       404:
 *         description: Repository not found
 */
export const updateRepo = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const repoId = parseInt(req.params.id);
    if (isNaN(repoId)) {
      return res.status(400).json({ error: 'Invalid repository ID' });
    }

    // Check if the repository exists and belongs to the user
    const existingRepo = await repoService.getRepoById(repoId);
    if (!existingRepo) {
      return res.status(404).json({ error: 'Repository not found' });
    }
    if (existingRepo.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this repository' });
    }

    const repo = await repoService.updateRepo(repoId, req.body);
    res.json(repo);
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      res.status(404).json({ error: 'Repository not found' });
    } else {
      res.status(500).json({ error: 'Failed to update repository' });
    }
  }
};

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
 *       403:
 *         description: Forbidden - Not repository owner
 *       404:
 *         description: Repository not found
 */
export const deleteRepo = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const repoId = parseInt(req.params.id);
    if (isNaN(repoId)) {
      return res.status(400).json({ error: 'Invalid repository ID' });
    }

    // Check if the repository exists and belongs to the user
    const existingRepo = await repoService.getRepoById(repoId);
    if (!existingRepo) {
      return res.status(404).json({ error: 'Repository not found' });
    }
    if (existingRepo.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this repository' });
    }

    await repoService.deleteRepo(repoId);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message || 'Failed to delete repository' });
    } else {
      res.status(500).json({ error: 'Failed to delete repository' });
    }
  }
};
