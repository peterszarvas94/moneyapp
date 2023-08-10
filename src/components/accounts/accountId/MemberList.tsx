import { useEffect, useState } from "react";
import Card from "~/components/Card";
import CardLink from "~/components/CardLink";
import CardLoading from "~/components/CardLoading";
import CardNoItem from "~/components/CardNoItem";
import CardTitle from "~/components/CardTitle";
import { useAccountContext } from "~/context/account";
import { api } from "~/utils/api";
import { Member } from "~/utils/types";

export default function MemberList() {
  const { accountId } = useAccountContext();
  const { data: members } = api.account.getMembers.useQuery({ accountId });

  const [admins, setAdmins] = useState<Member[] | null>(null);
  const [viewers, setViewers] = useState<Member[] | null>(null);

  useEffect(() => {
    if (members) {
      const newAdmins = members.filter(member => member.access === "admin")
      setAdmins(newAdmins);

      const newViewers = members.filter(member => member.access === "viewer")
      setViewers(newViewers);
    }
  }, [members]);

  return (
    <>
      <div className="px-4 pt-4">
        <Card>
          <CardTitle title="Admins" />
          <List nodata="No admins." members={admins} />
        </Card>
      </div>
      <div className="px-4 pt-4">
        <Card>
          <CardTitle title="Viewers" />
          <List nodata="No viewers." members={viewers} />
        </Card>
      </div>
    </>
  )
}

interface Props {
  nodata: string,
  members: Member[] | null,
}

function List({ nodata, members }: Props) {
  const { accountId } = useAccountContext();
  const { data: self } = api.user.getSelf.useQuery();

  if (!members || !self) {
    return (
      <CardLoading />
    )
  }

  if (members.length === 0) {
    return (
      <CardNoItem>{nodata}</CardNoItem>
    )
  }

  return (
    <ul>
      {
        members.map((member) => (
          <CardLink
            key={member.id}
            url={`/accounts/${accountId}/members/${member.id}`}
            text={`${member.user.name} (${member.user.email})`}
          />
        ))
      }
    </ul>
  )
}
