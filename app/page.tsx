import { SignedIn, UserButton } from "@clerk/nextjs";

export default function Home() {
  return <>
  <SignedIn>
    <UserButton />
  </SignedIn>
  </>
}
