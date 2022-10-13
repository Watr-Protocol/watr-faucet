# Watr Faucet
## Outline
A telegram bot running as an AWS lambda that can publish transactions to the Watr Testnet
## Configuration
### AWS
In order to sign transactions on the Watr network, this bot requires a mnemonic seed that is stored in AWS Secrets Manager with a key name `value` and the mnemonic phrase as the value. The path to the secret should be specified by the environment variable `KEY_PATH`
### Telegram
The bot requires a valid telegram token to work. The steps to retrieve a new token can be found [here](https://core.telegram.org/bots/features#botfather).
The telegram token should be passed to the lambda through the `TELEGRAM_TOKEN` env variable
### Debugging
You can toggle whether the bot will send messages by setting the env variable `LIVE_MODE` to `TRUE|FALSE`. With live mode disabled, the messages the bot would have sent are logged to the console and available through AWS cloud monitoring.

## Interaction
In a channel with the `Watr-faucet-bot` present, simply send a message with the following format.
```
/hydrate {Watr Address} 
```
### Example
```
/hydrate 2x8k6ja5LWH46738ZoiX7qP7UdnizaujcoA3XyG77HtJquPX
```
results in 100 WATRD(dev net WATR tokens) being sent to the address `2x8k6ja5LWH46738ZoiX7qP7UdnizaujcoA3XyG77HtJquPX`

### Responses
The bot will respond as follows
#### Acknowledgment of Request
```
Working
```
#### Success
```
Transaction sent
```
#### Failure
```
Unable to send tokens, please try again
```
See [MessageType.ts](./src/telegram/MessageType.ts) for definition.