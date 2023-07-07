import Link from "next/link";

function DashBoardNav() {
  return (
    <nav>
      <ul className='flex flex-col underline'>
	<Link href="/">Home</Link>
	<Link href="/dashboard">Dashboard</Link>
	<Link href="/dashboard/accounts">Accounts</Link>
      </ul>
    </nav>
  );
}

export default DashBoardNav;
