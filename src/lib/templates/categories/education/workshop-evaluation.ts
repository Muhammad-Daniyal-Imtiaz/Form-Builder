import { Template } from '../../types';

export const workshopEvaluation: Template = {
  id: 'edu-workshop-eval',
  name: 'Workshop / Seminar Evaluation',
  description: 'Deep-dive feedback to measure curriculum effectiveness and material quality.',
  category: 'Education',
  icon: 'briefcase',
  fields: [
    { label: 'Workshop Name / Date', type: 'text', required: true },
    { label: 'The seminar materials were well prepared', type: 'radio', required: true, options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree'] },
    { label: 'The speaker was knowledgeable and engaging', type: 'radio', required: true, options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree'] },
    { label: 'What was the most valuable part of the session?', type: 'textarea', required: true },
    { label: 'What topics would you like covered in future workshops?', type: 'textarea', required: false },
    { label: 'Overall Rating (1-10)', type: 'number', required: true, placeholder: '10' }
  ],
  customStyles: { accentColor: '#ec4899', borderRadius: 8, fontFamily: 'Outfit' }
};
