export type FieldType='text'|'number'|'currency'|'phone'|'email'|'date'|'select'|'checkbox'|'textarea';
export type ValidationRule={required?:boolean;min?:number;max?:number;minLength?:number;maxLength?:number;pattern?:string;message?:string};
export type DynamicField={id:string;sectionKey:string;fieldKey:string;label:string;type:FieldType;sortOrder:number;isVisible:boolean;isSystem:boolean;validation:ValidationRule;options?:string[]};
