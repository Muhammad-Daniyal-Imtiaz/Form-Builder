import { Template } from '../../types';

export const productSwap: Template = {
  id: 'ecommerce-product-swap',
  name: 'Subscription Product Swap',
  description: 'Allow subscribers to easily manage and swap items in their recurring boxes.',
  category: 'E-commerce',
  icon: 'chart',
  fields: [
    { label: 'Account Email', type: 'email', required: true },
    { label: 'Current Subscription Tier', type: 'select', required: true, options: ['Basic Box', 'Premium Box', 'Ultimate Box'] },
    { label: 'Item to Remove from next box', type: 'text', required: true },
    { label: 'Item to Add to next box', type: 'text', required: true },
    { label: 'Reason for Swap', type: 'select', required: true, options: ['Tired of old item', 'Allergic/Sensitivity', 'Want to try something new'] }
  ],
  customStyles: { accentColor: '#f59e0b', borderRadius: 9999, fontFamily: 'Playfair Display' }
};
