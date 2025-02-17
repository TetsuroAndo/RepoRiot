import { Request, Response } from 'express';
import * as repoService from '../services/repoService';

export const createRepo = async (req: Request, res: Response) => {
  try {
    const repo = await repoService.createRepo({
      ...req.body,
      userId: req.body.userId // In production, this should come from authenticated user session
    });
    res.status(201).json(repo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create repository' });
  }
};

export const getRepo = async (req: Request, res: Response) => {
  try {
    const repoId = parseInt(req.params.id);
    const repo = await repoService.getRepoById(repoId);
    if (!repo) {
      return res.status(404).json({ error: 'Repository not found' });
    }
    res.json(repo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get repository' });
  }
};

export const getUserRepos = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const repos = await repoService.getUserRepos(userId);
    res.json(repos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user repositories' });
  }
};

/**
 * @swagger
 * /repos/{id}:
 *   put:
 *     summary: Update repository
 *     description: Update a repository's details
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
 *       404:
 *         description: Repository not found
 */
export const updateRepo = async (req: Request, res: Response) => {
  try {
    const repoId = parseInt(req.params.id);
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
