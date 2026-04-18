import { Template } from '../../types';

export const maintenanceRequest: Template = {
  id: 'real-estate-maintenance',
  name: 'Maintenance Request',
  description: 'Property management tracking for repairs and tenant issues.',
  category: 'Real Estate',
  icon: 'briefcase',
  fields: [
    { label: 'Property Address / Unit Number', type: 'text', required: true },
    { label: 'Tenant Name', type: 'text', required: true },
    { label: 'Issue Category', type: 'select', required: true, options: ['Plumbing', 'Electrical', 'HVAC', 'Appliance', 'Structural', 'Other'] },
    { label: 'Issue Description', type: 'textarea', required: true },
    { label: 'Upload Photos of Issue', type: 'file', required: false },
    { label: 'Permission to enter if not home?', type: 'radio', required: true, options: ['Yes', 'No'] }
  ],
  customStyles: { accentColor: '#f59e0b', borderRadius: 8, fontFamily: 'Inter' }
};
