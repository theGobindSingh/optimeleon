import { axiosInstance } from "@/request";
import { getAuth } from "@clerk/nextjs/server";
import { GetServerSidePropsContext, PreviewData } from "next";
import { ParsedUrlQuery } from "querystring";

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
