import DashboardModule from "@modules/dashboard";
import axios from "axios";
import { GetServerSideProps } from "next";

const DashboardPage = (props: any) => <DashboardModule {...props} />;

// eslint-disable-next-line react-refresh/only-export-components -- gssp
export const getServerSideProps: GetServerSideProps = async (_) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects`,
    {},
  );
  return {
    props: {
      projects: data ?? [],
    },
  };
};

export default DashboardPage;
