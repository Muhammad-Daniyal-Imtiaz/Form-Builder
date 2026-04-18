import { Template } from '../../types';

export const brandAmbassador: Template = {
  id: 'ecommerce-ambassador',
  name: 'Brand Ambassador Application',
  description: 'Recruit passionate customers to represent your ecommerce brand.',
  category: 'E-commerce',
  icon: 'star',
  fields: [
    { label: 'Full Name', type: 'text', required: true },
    { label: 'Instagram Handle', type: 'text', required: true },
    { label: 'TikTok Handle', type: 'text', required: false },
    { label: 'Why do you love our brand?', type: 'textarea', required: true },
    { label: 'Which product is your absolute favorite?', type: 'text', required: true },
    { label: 'Do you agree to post 2x per month?', type: 'checkbox', required: true, options: ['Yes, I agree'] }
  ],
  customStyles: { accentColor: '#0ea5e9', borderRadius: 16, fontFamily: 'Inter' }
};
