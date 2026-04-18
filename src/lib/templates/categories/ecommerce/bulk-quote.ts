import { Template } from '../../types';

export const bulkQuote: Template = {
  id: 'ecommerce-bulk-quote',
  name: 'Bulk Order Quote Request',
  description: 'Special pricing intake for enterprise clients ordering in large quantities.',
  category: 'E-commerce',
  icon: 'chart',
  fields: [
    { label: 'Contact Name', type: 'text', required: true },
    { label: 'Company / Organization', type: 'text', required: true },
    { label: 'Product(s) Interested In', type: 'textarea', required: true },
    { label: 'Estimated Quantity Required', type: 'number', required: true },
    { label: 'When do you need these by?', type: 'text', required: true },
    { label: 'Shipping Zip / Postal Code', type: 'text', required: true }
  ],
  customStyles: { accentColor: '#10b981', borderRadius: 12, fontFamily: 'Outfit' }
};
