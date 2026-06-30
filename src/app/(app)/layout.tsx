import { redirect } from "next/navigation";
import { auth } from "@/core/auth";
import { ROUTES } from "@/shared/constants";
import { AppShell } from "@/shared/ui/app-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactElement> {
  const session = await auth();
  if (!session) redirect(ROUTES.LOGIN);

  return <AppShell user={session.user ?? {}}>{children}</AppShell>;
}
