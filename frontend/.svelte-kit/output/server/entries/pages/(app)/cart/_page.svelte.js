import { a as store_get, p as prevent_snippet_stringification, u as unsubscribe_stores, e as ensure_array_like, b as attr } from "../../../../chunks/index2.js";
import { p as push_element, a as pop_element } from "../../../../chunks/dev.js";
import { d as derived } from "../../../../chunks/index.js";
import { r as Table, B as Button } from "../../../../chunks/Tooltip.js";
import { a as cart, b as cartTotal } from "../../../../chunks/cartStore.js";
import "../../../../chunks/toastStore.js";
import "../../../../chunks/client.js";
import { e as escape_html } from "../../../../chunks/context.js";
import { a3 as FILENAME } from "../../../../chunks/utils2.js";
_page[FILENAME] = "src/routes/(app)/cart/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      const hasContactForPricingItems = derived(cart, ($cart) => $cart.some((item) => item.price === null));
      $$renderer2.push(`<div class="container my-5">`);
      push_element($$renderer2, "div", 46, 0);
      $$renderer2.push(`<h1 class="mb-4">`);
      push_element($$renderer2, "h1", 47, 4);
      $$renderer2.push(`Your Cart</h1>`);
      pop_element();
      $$renderer2.push(` `);
      if (store_get($$store_subs ??= {}, "$cart", cart) && store_get($$store_subs ??= {}, "$cart", cart).length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="card shadow-sm mb-4 svelte-1uhulg2">`);
        push_element($$renderer2, "div", 50, 8);
        $$renderer2.push(`<div class="card-body">`);
        push_element($$renderer2, "div", 51, 12);
        Table($$renderer2, {
          responsive: true,
          hover: true,
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<thead>`);
            push_element($$renderer3, "thead", 53, 20);
            $$renderer3.push(`<tr>`);
            push_element($$renderer3, "tr", 54, 24);
            $$renderer3.push(`<th>`);
            push_element($$renderer3, "th", 55, 28);
            $$renderer3.push(`Product</th>`);
            pop_element();
            $$renderer3.push(`<th>`);
            push_element($$renderer3, "th", 56, 28);
            $$renderer3.push(`Description</th>`);
            pop_element();
            $$renderer3.push(`<th>`);
            push_element($$renderer3, "th", 57, 28);
            $$renderer3.push(`Price</th>`);
            pop_element();
            $$renderer3.push(`<th>`);
            push_element($$renderer3, "th", 58, 28);
            $$renderer3.push(`Actions</th>`);
            pop_element();
            $$renderer3.push(`</tr>`);
            pop_element();
            $$renderer3.push(`</thead>`);
            pop_element();
            $$renderer3.push(` <tbody>`);
            push_element($$renderer3, "tbody", 61, 20);
            $$renderer3.push(`<!--[-->`);
            const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$cart", cart));
            for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
              let item = each_array[$$index];
              $$renderer3.push(`<tr>`);
              push_element($$renderer3, "tr", 63, 28);
              $$renderer3.push(`<td>`);
              push_element($$renderer3, "td", 64, 32);
              $$renderer3.push(`<div class="d-flex align-items-center">`);
              push_element($$renderer3, "div", 65, 36);
              $$renderer3.push(`<div class="flex-shrink-0 me-3">`);
              push_element($$renderer3, "div", 66, 40);
              $$renderer3.push(`<img${attr("src", item.image)}${attr("alt", item.name)} class="rounded" width="60" height="60" style="object-fit: cover;"/>`);
              push_element($$renderer3, "img", 67, 44);
              pop_element();
              $$renderer3.push(`</div>`);
              pop_element();
              $$renderer3.push(` <div>`);
              push_element($$renderer3, "div", 69, 40);
              $$renderer3.push(`<h6 class="mb-0">`);
              push_element($$renderer3, "h6", 70, 44);
              $$renderer3.push(`${escape_html(item.name)}</h6>`);
              pop_element();
              $$renderer3.push(`</div>`);
              pop_element();
              $$renderer3.push(`</div>`);
              pop_element();
              $$renderer3.push(`</td>`);
              pop_element();
              $$renderer3.push(`<td>`);
              push_element($$renderer3, "td", 73, 32);
              $$renderer3.push(`${escape_html(item.description || "No description available")}</td>`);
              pop_element();
              $$renderer3.push(`<td>`);
              push_element($$renderer3, "td", 74, 32);
              if (item.price !== null) {
                $$renderer3.push("<!--[-->");
                $$renderer3.push(`$${escape_html(item.price.toFixed(2))}`);
              } else {
                $$renderer3.push("<!--[!-->");
                $$renderer3.push(`<span class="text-info">`);
                push_element($$renderer3, "span", 78, 40);
                $$renderer3.push(`Contact for Pricing</span>`);
                pop_element();
              }
              $$renderer3.push(`<!--]--></td>`);
              pop_element();
              $$renderer3.push(`<td>`);
              push_element($$renderer3, "td", 81, 32);
              Button($$renderer3, {
                color: "danger",
                size: "sm",
                children: prevent_snippet_stringification(($$renderer4) => {
                  $$renderer4.push(`<!---->Remove`);
                }),
                $$slots: { default: true }
              });
              $$renderer3.push(`<!----></td>`);
              pop_element();
              $$renderer3.push(`</tr>`);
              pop_element();
            }
            $$renderer3.push(`<!--]--></tbody>`);
            pop_element();
          }),
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----></div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="card shadow-sm mb-4 svelte-1uhulg2">`);
        push_element($$renderer2, "div", 91, 22);
        $$renderer2.push(`<div class="card-body">`);
        push_element($$renderer2, "div", 92, 12);
        $$renderer2.push(`<div class="d-flex justify-content-between align-items-center">`);
        push_element($$renderer2, "div", 93, 16);
        $$renderer2.push(`<h5 class="mb-0">`);
        push_element($$renderer2, "h5", 94, 20);
        $$renderer2.push(`Total: <span class="text-primary">`);
        push_element($$renderer2, "span", 94, 44);
        $$renderer2.push(`$${escape_html(store_get($$store_subs ??= {}, "$cartTotal", cartTotal).toFixed(2))}</span>`);
        pop_element();
        $$renderer2.push(` `);
        if (store_get($$store_subs ??= {}, "$hasContactForPricingItems", hasContactForPricingItems)) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span class="ms-2 text-info small">`);
          push_element($$renderer2, "span", 96, 24);
          $$renderer2.push(`(Additional pricing required)</span>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></h5>`);
        pop_element();
        $$renderer2.push(` <div>`);
        push_element($$renderer2, "div", 99, 20);
        Button($$renderer2, {
          color: "secondary",
          class: "me-2",
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<!---->Clear Cart`);
          }),
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----> `);
        if (store_get($$store_subs ??= {}, "$hasContactForPricingItems", hasContactForPricingItems)) {
          $$renderer2.push("<!--[-->");
          Button($$renderer2, {
            color: "info",
            children: prevent_snippet_stringification(($$renderer3) => {
              $$renderer3.push(`<!---->Contact Sales`);
            }),
            $$slots: { default: true }
          });
        } else {
          $$renderer2.push("<!--[!-->");
          Button($$renderer2, {
            color: "primary",
            children: prevent_snippet_stringification(($$renderer3) => {
              $$renderer3.push(`<!---->Proceed to Checkout`);
            }),
            $$slots: { default: true }
          });
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="text-center py-5">`);
        push_element($$renderer2, "div", 111, 8);
        $$renderer2.push(`<div class="mb-4">`);
        push_element($$renderer2, "div", 112, 12);
        $$renderer2.push(`<i class="bi bi-cart text-muted" style="font-size: 4rem;">`);
        push_element($$renderer2, "i", 113, 16);
        $$renderer2.push(`</i>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <h3>`);
        push_element($$renderer2, "h3", 115, 12);
        $$renderer2.push(`Your cart is empty</h3>`);
        pop_element();
        $$renderer2.push(` <p class="text-muted mb-4">`);
        push_element($$renderer2, "p", 116, 12);
        $$renderer2.push(`Looks like you haven't added any apps to your cart yet.</p>`);
        pop_element();
        $$renderer2.push(` `);
        Button($$renderer2, {
          color: "primary",
          href: "/",
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<!---->Browse Apps`);
          }),
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----></div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"/>`);
      push_element($$renderer2, "link", 131, 0);
      pop_element();
      if ($$store_subs) unsubscribe_stores($$store_subs);
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
