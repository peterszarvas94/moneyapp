import type { ReactNode } from "react";
import type { Access, Page } from "~/utils/types";
import NoAccess from "~/components/NoAccess";
import Spinner from "~/components/Spinner";
import HeadElement from "~/components/nav/HeadElement";
import { AccountContext } from "~/context/account";
import usePageLoader from "~/hooks/usePageLoader";

interface Props {
  title: string,
  children: ReactNode,
  accessible: "admin" | "viewer",
}

export default function AccessedPage({ title, children, accessible }: Props) {
  return (
    <>
      <HeadElement title={title} description="Split the money" />
      <Page accessible={accessible}>
        {children}
      </Page>
    </>
  )
}

interface PageProps {
  accessible: Access,
  children: ReactNode,
}
function Page({ children, accessible }: PageProps) {
  const { accountId, access } = usePageLoader();

  if (!accountId || !access) {
    return (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
    )
  }

  // admin can access admin and viewer
  // viewer can only access viewer
  // denied can't access anything
  if (
    access === "denied" ||
    (accessible === "admin" && access === "viewer")
  ) {
    return (
      <NoAccess />
    )
  }

  return (
    <AccountContext.Provider value={{ accountId, access }}>
      {children}
    </AccountContext.Provider>
  )
}
