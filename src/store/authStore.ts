import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, User, RegisterData, NewDeviceData, NewSubscriptionData } from "@/types/auth";

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

      retrieveUserData: async () => {
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
            throw new Error("User Profile retrieval failed");
          }

          // set({
          //   user: userResult?.data,
          //   isLoading: false,
          // });

          return userResult;
        } catch (error) {
          console.error("Retrieving user data failed:", error);
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

      checkOnboarding: async (imei: string) => {
        // set({ isLoading: true });

        const { token, isCheckingAuth } = get();

        if (!token || isCheckingAuth) {
          set({ isLoading: false });
          return;
        }

        try {
          const res = await fetch("/api/device/check", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ imei }),
          });

          const result = await res.json();

          if (!result.success) {
            throw new Error(result.error || "Device check failed");
          }

          set({
            isLoading: false,
          });

          return result;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      setupDevice: async (imei: string, deviceName: string) => {
        // set({ isLoading: true });

        const { token, isCheckingAuth } = get();

        if (!token || isCheckingAuth) {
          set({ isLoading: false });
          return;
        }

        try {
          const res = await fetch("/api/device/setup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ imei, deviceName }),
          });

          const result = await res.json();

          if (!result.success) {
            throw new Error(result.error || "OTP Setup failed");
          }

          set({
            isLoading: false,
          });

          return result;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      activateSubscription: async (
        subscriptionId: string,
        totpCode: string,
        imei: string
      ) => {
        const { token } = get();

        if (!token) {
          throw new Error("No authentication token");
        }

        try {
          const response = await fetch(`/api/subscriptions/activate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              subscriptionId,
              imei,
              totpCode,
            }),
          });

          const result = await response.json();

          if (!response.ok) {
            return {
              success: false,
              error: result.error || "Failed to activate subscription",
            };
          }

          return {
            success: true,
            data: result.data,
          };
        } catch (error) {
          console.error("Activate subscription error:", error);
          return {
            success: false,
            error: "Failed to activate subscription",
          };
        }
      },

      fetchOptionsById: async (subscriptionId: string) => {
        // set({ isLoading: true });

        const { token, isCheckingAuth } = get();

        if (!token || isCheckingAuth) {
          set({ isLoading: false });
          return;
        }

        try {
          const res = await fetch(
            `/api/subscriptions/${subscriptionId}/options`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              // body: JSON.stringify({ imei }),
            }
          );

          const result = await res.json();

          if (!result.success) {
            throw new Error(result.error || "Options fetch failed");
          }

          set({
            isLoading: false,
          });

          return result;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      checkEncryption: async (ip: string) => {
        // set({ isLoading: true });

        const { token, isCheckingAuth } = get();

        if (!token || isCheckingAuth) {
          set({ isLoading: false });
          return;
        }

        try {
          const res = await fetch(
            `/api/device/check/encryption`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ ip }),
            }
          );

          console.log("RESSSS:", res);

          const result = await res.json();



          if (!result.success) {
            throw new Error(result.error || "IP check fetch failed");
          }

          set({
            isLoading: false,
          });

          return result;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      renewSubscription: async (
        subscriptionId: string,
        newPlan: string,
        paymentMethod: string
      ) => {
        // set({ isLoading: true });

        const { token, isCheckingAuth } = get();

        if (!token || isCheckingAuth) {
          set({ isLoading: false });
          return;
        }

        try {
          const res = await fetch(
            `/api/subscriptions/${subscriptionId}/renew`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ subscriptionId, newPlan, paymentMethod }),
            }
          );

          const result = await res.json();

          if (!result.success) {
            throw new Error(result.error || "Subscription renewal ailed");
          }

          set({
            isLoading: false,
          });

          return result;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      searchDevice: async (debouncedSearchQuery: any) => {
        // set({ isLoading: true });

        const { token, isCheckingAuth } = get();

        if (!token || isCheckingAuth) {
          set({ isLoading: false });
          return;
        }

        try {
          const res = await fetch(
            `/api/device/search?q=${encodeURIComponent(debouncedSearchQuery)}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              // body: JSON.stringify({ subscriptionId, newPlan, paymentMethod }),
            }
          );

          const result = await res.json();

          if (!result.success) {
            throw new Error(result.error || "Search failed");
          }

          set({
            isLoading: false,
          });

          return result;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      addNewDevice: async (data: NewDeviceData) => {
        // set({ isLoading: true });

        const { token, isCheckingAuth } = get();

        if (!token || isCheckingAuth) {
          set({ isLoading: false });
          return;
        }

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

          const res = await fetch("/api/device/add", {
            method: "POST",
            headers: {
              // "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });

          const result = await res.json();

          if (!result.success) {
            throw new Error(result.error || "Adding New Device failed");
          }

          set({
            isLoading: false,
          });

          return result;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      addSubscription: async (data: NewSubscriptionData) => {
        // set({ isLoading: true });

        const { token, isCheckingAuth } = get();

        if (!token || isCheckingAuth) {
          set({ isLoading: false });
          return;
        }

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

          const res = await fetch("/api/device/subscribe", {
            method: "POST",
            headers: {
              // "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });

          const result = await res.json();

          if (!result.success) {
            throw new Error(result.error || "Adding New Device failed");
          }

          set({
            isLoading: false,
          });

          return result;
        } catch (error) {
          set({ isLoading: false });
          throw error;
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
