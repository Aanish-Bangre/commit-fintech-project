import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-6xl">
        <SignupForm />
      </div>
    </div>
  )
}
