import winston from 'winston';

const logFormat = winston.format.printf(info => {
    const formattedDate = info.timestamp;
    return `[${formattedDate}] ${info.level.toUpperCase()}: ${info.message}`;
});

export default winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        logFormat
    ),
    transports: [
        new winston.transports.Console()
    ]
});