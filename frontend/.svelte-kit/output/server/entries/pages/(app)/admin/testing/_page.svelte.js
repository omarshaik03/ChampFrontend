import { a3 as FILENAME } from "../../../../../chunks/utils2.js";
import "clsx";
import { a as store_get, u as unsubscribe_stores, p as prevent_snippet_stringification, b as attr, e as ensure_array_like, d as attr_class, f as stringify } from "../../../../../chunks/index2.js";
import { p as push_element, a as pop_element } from "../../../../../chunks/dev.js";
import { i as Container, R as Row, j as Col, C as Card, k as CardHeader, l as CardTitle, B as Button, I as Icon, S as Spinner } from "../../../../../chunks/Tooltip.js";
import { u as userStore } from "../../../../../chunks/userStore.js";
import "../../../../../chunks/runtime-config.js";
import { e as escape_html } from "../../../../../chunks/context.js";
import { H as Heading } from "../../../../../chunks/Heading.js";
const TESTING_ENDPOINTS = [
  {
    id: "doc_insights_search",
    app: "DocumentInsights",
    name: "Search Documents",
    url: "{{DOC_INSIGHTS_URL}}/search/?query=health&top=2",
    method: "GET",
    headers: {
      "Authorization": "Bearer {{TOKEN}}"
    },
    description: "Search document insights with query=health and top=2",
    critical: true
  },
  {
    id: "code_insight_submit",
    app: "CodeInsights",
    name: "Submit Code ZIP",
    url: "{{CODE_INSIGHTS_URL}}/input-zip-download",
    method: "POST",
    headers: {
      "Authorization": "Bearer {{TOKEN}}"
    },
    description: "Submit ZIP file for code insights analysis.",
    bodyType: "form-data",
    formFields: [
      { name: "access_key", type: "text" },
      { name: "report_file", type: "file", required: true },
      { name: "zip_file", type: "file", required: true },
      { name: "llm_key", type: "text" },
      { name: "llm_endpoint", type: "text" },
      { name: "llm_deployment_name", type: "text" },
      { name: "llm_api_version", type: "text" }
    ]
  },
  {
    id: "code_review_url",
    app: "CodeReview",
    name: "Review Git URL",
    url: "{{CODE_REVIEW_URL}}/review/url",
    method: "POST",
    headers: {
      "Authorization": "Bearer {{TOKEN}}"
    },
    description: "Analyze commits from a public Git repository URL",
    bodyType: "form-data",
    formFields: [
      { name: "repo_url", type: "text", defaultValue: "https://github.com/pallets/click.git", required: true },
      { name: "to_ref", type: "text", defaultValue: "HEAD", required: true },
      { name: "format", type: "text", defaultValue: "json", required: true },
      { name: "from_ref", type: "text", defaultValue: "HEAD~5" },
      { name: "max_commits", type: "text", defaultValue: "5" },
      { name: "branch", type: "text", defaultValue: "main" }
    ]
  },
  {
    id: "external_example",
    app: "External",
    name: "JSON Placeholder",
    url: "https://jsonplaceholder.typicode.com/todos/1",
    method: "GET",
    description: "Example external API call."
  }
];
Testing_dashboard[FILENAME] = "src/components/apps/admin/testing_dashboard.svelte";
function Testing_dashboard($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      let endpointsByApp;
      let selectedEndpoint = null;
      let batchResults = {};
      let selectedTests = new Set(TESTING_ENDPOINTS.filter((ep) => ep.critical).map((ep) => ep.id));
      store_get($$store_subs ??= {}, "$userStore", userStore)?.token || "";
      endpointsByApp = TESTING_ENDPOINTS.reduce(
        (acc, ep) => {
          if (!acc[ep.app]) acc[ep.app] = [];
          acc[ep.app].push(ep);
          return acc;
        },
        {}
      );
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        Container($$renderer3, {
          fluid: true,
          class: "p-4",
          children: prevent_snippet_stringification(($$renderer4) => {
            Row($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                Col($$renderer5, {
                  md: "4",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    Card($$renderer6, {
                      class: "mb-3",
                      children: prevent_snippet_stringification(($$renderer7) => {
                        CardHeader($$renderer7, {
                          class: "d-flex justify-content-between align-items-center",
                          children: prevent_snippet_stringification(($$renderer8) => {
                            $$renderer8.push(`<div class="d-flex align-items-center">`);
                            push_element($$renderer8, "div", 194, 20);
                            $$renderer8.push(`<input type="checkbox" class="form-check-input me-2"${attr("checked", TESTING_ENDPOINTS.length > 0 && selectedTests.size === TESTING_ENDPOINTS.length, true)} title="Select All"/>`);
                            push_element($$renderer8, "input", 195, 24);
                            pop_element();
                            $$renderer8.push(` `);
                            CardTitle($$renderer8, {
                              class: "mb-0",
                              children: prevent_snippet_stringification(($$renderer9) => {
                                $$renderer9.push(`<!---->Available Endpoints`);
                              }),
                              $$slots: { default: true }
                            });
                            $$renderer8.push(`<!----></div>`);
                            pop_element();
                            $$renderer8.push(` `);
                            Button($$renderer8, {
                              color: "success",
                              size: "sm",
                              disabled: selectedTests.size === 0,
                              children: prevent_snippet_stringification(($$renderer9) => {
                                {
                                  $$renderer9.push("<!--[!-->");
                                  $$renderer9.push(`Run Batch Tests (${escape_html(selectedTests.size)})`);
                                }
                                $$renderer9.push(`<!--]-->`);
                              }),
                              $$slots: { default: true }
                            });
                            $$renderer8.push(`<!---->`);
                          }),
                          $$slots: { default: true }
                        });
                        $$renderer7.push(`<!----> <div class="list-group list-group-flush" style="max-height: 80vh; overflow-y: auto;">`);
                        push_element($$renderer7, "div", 212, 16);
                        $$renderer7.push(`<!--[-->`);
                        const each_array = ensure_array_like(Object.entries(endpointsByApp));
                        for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
                          let [appName, endpoints] = each_array[$$index_1];
                          $$renderer7.push(`<div class="list-group-item bg-light fw-bold">`);
                          push_element($$renderer7, "div", 214, 24);
                          $$renderer7.push(`${escape_html(appName)}</div>`);
                          pop_element();
                          $$renderer7.push(` <!--[-->`);
                          const each_array_1 = ensure_array_like(endpoints);
                          for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
                            let ep = each_array_1[$$index];
                            $$renderer7.push(`<div${attr_class(`list-group-item list-group-item-action d-flex align-items-center ${stringify(selectedEndpoint?.id === ep.id ? "active" : "")}`)} role="button" tabindex="0">`);
                            push_element($$renderer7, "div", 216, 28);
                            $$renderer7.push(`<div class="me-3" role="none">`);
                            push_element($$renderer7, "div", 223, 32);
                            $$renderer7.push(`<input type="checkbox" class="form-check-input"${attr("checked", selectedTests.has(ep.id), true)}/>`);
                            push_element($$renderer7, "input", 224, 36);
                            pop_element();
                            $$renderer7.push(`</div>`);
                            pop_element();
                            $$renderer7.push(` <div class="flex-grow-1 overflow-hidden">`);
                            push_element($$renderer7, "div", 231, 32);
                            $$renderer7.push(`<div class="d-flex w-100 justify-content-between align-items-center">`);
                            push_element($$renderer7, "div", 232, 36);
                            $$renderer7.push(`<div class="d-flex align-items-center text-truncate">`);
                            push_element($$renderer7, "div", 233, 40);
                            if (batchResults[ep.id] === "pass") {
                              $$renderer7.push("<!--[-->");
                              Icon($$renderer7, { name: "check-circle-fill", class: "text-success me-2" });
                            } else if (batchResults[ep.id] === "fail") {
                              $$renderer7.push("<!--[1-->");
                              Icon($$renderer7, { name: "x-circle-fill", class: "text-danger me-2" });
                            } else if (batchResults[ep.id] === "running") {
                              $$renderer7.push("<!--[2-->");
                              Spinner($$renderer7, { size: "sm", color: "warning", class: "me-2" });
                            } else {
                              $$renderer7.push("<!--[!-->");
                            }
                            $$renderer7.push(`<!--]--> <h6 class="mb-1 text-truncate"${attr("title", ep.name)}>`);
                            push_element($$renderer7, "h6", 241, 44);
                            $$renderer7.push(`${escape_html(ep.name)}</h6>`);
                            pop_element();
                            $$renderer7.push(`</div>`);
                            pop_element();
                            $$renderer7.push(` <small class="ms-2 text-nowrap">`);
                            push_element($$renderer7, "small", 243, 40);
                            $$renderer7.push(`${escape_html(ep.method)}</small>`);
                            pop_element();
                            $$renderer7.push(`</div>`);
                            pop_element();
                            $$renderer7.push(` <small class="text-truncate d-block"${attr("title", ep.url)}>`);
                            push_element($$renderer7, "small", 245, 36);
                            $$renderer7.push(`${escape_html(ep.url)}</small>`);
                            pop_element();
                            $$renderer7.push(`</div>`);
                            pop_element();
                            $$renderer7.push(`</div>`);
                            pop_element();
                          }
                          $$renderer7.push(`<!--]-->`);
                        }
                        $$renderer7.push(`<!--]--></div>`);
                        pop_element();
                      }),
                      $$slots: { default: true }
                    });
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> `);
                Col($$renderer5, {
                  md: "8",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    {
                      $$renderer6.push("<!--[!-->");
                      $$renderer6.push(`<div class="text-center p-5 text-muted">`);
                      push_element($$renderer6, "div", 349, 16);
                      $$renderer6.push(`<h4>`);
                      push_element($$renderer6, "h4", 350, 20);
                      $$renderer6.push(`Select an endpoint to test</h4>`);
                      pop_element();
                      $$renderer6.push(`</div>`);
                      pop_element();
                    }
                    $$renderer6.push(`<!--]-->`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!---->`);
              }),
              $$slots: { default: true }
            });
          }),
          $$slots: { default: true }
        });
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      if ($$store_subs) unsubscribe_stores($$store_subs);
    },
    Testing_dashboard
  );
}
Testing_dashboard.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(app)/admin/testing/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      $$renderer2.push(`<div class="p-4">`);
      push_element($$renderer2, "div", 5, 0);
      Heading($$renderer2, {
        tag: "h2",
        class: "mb-4 text-2xl font-bold dark:text-white",
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<!---->API Testing Dashboard`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Testing_dashboard($$renderer2);
      $$renderer2.push(`<!----></div>`);
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
