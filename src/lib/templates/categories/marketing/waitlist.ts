import { Template } from '../../types';

export const waitlist: Template = {
  id: 'marketing-waitlist',
  name: 'Product Waitlist',
  description: 'Build hype for your upcoming product launch with a beautiful waitlist signup.',
  category: 'Marketing',
  icon: 'chart',
  fields: [
    { label: 'Full Name', type: 'text', required: true },
    { label: 'Email Address', type: 'email', required: true, placeholder: 'name@email.com' },
    { label: 'How did you hear about us?', type: 'select', required: false, options: ['Twitter', 'LinkedIn', 'Friend', 'Ad', 'Other'] },
    { label: 'What feature are you most excited about?', type: 'textarea', required: false }
  ],
  customStyles: {
    accentColor: '#8b5cf6',
    borderRadius: 9999,
    fontFamily: 'Outfit',
    buttonStyle: 'pill',
    inputVariant: 'underline'
  }
};
