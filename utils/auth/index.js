const passport = require('passport');
const LocalStrategy = require('./strategies/local.strategy');
const { JwtAccessStrategy, JwtRefreshStrategy, JwtPasswordResetStrategy } = require('./strategies/jwt.strategy');

passport.use('local', LocalStrategy); // Asigna un nombre a la estrategia local (puedes utilizar cualquier nombre)

passport.use('jwt-access', JwtAccessStrategy); // Asigna un nombre a la estrategia de token de acceso (puedes utilizar cualquier nombre)
passport.use('jwt-refresh', JwtRefreshStrategy); // Asigna un nombre a la estrategia de token de refresco (puedes utilizar cualquier nombre)
passport.use('jwt-password-reset', JwtPasswordResetStrategy); // Asigna un nombre a la estrategia de reseteo de contraseña (puedes utilizar cualquier nombre)
