import { Template } from '../types';

export const appointmentRequest: Template = {
  id: 'health-appointment',
  name: 'Appointment Request',
  description: 'Simplify scheduling for clinics and studios with an easy request flow.',
  category: 'Health',
  icon: 'calendar',
  fields: [
    { label: 'Name', type: 'text', required: true },
    { label: 'Preferred Service', type: 'select', required: true, options: ['General Consultation', 'Follow-up', 'Therapy Session', 'Diagnostic Prep', 'Other'] },
    { label: 'Preferred Day(s)', type: 'checkbox', required: true, options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
    { label: 'Preferred Time of Day', type: 'radio', required: true, options: ['Morning', 'Afternoon', 'Evening'] },
    { label: 'Best Contact Method', type: 'select', required: true, options: ['Email', 'Phone Call', 'SMS'] }
  ],
  customStyles: {
    accentColor: '#10b981',
    borderRadius: 12,
    fontFamily: 'Outfit',
    buttonStyle: 'rounded'
  }
};
