import { serverAxios } from "@/request/server-axios";
import { getAuth } from "@clerk/nextjs/server";
import DashboardModule from "@modules/dashboard";
import { GetServerSideProps } from "next";

const DashboardPage = (props: any) => <DashboardModule {...props} />;

// eslint-disable-next-line react-refresh/only-export-components -- gssp
export const getServerSideProps: GetServerSideProps<{
  projects: any[];
  error?: string;
}> = async (context) => {
  const { userId } = getAuth(context.req);

  if (!userId) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  try {
    const data = await (await serverAxios(context)).get(`/projects`);
    console.log(data.data);

    return {
      props: {
        projects: data.data?.projects ?? [],
      },
    };
  } catch (error) {
    // eslint-disable-next-line no-console -- error logging needed
    console.error("Error fetching projects:", error);

    return {
      props: {
        projects: [],
        error: "Failed to fetch projects",
      },
    };
  }
};

export default DashboardPage;
