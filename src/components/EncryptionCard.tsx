import React, { useState } from "react";
import { useSpring, animated, config } from "@react-spring/web";
import {
  Shield,
  Smartphone,
  Calendar,
  Clock,
  RefreshCw,
  Settings,
  AlertTriangle,
  CheckCircle,
  Plus,
  Eye,
  EyeOff,
  ArrowLeft,
  Key,
} from "lucide-react";
import Image from "next/image";

const pi = Math.PI;
const tau = 2 * pi;

const map = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

// TypeScript interfaces
interface Subscription {
  _id: string;
  user: string;
  imei: string;
  deviceName: string;
  phone: string;
  email: string;
  plan: string;
  price: number;
  queuePosition: string;
  status: "PENDING" | "QUEUED" | "ACTIVE" | "EXPIRED" | "DECLINED";
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  endDate?: string;
  activatedAt?: string;
}

interface ActivationState {
  [key: string]: boolean;
}

interface LoadingState {
  [key: string]: boolean;
}

interface ErrorState {
  [key: string]: string;
}

interface TotpState {
  [key: string]: string;
}

interface QrCodeState {
  [key: string]: string;
}

interface OnboardedState {
  [key: string]: boolean;
}

// Mock data with your structure
const mockDevices: Subscription[] = [
  {
    _id: "6871ce7238ec7837f91af599",
    user: "6871ce7138ec7837f91af594",
    imei: "101010101010101",
    deviceName: "iPhone 14 Pro",
    phone: "2828282828",
    email: "tonystoryemail@gmail.com",
    plan: "mobile-v4-premium",
    price: 49.99,
    queuePosition: "1",
    status: "ACTIVE",
    createdAt: "2025-07-12T02:54:42.142Z",
    updatedAt: "2025-07-12T02:54:42.142Z",
    startDate: "2025-01-01T00:00:00Z",
    endDate: "2025-02-15T23:59:59Z",
    activatedAt: "2025-01-01T00:00:00Z",
  },
  {
    _id: "6871ce7238ec7837f91af598",
    user: "6871ce7138ec7837f91af594",
    imei: "202020202020202",
    deviceName: "Samsung Galaxy S23",
    phone: "3939393939",
    email: "tonystoryemail@gmail.com",
    plan: "mobile-v4-basic",
    price: 24.99,
    queuePosition: "2",
    status: "EXPIRED",
    createdAt: "2024-12-01T02:54:42.142Z",
    updatedAt: "2024-12-01T02:54:42.142Z",
    startDate: "2024-12-01T00:00:00Z",
    endDate: "2025-01-10T23:59:59Z",
  },
  {
    _id: "6871ce7238ec7837f91af597",
    user: "6871ce7138ec7837f91af594",
    imei: "303030303030303",
    deviceName: "iPad Air",
    phone: "4040404040",
    email: "tonystoryemail@gmail.com",
    plan: "mobile-v5-basic",
    price: 79.99,
    queuePosition: "3",
    status: "PENDING",
    createdAt: "2025-07-12T02:54:42.142Z",
    updatedAt: "2025-07-12T02:54:42.142Z",
  },
];

const SUBSCRIPTION_TYPES: Record<string, string> = {
  "mobile-v4-basic": "Mobile Only v4 - Basic (30 days)",
  "mobile-v4-premium": "Mobile Only v4 - Premium (60 days)",
  "mobile-v4-enterprise": "Mobile Only v4 - Enterprise (90 days)",
  "mobile-v5-basic": "Mobile Only v5 - Basic (30 days)",
  "mobile-v5-premium": "Mobile Only v5 - Premium (60 days)",
  "full-suite-basic": "Full Suite - Basic (60 days)",
  "full-suite-premium": "Full Suite - Premium (90 days)",
};

const PLAN_DURATIONS: Record<string, number> = {
  "mobile-v4-basic": 30,
  "mobile-v4-premium": 60,
  "mobile-v4-enterprise": 90,
  "mobile-v5-basic": 30,
  "mobile-v5-premium": 60,
  "full-suite-basic": 60,
  "full-suite-premium": 90,
};

