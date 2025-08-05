import { getAuth } from "@clerk/nextjs/server";
import axios from "axios";
import { GetServerSidePropsContext, PreviewData } from "next";
import { ParsedUrlQuery } from "querystring";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
  headers: {
    "Content-Type": "application/json",
  },
});

export const serverAxios = async (
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>,
) => {
  const { getToken } = getAuth(context.req);

  // Get the session token for authentication
  const token = await getToken();

  axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
  if (context.req.headers.cookie) {
    axiosInstance.defaults.headers.Cookie = context.req.headers.cookie;
  }

  return axiosInstance;
};
