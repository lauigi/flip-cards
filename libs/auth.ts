import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import User from '@/app/models/User';
import type { Provider } from 'next-auth/providers';
import connect from './mongodb';

const providers: Provider[] = [Google];

export const providerMap = providers
  .map(provider => {
    if (typeof provider === 'function') {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter(provider => provider.id !== 'credentials');

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user: rawUser }) {
      const user = { ...rawUser };
      if (process.env.NODE_ENV !== 'production') {
        user.email = 'test@bananotes.com';
        user.name = 'Test User';
        user.image = 'https://via.placeholder.com/150';
      }
      try {
        // Ensure database connection
        await connect();
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email,
            avatar: user.image,
            topics: [],
          });
        }

        return true;
      } catch (error) {
        console.error('Error checking/creating user:', error);
        return false;
      }
    },
  },
  secret: process.env.AUTH_SECRET,
});
