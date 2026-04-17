export interface TemplateField {
  label: string;
  type: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export type TemplateCategory = 'Business' | 'Marketing' | 'Feedback' | 'Health' | 'Education';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  icon: string;
  fields: TemplateField[];
  customStyles?: {
    accentColor?: string;
    borderRadius?: number;
    fontFamily?: string;
    buttonStyle?: 'rounded' | 'pill' | 'square';
    inputVariant?: 'outline' | 'filled' | 'underline';
    bodyBg?: string;
    bodyText?: string;
  };
}
