import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*
  AWS Amplify Gen 2 Data Resource
  Mapped from Supabase PostgreSQL Schema for Form Builder SaaS
*/

const schema = a.schema({
  User: a.model({
    id: a.id().required(),
    email: a.string().required(),
    name: a.string(),
    role: a.string().default('user'),
    avatarUrl: a.string(),
    phone: a.string(),
    isActive: a.boolean().default(true),
    isVerified: a.boolean().default(false),
    lastLogin: a.datetime(),
    forms: a.hasMany('Form', 'userId'),
    integrations: a.hasMany('UserIntegration', 'userId'),
  }).authorization((allow) => [
    allow.owner(),
    allow.guest().to(['read']),
  ]),

  Form: a.model({
    id: a.id().required(),
    userId: a.id().required(),
    user: a.belongsTo('User', 'userId'),
    title: a.string().required(),
    description: a.string(),
    published: a.boolean().default(false),
    logoUrl: a.string(),
    coverImageUrl: a.string(),
    
    // Integrations Configuration
    googleSheetId: a.string(),
    googleSheetName: a.string(),
    googleSheetEnabled: a.boolean().default(false),
    zapierWebhookUrl: a.string(),
    zapierEnabled: a.boolean().default(false),
    airtableApiKey: a.string(),
    airtableBaseId: a.string(),
    airtableTableName: a.string(),
    airtableEnabled: a.boolean().default(false),
    slackBotToken: a.string(),
    slackChannelId: a.string(),
    slackChannelName: a.string(),
    slackEnabled: a.boolean().default(false),
    emailEnabled: a.boolean().default(false),
    notificationEmail: a.string(),
    emailAppPassword: a.string(),
    emailToList: a.string(),
    emailHost: a.string().default('smtp.gmail.com'),
    emailPort: a.integer().default(465),
    emailSecure: a.boolean().default(true),

    fields: a.hasMany('FormField', 'formId'),
    submissions: a.hasMany('Submission', 'formId'),
  }).authorization((allow) => [
    allow.owner(),
    allow.guest().to(['read']),
  ]),

  FormField: a.model({
    id: a.id().required(),
    formId: a.id().required(),
    form: a.belongsTo('Form', 'formId'),
    label: a.string().required(),
    type: a.enum(['text', 'email', 'number', 'textarea', 'select', 'radio', 'checkbox', 'file']),
    required: a.boolean().default(false),
    options: a.json(), // Stores options for select/radio/checkbox
    placeholder: a.string(),
    order: a.integer().default(0),
    logicRules: a.json(), // Stores conditional logic
    pageIndex: a.integer().default(0),
  }).authorization((allow) => [
    allow.owner(),
    allow.guest().to(['read']),
  ]),

  Submission: a.model({
    id: a.id().required(),
    formId: a.id().required(),
    form: a.belongsTo('Form', 'formId'),
    data: a.json().required(),
    submittedAt: a.datetime(),
    googleSynced: a.boolean().default(false),
    zapierSynced: a.boolean().default(false),
    airtableSynced: a.boolean().default(false),
    files: a.hasMany('File', 'submissionId'),
  }).authorization((allow) => [
    allow.owner(),
    allow.guest().to(['create']), // Allow anyone to submit
  ]),

  File: a.model({
    id: a.id().required(),
    submissionId: a.id(),
    submission: a.belongsTo('Submission', 'submissionId'),
    fieldId: a.id(),
    filePath: a.string().required(),
    fileName: a.string().required(),
    fileSize: a.integer(),
    mimeType: a.string(),
    uploadedAt: a.datetime(),
  }).authorization((allow) => [
    allow.owner(),
    allow.guest().to(['create']),
  ]),

  UserIntegration: a.model({
    id: a.id().required(),
    userId: a.id().required(),
    user: a.belongsTo('User', 'userId'),
    provider: a.string().required(),
    accessToken: a.string(),
    refreshToken: a.string(),
    email: a.string(),
    expiresAt: a.datetime(),
  }).authorization((allow) => [
    allow.owner(),
  ]),

  CronError: a.model({
    id: a.id().required(),
    jobName: a.string(),
    errorMessage: a.string(),
    occurredAt: a.datetime(),
  }).authorization((allow) => [
    allow.authenticated(), // Internal use
  ]),

  // Billing Models (from users1 and invoices tables)
  BillingUser: a.model({
    id: a.id().required(),
    email: a.string().required(),
    name: a.string(),
    phone: a.string(),
    companyName: a.string(),
    subscriptionPlan: a.string().default('free'),
    invoiceCount: a.integer().default(0),
    clientCount: a.integer().default(0),
    totalRevenue: a.float().default(0),
    invoices: a.hasMany('Invoice', 'userId'),
  }).authorization((allow) => [
    allow.owner(),
  ]),

  Invoice: a.model({
    id: a.id().required(),
    userId: a.id().required(),
    billingUser: a.belongsTo('BillingUser', 'userId'),
    clientName: a.string().required(),
    clientEmail: a.string(),
    clientPhone: a.string(),
    invoiceNumber: a.string().required(),
    amount: a.float().required(),
    taxRate: a.float().default(0),
    taxAmount: a.float().default(0),
    totalAmount: a.float().required(),
    currency: a.string().default('USD'),
    status: a.enum(['draft', 'sent', 'pending', 'paid', 'overdue', 'cancelled']),
    dueDate: a.date(),
    items: a.json(), // Array of invoice items
    notes: a.string(),
  }).authorization((allow) => [
    allow.owner(),
  ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
