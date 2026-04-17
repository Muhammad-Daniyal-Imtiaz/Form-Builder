import { Template } from '../types';

export const npsSurvey: Template = {
  id: 'feedback-nps',
  name: 'NPS Survey (Net Promoter Score)',
  description: 'The industry-standard metric for customer loyalty and brand advocacy.',
  category: 'Feedback',
  icon: 'star',
  fields: [
    { label: 'How likely are you to recommend us to a friend or colleague? (0-10)', type: 'radio', required: true, options: ['0 - Not at all likely', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10 - Extremely likely'] },
    { label: 'What is the primary reason for your score?', type: 'textarea', required: false },
    { label: 'What is one thing we could do to improve your experience?', type: 'textarea', required: false }
  ],
  customStyles: {
    accentColor: '#8b5cf6',
    borderRadius: 8,
    fontFamily: 'Inter',
    buttonStyle: 'rounded'
  }
};
