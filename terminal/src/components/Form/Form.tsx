import {
  FieldInputProps,
  FieldMetaProps,
  Form as FormBase,
  FormikConfig as FormikConfigBase,
  FormikContextType,
  FormikProvider,
  FormikValues,
  useFormik as useFormikBase,
  FieldHelperProps,
} from 'formik';
import React from 'react';
import { useUpdateEffect } from 'react-use';
import { Schema } from 'yup';

export * from 'formik';
export * from './Form.styles';

export type FormikFieldProps<TValue = any> = FieldMetaProps<TValue> &
  FieldInputProps<TValue> &
  FieldHelperProps<TValue>;

export type GenericInputProps<TValue = string> = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> & {
  value?: TValue;
};

export type GenericSelectProps<TValue = string> = Omit<React.InputHTMLAttributes<HTMLSelectElement>, 'value'> & {
  value?: TValue;
};

export type GenericTextareaProps<TValue = string> = Omit<React.InputHTMLAttributes<HTMLTextAreaElement>, 'value'> & {
  value?: TValue;
};

export interface FormikConfig<TValues extends FormikValues = FormikValues, TContext extends {} = any>
  extends Omit<FormikConfigBase<TValues>, 'initialValues'> {
  validationContext?: TContext;
  validationSchema?: Schema<TValues>;
  validateOnValidationChange?: boolean;
  initialValues: Partial<TValues>;
}

export function useFormik<TValues extends FormikValues = FormikValues, TContext extends {} = any>(
  args: FormikConfig<TValues, TContext>
) {
  const {
    validate,
    validationSchema: $$validationSchema,
    validationContext,
    validateOnValidationChange = true,
    ...rest
  } = args;

  const validationSchema = React.useMemo(() => {
    if (!$$validationSchema) {
      return undefined;
    }

    return new Proxy($$validationSchema, {
      get: (object, property) => {
        if (property === 'validate') {
          const fn: Schema<any>['validate'] = (value, options) => {
            return $$validationSchema.validate(value, { ...options, context: validationContext });
          };

          return fn;
        }

        if (property === 'validateSync') {
          const fn: Schema<any>['validateSync'] = (value, options) => {
            return $$validationSchema.validateSync(value, { ...options, context: validationContext });
          };

          return fn;
        }

        if (property === 'validateAt') {
          const fn: Schema<any>['validateAt'] = (path, value, options) => {
            return $$validationSchema.validateAt(path, value, { ...options, context: validationContext });
          };

          return fn;
        }

        return (object as any)[property];
      },
    }) as Schema<any>;
  }, [validationContext, $$validationSchema]);

  const formik = useFormikBase({ ...rest, validate, validationSchema } as FormikConfigBase<TValues>);
  useUpdateEffect(() => {
    if (!!validateOnValidationChange) {
      formik.validateForm();
    }
  }, [validate, validationSchema, validateOnValidationChange]);

  return formik;
}

export interface FormProps {
  formik: FormikContextType<any>;
}

export const Form: React.FC<React.PropsWithChildren<FormProps>> = (props) => {
  return (
    <FormikProvider value={props.formik}>
      <FormBase>{props.children}</FormBase>
    </FormikProvider>
  );
};
