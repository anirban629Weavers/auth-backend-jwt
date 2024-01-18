"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { axiosAuth } from "../axios";
import { useRefreshToken } from "./useRefreshToken";

const useAxiosAuth = () => {
  const { data: session } = useSession();
  const refreshToken = useRefreshToken();
  useEffect(() => {
    const requestIntercept = axiosAuth.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers[
            "Authorization"
          ] = `Bearer ${session?.user.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosAuth.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.log(error);
        const prevRequest = error?.config;
        if (error.response.status === 401 && !prevRequest.sent) {
          console.log("401");
          prevRequest.sent = true;
          await refreshToken();
          prevRequest.headers[
            "Authorization"
          ] = `Bearer ${session?.user.accessToken}`;
          return axiosAuth(prevRequest);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosAuth.interceptors.request.eject(requestIntercept);
      axiosAuth.interceptors.response.eject(responseIntercept);
    };
    // eslint-disable-next-line
  }, [session]);

  return axiosAuth;
};

export default useAxiosAuth;
