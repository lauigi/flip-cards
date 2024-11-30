import User from '@/models/User';
import { auth } from '@/lib/auth';
import connect from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export const GET = auth(async function GET(req) {
  let email = '';
  if (!req.auth) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  } else {
    email = req.auth.user!.email as string;
  }
  await connect();
  const user = await User.findOne({ email }).populate('topics');
  return NextResponse.json(user.topics);
});
