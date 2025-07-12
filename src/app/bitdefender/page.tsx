"use client";

import ProtectedRoute from "@/components/Guard";
import ProfileDrawer from "@/components/Profiler";
import SnapCarousel, { ProgressCard } from "@/components/Snap";
import { useAuthStore } from "@/store/authStore";
import { CirclePlus, Info, Lock, UserCog } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const BitDefender = () => {
  const { user, logout, isLoading, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  const isFeatureLocked = true; // You can make this dynamic based on user subscription

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="h-[100dvh] overflow-hidden px-4 py-4 bg-cover bg-center relative flex flex-col">
        <div className="back-image" />

        {/* Header - Fixed height */}
        <div className="flex items-center gap-3 flex-shrink-0 mb-4">
          <ProfileDrawer user={user} onLogout={logout} />
          <span
            className={`text-[1rem] text-[#003883]`}
            style={{ fontFamily: "Lobster" }}
          >
            BitDefender
          </span>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto">
          <SnapCarousel subscriptions={user.subscriptions} />

          <div className="flex flex-col gap-4 mt-6">
            <span className="text-lg font-semibold text-gray-800">
              Quick Actions
            </span>
            <div className="flex gap-4">
              {/* Fix Errors Button - Locked */}
              <button className="relative overflow-hidden bg-white rounded-xl flex flex-col items-center gap-3 p-6 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 flex-1 border border-gray-100">
                {isFeatureLocked && (
                  <>
                    {/* Blur/Dim Overlay */}
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10" />

                    {/* Lock Tag */}
                    <div className="absolute top-2 right-2 z-10 bg-yellow-500 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                      <Lock size={12} /> Suite
                    </div>
                  </>
                )}
                <div className="p-3 z-20 bg-blue-50 rounded-full relative">
                  <Info className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700 text-center relative z-20">
                  Fix Errors
                </span>
              </button>

              {/* Manage Encryptions Button - Active */}
              <Link
                href="/bitdefender/manage"
                className="bg-white rounded-xl flex flex-col items-center gap-3 p-6 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 flex-1 border border-gray-100"
              >
                <div className="p-3 bg-green-50 rounded-full">
                  <UserCog className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700 text-center">
                  Manage Encryptions
                </span>
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-6 mb-20">
            <span className="text-lg font-semibold text-gray-800">
              Encryption History
            </span>
            {/* Add your encryption history content here */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <p className="text-gray-500 text-center">
                No encryption history yet
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default BitDefender;
