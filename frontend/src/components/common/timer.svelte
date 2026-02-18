<script lang="ts">
    let timer: number = 0;
    let timerInterval: any;
    let startTime: number | undefined;

    export async function timeAFunction(fn: Function): Promise<{response: any, time: number}> {
        startTimer();
        try {
            const response = await fn();
            const time = stopTimer();
            return {response, time};
        } catch (error) {
            stopTimer();
            throw error;
        }
    }

    export function start(): void {
        timer = 0;
        startTime = Date.now();
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (startTime) {
                timer = Math.round((Date.now() - startTime) / 1000);
            }
        }, 1000);
    }

    export function stop(): number {
        clearInterval(timerInterval);
        let tempTimer = timer;
        return tempTimer;
    }

    function startTimer(): void {
        start();
    }

    function stopTimer(): number {
        return stop();
    }
</script>

{timer}

