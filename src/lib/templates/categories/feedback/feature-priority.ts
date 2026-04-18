import { Template } from '../../types';

export const featurePriority: Template = {
  id: 'feedback-feature-priority',
  name: 'Feature Priority Poll',
  description: 'Use weighted selections to rank requested product features.',
  category: 'Feedback',
  icon: 'star',
  fields: [
    { label: 'Customer Name', type: 'text', required: true },
    { label: 'Please select the top 3 features you want next', type: 'checkbox', required: true, options: ['Dark Mode', 'Mobile App', 'API Access', 'Report Exports', 'Custom Branding', 'SSO Login'] },
    { label: 'If we could only build ONE thing, what would it be?', type: 'text', required: true },
    { label: 'Why is this so important to you?', type: 'textarea', required: false }
  ],
  customStyles: { accentColor: '#8b5cf6', borderRadius: 8, fontFamily: 'Inter' }
};
