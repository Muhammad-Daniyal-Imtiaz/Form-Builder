import { defineFunction } from '@aws-amplify/backend';

export const submissionProcessor = defineFunction({
  name: 'submission-processor',
  schedule: '* * * * *' // Run every minute to process the queue
});
