import { Template } from '../../types';

export const uxBetaFeedback: Template = {
  id: 'feedback-ux-beta',
  name: 'UX Beta Feedback',
  description: 'Extremely detailed reporting for application beta testers to improve UX.',
  category: 'Feedback',
  icon: 'star',
  fields: [
    { label: 'Tester ID / Email', type: 'email', required: true },
    { label: 'Device / OS Used', type: 'select', required: true, options: ['iOS', 'Android', 'Mac', 'Windows', 'Linux'] },
    { label: 'Feature Tested', type: 'text', required: true },
    { label: 'How intuitive was this feature?', type: 'radio', required: true, options: ['Very Intuitive', 'Somewhat Intuitive', 'Confusing', 'Very Confusing'] },
    { label: 'Did you encounter any bugs?', type: 'radio', required: true, options: ['Yes', 'No'] },
    { label: 'Detailed Description of Experience', type: 'textarea', required: true },
    { label: 'Upload Screenshots/Screen Recording', type: 'file', required: false }
  ],
  customStyles: { accentColor: '#10b981', borderRadius: 16, fontFamily: 'Outfit' }
};
