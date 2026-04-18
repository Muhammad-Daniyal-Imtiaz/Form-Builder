import { Template } from '../../types';

export const webinarRSVP: Template = {
  id: 'marketing-webinar-rsvp',
  name: 'Webinar Registration',
  description: 'Boost attendance with a sleek registration form including industry/role tracking.',
  category: 'Marketing',
  icon: 'chart',
  fields: [
    { label: 'Full Name', type: 'text', required: true },
    { label: 'Email Address', type: 'email', required: true },
    { label: 'Job Title', type: 'text', required: true },
    { label: 'Industry', type: 'select', required: true, options: ['Technology', 'Healthcare', 'Finance', 'Education', 'Other'] },
    { label: 'What is your biggest challenge with [Topic]?', type: 'textarea', required: false }
  ],
  customStyles: {
    accentColor: '#ec4899',
    borderRadius: 12,
    fontFamily: 'Outfit',
    buttonStyle: 'rounded',
    inputVariant: 'filled'
  }
};
