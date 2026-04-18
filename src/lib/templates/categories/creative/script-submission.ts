import { Template } from '../../types';

export const scriptSubmission: Template = {
  id: 'creative-script-sub',
  name: 'Script / Pitch Submission',
  description: 'Structured intake for writers submitting scripts to studios or agencies.',
  category: 'Creative',
  icon: 'briefcase',
  fields: [
    { label: 'Writer Name(s)', type: 'text', required: true },
    { label: 'Project Title', type: 'text', required: true },
    { label: 'Format', type: 'select', required: true, options: ['Feature Film', 'TV Pilot (Half-Hour)', 'TV Pilot (One-Hour)', 'Short Film', 'Web Series'] },
    { label: 'Genre', type: 'select', required: true, options: ['Action', 'Comedy', 'Drama', 'Horror/Thriller', 'Sci-Fi/Fantasy'] },
    { label: 'Logline (One Sentence Summary)', type: 'textarea', required: true },
    { label: 'Upload Script (PDF)', type: 'file', required: true }
  ],
  customStyles: { accentColor: '#ef4444', borderRadius: 16, fontFamily: 'Courier Prime, Inter' }
};
