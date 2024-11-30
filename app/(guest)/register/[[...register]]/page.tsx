import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="grid min-h-svh place-content-center">
      <SignUp />
    </main>
  );
}
