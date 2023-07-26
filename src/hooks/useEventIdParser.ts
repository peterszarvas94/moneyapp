import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { AppContext } from "~/context/app";

function useEventIdParser() {
  const router = useRouter();
  const { eventId } = router.query;
  const { setEventId } = useContext(AppContext);

  useEffect(() => {
    if (typeof eventId !== "string") {
      return;
    }
    const parsed = parseInt(eventId);
    if (isNaN(parsed)) {
      return;
    }
    setEventId(parsed);
  }, [eventId]);

  return;
}

export default useEventIdParser;
