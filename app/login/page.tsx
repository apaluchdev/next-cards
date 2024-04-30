import { useSearchParams } from "next/navigation";
import Login from "@/components/login";
import { Suspense } from "react";

const LoginPage: React.FC = () => {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
};

export default LoginPage;
