import { createContext, useContext } from "react";

type FormAction = (payload: FormData) => void;

export const FormActionContext = createContext<FormAction | undefined>(
  undefined,
);

export const FormActionProvider = FormActionContext.Provider;

export function useFormAction() {
  const context = useContext(FormActionContext);
  if (context === undefined)
    throw new Error("useFormAction must be used within a FormActionProvider");

  return context;
}
