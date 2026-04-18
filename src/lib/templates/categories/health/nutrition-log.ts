import { Template } from '../../types';

export const nutritionLog: Template = {
  id: 'health-nutrition-log',
  name: 'Nutrition & Diet Log',
  description: 'Daily intake tracking with categorized meal breakdowns for nutritionists.',
  category: 'Health',
  icon: 'calendar',
  fields: [
    { label: 'Client Name', type: 'text', required: true },
    { label: 'Date Logged', type: 'text', required: true, placeholder: 'YYYY-MM-DD' },
    { label: 'Breakfast', type: 'textarea', required: false, placeholder: 'What did you eat and drink?' },
    { label: 'Lunch', type: 'textarea', required: false },
    { label: 'Dinner', type: 'textarea', required: false },
    { label: 'Snacks & Supplements', type: 'textarea', required: false },
    { label: 'Estimated Total Calories', type: 'number', required: false },
    { label: 'Water Intake (Ounces/Liters)', type: 'text', required: true }
  ],
  customStyles: { accentColor: '#10b981', borderRadius: 16, fontFamily: 'Outfit' }
};
