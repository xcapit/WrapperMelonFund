import React from 'react';
import { DecoratorFn } from '@storybook/react';
import { useFormik, Form } from './Form';

export function withForm(): DecoratorFn {
  return (story) => {
    const formik = useFormik({
      initialValues: {},
      onSubmit: (values) => {
        alert(JSON.stringify(values, null, 2));
      },
    });

    return <Form formik={formik}>{story()}</Form>;
  };
}
