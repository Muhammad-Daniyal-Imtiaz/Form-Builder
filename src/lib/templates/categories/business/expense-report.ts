import { Template } from '../../types';

export const expenseReport: Template = {
  id: 'expense-report',
  name: 'Expense Reimbursement',
  description: 'Easy-to-use form for employees to report business-related expenditures.',
  category: 'Business',
  icon: 'briefcase',
  fields: [
    { label: 'Employee Name', type: 'text', required: true },
    { label: 'Department', type: 'select', required: true, options: ['Sales', 'Engineering', 'Marketing', 'Executive', 'Human Resources'] },
    { label: 'Expense Category', type: 'select', required: true, options: ['Travel', 'Meals', 'Office Supplies', 'Software/SaaS', 'Other'] },
    { label: 'Amount', type: 'number', required: true, placeholder: '0.00' },
    { label: 'Date of Expense', type: 'text', required: true, placeholder: 'YYYY-MM-DD' },
    { label: 'Receipt Upload', type: 'file', required: true },
    { label: 'Description', type: 'textarea', required: false }
  ],
  customStyles: {
    accentColor: '#10b981',
    borderRadius: 4,
    fontFamily: 'Roboto',
    inputVariant: 'outline'
  }
};
