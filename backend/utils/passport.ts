import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { PrismaClient } from "@prisma/client";
import * as userModel from "../model/user.model.js";


const prisma = new PrismaClient();
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:8000/api/users/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const imageUrl = profile.photos?.[0]?.value;

        if (!email) return done(new Error("Email not found in profile"), null);

        let user = await prisma.user.findUnique({
          where: { email },
        });
        if (!user) {
          user = await userModel.createUser({
            name,
            email,
            password: "set password", 
            imageUrl,
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
