import { useEffect, useState } from "react";
import { api } from "~/utils/api";

interface Props {
	value: string;
	setValue: (value: string) => void;
	isMember: boolean;
	setIsMember: (value: boolean) => void;
}

export function InputUser({ value, setValue, isMember, setIsMember }: Props) {
	const [me, setMe] = useState<boolean>(false);
	const { data: self } = api.user.getSelf.useQuery();

	useEffect(() => {
		if (me && self) {
			setValue(self.email);
		}
	}, [me, self]);

	return (
		<>
			<div className="flex gap-2">
				<input
					type="checkbox"
					checked={isMember}
					onChange={() => {
						setIsMember(!isMember);
						setValue("");
						setMe(false);
					}}
				/>
				<label className="flex items-center">Member of the account (admin or viewer)?</label>
			</div>

			<div className="flex gap-2">
				<input
					type="checkbox"
					checked={me}
					onChange={() => setMe(!me)}
					disabled={!isMember}
				/>
				<label
					className={`flex items-center ${!isMember && "text-gray-500"}`}
				>
					Select current user
				</label>
			</div>
			
			<div className="py-2">
				<input
					className="p-2 border-black disabled:border-gray-300 border-b-2 bg-gray-100 active:outline-none focus:outline-none w-full disabled:text-gray-500"
					required={isMember}
					value={value}
					onChange={(e) => setValue(e.target.value)}
					disabled={me || !isMember}
					type="email"
				/>
			</div>

		</>
	)
}
