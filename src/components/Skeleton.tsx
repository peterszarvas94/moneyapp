interface Props {
  variant?: "dark";
}

function Skeleton({ variant }: Props) {
  const bgColor = variant === "dark" ? "bg-gray-400" : "bg-gray-200";

  return (
    <div role="status" className="w-48 animate-pulse">
      <div className={`h-3 ${bgColor} rounded-full`} />
    </div>
  )
}

export default Skeleton;
