import { Template } from '../../types';

export const employeeOnboarding: Template = {
  id: 'business-onboarding',
  name: 'Employee Onboarding Checklist',
  description: 'Comprehensive digital checklist and intake form for new hires.',
  category: 'Business',
  icon: 'briefcase',
  fields: [
    { label: 'Full Legal Name', type: 'text', required: true },
    { label: 'Start Date', type: 'text', required: true, placeholder: 'MM/DD/YYYY' },
    { label: 'Personal Email', type: 'email', required: true },
    { label: 'Home Address', type: 'textarea', required: true },
    { label: 'Emergency Contact', type: 'text', required: true },
    { label: 'T-Shirt Size', type: 'radio', required: false, options: ['S', 'M', 'L', 'XL', 'XXL'] },
    { label: 'Photo for ID/Profile', type: 'file', required: true }
  ],
  customStyles: { accentColor: '#10b981', borderRadius: 16, fontFamily: 'Outfit' }
};
