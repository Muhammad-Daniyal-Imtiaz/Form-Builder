import { Template } from '../../types';

export const sponsorshipProposal: Template = {
  id: 'marketing-sponsorship',
  name: 'Sponsorship Proposal',
  description: 'Intake for events, podcasts, or content creators seeking brand sponsorship.',
  category: 'Marketing',
  icon: 'chart',
  fields: [
    { label: 'Event / Property Name', type: 'text', required: true },
    { label: 'Date of Event', type: 'text', required: true },
    { label: 'Expected Audience Size', type: 'number', required: true },
    { label: 'Sponsorship Tiers Requested', type: 'checkbox', required: true, options: ['Gold ($10k+)', 'Silver ($5k)', 'Bronze ($1k)', 'In-Kind / Product Only'] },
    { label: 'Pitch deck / Proposal PDF', type: 'file', required: true },
    { label: 'Why is this a mutual fit?', type: 'textarea', required: true }
  ],
  customStyles: { accentColor: '#f59e0b', borderRadius: 4, fontFamily: 'Inter' }
};
