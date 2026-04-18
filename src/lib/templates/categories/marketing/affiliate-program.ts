import { Template } from '../../types';

export const affiliateProgram: Template = {
  id: 'marketing-affiliate',
  name: 'Affiliate Program Application',
  description: 'Application for marketers and creators wanting to join your affiliate network.',
  category: 'Marketing',
  icon: 'chart',
  fields: [
    { label: 'Full Name / Business Name', type: 'text', required: true },
    { label: 'Website / Blog URL', type: 'text', required: true },
    { label: 'Monthly Traffic (approx)', type: 'select', required: true, options: ['< 5k', '5k - 20k', '20k - 100k', '100k+'] },
    { label: 'How do you plan to promote us?', type: 'textarea', required: true },
    { label: 'Preferred Payout Method', type: 'radio', required: true, options: ['PayPal', 'Bank Transfer', 'Store Credit'] }
  ],
  customStyles: { accentColor: '#8b5cf6', borderRadius: 8, fontFamily: 'Outfit' }
};
