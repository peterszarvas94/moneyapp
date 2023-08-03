import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function useEventIdParser() {
  const router = useRouter();
  const { eventId } = router.query;
  const [realId, setRealId] = useState<number | null>(null);

  useEffect(() => {
    if (typeof eventId !== "string") {
      return;
    }
    const parsed = parseInt(eventId);
    if (isNaN(parsed)) {
      return;
    }
    setRealId(parsed);
  }, [eventId]);

  return {
    eventId: realId
  }
}

export default useEventIdParser;
