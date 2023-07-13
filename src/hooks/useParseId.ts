import { useEffect, useState } from "react";

interface Props {
  id: string | string[] | undefined;
}
function useParseId({ id }: Props) {
  const [parsedId, setParsedId] = useState<number | undefined>(undefined);
  useEffect(() => {
    if (typeof id !== "string") {
      return;
    }
    const parsed = parseInt(id);
    if (isNaN(parsed)) {
      return;
    }
    setParsedId(parsed);
  }, [id]);

  return {
    parsedId
  }
}

export default useParseId;
