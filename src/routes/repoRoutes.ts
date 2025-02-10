import express from 'express';
import * as repoController from '../controllers/repoController';

const router = express.Router();

router.post('/', repoController.createRepo);
router.get('/:id', repoController.getRepo);
router.get('/user/:userId', repoController.getUserRepos);

export default router;
