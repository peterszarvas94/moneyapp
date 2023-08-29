import Skeleton from "~/components/Skeleton";

export default function EventLoading() {
  return (
    <li className="pb-4">
      <div className="border border-gray-200 rounded-lg">

        {/* event details */}
        <ul className="flex flex-col gap-2 pb-2">

          {/* name */}
          <li className="flex items-center bg-gray-200 rounded-t-inner p-2 h-10">
            <Skeleton variant="dark" />
          </li>

          {/* delivery */}
          <li className="flex items-center px-2 h-6">
            <Skeleton />
          </li>

          {/* income */}
          <li className="flex items-center px-2 h-6">
            <Skeleton />
          </li>

        </ul >
      </div >
    </li >
  );
}
