import { SignIn } from "@clerk/nextjs";

export default function Page(){
    return <main className="min-h-svh grid place-content-center">
        <SignIn />
    </main>
}