import { blue, greenBright, red, yellowBright } from 'chalk'

export class Logger {
    /** For Info Messages  */ 
    info(...args: any[]) {
        console.log(blue("[INFO]: "), args)
    }

    /** For Error Messages */
    error(...args: any[]) {
        console.error(red("[ERROR]: "), ...args)
    }

    /** For Warning Messages */
    warn(...args: any[]) {
        console.warn(yellowBright("[WARNING]: "), ...args)
    }

    /** For Success Messages */
    success(...args: any[]) {
        console.log(greenBright("[SUCCESS]: "), ...args)
    }
}