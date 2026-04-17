import { Template } from '../types';

export const instructorEvaluation: Template = {
  id: 'edu-instructor-eval',
  name: 'Instructor Evaluation',
  description: 'Confidential evaluation form to help improve teaching quality and student experience.',
  category: 'Education',
  icon: 'briefcase',
  fields: [
    { label: 'Instructor Name', type: 'text', required: true },
    { label: 'Subject Knowledge', type: 'radio', required: true, options: ['Excellent', 'Good', 'Average', 'Poor'] },
    { label: 'Communication Skills', type: 'radio', required: true, options: ['Excellent', 'Good', 'Average', 'Poor'] },
    { label: 'Responsiveness to Questions', type: 'radio', required: true, options: ['Excellent', 'Good', 'Average', 'Poor'] },
    { label: 'General Feedback', type: 'textarea', required: false }
  ],
  customStyles: {
    accentColor: '#10b981',
    borderRadius: 6,
    fontFamily: 'Inter',
    inputVariant: 'filled'
  }
};
