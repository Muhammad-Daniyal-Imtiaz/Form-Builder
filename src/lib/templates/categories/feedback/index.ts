import { customerSatisfaction } from './customer-satisfaction';
import { productReview } from './product-review';
import { websiteFeedback } from './website-feedback';
import { npsSurvey } from './nps-survey';
import { uxBetaFeedback } from './ux-beta-feedback';
import { featurePriority } from './feature-priority';
import { serviceLevelSurvey } from './service-level-survey';

export const feedbackTemplates = [
  customerSatisfaction,
  productReview,
  websiteFeedback,
  npsSurvey,
  uxBetaFeedback,
  featurePriority,
  serviceLevelSurvey
];
