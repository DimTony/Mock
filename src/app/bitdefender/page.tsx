"use client";

import ProfileDrawer from "@/components/Profiler";
import SnapCarousel, { ProgressCard } from "@/components/Snap";
import { useAuthStore } from "@/store/authStore";
import { CirclePlus } from "lucide-react";
import Image from "next/image";
import React from "react";

const BitDefender = () => {
  const { user, logout, isLoading, checkAuth } = useAuthStore();

  const mockUser = {
    name: "Ash Ketchum",
    email: "ash@example.com",
    image: "/avatar1.png", // Optional
  };

  const carouselItems = [
    {
      id: 1,
      title: "Yanga",
      iuc: 7021955561,
      status: "Active",
      startDate: "2024-01-15",
      endDate: "2024-03-30",
      description: "First carousel item Description",
      content: "First carousel item",
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "Card 2",
      iuc: 7021955561,
      status: "Active",
      startDate: "2024-01-15",
      endDate: "2024-03-30",
      description: "First carousel item Description",
      content: "Second carousel item",
      color: "bg-green-500",
    },
    {
      id: 3,
      title: "Card 3",
      iuc: 7021955561,
      status: "Active",
      startDate: "2024-01-15",
      endDate: "2024-03-30",
      description: "First carousel item Description",
      content: "Third carousel item",
      color: "bg-purple-500",
    },
    {
      id: 4,
      title: "Card 4",
      iuc: 7021955561,
      status: "Active",
      startDate: "2024-01-15",
      endDate: "2024-03-30",
      description: "First carousel item Description",
      content: "Fourth carousel item",
      color: "bg-red-500",
    },
    {
      id: 5,
      title: "Card 5",
      iuc: 7021955561,
      status: "Active",
      startDate: "2024-01-15",
      endDate: "2024-03-30",
      description: "First carousel item Description",
      content: "Fifth carousel item",
      color: "bg-yellow-500",
    },
    {
      id: 6,
      title: "Card 6",
      iuc: 7021955561,
      status: "Active",
      startDate: "2024-01-15",
      endDate: "2024-03-30",
      description: "First carousel item Description",
      content: "Sixth carousel item",
      color: "bg-pink-500",
    },
    {
      id: 7,
      title: "Card 7",
      iuc: 7021955561,
      status: "Active",
      startDate: "2024-01-15",
      endDate: "2024-03-30",
      description: "First carousel item Description",
      content: "Seventh carousel item",
      color: "bg-indigo-500",
    },
  ];

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

      {/* Carousel - Takes remaining space */}
      <div className="flex-1 overflow-hidden">
        <SnapCarousel />
      </div>

      {/* Floating button - Absolute positioned */}
      <button className="absolute bottom-10 right-5 z-20">
        <Image
          src="/plus-circle.svg"
          alt="add"
          width={60}
          height={60}
          className="rounded-full"
        />
      </button>
    </div>
  );
};

export default BitDefender;
