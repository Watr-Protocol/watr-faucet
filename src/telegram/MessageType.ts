export enum MessageType {
    WORKING,
    COMPLETE,
    FAILED
} 

export function telegramMessage(type: MessageType, address: string, ethAddress: string | undefined = undefined): string {
    switch (type) {
        case MessageType.WORKING: return "Working"
        case MessageType.COMPLETE: return ethAddress ? `Transaction sent to ${address} (${ethAddress})` : `Transaction sent to ${address}`
        case MessageType.FAILED: return "Unable to send tokens, please try again"
    }
}