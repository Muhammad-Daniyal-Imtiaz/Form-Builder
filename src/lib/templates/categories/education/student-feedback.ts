import { Template } from '../types';

export const studentFeedback: Template = {
  id: 'edu-student-feedback',
  name: 'Student Course Feedback',
  description: 'Mid-term or end-of-term feedback to gauge course difficulty and engagement.',
  category: 'Education',
  icon: 'briefcase',
  fields: [
    { label: 'How would you rate the course difficulty?', type: 'radio', required: true, options: ['Too Difficult', 'Challenging', 'Just Right', 'Too Easy'] },
    { label: 'The course materials were clear and helpful', type: 'radio', required: true, options: ['Strongly Agree', 'Agree', 'Disagree', 'Strongly Disagree'] },
    { label: 'Most interesting topic covered so far?', type: 'text', required: false },
    { label: 'Any suggestions for improvement?', type: 'textarea', required: false }
  ],
  customStyles: {
    accentColor: '#f59e0b',
    borderRadius: 9999,
    fontFamily: 'Outfit',
    buttonStyle: 'pill'
  }
};
