import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.js';
import { config } from 'dotenv';
// Load environment variables
config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID ,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ email: profile.emails[0].value });
        
        if (user) {
          return done(null, user);
        }
        
        // Create new user if doesn't exist
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          // We're using Google auth, so no password needed
          password: 'google-auth-' + Math.random().toString(36).slice(-8),
          authType: 'google'
        });
        
        await user.save();
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport;