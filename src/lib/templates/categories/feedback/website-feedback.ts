import { Template } from '../../types';

export const websiteFeedback: Template = {
  id: 'feedback-website',
  name: 'Website Feedback',
  description: 'Identify UX issues and collect visitor suggestions for your site.',
  category: 'Feedback',
  icon: 'star',
  fields: [
    { label: 'Purpose of your visit today?', type: 'select', required: true, options: ['Buying a product', 'Research', 'Support', 'Exploring', 'Other'] },
    { label: 'Did you find what you were looking for?', type: 'radio', required: true, options: ['Yes, easily', 'Yes, but it was hard', 'No'] },
    { label: 'What is one thing we should change?', type: 'textarea', required: false },
    { label: 'Rate the website design (1-5)', type: 'radio', required: true, options: ['5', '4', '3', '2', '1'] }
  ],
  customStyles: {
    accentColor: '#3b82f6',
    borderRadius: 12,
    fontFamily: 'Roboto',
    inputVariant: 'filled'
  }
};
