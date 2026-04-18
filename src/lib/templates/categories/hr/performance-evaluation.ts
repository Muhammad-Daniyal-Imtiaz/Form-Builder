import { Template } from '../../types';

export const performanceEvaluation: Template = {
  id: 'hr-performance',
  name: '360° Peer Review',
  description: 'Confidential peer-to-peer performance evaluation for team members.',
  category: 'HR',
  icon: 'briefcase',
  fields: [
    { label: 'Your Name (Optional)', type: 'text', required: false },
    { label: 'Name of person being reviewed', type: 'text', required: true },
    { label: 'Rate their teamwork and collaboration', type: 'radio', required: true, options: ['Excellent', 'Good', 'Needs Improvement', 'Poor'] },
    { label: 'Rate their communication skills', type: 'radio', required: true, options: ['Excellent', 'Good', 'Needs Improvement', 'Poor'] },
    { label: 'What is their greatest strength?', type: 'textarea', required: true },
    { label: 'Where could they improve?', type: 'textarea', required: true }
  ],
  customStyles: { accentColor: '#4f46e5', borderRadius: 16, fontFamily: 'Playfair Display' }
};
