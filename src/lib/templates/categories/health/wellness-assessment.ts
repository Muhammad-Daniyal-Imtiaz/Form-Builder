import { Template } from '../../types';

export const wellnessAssessment: Template = {
  id: 'health-wellness-check',
  name: 'Wellness Assessment',
  description: 'Holistic assessment of lifestyle habits, sleep, and fitness goals.',
  category: 'Health',
  icon: 'calendar',
  fields: [
    { label: 'Primary Goal', type: 'select', required: true, options: ['Weight Loss', 'Muscle Gain', 'Stress Reduction', 'Better Sleep', 'Overall Health'] },
    { label: 'Hours of sleep per night (average)', type: 'radio', required: true, options: ['< 5', '5-6', '7-8', '9+'] },
    { label: 'Current activity level', type: 'select', required: true, options: ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'] },
    { label: 'Any specific health concerns?', type: 'textarea', required: false },
    { label: 'Daily water intake (litres)', type: 'number', required: false, placeholder: '2.0' }
  ],
  customStyles: {
    accentColor: '#06b6d4',
    borderRadius: 24,
    fontFamily: 'Outfit',
    buttonStyle: 'pill'
  }
};
