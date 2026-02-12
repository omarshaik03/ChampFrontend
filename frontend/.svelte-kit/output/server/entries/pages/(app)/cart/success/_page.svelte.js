import { a3 as FILENAME } from "../../../../../chunks/utils2.js";
import { e as escape_html } from "../../../../../chunks/context.js";
import "clsx";
import { p as prevent_snippet_stringification } from "../../../../../chunks/index2.js";
import { p as push_element, a as pop_element } from "../../../../../chunks/dev.js";
import { B as Button } from "../../../../../chunks/Tooltip.js";
_page[FILENAME] = "src/routes/(app)/cart/success/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let orderId = "";
      $$renderer2.push(`<div class="container my-5 svelte-q4932">`);
      push_element($$renderer2, "div", 9, 0);
      $$renderer2.push(`<div class="row justify-content-center svelte-q4932">`);
      push_element($$renderer2, "div", 10, 4);
      $$renderer2.push(`<div class="col-lg-8 svelte-q4932">`);
      push_element($$renderer2, "div", 11, 8);
      $$renderer2.push(`<div class="card shadow-sm text-center p-4 svelte-q4932">`);
      push_element($$renderer2, "div", 12, 12);
      $$renderer2.push(`<div class="success-icon mb-4 svelte-q4932">`);
      push_element($$renderer2, "div", 13, 16);
      $$renderer2.push(`<i class="bi bi-check-circle text-success svelte-q4932" style="font-size: 5rem;">`);
      push_element($$renderer2, "i", 14, 20);
      $$renderer2.push(`</i>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <h1 class="display-6 mb-3 svelte-q4932">`);
      push_element($$renderer2, "h1", 17, 16);
      $$renderer2.push(`Thank You for Your Purchase!</h1>`);
      pop_element();
      $$renderer2.push(` <p class="lead svelte-q4932">`);
      push_element($$renderer2, "p", 19, 16);
      $$renderer2.push(`Your order has been successfully processed.</p>`);
      pop_element();
      $$renderer2.push(` <div class="order-details my-4 p-3 bg-light rounded svelte-q4932">`);
      push_element($$renderer2, "div", 21, 16);
      $$renderer2.push(`<p class="mb-1 svelte-q4932">`);
      push_element($$renderer2, "p", 22, 20);
      $$renderer2.push(`Order ID: <strong class="svelte-q4932">`);
      push_element($$renderer2, "strong", 22, 46);
      $$renderer2.push(`${escape_html(orderId)}</strong>`);
      pop_element();
      $$renderer2.push(`</p>`);
      pop_element();
      $$renderer2.push(` <p class="mb-0 svelte-q4932">`);
      push_element($$renderer2, "p", 23, 20);
      $$renderer2.push(`A confirmation email has been sent to your email address.</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <p class="svelte-q4932">`);
      push_element($$renderer2, "p", 26, 16);
      $$renderer2.push(`Your purchased apps are now available in your account. You can access them at any time from your dashboard.</p>`);
      pop_element();
      $$renderer2.push(` <div class="d-flex justify-content-center gap-3 mt-4 svelte-q4932">`);
      push_element($$renderer2, "div", 30, 16);
      Button($$renderer2, {
        color: "primary",
        href: "/",
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<!---->Continue Shopping`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Button($$renderer2, {
        color: "secondary",
        outline: true,
        href: "/profile",
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<!---->View My Account`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" class="svelte-q4932"/>`);
      push_element($$renderer2, "link", 71, 0);
      pop_element();
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  _page as default
};
