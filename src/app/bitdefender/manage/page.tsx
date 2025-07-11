"use client";

import ProfileDrawer from "@/components/Profiler";
import { useAuthStore } from "@/store/authStore";
import React from "react";

const ManageSubscriptions = () => {
  const { user, logout, isLoading, checkAuth } = useAuthStore();

  const mockUser = {
    name: "Ash Ketchum",
    email: "ash@example.com",
    image: "/avatar1.png", // Optional
  };

  return (
    <div className="h-screen overflow-hidden px-4 py-4 bg-cover bg-center relative flex flex-col">
      <div className="back-image" />

      {/* Header - Fixed height */}
      <div className="flex items-center gap-3 flex-shrink-0 mb-4">
        <ProfileDrawer user={mockUser} onLogout={logout} />
        <span
          className={`text-[1rem] text-[#003883]`}
          style={{ fontFamily: "Lobster" }}
        >
          BitDefender
        </span>
      </div>
    </div>
  );
};

export default ManageSubscriptions;
