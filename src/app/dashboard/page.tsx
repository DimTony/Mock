"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Lottie from "lottie-react";
import loginAnimation from "../../../public/animations/loadthree.json";
import Image from "next/image";
import { Poppins, Lobster } from "next/font/google";
import {
  ChevronRight,
  MessagesSquare,
  Phone,
  Search,
  Video,
} from "lucide-react";
import { Toggle } from "@/components/Toggle";
import ProfileDrawer from "@/components/Profiler";
import { Lock } from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/components/Guard";

function FeatureTile({
  title,
  isProFeature,
}: {
  title: string;
  isProFeature: boolean;
}) {
  return (
    <div
      className={`relative p-4 border rounded-lg shadow-md ${
        isProFeature ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"
      } bg-white transition duration-300`}
    >
      <h3 className="font-semibold text-lg">{title}</h3>

      {isProFeature && (
        <>
          {/* Overlay */}
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 rounded-lg" />

          {/* Tag */}
          <span className="absolute top-2 right-2 z-20 bg-yellow-400 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Lock size={12} /> Pro
          </span>
        </>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user, logout, isLoading, checkAuth } = useAuthStore();
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);

  // useEffect(() => {
  //   console.log("UUU", user);
  // }, [user]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          {/* <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p> */}
          <Lottie
            animationData={loginAnimation}
            loop={true}
            className="w-[200px] h-[150px"
          />
        </div>
      </div>
    );
  }

  // Don't render if no user (will redirect)
  if (!user) {
    return null;
  }

  const status: string = "good";

  const mockUser = {
    name: "Ash Ketchum",
    email: "ash@example.com",
    image: "/avatar1.png", // Optional
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 px-4 pb-8 pt-4 bg-[url('/defBack.jpg')] bg-cover bg-center">
        <div className="max-w-sm mx-auto gap-5 flex flex-col">
          {/* <h1 className="text-2xl font-bold mb-4">CRS BitDefender</h1> */}
          <div className="flex items-center gap-3">
            {/* <Image
            src="/avatar1.png"
            alt="avatar"
            width={30}
            height={30}
            className="rounded-full"
          /> */}
            <ProfileDrawer user={user} onLogout={logout} />
            <h1
              className={`text-[1rem] text-white`}
              style={{ fontFamily: "Poppins" }}
            >
              Welcome,{" "}
              <span
                className={`text-[1rem] text-[#87ceeb]`}
                style={{ fontFamily: "Lobster" }}
              >
                {user.username}!
              </span>
            </h1>
          </div>

          <div className="flex justify-between  items-center ">
            <button
              className={`relative overflow-hidden bg-white rounded-xl flex flex-col w-[30%] items-center justify-center py-3 transition 
        ${true ? "opacity-60 cursor-not-allowed" : "hover:shadow-md"}`}
              disabled={true}
            >
              {true && (
                <>
                  {/* Blur/Dim Overlay */}
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10" />

                  {/* Lock Tag */}
                  <div className="absolute top-2 right-2 z-20 bg-yellow-500 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                    <Lock size={12} /> Suite
                  </div>
                </>
              )}

              <Image
                src="/phone.png"
                alt="phone"
                width={60}
                height={60}
                className="rounded-full z-20"
              />

              <span className="text-gray-600 text-sm z-20">Secure Call</span>

              {/* Version Badge */}
              <div className="rotate-45 translate-x-9 -translate-y-7 bg-gray-500 w-full absolute z-0">
                <span className="text-white">Suite</span>
              </div>
            </button>

            <button
              className={`relative overflow-hidden bg-white rounded-xl flex flex-col w-[30%] items-center justify-center py-3 transition 
        ${true ? "opacity-60 cursor-not-allowed" : "hover:shadow-md"}`}
              disabled={true}
            >
              {true && (
                <>
                  {/* Blur/Dim Overlay */}
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10" />

                  {/* Lock Tag */}
                  <div className="absolute top-2 right-2 z-20 bg-yellow-500 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                    <Lock size={12} /> V5
                  </div>
                </>
              )}

              <Image
                src="/chat.png"
                alt="shield"
                width={60}
                height={60}
                className="rounded-full z-20"
              />

              <span className="text-gray-600 text-sm z-20">E2E Chats</span>

              {/* Version Badge */}
              <div className="rotate-45 translate-x-9 -translate-y-7 bg-gray-500 w-full absolute z-0">
                <span className="text-white">v5</span>
              </div>
            </button>

            {/* <FeatureTile title="Secure" isProFeature={true} /> */}

            <button
              className={`relative overflow-hidden bg-white rounded-xl flex flex-col w-[30%] items-center justify-center py-3 transition 
        ${true ? "opacity-60 cursor-not-allowed" : "hover:shadow-md"}`}
              disabled={true}
            >
              {true && (
                <>
                  {/* Blur/Dim Overlay */}
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10" />

                  {/* Lock Tag */}
                  <div className="absolute top-2 right-2 z-20 bg-yellow-500 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                    <Lock size={12} /> Suite
                  </div>
                </>
              )}

              <Image
                src="/video.png"
                alt="video"
                width={60}
                height={60}
                className="rounded-full z-20"
              />

              <span className="text-gray-600 text-sm z-20">Video Call</span>

              {/* Version Badge */}
              <div className="rotate-45 translate-x-9 -translate-y-7 bg-gray-500 w-full absolute z-0">
                <span className="text-white">Suite</span>
              </div>
            </button>
          </div>

          <div className="flex justify-between">
            <div className="w-[58%] flex flex-col justify-between">
              <div className="bg-white flex items-center px-4 gap-2 h-[41%] w-full rounded-xl shadow-md">
                {/* Icon or Emoji (optional) */}
                {/* <div className="bg-red-100 text-red-600 p-2 rounded-full">💳</div> */}

                {/* <span className="text-sm text-gray-500">Bill Due</span> */}

                <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full w-max whitespace-nowrap">
                  Due Soon
                </span>

                {/* Bill Info */}
                {/* <div className="flex flex-col justify-center"> */}
                <span className="text-lg whitespace-nowrap font-semibold text-gray-800">
                  July 15, 2025
                </span>
                {/* Optional Status */}
                {/* </div> */}
              </div>

              <div className="bg-white flex h-[41%] w-full rounded-xl p-1">
                <Toggle
                  initialState={notifications}
                  onToggle={setNotifications}
                />
              </div>
            </div>

            <Link
              href="/bitdefender"
              className="bg-white w-[38%] rounded-xl flex flex-col items-center justify-center py-3"
              //     className={`relative overflow-hidden flex flex-col w-[30%] items-center justify-center py-3 transition
              // ${false ? "opacity-60 cursor-not-allowed" : "hover:shadow-md"}`}
              // disabled={false}
            >
              <button>
                {/* <button className="bg-white w-[38%] rounded-xl flex flex-col items-center justify-center py-3"> */}
                <Image
                  src="/defend.png"
                  alt="defender"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                {/* </div> */}
                <span className="text-gray-600 text-sm">BitDefender</span>
              </button>
            </Link>
          </div>

          <div className="bg-white w-full flex justify-between rounded-xl py-4">
            <button
              className={`relative overflow-hidden flex flex-col w-[30%] items-center justify-center py-3 transition 
        ${true ? "opacity-60 cursor-not-allowed" : "hover:shadow-md"}`}
              disabled={true}
            >
              {true && (
                <>
                  {/* Blur/Dim Overlay */}
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10" />

                  {/* Lock Tag */}
                  <div className="absolute top-2 right-2 z-20 bg-yellow-500 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                    <Lock size={12} /> Suite
                  </div>
                </>
              )}

              <Image
                src="/safe.png"
                alt="storage"
                width={60}
                height={60}
                className="rounded-full z-20"
              />

              <span className="text-gray-600 text-sm z-20">File Storage</span>
            </button>

            <button
              className={`relative overflow-hidden flex flex-col w-[30%] items-center justify-center py-3 transition 
        ${true ? "opacity-60 cursor-not-allowed" : "hover:shadow-md"}`}
              disabled={true}
            >
              {true && (
                <>
                  {/* Blur/Dim Overlay */}
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10" />

                  {/* Lock Tag */}
                  <div className="absolute top-2 right-2 z-20 bg-yellow-500 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                    <Lock size={12} /> Suite
                  </div>
                </>
              )}

              <Image
                src="/bubble.png"
                alt="storage"
                width={60}
                height={60}
                className="rounded-full z-20"
              />

              <span className="text-gray-600 text-sm z-20">Meeting Rooms</span>
            </button>

            <Link
              href="/encryptor"
              className={`relative overflow-hidden flex flex-col w-[30%] items-center justify-center py-3 transition 
        ${false ? "opacity-60 cursor-not-allowed" : "hover:shadow-md"}`}
              // disabled={false}
            >
              <button>
                {false && (
                  <>
                    {/* Blur/Dim Overlay */}
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10" />

                    {/* Lock Tag */}
                    <div className="absolute top-2 right-2 z-20 bg-yellow-500 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                      <Lock size={12} /> Suite
                    </div>
                  </>
                )}

                <Image
                  src="/encrypt.png"
                  alt="storage"
                  width={60}
                  height={60}
                  className="rounded-full z-20"
                />

                <span className="text-gray-600 text-sm z-20">Encryptor</span>
              </button>
            </Link>
          </div>

          <div className="bg-white w-full min-h-[15rem] flex flex-col justify-between rounded-xl mb-4 py-4 px-4">
            <div className="flex justify-between">
              <span className="text-xl font-semibold">Device Health</span>

              <Image
                src="/goodHealth.png"
                alt="health-icon"
                width={80}
                height={80}
                className="rounded-full"
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">
                  Update is available
                </span>
                <div className={`flex items-center gap-2`}>
                  <span>Status:</span>
                  <span
                    className={`${
                      status === "good"
                        ? "text-[#0F9D58]"
                        : status === "bad"
                        ? "text-[#FF3B30]"
                        : "text-[#FFA500]"
                    }`}
                  >
                    Critical
                  </span>
                </div>
              </div>
              <ChevronRight />
            </div>
          </div>

          {/* <p className="text-gray-600 mb-8">Email: {user.email}</p> */}

          {/* <button
          onClick={logout}
          className="w-full bg-red-500 text-white py-3 rounded-lg"
        >
          Logout
        </button> */}
        </div>
      </div>
    </ProtectedRoute>
  );
}
