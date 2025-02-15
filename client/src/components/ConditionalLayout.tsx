import { useLocation } from "react-router-dom";
import Layout from "./Layout";

const ConditionalLayout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();

  // Define routes that shouldn't have the sidebar
  const noLayoutRoutes = ["/login", "/register", "/error"];

  return noLayoutRoutes.includes(location.pathname) ? (
    <>{children}</>
  ) : (
    <Layout>{children}</Layout>
  );
};

export default ConditionalLayout;
