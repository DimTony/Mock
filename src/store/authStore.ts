import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, User, RegisterData } from "@/types/auth";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: true,
      isCheckingAuth: false, // Add this to prevent multiple simultaneous calls

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const result = await res.json();

          if (!result.success) {
            if (result.data?.requiresVerification) {
              const error = new Error(
                result.error || "Email verification required"
              );
              (error as any).code = "EMAIL_VERIFICATION_REQUIRED";
              (error as any).email = result.data.email;
              throw error;
            }
            throw new Error(result.error || "Login failed");
          }

          set({
            token: result?.data?.accessToken,
          });

          // Fetch user data immediately after login
          await get().fetchUserData();
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

          if (!result.success) {
            throw new Error(result?.error || "Registration failed");
          }

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

          // Fetch user data immediately after registration
          await get().fetchUserData();
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, isLoading: false });
      },

      // Separate function to fetch user data
      fetchUserData: async () => {
        const { token, isCheckingAuth } = get();

        if (!token || isCheckingAuth) {
          set({ isLoading: false });
          return;
        }

        try {
          const response = await fetch("/api/user", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          const userResult = await response.json();

          if (!userResult.success) {
            throw new Error("User Profile fetch failed");
          }

          set({
            user: userResult?.data,
            isLoading: false,
          });
        } catch (error) {
          console.error("Fetch user data failed:", error);
          set({ user: null, token: null, isLoading: false });
          throw error;
        }
      },

      checkAuth: async () => {
        const { token, isCheckingAuth } = get();

        // Prevent multiple simultaneous calls
        if (isCheckingAuth) {
          console.log("Auth check already in progress, skipping...");
          return;
        }

        // If no token, clear user and stop loading
        if (!token) {
          set({ user: null, isLoading: false });
          return;
        }

        set({ isLoading: true, isCheckingAuth: true });

        try {
          const response = await fetch("/api/user", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          const userResult = await response.json();

          if (!userResult.success) {
            console.log("Token invalid, clearing auth state");
            set({
              user: null,
              token: null,
              isLoading: false,
              isCheckingAuth: false,
            });
            return;
          }

          set({
            user: userResult?.data,
            isLoading: false,
            isCheckingAuth: false,
          });
        } catch (error) {
          console.error("Auth check failed:", error);
          set({
            user: null,
            token: null,
            isLoading: false,
            isCheckingAuth: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      // Remove the onRehydrateStorage callback to prevent automatic checkAuth
      // We'll handle this manually in the app
    }
  )
);
