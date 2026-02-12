import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiFetch, ApiError } from "@/lib/api";
import type {
   User,
   AuthResponse,
   LoginFormData,
   RegisterFormData,
} from "@/lib/types";

interface AuthState {
   user: User | null;
   token: string | null;
   loading: boolean;

   login: (
      data: LoginFormData,
   ) => Promise<
      | { ok: true }
      | { ok: false; message: string; errors?: Record<string, string[]> }
   >;

   register: (
      data: RegisterFormData,
   ) => Promise<
      | { ok: true }
      | { ok: false; message: string; errors?: Record<string, string[]> }
   >;

   logout: () => void;
   logoutAsync: () => Promise<void>;
   refreshToken: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
   persist(
      (set, get) => ({
         user: null,
         token: null,
         loading: false,

         login: async (data) => {
            set({ loading: true });
            try {
               const res = await apiFetch<AuthResponse>("/api/login", {
                  method: "POST",
                  body: data,
               });
               set({ user: res.user, token: res.access_token, loading: false });
               return { ok: true };
            } catch (err) {
               set({ loading: false });
               if (err instanceof ApiError) {
                  return {
                     ok: false,
                     message: err.message,
                     errors: err.errors,
                  };
               }
               return { ok: false, message: "An unexpected error occurred." };
            }
         },

         register: async (data) => {
            set({ loading: true });
            try {
               const res = await apiFetch<AuthResponse>("/api/register", {
                  method: "POST",
                  body: data,
               });
               set({ user: res.user, token: res.access_token, loading: false });
               return { ok: true };
            } catch (err) {
               set({ loading: false });
               if (err instanceof ApiError) {
                  return {
                     ok: false,
                     message: err.message,
                     errors: err.errors,
                  };
               }
               return { ok: false, message: "An unexpected error occurred." };
            }
         },

         logout: () => {
            set({ user: null, token: null });
         },

         logoutAsync: async () => {
            const token = get().token;
            set({ user: null, token: null });
            if (token) {
               try {
                  await apiFetch("/api/logout", {
                     method: "POST",
                     token,
                  });
               } catch {
                  // Token already cleared — ignore errors
               }
            }
         },

         refreshToken: async () => {
            const token = get().token;
            if (!token) return false;
            try {
               const res = await apiFetch<AuthResponse>("/api/refresh", {
                  method: "POST",
                  token,
               });
               set({ token: res.access_token, user: res.user ?? get().user });
               return true;
            } catch {
               set({ user: null, token: null });
               return false;
            }
         },
      }),
      {
         name: "auth-storage",
         partialize: (state) => ({ user: state.user, token: state.token }),
      },
   ),
);
