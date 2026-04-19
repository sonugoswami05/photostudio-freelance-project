"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

type ModalType = "login" | "signup" | "enquire" | "profile" | null;

interface ModalContextValue {
  activeModal: ModalType;
  enquireService: string;
  user: User | null;
  openLogin: () => void;
  openSignup: () => void;
  openEnquire: (service?: string) => void;
  openProfile: () => void;
  closeModal: () => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [enquireService, setEnquireService] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const refreshUser = async () => {
    const { data: { user: u } } = await supabase.auth.getUser();
    setUser(u);
  };

  return (
    <ModalContext.Provider
      value={{
        activeModal,
        enquireService,
        user,
        openLogin: () => setActiveModal("login"),
        openSignup: () => setActiveModal("signup"),
        openEnquire: (service = "") => { setEnquireService(service); setActiveModal("enquire"); },
        openProfile: () => setActiveModal("profile"),
        closeModal: () => setActiveModal(null),
        logout,
        refreshUser,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be inside ModalProvider");
  return ctx;
}
