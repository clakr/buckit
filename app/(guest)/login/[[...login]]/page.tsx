import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="grid min-h-svh place-content-center">
      <SignIn />
    </main>
  );
}
