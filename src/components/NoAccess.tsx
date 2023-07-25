import { useEffect, useState } from "react";
import DashBoardNav from "./DashBoardNav";
import Spinner from "./Spinner";

function NoAccess() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const ticking = setTimeout(() => {
      setLoaded(true);
    }, 2000);

    return () => {
      clearTimeout(ticking);
    }
  }, []);

  if (!loaded) {
    return (
      <Spinner />
    )
  }

  return (
    <div>
      <h1 className='text-3xl'>Access Denied</h1>
      <DashBoardNav />
    </div>
  );
}

export default NoAccess;
