import { Template } from '../../types';

export const podcastGuest: Template = {
  id: 'creative-podcast-guest',
  name: 'Podcast Guest Intake',
  description: 'Professional bio collection and interview prep for podcast hosts.',
  category: 'Creative',
  icon: 'help',
  fields: [
    { label: 'Guest Full Name', type: 'text', required: true },
    { label: 'Short Professional Bio', type: 'textarea', required: true },
    { label: 'Social Media / Website Links', type: 'textarea', required: true },
    { label: 'Top 3 Topics you would like to discuss', type: 'textarea', required: true },
    { label: 'Will you be using a professional microphone?', type: 'radio', required: true, options: ['Yes', 'No / Built-in mic'] },
    { label: 'Upload Headshot (High-Res)', type: 'file', required: true }
  ],
  customStyles: { accentColor: '#8b5cf6', borderRadius: 24, fontFamily: 'Outfit' }
};
