import { Template } from '../../types';

export const featureRequest: Template = {
  id: 'it-feature-request',
  name: 'Internal Feature Request',
  description: 'Structured intake for sales and success teams to log product requests.',
  category: 'IT',
  icon: 'chart',
  fields: [
    { label: 'Requester Name (Employee)', type: 'text', required: true },
    { label: 'Client / Customer Name', type: 'text', required: true },
    { label: 'Is this blocking a deal?', type: 'radio', required: true, options: ['Yes', 'No'] },
    { label: 'Problem Description (The "Why")', type: 'textarea', required: true },
    { label: 'Proposed Solution (The "What")', type: 'textarea', required: false },
    { label: 'Impact / ARR value', type: 'number', required: false }
  ],
  customStyles: { accentColor: '#0ea5e9', borderRadius: 8, fontFamily: 'Roboto' }
};
