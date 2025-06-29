"use client";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { RegisterData } from "@/types/auth";

interface AuthFormProps {
  mode: "login" | "register";
}

const subscriptionPlans = [
  {
    id: "mobile-v4-basic",
    name: "Mobile Only v4 - Basic",
    price: "$9.99/month",
    features: [
      "Basic mobile encryption",
      "30 day duration",
      // "5GB Storage",
      // "Basic Support",
    ],
  },
  {
    id: "mobile-v4-premium",
    name: "Mobile Only v4 - Premium",
    price: "$19.99/month",
    features: [
      "Premium mobile encryption",
      "60 day duration",
      // "50GB Storage",
      // "Priority Support",
      // "Advanced Features",
    ],
  },
  {
    id: "mobile-v4-enterprise",
    name: "Mobile Only v4 - Enterprise",
    price: "$49.99/month",
    features: [
      "Mobile Only",
      "90 day duration",
      // "Unlimited Storage",
      // "24/7 Support",
      // "Custom Integration",
    ],
  },
  {
    id: "mobile-v5-basic",
    name: "Mobile Only v5 - Basic",
    price: "$49.99/month",
    features: [
      "v5 Mobile Only",
      "60 day duration",
      // "Unlimited Storage",
      // "24/7 Support",
      // "Custom Integration",
    ],
  },
  {
    id: "full-suite-basic",
    name: "Full Suite - Basic",
    price: "$49.99/month",
    features: [
      "v4 Full Suite",
      "60 day duration",
      // "Unlimited Storage",
      // "24/7 Support",
      // "Custom Integration",
    ],
  },
  {
    id: "full-suite-premium",
    name: "Full Suite - Premium",
    price: "$49.99/month",
    features: [
      "v5 Full Suite",
      "90 day duration",
      // "Unlimited Storage",
      // "24/7 Support",
      // "Custom Integration",
    ],
  },
];

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Register form fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [deviceIMEI, setDeviceIMEI] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const { login, register, isLoading } = useAuthStore();
  const router = useRouter();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    // Validate file types
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];
    const invalidFiles = selectedFiles.filter(
      (file) => !validTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      setError("Only JPG, PNG, and PDF files are allowed");
      return;
    }

    // Validate file sizes (10MB each)
    const oversizedFiles = selectedFiles.filter(
      (file) => file.size > 10 * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      setError("Each file must be less than 10MB");
      return;
    }

    // Validate total number of files
    const totalFiles = files.length + selectedFiles.length;
    if (totalFiles > 10) {
      setError("Maximum 10 files allowed");
      return;
    }

    setFiles((prev) => [...prev, ...selectedFiles]);
    setError("");
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        // Validate register form
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          return;
        }

        if (!selectedPlan) {
          setError("Please select a subscription plan");
          return;
        }

        const registerData: RegisterData = {
          name,
          email,
          phone,
          password,
          confirmPassword,
          deviceName,
          imei: deviceIMEI,
          plan: selectedPlan,
          files,
        };

        await register(registerData);
      }
      router.push("/dashboard");
    } catch (err) {
      setError(
        mode === "login" ? "Invalid credentials" : "Registration failed"
      );
    }
  };

  if (mode === "login") {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded-lg"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded-lg"
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white p-3 rounded-lg disabled:opacity-50"
        >
          {isLoading ? "Loading..." : "Login"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* User Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          User Information
        </h3>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded-lg placeholder-gray-400"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded-lg placeholder-gray-400"
          required
        />

        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 border rounded-lg placeholder-gray-400"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded-lg placeholder-gray-400"
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 border rounded-lg placeholder-gray-400"
          required
        />
      </div>

      {/* Device Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Device Information
        </h3>

        <input
          type="text"
          placeholder="Device Name"
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
          className="w-full p-3 border rounded-lg placeholder-gray-400"
          required
        />

        <input
          type="text"
          placeholder="Device IMEI"
          value={deviceIMEI}
          onChange={(e) => setDeviceIMEI(e.target.value)}
          className="w-full p-3 border rounded-lg placeholder-gray-400"
          required
        />
      </div>

      {/* Subscription Plan Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Subscription Plan
        </h3>

        <div className="space-y-3">
          {subscriptionPlans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() =>
                setSelectedPlan(selectedPlan === plan.id ? "" : plan.id)
              }
              className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
                selectedPlan === plan.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900">{plan.name}</h4>
                <span className="text-blue-600 font-semibold">
                  {plan.price}
                </span>
              </div>
              <ul className="text-sm text-gray-600">
                {plan.features.map((feature, index) => (
                  <li key={index}>• {feature}</li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      </div>

      {/* Upload Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Upload Documents
        </h3>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <input
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileUpload}
            className="w-full"
          />
          <p className="text-sm text-gray-600 mt-2">
            Upload JPG, PNG, or PDF files (max 10MB each, up to 10 files)
          </p>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">
              Uploaded Files ({files.length}/10):
            </h4>
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-100 p-2 rounded"
              >
                <span className="text-sm text-gray-700 truncate">
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-500 text-white p-3 rounded-lg disabled:opacity-50 font-medium"
      >
        {isLoading ? "Encrypting..." : "Encrypt Device"}
      </button>
    </form>
  );
}
