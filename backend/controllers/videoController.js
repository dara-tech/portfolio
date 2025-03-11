import Video from '../models/Video.js';

export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: videos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }
    res.status(200).json({ success: true, data: video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createVideo = async (req, res) => {
  try {
    // Extract YouTube ID from URL if present
    let youtubeId = null;
    if (req.body.url) {
      const urlParams = new URL(req.body.url).searchParams;
      youtubeId = urlParams.get('v');
    }

    const video = await Video.create({
      ...req.body,
      youtubeId
    });

    res.status(201).json({ success: true, data: video });
  } catch (error) {
    // Handle duplicate youtubeId error specifically
    if (error.code === 11000 && error.keyPattern?.youtubeId) {
      return res.status(400).json({ 
        success: false, 
        message: 'A video with this YouTube URL already exists'
      });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }
    res.status(200).json({ success: true, data: video });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }
    await video.deleteOne();
    res.status(200).json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const incrementViewCount = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id, 
      { $inc: { views: 1 } }, 
      { new: true }
    );
    res.status(200).json({ success: true, data: video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const searchVideos = async (req, res) => {
  try {
    const { query } = req.query;
    const videos = await Video.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });
    
    res.status(200).json({ success: true, data: videos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
