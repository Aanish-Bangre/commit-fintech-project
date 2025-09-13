import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabase"
import { useNavigate } from "react-router-dom"

export function LoginForm({
  className,
  ...props
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [resetSent, setResetSent] = useState(false)
  const [showResendConfirmation, setShowResendConfirmation] = useState(false)
  const { signIn, signInWithProvider } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: authError } = await signIn(email, password)
      
      if (authError) {
        if (authError.message.includes('Email not confirmed')) {
          setError('Please confirm your email address before signing in. Check your inbox for a confirmation email.')
          setShowResendConfirmation(true)
        } else {
          setError(authError.message)
        }
      } else if (data.user) {
        // Successfully signed in
        navigate('/dashboard')
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

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first')
      return
    }

    try {
      setLoading(true)
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) {
        setError(error.message)
      } else {
        setResetSent(true)
        setError(null)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    if (!email) {
      setError('Please enter your email address first')
      return
    }

    try {
      setLoading(true)
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      })
      if (error) {
        setError(error.message)
      } else {
        setError(null)
        setResetSent(true)
        setShowResendConfirmation(false)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border-0 shadow-2xl backdrop-blur-md rounded-3xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-8 md:p-12">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-3xl font-bold ">Welcome back</h1>
                <p className="text-muted-foreground text-balance mt-2">
                  Login to your QuantEase account
                </p>
              </div>
              {error && (
                <div className="border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {resetSent && (
                <div className="border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                  Email sent! Check your inbox for further instructions.
                </div>
              )}
              {showResendConfirmation && (
                <div className="border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm">
                  <p className="mb-2">Need a new confirmation email?</p>
                  <button
                    type="button"
                    onClick={handleResendConfirmation}
                    disabled={loading}
                    className="text-blue-600 hover:text-blue-800 underline font-medium disabled:opacity-50"
                  >
                    Resend confirmation email
                  </button>
                </div>
              )}
              <div className="grid gap-4">
                <Label htmlFor="email" className="text-sm font-medium 700">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="h-12 border-0 rounded-xl shadow-inner focus:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="grid gap-4">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-sm font-medium 700">Password</Label>
                  <button 
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={loading}
                    className="ml-auto text-sm text-blue-600 hover:text-blue-800 underline-offset-2 hover:underline transition-colors disabled:opacity-50"
                  >
                    Forgot your password?
                  </button>
                </div>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="h-12 border-0 rounded-xl shadow-inner focus:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <Button 
                type="submit" 
                className="ml-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 py-2 shadow transition-colors"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Login'}
              </Button>
              <div
                className="after:border-gray-200 relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="500 relative z-10 px-4 text-xs">
                  Or continue with
                </span>
              </div>
              <div className="">
                <Button 
                  variant="outline" 
                  type="button" 
                  className="w-full h-12 border-0 hover:shadow-lg transition-all duration-200 rounded-xl"
                  onClick={() => handleSocialLogin('google')}
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor" />
                  </svg>
                  <span className="sr-only">Login with Google</span>
                </Button>
              </div>
              <div className="text-center text-sm">
                <span className="600">Don&apos;t have an account?</span>{" "}
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="text-blue-600 hover:text-blue-800 underline underline-offset-4 font-medium transition-colors"
                >
                  Sign up
                </button>
              </div>
            </div>
          </form>
          <div className="relative hidden md:block">
            <div className="absolute inset-0"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <div className="w-24 h-24 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">QuantEase Analytics</h3>
                <p className="text-white/80 text-sm">Your gateway to advanced quantitative finance tools and insights.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div
        className="500 text-center text-xs text-balance">
        By clicking continue, you agree to our{" "}
        <a href="#" className="text-blue-600 hover:text-blue-800 underline underline-offset-4 transition-colors">Terms of Service</a>{" "}
        and{" "}
        <a href="#" className="text-blue-600 hover:text-blue-800 underline underline-offset-4 transition-colors">Privacy Policy</a>.
      </div>
    </div>
  );
}
