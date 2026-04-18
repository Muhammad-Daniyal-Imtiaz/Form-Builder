import { Template } from '../../types';

export const serviceLevelSurvey: Template = {
  id: 'feedback-slav',
  name: 'Service Level Agreement (SLA) Survey',
  description: 'For B2B partners and enterprise clients to rate SLA performance.',
  category: 'Feedback',
  icon: 'star',
  fields: [
    { label: 'Client Company', type: 'text', required: true },
    { label: 'Account Manager', type: 'text', required: false },
    { label: 'Rate Uptime & Reliability (1-5)', type: 'radio', required: true, options: ['1', '2', '3', '4', '5'] },
    { label: 'Rate Support Responsiveness (1-5)', type: 'radio', required: true, options: ['1', '2', '3', '4', '5'] },
    { label: 'Did we meet the agreed SLA this quarter?', type: 'radio', required: true, options: ['Yes, exceeded', 'Yes, met', 'No, missed'] },
    { label: 'Feedback / Comments', type: 'textarea', required: false }
  ],
  customStyles: { accentColor: '#3b82f6', borderRadius: 4, fontFamily: 'Roboto' }
};