// Simple shield icon component
const SecureIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 60,
  color = "#22c55e",
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2L3 7V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V7L12 2Z"
      fill={color}
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M9 12L11 14L15 10"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

type EncryptionCardProps = {
  subscription: Subscription;
  onActivationSuccess: () => void;
};

const EncryptionCard: React.FC<EncryptionCardProps> = ({
  subscription,
  onActivationSuccess,
}) => {
  const [devices, setDevices] = useState<Subscription[]>(mockDevices);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [showActivation, setShowActivation] = useState<ActivationState>({});
  const [isOnboarded, setIsOnboarded] = useState<OnboardedState>({});
  const [qrCodes, setQrCodes] = useState<QrCodeState>({});
  const [totpCodes, setTotpCodes] = useState<TotpState>({});
  const [loading, setLoading] = useState<LoadingState>({});
  const [error, setError] = useState<ErrorState>({});
  const [activeTab, setActiveTab] = useState<string>("all");

  const calculateTimePercentage = (device: Subscription): number => {
    if (!device.startDate || !device.endDate) {
      return device.status === "ACTIVE" ? 50 : 0;
    }

    const now = new Date();
    const startDate = new Date(device.startDate);
    const endDate = new Date(device.endDate);
    const totalDuration = endDate.getTime() - startDate.getTime();

    if (totalDuration <= 0) return 0;

    const remainingTime = endDate.getTime() - now.getTime();
    const percentage = Math.max(
      0,
      Math.min(100, (remainingTime / totalDuration) * 100)
    );
    return percentage;
  };

  // Determine color based on percentage and status
  const getColor = (percentage: number, status: string): string => {
    if (status === "EXPIRED" || status === "DECLINED") return "#ef4444";
    if (status === "PENDING" || status === "QUEUED") return "#64748b";
    if (percentage <= 25) return "#ef4444";
    if (percentage <= 50) return "#eab308";
    return "#22c55e";
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "QUEUED":
        return "bg-blue-100 text-blue-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "EXPIRED":
      case "DECLINED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "EXPIRED":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "QUEUED":
      case "PENDING":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysRemaining = (device: Subscription): number => {
    if (!device.endDate) return 0;
    const endDate = new Date(device.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getPlanDuration = (plan: string): number => {
    return PLAN_DURATIONS[plan] || 30;
  };

  // Activation logic
  const handleActivateClick = async (deviceId: string): Promise<void> => {
    const device = devices.find((d) => d._id === deviceId);
    if (!device) return;

    setLoading((prev) => ({ ...prev, [deviceId]: true }));
    setError((prev) => ({ ...prev, [deviceId]: "" }));

    try {
      // Simulate checking if device is onboarded
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock response - you can replace with real API call
      const mockOnboardingResponse = {
        isOnboarded: Math.random() > 0.5, // Random for demo
      };

      setIsOnboarded((prev) => ({
        ...prev,
        [deviceId]: mockOnboardingResponse.isOnboarded,
      }));

      // If not onboarded, generate QR code
      if (!mockOnboardingResponse.isOnboarded) {
        // Mock QR code generation
        const mockQrCode = `data:image/svg+xml;base64,${btoa(`
              <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
                <rect width="200" height="200" fill="white"/>
                <text x="100" y="100" font-family="Arial" font-size="12" text-anchor="middle" fill="black">
                  QR Code for ${device.deviceName}
                </text>
              </svg>
            `)}`;

        setQrCodes((prev) => ({ ...prev, [deviceId]: mockQrCode }));
      }

      setShowActivation((prev) => ({ ...prev, [deviceId]: true }));
    } catch (err) {
      setError((prev) => ({
        ...prev,
        [deviceId]: "Failed to initiate activation",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [deviceId]: false }));
    }
  };

  const handleTotpSubmit = async (
    e: React.FormEvent,
    deviceId: string
  ): Promise<void> => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, [deviceId]: true }));
    setError((prev) => ({ ...prev, [deviceId]: "" }));

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const device = devices.find((d) => d._id === deviceId);
      if (!device) return;

      const duration = getPlanDuration(device.plan);
      const startDate = new Date();
      const endDate = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);

      // Mock successful activation
      setDevices((prev) =>
        prev.map((device) =>
          device._id === deviceId
            ? {
                ...device,
                status: "ACTIVE" as const,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                activatedAt: startDate.toISOString(),
              }
            : device
        )
      );

      setShowActivation((prev) => ({ ...prev, [deviceId]: false }));
      setTotpCodes((prev) => ({ ...prev, [deviceId]: "" }));
    } catch (err) {
      setError((prev) => ({ ...prev, [deviceId]: "Activation failed" }));
    } finally {
      setLoading((prev) => ({ ...prev, [deviceId]: false }));
    }
  };

  const filteredDevices = devices.filter((device) => {
    if (activeTab === "all") return true;
    return device.status.toLowerCase() === activeTab;
  });

  const getDeviceCount = (status: string): number => {
    if (status === "all") return devices.length;
    return devices.filter((d) => d.status.toLowerCase() === status).length;
  };

  const handleBack = (): void => {
    console.log("Navigate back");
  };

    const percentage = calculateTimePercentage(subscription);
              const color = getColor(percentage, subscription.status);
              const daysRemaining = getDaysRemaining(subscription);
              const maxDash = 785.4;
              const offset = maxDash * (1 - percentage / 100);
  
              const { dashOffset } = useSpring({
                dashOffset: offset,
                from: { dashOffset: maxDash },
                config: config.molasses,
              });
  

  return (
    <div
      
      className="bg-white/90 backdrop-blur-md border border-white/20 rounded-lg shadow-sm"
    >
      <div className="p-4">
        {/* Show activation interface if in progress */}
        {showActivation[subscription._id] ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">
                {isOnboarded[subscription._id]
                  ? "🔐 Enter TOTP Code"
                  : "📱 Setup Authenticator"}
              </h4>
              <button
                onClick={() =>
                  setShowActivation((prev) => ({
                    ...prev,
                    [subscription._id]: false,
                  }))
                }
                className="text-gray-500 text-sm"
              >
                Cancel
              </button>
            </div>

            {!isOnboarded[subscription._id] && qrCodes[subscription._id] && (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">
                  Scan this QR code with your authenticator app:
                </p>
                <div className="flex justify-center mb-3">
                  <Image
                  width={32}
                  height={32}
                    src={qrCodes[subscription._id]}
                    alt="TOTP QR Code"
                    className="w-32 h-32 border rounded-lg"
                  />
                </div>
              </div>
            )}

            <form onSubmit={(e) => handleTotpSubmit(e, subscription._id)}>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  6-Digit Code from Authenticator App
                </label>
                <input
                  type="text"
                  value={totpCodes[subscription._id] || ""}
                  onChange={(e) =>
                    setTotpCodes((prev) => ({
                      ...prev,
                      [subscription._id]: e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6),
                    }))
                  }
                  placeholder="000000"
                  className="w-full text-black px-3 py-3 border border-gray-300 rounded-lg text-center text-xl tracking-widest font-mono"
                  maxLength={6}
                  required
                />
              </div>

              {error[subscription._id] && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  ❌ {error[subscription._id]}
                </div>
              )}

              <button
                type="submit"
                disabled={
                  loading[subscription._id] ||
                  (totpCodes[subscription._id] || "").length !== 6
                }
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors font-medium"
              >
                {loading[subscription._id] ? "Activating..." : "Activate"}
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* subscription Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-black mb-1">
                  {subscription.deviceName}
                </h3>
                <p className="text-sm text-gray-600">
                  {SUBSCRIPTION_TYPES[subscription.plan] || subscription.plan}
                </p>
                <p className="text-base font-bold text-gray-900 mt-1">
                  ${subscription.price}/month
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  subscription.status
                )}`}
              >
                {subscription.status}
              </span>
            </div>

            {/* Progress Arc - only show for active subscriptions */}
            {subscription.status === "ACTIVE" && (
              <>
                <div className="flex justify-center mb-4">
                  <svg viewBox="0 0 700 380" fill="none" width="220">
                    {/* Background path */}
                    <path
                      d="M100 350C100 283.696 126.339 220.107 173.223 173.223C220.107 126.339 283.696 100 350 100C416.304 100 479.893 126.339 526.777 173.223C573.661 220.107 600 283.696 600 350"
                      stroke="#e5e7eb"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                    {/* Animated progress path */}
                    <animated.path
                      d="M100 350C100 283.696 126.339 220.107 173.223 173.223C220.107 126.339 283.696 100 350 100C416.304 100 479.893 126.339 526.777 173.223C573.661 220.107 600 283.696 600 350"
                      stroke={color}
                      strokeWidth="30"
                      strokeLinecap="round"
                      strokeDasharray={maxDash}
                      strokeDashoffset={dashOffset}
                    />
                    {/* Circular indicator */}
                    <animated.circle
                      cx={dashOffset.to(
                        (x) => 350 + 250 * Math.cos(map(x, maxDash, 0, pi, tau))
                      )}
                      cy={dashOffset.to(
                        (x) => 350 + 250 * Math.sin(map(x, maxDash, 0, pi, tau))
                      )}
                      r="12"
                      fill="#fff"
                      stroke={color}
                      strokeWidth="2"
                    />

                    {/* Secure Icon centered */}
                    <g transform="translate(320, 240)">
                      <SecureIcon size={60} color={color} />
                    </g>
                  </svg>
                </div>

                {/* Progress percentage and status */}
                <div className="text-center mb-4">
                  <div className="font-bold text-xl mb-1" style={{ color }}>
                    {percentage.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">
                    {daysRemaining} days remaining
                  </div>
                </div>
              </>
            )}

            {/* Device Info */}
            <div className="space-y-3 mb-4 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Smartphone className="w-4 h-4" />
                <span>
                  IMEI: {subscription.imei.slice(0, 8)}...
                  {subscription.imei.slice(-4)}
                </span>
              </div>

              {subscription.status === "ACTIVE" && (
                <>
                  {subscription.startDate && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="w-4 h-4" />
                      <span>Started: {formatDate(subscription.startDate)}</span>
                    </div>
                  )}

                  {subscription.endDate && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="w-4 h-4" />
                      <span>Expires: {formatDate(subscription.endDate)}</span>
                    </div>
                  )}
                </>
              )}

              {subscription.activatedAt && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4" />
                  <span>Activated: {formatDate(subscription.activatedAt)}</span>
                </div>
              )}

              {(subscription.status === "PENDING" || subscription.status === "QUEUED") &&
                subscription.queuePosition && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Clock className="w-4 h-4" />
                    <span>Queue position: #{subscription.queuePosition}</span>
                  </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {(subscription.status === "PENDING" || subscription.status === "QUEUED") && (
                <button
                  onClick={() => handleActivateClick(subscription._id)}
                  disabled={loading[subscription._id]}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
                >
                  {loading[subscription._id]
                    ? "Loading..."
                    : "🚀 Activate Subscription"}
                </button>
              )}

              {subscription.status === "ACTIVE" && (
                <>
                  <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    <RefreshCw className="w-4 h-4 inline mr-2" />
                    Refresh
                  </button>
                  <button className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                    <Settings className="w-4 h-4" />
                  </button>
                </>
              )}

              {subscription.status === "EXPIRED" && (
                <button className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium">
                  <Key className="w-4 h-4 inline mr-2" />
                  Renew Encryption
                </button>
              )}
            </div>

            {/* Error display */}
            {error[subscription._id] && !showActivation[subscription._id] && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                ❌ {error[subscription._id]}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EncryptionCard;
