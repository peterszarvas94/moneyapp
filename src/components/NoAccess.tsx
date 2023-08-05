import { FaBan } from "react-icons/fa"

function NoAccess() {
  return (
    <div className="flex gap-2 items-center justify-center">
      <FaBan className="text-red-500" />
      <p className="w-fit">Access Denied</p>
    </div>
  );
}

export default NoAccess;
