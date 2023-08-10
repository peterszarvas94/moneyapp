import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function useIdParser(id: string) {
  const router = useRouter();
  const routerId = router.query[id];
  const [parsedId, setParsedId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof routerId === "string") {
      setParsedId(routerId);
    }
  }, [routerId]);

  return {
    parsedId
  }
}

export default useIdParser;
