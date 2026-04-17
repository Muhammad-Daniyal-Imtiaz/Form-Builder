import { Template } from '../types';

export const patientIntake: Template = {
  id: 'health-patient-intake',
  name: 'New Patient Intake',
  description: 'Digital intake form to collect non-sensitive patient history and contact info.',
  category: 'Health',
  icon: 'calendar',
  fields: [
    { label: 'Full Name', type: 'text', required: true },
    { label: 'Date of Birth', type: 'text', required: true, placeholder: 'MM/DD/YYYY' },
    { label: 'Reason for Visit', type: 'textarea', required: true },
    { label: 'Primary Insurance Provider', type: 'text', required: false },
    { label: 'Are you taking any medications?', type: 'textarea', required: false },
    { label: 'Emergency Contact Phone', type: 'text', required: true }
  ],
  customStyles: {
    accentColor: '#0ea5e9',
    borderRadius: 8,
    fontFamily: 'Inter',
    inputVariant: 'outline'
  }
};
