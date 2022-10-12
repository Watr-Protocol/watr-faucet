import  TelegramBot, { Update }  from "node-telegram-bot-api"
import { MessageType, telegramMessage } from "./MessageType"
export default class WatrBot {
    private bot: TelegramBot
    private COMMAND: string = "/hydrate"
    private sendMessages: boolean

    constructor(token: string, sendMessages: boolean) {
        this.bot = new TelegramBot(token)
        this.sendMessages = sendMessages
        console.debug(`Initialising bot with sending ${this.sendMessages ? "on" : "off"}`)
    }

    parse(input: Update): [boolean, string|null] {
        const text = input.message?.text ?? input.channel_post?.text
        const validCommand = text?.startsWith(this.COMMAND) ?? false
        let address: string|null = null
        if (validCommand) {
            address = text!!.replace(`${this.COMMAND} `, "").trim()
        }
        return [validCommand, address]
    }

    send(input: Update, messageType: MessageType): void {
        if (this.sendMessages) {
            this.bot.sendMessage(input.channel_post?.chat.id ?? input.message!!.chat.id, telegramMessage(messageType))
        } else {
            console.debug(`Received update: ${input}`)
            console.debug(`Logging dummy message: ${telegramMessage(messageType)}`)
        }
    }
}