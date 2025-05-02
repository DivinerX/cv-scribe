import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { status } = await request.json()
  const id = (await params).id

  console.log("id: ", id)
  console.log("status: ", status)

  const { data: existingUser } = await supabase.from('profiles').select('*').eq('user_id', id)
  console.log("existingUser: ", existingUser)

  const { data, error } = await supabase.from('profiles').update({ status: status }).eq('user_id', id).select('*')

  console.log("data: ", data)
  return NextResponse.json({
    data,
    error
  })
}