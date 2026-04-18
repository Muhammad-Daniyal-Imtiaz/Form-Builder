import { Template } from '../../types';

export const commercialInquiry: Template = {
  id: 'real-estate-commercial',
  name: 'Commercial Property Inquiry',
  description: 'Detailed lead capture for businesses looking for office or retail space.',
  category: 'Real Estate',
  icon: 'briefcase',
  fields: [
    { label: 'Business Name', type: 'text', required: true },
    { label: 'Contact Person', type: 'text', required: true },
    { label: 'Contact Email', type: 'email', required: true },
    { label: 'Required Square Footage (approx)', type: 'select', required: true, options: ['< 1,000 sqft', '1,000 - 5,000 sqft', '5,000 - 10,000 sqft', '10,000+ sqft'] },
    { label: 'Intended Use', type: 'select', required: true, options: ['Office space', 'Retail', 'Industrial/Warehouse', 'Restaurant/Hospitality'] },
    { label: 'Target Move-in Date', type: 'text', required: true }
  ],
  customStyles: { accentColor: '#10b981', borderRadius: 4, fontFamily: 'Roboto' }
};
