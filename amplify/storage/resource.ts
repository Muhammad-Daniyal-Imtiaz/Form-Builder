import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'formBuilderStorage',
  access: (allow) => ({
    'form-uploads/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
      allow.guest.to(['write']), // Allow guests to upload files for form submissions
    ],
    'logos/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
      allow.guest.to(['read']),
    ],
    'covers/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
      allow.guest.to(['read']),
    ]
  })
});
