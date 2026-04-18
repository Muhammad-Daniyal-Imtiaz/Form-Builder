import { Template } from '../../types';

export const exitInterview: Template = {
  id: 'hr-exit-interview',
  name: 'Employee Exit Survey',
  description: 'Honest feedback questionnaire sent to departing employees.',
  category: 'HR',
  icon: 'briefcase',
  fields: [
    { label: 'Employee Name (Optional)', type: 'text', required: false },
    { label: 'Primary reason for leaving', type: 'select', required: true, options: ['Career Growth / Promotion', 'Salary / Compensation', 'Management Conflict', 'Relocation', 'Personal Reasons', 'Better Opportunity'] },
    { label: 'Did you feel valued here?', type: 'radio', required: true, options: ['Always', 'Sometimes', 'Rarely', 'Never'] },
    { label: 'Would you recommend us as a great place to work?', type: 'radio', required: true, options: ['Absolutely', 'Maybe', 'No'] },
    { label: 'What could we have done to keep you?', type: 'textarea', required: false },
    { label: 'Any other comments?', type: 'textarea', required: false }
  ],
  customStyles: { accentColor: '#f59e0b', borderRadius: 16, fontFamily: 'Inter', inputVariant: 'underline' }
};
