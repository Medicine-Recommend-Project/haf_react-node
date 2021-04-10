const winston = require('winston');
require('winston-daily-rotate-file');
const logDir = '../../servers/logs';

// 참고 : https://velog.io/@denmark-banana/%EA%B0%84%EB%8B%A8%ED%95%9C-Node.js-API-Server-%EB%A7%8C%EB%93%A4%EA%B8%B0-1
// 참고2 : https://velog.io/@ash/Node.js-%EC%84%9C%EB%B2%84%EC%97%90-logging-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC-winston-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0
// 참고3 : https://levelup.gitconnected.com/better-logs-for-expressjs-using-winston-and-morgan-with-typescript-1c31c1ab9342

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}

const level = () => {
    const env = process.env.NODE_ENV || 'development'
    const isDevelopment = env === 'development'
    return isDevelopment ? 'debug' : 'warn'
}

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
}

winston.addColors(colors);

const format = winston.format.combine(
    winston.format.timestamp({ format: ' YYYY-MM-DD HH:MM:SS ||' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} [ ${info.level} ] ▶ ${info.message}`,
    ),
)

const logger = winston.createLogger({

    format,
    level: level(),
    transports: [
        new winston.transports.DailyRotateFile({
            level: 'info',	//winston 로그 레벨
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,
            filename: `%DATE%.log`,
            zippedArchive: true,	//압축 여부
            handleExceptions: true,
            maxFiles: 30,  // 30일치 로그 파일 저장
        }),
        // error 레벨 로그를 저장할 파일 설정
        new winston.transports.DailyRotateFile({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir + '/error',  // error.log 파일은 /logs/error 하위에 저장
            filename: `%DATE%.error.log`,
            zippedArchive: true,
            maxFiles: 30,
        }),
        new winston.transports.Console({
            handleExceptions: true,
        })
    ]
});

module.exports = logger;









// const winston = require('winston');
// const winstonDaily = require('winston-daily-rotate-file');
// // 참고 : https://velog.io/@ash/Node.js-%EC%84%9C%EB%B2%84%EC%97%90-logging-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC-winston-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0
//
// const logDir = 'logs';  // logs 디렉토리 하위에 로그 파일 저장
// const { combine, timestamp, printf } = winston.format;
//
// // Define log format
// const logFormat = printf(info => {
//     return `${info.timestamp} ${info.level}: ${info.message}`;
// });
//
// /*
//  * Log Level
//  * winston의 로그 레벨은 다음과 같고, 숫자가 낮을 수록 priority가 높습니다.
//  * level을 설정하면 해당 레벨 이상의 priority를 가지는(즉, 숫자가 같거나 낮은) 로그를 출력하게 됩니다.
//  * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
//  */
// const logger = winston.createLogger({
//     format: combine(
//         timestamp({
//             format: 'YYYY-MM-DD HH24:MI:SS',
//         }),
//         logFormat,
//     ),
//     transports: [
//         // info 레벨 로그를 저장할 파일 설정
//         new winstonDaily({
//             level: 'info',
//             datePattern: 'YYYY-MM-DD',
//             dirname: logDir,
//             filename: `%DATE%.log`,
//             maxFiles: 30,  // 30일치 로그 파일 저장
//             zippedArchive: true,
//         }),
//         // error 레벨 로그를 저장할 파일 설정
//         new winstonDaily({
//             level: 'error',
//             datePattern: 'YYYY-MM-DD',
//             dirname: logDir + '/error',  // error.log 파일은 /logs/error 하위에 저장
//             filename: `%DATE%.error.log`,
//             maxFiles: 30,
//             zippedArchive: true,
//         }),
//     ],
// });
//
// // Production 환경이 아닌 경우(dev 등)
// if (process.env.NODE_ENV !== 'production') {
//     logger.add(new winston.transports.Console({
//         format: winston.format.combine(
//             winston.format.colorize(),  // 색깔 넣어서 출력
//             winston.format.simple(),  // `${info.level}: ${info.message} JSON.stringify({ ...rest })` 포맷으로 출력
//         )
//     }));
// }
//
// module.exports = logger;
