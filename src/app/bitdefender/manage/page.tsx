"use client";

import ProtectedRoute from "@/components/Guard";
import ProfileDrawer from "@/components/Profiler";
import { useAuthStore } from "@/store/authStore";
import React, { useState } from "react";
import {
  Shield,
  Smartphone,
  Key,
  Lock,
  Unlock,
  RefreshCw,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  MoreVertical,
  Eye,
  EyeOff,
  ChevronRight,
  ArrowLeft,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Device = {
  id: string;
  deviceName: string;
  imei: string;
  encryptionStatus: string;
  encryptionLevel: string | null;
  lastEncrypted: string | null;
  expiresAt: string | null;
  plan: string;
};

const mockDevices: Device[] = [
  {
    id: "1",
    deviceName: "iPhone 14 Pro",
    imei: "123456789012345",
    encryptionStatus: "active",
    encryptionLevel: "AES-256",
    lastEncrypted: "2025-01-10T10:30:00Z",
    expiresAt: "2025-02-15T23:59:59Z",
    plan: "mobile-v4-premium",
  },
  {
    id: "2",
    deviceName: "Samsung Galaxy S23",
    imei: "987654321098765",
    encryptionStatus: "expired",
    encryptionLevel: "AES-128",
    lastEncrypted: "2024-12-15T08:20:00Z",
    expiresAt: "2025-01-10T23:59:59Z",
    plan: "mobile-v4-basic",
  },
];

const ManageSubscriptions = () => {
  const { user, logout, isLoading, checkAuth } = useAuthStore();
  const router = useRouter();
  const [devices, setDevices] = useState(mockDevices);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showKeyDetails, setShowKeyDetails] = useState<{
    [deviceId: string]: boolean;
  }>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "expired":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Lock className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRefreshEncryption = async (deviceId: string) => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setDevices(
        devices.map((device) =>
          device.id === deviceId
            ? { ...device, lastEncrypted: new Date().toISOString() }
            : device
        )
      );
      setIsRefreshing(false);
    }, 2000);
  };

  const toggleKeyVisibility = (deviceId: string) => {
    setShowKeyDetails((prev) => ({
      ...prev,
      [deviceId]: !prev[deviceId],
    }));
  };

  const generateMaskKey = (imei: string) => {
    return `${imei.slice(0, 3)}***${imei.slice(-3)}`;
  };

  const filteredDevices = devices.filter((device) => {
    if (activeTab === "all") return true;
    return device.encryptionStatus === activeTab;
  });

  const getDeviceCount = (status: string) => {
    if (status === "all") return devices.length;
    return devices.filter((d) => d.encryptionStatus === status).length;
  };

  const handleBack = () => {
    router.back();
  };

  const mockUser = {
    name: "Ash Ketchum",
    email: "ash@example.com",
    image: "/avatar1.png",
  };

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen px-4 py-4 bg-cover bg-center relative flex flex-col overflow-y-auto">
        <div className="back-image" />

        <div className="flex justify-between items-center gap-3 flex-shrink-0 mb-4">
          <div className="flex gap-4 items-center">
            <ChevronLeft onClick={handleBack} className="cursor-pointer" />
            <span
              className="text-[1rem] text-[#003883]"
              style={{ fontFamily: "Lobster" }}
            >
              Manage Encryptions
            </span>
          </div>

          <ProfileDrawer user={user} onLogout={logout} />
        </div>

        <div className="py-4 space-y-4 flex-1">
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mx-auto mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-xl font-bold text-gray-900">
                {getDeviceCount("active")}
              </p>
              <p className="text-xs text-gray-600">Active</p>
            </div>

            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full mx-auto mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <p className="text-xl font-bold text-gray-900">
                {getDeviceCount("expired")}
              </p>
              <p className="text-xs text-gray-600">Expired</p>
            </div>

            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-full mx-auto mb-2">
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
              <p className="text-xl font-bold text-gray-900">
                {getDeviceCount("pending")}
              </p>
              <p className="text-xs text-gray-600">Pending</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-lg p-1 shadow-sm">
            <div className="flex">
              {[
                { key: "all", label: "All" },
                { key: "active", label: "Active" },
                { key: "expired", label: "Expired" },
                { key: "pending", label: "Pending" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.key
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Devices List */}
          <div className="space-y-3">
            {filteredDevices.map((device) => (
              <div key={device.id} className="bg-white rounded-lg shadow-sm">
                <div className="p-4">
                  {/* Device Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg">
                      <Smartphone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {device.deviceName}
                      </h3>
                      <p className="text-sm text-gray-600 font-mono truncate">
                        {device.imei.slice(0, 8)}...{device.imei.slice(-4)}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        device.encryptionStatus
                      )}`}
                    >
                      {device.encryptionStatus}
                    </span>
                  </div>

                  {/* Device Info Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div>
                      <p className="text-gray-500">Encryption</p>
                      <p className="font-medium text-gray-900">
                        {device.encryptionLevel || "Not Set"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Plan</p>
                      <p className="font-medium text-gray-900">
                        {device.plan.split("-")[1]?.toUpperCase() || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Last Updated</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(device.lastEncrypted || "")}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Expires</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(device.expiresAt || "")}
                      </p>
                    </div>
                  </div>

                  {/* Encryption Key (Active devices only) */}
                  {device.encryptionStatus === "active" && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Key className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">
                            Encryption Key
                          </span>
                        </div>
                        <button
                          onClick={() => toggleKeyVisibility(device.id)}
                          className="flex items-center gap-1 text-xs text-blue-600"
                        >
                          {showKeyDetails[device.id] ? (
                            <EyeOff className="w-3 h-3" />
                          ) : (
                            <Eye className="w-3 h-3" />
                          )}
                          {showKeyDetails[device.id] ? "Hide" : "Show"}
                        </button>
                      </div>
                      <div className="font-mono text-xs text-gray-600 bg-white p-2 rounded border">
                        {showKeyDetails[device.id]
                          ? `ENC-${device.imei}-${Date.now()
                              .toString()
                              .slice(-6)}`
                          : generateMaskKey(device.imei)}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {device.encryptionStatus === "active" && (
                      <>
                        <button
                          onClick={() => handleRefreshEncryption(device.id)}
                          disabled={isRefreshing}
                          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                        >
                          <RefreshCw
                            className={`w-4 h-4 ${
                              isRefreshing ? "animate-spin" : ""
                            }`}
                          />
                          Refresh
                        </button>
                        <button className="flex items-center justify-center p-2 bg-gray-100 text-gray-600 rounded-lg">
                          <Settings className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {device.encryptionStatus === "expired" && (
                      <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-green-600 text-white rounded-lg text-sm font-medium">
                        <Lock className="w-4 h-4" />
                        Renew
                      </button>
                    )}

                    {device.encryptionStatus === "pending" && (
                      <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-yellow-600 text-white rounded-lg text-sm font-medium">
                        <Clock className="w-4 h-4" />
                        Check Status
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredDevices.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {activeTab !== "all" ? activeTab : ""} devices
              </h3>
              <p className="text-gray-600 text-sm mb-6 px-4">
                {activeTab === "all"
                  ? "You don't have any encrypted devices yet."
                  : `No ${activeTab} encryption devices found.`}
              </p>
              {activeTab === "all" && (
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium">
                  <Plus className="w-4 h-4" />
                  Add Device
                </button>
              )}
            </div>
          )}
        </div>

        <button className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center">
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </ProtectedRoute>
  );
};

export default ManageSubscriptions;
