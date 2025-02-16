import cloudinary from '../lib/cloudinary.js';
import Project from '../models/Project.js';

export const createProject = async (req, res) => {
  try {
    const { title, description, technologies, tags, githubLink, liveDemoLink } = req.body;
    let imageUrl = '';

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    const newProject = new Project({
      title,
      description,
      image: imageUrl,
      technologies: technologies ? JSON.parse(technologies) : undefined,
      tags: tags ? JSON.parse(tags) : undefined,
      githubLink,
      liveDemoLink,
    });

    await newProject.save();
    res.status(201).json({ message: 'Project created successfully', project: newProject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    if (projects.length === 0) {
      return res.status(404).json({ message: 'No projects found' });
    }
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { title, description, technologies, tags, githubLink, liveDemoLink } = req.body;
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (title) project.title = title;
    if (description) project.description = description;
    if (githubLink) project.githubLink = githubLink;
    if (liveDemoLink) project.liveDemoLink = liveDemoLink;
    if (technologies) project.technologies = JSON.parse(technologies);
    if (tags) project.tags = JSON.parse(tags);

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      project.image = result.secure_url;
    }

    await project.save();
    res.status(200).json({ message: 'Project updated successfully', project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await project.deleteOne();
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};