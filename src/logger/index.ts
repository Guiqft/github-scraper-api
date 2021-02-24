import * as Winston from 'winston'

class Logger {
    public static Instance (): Winston.Logger {
        return Winston.createLogger({
            level: 'info',
            transports: [
                new Winston.transports.Console({
                    handleExceptions: true,
                    format: Winston.format.combine(
                        Winston.format.colorize({ colors: { info: 'white', error: 'white' }, all: false }),
                        Winston.format.timestamp(),
                        Winston.format.align(),
                        Winston.format.splat(),
                        Winston.format.ms(),
                        Winston.format.printf(context => {
                            const { timestamp, level, message, ms } = context

                            const ts = timestamp.slice(0, 19)

                            return `[server]: ${ts} ${level} ${message} (${ms})`
                        })
                    )
                })
            ]
        })
    }
}

export default Logger.Instance()