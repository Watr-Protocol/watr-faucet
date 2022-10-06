import { WsProvider, ApiPromise } from "@polkadot/api"
import TransactionSigner from "./TransactionSigner"

const WATR_ENDPOINT = "wss://rpc.dev.watr.org/"

export default class WatrClient {
    private api?: ApiPromise
    private signer: TransactionSigner = new TransactionSigner()
    async awaitReady(): Promise<void> {
        console.info(`Connecting to ${WATR_ENDPOINT}`)
        const provider: WsProvider = new WsProvider(WATR_ENDPOINT)
        try {
            this.api = await ApiPromise.create({ provider });
            const [chain, nodeName, nodeVersion] = await Promise.all([
                this.api.rpc.system.chain(),
                this.api.rpc.system.name(),
                this.api.rpc.system.version()
              ]);
              console.info(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);

          } catch (e) {
            return this.awaitReady()
        }
        return Promise.resolve()
    }

    async send(address: String, amount: String): Promise<boolean> {
        if (this.api != undefined) {
            const signer = this.signer
            console.debug("transferring")
            const transfer = await this.api.tx.balances.transfer(address, BigInt(amount.toString()))
            console.log(transfer.toHuman())
            const signed = await transfer.signAsync(signer.localAddress, { signer })
            await signed.send()
            return true
        } else return false
    }
}