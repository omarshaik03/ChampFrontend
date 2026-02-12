import { c as bind_props } from "./index2.js";
import { e as escape_html } from "./context.js";
import { a3 as FILENAME } from "./utils2.js";
Timer[FILENAME] = "src/components/common/timer.svelte";
function Timer($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let timer = 0;
      let timerInterval;
      let startTime;
      async function timeAFunction(fn) {
        startTimer();
        try {
          const response = await fn();
          const time = stopTimer();
          return { response, time };
        } catch (error) {
          stopTimer();
          throw error;
        }
      }
      function startTimer() {
        startTime = Date.now();
        timerInterval = setInterval(
          () => {
            if (startTime) {
              timer = (Date.now() - startTime) / 1e3;
            }
          },
          100
        );
      }
      function stopTimer() {
        clearInterval(timerInterval);
        let tempTimer = timer;
        timer = 0;
        return tempTimer;
      }
      $$renderer2.push(`<!---->${escape_html(timer)}`);
      bind_props($$props, { timeAFunction });
    },
    Timer
  );
}
Timer.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  Timer as T
};
