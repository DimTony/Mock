import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, User, RegisterData } from "@/types/auth";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: true, // Start with loading true

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const result = await res.json();

          console.log("STORE LOGIN Result:", result);

          if (!result.success) {
            // Check if it's an email verification issue
            if (result.data?.requiresVerification) {
              const error = new Error(
                result.error || "Email verification required"
              );
              (error as any).code = "EMAIL_VERIFICATION_REQUIRED";
              (error as any).email = result.data.email;
              throw error;
            }

            // For other errors, throw with the actual message
            throw new Error(result.error || "Login failed");
          }

          set({
            token: result?.data?.accessToken,
          });

          const token = useAuthStore.getState().token;

          const response = await fetch("/api/user", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          const userResult = await response.json();

          console.log("STORE USER Result:", userResult);

          if (!userResult.success) throw new Error("User Profile fetch failed");

          set({ user: userResult?.data, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });
        try {
          const formData = new FormData();
          Object.entries(data).forEach(([key, value]) => {
            if (key === "files") {
              (value as File[]).forEach((file, index) => {
                formData.append(`file_${index}`, file);
              });
            } else {
              formData.append(key, value as string);
            }
          });

          const res = await fetch("/api/auth/register", {
            method: "POST",
            body: formData,
          });

          const result = await res.json();

          console.log("STORE REG Result:", result);

          if (!result.success) {
            throw new Error(result?.error || "Registration failed");
          }

          // Check if registration was successful but requires email verification
          if (result.success && result.data?.requiresVerification) {
            const error = new Error(
              result.message ||
                "Registration successful! Please verify your email."
            );
            (error as any).code = "REGISTRATION_SUCCESS_VERIFICATION_REQUIRED";
            (error as any).email = result.data.email;
            throw error;
          }

          set({
            token: result?.data?.accessToken,
          });

          const token = useAuthStore.getState().token;

          const response = await fetch("/api/user", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          const userResult = await response.json();

          console.log("STORE USER Result:", userResult);

          if (!userResult.success) throw new Error("User Profile fetch failed");

          set({ user: userResult?.data, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null });
      },

      checkAuth: () => {
        const { token } = get();
        if (!token) {
          set({ user: null });
        }
        set({ isLoading: false }); // Always set loading to false after check
      },
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        // Called after rehydration, ensure we check auth
        if (state) {
          state.checkAuth();
        }
      },
    }
  )
);
