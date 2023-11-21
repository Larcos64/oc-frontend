import { Operator } from '../dependencies/services/operators.service';
export interface Validator {
  name: string;
  validator?: any;
  message: string;
  operator?: string;
}
export interface FieldConfig {
  id?: number;
  label?: string;
  name?: string;
  information?: string;
  description?: string;
  disabled?: boolean;
  class?: string;
  inputType?: string;
  options?: string[];
  accept?: string;
  collections?: any;
  type: string;
  value?: any;
  validations?: Validator[];
  error?: string;
  nameSection?: string;
  visibilityQues?: boolean;
  limit_file?: string;
  itemValue?: any;
}
