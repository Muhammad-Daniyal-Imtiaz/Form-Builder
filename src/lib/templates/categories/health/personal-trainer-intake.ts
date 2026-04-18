import { Template } from '../../types';

export const personalTrainerIntake: Template = {
  id: 'health-pt-intake',
  name: 'Personal Trainer Intake',
  description: 'Intensive fitness goal setting, body metrics, and injury history.',
  category: 'Health',
  icon: 'calendar',
  fields: [
    { label: 'Client Name', type: 'text', required: true },
    { label: 'Current Height / Weight', type: 'text', required: true },
    { label: 'Primary Fitness Goal', type: 'radio', required: true, options: ['Fat Loss', 'Muscle Hypertrophy', 'Strength', 'Endurance', 'Flexibility/Mobility'] },
    { label: 'Previous Injuries / Surgeries', type: 'textarea', required: true, placeholder: 'If none, type N/A' },
    { label: 'Current Exercise Routine', type: 'textarea', required: true },
    { label: 'How many days per week can you train?', type: 'select', required: true, options: ['1-2', '3-4', '5+'] }
  ],
  customStyles: { accentColor: '#f59e0b', borderRadius: 0, fontFamily: 'Space Grotesk' }
};
