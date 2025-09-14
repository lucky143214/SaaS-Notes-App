import api from './api';

export const notesService = {
  getNotes: async () => {
    const response = await api.get('/notes');
    return response.data;
  },

  getNote: async (id) => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  createNote: async (note) => {
    const response = await api.post('/notes', note);
    return response.data;
  },

  updateNote: async (id, note) => {
    const response = await api.put(`/notes/${id}`, note);
    return response.data;
  },

  deleteNote: async (id) => {
    await api.delete(`/notes/${id}`);
  }
};