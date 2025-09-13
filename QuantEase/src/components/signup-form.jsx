import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/useAuth"
import { useNavigate } from "react-router-dom"

export function SignupForm({
  className,
  ...props
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const { signUp, signInWithProvider } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    if (password !== confirmPassword) {
      setError("Passwords don't match")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      setLoading(false)
      return
    }

    try {
      const { data, error: authError } = await signUp(email, password)
      
      if (authError) {
        setError(authError.message)
      } else if (data.user) {
        setSuccess(true)
        // Note: With Supabase, user needs to confirm email before they can sign in
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider) => {
    try {
      setLoading(true)
      const { error } = await signInWithProvider(provider)
      if (error) {
        setError(error.message)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden border-0 shadow-2xl backdrop-blur-md rounded-3xl">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold -900 mb-2">Registration Successful!</h2>
            <p className="-600 mb-4">
              <strong>Important:</strong> Please check your email and click the confirmation link before trying to sign in.
            </p>
            <div className="border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm mb-4">
              <strong>Next Steps:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Check your email inbox (and spam folder)</li>
                <li>Click the "Confirm your email" link</li>
                <li>Return to the login page to sign in</li>
              </ol>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/login')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Go to Login
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 border border-gray-300 hover:border-gray-400 -700 font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Sign Up Again
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border-0 shadow-2xl backdrop-blur-md rounded-3xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-8 md:p-12">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-3xl font-bold -900">Create Account</h1>
                <p className="text-muted-foreground text-balance mt-2">
                  Join QuantEase to access advanced analytics
                </p>
              </div>
              {error && (
                <div className="border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <div className="grid gap-4">
                <Label htmlFor="email" className="text-sm font-medium -700">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="h-12 border border-gray-300 rounded-xl focus:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="grid gap-4">
                <Label htmlFor="password" className="text-sm font-medium -700">Password</Label>
                <Input 
                  id="password" 
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="h-12 border border-gray-300 rounded-xl focus:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="grid gap-4">
                <Label htmlFor="confirmPassword" className="text-sm font-medium -700">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                  className="h-12 border border-gray-300 rounded-xl focus:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <Button 
                type="submit" 
                className="ml-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 py-2 shadow transition-colors"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
              <div
                className="after:border-gray-200 relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="-500 relative z-10 px-4 text-xs">
                  Or continue with
                </span>
              </div>
              <div className="">
                <Button 
                  variant="outline" 
                  type="button" 
                  className="w-full h-12 border border-gray-300 hover:border-gray-400 hover:shadow-lg transition-all duration-200 rounded-xl"
                  onClick={() => handleSocialLogin('google')}
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor" />
                  </svg>
                  <span className="sr-only">Signup with Google</span>
                </Button>
              </div>
              <div className="text-center text-sm">
                <span className="-600">Already have an account?</span>{" "}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-blue-600 hover:text-blue-800 underline underline-offset-4 font-medium transition-colors"
                >
                  Sign in
                </button>
              </div>
            </div>
          </form>
          <div className="relative hidden md:block">
            <div className="absolute inset-0"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-24 h-24 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Join QuantEase</h3>
                <p className="text-sm">Start your journey with advanced quantitative finance tools and insights.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div
        className="-500 text-center text-xs text-balance">
        By creating an account, you agree to our{" "}
        <a href="#" className="text-blue-600 hover:text-blue-800 underline underline-offset-4 transition-colors">Terms of Service</a>{" "}
        and{" "}
        <a href="#" className="text-blue-600 hover:text-blue-800 underline underline-offset-4 transition-colors">Privacy Policy</a>.
      </div>
    </div>
  );
}
