import { d as attr_class, g as attr_style, e as ensure_array_like, a as store_get, p as prevent_snippet_stringification, f as stringify, u as unsubscribe_stores, c as bind_props } from "./index2.js";
import { a4 as fallback, a3 as FILENAME } from "./utils2.js";
import { p as push_element, a as pop_element } from "./dev.js";
import { E as Toast, G as ToastHeader, H as ToastBody } from "./Tooltip.js";
import { t as toasts } from "./toastStore.js";
import { e as escape_html } from "./context.js";
ToastNotifications[FILENAME] = "src/components/common/ToastNotifications.svelte";
function ToastNotifications($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      let positionClass;
      let position = fallback($$props["position"], "top-right");
      let maxToasts = fallback($$props["maxToasts"], 5);
      function handleClose(id) {
        toasts.remove(id);
      }
      positionClass = {
        "top-right": "end-0",
        "top-left": "start-0",
        "bottom-right": "bottom-0 end-0",
        "bottom-left": "bottom-0 start-0"
      }[position];
      $$renderer2.push(`<div${attr_class(`toast-container p-3 ${stringify(positionClass)} position-fixed`, "svelte-3j07jz")}${attr_style(position.startsWith("top") ? "top: 80px" : "")}>`);
      push_element($$renderer2, "div", 17, 0);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$toasts", toasts).slice(0, maxToasts));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let toast = each_array[$$index];
        Toast($$renderer2, {
          class: `mb-2 ${stringify(toast.color === "danger" ? "toast-prominent" : "")}`,
          color: toast.color,
          autohide: true,
          delay: toast.timeout,
          isOpen: true,
          fade: true,
          children: prevent_snippet_stringification(($$renderer3) => {
            if (toast.header) {
              $$renderer3.push("<!--[-->");
              ToastHeader($$renderer3, {
                toggle: () => handleClose(toast.id),
                children: prevent_snippet_stringification(($$renderer4) => {
                  $$renderer4.push(`<!---->${escape_html(toast.header)}`);
                }),
                $$slots: { default: true }
              });
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--> `);
            ToastBody($$renderer3, {
              children: prevent_snippet_stringification(($$renderer4) => {
                $$renderer4.push(`<!---->${escape_html(toast.message)}`);
              }),
              $$slots: { default: true }
            });
            $$renderer3.push(`<!---->`);
          }),
          $$slots: { default: true }
        });
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      if ($$store_subs) unsubscribe_stores($$store_subs);
      bind_props($$props, { position, maxToasts });
    },
    ToastNotifications
  );
}
ToastNotifications.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  ToastNotifications as T
};
