import { Template } from '../../types';

export const rmaReturn: Template = {
  id: 'ecommerce-rma',
  name: 'RMA / Return Request',
  description: 'Automated return merchandise authorization for seamless customer returns.',
  category: 'E-commerce',
  icon: 'chart',
  fields: [
    { label: 'Order Number', type: 'text', required: true },
    { label: 'Customer Email', type: 'email', required: true },
    { label: 'Reason for Return', type: 'select', required: true, options: ['Defective / Damaged', 'Wrong Item Sent', 'Changed Mind', 'Item did not match description', 'Other'] },
    { label: 'Detailed Explanation', type: 'textarea', required: true },
    { label: 'Upload Photo of Item (if damaged)', type: 'file', required: false },
    { label: 'Preferred Resolution', type: 'radio', required: true, options: ['Refund to Original Payment', 'Store Credit', 'Replacement Item'] }
  ],
  customStyles: { accentColor: '#ef4444', borderRadius: 8, fontFamily: 'Inter' }
};
