const morgan = require("morgan");
const StreamOptions = require("morgan");
const Logger = require('../config/logger');

// 참고 : https://levelup.gitconnected.com/better-logs-for-expressjs-using-winston-and-morgan-with-typescript-1c31c1ab9342

// Override the stream method by telling
// Morgan to use our custom logger instead of the console.log.
const stream = {
    // Use the http severity
    write: message => { Logger.http(message) }
};

const skip = () => {
    const env = process.env.NODE_ENV || "development";
    return env !== "development";
};

// Build the morgan middleware
// morgan 함수의 인자(format)로는 short, dev, common, combined 가 올 수 있다. (정보의 노출 수준)
// 보통 배포시에는 combined 혹은 common 에 필요한 정보들을 추가하여 사용하는 것을 추천
const morganMiddleware = morgan(
    "===============================================================================================================\n" +
    "                                  요청_ :method | URL_ ':url' | 상태_ :status | 주소,IP_ :remote-addr :remote-user | 응답시간_ :res[content-length] - :response-time ms",
    { stream, skip }
);

module.exports =  morganMiddleware;