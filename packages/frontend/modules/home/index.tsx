import { SignInButton, useAuth } from "@clerk/nextjs";
import { HomeTitle, HomeWrapper } from "@modules/home/styles";
import { HomeProps } from "@modules/home/types";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Home = ({ className }: HomeProps) => {
  const { isSignedIn } = useAuth();
  const { push } = useRouter();
  useEffect(() => {
    if (isSignedIn) {
      void push("/dashboard");
    }
  }, [isSignedIn, push]);
  return (
    <HomeWrapper className={className}>
      <HomeTitle>Hello, Welcome to Optimeleon!</HomeTitle>
      <SignInButton>
        <Button type="button">Login</Button>
      </SignInButton>
    </HomeWrapper>
  );
};

export default Home;
