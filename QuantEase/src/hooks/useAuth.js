import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useAuth() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const signInWithProvider = async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
    })
    return { data, error }
  }

  const resendConfirmation = async (email) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    })
    return { error }
  }

  return {
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithProvider,
    resendConfirmation,
    user: session?.user ?? null,
  }
}
