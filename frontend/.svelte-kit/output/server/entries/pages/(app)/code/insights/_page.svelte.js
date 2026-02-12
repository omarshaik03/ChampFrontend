import { a3 as FILENAME } from "../../../../../chunks/utils2.js";
import "clsx";
import { a as store_get, p as prevent_snippet_stringification, d as attr_class, g as attr_style, b as attr, e as ensure_array_like, u as unsubscribe_stores, f as stringify } from "../../../../../chunks/index2.js";
import { p as push_element, a as pop_element } from "../../../../../chunks/dev.js";
import { i as Container, p as FormGroup, D as Dropdown, d as DropdownToggle, e as DropdownMenu, f as DropdownItem, I as Icon, B as Button, R as Row } from "../../../../../chunks/Tooltip.js";
import "diff";
import "jszip";
import "../../../../../chunks/toastwrapper.js";
import { u as userStore } from "../../../../../chunks/userStore.js";
import "../../../../../chunks/toastStore.js";
import { l as llmConfigStore, L as LlmConfigSelector } from "../../../../../chunks/LlmConfigSelector.js";
import "../../../../../chunks/runtime-config.js";
import { e as escape_html } from "../../../../../chunks/context.js";
Codeinsights[FILENAME] = "src/components/apps/codeInsights/codeinsights.svelte";
function Codeinsights($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      const codeInsightsLogo = "clipboard-data";
      let sql_language = "MS SQL Server";
      let user = store_get($$store_subs ??= {}, "$userStore", userStore);
      let leftPanelWidth = 400;
      let isResizing = false;
      let accessKey = "";
      let removedColor = "lightcoral";
      let addedColor = "lightgreen";
      let replacedColor = "#FFFF70";
      let emptyColor = "lightsteelblue";
      let backgroundColor = "white";
      let watch_process = false;
      let zipContent = {};
      let reportContent;
      let selectedFileName = "";
      new AbortController();
      llmConfigStore.activeConfig;
      if (user && !accessKey) {
        accessKey = "gAAAAABpaq1KvYRhAAf1vOIIDYztdJd8VStSsAn2uERRiWsUHEXVAdjxQX5EP79q_YY-Pin68xpNcuIcoDrmVjKNfEsMgoLaUw==";
      }
      if (user === null) {
        $$renderer2.push("<!--[-->");
        Container($$renderer2, {
          fluid: true,
          class: "d-flex justify-content-center align-items-center",
          style: "height: 80vh;",
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<div class="text-center">`);
            push_element($$renderer3, "div", 417, 8);
            $$renderer3.push(`<div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">`);
            push_element($$renderer3, "div", 418, 12);
            $$renderer3.push(`<span class="visually-hidden">`);
            push_element($$renderer3, "span", 419, 16);
            $$renderer3.push(`Loading...</span>`);
            pop_element();
            $$renderer3.push(`</div>`);
            pop_element();
            $$renderer3.push(` <h4 class="mt-3">`);
            push_element($$renderer3, "h4", 421, 12);
            $$renderer3.push(`Loading user data...</h4>`);
            pop_element();
            $$renderer3.push(`</div>`);
            pop_element();
          }),
          $$slots: { default: true }
        });
      } else {
        $$renderer2.push("<!--[!-->");
        {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        Container($$renderer2, {
          fluid: true,
          class: "insights-container",
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<div${attr_class("insights-layout svelte-1bgsrry", void 0, { "resizing": isResizing })}>`);
            push_element($$renderer3, "div", 436, 4);
            $$renderer3.push(`<div class="panel-group svelte-1bgsrry">`);
            push_element($$renderer3, "div", 437, 8);
            $$renderer3.push(`<div class="insights-panel svelte-1bgsrry"${attr_style(`width: ${leftPanelWidth}px;`)}>`);
            push_element($$renderer3, "div", 438, 12);
            $$renderer3.push(`<div class="insights-panel-content svelte-1bgsrry">`);
            push_element($$renderer3, "div", 439, 16);
            FormGroup($$renderer3, {
              children: prevent_snippet_stringification(($$renderer4) => {
                $$renderer4.push(`<div class="mb-3">`);
                push_element($$renderer4, "div", 441, 24);
                $$renderer4.push(`<span>`);
                push_element($$renderer4, "span", 442, 28);
                $$renderer4.push(`Upload a zip file:</span>`);
                pop_element();
                $$renderer4.push(` <span class="text-danger">`);
                push_element($$renderer4, "span", 443, 28);
                $$renderer4.push(`*</span>`);
                pop_element();
                $$renderer4.push(` <div class="input-group">`);
                push_element($$renderer4, "div", 444, 28);
                $$renderer4.push(`<input class="form-control" type="file"/>`);
                push_element($$renderer4, "input", 445, 32);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="mb-3">`);
                push_element($$renderer4, "div", 448, 24);
                $$renderer4.push(`<span>`);
                push_element($$renderer4, "span", 449, 28);
                $$renderer4.push(`Upload a report file:</span>`);
                pop_element();
                $$renderer4.push(`<span class="text-danger">`);
                push_element($$renderer4, "span", 449, 62);
                $$renderer4.push(`*</span>`);
                pop_element();
                $$renderer4.push(` <div class="input-group">`);
                push_element($$renderer4, "div", 450, 28);
                $$renderer4.push(`<input class="form-control" type="file"/>`);
                push_element($$renderer4, "input", 451, 32);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <h6 class="mb-2">`);
                push_element($$renderer4, "h6", 455, 24);
                $$renderer4.push(`LLM Configuration</h6>`);
                pop_element();
                $$renderer4.push(` `);
                LlmConfigSelector($$renderer4, {});
                $$renderer4.push(`<!----> <div class="mt-3 mb-3">`);
                push_element($$renderer4, "div", 458, 24);
                $$renderer4.push(`<span>`);
                push_element($$renderer4, "span", 459, 28);
                $$renderer4.push(`Access Key:</span>`);
                pop_element();
                $$renderer4.push(` <div class="input-group">`);
                push_element($$renderer4, "div", 460, 28);
                $$renderer4.push(`<input class="form-control" type="password"${attr("value", accessKey)} placeholder="Enter access key"/>`);
                push_element($$renderer4, "input", 461, 32);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="d-flex align-items-center justify-content-between mb-3">`);
                push_element($$renderer4, "div", 465, 24);
                $$renderer4.push(`<label for="sql_language" class="me-2 mb-0">`);
                push_element($$renderer4, "label", 466, 28);
                $$renderer4.push(`SQL Language:</label>`);
                pop_element();
                $$renderer4.push(` `);
                Dropdown($$renderer4, {
                  direction: "down",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    DropdownToggle($$renderer5, {
                      caret: true,
                      class: "btn btn-styled btn-styled-primary",
                      children: prevent_snippet_stringification(($$renderer6) => {
                        $$renderer6.push(`<!---->${escape_html(sql_language)}`);
                      }),
                      $$slots: { default: true }
                    });
                    $$renderer5.push(`<!----> `);
                    DropdownMenu($$renderer5, {
                      children: prevent_snippet_stringification(($$renderer6) => {
                        DropdownItem($$renderer6, {
                          children: prevent_snippet_stringification(($$renderer7) => {
                            $$renderer7.push(`<!---->MS SQL Server`);
                          }),
                          $$slots: { default: true }
                        });
                        $$renderer6.push(`<!----> `);
                        DropdownItem($$renderer6, {
                          children: prevent_snippet_stringification(($$renderer7) => {
                            $$renderer7.push(`<!---->Oracle`);
                          }),
                          $$slots: { default: true }
                        });
                        $$renderer6.push(`<!----> `);
                        DropdownItem($$renderer6, {
                          children: prevent_snippet_stringification(($$renderer7) => {
                            $$renderer7.push(`<!---->PostgreSQL`);
                          }),
                          $$slots: { default: true }
                        });
                        $$renderer6.push(`<!---->`);
                      }),
                      $$slots: { default: true }
                    });
                    $$renderer5.push(`<!---->`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!----></div>`);
                pop_element();
                $$renderer4.push(` <div class="d-flex align-items-center gap-2 mb-2">`);
                push_element($$renderer4, "div", 479, 24);
                $$renderer4.push(`<button class="btn btn-styled btn-styled-primary flex-grow-1 py-2">`);
                push_element($$renderer4, "button", 480, 28);
                $$renderer4.push(`Process Files</button>`);
                pop_element();
                $$renderer4.push(` `);
                {
                  $$renderer4.push("<!--[!-->");
                }
                $$renderer4.push(`<!--]--></div>`);
                pop_element();
                $$renderer4.push(` <div class="form-check">`);
                push_element($$renderer4, "div", 485, 24);
                $$renderer4.push(`<input class="form-check-input" id="watch_process" type="checkbox"${attr("checked", watch_process, true)}/>`);
                push_element($$renderer4, "input", 486, 28);
                pop_element();
                $$renderer4.push(` <label class="form-check-label" for="watch_process">`);
                push_element($$renderer4, "label", 487, 28);
                $$renderer4.push(`Watch Process</label>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----> `);
            {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--> `);
            if (zipContent || reportContent) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<hr/>`);
              push_element($$renderer3, "hr", 509, 24);
              pop_element();
              $$renderer3.push(` <div>`);
              push_element($$renderer3, "div", 510, 24);
              $$renderer3.push(`<div class="col">`);
              push_element($$renderer3, "div", 511, 28);
              $$renderer3.push(`<span>`);
              push_element($$renderer3, "span", 512, 32);
              $$renderer3.push(`Approve/View a File:</span>`);
              pop_element();
              $$renderer3.push(`</div>`);
              pop_element();
              $$renderer3.push(` <div class="file-select-container svelte-1bgsrry">`);
              push_element($$renderer3, "div", 514, 28);
              {
                $$renderer3.push("<!--[!-->");
              }
              $$renderer3.push(`<!--]--> `);
              if (zipContent) {
                $$renderer3.push("<!--[-->");
                $$renderer3.push(`<!--[-->`);
                const each_array = ensure_array_like(Object.keys(zipContent));
                for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                  let fileName = each_array[$$index];
                  $$renderer3.push(`<div${attr_class(`file-select px-2 d-inline-flex ${stringify(selectedFileName === fileName ? "active" : "")}`, "svelte-1bgsrry")}${attr("title", fileName)}>`);
                  push_element($$renderer3, "div", 524, 40);
                  $$renderer3.push(`<input type="checkbox"${attr("checked", zipContent[fileName].selected, true)}/>`);
                  push_element($$renderer3, "input", 525, 44);
                  pop_element();
                  $$renderer3.push(` <button type="button" class="btn btn-link p-0 ms-1" style="overflow: hidden;" aria-label="Select file">`);
                  push_element($$renderer3, "button", 526, 44);
                  $$renderer3.push(`${escape_html(`${fileName.substring(0, 35)}...`)}</button>`);
                  pop_element();
                  $$renderer3.push(` `);
                  if (zipContent[fileName].status == "incomplete") {
                    $$renderer3.push("<!--[-->");
                    $$renderer3.push(`<span style="color: red;">`);
                    push_element($$renderer3, "span", 530, 48);
                    Icon($$renderer3, { name: "x-lg" });
                    $$renderer3.push(`<!----></span>`);
                    pop_element();
                  } else if (zipContent[fileName].status == "processing") {
                    $$renderer3.push("<!--[1-->");
                    $$renderer3.push(`<div class="ms-1 spinner-border spinner-border-sm text-primary">`);
                    push_element($$renderer3, "div", 532, 48);
                    $$renderer3.push(`<span class="visually-hidden">`);
                    push_element($$renderer3, "span", 533, 52);
                    $$renderer3.push(`Loading...</span>`);
                    pop_element();
                    $$renderer3.push(`</div>`);
                    pop_element();
                  } else if (zipContent[fileName].status == "complete") {
                    $$renderer3.push("<!--[2-->");
                    $$renderer3.push(`<span style="color: green;">`);
                    push_element($$renderer3, "span", 536, 48);
                    Icon($$renderer3, { name: "check-lg" });
                    $$renderer3.push(`<!----></span>`);
                    pop_element();
                  } else {
                    $$renderer3.push("<!--[!-->");
                  }
                  $$renderer3.push(`<!--]--></div>`);
                  pop_element();
                }
                $$renderer3.push(`<!--]-->`);
              } else {
                $$renderer3.push("<!--[!-->");
              }
              $$renderer3.push(`<!--]--></div>`);
              pop_element();
              $$renderer3.push(`</div>`);
              pop_element();
              $$renderer3.push(` <hr/>`);
              push_element($$renderer3, "hr", 543, 24);
              pop_element();
              $$renderer3.push(` `);
              FormGroup($$renderer3, {
                children: prevent_snippet_stringification(($$renderer4) => {
                  Button($$renderer4, {
                    class: "btn-styled btn-styled-primary w-100 py-2",
                    disabled: !Object.values(zipContent || {}).some((f) => f.status === "complete"),
                    children: prevent_snippet_stringification(($$renderer5) => {
                      $$renderer5.push(`<!---->Approve and Download`);
                    }),
                    $$slots: { default: true }
                  });
                }),
                $$slots: { default: true }
              });
              $$renderer3.push(`<!---->`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--> <hr/>`);
            push_element($$renderer3, "hr", 554, 20);
            pop_element();
            $$renderer3.push(` `);
            Row($$renderer3, {
              children: prevent_snippet_stringification(($$renderer4) => {
                $$renderer4.push(`<span>`);
                push_element($$renderer4, "span", 556, 24);
                $$renderer4.push(`Legend:</span>`);
                pop_element();
                $$renderer4.push(` <span>`);
                push_element($$renderer4, "span", 557, 24);
                $$renderer4.push(`<span${attr_style(`color:${stringify(removedColor)};`)}>`);
                push_element($$renderer4, "span", 557, 30);
                Icon($$renderer4, { name: "square-fill" });
                $$renderer4.push(`<!----></span>`);
                pop_element();
                $$renderer4.push(` - Removed</span>`);
                pop_element();
                $$renderer4.push(` <span>`);
                push_element($$renderer4, "span", 558, 24);
                $$renderer4.push(`<span${attr_style(`color:${stringify(addedColor)};`)}>`);
                push_element($$renderer4, "span", 558, 30);
                Icon($$renderer4, { name: "square-fill" });
                $$renderer4.push(`<!----></span>`);
                pop_element();
                $$renderer4.push(` - Added</span>`);
                pop_element();
                $$renderer4.push(` <span>`);
                push_element($$renderer4, "span", 559, 24);
                $$renderer4.push(`<span${attr_style(`color:${stringify(replacedColor)};`)}>`);
                push_element($$renderer4, "span", 559, 30);
                Icon($$renderer4, { name: "square-fill" });
                $$renderer4.push(`<!----></span>`);
                pop_element();
                $$renderer4.push(` - Replaced</span>`);
                pop_element();
                $$renderer4.push(` <span>`);
                push_element($$renderer4, "span", 560, 24);
                $$renderer4.push(`<span${attr_style(`color:${stringify(emptyColor)};`)}>`);
                push_element($$renderer4, "span", 560, 30);
                Icon($$renderer4, { name: "square-fill" });
                $$renderer4.push(`<!----></span>`);
                pop_element();
                $$renderer4.push(` - Empty</span>`);
                pop_element();
                $$renderer4.push(` <span>`);
                push_element($$renderer4, "span", 561, 24);
                $$renderer4.push(`<span${attr_style(`color:${stringify(backgroundColor)};`)}>`);
                push_element($$renderer4, "span", 561, 30);
                Icon($$renderer4, { name: "square-fill" });
                $$renderer4.push(`<!----></span>`);
                pop_element();
                $$renderer4.push(` - Background</span>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----></div>`);
            pop_element();
            $$renderer3.push(`</div>`);
            pop_element();
            $$renderer3.push(` <div class="resize-handle svelte-1bgsrry" title="Drag to resize">`);
            push_element($$renderer3, "div", 565, 13);
            Icon($$renderer3, { name: "grip-vertical" });
            $$renderer3.push(`<!----></div>`);
            pop_element();
            $$renderer3.push(`</div>`);
            pop_element();
            $$renderer3.push(` <div class="insights-main svelte-1bgsrry">`);
            push_element($$renderer3, "div", 569, 8);
            $$renderer3.push(`<div class="header-section svelte-1bgsrry">`);
            push_element($$renderer3, "div", 570, 12);
            $$renderer3.push(`<h2 class="svelte-1bgsrry">`);
            push_element($$renderer3, "h2", 571, 16);
            Icon($$renderer3, { name: codeInsightsLogo });
            $$renderer3.push(`<!----> Code Insights</h2>`);
            pop_element();
            $$renderer3.push(` <p class="text-muted">`);
            push_element($$renderer3, "p", 572, 16);
            $$renderer3.push(`Analyze and remediate code using AI.</p>`);
            pop_element();
            $$renderer3.push(`</div>`);
            pop_element();
            $$renderer3.push(` <hr class="my-4"/>`);
            push_element($$renderer3, "hr", 574, 12);
            pop_element();
            $$renderer3.push(` `);
            {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<div class="text-center mt-4">`);
              push_element($$renderer3, "div", 576, 16);
              $$renderer3.push(`<h3>`);
              push_element($$renderer3, "h3", 577, 20);
              $$renderer3.push(`Select a file to view</h3>`);
              pop_element();
              $$renderer3.push(`</div>`);
              pop_element();
            }
            $$renderer3.push(`<!--]--></div>`);
            pop_element();
            $$renderer3.push(`</div>`);
            pop_element();
          }),
          $$slots: { default: true }
        });
        $$renderer2.push(`<!---->`);
      }
      $$renderer2.push(`<!--]-->`);
      if ($$store_subs) unsubscribe_stores($$store_subs);
    },
    Codeinsights
  );
}
Codeinsights.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(app)/code/insights/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      Codeinsights($$renderer2);
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
