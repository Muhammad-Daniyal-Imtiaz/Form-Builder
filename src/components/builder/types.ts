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
  headerAlignment: 'left' | 'center' | 'right';
}

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
  headerAlignment: 'left',
};
