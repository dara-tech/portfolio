import RoadMap from '../models/RoadMap.js';

// Create a new roadmap
export const createRoadMap = async (req, res) => {
  try {
    const roadMap = new RoadMap(req.body);
    await roadMap.save();
    res.status(201).json(roadMap);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all roadmaps
export const getRoadMaps = async (req, res) => {
  try {
    const roadMaps = await RoadMap.find();
    res.status(200).json(roadMaps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single roadmap by ID
export const getRoadMapById = async (req, res) => {
  try {
    const roadMap = await RoadMap.findById(req.params.id);
    if (!roadMap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }
    // Increment views
    roadMap.views += 1;
    await roadMap.save();
    res.status(200).json(roadMap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a roadmap
export const updateRoadMap = async (req, res) => {
  try {
    const roadMap = await RoadMap.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!roadMap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }
    res.status(200).json(roadMap);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a roadmap
export const deleteRoadMap = async (req, res) => {
  try {
    const roadMap = await RoadMap.findByIdAndDelete(req.params.id);
    if (!roadMap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }
    res.status(200).json({ message: 'Roadmap deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
