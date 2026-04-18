import { Template } from '../../types';

export const itAssetRequest: Template = {
  id: 'business-it-asset',
  name: 'IT Asset Request',
  description: 'Hardware and software procurement flow for existing employees and new hires.',
  category: 'Business',
  icon: 'briefcase',
  fields: [
    { label: 'Employee Name', type: 'text', required: true },
    { label: 'Department', type: 'select', required: true, options: ['Engineering', 'Design', 'Sales', 'Marketing', 'Ops'] },
    { label: 'Requested Asset Type', type: 'select', required: true, options: ['Laptop', 'Monitor', 'Accessories', 'Software License'] },
    { label: 'Specific Model/Software', type: 'text', required: true },
    { label: 'Business Justification', type: 'textarea', required: true },
    { label: 'Needs Manager Approval', type: 'checkbox', required: true, options: ['Yes, send to manager'] }
  ],
  customStyles: { accentColor: '#3b82f6', borderRadius: 8, fontFamily: 'Inter' }
};
