import { auth } from '@/lib/auth';
import connect from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export const GET = async function () {
  let email = '';
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  } else {
    email = session.user.email as string;
  }
  await connect();
  const user = await User.findOne({ email }).lean().populate('topics');
  return NextResponse.json(user);
};
