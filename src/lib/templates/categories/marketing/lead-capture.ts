import { Template } from '../../types';

export const leadCapture: Template = {
  id: 'marketing-lead-capture',
  name: 'Lead Capture Landing Page',
  description: 'High-conversion lead capture form designed for landing pages and PPC ads.',
  category: 'Marketing',
  icon: 'chart',
  fields: [
    { label: 'Full Name', type: 'text', required: true, placeholder: 'Jane Doe' },
    { label: 'Work Email Address', type: 'email', required: true, placeholder: 'jane@company.com' },
    { label: 'Company Name', type: 'text', required: true },
    { label: 'Company Size', type: 'select', required: true, options: ['1-10', '11-50', '51-200', '201-500', '501+'] },
    { label: 'Primary Interest', type: 'select', required: true, options: ['Product Demo', 'Pricing Info', 'Free Trial', 'General Inquiry'] }
  ],
  customStyles: {
    accentColor: '#f59e0b',
    borderRadius: 8,
    fontFamily: 'Outfit',
    buttonStyle: 'rounded',
    inputVariant: 'outline'
  }
};
