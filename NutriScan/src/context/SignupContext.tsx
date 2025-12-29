// context/SignupContext.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";

export interface SignupData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  dob?: string;          // date of birth
  birthday?: string;     // optional, could be same as dob
  gender?: "male" | "female" | "other";
  goal?: "lose" | "maintain" | "gain";
  height?: number;
  weight?: number;
}

interface SignupContextType {
  data: SignupData;
  setData: (newData: Partial<SignupData>) => void;
  reset: () => void;
}

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export const SignupProvider = ({ children }: { children: ReactNode }) => {
  const [data, setSignupData] = useState<SignupData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: undefined,
    goal: undefined,
    height: undefined,
    weight: undefined,
  });

  const setData = (newData: Partial<SignupData>) => {
    setSignupData((prev) => ({ ...prev, ...newData }));
  };

  const reset = () => setSignupData({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: undefined,
    goal: undefined,
    height: undefined,
    weight: undefined,
  });

  return (
    <SignupContext.Provider value={{ data, setData, reset }}>
      {children}
    </SignupContext.Provider>
  );
};

export const useSignup = () => {
  const context = useContext(SignupContext);
  if (!context) throw new Error("useSignup must be used within SignupProvider");
  return context;
};
