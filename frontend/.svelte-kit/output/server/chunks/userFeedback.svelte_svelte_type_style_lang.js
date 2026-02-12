import { e as ensure_array_like, p as prevent_snippet_stringification, b as attr, c as bind_props, d as attr_class, s as slot, f as stringify } from "./index2.js";
import { a4 as fallback, a3 as FILENAME } from "./utils2.js";
import { p as push_element, a as pop_element } from "./dev.js";
import { v as InputGroup, I as Icon, T as Tooltip, B as Button, g as Input, D as Dropdown, d as DropdownToggle, e as DropdownMenu, f as DropdownItem } from "./Tooltip.js";
import { e as escape_html } from "./context.js";
import { h as html } from "./html.js";
Structuredoutput[FILENAME] = "src/components/old/structuredoutput.svelte";
function Structuredoutput($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let listOfColumns = fallback($$props["listOfColumns"], () => [], true);
      let activeStructuredOutput = fallback($$props["activeStructuredOutput"], false);
      if (activeStructuredOutput) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 22, 4);
        $$renderer2.push(`<h4>`);
        push_element($$renderer2, "h4", 23, 8);
        $$renderer2.push(`Structured Output <button class="btn btn-link">`);
        push_element($$renderer2, "button", 23, 30);
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 23, 93);
        $$renderer2.push(`-</div>`);
        pop_element();
        $$renderer2.push(`</button>`);
        pop_element();
        $$renderer2.push(`</h4>`);
        pop_element();
        $$renderer2.push(` <hr/>`);
        push_element($$renderer2, "hr", 24, 8);
        pop_element();
        $$renderer2.push(` <div>`);
        push_element($$renderer2, "div", 25, 8);
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like(listOfColumns);
        for (let index = 0, $$length = each_array.length; index < $$length; index++) {
          let column = each_array[index];
          $$renderer2.push(`<hr/>`);
          push_element($$renderer2, "hr", 27, 16);
          pop_element();
          $$renderer2.push(` `);
          InputGroup($$renderer2, {
            children: prevent_snippet_stringification(($$renderer3) => {
              $$renderer3.push(`<input type="text"${attr("value", column.column_name)} class="form-control" placeholder="Column Header"/>`);
              push_element($$renderer3, "input", 29, 20);
              pop_element();
              $$renderer3.push(` <input type="text"${attr("value", column.column_description)} class="form-control" placeholder="Column Description"/>`);
              push_element($$renderer3, "input", 30, 20);
              pop_element();
              $$renderer3.push(` <button class="btn btn-secondary">`);
              push_element($$renderer3, "button", 31, 20);
              $$renderer3.push(`X</button>`);
              pop_element();
            }),
            $$slots: { default: true }
          });
          $$renderer2.push(`<!---->`);
        }
        $$renderer2.push(`<!--]--> <hr/>`);
        push_element($$renderer2, "hr", 34, 12);
        pop_element();
        $$renderer2.push(` `);
        InputGroup($$renderer2, {
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<button class="btn btn-secondary">`);
            push_element($$renderer3, "button", 36, 16);
            $$renderer3.push(`+</button>`);
            pop_element();
          }),
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----></div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<h4>`);
        push_element($$renderer2, "h4", 41, 4);
        $$renderer2.push(`Structured Output <button class="btn btn-link">`);
        push_element($$renderer2, "button", 41, 26);
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 41, 89);
        $$renderer2.push(`+</div>`);
        pop_element();
        $$renderer2.push(`</button>`);
        pop_element();
        $$renderer2.push(`</h4>`);
        pop_element();
        $$renderer2.push(` <hr/>`);
        push_element($$renderer2, "hr", 42, 4);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, { listOfColumns, activeStructuredOutput });
    },
    Structuredoutput
  );
}
Structuredoutput.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Settingstab[FILENAME] = "src/components/common/settingstab.svelte";
function Settingstab($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let settingsTab = false;
      $$renderer2.push(`<div${attr_class("settings-tab svelte-1cgpj82", void 0, { "active": settingsTab })}>`);
      push_element($$renderer2, "div", 5, 0);
      $$renderer2.push(`<div class="setting-tab-button-parent svelte-1cgpj82">`);
      push_element($$renderer2, "div", 6, 4);
      $$renderer2.push(`<div class="settings-tab-button svelte-1cgpj82" style="margin-left: 2px;">`);
      push_element($$renderer2, "div", 7, 8);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 8, 12);
      $$renderer2.push(`<button class="btn btn-secondary tab-button svelte-1cgpj82">`);
      push_element($$renderer2, "button", 9, 16);
      Icon($$renderer2, { name: "gear-fill" });
      $$renderer2.push(`<!----></button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="settings-tab-content svelte-1cgpj82">`);
      push_element($$renderer2, "div", 13, 4);
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
    },
    Settingstab
  );
}
Settingstab.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Chatbox[FILENAME] = "src/components/common/chatbox.svelte";
function Chatbox($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let chatContents = fallback($$props["chatContents"], () => [], true);
      let debug = fallback($$props["debug"], false);
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(chatContents);
        for (let index = 0, $$length = each_array.length; index < $$length; index++) {
          let chat = each_array[index];
          if (chat.user) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<div class="d-flex flex-row justify-content-end">`);
            push_element($$renderer3, "div", 45, 8);
            $$renderer3.push(`<div class="user-message svelte-7vykin">`);
            push_element($$renderer3, "div", 46, 12);
            $$renderer3.push(`${escape_html(chat.user)} <button${attr("id", `clear_cache_${stringify(index)}`)} class="btn btn-link clear-cache svelte-7vykin">`);
            push_element($$renderer3, "button", 48, 16);
            Icon($$renderer3, { name: "eraser" });
            $$renderer3.push(`<!----></button>`);
            pop_element();
            $$renderer3.push(` `);
            Tooltip($$renderer3, {
              target: `clear_cache_${stringify(index)}`,
              placement: "top",
              children: prevent_snippet_stringification(($$renderer4) => {
                $$renderer4.push(`<!---->Clear the cache for this query`);
              }),
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----></div>`);
            pop_element();
            $$renderer3.push(`</div>`);
            pop_element();
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]--> `);
          if (chat.chatbot) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<div class="row">`);
            push_element($$renderer3, "div", 56, 8);
            $$renderer3.push(`<div class="chatbot-message svelte-7vykin">`);
            push_element($$renderer3, "div", 57, 12);
            $$renderer3.push(`<div>`);
            push_element($$renderer3, "div", 58, 16);
            $$renderer3.push(`${html(chat.chatbot)}</div>`);
            pop_element();
            $$renderer3.push(` `);
            if (chat.img_url) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<div class="d-flex flex-row justify-content-center">`);
              push_element($$renderer3, "div", 62, 20);
              $$renderer3.push(`<img${attr("src", chat.img_url)} alt="Image" style="max-width: 500px; max-height: 500px;"/>`);
              push_element($$renderer3, "img", 63, 24);
              pop_element();
              $$renderer3.push(`</div>`);
              pop_element();
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--> <div class="d-flex flex-row justify-content-between">`);
            push_element($$renderer3, "div", 66, 16);
            $$renderer3.push(`<div>`);
            push_element($$renderer3, "div", 67, 20);
            $$renderer3.push(`Time taken: ${escape_html(chat.time)} `);
            if (chat.debug && debug) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<!--[-->`);
              const each_array_1 = ensure_array_like(Object.keys(chat.debug));
              for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
                let key = each_array_1[$$index];
                $$renderer3.push(`<br/>`);
                push_element($$renderer3, "br", 71, 32);
                pop_element();
                $$renderer3.push(` ${escape_html(key)}: ${escape_html(parseFloat(chat.debug[key]).toFixed(4))}s`);
              }
              $$renderer3.push(`<!--]-->`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--></div>`);
            pop_element();
            $$renderer3.push(` `);
            if (chat.review) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<div${attr("id", `chat_rating_${stringify(index)}`)} style="cursor: pointer;">`);
              push_element($$renderer3, "div", 78, 24);
              $$renderer3.push(`Review: `);
              if (chat.review.rating == 5) {
                $$renderer3.push("<!--[-->");
                $$renderer3.push(`😀`);
              } else if (chat.review.rating == 4) {
                $$renderer3.push("<!--[1-->");
                $$renderer3.push(`🙂`);
              } else if (chat.review.rating == 3) {
                $$renderer3.push("<!--[2-->");
                $$renderer3.push(`😐`);
              } else if (chat.review.rating == 2) {
                $$renderer3.push("<!--[3-->");
                $$renderer3.push(`😕`);
              } else if (chat.review.rating == 1) {
                $$renderer3.push("<!--[4-->");
                $$renderer3.push(`😡`);
              } else {
                $$renderer3.push("<!--[!-->");
                $$renderer3.push(`❓`);
              }
              $$renderer3.push(`<!--]--></div>`);
              pop_element();
              $$renderer3.push(` `);
              Tooltip($$renderer3, {
                target: `chat_rating_${stringify(index)}`,
                placement: "top",
                children: prevent_snippet_stringification(($$renderer4) => {
                  $$renderer4.push(`<!---->Click to see Review`);
                }),
                $$slots: { default: true }
              });
              $$renderer3.push(`<!---->`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--> <div>`);
            push_element($$renderer3, "div", 85, 20);
            Button($$renderer3, {
              color: "primary",
              children: prevent_snippet_stringification(($$renderer4) => {
                $$renderer4.push(`<!---->Copy Output`);
              }),
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----></div>`);
            pop_element();
            $$renderer3.push(`</div>`);
            pop_element();
            $$renderer3.push(`</div>`);
            pop_element();
            $$renderer3.push(`</div>`);
            pop_element();
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]-->`);
        }
        $$renderer3.push(`<!--]--> `);
        {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]-->`);
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { chatContents, debug });
    },
    Chatbox
  );
}
Chatbox.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Searchbar[FILENAME] = "src/components/common/searchbar.svelte";
function Searchbar($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let listOfDefaultQuestions = fallback($$props["listOfDefaultQuestions"], () => ({}), true);
      let query = fallback($$props["query"], "");
      let chatContents = fallback($$props["chatContents"], () => [], true);
      let promptaddition = fallback($$props["promptaddition"], "");
      let index = fallback($$props["index"], "");
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<div style="display: flex; justify-content: space-between; flex-wrap: nowrap;" class="input-group">`);
        push_element($$renderer3, "div", 34, 0);
        Input($$renderer3, {
          disabled: false,
          invalid: false,
          placeholder: "Ask a Question . . . ",
          plaintext: false,
          reverse: false,
          type: "text",
          valid: false,
          class: "form-control",
          style: "width: 70%; border: solid;",
          get value() {
            return query;
          },
          set value($$value) {
            query = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----> `);
        if (Object.keys(listOfDefaultQuestions).length > 0) {
          $$renderer3.push("<!--[-->");
          Button($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<!---->Clear`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Dropdown($$renderer3, {
            direction: "up",
            children: prevent_snippet_stringification(($$renderer4) => {
              DropdownToggle($$renderer4, {
                style: "background-color:white; color: black; border:solid; max-width: 300px; overflow:hidden",
                caret: true,
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<!---->${escape_html("Examples")}`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              DropdownMenu($$renderer4, {
                style: "overflow-y: scroll; max-height:500px;",
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<!--[-->`);
                  const each_array = ensure_array_like(Object.keys(listOfDefaultQuestions));
                  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                    let key = each_array[$$index];
                    DropdownItem($$renderer5, {
                      children: prevent_snippet_stringification(($$renderer6) => {
                        $$renderer6.push(`<!---->${escape_html(key)}`);
                      }),
                      $$slots: { default: true }
                    });
                  }
                  $$renderer5.push(`<!--]-->`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!---->`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]-->`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> `);
        Button($$renderer3, {
          style: "text-align: right;",
          color: "secondary",
          children: prevent_snippet_stringification(($$renderer4) => {
            Icon($$renderer4, { name: "chat-fill" });
          }),
          $$slots: { default: true }
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
      bind_props($$props, {
        listOfDefaultQuestions,
        query,
        chatContents,
        promptaddition,
        index
      });
    },
    Searchbar
  );
}
Searchbar.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  Chatbox as C,
  Settingstab as S,
  Structuredoutput as a,
  Searchbar as b
};
