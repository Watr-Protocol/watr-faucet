import { Signer, SignerPayloadRaw, SignerResult } from "@polkadot/types/types"
import { Keyring } from "@polkadot/api"
import { AWSError} from "aws-sdk"
import { hexToU8a, u8aToHex } from "@polkadot/util"
import SecretsManager, { GetSecretValueResponse } from "aws-sdk/clients/secretsmanager";
import { blake2AsHex, cryptoWaitReady } from "@polkadot/util-crypto"

export default class TransactionSigner implements Signer {
    private localKeystore?: Keyring
    public localAddress: string = ""

    constructor() {
        const client = new SecretsManager({region: "eu-west-2"})
        const keyPath = process.env.KEY_PATH ?? "test/address"
        cryptoWaitReady().then(_ => {
        this.localKeystore = new Keyring({ type: 'sr25519' });
        // we set the kestore to Watr Format
        this.localKeystore.setSS58Format(19);
        client.getSecretValue({SecretId: keyPath}, (err?: AWSError, data?: GetSecretValueResponse) => {
                if (err) {
                    console.error(`Unable to load secret from AWS: ${err}`)
                    throw(err)
                } else {
                    console.log(`Loaded secret data from ${data?.Name}`)
                    const json: ISecret = JSON.parse(data!.SecretString!)
                    console.log(`json: `)
                    this.localAddress = this.localKeystore!.addFromMnemonic(json!.value!).address;
                }
                console.debug(`Address: ${this.localAddress}`)
            })
        })
    }

    async signRaw({ data }: SignerPayloadRaw): Promise<SignerResult> {
        return new Promise((resolve): void => {
            const hashed = (data.length > (256 + 1) * 2)
            ? blake2AsHex(data)
            : data;

            const key = this.localKeystore!.getPair(this.localAddress!)
            const rawSignature = key.sign(hexToU8a(hashed), { withType: true })
            const signature = u8aToHex(rawSignature)
            resolve({id: 1, signature});
        })
    }
}

interface ISecret {
    value: string
}