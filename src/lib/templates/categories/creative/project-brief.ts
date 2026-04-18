import { Template } from '../../types';

export const projectBrief: Template = {
  id: 'creative-project-brief',
  name: 'Creative Project Brief',
  description: 'High-level creative requirement intake for agencies and freelance designers.',
  category: 'Creative',
  icon: 'star',
  fields: [
    { label: 'Client / Brand Name', type: 'text', required: true },
    { label: 'Project Name', type: 'text', required: true },
    { label: 'Project Goals & Objectives', type: 'textarea', required: true },
    { label: 'Target Audience Profile', type: 'textarea', required: true },
    { label: 'Deliverables Required', type: 'checkbox', required: true, options: ['Logo/Branding', 'Website Design', 'Video Production', 'Copywriting', 'Ad Creatives'] },
    { label: 'Estimated Budget Range', type: 'select', required: true, options: ['Under $1k', '$1k - $5k', '$5k - $10k', '$10k - $25k', '$25k+'] },
    { label: 'Target Deadline', type: 'text', required: true, placeholder: 'YYYY-MM-DD' }
  ],
  customStyles: { accentColor: '#db2777', borderRadius: 0, fontFamily: 'Space Grotesk' }
};
