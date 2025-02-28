const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken"); 
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // เอาค่าจาก Google Developer Console
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            authProvider: "google", // ✅ ระบุว่าใช้ Google login
          });
        }

        // ✅ สร้าง JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1m", // Token ใช้ได้ 1 ชั่วโมง
        });

        return done(null, { user, token }); // ✅ ส่ง token กลับไป
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((data, done) => {
  done(null, { id: data.user.id, token: data.token }); // ✅ Serialize พร้อม JWT
});

passport.deserializeUser(async (data, done) => {
  try {
    const user = await User.findById(data.id);
    done(null, { user, token: data.token }); // ✅ Deserialize พร้อม JWT
  } catch (error) {
    done(error, null);
  }
});