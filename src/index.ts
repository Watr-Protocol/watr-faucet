import Faucet from "./watr/Faucet"
import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda'
import { Update } from "node-telegram-bot-api"
import WatrBot from "./telegram/WatrBot"
import { MessageType, telegramMessage } from "./telegram/MessageType"
import { evmToAddress, isEthereumAddress } from "@polkadot/util-crypto"

export const lambdaHandler = async (event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> => {
    const liveMode = process.env.LIVE_MODE?.toUpperCase() == "TRUE"
    const bot = new WatrBot(process.env.TELEGRAM_TOKEN ?? "", liveMode)
    const body = event.body
    const update: Update = JSON.parse(body ?? "")
    let [valid, address] = bot.parse(update)
    if (valid && address != null) {
        const faucet = new Faucet()
        bot.send(update, telegramMessage(MessageType.WORKING, ""))
        let finalAddress: string
        if (isEthereumAddress(address)) {
            finalAddress = evmToAddress(address, 19)
        } else {
            finalAddress = address
        }
        const result = await faucet.send(finalAddress)
        if (result) {
            bot.send(update, telegramMessage(MessageType.COMPLETE, finalAddress, isEthereumAddress(address) ? address : undefined))
        } else {
            bot.send(update, telegramMessage(MessageType.FAILED, finalAddress))
        }
    } else if (valid) {
        bot.send(update,telegramMessage(MessageType.FAILED, ""))
    }
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Ok',
        })
    }
}
