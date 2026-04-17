export type FieldType = 'text' | 'email' | 'number' | 'textarea' | 'select' | 'multiselect' | 'radio' | 'checkbox' | 'file' | 'multifile';

export interface FormField {
  id: string; // Crucial for dnd-kit. Generate via crypto.randomUUID() or a simple counter.
  label: string;
  type: FieldType;
  required: boolean;
  options: string[] | null;
  placeholder: string | null;
  fileMode?: 'upload' | 'link';
}

export interface CustomStyles {
  headerBg: string;
  headerText: string;
  bodyBg: string;
  bodyText: string;
  accentColor: string;
  buttonText: string;
  fontFamily: string;
  inputBorderColor: string;
  inputBg: string;
  labelColor: string;
  containerWidth: number;
  containerPadding: number;
  borderRadius: number;
  boxShadow: string;
  fontSizeBase: number;
  fieldSpacing: number;
  labelWeight: 'normal' | 'semibold' | 'bold';
  buttonStyle: 'rounded' | 'pill' | 'square';
  inputVariant: 'outline' | 'filled' | 'underline';
  logoHeight: number;
  logoAlignment: 'left' | 'center' | 'right';
  logoBorderRadius: number;
  coverHeight: number;
  pageBgColor: string;
  pageBgImage: string;
  pageBgBlur: number;
  pageBgOverlayOpacity: number;
  formScale: number;
  headerAlignment: 'left' | 'center' | 'right';
  coverImageFit: 'cover' | 'contain' | 'fill';
}

export interface FormSettings {
  submitButtonText: string;
  thankYouHeadline: string;
  thankYouMessage: string;
  redirectUrl: string;
}

export const DEFAULT_SETTINGS: FormSettings = {
  submitButtonText: 'Submit Form',
  thankYouHeadline: 'Thank You!',
  thankYouMessage: 'Your response has been successfully submitted.',
  redirectUrl: '',
}

export const AVAILABLE_FONTS = [
  'Inter',
  'Roboto',
  'Playfair Display',
  'Outfit',
  'Space Grotesk',
  'DM Sans',
  'Plus Jakarta Sans',
  'Inconsolata'
]

export const DEFAULT_STYLES: CustomStyles = {
  headerBg: '#4f46e5',
  headerText: '#ffffff',
  bodyBg: '#ffffff',
  bodyText: '#111827',
  accentColor: '#4f46e5',
  buttonText: '#ffffff',
  fontFamily: 'Inter',
  inputBorderColor: '#e5e7eb',
  inputBg: '#f9fafb',
  labelColor: '#111827',
  containerWidth: 640,
  containerPadding: 40,
  borderRadius: 16,
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  fontSizeBase: 16,
  fieldSpacing: 32,
  labelWeight: 'bold',
  buttonStyle: 'rounded',
  inputVariant: 'outline',
  logoHeight: 48,
  logoAlignment: 'left',
  logoBorderRadius: 8,
  coverHeight: 240,
  pageBgColor: '#f3f4f6',
  pageBgImage: '',
  pageBgBlur: 0,
  pageBgOverlayOpacity: 10,
  formScale: 1,
  headerAlignment: 'left',
  coverImageFit: 'cover'
};

export const PRESET_THEMES: Record<string, Partial<CustomStyles>> = {
  'minimal-light': {
    ...DEFAULT_STYLES,
    headerBg: '#ffffff',
    headerText: '#111827',
    bodyBg: '#ffffff',
    pageBgColor: '#f9fafb',
    accentColor: '#000000',
    fontFamily: 'Inter',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    borderRadius: 8,
  },
  'midnight-glass': {
    ...DEFAULT_STYLES,
    pageBgColor: '#0a0a0a',
    bodyBg: 'rgba(25, 25, 25, 0.65)',
    headerBg: 'transparent',
    headerText: '#ffffff',
    bodyText: '#e5e5e5',
    labelColor: '#ffffff',
    inputBg: 'rgba(255, 255, 255, 0.05)',
    inputBorderColor: 'rgba(255, 255, 255, 0.1)',
    accentColor: '#8b5cf6',
    fontFamily: 'Outfit',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    borderRadius: 24,
  },
  'notion-style': {
    ...DEFAULT_STYLES,
    headerBg: '#ffffff',
    headerText: '#37352f',
    bodyBg: '#ffffff',
    pageBgColor: '#ffffff',
    bodyText: '#37352f',
    labelColor: '#37352f',
    inputBg: '#ffffff',
    inputBorderColor: '#e5e5e5',
    accentColor: '#2eaadc',
    fontFamily: 'Playfair Display',
    boxShadow: 'none',
    borderRadius: 4,
    containerWidth: 700,
  },
  'brutalist': {
    ...DEFAULT_STYLES,
    headerBg: '#ffeb3b',
    headerText: '#000000',
    bodyBg: '#ffffff',
    pageBgColor: '#e0e0e0',
    bodyText: '#000000',
    labelColor: '#000000',
    inputBg: '#ffffff',
    inputBorderColor: '#000000',
    accentColor: '#ff1744',
    fontFamily: 'Space Grotesk',
    boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)',
    borderRadius: 0,
    containerWidth: 640,
  },
  'ocean-breeze': {
    ...DEFAULT_STYLES,
    pageBgColor: '#e0f2fe',
    bodyBg: '#ffffff',
    headerBg: '#0ea5e9',
    headerText: '#ffffff',
    bodyText: '#0f172a',
    labelColor: '#0369a1',
    inputBg: '#f0f9ff',
    inputBorderColor: '#bae6fd',
    accentColor: '#0ea5e9',
    fontFamily: 'Plus Jakarta Sans',
    boxShadow: '0 20px 25px -5px rgba(14, 165, 233, 0.1), 0 8px 10px -6px rgba(14, 165, 233, 0.1)',
    borderRadius: 32,
  }
};
