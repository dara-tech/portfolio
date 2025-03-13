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
    // Validate request body for required fields
    const { title, description, url } = req.body;
    if (!title || !description || !url) {
      return res.status(400).json({ success: false, message: 'Title, description, and URL are required.' });
    }

    // Function to extract YouTube ID from URL (including Shorts)
    const extractYouTubeId = (url) => {
      const youtubeRegex = /(?:https?:\/\/(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|\S*?[?&]v=|(?:v|e(?:mbed)?)\/)([a-zA-Z0-9_-]{11})|\S*?youtu\.be\/([a-zA-Z0-9_-]{11})|(?:youtube\.com\/shorts\/([a-zA-Z0-9_-]{11}))))/;
      const match = url.match(youtubeRegex);
      return match ? match[1] || match[2] || match[3] : null;
    };

    // Log URL for debugging
    console.log('Received URL:', url);

    // Extract YouTube ID from URL
    const youtubeId = extractYouTubeId(url);
    if (!youtubeId) {
      return res.status(400).json({ success: false, message: 'Invalid YouTube URL provided.' });
    }

    // Check if the YouTube ID exists already in the database
    const existingVideo = await Video.findOne({ youtubeId });
    if (existingVideo) {
      return res.status(409).json({
        success: false,
        message: 'A video with this YouTube URL already exists.'
      });
    }

    // Create video entry in the database
    const video = await Video.create({
      title,
      description,
      url,
      youtubeId
    });

    res.status(201).json({ success: true, data: video });
  } catch (error) {
    console.error('Error creating video:', error);
    res.status(500).json({ success: false, message: 'An error occurred while creating the video: ' + error.message });
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
