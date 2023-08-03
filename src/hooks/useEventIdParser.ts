import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function useEventIdParser() {
  const router = useRouter();
  const { eventId } = router.query;
  const [realId, setRealId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof eventId === "string") {
      setRealId(eventId);
    }
  }, [eventId]);

  return {
    eventId: realId
  }
}

export default useEventIdParser;
