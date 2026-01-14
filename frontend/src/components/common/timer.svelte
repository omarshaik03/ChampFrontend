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

    function startTimer(): void {
        startTime = Date.now();
        timerInterval = setInterval(() => {
            if (startTime) {
                timer = (Date.now() - startTime) / 1000;
            }
        }, 100);
    }

    function stopTimer(): number {
        clearInterval(timerInterval);
        let tempTimer = timer;
        timer = 0;
        return tempTimer
    }
</script>

{timer}

