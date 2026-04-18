import { Template } from '../../types';

export const gymMembership: Template = {
  id: 'health-gym-signup',
  name: 'Gym Membership & Waiver',
  description: 'Digital signup for fitness centers with integrated liability waiver acknowledge.',
  category: 'Health',
  icon: 'calendar',
  fields: [
    { label: 'Full Name', type: 'text', required: true },
    { label: 'Membership Level', type: 'select', required: true, options: ['Basic (Gym Access Only)', 'Plus (Classes Included)', 'Premium (PT Included)'] },
    { label: 'Payment Frequency', type: 'radio', required: true, options: ['Monthly', 'Annual (Save 20%)'] },
    { label: 'Emergency Contact Name', type: 'text', required: true },
    { label: 'Liability Waiver', type: 'checkbox', required: true, options: ['I have read and agree to the waiver terms'] }
  ],
  customStyles: {
    accentColor: '#3b82f6',
    borderRadius: 4,
    fontFamily: 'Space Grotesk',
    buttonStyle: 'square'
  }
};
