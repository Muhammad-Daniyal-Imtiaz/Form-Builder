import { Template } from '../../types';

export const photoVideoRelease: Template = {
  id: 'creative-media-release',
  name: 'Photo/Video Release Form',
  description: 'Digital legal consent for content creators and production studios.',
  category: 'Creative',
  icon: 'calendar',
  fields: [
    { label: 'Talent / Subject Name', type: 'text', required: true },
    { label: 'Date of Shoot', type: 'text', required: true, placeholder: 'MM/DD/YYYY' },
    { label: 'Location of Shoot', type: 'text', required: true },
    { label: 'I grant permission to use my likeness for commercial purposes', type: 'checkbox', required: true, options: ['I Agree'] },
    { label: 'Are you over 18 years of age?', type: 'radio', required: true, options: ['Yes', 'No (Requires Guardian Signature)'] },
    { label: 'Signature (Type Full Legal Name)', type: 'text', required: true }
  ],
  customStyles: { accentColor: '#1e293b', borderRadius: 8, fontFamily: 'Playfair Display' }
};
