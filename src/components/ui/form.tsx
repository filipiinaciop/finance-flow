import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { Controller, FormProvider } from "react-hook-form";
import type { ControllerProps, FieldPath, FieldValues } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const Form = FormProvider;

// Inline FormFieldContext and FormItemContext
const FormFieldContext = React.createContext<{ name: string } | undefined>(
  undefined,
);
const FormItemContext = React.createContext<{ id: string } | undefined>(
  undefined,
);

// Inline useFormField hook
import { useFormContext } from "react-hook-form";

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { formState } = useFormContext();

  if (!fieldContext) {
    throw new Error(
      "useFormField should be used within a FormFieldContext.Provider",
    );
  }
  if (!itemContext) {
    throw new Error(
      "useFormField should be used within a FormItemContext.Provider",
    );
  }

  // Use field name and item id to ensure unique ids
  const formItemId = `${itemContext.id}-${fieldContext.name}-form-item`;
  const formDescriptionId = `${itemContext.id}-${fieldContext.name}-form-item-description`;
  const formMessageId = `${itemContext.id}-${fieldContext.name}-form-item-message`;

  // Get error from react-hook-form state
  const error = formState.errors?.[fieldContext.name as string] as
    | { message?: string }
    | undefined;

  return {
    ...fieldContext,
    formItemId,
    formDescriptionId,
    formMessageId,
    error,
  };
}

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error?.message ? String(error.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
