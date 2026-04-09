const Meeting = require('../models/Meeting');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Workspace = require('../models/Workspace');
const Project = require('../models/Project');
const socketIO = require('../socket');
const crypto = require('crypto');

exports.createMeeting = async (req, res) => {
  try {
    const { title, description, date, time, project, workspace, task } = req.body;
    
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
      workspace: workspace || undefined,
      task: task || undefined
    });

    const savedMeeting = await newMeeting.save();
    
    // Populate the organizer before sending response/notifications
    await savedMeeting.populate('organizer', 'name email');
    if (savedMeeting.project) await savedMeeting.populate('project', 'name');
    if (savedMeeting.workspace) await savedMeeting.populate('workspace', 'name');
    if (savedMeeting.task) await savedMeeting.populate('task', 'title');

    // Notification Logic: Notify everyone in the workspace/project OR all developers
    let recipientIds = [];
    if (workspace) {
      const ws = await Workspace.findById(workspace);
      if (ws) {
        recipientIds = ws.members.map(m => m.toString());
      }
    } else {
      // Fallback: Notify all developers if no specific workspace provided
      const developers = await User.find({ role: 'developer' });
      recipientIds = developers.map(d => d._id.toString());
    }

    // Filter out the organizer
    recipientIds = recipientIds.filter(id => id !== req.user._id.toString());

    // Create notifications and emit real-time events
    const io = socketIO.getIO();
    for (const recipientId of [...new Set(recipientIds)]) {
      const notification = new Notification({
        userId: recipientId,
        type: 'meeting_scheduled',
        message: `${req.user.name} scheduled a meeting: ${title} on ${new Date(date).toLocaleDateString()} at ${time}`,
        relatedMeeting: savedMeeting._id
      });
      await notification.save();
      
      // Real-time notification if they are in the user room
      io.to(recipientId).emit('new_notification', notification);
    }

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
      .populate('task', 'title')
      .sort({ date: 1, time: 1 });

    res.json(meetings);
  } catch (error) {
    console.error('Get Meetings Error:', error);
    res.status(500).json({ message: 'Server error fetching meetings' });
  }
};
