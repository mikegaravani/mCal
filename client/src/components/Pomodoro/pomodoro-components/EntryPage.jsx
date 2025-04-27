import React from "react";
import EPForm from "./EPForm";
import EPSessionTip from "./EPSessionTip";
import { useUserStore } from "@/store/useUserStore";

function EntryPage({ onStart, onSPClick }) {
  const { user, fetchUser, loading } = useUserStore();

  React.useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <div className="bg-gray-100 flex flex-col items-center pb-4 min-h-full">
      <header className="text-start inline-block text-3xl text-gray-800 my-5 mt-12 font-bold font-sans shadow-sm transition-transform duration-300 whitespace-nowrap">
        <h1 className="text-3xl font-bold">
          Your Pomodoro, {loading ? "Loading..." : user?.username ?? "Guest"}
        </h1>
      </header>

      <main className="flex flex-col lg:flex-row lg:mt-16 justify-cente items-stretch gap-8 mt-8 px-4 lg:px-16 w-full max-w-7xl">
        <div className="bg-white shadow-lg rounded-lg p-6 flex-1">
          <EPForm onStart={onStart} />
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 flex-1">
          <EPSessionTip onSPClick={onSPClick} />
        </div>
      </main>
    </div>
  );
}

export default EntryPage;
