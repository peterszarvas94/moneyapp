import React from "react";
import { api } from "~/utils/api";

interface Props {
  id: number;
}

function AccountForAdmin({ id }: Props) {

  const { data: account } = api.account.get.useQuery({ id });

  return (
    <>
      <h1 className='text-3xl'>You are admin of Account for {id}</h1>
      <ul>
	<li>Name: {account?.name}</li>
	<li>Description: {account?.description}</li>
      </ul>
    </>
  )
}

export default AccountForAdmin;
