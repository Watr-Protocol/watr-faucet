import { test, expect } from "@jest/globals";
import { isEthereumAddress, evmToAddress } from "@polkadot/util-crypto"
import { MessageType, telegramMessage } from "../src/telegram/MessageType" 

test("it tests the conversion from eth address to SS58",() => {
    const ethAddress = "0x98f457EDcd11dB513cBf631a759FD94E64066323"
    const SS58Address = "2y6aeeWktxitpWNttrjzmRjejYkVFgPFrCoUv8mDjaVG6rfD"
    expect(isEthereumAddress(ethAddress)).toBeTruthy()
    const derivedAddress = evmToAddress(ethAddress, 19)
    expect(derivedAddress).toEqual(SS58Address)
})

test("it lists eth address and watr address in success message", () => {
    const ethAddress = "0x98f457EDcd11dB513cBf631a759FD94E64066323"
    const SS58Address = "2y6aeeWktxitpWNttrjzmRjejYkVFgPFrCoUv8mDjaVG6rfD"
    const message = telegramMessage(MessageType.COMPLETE, SS58Address, ethAddress)
    expect(message).toEqual(`Transaction sent to ${SS58Address} (${ethAddress})`)
})