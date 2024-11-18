const Sentry = require('@sentry/node');

function sentryErrorHandler(err, req, res, next) {
    Sentry.captureException(err);
    console.error(err);

    if (err.status === 400) {
        return res.status(400).render('error', {
            message: err.message,
            error: {}
        });
    }

    if (err.status === 404) {
        return res.status(404).render('error', {
            message: 'Not Found! Email atau halaman tidak ditemukan.',
            error: {}
        });
    }

    res.status(500).render('error', {
        message: 'Terjadi kesalahan pada server',
        error: err
    });
}

module.exports = sentryErrorHandler;