import { Template } from '../../types';

export const securityReport: Template = {
  id: 'it-security',
  name: 'Security Vulnerability Disclosure',
  description: 'Responsible disclosure intake for whitehat hackers and security researchers.',
  category: 'IT',
  icon: 'help',
  fields: [
    { label: 'Researcher Name / Handle', type: 'text', required: false },
    { label: 'Contact Email', type: 'email', required: true },
    { label: 'Vulnerability Type', type: 'select', required: true, options: ['XSS', 'CSRF', 'SQL Injection', 'Authentication Bypass', 'Data Exposure', 'Other'] },
    { label: 'Severity Estimate (CVSS)', type: 'select', required: false, options: ['Low', 'Medium', 'High', 'Critical'] },
    { label: 'Endpoint / URL affected', type: 'text', required: true },
    { label: 'Proof of Concept (PoC) / Repo Steps', type: 'textarea', required: true },
    { label: 'Upload Video / Evidence', type: 'file', required: false }
  ],
  customStyles: { accentColor: '#1e293b', borderRadius: 0, fontFamily: 'Outfit' }
};
