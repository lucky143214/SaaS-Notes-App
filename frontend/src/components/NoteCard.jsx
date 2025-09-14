import { useState } from 'react';
import { Edit3, Trash2, Calendar } from 'lucide-react';

const NoteCard = ({ note, onEdit, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setIsDeleting(true);
      try {
        await onDelete(note.id);
      } catch (error) {
        console.error('Error deleting note:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {note.title}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(note)}
            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
            title="Edit note"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded disabled:opacity-50"
            title="Delete note"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {note.content && (
        <p className="text-gray-600 mb-4 whitespace-pre-wrap">
          {note.content}
        </p>
      )}

      <div className="flex items-center text-sm text-gray-500">
        <Calendar size={14} className="mr-1" />
        <span>{formatDate(note.updatedAt || note.createdAt)}</span>
      </div>
    </div>
  );
};

export default NoteCard;