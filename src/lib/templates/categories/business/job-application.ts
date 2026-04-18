import { Template } from '../../types';

export const jobApplication: Template = {
  id: 'job-application',
  name: 'Job Application',
  description: 'Standard HR intake for professional roles with resume and cover letter fields.',
  category: 'Business',
  icon: 'briefcase',
  fields: [
    { label: 'Full Name', type: 'text', required: true, placeholder: 'John Doe' },
    { label: 'Email Address', type: 'email', required: true, placeholder: 'john@example.com' },
    { label: 'Phone Number', type: 'text', required: true, placeholder: '+1 (555) 000-0000' },
    { label: 'LinkedIn Profile', type: 'text', required: false, placeholder: 'https://linkedin.com/in/...' },
    { label: 'Earliest Start Date', type: 'text', required: true },
    { label: 'Resume / CV', type: 'file', required: true },
    { label: 'Cover Letter', type: 'textarea', required: false }
  ],
  customStyles: {
    accentColor: '#4f46e5',
    borderRadius: 8,
    fontFamily: 'Inter',
    buttonStyle: 'rounded'
  }
};
