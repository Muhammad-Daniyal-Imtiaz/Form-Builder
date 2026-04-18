import { Template } from '../../types';

export const remoteWorkAgreement: Template = {
  id: 'hr-remote-work',
  name: 'Remote Work Agreement',
  description: 'Terms and home office setup confirmation for flexible workers.',
  category: 'HR',
  icon: 'briefcase',
  fields: [
    { label: 'Employee Name', type: 'text', required: true },
    { label: 'Primary Remote Work Location (Address)', type: 'textarea', required: true },
    { label: 'Days working remotely', type: 'checkbox', required: true, options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
    { label: 'I confirm my home office meets safety standards', type: 'radio', required: true, options: ['Yes', 'No'] },
    { label: 'I have secure, reliable internet access', type: 'radio', required: true, options: ['Yes', 'No'] },
    { label: 'Digital Signature (Type Name)', type: 'text', required: true }
  ],
  customStyles: { accentColor: '#8b5cf6', borderRadius: 4, fontFamily: 'Inter' }
};
