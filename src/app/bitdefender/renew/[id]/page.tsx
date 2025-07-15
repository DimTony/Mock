"use client";

import Image from "next/image";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Lottie from "lottie-react";
import loginAnimation from "../../../../../public/animations/loadthree.json";
import { useAuthStore } from "@/store/authStore";

// Lightweight interfaces - only essential fields
interface CurrentSubscription {
  id: string;
  plan: string;
  endDate: string;
  remainingDays: number;
  status: string;
}

interface RenewalOption {
  plan: string;
  duration: string;
  price: number;
  newEndDate: string;
  totalDaysAfterRenewal: number;
  isCurrentPlan: boolean;
  recommended: boolean;
}

interface RenewalOptionsData {
  currentSubscription: CurrentSubscription;
  renewalOptions: RenewalOption[];
  summary: {
    currentPlanPrice: number;
    renewalMessage: string;
  };
}

interface RenewalResult {
  subscription: {
    plan: string;
    endDate: string;
  };
  transaction: {
    transactionId: string;
    amount: number;
  };
  summary: {
    totalRemainingDays: number;
  };
}

// Minimal plan features - only show top 3 to save memory
const PLAN_FEATURES: Record<string, string[]> = {
  "mobile-v4-basic": [
    "Basic encryption",
    "30-day validity",
    "Standard support",
  ],
  "mobile-v4-premium": [
    "Premium encryption",
    "60-day validity",
    "Priority support",
  ],
  "mobile-v4-enterprise": [
    "Enterprise encryption",
    "90-day validity",
    "24/7 support",
  ],
  "mobile-v5-basic": ["V5 encryption", "30-day validity", "Enhanced security"],
  "mobile-v5-premium": ["V5 premium", "60-day validity", "Advanced security"],
  "full-suite-basic": ["Complete suite", "60-day validity", "Desktop & mobile"],
  "full-suite-premium": ["Premium suite", "90-day validity", "All platforms"],
};

