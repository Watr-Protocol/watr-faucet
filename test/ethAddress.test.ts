import { test, expect } from "@jest/globals";
import { isEthereumAddress, evmToAddress } from "@polkadot/util-crypto"

test("it tests the conversion from eth address to SS58",() => {
    const ethAddress = "0x98f457EDcd11dB513cBf631a759FD94E64066323"
    const SS58Address = "2y6aeeWktxitpWNttrjzmRjejYkVFgPFrCoUv8mDjaVG6rfD"
    expect(isEthereumAddress(ethAddress)).toBeTruthy()
    const derivedAddress = evmToAddress(ethAddress, 19)
    expect(derivedAddress).toEqual(SS58Address)
})