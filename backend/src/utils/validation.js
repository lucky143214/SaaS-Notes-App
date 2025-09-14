export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateNote = (note) => {
  if (!note.title || note.title.trim().length === 0) {
    return 'Title is required';
  }
  if (note.title.length > 255) {
    return 'Title must be less than 255 characters';
  }
  return null;
};