export enum MessageType {
    WORKING,
    COMPLETE,
    FAILED
} 

export function telegramMessage(type: MessageType): string {
    switch (type) {
        case MessageType.WORKING: return "Working"
        case MessageType.COMPLETE: return "Transaction sent"
        case MessageType.FAILED: return "Unable to send tokens, please try again"
    }
}