import { Template } from '../../types';

export const alumniDonation: Template = {
  id: 'edu-alumni-donation',
  name: 'Alumni Donation Form',
  description: 'Clean and persuasive giving form with tiered donation options and matching gifts.',
  category: 'Education',
  icon: 'briefcase',
  fields: [
    { label: 'Alumni Name', type: 'text', required: true },
    { label: 'Graduation Year', type: 'number', required: true },
    { label: 'Donation Amount', type: 'radio', required: true, options: ['$25', '$50', '$100', '$500', 'Other'] },
    { label: 'If Other, specify amount', type: 'number', required: false },
    { label: 'Fund Designation', type: 'select', required: true, options: ['General Endowment', 'Athletics', 'Arts & Sciences', 'Engineering', 'Library / Facilities'] },
    { label: 'Does your employer offer a matching gift program?', type: 'radio', required: true, options: ['Yes', 'No', 'Unsure'] }
  ],
  customStyles: { accentColor: '#10b981', borderRadius: 12, fontFamily: 'Inter' }
};
