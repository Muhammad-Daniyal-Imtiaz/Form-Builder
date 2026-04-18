import { Template } from '../../types';

export const techSupport: Template = {
  id: 'it-tech-support',
  name: 'Technical Support Escalation',
  description: 'High-level support intake requiring OS, versioning, and detailed logs.',
  category: 'IT',
  icon: 'help',
  fields: [
    { label: 'Account / User ID', type: 'text', required: true },
    { label: 'System OS', type: 'select', required: true, options: ['Windows 10', 'Windows 11', 'macOS', 'Linux', 'iOS', 'Android'] },
    { label: 'App Version Number', type: 'text', required: true },
    { label: 'Error Code (if any)', type: 'text', required: false },
    { label: 'Detailed issue description', type: 'textarea', required: true },
    { label: 'Upload Log Files (.txt or .zip)', type: 'file', required: true }
  ],
  customStyles: { accentColor: '#3b82f6', borderRadius: 12, fontFamily: 'Inter', inputVariant: 'filled' }
};
