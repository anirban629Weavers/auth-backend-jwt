"use client";
import { signOut } from "next-auth/react";
import React from "react";

const LogoutButton = () => {
  return (
    <button
      type="button"
      onClick={() => signOut()}
      className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
