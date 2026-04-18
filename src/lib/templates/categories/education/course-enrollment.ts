import { Template } from '../../types';

export const courseEnrollment: Template = {
  id: 'edu-course-enroll',
  name: 'Course Enrollment',
  description: 'Simple and effective registration form for students joining a new course or program.',
  category: 'Education',
  icon: 'briefcase',
  fields: [
    { label: 'Full Student Name', type: 'text', required: true },
    { label: 'Student ID (if applicable)', type: 'text', required: false },
    { label: 'Course Name', type: 'select', required: true, options: ['Mathematics 101', 'Intro to CS', 'World History', 'Advanced Design', 'Digital Marketing'] },
    { label: 'Semester', type: 'radio', required: true, options: ['Spring 2024', 'Fall 2024', 'Summer 2024'] },
    { label: 'Are there any prerequisites you have not completed?', type: 'textarea', required: false }
  ],
  customStyles: {
    accentColor: '#4f46e5',
    borderRadius: 8,
    fontFamily: 'Roboto',
    inputVariant: 'outline'
  }
};
