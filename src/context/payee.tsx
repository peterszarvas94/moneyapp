import { createContext, useContext } from "react";

type Context = {
  payeeId: string;
}

export const PayeeContext = createContext<Context | null>(null);

export function usePayeeContext() {
  const context = useContext(PayeeContext);
  if (context === null) {
    throw new Error("usePayee must be used within a PayeeContextProvider");
  }
  
  return context;
}
