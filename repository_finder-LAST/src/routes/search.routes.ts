import express from 'express';
import {
  getRepos,
  createRepo,
  updateRepo,
  deleteRepo,
  deleteRepoByMongoId,
} from '../controllers/repo.controller'; 

const router = express.Router();

router.get('/repos', getRepos); // Ruta para obtener repositorios
router.post('/repos', createRepo); // Ruta para crear un nuevo repositorio
router.put('/repos/:id', updateRepo); // Ruta para actualizar un repositorio existente
router.delete('/repos/:id', deleteRepo); // Ruta para eliminar un repositorio existente
router.delete('/repos/db/:_id', deleteRepoByMongoId); // Ruta para eliminar un repositorio con Id de mongo
export default router;