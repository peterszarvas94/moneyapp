import type { NextPage } from "next";
import useIdParser from "~/hooks/useIdParser";

const NewPaymentPage: NextPage = () => {
  const { parsedId: eventId } = useIdParser("eventId");
  return (
    <div>
      <h1>New Payment Page</h1>
    </div>
  )
}

export default NewPaymentPage;
