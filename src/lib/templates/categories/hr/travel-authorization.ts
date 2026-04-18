import { Template } from '../../types';

export const travelAuthorization: Template = {
  id: 'hr-travel-auth',
  name: 'Travel Authorization Request',
  description: 'Corporate travel booking request for flights, hotels, and per diems.',
  category: 'HR',
  icon: 'calendar',
  fields: [
    { label: 'Employee Name', type: 'text', required: true },
    { label: 'Destination City / Country', type: 'text', required: true },
    { label: 'Departure Date', type: 'text', required: true, placeholder: 'YYYY-MM-DD' },
    { label: 'Return Date', type: 'text', required: true, placeholder: 'YYYY-MM-DD' },
    { label: 'Purpose of Travel', type: 'textarea', required: true },
    { label: 'Estimated Total Cost', type: 'number', required: true },
    { label: 'Need hotel booked by admin?', type: 'radio', required: true, options: ['Yes', 'No, I will book and expense'] }
  ],
  customStyles: { accentColor: '#0ea5e9', borderRadius: 8, fontFamily: 'Space Grotesk' }
};
