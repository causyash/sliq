const Meeting = require('../models/Meeting');
const crypto = require('crypto');

exports.createMeeting = async (req, res) => {
  try {
    const { title, description, date, time, project, workspace } = req.body;
    
    // Generate a unique room ID for Jitsi
    const shortId = crypto.randomUUID().substring(0, 8);
    const roomId = `sliq-${shortId}-${Date.now()}`;

    const newMeeting = new Meeting({
      title,
      description,
      date,
      time,
      roomId,
      organizer: req.user._id,
      project: project || undefined,
      workspace: workspace || undefined
    });

    const savedMeeting = await newMeeting.save();
    
    // Populate the organizer before sending response
    await savedMeeting.populate('organizer', 'name email');
    if (savedMeeting.project) await savedMeeting.populate('project', 'name');
    if (savedMeeting.workspace) await savedMeeting.populate('workspace', 'name');

    res.status(201).json(savedMeeting);
  } catch (error) {
    console.error('Create Meeting Error:', error);
    res.status(500).json({ message: 'Server error creating meeting' });
  }
};

exports.getMeetings = async (req, res) => {
  try {
    // For simplicity, returning all meetings the user might access.
    // In a stricter system, we'd filter by workspace member lists.
    const meetings = await Meeting.find({})
      .populate('organizer', 'name email')
      .populate('project', 'name')
      .populate('workspace', 'name')
      .sort({ date: 1, time: 1 });

    res.json(meetings);
  } catch (error) {
    console.error('Get Meetings Error:', error);
    res.status(500).json({ message: 'Server error fetching meetings' });
  }
};
