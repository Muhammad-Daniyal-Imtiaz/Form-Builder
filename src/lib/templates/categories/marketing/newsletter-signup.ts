import { Template } from '../../types';

export const newsletterSignup: Template = {
  id: 'marketing-newsletter',
  name: 'Newsletter Opt-in',
  description: 'Clean and simple subscription form for your blog or daily newsletter.',
  category: 'Marketing',
  icon: 'chart',
  fields: [
    { label: 'First Name', type: 'text', required: true },
    { label: 'Email Address', type: 'email', required: true },
    { label: 'Interests', type: 'checkbox', required: false, options: ['Technology', 'Business', 'Design', 'Marketing', 'Personal Growth'] }
  ],
  customStyles: {
    accentColor: '#3b82f6',
    borderRadius: 6,
    fontFamily: 'Roboto',
    inputVariant: 'filled'
  }
};
