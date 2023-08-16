import { useEffect } from "react";
import { api } from "~/utils/api";

interface Props {
	value: string;
	setValue: (value: string) => void;
	isMember: boolean;
	setIsMember: (value: boolean) => void;
	isSelf: boolean;
	setIsSelf: (value: boolean) => void;
}

export function InputUser({ value, setValue, isMember, setIsMember, isSelf, setIsSelf }: Props) {
	const { data: self } = api.user.getSelf.useQuery();

	useEffect(() => {
		if (isSelf && self) {
			setValue(self.email);
		}
	}, [isSelf, self]);

	return (
		<>
			<div className="flex gap-2">
				<input
					type="checkbox"
					checked={isMember}
					onChange={() => {
						setIsMember(!isMember);
						setValue("");
						setIsSelf(false);
					}}
					name="isMember"
				/>
				<label
					className="flex items-center"
					htmlFor="isMember"
				>
					Member of the account (admin or viewer)?
				</label>
			</div>

			<div className="flex gap-2">
				<input
					type="checkbox"
					checked={isSelf}
					onChange={() => setIsSelf(!isSelf)}
					disabled={!isMember}
					name="me"
				/>
				<label
					className={`flex items-center ${!isMember && "text-gray-500"}`}
					htmlFor="me"
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
					disabled={isSelf || !isMember}
					type="email"
					name="email"
				/>
			</div>

		</>
	)
}
