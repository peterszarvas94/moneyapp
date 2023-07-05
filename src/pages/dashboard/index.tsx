import { UserButton } from "@clerk/nextjs";
import { NextPage } from "next";
import Link from "next/link";

const DashBoard: NextPage = () => {
  return (
    <div>
      <h1 className='text-3xl'>This is Dashboard</h1>
      <Link
        href='/'
        className='underline'
      >
        Back to home
      </Link>
      <UserButton />
    </div>
  )
}

export default DashBoard;
