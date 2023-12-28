import { Request, Response } from 'express';
import SearchModel, { IRepo } from '../models/search.models';
import dotenv from 'dotenv';

dotenv.config();

const apiKey: string | undefined = process.env.GITHUB_API_KEY;

if (!apiKey) {
  console.error('No se encontró la clave de API de GitHub en el archivo .env');
  process.exit(1);
}

// Obtener repositorio

export const getRepos = async (req: Request, res: Response) => {
  const search = req.params.users;

  try {
  
    const existingSearch = await SearchModel.find();
    

    if (existingSearch) {

      return res.status(200).json({
        message: 'Resultados obtenidos de la base de datos',
        repo: existingSearch,
      });
    }

      return res.status(500).json({ error: 'Error al obtener los repos' });

  }
  catch(error){
   return res.status(500).json({ error: 'Error de servidor' });
   
  }
  
};

// Crear un nuevo repositorio
export const createRepo = async (req: Request, res: Response) => {
  try {
    const { id, owner, name, description, stargazers_count, url, html_url } = req.body || {};

    if (!id) {
      return res.status(400).json({ error: 'El campo "id" es obligatorio' });
    }

    const newRepo: IRepo = {
      id,
      owner: {
        avatar_url: owner?.avatar_url,
        login: owner?.login,
      },
      name,
      description: description || null,
      stargazers_count: stargazers_count,
      url,
      html_url,
    };

    const search = new SearchModel({
      query: 'custom_query',
      results: [newRepo],
    });

    await search.save();

    return res.status(201).json({
      message: 'Repositorio creado exitosamente',
      repo: newRepo,
    });
  } catch (error) {
    console.error('Error al crear el repositorio:', error);
    return res.status(500).json({ error: 'Error al crear el repositorio' });
  }
};

// Actualizar un repositorio existente
export const updateRepo = async (req: Request, res: Response) => {
  const repoId = req.params.id;
  const updatedRepoData: Partial<IRepo> = req.body;

  try {
    const search = await SearchModel.findOne({ 'results.id': repoId });

    if (!search) {
      return res.status(404).json({ error: 'Repositorio no encontrado' });
    }

    const updatedResults = search.results.map((repo: IRepo) => {
  
      if (repo.id.toString() === repoId) {
        return { ...repo, ...updatedRepoData };
      }
      return repo;
    });

    search.results = updatedResults;
    await search.save();

    return res.status(200).json({
      message: 'Repositorio actualizado exitosamente',
      repo: search.results.find((repo: IRepo) => repo.id.toString() === repoId),
    });
  } catch (error) {
    console.error('Error al actualizar el repositorio:', error);
    return res.status(500).json({ error: 'Error al actualizar el repositorio' });
  }
};

// Eliminar un repositorio existente
export const deleteRepo = async (req: Request, res: Response) => {
  const repoId = req.params.id;

  try {
    const search = await SearchModel.findOne({ 'results.id': repoId });

    if (!search) {
      return res.status(404).json({ error: 'Repositorio no encontrado' });
    }

    search.results = search.results.filter((repo: IRepo) => repo.id.toString() !== repoId);
    await search.save();

    return res.status(200).json({ message: 'Repositorio eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el repositorio:', error);
    return res.status(500).json({ error: 'Error al eliminar el repositorio' });
  }
};

export const deleteRepoByMongoId = async (req: Request, res: Response) => {
  const repoId = req.params._id;

  try {
    const deletedRepo = await SearchModel.findByIdAndDelete(repoId);

    if (!deletedRepo) {
      return res.status(404).json({ error: 'Repositorio no encontradou' });
    }

    return res.status(200).json({ message: 'Repositorio eliminado exitosamentes', deletedRepo });
  } catch (error) {
    console.error('Error al eliminar el repositorio:', error);
    return res.status(500).json({ error: 'Error al eliminar el repositorios' });
  }
};

