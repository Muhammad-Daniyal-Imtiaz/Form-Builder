import { Template } from '../../types';

export const influencerCollaboration: Template = {
  id: 'marketing-influencer',
  name: 'Influencer Collab Form',
  description: 'Vetting process for potential social media partners and brand ambassadors.',
  category: 'Marketing',
  icon: 'chart',
  fields: [
    { label: 'Creator Name', type: 'text', required: true },
    { label: 'Primary Platform', type: 'select', required: true, options: ['Instagram', 'TikTok', 'YouTube', 'Twitter'] },
    { label: 'Profile Link', type: 'text', required: true },
    { label: 'Total Follower Count', type: 'number', required: true },
    { label: 'Average Engagement Rate (%)', type: 'text', required: false },
    { label: 'Collaboration Idea', type: 'textarea', required: true }
  ],
  customStyles: { accentColor: '#ec4899', borderRadius: 24, fontFamily: 'Space Grotesk' }
};
