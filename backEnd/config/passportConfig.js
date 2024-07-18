import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import Author from '../models/Authors.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let author = await Author.findOne({ googleId: profile.id });

        if (!author) {
          author = new Author({
            googleId: profile.id,
            name: profile.name.givenName, 
            lastname: profile.name.familyName, 
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            birthdate: null,
          });

          await author.save();
        }

        done(null, author);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/api/auth/github/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let author = await Author.findOne({ githubId: profile.id });

        if (!author) {
          const [name, ...lastnameParts] = (profile.displayName || profile.username || '').split(' ');
          const lastname = lastnameParts.join(' ');

          let email;
          if (profile.emails && profile.emails.length > 0) {
            email = profile.emails.find((e) => e.primary || e.verified)?.value;
            if (!email) 
              email = profile.emails[0].value;
          }

          if (!email) {
            email = `${profile.id}@github.example.com`;
            console.log(`Email non disponibile per utente ${profile.id} - usiamo mail di fallback`);
          }

          author = new Author({
            githubId: profile.id,
            name: name || 'Github User',
            lastname: lastname,
            email: email,
          });

          await author.save();
        }

        done(null, author);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Author.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
