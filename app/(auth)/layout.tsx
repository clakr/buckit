import { UserButton } from "@clerk/nextjs";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <nav className="border-b">
        <div className="mx-auto flex max-w-screen-xl justify-end px-6 py-3">
          <UserButton />
        </div>
      </nav>
      {children}
    </>
  );
}
