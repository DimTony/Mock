"use client";

import ProfileDrawer from "@/components/Profiler";
import SnapCarousel from "@/components/Snap";
import { useAuthStore } from "@/store/authStore";
import React from "react";

const BitDefender = () => {
  const { user, logout, isLoading, checkAuth } = useAuthStore();

  const mockUser = {
    name: "Ash Ketchum",
    email: "ash@example.com",
    image: "/avatar1.png", // Optional
  };

  return (
    <div
      // className="min-h-screen bg-gray-50 px-4 pb-8 pt-4 bg-[url('/defBack.jpg')] bg-cover bg-center"
      className="min-h-screen px-4 pb-8 pt-4 bg-cover bg-center "
    >
      <div className="back-image" />

      <div className="flex items-center gap-3">
        <ProfileDrawer user={mockUser} onLogout={logout} />
        <span
          className={`text-[1rem] text-[#003883]`}
          style={{ fontFamily: "Lobster" }}
        >
          BitDefender
        </span>
      </div>

      <SnapCarousel />

      <div></div>
    </div>
  );
};

export default BitDefender;
