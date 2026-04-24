import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { submissionProcessor } from './functions/submission-processor/resource';
import { sendBillReminders } from './functions/send-bill-reminders/resource';

defineBackend({
  auth,
  data,
  storage,
  submissionProcessor,
  sendBillReminders,
});
