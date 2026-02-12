import { t as sanitize_slots, g as attr_style, f as stringify, p as prevent_snippet_stringification, s as slot, c as bind_props } from "./index2.js";
import { a4 as fallback, a3 as FILENAME } from "./utils2.js";
import { p as push_element, a as pop_element } from "./dev.js";
import { E as Toast, G as ToastHeader, H as ToastBody } from "./Tooltip.js";
Toastwrapper[FILENAME] = "src/components/common/toastwrapper.svelte";
function Toastwrapper($$renderer, $$props) {
  const $$slots = sanitize_slots($$props);
  $$renderer.component(
    ($$renderer2) => {
      let open = fallback($$props["open"], false);
      let width = fallback($$props["width"], "max-content");
      $$renderer2.push(`<div class="my-toast svelte-1t48no0"${attr_style(`width: ${stringify(width)}`)}>`);
      push_element($$renderer2, "div", 6, 0);
      Toast($$renderer2, {
        isOpen: open,
        color: "primary",
        children: prevent_snippet_stringification(($$renderer3) => {
          if ($$slots.header) {
            $$renderer3.push("<!--[-->");
            ToastHeader($$renderer3, {
              children: prevent_snippet_stringification(($$renderer4) => {
                $$renderer4.push(`<!--[-->`);
                slot($$renderer4, $$props, "header", {}, null);
                $$renderer4.push(`<!--]-->`);
              }),
              $$slots: { default: true }
            });
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]--> `);
          if ($$slots.body) {
            $$renderer3.push("<!--[-->");
            ToastBody($$renderer3, {
              children: prevent_snippet_stringification(($$renderer4) => {
                $$renderer4.push(`<!--[-->`);
                slot($$renderer4, $$props, "body", {}, null);
                $$renderer4.push(`<!--]-->`);
              }),
              $$slots: { default: true }
            });
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]-->`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      bind_props($$props, { open, width });
    },
    Toastwrapper
  );
}
Toastwrapper.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  Toastwrapper as T
};
