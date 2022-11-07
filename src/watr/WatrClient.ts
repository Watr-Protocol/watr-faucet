import { WsProvider, ApiPromise } from "@polkadot/api"
import Semaphore from "../util/Semaphore"
import TransactionSigner from "./TransactionSigner"

const WATR_ENDPOINT = "wss://rpc.dev.watr.org/"

export default class WatrClient extends Semaphore {
    private api?: ApiPromise
    private signer: TransactionSigner = new TransactionSigner()
    private connected: Boolean = false
    async awaitReady(): Promise<void> {
        const lock = await this.accquire()
        if (this.connected) return lock.release()
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
            lock.release()
            return this.awaitReady()
        }
        this.connected = true
        return Promise.resolve(lock.release())
    }

    async send(address: String, amount: String): Promise<boolean> {
        if (!this.connected) {
            await this.awaitReady()
        }
        if (this.api != undefined) {
            const signer = this.signer
            console.debug("transferring")
            const transfer = await this.api.tx.balances.transfer(address, BigInt(amount.toString()))
            console.log(transfer.toHuman())
            const signed = await transfer.signAsync(signer.localAddress, { signer })
            await signed.send()
            return Promise.resolve(true)
        } else return Promise.resolve(false)
    }
}