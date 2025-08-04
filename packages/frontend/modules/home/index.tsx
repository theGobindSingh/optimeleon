import { HomeWrapper } from "@modules/home/styles";
import { HomeProps } from "@modules/home/types";

const Home = ({ className }: HomeProps) => (
  <HomeWrapper className={className}>Hello Home</HomeWrapper>
);

export default Home;
