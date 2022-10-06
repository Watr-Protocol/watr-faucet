import WatrClient from "./WatrClient"

export default class Faucet {
    private AMOUNT: string = process.env.REWARD_AMOUNT ?? "100000000000000000000"

    async send(address: String): Promise<boolean> {
        const client = new WatrClient()
        await client.awaitReady()
        console.debug(`sending to ${address}`)
        try {
            await client.send(address, this.AMOUNT)
        } catch (e: unknown) {
            console.error(e)
            return Promise.resolve(false)
        }
        return Promise.resolve(true)
    }
}