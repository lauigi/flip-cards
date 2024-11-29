import User from '@/app/models/User';
import { auth } from '@/libs/auth';
import connect from '@/libs/mongodb';
import { NextResponse } from 'next/server';

export const GET = auth(async function GET(req) {
  let email = '';
  if (!req.auth) {
    if (process.env.NODE_ENV === 'development') {
      email = 'demo@example.com';
    } else {
      return NextResponse.json([]);
    }
  } else {
    email = req.auth.user!.email as string;
  }
  await connect();
  const user = await User.findOne({ email }).populate('topics');
  return NextResponse.json(user.topics);
});
