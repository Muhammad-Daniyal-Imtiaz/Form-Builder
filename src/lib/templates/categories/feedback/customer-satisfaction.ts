import { Template } from '../types';

export const customerSatisfaction: Template = {
  id: 'feedback-csat',
  name: 'Customer Satisfaction (CSAT)',
  description: 'Standard satisfaction survey to measure how happy customers are with your service.',
  category: 'Feedback',
  icon: 'star',
  fields: [
    { label: 'Overall, how would you rate your experience?', type: 'radio', required: true, options: ['Excellent', 'Good', 'Average', 'Poor', 'Very Poor'] },
    { label: 'Was your issue resolved today?', type: 'radio', required: true, options: ['Yes', 'No', 'N/A'] },
    { label: 'What could we have done better?', type: 'textarea', required: false },
    { label: 'How likely are you to return?', type: 'radio', required: true, options: ['Very Likely', 'Likely', 'Unsure', 'Unlikely', 'Very Unlikely'] }
  ],
  customStyles: {
    accentColor: '#10b981',
    borderRadius: 16,
    fontFamily: 'Outfit',
    buttonStyle: 'pill'
  }
};
