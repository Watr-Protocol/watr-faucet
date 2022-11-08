import { test } from "@jest/globals"
import WatrClient from "../src/watr/WatrClient"

test("It initialises correctly and connects to the network", async () => {
    const client = new WatrClient()
    await client.awaitReady()
})