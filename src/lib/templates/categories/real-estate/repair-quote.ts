import { Template } from '../../types';

export const repairQuote: Template = {
  id: 'real-estate-repair-quote',
  name: 'Contractor Repair Quote Request',
  description: 'For property managers requesting bids from contractors and tradespeople.',
  category: 'Real Estate',
  icon: 'briefcase',
  fields: [
    { label: 'Property Manager Name', type: 'text', required: true },
    { label: 'Property Address', type: 'text', required: true },
    { label: 'Trade Required', type: 'select', required: true, options: ['Plumbing', 'Electrical', 'Roofing', 'Painting', 'General Construction'] },
    { label: 'Scope of Work', type: 'textarea', required: true },
    { label: 'Required Completion Date', type: 'text', required: true },
    { label: 'Attach Floor/Site Plans', type: 'file', required: false }
  ],
  customStyles: { accentColor: '#8b5cf6', borderRadius: 8, fontFamily: 'Inter' }
};
