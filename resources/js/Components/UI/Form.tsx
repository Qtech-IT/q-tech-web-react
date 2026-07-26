import * as React from 'react'
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
} from 'react-hook-form'
import type { ControllerProps, FieldValues } from 'react-hook-form'

import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/Utils/helpers'
import { Label } from '@/Components/UI/Label'

const Form = FormProvider

// ------------------- Form Field Context -------------------
interface FormFieldContextType {
  name?: string
}

const FormFieldContext = React.createContext<FormFieldContextType>({})

// ------------------- Form Field -------------------
interface FormFieldProps extends ControllerProps<FieldValues> {
  name: string
}

const FormField: React.FC<FormFieldProps> = (props) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

// ------------------- Form Item Context -------------------
interface FormItemContextType {
  id: string
}

const FormItemContext = React.createContext<FormItemContextType>({} as FormItemContextType)

// ------------------- useFormField Hook -------------------
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)

  if (!fieldContext?.name) {
    throw new Error('useFormField should be used within <FormField>')
  }

  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

// ------------------- FormItem -------------------
interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {}

const FormItem: React.FC<FormItemProps> = ({ className, ...props }) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div data-slot="form-item" className={cn('grid gap-2', className)} {...props} />
    </FormItemContext.Provider>
  )
}

// ------------------- FormLabel -------------------
interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean|undefined
}

const FormLabel: React.FC<FormLabelProps> = ({ className, required, children, ...props }) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn('data-[error=true]:text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    >
      {children}
      {required && <span className="text-red-500">*</span>}
    </Label>
  )
}


// ------------------- FormControl -------------------
interface FormControlProps extends React.HTMLAttributes<HTMLElement> {}

const FormControl: React.FC<FormControlProps> = (props) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={!error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  )
}

// ------------------- FormDescription -------------------
interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const FormDescription: React.FC<FormDescriptionProps> = ({ className, ...props }) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

// ------------------- FormMessage -------------------
interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const FormMessage: React.FC<FormMessageProps> = ({ className, children, ...props }) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? '') : children

  if (!body) return null

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn('text-destructive text-sm', className)}
      {...props}
    >
      {body}
    </p>
  )
}

// ------------------- Exports -------------------
export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
