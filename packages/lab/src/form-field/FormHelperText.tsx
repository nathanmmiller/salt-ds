import { ComponentPropsWithoutRef } from "react";
import { FormFieldProps } from "./FormField";
import { classBase } from "./constant";

export type FormHelperTextProps<E extends React.ElementType = "p"> =
  ComponentPropsWithoutRef<E> & {
    helperText: FormFieldProps["helperText"];
    helperTextPlacement: FormFieldProps["helperTextPlacement"];
  };

export const FormHelperText = <E extends React.ElementType = "p">({
  helperText,
  helperTextPlacement,
  ...restProps
}: FormHelperTextProps<E>) => {
  if (helperText) {
    if (helperTextPlacement === "bottom") {
      return (
        <p className={`${classBase}-helperText`} {...restProps}>
          {helperText}
        </p>
      );
    } else if (helperTextPlacement === "tooltip") {
      console.warn("helperTextPlacement tooltip has not yet implemented");
      return null;
    } else {
      return null;
    }
  } else {
    return null;
  }
};