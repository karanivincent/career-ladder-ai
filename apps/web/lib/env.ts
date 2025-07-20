// Frontend environment variables validation
// Note: In Next.js, only NEXT_PUBLIC_ prefixed variables are available in the browser

interface EnvVars {
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  NEXT_PUBLIC_API_URL: string
}

function validateEnv(): EnvVars {
  const errors: string[] = []
  
  // Check required environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL is required')
  }
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is required')
  }
  
  if (!process.env.NEXT_PUBLIC_API_URL) {
    errors.push('NEXT_PUBLIC_API_URL is required')
  }
  
  // Throw error if any validation fails
  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`)
  }
  
  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL!,
  }
}

// Validate environment variables on module load
export const env = validateEnv()

// Export individual variables for convenience
export const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
export const SUPABASE_ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
export const API_URL = env.NEXT_PUBLIC_API_URL