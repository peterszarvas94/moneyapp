import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

function useCheckUserLoaded() {
  const { user } = useUser();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }
    setChecked(true);
  }, [user]);

  return {
    user,
    checked
  };
}

export default useCheckUserLoaded;
