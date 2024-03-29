"use client";

import axios from "../axios";
import { signIn, useSession } from "next-auth/react";

export const useRefreshToken = () => {
  const { data: session } = useSession();

  const refreshToken = async () => {
    const res = await axios.post("/api/auth/refresh-token", {
      refresh: session?.user.refreshToken,
    });

    console.log(res.data, "----", session);

    if (session) session.user.accessToken = res.data.token;
    else signIn();
  };
  return refreshToken;
};
