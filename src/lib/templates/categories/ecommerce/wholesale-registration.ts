import { Template } from '../../types';

export const wholesaleRegistration: Template = {
  id: 'ecommerce-wholesale',
  name: 'Wholesale Partner Registration',
  description: 'Onboarding form for B2B distributors and wholesale buyers.',
  category: 'E-commerce',
  icon: 'briefcase',
  fields: [
    { label: 'Company Name', type: 'text', required: true },
    { label: 'Resale License / Tax ID', type: 'text', required: true },
    { label: 'Website URL', type: 'text', required: true },
    { label: 'Type of Business', type: 'select', required: true, options: ['Online Retailer', 'Brick & Mortar', 'Distributor', 'Dropshipper'] },
    { label: 'Estimated Monthly Volume', type: 'select', required: true, options: ['Under $1k', '$1k - $5k', '$5k - $20k', '$20k+'] },
    { label: 'Upload Reseller Certificate', type: 'file', required: true }
  ],
  customStyles: { accentColor: '#1e293b', borderRadius: 4, fontFamily: 'Space Grotesk' }
};
