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
    // Extract all fields from request body
    const {
      title,
      description,
      url,
      thumbnail,
      duration,
      views,
      category,
      channelTitle
    } = req.body;

    // Validate required fields
    if (!title || !description || !url) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, description, and URL are required.' 
      });
    }

    // Validate duration format (HH:MM:SS)
    const durationRegex = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;
    if (duration && !durationRegex.test(duration)) {
      return res.status(400).json({
        success: false,
        message: 'Duration must be in HH:MM:SS format'
      });
    }

    // Function to extract YouTube ID from URL (including Shorts)
    const extractYouTubeId = (url) => {
      const youtubeRegex = /(?:https?:\/\/(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|\S*?[?&]v=|(?:v|e(?:mbed)?)\/)([a-zA-Z0-9_-]{11})|\S*?youtu\.be\/([a-zA-Z0-9_-]{11})|(?:youtube\.com\/shorts\/([a-zA-Z0-9_-]{11}))))/;
      const match = url.match(youtubeRegex);
      return match ? match[1] || match[2] || match[3] : null;
    };

    // Extract YouTube ID from URL
    const youtubeId = extractYouTubeId(url);
    if (!youtubeId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid YouTube URL provided.' 
      });
    }

    // Check if video with youtubeId already exists
    const existingVideo = await Video.findOne({ youtubeId });
    if (existingVideo) {
      return res.status(409).json({
        success: false,
        message: 'A video with this YouTube URL already exists.'
      });
    }

    // Create video with all fields
    const video = await Video.create({
      title,
      description,
      url,
      thumbnail,
      duration: duration || '00:00:00', // Default duration if not provided
      views: views || 0,
      category: category || 'Other',
      channelTitle,
      youtubeId
    });

    res.status(201).json({ success: true, data: video });

  } catch (error) {
    console.error('Error creating video:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while creating the video: ' + error.message 
    });
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
