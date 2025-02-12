import cloudinary from '../lib/cloudinary.js';
import Project from '../models/Project.js';

// Helper function to normalize a field to an array
const normalizeToArray = (field) => {
  if (!field) {
    return [];
  }
  // If the field is already an array, return it directly
  if (Array.isArray(field)) {
    return field;
  }
  // If it's a string, split it by comma and trim each item
  if (typeof field === 'string') {
    return field.split(',').map(item => item.trim());
  }
  // Otherwise, return an empty array
  return [];
};

// Create a new project (with optional image)
export const createProject = async (req, res) => {
  try {
    const { title, description, technologies, tags, githubLink, liveDemoLink } = req.body;
    let imageUrl = '';

    // If an image file is provided, upload it to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    // Normalize fields that could be arrays or comma-separated strings
    const techArray = normalizeToArray(technologies);
    const tagsArray = normalizeToArray(tags);

    // Create the new project
    const newProject = new Project({
      title,
      description,
      image: imageUrl, // This will be an empty string if no image was provided
      technologies: techArray,
      tags: tagsArray,
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

// Get all projects
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
    const { id } = req.params; // The project ID from the URL
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an existing project by ID
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params; // The project ID from the URL
    const { title, description, technologies, tags, githubLink, liveDemoLink } = req.body;

    // Find the project by ID
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Update title and description if provided
    if (title) project.title = title;
    if (description) project.description = description;
    if (githubLink) project.githubLink = githubLink;
    if (liveDemoLink) project.liveDemoLink = liveDemoLink;

    // Normalize and update technologies and tags if provided
    if (technologies !== undefined) {
      project.technologies = normalizeToArray(technologies);
    }
    if (tags !== undefined) {
      project.tags = normalizeToArray(tags);
    }

    // If a new image is provided, upload it to Cloudinary and update the image field
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

// Delete a project by ID
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params; // The project ID from the URL

    // Find the project by ID
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete the project
    await project.deleteOne();
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
