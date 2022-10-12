import Faucet from "./watr/Faucet"
import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda'
import { Update } from "node-telegram-bot-api"
import WatrBot from "./telegram/WatrBot"
import { MessageType } from "./telegram/MessageType"

export const lambdaHandler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    const liveMode = Boolean(process.env.LIVE_MODE)
    const bot = new WatrBot(process.env.TELEGRAM_TOKEN ?? "", liveMode)
    const body = event.body
    const update: Update = JSON.parse(body ?? "")
    const [valid, address] = bot.parse(update)
    if (valid && address != null) {
        bot.send(update, MessageType.WORKING)
        const faucet = new Faucet()
        const result = await faucet.send(address)
        if (result) {
            bot.send(update, MessageType.COMPLETE)
        } else {
            bot.send(update, MessageType.FAILED)
        }
    } else if (valid) {
        bot.send(update, MessageType.FAILED)
    }
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Ok',
        })
    }
}
