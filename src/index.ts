import Faucet from "./watr/Faucet"
import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';

export const lambdaHandler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    const request: iFaucetRequest = JSON.parse(JSON.stringify(event, null, 2))
    const faucet = new Faucet()
    const result = await faucet.send(request.address)
    if (result) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Ok',
            }),
        }
    } else {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Unable to send funds',
            }),
        }
    }
}

interface iFaucetRequest {
    address: string
}
