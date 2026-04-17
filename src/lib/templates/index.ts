import { businessTemplates } from './categories/business';
import { marketingTemplates } from './categories/marketing';
import { feedbackTemplates } from './categories/feedback';
import { healthTemplates } from './categories/health';
import { educationTemplates } from './categories/education';

export * from './types';

export const TEMPLATES = [
  ...businessTemplates,
  ...marketingTemplates,
  ...feedbackTemplates,
  ...healthTemplates,
  ...educationTemplates
];
