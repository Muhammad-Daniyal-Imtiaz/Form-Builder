import { Template } from '../../types';

export const productReview: Template = {
  id: 'feedback-product-review',
  name: 'Product Review',
  description: 'Collect high-quality product reviews with ratings and photo uploads.',
  category: 'Feedback',
  icon: 'star',
  fields: [
    { label: 'Overall Rating', type: 'radio', required: true, options: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'] },
    { label: 'Review Headline', type: 'text', required: true, placeholder: 'Summarize your experience' },
    { label: 'Detailed Review', type: 'textarea', required: true, placeholder: 'What did you think of the product?' },
    { label: 'Add Photos', type: 'file', required: false },
    { label: 'Would you recommend this?', type: 'radio', required: true, options: ['Yes', 'No'] }
  ],
  customStyles: {
    accentColor: '#f59e0b',
    borderRadius: 8,
    fontFamily: 'Inter',
    inputVariant: 'outline'
  }
};
