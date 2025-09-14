import { useState, useEffect } from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import { notesService } from '../services/notes';
import { tenantService } from '../services/tenant';
import NoteForm from '../components/NoteForm';
import NoteCard from '../components/NoteCard';
import UpgradeBanner from '../components/UpgradeBanner';

const Dashboard = () => {
  const { user, logout } = useAuthContext();
  const [notes, setNotes] = useState([]);
  const [stats, setStats] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [notesData, statsData] = await Promise.all([
        notesService.getNotes(),
        tenantService.getStats()
      ]);
      setNotes(notesData);
      setStats(statsData);
    } catch (error) {
      setError('Failed to load data');
      console.error('Load data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (noteData) => {
    try {
      const newNote = await notesService.createNote(noteData);
      setNotes([newNote, ...notes]);
      await loadData(); // Reload stats to update note count
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateNote = async (noteData) => {
    try {
      const updatedNote = await notesService.updateNote(editingNote.id, noteData);
      setNotes(notes.map(note => note.id === editingNote.id ? updatedNote : note));
      setEditingNote(null);
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await notesService.deleteNote(noteId);
      setNotes(notes.filter(note => note.id !== noteId));
      await loadData(); // Reload stats to update note count
    } catch (error) {
      throw error;
    }
  };

  const handleUpgrade = () => {
    setStats(prev => ({ ...prev, plan: 'pro', noteLimit: null }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Notes App</h1>
              <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {user.tenant.slug} ({user.tenant.plan})
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-700">
                <User size={16} className="mr-1" />
                {user.email} ({user.role})
              </div>
              <button
                onClick={logout}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <LogOut size={16} className="mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {stats && <UpgradeBanner stats={stats} onUpgrade={handleUpgrade} />}

        {!editingNote ? (
          <NoteForm onSubmit={handleCreateNote} />
        ) : (
          <NoteForm
            note={editingNote}
            onSubmit={handleUpdateNote}
            onCancel={() => setEditingNote(null)}
            isEditing={true}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={setEditingNote}
              onDelete={handleDeleteNote}
            />
          ))}
        </div>

        {notes.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No notes yet</div>
            <p className="text-gray-500 mt-2">Create your first note to get started!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;