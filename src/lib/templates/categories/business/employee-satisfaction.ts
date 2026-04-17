import { Template } from '../types';

export const employeeSatisfaction: Template = {
  id: 'employee-satisfaction',
  name: 'Employee Pulse Survey',
  description: 'Confidential survey to measure workplace happiness and engagement.',
  category: 'Business',
  icon: 'briefcase',
  fields: [
    { label: 'Role / Department', type: 'text', required: true },
    { label: 'Overall Job Satisfaction', type: 'radio', required: true, options: ['Very Happy', 'Happy', 'Neutral', 'Unhappy', 'Very Unhappy'] },
    { label: 'I feel supported by my manager', type: 'radio', required: true, options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'] },
    { label: 'I have the tools I need to do my job', type: 'radio', required: true, options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'] },
    { label: 'What is one thing we could do to improve?', type: 'textarea', required: true },
    { label: 'Preferred frequency for these surveys', type: 'select', required: true, options: ['Monthly', 'Quarterly', 'Bi-annually', 'Annually'] }
  ],
  customStyles: {
    accentColor: '#4f46e5',
    borderRadius: 16,
    fontFamily: 'Inter',
    buttonStyle: 'pill'
  }
};
