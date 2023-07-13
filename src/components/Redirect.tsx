import { useRouter } from "next/router";
import { useEffect } from "react";

interface RedirectProps {
  url: string;
}
function Redirect({ url }: RedirectProps) {
  const router = useRouter();
  useEffect(() => {
    router.push(url);
  }, [url, router]);
  return (
    <div>
      Redirecting...
    </div>
  );
}

export default Redirect;
