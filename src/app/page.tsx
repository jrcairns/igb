import { Onboarding } from "@/components/onboarding";
import { getFacebookAccessToken } from "./fb/token";
import { FacebookApi } from "./fb";
import { Suspense } from "react";

export default async function Home() {
  return (
    <div className="p-4">
      <Suspense fallback={<div>loading...</div>}>
        <Accounts />
      </Suspense>
    </div>
  );
}


async function Accounts() {
  const accessToken = await getFacebookAccessToken();

  if (!accessToken) {
    return null
  }

  const api = new FacebookApi(accessToken)

  const accounts = await api.getInstagramBusinessAccounts()

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <Onboarding accounts={accounts} />
    </div >
  )
}