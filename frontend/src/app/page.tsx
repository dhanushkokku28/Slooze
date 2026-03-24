"use client";

import { useQuery } from "@apollo/client/react";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Dashboard } from "@/components/dashboard";
import { BOOTSTRAP_QUERY } from "@/lib/graphql";
import { User } from "@/lib/types";

export default function Home() {
  const [activeUserId, setActiveUserId] = useState<string | undefined>(undefined);

  return (
    <AppShell userId={activeUserId}>
      <Landing activeUserId={activeUserId} onSetActiveUserId={setActiveUserId} />
    </AppShell>
  );
}

function Landing({
  activeUserId,
  onSetActiveUserId,
}: {
  activeUserId: string | undefined;
  onSetActiveUserId: (nextId: string) => void;
}) {
  const { data, loading, error } = useQuery<{ demoUsers: User[] }>(BOOTSTRAP_QUERY);

  const users = useMemo(() => (data?.demoUsers ?? []) as User[], [data]);

  useEffect(() => {
    if (!activeUserId && users.length > 0) {
      onSetActiveUserId(users[0].id);
    }
  }, [activeUserId, onSetActiveUserId, users]);

  if (loading) {
    return <main className="mx-auto w-full max-w-6xl px-4 py-10">Loading users...</main>;
  }

  if (error) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-10 text-danger">{error.message}</main>
    );
  }

  if (!activeUserId) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-10 text-muted">
        No users found. Seed backend first.
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 md:py-10">
      <Dashboard
        activeUserId={activeUserId}
        onSwitchUser={onSetActiveUserId}
        userOptions={users}
      />
    </main>
  );
}
