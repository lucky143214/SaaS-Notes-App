import express from 'express';
import { 
  getNotes, 
  getNote, 
  createNote, 
  updateNote, 
  deleteNote 
} from '../controllers/notesController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getNotes);
router.get('/:id', getNote);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;