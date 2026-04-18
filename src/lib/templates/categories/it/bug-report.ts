import { Template } from '../../types';

export const bugReport: Template = {
  id: 'it-bug-report',
  name: 'Advanced Bug Report',
  description: 'Detailed issue tracker for QA and beta testers with environment specifics.',
  category: 'IT',
  icon: 'help',
  fields: [
    { label: 'Reporter Name / Email', type: 'text', required: true },
    { label: 'Area / Module affected', type: 'select', required: true, options: ['Frontend/UI', 'Backend/API', 'Database', 'Mobile App', 'Documentation', 'Other'] },
    { label: 'Environment', type: 'radio', required: true, options: ['Production', 'Staging', 'Development'] },
    { label: 'Expected Behavior', type: 'textarea', required: true },
    { label: 'Actual Behavior', type: 'textarea', required: true },
    { label: 'Steps to Reproduce', type: 'textarea', required: true },
    { label: 'Browser console logs / error messages', type: 'textarea', required: false },
    { label: 'Upload Screenshots', type: 'file', required: false }
  ],
  customStyles: { accentColor: '#ef4444', borderRadius: 8, fontFamily: 'Space Grotesk' }
};
