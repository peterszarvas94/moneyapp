import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
function Card({ children }: Props) {
  return (
    <div className="border-px border-gray-200 border-y">
      {children}
    </div>
  )
}
export default Card;
