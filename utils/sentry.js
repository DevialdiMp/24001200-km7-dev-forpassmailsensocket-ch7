const Sentry = require('@sentry/node');

function initializeSentry() {
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        tracesSampleRate: 1.0,
    });
}

module.exports = { initializeSentry };