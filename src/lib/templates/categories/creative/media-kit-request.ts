import { Template } from '../../types';

export const mediaKitRequest: Template = {
  id: 'creative-media-kit',
  name: 'Media Kit Request',
  description: 'For brands and journalists seeking press information and asset kits.',
  category: 'Creative',
  icon: 'chart',
  fields: [
    { label: 'Your Name', type: 'text', required: true },
    { label: 'Publication / Brand Name', type: 'text', required: true },
    { label: 'Contact Email', type: 'email', required: true },
    { label: 'Purpose of Request', type: 'select', required: true, options: ['Feature Article', 'Partnership/Sponsorship', 'Interview Request', 'Other'] },
    { label: 'When do you need the assets by?', type: 'text', required: true },
    { label: 'Any specific asset requests?', type: 'textarea', required: false }
  ],
  customStyles: { accentColor: '#10b981', borderRadius: 8, fontFamily: 'Inter' }
};
