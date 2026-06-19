export type FieldType = "text" | "email" | "password" | "number" | "date" | "select" | "textarea";

export interface FormField {
    name:string ;
    label: string;
    type: FieldType;
    placeholder?:string;
    required?: boolean;
    options?: {label:string, value: any}[]; // Pour les champs de type "select"
}