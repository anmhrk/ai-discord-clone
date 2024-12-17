import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <SignInButton />
      <SignUpButton />
    </div>
  );
}