// Utility functions
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatPlanName = (plan: string): string => {
  return plan
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const Renew = () => {
  const params = useParams();
  const router = useRouter();
  const { fetchOptionsById, renewSubscription } = useAuthStore();

  const subscriptionId = params.id as string;

  // Minimal state - only what's needed
  const [renewalData, setRenewalData] = useState<RenewalOptionsData | null>(
    null
  );
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRenewing, setIsRenewing] = useState(false);
  const [renewalResult, setRenewalResult] = useState<RenewalResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Memoized selected option to avoid recalculation
  const selectedOption = useMemo(
    () =>
      renewalData?.renewalOptions.find(
        (option) => option.plan === selectedPlan
      ),
    [renewalData?.renewalOptions, selectedPlan]
  );

  // Load renewal options
  const loadRenewalOptions = useCallback(async () => {
    if (!subscriptionId) {
      setError("No Subscription ID provided");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Use your existing auth store method
      const options = await fetchOptionsById(subscriptionId);

      console.log("LLL", options);

      if (options) {
        setRenewalData(options.data);
        // Auto-select current plan
        const currentPlan = options.data.currentSubscription;
        if (currentPlan) {
          setSelectedPlan(currentPlan.plan);
        }
      } else {
        setError("Renewal options not found");
      }
    } catch (err) {
      console.error("Error loading renewal options:", err);
      setError("Failed to load renewal options");
    } finally {
      setIsLoading(false);
    }
  }, [subscriptionId, fetchOptionsById]);

  // Handle renewal
  const handleRenewal = useCallback(async () => {
    if (!selectedPlan || !subscriptionId) return;

    try {
      setIsRenewing(true);
      setError(null);

      //   const response = await fetch(
      //     `/api/subscriptions/${subscriptionId}/renew`,
      //     {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //         Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      //       },
      //       body: JSON.stringify({
      //         newPlan: selectedPlan,
      //         paymentMethod: "ADMIN_APPROVAL",
      //       }),
      //     }
      //   );

      const renewedResponse = await renewSubscription(
        subscriptionId,
        selectedPlan,
        "ADMIN_APPROVAL"
      );

      console.log("rrrRRRRRRR", renewedResponse);

      if (!renewedResponse.success) {
        // const errorData = await renewedResponse.json();
        throw new Error(renewedResponse.message || "Renewal failed");
      }

      // const result = await renewedResponse.json();
      setRenewalResult(renewedResponse.data);
      setShowConfirm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Renewal failed");
    } finally {
      setIsRenewing(false);
    }
  }, [selectedPlan, subscriptionId]);

  useEffect(() => {
    loadRenewalOptions();
  }, [loadRenewalOptions]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Lottie
          animationData={loginAnimation}
          loop={true}
          className="w-[200px] h-[150px]"
        />
      </div>
    );
  }

  // Error state
  if (error && !renewalData) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Image
            src="/icons/alert-error.svg"
            width={80}
            height={80}
            alt="Error"
            className="mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={loadRenewalOptions}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (renewalResult) {
    return (
      <>
 
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto my-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="w-full  mb-4 flex flex-col items-center justify-center ">
              <h3 className="text-lg font-semibold">Renewal Successful!</h3>
              <span>Your subscription has been extended</span>
            </div>

            <div className="space-y-2 mb-6 text-sm">
              <div className="flex justify-between">
                <span>Plan:</span>
                <span className="font-medium">
                  {formatPlanName(renewalResult.subscription.plan)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Extended Until:</span>
                <span className="font-medium">
                  {formatDate(renewalResult.subscription.endDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Days Remaining:</span>
                <span className="font-medium">
                  {renewalResult.summary.totalRemainingDays} days
                </span>
              </div>
              <div className="flex justify-between">
                <span>Amount Paid:</span>
                <span className="font-medium">
                  ${renewalResult.transaction.amount}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Dashboard
              </button>
              <button
                onClick={() =>
                  router.push(`/subscription/${subscriptionId}/history`)
                }
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
              >
                View History
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Main renewal interface
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Renew Subscription
          </h1>
        </div>

        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Subscription - Simplified */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4">
                Current Subscription
              </h2>
              {renewalData && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Plan</p>
                    <p className="font-semibold">
                      {formatPlanName(renewalData.currentSubscription.plan)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Time Remaining</p>
                    <p className="text-lg font-bold text-orange-600">
                      {renewalData.currentSubscription.remainingDays} days
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Expires</p>
                    <p className="text-sm">
                      {formatDate(renewalData.currentSubscription.endDate)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Renewal Options - Simplified Grid */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-2">Choose Renewal Plan</h2>
                <p className="text-gray-600">
                  Extend your subscription with additional time
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renewalData?.renewalOptions.map((option) => {
                  const isSelected = selectedPlan === option.plan;
                  const features = PLAN_FEATURES[option.plan] || [];

                  return (
                    <div
                      key={option.plan}
                      className={`relative cursor-pointer border-2 rounded-lg p-4 transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedPlan(option.plan)}
                    >
                      {/* Badges */}
                      <div className="flex gap-2 mb-3">
                        {option.recommended && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                            ⭐ Recommended
                          </span>
                        )}
                        {option.isCurrentPlan && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            Current
                          </span>
                        )}
                      </div>

                      {/* Plan details */}
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold">
                          {formatPlanName(option.plan)}
                        </h3>
                        {isSelected && (
                          <svg
                            className="w-5 h-5 text-blue-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>

                      <div className="mb-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold">
                            ${option.price}
                          </span>
                          <span className="text-gray-600">
                            / {option.duration}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Until {formatDate(option.newEndDate)}
                        </p>
                      </div>

                      {/* Features - Only show top 3 */}
                      <div className="space-y-1">
                        {features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center text-sm text-gray-600"
                          >
                            <svg
                              className="w-3 h-3 text-green-500 mr-2"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected plan summary */}
              {selectedOption && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-3">
                    Renewal Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-blue-700">Plan:</span>
                      <p className="font-medium">
                        {formatPlanName(selectedOption.plan)}
                      </p>
                    </div>
                    <div>
                      <span className="text-blue-700">Duration:</span>
                      <p className="font-medium">{selectedOption.duration}</p>
                    </div>
                    <div>
                      <span className="text-blue-700">Cost:</span>
                      <p className="font-medium">${selectedOption.price}</p>
                    </div>
                    <div>
                      <span className="text-blue-700">Total Days:</span>
                      <p className="font-medium">
                        {selectedOption.totalDaysAfterRenewal} days
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowConfirm(true)}
                      disabled={isRenewing}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                    >
                      {isRenewing
                        ? "Processing..."
                        : `Renew for $${selectedOption.price}`}
                    </button>
                    <button
                      onClick={() => setSelectedPlan("")}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Simple confirmation modal */}
        {showConfirm && selectedOption && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Confirm Renewal</h3>
              <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between">
                  <span>Plan:</span>
                  <span className="font-medium">
                    {formatPlanName(selectedOption.plan)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Cost:</span>
                  <span className="font-medium">${selectedOption.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>New End Date:</span>
                  <span className="font-medium">
                    {formatDate(selectedOption.newEndDate)}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleRenewal}
                  disabled={isRenewing}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {isRenewing ? "Processing..." : "Confirm"}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={isRenewing}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Renew;
