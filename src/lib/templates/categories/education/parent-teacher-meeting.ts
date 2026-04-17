import { Template } from '../types';

export const parentTeacherMeeting: Template = {
  id: 'edu-pt-meeting',
  name: 'Parent-Teacher Meeting Request',
  description: 'Scheduling tool for parents to request meetings with teachers and share concerns.',
  category: 'Education',
  icon: 'briefcase',
  fields: [
    { label: 'Parent / Guardian Name', type: 'text', required: true },
    { label: 'Student Name', type: 'text', required: true },
    { label: 'Grade Level', type: 'select', required: true, options: ['K-5', '6-8', '9-12'] },
    { label: 'Primary Topics for Discussion', type: 'checkbox', required: true, options: ['Academic Performance', 'Social Development', 'Behavioral Issues', 'Future Planning', 'Other'] },
    { label: 'Preferred Meeting Day', type: 'select', required: true, options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
    { label: 'Message / Concerns', type: 'textarea', required: false }
  ],
  customStyles: {
    accentColor: '#3b82f6',
    borderRadius: 8,
    fontFamily: 'Inter',
    inputVariant: 'underline'
  }
};
