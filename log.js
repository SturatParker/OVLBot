const verboseLogs = process.env.VERBOSE_LOGS?.toLocaleUpperCase() == 'TRUE'
exports.log = message => {
    if (!verboseLogs) return;
    console.log(message);
}

exports.error = console.error

exports.loggingBehaviour = () => verboseLogs