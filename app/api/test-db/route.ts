import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createServerClient()

    // Test auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError) {
      return NextResponse.json({
        success: false,
        authError: authError.message
      })
    }

    // Test database connection
    const { data, error: dbError } = await (supabase as any)
      .from('projects')
      .select('count')
      .limit(1)

    if (dbError) {
      return NextResponse.json({
        success: false,
        user: user?.email,
        dbError: dbError.message,
        dbErrorDetails: dbError
      })
    }

    return NextResponse.json({
      success: true,
      user: user?.email,
      database: 'connected'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
  }
}
