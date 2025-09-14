import { Note } from '../config/database.js';
import { validateNote } from '../utils/validation.js';

export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ tenantId: req.user.tenant_id })
      .populate('createdBy', 'email')
      .sort({ createdAt: -1 });
    
    res.json(notes);
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      tenantId: req.user.tenant_id
    }).populate('createdBy', 'email');

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const validationError = validateNote({ title });
    
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    // Check note limit for free plan
    if (req.user.tenant_plan === 'free') {
      const noteCount = await Note.countDocuments({ tenantId: req.user.tenant_id });
      
      if (noteCount >= 3) {
        return res.status(403).json({ 
          error: 'Free plan limit reached. Upgrade to Pro to create more notes.' 
        });
      }
    }

    const note = await Note.create({
      title,
      content: content || '',
      tenantId: req.user.tenant_id,
      createdBy: req.user.id
    });

    const populatedNote = await Note.findById(note._id).populate('createdBy', 'email');
    
    res.status(201).json(populatedNote);
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const validationError = validateNote({ title });
    
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const note = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        tenantId: req.user.tenant_id
      },
      {
        title,
        content: content || '',
        updatedAt: new Date()
      },
      {
        new: true,
        runValidators: true
      }
    ).populate('createdBy', 'email');

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.user.tenant_id
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};