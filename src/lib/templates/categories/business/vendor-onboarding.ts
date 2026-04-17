import { Template } from '../types';

export const vendorOnboarding: Template = {
  id: 'vendor-onboarding',
  name: 'Vendor Onboarding',
  description: 'Streamline procurement with a detailed supplier registration form.',
  category: 'Business',
  icon: 'briefcase',
  fields: [
    { label: 'Company Name', type: 'text', required: true },
    { label: 'Tax ID / VAT Number', type: 'text', required: true },
    { label: 'Primary Contact Email', type: 'email', required: true },
    { label: 'Business Type', type: 'select', required: true, options: ['Corporation', 'Partnership', 'Sole Proprietorship', 'Non-Profit'] },
    { label: 'Service Category', type: 'select', required: true, options: ['IT Services', 'Marketing', 'Facility', 'Professional Services', 'Other'] },
    { label: 'Bank Details (PDF)', type: 'file', required: true },
    { label: 'W-9 / Tax Form', type: 'file', required: true }
  ],
  customStyles: {
    accentColor: '#1e293b',
    borderRadius: 4,
    fontFamily: 'Roboto',
    inputVariant: 'filled'
  }
};
