import { businessTemplates } from './categories/business';
import { marketingTemplates } from './categories/marketing';
import { feedbackTemplates } from './categories/feedback';
import { healthTemplates } from './categories/health';
import { educationTemplates } from './categories/education';
import { realEstateTemplates } from './categories/real-estate';
import { ecommerceTemplates } from './categories/ecommerce';
import { itTemplates } from './categories/it';
import { hrTemplates } from './categories/hr';
import { creativeTemplates } from './categories/creative';

export * from './types';

export const TEMPLATES = [
  ...businessTemplates,
  ...marketingTemplates,
  ...feedbackTemplates,
  ...healthTemplates,
  ...educationTemplates,
  ...realEstateTemplates,
  ...ecommerceTemplates,
  ...itTemplates,
  ...hrTemplates,
  ...creativeTemplates
];
