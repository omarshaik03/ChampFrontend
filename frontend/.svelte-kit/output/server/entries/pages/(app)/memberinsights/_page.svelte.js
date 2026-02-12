import { a4 as fallback, a3 as FILENAME } from "../../../../chunks/utils2.js";
import "clsx";
import { a as store_get, u as unsubscribe_stores, c as bind_props, p as prevent_snippet_stringification, d as attr_class, m as clsx } from "../../../../chunks/index2.js";
import { p as push_element, a as pop_element } from "../../../../chunks/dev.js";
import { g as Input, B as Button, I as Icon, S as Spinner } from "../../../../chunks/Tooltip.js";
import { C as Chatbox, S as Settingstab, a as Structuredoutput } from "../../../../chunks/userFeedback.svelte_svelte_type_style_lang.js";
import { T as Toastwrapper } from "../../../../chunks/toastwrapper.js";
import { T as Timer } from "../../../../chunks/timer.js";
import "../../../../chunks/query.js";
import "../../../../chunks/toastStore.js";
import { T as ToastNotifications } from "../../../../chunks/ToastNotifications.js";
import { u as userStore } from "../../../../chunks/userStore.js";
Memberinsights[FILENAME] = "src/components/apps/memberInsights/memberinsights.svelte";
function Memberinsights($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      let user = store_get($$store_subs ??= {}, "$userStore", userStore);
      if (user) {
        user.token;
      }
      let llmSel = fallback($$props["llmSel"], "Claude V3 Opus");
      let index = fallback($$props["index"], "image_test");
      let debug = fallback($$props["debug"], false);
      let query = "";
      let chatContents = [];
      let activeStructuredOutput = false;
      let listOfColumns = [];
      listOfColumns = [
        {
          column_name: "Health Plan",
          column_description: "The health plan"
        },
        {
          column_name: "Differentiators",
          column_description: "The strategic differentiators"
        },
        {
          column_name: "Compare/Contrast",
          column_description: "Compare/Contrast to the Molina plan"
        },
        {
          column_name: "Score",
          column_description: "The score awarded to the plan"
        }
      ];
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        ToastNotifications($$renderer3, { position: "top-right", maxToasts: 5 });
        $$renderer3.push(`<!----> <div id="main" class="main svelte-14uhbdg">`);
        push_element($$renderer3, "div", 119, 0);
        $$renderer3.push(`<div class="chat-container">`);
        push_element($$renderer3, "div", 120, 4);
        if (chatContents.length > 0) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="message-group">`);
          push_element($$renderer3, "div", 123, 8);
          Chatbox($$renderer3, { chatContents: [chatContents[0]], debug });
          $$renderer3.push(`<!----> `);
          {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]--></div>`);
          pop_element();
          $$renderer3.push(` `);
          if (chatContents.length > 1) {
            $$renderer3.push("<!--[-->");
            Chatbox($$renderer3, { chatContents: chatContents.slice(1), debug });
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]-->`);
        } else {
          $$renderer3.push("<!--[!-->");
          Chatbox($$renderer3, { chatContents, debug });
        }
        $$renderer3.push(`<!--]--></div>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` `);
        if (user) {
          $$renderer3.push("<!--[-->");
          Settingstab($$renderer3, {
            user,
            app: "documentinsights",
            get index() {
              return index;
            },
            set index($$value) {
              index = $$value;
              $$settled = false;
            },
            children: prevent_snippet_stringification(($$renderer4) => {
              Structuredoutput($$renderer4, {
                get listOfColumns() {
                  return listOfColumns;
                },
                set listOfColumns($$value) {
                  listOfColumns = $$value;
                  $$settled = false;
                },
                get activeStructuredOutput() {
                  return activeStructuredOutput;
                },
                set activeStructuredOutput($$value) {
                  activeStructuredOutput = $$value;
                  $$settled = false;
                }
              });
            }),
            $$slots: { default: true }
          });
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> <div class="bottom-div svelte-14uhbdg">`);
        push_element($$renderer3, "div", 161, 0);
        $$renderer3.push(`<div class="input-wrapper svelte-14uhbdg" style="align-items: center">`);
        push_element($$renderer3, "div", 164, 4);
        Input($$renderer3, {
          disabled: false,
          invalid: false,
          placeholder: "Ask a Question . . . ",
          plaintext: false,
          reverse: false,
          type: "text",
          valid: false,
          class: "chat-input",
          style: "width: 100%; border: solid;",
          get value() {
            return query;
          },
          set value($$value) {
            query = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----> `);
        Button($$renderer3, {
          children: prevent_snippet_stringification(($$renderer4) => {
            $$renderer4.push(`<!---->Clear`);
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> `);
        Button($$renderer3, {
          color: "secondary",
          children: prevent_snippet_stringification(($$renderer4) => {
            Icon($$renderer4, { name: "chat-fill" });
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(` `);
        {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></div>`);
        pop_element();
        $$renderer3.push(` <div${attr_class(clsx("d-none"))}>`);
        push_element($$renderer3, "div", 189, 0);
        Toastwrapper($$renderer3, {
          open: true,
          width: "200px",
          $$slots: {
            body: ($$renderer4) => {
              $$renderer4.push(`<div class="d-flex justify-content-between align-items-center" slot="body">`);
              push_element($$renderer4, "div", 191, 8);
              Spinner($$renderer4, { color: "primary" });
              $$renderer4.push(`<!----> <h4 class="m-0">`);
              push_element($$renderer4, "h4", 193, 12);
              Timer($$renderer4, {});
              $$renderer4.push(`<!---->s</h4>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
            }
          }
        });
        $$renderer3.push(`<!----></div>`);
        pop_element();
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      if ($$store_subs) unsubscribe_stores($$store_subs);
      bind_props($$props, { llmSel, index, debug });
    },
    Memberinsights
  );
}
Memberinsights.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(app)/memberinsights/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      Memberinsights($$renderer2, {});
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
