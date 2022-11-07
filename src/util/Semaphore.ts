export default abstract class Semaphore {
    private max: number = 1
    private queue: QueuedLockRequest[] = []
    private running: number = 0

    protected async accquire(): Promise<Lock> {
        if (this.running == 0) {
            this.running++
            return Promise.resolve({ release: this.release })
        } else {
            return new Promise<Lock>((resolve, reject) => {
                this.queue.push({ resolve, reject })
            })
        }
    }

    private release() {
        this.running--
        this.take()
    }

    private take() {
        if (this.queue.length > 0) {
            this.running++
            const lock = this.queue.shift()!!
            lock.resolve({release: this.release})
        }
    }
}

type Lock = {
    release: () => void
}

type QueuedLockRequest = {
    resolve: (lock: Lock) => void
    reject: (err: Error) => void
}