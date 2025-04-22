import passport, { use } from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User, { findOne } from '../models/User';

use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await findOne({ email: profile.emails[0].value });
        
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
// This file is responsible for configuring the Google OAuth strategy using Passport.js.
// It uses the GoogleStrategy from the passport-google-oauth20 package to authenticate users.
// The strategy is configured with the client ID, client secret, and callback URL from environment variables.
// When a user is authenticated, it checks if the user already exists in the database.
// If the user exists, it returns the user object. If not, it creates a new user with the information from the Google profile.
// The user is then saved to the database, and the user object is returned.
// The module exports the configured passport instance for use in other parts of the application.
// This file is responsible for configuring the Google OAuth strategy using Passport.js.