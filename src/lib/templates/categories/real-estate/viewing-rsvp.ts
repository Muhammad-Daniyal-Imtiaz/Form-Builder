import { Template } from '../../types';

export const viewingRsvp: Template = {
  id: 'real-estate-viewing',
  name: 'Open House Viewing RSVP',
  description: 'Scheduling for open houses and pre-qualifying potential buyers or renters.',
  category: 'Real Estate',
  icon: 'calendar',
  fields: [
    { label: 'Full Name', type: 'text', required: true },
    { label: 'Email Address', type: 'email', required: true },
    { label: 'Phone Number', type: 'text', required: true },
    { label: 'Preferred Viewing Date/Time', type: 'text', required: true, placeholder: 'MM/DD/YYYY HH:MM AM/PM' },
    { label: 'Are you pre-approved for a mortgage?', type: 'radio', required: true, options: ['Yes', 'No', 'Cash Buyer', 'Renting'] },
    { label: 'Do you currently own or rent?', type: 'radio', required: true, options: ['Own', 'Rent'] }
  ],
  customStyles: { accentColor: '#3b82f6', borderRadius: 16, fontFamily: 'Outfit' }
};
