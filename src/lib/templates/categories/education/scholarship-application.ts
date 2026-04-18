import { Template } from '../../types';

export const scholarshipApplication: Template = {
  id: 'edu-scholarship',
  name: 'Scholarship Application',
  description: 'Deep application form requiring academic records, references, and an essay.',
  category: 'Education',
  icon: 'briefcase',
  fields: [
    { label: 'Applicant Name', type: 'text', required: true },
    { label: 'Current GPA', type: 'number', required: true },
    { label: 'Intended Major / Path', type: 'text', required: true },
    { label: 'Letter of Recommendation (PDF)', type: 'file', required: true },
    { label: 'Academic Transcript (PDF)', type: 'file', required: true },
    { label: 'Personal Essay (Why do you deserve this?)', type: 'textarea', required: true },
    { label: 'Financial Need Assessment', type: 'radio', required: true, options: ['High', 'Medium', 'Low', 'Prefer not to say'] }
  ],
  customStyles: { accentColor: '#3b82f6', borderRadius: 4, fontFamily: 'Playfair Display' }
};
