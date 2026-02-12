import { a4 as fallback, a3 as FILENAME } from "../../../../chunks/utils2.js";
import "clsx";
import { a as store_get, u as unsubscribe_stores, c as bind_props, p as prevent_snippet_stringification, d as attr_class, m as clsx } from "../../../../chunks/index2.js";
import { p as push_element, a as pop_element } from "../../../../chunks/dev.js";
import { B as Button, I as Icon, v as InputGroup, S as Spinner } from "../../../../chunks/Tooltip.js";
import { C as Chatbox, S as Settingstab, a as Structuredoutput, b as Searchbar } from "../../../../chunks/userFeedback.svelte_svelte_type_style_lang.js";
import { T as Toastwrapper } from "../../../../chunks/toastwrapper.js";
import { T as Timer } from "../../../../chunks/timer.js";
import "../../../../chunks/query.js";
import "../../../../chunks/toastStore.js";
import { T as ToastNotifications } from "../../../../chunks/ToastNotifications.js";
import { u as userStore } from "../../../../chunks/userStore.js";
import "../../../../chunks/runtime-config.js";
Webinsights[FILENAME] = "src/components/apps/webInisghts/webinsights.svelte";
function Webinsights($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      let user = store_get($$store_subs ??= {}, "$userStore", userStore);
      if (user) {
        user.token;
      }
      let index = fallback($$props["index"], "webinsights_new");
      let debug = fallback($$props["debug"], false);
      let query = "";
      let listsOfDefaultQuestions = {
        "https://www.cognizant.com/us/en/services/ai/rewire-for-ai": {
          "index": "webinsights_new",
          "questions": [
            "What is Cognizant Flowsource?",
            "What is Cognizant Neuro AI?"
          ]
        },
        "https://www.niddk.nih.gov/health-information/digestive-diseases": {
          "index": "webinsights_new",
          "questions": [
            "What are the symptoms of Appendicitis and how do you diagnose it?",
            "What is Crohns Disease? Are there any treatments available for it?"
          ]
        }
      };
      let chatContents = [];
      let activeStructuredOutput = false;
      let listOfColumns = [];
      listOfColumns = [
        { column_name: "Code", column_description: "The CPT code" },
        {
          column_name: "Notes",
          column_description: "The notes pertaining to the CPT code"
        },
        {
          column_name: "Explanation",
          column_description: "The explained notes for the CPT code"
        }
      ];
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        ToastNotifications($$renderer3, { position: "top-right", maxToasts: 5 });
        $$renderer3.push(`<!----> <div id="main" class="main svelte-ph6o7k">`);
        push_element($$renderer3, "div", 241, 0);
        $$renderer3.push(`<div class="chat-container">`);
        push_element($$renderer3, "div", 242, 4);
        if (chatContents.length > 0) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="message-group">`);
          push_element($$renderer3, "div", 245, 8);
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
            index,
            app: "webinsights",
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
        $$renderer3.push(`<!--]--> <div class="bottom-div svelte-ph6o7k">`);
        push_element($$renderer3, "div", 283, 0);
        $$renderer3.push(`<div class="w-100">`);
        push_element($$renderer3, "div", 284, 4);
        {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div style="text-align:right; margin-bottom: 7px;">`);
          push_element($$renderer3, "div", 286, 8);
          Button($$renderer3, {
            color: "primary",
            children: prevent_snippet_stringification(($$renderer4) => {
              Icon($$renderer4, { name: "upload" });
              $$renderer4.push(`<!----> Crawl Website`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----></div>`);
          pop_element();
        }
        $$renderer3.push(`<!--]--> `);
        InputGroup($$renderer3, {
          class: "mt-2",
          children: prevent_snippet_stringification(($$renderer4) => {
            {
              $$renderer4.push("<!--[!-->");
            }
            $$renderer4.push(`<!--]-->`);
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> <div style="margin-top: 6px;">`);
        push_element($$renderer3, "div", 353, 8);
        Searchbar($$renderer3, {
          listOfDefaultQuestions: listsOfDefaultQuestions,
          get query() {
            return query;
          },
          set query($$value) {
            query = $$value;
            $$settled = false;
          },
          get chatContents() {
            return chatContents;
          },
          set chatContents($$value) {
            chatContents = $$value;
            $$settled = false;
          },
          get index() {
            return index;
          },
          set index($$value) {
            index = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(` `);
        {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></div>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` <div${attr_class(clsx("d-none"))}>`);
        push_element($$renderer3, "div", 362, 0);
        Toastwrapper($$renderer3, {
          open: true,
          width: "200px",
          $$slots: {
            body: ($$renderer4) => {
              $$renderer4.push(`<div class="d-flex justify-content-between align-items-center" slot="body">`);
              push_element($$renderer4, "div", 364, 8);
              Spinner($$renderer4, { color: "primary" });
              $$renderer4.push(`<!----> <h4 class="m-0">`);
              push_element($$renderer4, "h4", 366, 12);
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
      bind_props($$props, { index, debug });
    },
    Webinsights
  );
}
Webinsights.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(app)/webinsights/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      Webinsights($$renderer2, {});
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
