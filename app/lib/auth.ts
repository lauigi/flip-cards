import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Github from 'next-auth/providers/github';
import User, { IUser } from '@/models/User';
import type { Provider } from 'next-auth/providers';
import connect from './mongodb';

const providers: Provider[] = [Google, Github];

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
    async session({ session }) {
      const { email } = session.user;
      const existingUser = (await User.findOne({ email: email })) as IUser;
      if (!existingUser) {
        return session;
      }
      const newSession = {
        ...session,
        user: { ...session.user, name: existingUser.name, image: existingUser.avatar },
      };
      return newSession;
    },
  },
  secret: process.env.AUTH_SECRET,
});
