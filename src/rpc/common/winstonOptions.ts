/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import winston from 'winston';

const { combine, timestamp, printf, label, colorize } = winston.format;

export enum LEVELS {
  error = 'error',
  warn = 'warn',
  info = 'info',
  verbose = 'verbose',
  debug = 'debug',
  silly = 'silly',
}

function kvString(meta = {}) {
  return Object.entries(meta)
    .map(([k, v]) => `${k}=${v}`)
    .join(' ');
}

const MSG_WIDTH = 45;

const logFormat = printf(({ level, message, label, timestamp, ...meta }) => {
  let upperLevel = level.toUpperCase();
  if (upperLevel.length == 4) {
    upperLevel += '   ';
  }
  if (upperLevel.length == 5) {
    upperLevel += '  ';
  }

  const paramStr = kvString(meta);
  const msgPart =
    (message as any).length > MSG_WIDTH
      ? (message as any).slice(0, MSG_WIDTH)
      : (message as any).padEnd(MSG_WIDTH, ' ');

  const colorizer = colorize();

  const coloredLevel = colorizer.colorize(level, `${upperLevel}[${timestamp}] ${label}:: ${msgPart}${paramStr}`);

  return coloredLevel;
});

export const createLoggerOptions = (level: LEVELS = LEVELS.debug, serviceLabel = 'PM') => ({
  transports: [
    new winston.transports.Console({
      level,
      format: combine(
        timestamp({
          format: 'MM-DD|HH:mm:ss.SSS',
        }),
        label({ label: serviceLabel }),
        logFormat,
      ),
    }),
  ],
});
