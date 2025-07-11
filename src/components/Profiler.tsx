"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User } from "lucide-react";
import Image from "next/image";
import { User as UserType } from "@/types/auth";

export default function ProfileDrawer({ user, onLogout }: {
  user: UserType;
  onLogout: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Profile Icon Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-1 bg-white rounded-full shadow"
      >
        {user.image ? (
          //   <Image src={user.image} alt="Profile" width={32} height={32} className="rounded-full" />
          <Image
            src={user.image}
            alt="avatar"
            width={30}
            height={30}
            className="rounded-full"
          />
        ) : (
          <User size={24} />
        )}
      </button>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween" }}
            className="fixed top-0 left-0 z-40 h-full w-64 bg-white shadow-lg flex flex-col"
          >
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt="User"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <User size={40} />
                )}
                {/* <div className="w-[40px] h-[40px] bg-transparent " /> */}
                <div>
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Add more profile-related content here */}
            {/* <div className="flex-1 p-4 text-sm text-gray-600">
              <p>This is your profile area.</p>
            </div> */}

            {/* Logout at bottom */}
            <div className="p-4 border-t border-gray-100 mt-auto">
              <button
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded hover:bg-red-600"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-30"
        />
      )}
    </>
  );
}
