import { Template } from '../../types';

export const telehealthConsent: Template = {
  id: 'health-telehealth-consent',
  name: 'Telehealth Consent Form',
  description: 'Legally-focused digital consent intake for remote care and virtual visits.',
  category: 'Health',
  icon: 'calendar',
  fields: [
    { label: 'Patient Name', type: 'text', required: true },
    { label: 'Date of Birth', type: 'text', required: true, placeholder: 'MM/DD/YYYY' },
    { label: 'I consent to receive healthcare services via telehealth', type: 'checkbox', required: true, options: ['I agree'] },
    { label: 'I understand the privacy risks of digital communication', type: 'checkbox', required: true, options: ['I agree'] },
    { label: 'Digital Signature (Type Full Name)', type: 'text', required: true },
    { label: 'Date', type: 'text', required: true, placeholder: 'MM/DD/YYYY' }
  ],
  customStyles: { accentColor: '#0ea5e9', borderRadius: 8, fontFamily: 'Inter' }
};
