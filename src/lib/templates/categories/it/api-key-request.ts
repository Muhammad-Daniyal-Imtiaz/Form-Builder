import { Template } from '../../types';

export const apiKeyRequest: Template = {
  id: 'it-api-key',
  name: 'API Key Request Form',
  description: 'Use case and developer details intake to provision access tokens.',
  category: 'IT',
  icon: 'help',
  fields: [
    { label: 'Developer Name', type: 'text', required: true },
    { label: 'Company / Organization', type: 'text', required: true },
    { label: 'Environment Needed', type: 'radio', required: true, options: ['Sandbox / Test', 'Production', 'Both'] },
    { label: 'Intended Use Case', type: 'textarea', required: true },
    { label: 'Expected Monthly Request Volume', type: 'select', required: true, options: ['< 10k', '10k - 100k', '100k - 1M', '1M+'] },
    { label: 'Do you agree to our API Terms of Service?', type: 'checkbox', required: true, options: ['I agree'] }
  ],
  customStyles: { accentColor: '#8b5cf6', borderRadius: 16, fontFamily: 'Inter' }
};
