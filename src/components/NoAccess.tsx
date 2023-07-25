import DashBoardNav from "./DashBoardNav";

function NoAccess() {
  return (
    <div>
       <h1 className='text-3xl'>Access Denied</h1>
      <DashBoardNav />
    </div>
  );
}

export default NoAccess;
