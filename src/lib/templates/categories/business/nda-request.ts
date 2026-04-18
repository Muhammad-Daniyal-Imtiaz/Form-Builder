import { Template } from '../../types';

export const ndaRequest: Template = {
  id: 'business-nda',
  name: 'Non-Disclosure Agreement Request',
  description: 'Standardized intake for legal NDAs before discussing confidential projects.',
  category: 'Business',
  icon: 'briefcase',
  fields: [
    { label: 'Counterparty Name', type: 'text', required: true },
    { label: 'Counterparty Email', type: 'email', required: true },
    { label: 'Company Entity Name', type: 'text', required: true },
    { label: 'Purpose of NDA', type: 'textarea', required: true },
    { label: 'Mutual or One-Way?', type: 'radio', required: true, options: ['Mutual', 'One-Way'] },
    { label: 'Governing Law State', type: 'text', required: false, placeholder: 'e.g. Delaware' }
  ],
  customStyles: { accentColor: '#1e293b', borderRadius: 0, fontFamily: 'Playfair Display' }
};
