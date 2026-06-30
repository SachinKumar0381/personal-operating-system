import type { NextAuthConfig } from "next-auth";
import { ROUTES } from "@/shared/constants";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: ROUTES.LOGIN,
    error: ROUTES.LOGIN,
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthPage =
        nextUrl.pathname === ROUTES.LOGIN || nextUrl.pathname === ROUTES.REGISTER;

      if (isAuthPage) {
        if (isLoggedIn) return Response.redirect(new URL(ROUTES.DASHBOARD, nextUrl));
        return true;
      }

      if (!isLoggedIn) return false;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  providers: [],
};
