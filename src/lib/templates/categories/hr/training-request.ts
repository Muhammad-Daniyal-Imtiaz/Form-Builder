import { Template } from '../../types';

export const trainingRequest: Template = {
  id: 'hr-training',
  name: 'L&D Training Request',
  description: 'Form for employees seeking budget approval to attend courses or conferences.',
  category: 'HR',
  icon: 'briefcase',
  fields: [
    { label: 'Employee Name', type: 'text', required: true },
    { label: 'Course / Conference Name', type: 'text', required: true },
    { label: 'Provider / Host', type: 'text', required: true },
    { label: 'Total Cost ($)', type: 'number', required: true },
    { label: 'Dates of Training', type: 'text', required: true },
    { label: 'How will this benefit your role and the company?', type: 'textarea', required: true },
    { label: 'Manager Approval Required', type: 'checkbox', required: true, options: ['I have discussed this with my manager'] }
  ],
  customStyles: { accentColor: '#10b981', borderRadius: 8, fontFamily: 'Outfit' }
};
