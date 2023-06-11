import type { NextPage } from "next";
import { api } from "~/utils/api";

const Migrate: NextPage = () => {
  const migrate = api.migration.migrate.useMutation();

  return (
    <div
      className="flex flex-col items-center justify-center h-20 py-2"
    >
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          migrate.mutate();
        }}
      >
        Migrate
      </button>
    </div>
  )
};

export default Migrate;
