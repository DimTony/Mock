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

// const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });
// const lobster = Lobster({ weight: ["400"], subsets: ["latin"] });

export default function Dashboard() {
  const { user, logout, isLoading, checkAuth } = useAuthStore();
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);

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
          <ProfileDrawer user={mockUser} onLogout={logout} />
          <h1
            className={`text-[1rem] text-white`}
            style={{ fontFamily: "Poppins" }}
          >
            Welcome,{" "}
            <span
              className={`text-[1rem] text-[#87ceeb]`}
              style={{ fontFamily: "Lobster" }}
            >
              {user.name}!
            </span>
          </h1>
        </div>

        <div className="flex justify-between  items-center ">
          <button className="bg-white w-[30%] rounded-xl flex flex-col items-center justify-center py-3">
            {/* <div className="flex items-center justify-center w-[3rem] h-[3rem] border-2 mb-2 border-[#87ceeb] rounded-full"> */}
            {/* <Phone color="#87ceeb" strokeWidth="2px" /> */}
            <Image
              src="/phone.png"
              alt="phone"
              width={60}
              height={60}
              className="rounded-full"
            />
            {/* </div> */}
            <span className="text-gray-600 text-sm">Secure Calls</span>
          </button>

          <button className="bg-white rounded-xl flex flex-col w-[30%] items-center justify-center py-3">
            {/* <div className="flex items-center justify-center w-[3rem] h-[3rem] border-2 mb-2 border-[#87ceeb] rounded-full"> */}
            {/* <Phone color="#87ceeb" strokeWidth="2px" /> */}
            <Image
              src="/chat.png"
              alt="shield"
              width={60}
              height={60}
              className="rounded-full"
            />
            {/* </div> */}
            <span className="text-gray-600 text-sm">E2E Chats</span>
          </button>

          <button className="bg-white rounded-xl flex flex-col w-[30%] items-center justify-center py-3">
            {/* <div className="flex items-center justify-center w-[3rem] h-[3rem] border-2 mb-2 border-[#87ceeb] rounded-full"> */}
            {/* <Phone color="#87ceeb" strokeWidth="2px" /> */}
            <Image
              src="/video.png"
              alt="video"
              width={60}
              height={60}
              className="rounded-full"
            />
            {/* </div> */}
            <span className="text-gray-600 text-sm">Video Calls</span>
          </button>
        </div>

        <div className="flex justify-between">
          <div className="w-[58%] flex flex-col justify-between">
            <div className="bg-white flex h-[41%] w-full rounded-xl"></div>
            <div className="bg-white flex h-[41%] w-full rounded-xl p-1">
              <Toggle
                initialState={notifications}
                onToggle={setNotifications}
              />
            </div>
          </div>
          {/* <div className="w-[38%] bg-white flex flex-col items-center rounded-xl py-3">
            <div className="flex items-center justify-center w-[3rem] h-[3rem] border-2 mb-2 border-[#87ceeb] rounded-full">
              <Phone color="#87ceeb" strokeWidth="2px" />
            </div>
            <span className="text-gray-600">Secure Calls</span>
          </div> */}

          <button className="bg-white w-[38%] rounded-xl flex flex-col items-center justify-center py-3">
            {/* <div className="flex items-center justify-center w-[3rem] h-[3rem] border-2 mb-2 border-[#87ceeb] rounded-full"> */}
            {/* <Phone color="#87ceeb" strokeWidth="2px" /> */}
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
        </div>

        <div className="bg-white w-full flex justify-between rounded-xl py-4">
          <button className="bg-white rounded-xl flex flex-col w-[30%] items-center justify-center py-3">
            {/* <div className="flex items-center justify-center w-[3rem] h-[3rem] border-2 mb-2 border-[#87ceeb] rounded-full"> */}
            {/* <Phone color="#87ceeb" strokeWidth="2px" /> */}
            <Image
              src="/safe.png"
              alt="storage"
              width={60}
              height={60}
              className="rounded-full"
            />
            {/* </div> */}
            <span className="text-gray-600 text-sm">File Storage</span>
          </button>

          <button className="bg-white rounded-xl flex flex-col w-[30%] items-center justify-center py-3">
            {/* <div className="flex items-center justify-center w-[3rem] h-[3rem] border-2 mb-2 border-[#87ceeb] rounded-full"> */}
            {/* <Phone color="#87ceeb" strokeWidth="2px" /> */}
            <Image
              src="/bubble.png"
              alt="meeting"
              width={60}
              height={60}
              className="rounded-full"
            />
            {/* </div> */}
            <span className="text-gray-600 text-sm">Meeting Rooms</span>
          </button>

          <button className="bg-white rounded-xl flex flex-col w-[30%] items-center justify-center py-3">
            {/* <div className="flex items-center justify-center w-[3rem] h-[3rem] border-2 mb-2 border-[#87ceeb] rounded-full"> */}
            {/* <Phone color="#87ceeb" strokeWidth="2px" /> */}
            <Image
              src="/encrypt.png"
              alt="meeting"
              width={60}
              height={60}
              className="rounded-full"
            />
            {/* </div> */}
            <span className="text-gray-600 text-sm">Encryptor</span>
          </button>
        </div>

        <div className="bg-white w-full min-h-[15rem] flex flex-col justify-between rounded-xl mb-4 py-4 px-4">
          <div className="flex justify-between">
            <span className="text-xl font-semibold">Device Health</span>

            <Image
              src="/healthGood.png"
              alt="health-icon"
              width={80}
              height={80}
              className="rounded-full"
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Update is available</span>
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
  );
}
