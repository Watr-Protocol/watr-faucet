import WatrClient from "./WatrClient"

export default class Faucet {
    private client: WatrClient
    private AMOUNT: string = process.env.REWARD_AMOUNT ?? "100000000000000000000"

    constructor() {
        this.client = new WatrClient()
    }

    async send(address: String): Promise<boolean> {
        console.debug(`sending to ${address}`)
        try {
            await this.client.send(address, this.AMOUNT)
        } catch (e: unknown) {
            console.error(e)
            return Promise.resolve(false)
        }
        return Promise.resolve(true)
    }
}