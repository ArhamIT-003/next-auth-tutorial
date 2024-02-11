"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
const Client = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/api/auth/signin?callbackUrl=/client");
    },
  });

  return (
    <div>
      <h1>Client Member server session</h1>
      <p>{session?.user.email}</p>
      <p>{session?.user.name}</p>
    </div>
  );
};

export default Client;
