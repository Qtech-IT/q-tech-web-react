import z from 'zod';
import type { FormField } from '@/Types/crud';

/**
 * Builds a Zod schema from form field configuration
 * Handles both flat and nested field names (e.g., "address.full_address")
 * 
 * @param fields - Array of form field configurations
 * @returns Zod object schema
 * 
 * @example
 * const schema = buildZodSchemaFromFields(config.form.fields);
 * const form = useForm({
 *   resolver: zodResolver(schema),
 *   defaultValues: {...}
 * });
 */
export function buildZodSchemaFromFields(fields: FormField[]): z.ZodObject<any> {
  const schema: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    // A field without a validation rule contributes nothing to the schema.
    // Skipping it keeps the shape free of `undefined` entries, which Zod would
    // reject at object construction.
    if (!field.validation) return;

    if (field.name.includes('.')) {
      // Handle nested fields like "address.full_address"
      const [parent, child] = field.name.split('.');

      if (!schema[parent!] as any) {
        schema[parent!] = z.object({});
      }

      const parentSchema = schema[parent!] as z.ZodObject<any>;
      const currentShape = parentSchema.shape || {};

      schema[parent!] = z.object({
        ...currentShape,
        [child!]: field.validation,
      });
    } else {
      // Handle simple fields
      schema[field.name] = field.validation;
    }
  });

  return z.object(schema);
}

/**
 * Alternative: Builds schema from validation rules object
 * Useful if your config has a separate validationRules object
 * 
 * @example
 * const schema = buildZodSchemaFromRules(config.formValidationRules);
 */
export function buildZodSchemaFromRules(
  rules: Record<string, z.ZodTypeAny>
): z.ZodObject<any> {
  const schema: Record<string, z.ZodTypeAny> = {};

  Object.entries(rules).forEach(([fieldName, validation]) => {
    if (fieldName.includes('.')) {
      const [parent, child] = fieldName.split('.');

      if (!schema[parent!]) {
        schema[parent!] = z.object({});
      }

      const parentSchema = schema[parent!] as z.ZodObject<any>;
      const currentShape = parentSchema.shape || {};

      schema[parent!] = z.object({
        ...currentShape,
        [child!]: validation,
      });
    } else {
      schema[fieldName] = validation;
    }
  });

  return z.object(schema);
}