import { Template } from '../../types';

export const tenantApplication: Template = {
  id: 'real-estate-tenant',
  name: 'Tenant Application',
  description: 'Comprehensive residential intake including employment history and references.',
  category: 'Real Estate',
  icon: 'briefcase',
  fields: [
    { label: 'Applicant Full Name', type: 'text', required: true },
    { label: 'Current Address', type: 'textarea', required: true },
    { label: 'Current Employer', type: 'text', required: true },
    { label: 'Monthly Income', type: 'number', required: true },
    { label: 'Any Pets?', type: 'radio', required: true, options: ['Yes', 'No'] },
    { label: 'Upload ID / Passport', type: 'file', required: true },
    { label: 'Proof of Income (PDF)', type: 'file', required: true }
  ],
  customStyles: { accentColor: '#1e293b', borderRadius: 0, fontFamily: 'Playfair Display', inputVariant: 'underline' }
};
