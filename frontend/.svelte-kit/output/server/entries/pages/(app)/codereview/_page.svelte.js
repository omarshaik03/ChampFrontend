import { a3 as FILENAME } from "../../../../chunks/utils2.js";
import "clsx";
import { a as store_get, u as unsubscribe_stores, p as prevent_snippet_stringification, b as attr, e as ensure_array_like, d as attr_class } from "../../../../chunks/index2.js";
import { p as push_element, a as pop_element } from "../../../../chunks/dev.js";
import { I as Icon, B as Button, C as Card, h as CardBody, l as CardTitle, g as Input, t as Badge, u as Collapse, r as Table } from "../../../../chunks/Tooltip.js";
import "../../../../chunks/toastwrapper.js";
import "../../../../chunks/timer.js";
import { T as ToastNotifications } from "../../../../chunks/ToastNotifications.js";
import "../../../../chunks/toastStore.js";
import { u as userStore } from "../../../../chunks/userStore.js";
import "../../../../chunks/runtime-config.js";
import { e as escape_html } from "../../../../chunks/context.js";
import "../../../../chunks/databaseInsights.js";
CodeReview[FILENAME] = "src/components/apps/codeReview/codeReview.svelte";
function CodeReview($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      store_get($$store_subs ??= {}, "$userStore", userStore);
      let githubRepos = [];
      let repoSearchQuery = "";
      let azdoRepos = [];
      let azdoRepoSearchQuery = "";
      let reviewMode = "url";
      let repoUrl = "";
      let branch = "main";
      let maxCommits = 1;
      let sinceDate = "";
      let untilDate = "";
      let loading = false;
      let reviews = [];
      let failedCommits = [];
      let validationErrors = {};
      let expandedCommits = /* @__PURE__ */ new Set();
      let expandedSolutions = /* @__PURE__ */ new Set();
      function getSeverityColor(severity) {
        switch (severity) {
          case "critical":
            return "danger";
          case "warn":
            return "warning";
          case "nit":
            return "info";
          case "info":
            return "secondary";
          default:
            return "secondary";
        }
      }
      function getSecuritySeverityColor(severity) {
        switch (severity.toLowerCase()) {
          case "critical":
            return "danger";
          case "high":
            return "danger";
          case "medium":
            return "warning";
          case "low":
            return "info";
          default:
            return "secondary";
        }
      }
      function getRiskLevelColor(riskLevel) {
        switch (riskLevel.toLowerCase()) {
          case "critical":
            return "danger";
          case "high":
            return "danger";
          case "medium":
            return "warning";
          case "low":
            return "info";
          case "none":
            return "success";
          default:
            return "secondary";
        }
      }
      githubRepos.filter((repo) => repo.full_name.toLowerCase().includes(repoSearchQuery.toLowerCase()) || repo.description && repo.description.toLowerCase().includes(repoSearchQuery.toLowerCase()));
      azdoRepos.filter((repo) => repo.full_name.toLowerCase().includes(azdoRepoSearchQuery.toLowerCase()) || repo.name.toLowerCase().includes(azdoRepoSearchQuery.toLowerCase()));
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        ToastNotifications($$renderer3, { position: "top-right", maxToasts: 5 });
        $$renderer3.push(`<!----> <div id="main" class="main svelte-1u2kfow">`);
        push_element($$renderer3, "div", 956, 0);
        $$renderer3.push(`<div class="header-section svelte-1u2kfow">`);
        push_element($$renderer3, "div", 957, 4);
        $$renderer3.push(`<h2 class="svelte-1u2kfow">`);
        push_element($$renderer3, "h2", 958, 8);
        Icon($$renderer3, { name: "file-code" });
        $$renderer3.push(`<!----> Code Review Assistant</h2>`);
        pop_element();
        $$renderer3.push(` <p class="text-muted">`);
        push_element($$renderer3, "p", 959, 8);
        $$renderer3.push(`Analyze Git commits with AI-powered insights</p>`);
        pop_element();
        $$renderer3.push(` <div class="auth-section mt-3 d-flex justify-content-center gap-3 flex-wrap svelte-1u2kfow">`);
        push_element($$renderer3, "div", 962, 8);
        $$renderer3.push(`<div class="auth-provider-card svelte-1u2kfow">`);
        push_element($$renderer3, "div", 964, 12);
        {
          $$renderer3.push("<!--[!-->");
          Button($$renderer3, {
            color: "dark",
            children: prevent_snippet_stringification(($$renderer4) => {
              Icon($$renderer4, { name: "github" });
              $$renderer4.push(`<!----> Sign in with GitHub`);
            }),
            $$slots: { default: true }
          });
        }
        $$renderer3.push(`<!--]--></div>`);
        pop_element();
        $$renderer3.push(` <div class="auth-provider-card svelte-1u2kfow">`);
        push_element($$renderer3, "div", 985, 12);
        {
          $$renderer3.push("<!--[!-->");
          Button($$renderer3, {
            color: "primary",
            children: prevent_snippet_stringification(($$renderer4) => {
              Icon($$renderer4, { name: "cloud" });
              $$renderer4.push(`<!----> Sign in with Azure DevOps`);
            }),
            $$slots: { default: true }
          });
        }
        $$renderer3.push(`<!--]--></div>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` <p class="text-muted mt-2 mb-0">`);
        push_element($$renderer3, "p", 1047, 8);
        $$renderer3.push(`<small>`);
        push_element($$renderer3, "small", 1048, 12);
        $$renderer3.push(`Sign in to access your private repositories</small>`);
        pop_element();
        $$renderer3.push(`</p>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` `);
        Card($$renderer3, {
          class: "mb-4 config-card",
          children: prevent_snippet_stringification(($$renderer4) => {
            CardBody($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                CardTitle($$renderer5, {
                  children: prevent_snippet_stringification(($$renderer6) => {
                    Icon($$renderer6, { name: "gear" });
                    $$renderer6.push(`<!----> Review Configuration`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> <div class="mb-3">`);
                push_element($$renderer5, "div", 1058, 12);
                $$renderer5.push(`<label class="form-label fw-bold">`);
                push_element($$renderer5, "label", 1059, 16);
                $$renderer5.push(`Review Source</label>`);
                pop_element();
                $$renderer5.push(` <div class="btn-group w-100" role="group">`);
                push_element($$renderer5, "div", 1060, 16);
                {
                  $$renderer5.push("<!--[!-->");
                }
                $$renderer5.push(`<!--]--> <input type="radio" class="btn-check"${attr("checked", reviewMode === "url", true)} value="url" id="mode-url"/>`);
                push_element($$renderer5, "input", 1075, 20);
                pop_element();
                $$renderer5.push(` <label class="btn btn-outline-primary" for="mode-url">`);
                push_element($$renderer5, "label", 1083, 20);
                Icon($$renderer5, { name: "link-45deg" });
                $$renderer5.push(`<!----> Repository URL</label>`);
                pop_element();
                $$renderer5.push(` `);
                {
                  $$renderer5.push("<!--[!-->");
                }
                $$renderer5.push(`<!--]--> <input type="radio" class="btn-check"${attr("checked", reviewMode === "upload", true)} value="upload" id="mode-upload"/>`);
                push_element($$renderer5, "input", 1101, 20);
                pop_element();
                $$renderer5.push(` <label class="btn btn-outline-primary" for="mode-upload">`);
                push_element($$renderer5, "label", 1109, 20);
                Icon($$renderer5, { name: "upload" });
                $$renderer5.push(`<!----> Upload ZIP</label>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(` `);
                {
                  $$renderer5.push("<!--[2-->");
                  $$renderer5.push(`<div class="row mb-3">`);
                  push_element($$renderer5, "div", 1243, 16);
                  $$renderer5.push(`<div class="col-md-8">`);
                  push_element($$renderer5, "div", 1244, 20);
                  $$renderer5.push(`<label class="form-label">`);
                  push_element($$renderer5, "label", 1245, 24);
                  $$renderer5.push(`Repository URL</label>`);
                  pop_element();
                  $$renderer5.push(` `);
                  Input($$renderer5, {
                    placeholder: "https://github.com/username/repo.git",
                    class: validationErrors.repoUrl ? "is-invalid" : "",
                    get value() {
                      return repoUrl;
                    },
                    set value($$value) {
                      repoUrl = $$value;
                      $$settled = false;
                    }
                  });
                  $$renderer5.push(`<!----> `);
                  if (validationErrors.repoUrl) {
                    $$renderer5.push("<!--[-->");
                    $$renderer5.push(`<div class="invalid-feedback d-block svelte-1u2kfow">`);
                    push_element($$renderer5, "div", 1255, 28);
                    $$renderer5.push(`${escape_html(validationErrors.repoUrl)}</div>`);
                    pop_element();
                  } else {
                    $$renderer5.push("<!--[!-->");
                    $$renderer5.push(`<small class="text-muted">`);
                    push_element($$renderer5, "small", 1259, 28);
                    $$renderer5.push(`Enter a public Git repository URL. Sign in above to access private repos.</small>`);
                    pop_element();
                  }
                  $$renderer5.push(`<!--]--></div>`);
                  pop_element();
                  $$renderer5.push(` <div class="col-md-4">`);
                  push_element($$renderer5, "div", 1262, 20);
                  $$renderer5.push(`<label class="form-label">`);
                  push_element($$renderer5, "label", 1263, 24);
                  $$renderer5.push(`Branch Name</label>`);
                  pop_element();
                  $$renderer5.push(` `);
                  Input($$renderer5, {
                    placeholder: "main",
                    get value() {
                      return branch;
                    },
                    set value($$value) {
                      branch = $$value;
                      $$settled = false;
                    }
                  });
                  $$renderer5.push(`<!----> <small class="text-muted">`);
                  push_element($$renderer5, "small", 1269, 24);
                  $$renderer5.push(`e.g., main, master, develop</small>`);
                  pop_element();
                  $$renderer5.push(`</div>`);
                  pop_element();
                  $$renderer5.push(`</div>`);
                  pop_element();
                }
                $$renderer5.push(`<!--]--> <div class="row mb-3">`);
                push_element($$renderer5, "div", 1293, 12);
                $$renderer5.push(`<div class="col-md-2">`);
                push_element($$renderer5, "div", 1294, 16);
                $$renderer5.push(`<label class="form-label">`);
                push_element($$renderer5, "label", 1295, 20);
                $$renderer5.push(`Max Commits</label>`);
                pop_element();
                $$renderer5.push(` `);
                Input($$renderer5, {
                  type: "number",
                  placeholder: "1",
                  min: "1",
                  max: "100",
                  step: "1",
                  class: validationErrors.maxCommits ? "is-invalid" : "",
                  get value() {
                    return maxCommits;
                  },
                  set value($$value) {
                    maxCommits = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!----> `);
                if (validationErrors.maxCommits) {
                  $$renderer5.push("<!--[-->");
                  $$renderer5.push(`<div class="invalid-feedback d-block svelte-1u2kfow">`);
                  push_element($$renderer5, "div", 1309, 24);
                  $$renderer5.push(`${escape_html(validationErrors.maxCommits)}</div>`);
                  pop_element();
                } else {
                  $$renderer5.push("<!--[!-->");
                }
                $$renderer5.push(`<!--]--></div>`);
                pop_element();
                $$renderer5.push(` <div class="col-md-5">`);
                push_element($$renderer5, "div", 1312, 16);
                $$renderer5.push(`<label class="form-label">`);
                push_element($$renderer5, "label", 1313, 20);
                $$renderer5.push(`Start Date <small class="text-muted">`);
                push_element($$renderer5, "small", 1313, 57);
                $$renderer5.push(`(optional)</small>`);
                pop_element();
                $$renderer5.push(`</label>`);
                pop_element();
                $$renderer5.push(` `);
                Input($$renderer5, {
                  type: "date",
                  max: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
                  class: validationErrors.dates ? "is-invalid" : "",
                  get value() {
                    return sinceDate;
                  },
                  set value($$value) {
                    sinceDate = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!----> `);
                if (validationErrors.dates) {
                  $$renderer5.push("<!--[-->");
                  $$renderer5.push(`<div class="invalid-feedback d-block svelte-1u2kfow">`);
                  push_element($$renderer5, "div", 1323, 24);
                  $$renderer5.push(`${escape_html(validationErrors.dates)}</div>`);
                  pop_element();
                } else {
                  $$renderer5.push("<!--[!-->");
                }
                $$renderer5.push(`<!--]--></div>`);
                pop_element();
                $$renderer5.push(` <div class="col-md-5">`);
                push_element($$renderer5, "div", 1326, 16);
                $$renderer5.push(`<label class="form-label">`);
                push_element($$renderer5, "label", 1327, 20);
                $$renderer5.push(`End Date <small class="text-muted">`);
                push_element($$renderer5, "small", 1327, 55);
                $$renderer5.push(`(optional)</small>`);
                pop_element();
                $$renderer5.push(`</label>`);
                pop_element();
                $$renderer5.push(` `);
                Input($$renderer5, {
                  type: "date",
                  max: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
                  class: validationErrors.dates && !validationErrors.dates.includes("Start") ? "is-invalid" : "",
                  get value() {
                    return untilDate;
                  },
                  set value($$value) {
                    untilDate = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!----></div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(` <div class="row mb-3">`);
                push_element($$renderer5, "div", 1340, 12);
                $$renderer5.push(`<div class="col">`);
                push_element($$renderer5, "div", 1341, 16);
                $$renderer5.push(`<label class="form-label">`);
                push_element($$renderer5, "label", 1342, 20);
                Icon($$renderer5, { name: "file-earmark-text" });
                $$renderer5.push(`<!----> Review Guidelines <small class="text-muted">`);
                push_element($$renderer5, "small", 1343, 76);
                $$renderer5.push(`(optional)</small>`);
                pop_element();
                $$renderer5.push(`</label>`);
                pop_element();
                $$renderer5.push(` <div class="d-flex align-items-center gap-2">`);
                push_element($$renderer5, "div", 1345, 20);
                $$renderer5.push(`<input type="file" class="form-control" accept=".pdf,.docx,.txt"/>`);
                push_element($$renderer5, "input", 1346, 24);
                pop_element();
                $$renderer5.push(` `);
                {
                  $$renderer5.push("<!--[!-->");
                }
                $$renderer5.push(`<!--]--></div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(` <div class="d-flex gap-2">`);
                push_element($$renderer5, "div", 1373, 12);
                Button($$renderer5, {
                  color: "primary",
                  disabled: loading,
                  class: "flex-grow-1",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    Icon($$renderer6, { name: "play-fill" });
                    $$renderer6.push(`<!----> Start Review`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> `);
                {
                  $$renderer5.push("<!--[!-->");
                  Button($$renderer5, {
                    color: "secondary",
                    children: prevent_snippet_stringification(($$renderer6) => {
                      Icon($$renderer6, { name: "x-circle" });
                      $$renderer6.push(`<!----> Clear`);
                    }),
                    $$slots: { default: true }
                  });
                }
                $$renderer5.push(`<!--]--></div>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> <div>`);
        push_element($$renderer3, "div", 1391, 4);
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` `);
        {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> `);
        {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> `);
        if (failedCommits.length > 0) {
          $$renderer3.push("<!--[-->");
          Card($$renderer3, {
            class: "mb-4 border-warning",
            children: prevent_snippet_stringification(($$renderer4) => {
              CardBody($$renderer4, {
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<div class="text-warning">`);
                  push_element($$renderer5, "div", 1446, 16);
                  Icon($$renderer5, { name: "exclamation-triangle-fill" });
                  $$renderer5.push(`<!----> <strong>`);
                  push_element($$renderer5, "strong", 1448, 20);
                  $$renderer5.push(`${escape_html(failedCommits.length)} commit${escape_html(failedCommits.length !== 1 ? "s" : "")} failed to analyze</strong>`);
                  pop_element();
                  $$renderer5.push(` (likely due to rate limiting)</div>`);
                  pop_element();
                  $$renderer5.push(` <small class="text-muted">`);
                  push_element($$renderer5, "small", 1451, 16);
                  $$renderer5.push(`Failed commits: ${escape_html(failedCommits.join(", "))}</small>`);
                  pop_element();
                  $$renderer5.push(` <div class="mt-2">`);
                  push_element($$renderer5, "div", 1454, 16);
                  $$renderer5.push(`<small>`);
                  push_element($$renderer5, "small", 1455, 20);
                  $$renderer5.push(`Try reducing the number of commits or wait a few minutes before retrying.</small>`);
                  pop_element();
                  $$renderer5.push(`</div>`);
                  pop_element();
                }),
                $$slots: { default: true }
              });
            }),
            $$slots: { default: true }
          });
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> `);
        if (reviews.length > 0) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="reviews-container svelte-1u2kfow">`);
          push_element($$renderer3, "div", 1463, 8);
          $$renderer3.push(`<!--[-->`);
          const each_array_2 = ensure_array_like(reviews);
          for (let $$index_4 = 0, $$length = each_array_2.length; $$index_4 < $$length; $$index_4++) {
            let review = each_array_2[$$index_4];
            Card($$renderer3, {
              class: "mb-3 review-card",
              children: prevent_snippet_stringification(($$renderer4) => {
                CardBody($$renderer4, {
                  children: prevent_snippet_stringification(($$renderer5) => {
                    $$renderer5.push(`<div class="commit-header svelte-1u2kfow" role="button" tabindex="0">`);
                    push_element($$renderer5, "div", 1467, 24);
                    $$renderer5.push(`<div class="d-flex justify-content-between align-items-start">`);
                    push_element($$renderer5, "div", 1468, 28);
                    $$renderer5.push(`<div class="flex-grow-1">`);
                    push_element($$renderer5, "div", 1469, 32);
                    $$renderer5.push(`<h5 class="mb-1">`);
                    push_element($$renderer5, "h5", 1470, 36);
                    Icon($$renderer5, {
                      name: expandedCommits.has(review.commit_hash) ? "chevron-down" : "chevron-right"
                    });
                    $$renderer5.push(`<!----> <code class="commit-hash svelte-1u2kfow">`);
                    push_element($$renderer5, "code", 1472, 40);
                    $$renderer5.push(`${escape_html(review.commit_hash)}</code>`);
                    pop_element();
                    $$renderer5.push(`</h5>`);
                    pop_element();
                    $$renderer5.push(` <p class="commit-message mb-2 svelte-1u2kfow">`);
                    push_element($$renderer5, "p", 1474, 36);
                    $$renderer5.push(`${escape_html(review.commit_message)}</p>`);
                    pop_element();
                    $$renderer5.push(`</div>`);
                    pop_element();
                    $$renderer5.push(` `);
                    Badge($$renderer5, {
                      color: "secondary",
                      children: prevent_snippet_stringification(($$renderer6) => {
                        $$renderer6.push(`<!---->${escape_html(review.findings.length)} finding${escape_html(review.findings.length !== 1 ? "s" : "")}`);
                      }),
                      $$slots: { default: true }
                    });
                    $$renderer5.push(`<!----></div>`);
                    pop_element();
                    $$renderer5.push(`</div>`);
                    pop_element();
                    $$renderer5.push(` `);
                    Collapse($$renderer5, {
                      isOpen: expandedCommits.has(review.commit_hash),
                      children: prevent_snippet_stringification(($$renderer6) => {
                        $$renderer6.push(`<div class="mt-3">`);
                        push_element($$renderer6, "div", 1481, 28);
                        $$renderer6.push(`<p class="text-muted summary-text svelte-1u2kfow">`);
                        push_element($$renderer6, "p", 1482, 32);
                        $$renderer6.push(`${escape_html(review.summary)}</p>`);
                        pop_element();
                        $$renderer6.push(` `);
                        if (review.findings.length > 0) {
                          $$renderer6.push("<!--[-->");
                          $$renderer6.push(`<h6 class="mt-3 mb-2">`);
                          push_element($$renderer6, "h6", 1485, 36);
                          Icon($$renderer6, { name: "code-slash" });
                          $$renderer6.push(`<!----> Code Review Findings</h6>`);
                          pop_element();
                          $$renderer6.push(` `);
                          Table($$renderer6, {
                            bordered: true,
                            striped: true,
                            hover: true,
                            size: "sm",
                            class: "findings-table",
                            children: prevent_snippet_stringification(($$renderer7) => {
                              $$renderer7.push(`<thead>`);
                              push_element($$renderer7, "thead", 1487, 40);
                              $$renderer7.push(`<tr>`);
                              push_element($$renderer7, "tr", 1488, 44);
                              $$renderer7.push(`<th style="width: 100px">`);
                              push_element($$renderer7, "th", 1489, 48);
                              $$renderer7.push(`Severity</th>`);
                              pop_element();
                              $$renderer7.push(`<th style="width: 200px">`);
                              push_element($$renderer7, "th", 1490, 48);
                              $$renderer7.push(`File</th>`);
                              pop_element();
                              $$renderer7.push(`<th>`);
                              push_element($$renderer7, "th", 1491, 48);
                              $$renderer7.push(`Message</th>`);
                              pop_element();
                              $$renderer7.push(`</tr>`);
                              pop_element();
                              $$renderer7.push(`</thead>`);
                              pop_element();
                              $$renderer7.push(` <tbody>`);
                              push_element($$renderer7, "tbody", 1494, 40);
                              $$renderer7.push(`<!--[-->`);
                              const each_array_3 = ensure_array_like(review.findings);
                              for (let findingIdx = 0, $$length2 = each_array_3.length; findingIdx < $$length2; findingIdx++) {
                                let finding = each_array_3[findingIdx];
                                const findingId = `finding-${review.commit_hash}-${findingIdx}`;
                                $$renderer7.push(`<tr>`);
                                push_element($$renderer7, "tr", 1497, 48);
                                $$renderer7.push(`<td>`);
                                push_element($$renderer7, "td", 1498, 52);
                                Badge($$renderer7, {
                                  color: getSeverityColor(finding.severity),
                                  children: prevent_snippet_stringification(($$renderer8) => {
                                    $$renderer8.push(`<!---->${escape_html(finding.severity)}`);
                                  }),
                                  $$slots: { default: true }
                                });
                                $$renderer7.push(`<!----></td>`);
                                pop_element();
                                $$renderer7.push(`<td>`);
                                push_element($$renderer7, "td", 1503, 52);
                                $$renderer7.push(`<code class="file-path svelte-1u2kfow">`);
                                push_element($$renderer7, "code", 1503, 56);
                                $$renderer7.push(`${escape_html(finding.file)}</code>`);
                                pop_element();
                                $$renderer7.push(`</td>`);
                                pop_element();
                                $$renderer7.push(`<td>`);
                                push_element($$renderer7, "td", 1504, 52);
                                $$renderer7.push(`<div>`);
                                push_element($$renderer7, "div", 1505, 56);
                                $$renderer7.push(`${escape_html(finding.message)}</div>`);
                                pop_element();
                                $$renderer7.push(` `);
                                if (finding.solution) {
                                  $$renderer7.push("<!--[-->");
                                  $$renderer7.push(`<div class="mt-2">`);
                                  push_element($$renderer7, "div", 1507, 60);
                                  Button($$renderer7, {
                                    size: "sm",
                                    color: "info",
                                    outline: true,
                                    children: prevent_snippet_stringification(($$renderer8) => {
                                      Icon($$renderer8, {
                                        name: expandedSolutions.has(findingId) ? "chevron-up" : "chevron-down"
                                      });
                                      $$renderer8.push(`<!----> ${escape_html(expandedSolutions.has(findingId) ? "Hide" : "View")} Solution`);
                                    }),
                                    $$slots: { default: true }
                                  });
                                  $$renderer7.push(`<!----></div>`);
                                  pop_element();
                                  $$renderer7.push(` `);
                                  Collapse($$renderer7, {
                                    isOpen: expandedSolutions.has(findingId),
                                    children: prevent_snippet_stringification(($$renderer8) => {
                                      $$renderer8.push(`<div class="solution-box mt-2 svelte-1u2kfow">`);
                                      push_element($$renderer8, "div", 1519, 64);
                                      if (finding.original_code) {
                                        $$renderer8.push("<!--[-->");
                                        $$renderer8.push(`<div class="code-comparison svelte-1u2kfow">`);
                                        push_element($$renderer8, "div", 1521, 72);
                                        $$renderer8.push(`<div class="code-column svelte-1u2kfow">`);
                                        push_element($$renderer8, "div", 1522, 76);
                                        $$renderer8.push(`<div class="code-header original svelte-1u2kfow">`);
                                        push_element($$renderer8, "div", 1523, 80);
                                        Icon($$renderer8, { name: "x-circle" });
                                        $$renderer8.push(`<!----> Original Code</div>`);
                                        pop_element();
                                        $$renderer8.push(` <pre class="solution-code original-code svelte-1u2kfow">`);
                                        push_element($$renderer8, "pre", 1526, 80);
                                        $$renderer8.push(`${escape_html(finding.original_code)}</pre>`);
                                        pop_element();
                                        $$renderer8.push(`</div>`);
                                        pop_element();
                                        $$renderer8.push(` <div class="code-column svelte-1u2kfow">`);
                                        push_element($$renderer8, "div", 1528, 76);
                                        $$renderer8.push(`<div class="code-header fixed svelte-1u2kfow">`);
                                        push_element($$renderer8, "div", 1529, 80);
                                        Icon($$renderer8, { name: "check-circle" });
                                        $$renderer8.push(`<!----> Fixed Code</div>`);
                                        pop_element();
                                        $$renderer8.push(` <pre class="solution-code fixed-code svelte-1u2kfow">`);
                                        push_element($$renderer8, "pre", 1532, 80);
                                        $$renderer8.push(`${escape_html(finding.solution)}</pre>`);
                                        pop_element();
                                        $$renderer8.push(`</div>`);
                                        pop_element();
                                        $$renderer8.push(`</div>`);
                                        pop_element();
                                      } else {
                                        $$renderer8.push("<!--[!-->");
                                        $$renderer8.push(`<div class="solution-label svelte-1u2kfow">`);
                                        push_element($$renderer8, "div", 1536, 72);
                                        Icon($$renderer8, { name: "lightbulb-fill" });
                                        $$renderer8.push(`<!----> Suggested Fix:</div>`);
                                        pop_element();
                                        $$renderer8.push(` <pre class="solution-code svelte-1u2kfow">`);
                                        push_element($$renderer8, "pre", 1539, 72);
                                        $$renderer8.push(`${escape_html(finding.solution)}</pre>`);
                                        pop_element();
                                      }
                                      $$renderer8.push(`<!--]--></div>`);
                                      pop_element();
                                    }),
                                    $$slots: { default: true }
                                  });
                                  $$renderer7.push(`<!---->`);
                                } else {
                                  $$renderer7.push("<!--[!-->");
                                }
                                $$renderer7.push(`<!--]--> <div class="mt-2">`);
                                push_element($$renderer7, "div", 1544, 56);
                                Button($$renderer7, {
                                  size: "sm",
                                  color: "primary",
                                  outline: true,
                                  children: prevent_snippet_stringification(($$renderer8) => {
                                    Icon($$renderer8, {
                                      name: "chat-square-text"
                                    });
                                    $$renderer8.push(`<!----> Ask Chat`);
                                  }),
                                  $$slots: { default: true }
                                });
                                $$renderer7.push(`<!----></div>`);
                                pop_element();
                                $$renderer7.push(`</td>`);
                                pop_element();
                                $$renderer7.push(`</tr>`);
                                pop_element();
                              }
                              $$renderer7.push(`<!--]--></tbody>`);
                              pop_element();
                            }),
                            $$slots: { default: true }
                          });
                          $$renderer6.push(`<!---->`);
                        } else {
                          $$renderer6.push("<!--[!-->");
                          $$renderer6.push(`<p class="text-success">`);
                          push_element($$renderer6, "p", 1561, 36);
                          Icon($$renderer6, { name: "check-circle" });
                          $$renderer6.push(`<!----> No code review issues found!</p>`);
                          pop_element();
                        }
                        $$renderer6.push(`<!--]--> `);
                        if (review.security_summary) {
                          $$renderer6.push("<!--[-->");
                          $$renderer6.push(`<div class="security-section mt-4 svelte-1u2kfow">`);
                          push_element($$renderer6, "div", 1566, 36);
                          $$renderer6.push(`<h6 class="mb-2">`);
                          push_element($$renderer6, "h6", 1567, 40);
                          Icon($$renderer6, { name: "shield-exclamation" });
                          $$renderer6.push(`<!----> Security Analysis `);
                          Badge($$renderer6, {
                            color: getRiskLevelColor(review.security_summary.risk_level),
                            class: "ms-2",
                            children: prevent_snippet_stringification(($$renderer7) => {
                              $$renderer7.push(`<!---->${escape_html(review.security_summary.risk_level)} Risk`);
                            }),
                            $$slots: { default: true }
                          });
                          $$renderer6.push(`<!----></h6>`);
                          pop_element();
                          $$renderer6.push(` <div class="security-stats mb-3 svelte-1u2kfow">`);
                          push_element($$renderer6, "div", 1575, 40);
                          $$renderer6.push(`<span class="stat-item svelte-1u2kfow">`);
                          push_element($$renderer6, "span", 1576, 44);
                          Badge($$renderer6, {
                            color: "danger",
                            children: prevent_snippet_stringification(($$renderer7) => {
                              $$renderer7.push(`<!---->${escape_html(review.security_summary.critical_count)}`);
                            }),
                            $$slots: { default: true }
                          });
                          $$renderer6.push(`<!----> Critical</span>`);
                          pop_element();
                          $$renderer6.push(` <span class="stat-item svelte-1u2kfow">`);
                          push_element($$renderer6, "span", 1579, 44);
                          Badge($$renderer6, {
                            color: "danger",
                            children: prevent_snippet_stringification(($$renderer7) => {
                              $$renderer7.push(`<!---->${escape_html(review.security_summary.high_count)}`);
                            }),
                            $$slots: { default: true }
                          });
                          $$renderer6.push(`<!----> High</span>`);
                          pop_element();
                          $$renderer6.push(` <span class="stat-item svelte-1u2kfow">`);
                          push_element($$renderer6, "span", 1582, 44);
                          Badge($$renderer6, {
                            color: "warning",
                            children: prevent_snippet_stringification(($$renderer7) => {
                              $$renderer7.push(`<!---->${escape_html(review.security_summary.medium_count)}`);
                            }),
                            $$slots: { default: true }
                          });
                          $$renderer6.push(`<!----> Medium</span>`);
                          pop_element();
                          $$renderer6.push(` <span class="stat-item svelte-1u2kfow">`);
                          push_element($$renderer6, "span", 1585, 44);
                          Badge($$renderer6, {
                            color: "info",
                            children: prevent_snippet_stringification(($$renderer7) => {
                              $$renderer7.push(`<!---->${escape_html(review.security_summary.low_count)}`);
                            }),
                            $$slots: { default: true }
                          });
                          $$renderer6.push(`<!----> Low</span>`);
                          pop_element();
                          $$renderer6.push(`</div>`);
                          pop_element();
                          $$renderer6.push(` `);
                          if (review.security_summary.findings && review.security_summary.findings.length > 0) {
                            $$renderer6.push("<!--[-->");
                            Table($$renderer6, {
                              bordered: true,
                              striped: true,
                              hover: true,
                              size: "sm",
                              class: "security-table",
                              children: prevent_snippet_stringification(($$renderer7) => {
                                $$renderer7.push(`<thead>`);
                                push_element($$renderer7, "thead", 1592, 48);
                                $$renderer7.push(`<tr>`);
                                push_element($$renderer7, "tr", 1593, 52);
                                $$renderer7.push(`<th style="width: 90px">`);
                                push_element($$renderer7, "th", 1594, 56);
                                $$renderer7.push(`Severity</th>`);
                                pop_element();
                                $$renderer7.push(`<th style="width: 120px">`);
                                push_element($$renderer7, "th", 1595, 56);
                                $$renderer7.push(`Type</th>`);
                                pop_element();
                                $$renderer7.push(`<th style="width: 180px">`);
                                push_element($$renderer7, "th", 1596, 56);
                                $$renderer7.push(`File</th>`);
                                pop_element();
                                $$renderer7.push(`<th>`);
                                push_element($$renderer7, "th", 1597, 56);
                                $$renderer7.push(`Details</th>`);
                                pop_element();
                                $$renderer7.push(`</tr>`);
                                pop_element();
                                $$renderer7.push(`</thead>`);
                                pop_element();
                                $$renderer7.push(` <tbody>`);
                                push_element($$renderer7, "tbody", 1600, 48);
                                $$renderer7.push(`<!--[-->`);
                                const each_array_4 = ensure_array_like(review.security_summary.findings);
                                for (let secIdx = 0, $$length2 = each_array_4.length; secIdx < $$length2; secIdx++) {
                                  let secFinding = each_array_4[secIdx];
                                  const secFindingId = `sec-finding-${review.commit_hash}-${secIdx}`;
                                  $$renderer7.push(`<tr>`);
                                  push_element($$renderer7, "tr", 1603, 56);
                                  $$renderer7.push(`<td>`);
                                  push_element($$renderer7, "td", 1604, 60);
                                  Badge($$renderer7, {
                                    color: getSecuritySeverityColor(secFinding.severity),
                                    children: prevent_snippet_stringification(($$renderer8) => {
                                      $$renderer8.push(`<!---->${escape_html(secFinding.severity)}`);
                                    }),
                                    $$slots: { default: true }
                                  });
                                  $$renderer7.push(`<!----></td>`);
                                  pop_element();
                                  $$renderer7.push(`<td>`);
                                  push_element($$renderer7, "td", 1609, 60);
                                  $$renderer7.push(`<span class="finding-type svelte-1u2kfow">`);
                                  push_element($$renderer7, "span", 1609, 64);
                                  $$renderer7.push(`${escape_html(secFinding.finding_type)}</span>`);
                                  pop_element();
                                  $$renderer7.push(`</td>`);
                                  pop_element();
                                  $$renderer7.push(`<td>`);
                                  push_element($$renderer7, "td", 1610, 60);
                                  $$renderer7.push(`<code class="file-path svelte-1u2kfow">`);
                                  push_element($$renderer7, "code", 1611, 64);
                                  $$renderer7.push(`${escape_html(secFinding.file_path)}</code>`);
                                  pop_element();
                                  $$renderer7.push(` `);
                                  if (secFinding.line_number) {
                                    $$renderer7.push("<!--[-->");
                                    $$renderer7.push(`<span class="line-number svelte-1u2kfow">`);
                                    push_element($$renderer7, "span", 1613, 68);
                                    $$renderer7.push(`:${escape_html(secFinding.line_number)}</span>`);
                                    pop_element();
                                  } else {
                                    $$renderer7.push("<!--[!-->");
                                  }
                                  $$renderer7.push(`<!--]--></td>`);
                                  pop_element();
                                  $$renderer7.push(`<td>`);
                                  push_element($$renderer7, "td", 1616, 60);
                                  $$renderer7.push(`<strong>`);
                                  push_element($$renderer7, "strong", 1617, 64);
                                  $$renderer7.push(`${escape_html(secFinding.title)}</strong>`);
                                  pop_element();
                                  $$renderer7.push(` `);
                                  if (secFinding.cve_id) {
                                    $$renderer7.push("<!--[-->");
                                    Badge($$renderer7, {
                                      color: "dark",
                                      class: "ms-1",
                                      children: prevent_snippet_stringification(($$renderer8) => {
                                        $$renderer8.push(`<!---->${escape_html(secFinding.cve_id)}`);
                                      }),
                                      $$slots: { default: true }
                                    });
                                  } else {
                                    $$renderer7.push("<!--[!-->");
                                  }
                                  $$renderer7.push(`<!--]--> <p class="mb-1 mt-1 security-description svelte-1u2kfow">`);
                                  push_element($$renderer7, "p", 1621, 64);
                                  $$renderer7.push(`${escape_html(secFinding.description)}</p>`);
                                  pop_element();
                                  $$renderer7.push(` <small class="text-muted">`);
                                  push_element($$renderer7, "small", 1622, 64);
                                  Icon($$renderer7, { name: "lightbulb" });
                                  $$renderer7.push(`<!----> ${escape_html(secFinding.recommendation)}</small>`);
                                  pop_element();
                                  $$renderer7.push(` `);
                                  if (secFinding.solution) {
                                    $$renderer7.push("<!--[-->");
                                    $$renderer7.push(`<div class="mt-2">`);
                                    push_element($$renderer7, "div", 1624, 68);
                                    Button($$renderer7, {
                                      size: "sm",
                                      color: "info",
                                      outline: true,
                                      children: prevent_snippet_stringification(($$renderer8) => {
                                        Icon($$renderer8, {
                                          name: expandedSolutions.has(secFindingId) ? "chevron-up" : "chevron-down"
                                        });
                                        $$renderer8.push(`<!----> ${escape_html(expandedSolutions.has(secFindingId) ? "Hide" : "View")} Solution`);
                                      }),
                                      $$slots: { default: true }
                                    });
                                    $$renderer7.push(`<!----></div>`);
                                    pop_element();
                                    $$renderer7.push(` `);
                                    Collapse($$renderer7, {
                                      isOpen: expandedSolutions.has(secFindingId),
                                      children: prevent_snippet_stringification(($$renderer8) => {
                                        $$renderer8.push(`<div class="solution-box mt-2 svelte-1u2kfow">`);
                                        push_element($$renderer8, "div", 1636, 72);
                                        if (secFinding.original_code) {
                                          $$renderer8.push("<!--[-->");
                                          $$renderer8.push(`<div class="code-comparison svelte-1u2kfow">`);
                                          push_element($$renderer8, "div", 1638, 80);
                                          $$renderer8.push(`<div class="code-column svelte-1u2kfow">`);
                                          push_element($$renderer8, "div", 1639, 84);
                                          $$renderer8.push(`<div class="code-header original svelte-1u2kfow">`);
                                          push_element($$renderer8, "div", 1640, 88);
                                          Icon($$renderer8, { name: "x-circle" });
                                          $$renderer8.push(`<!----> Original Code</div>`);
                                          pop_element();
                                          $$renderer8.push(` <pre class="solution-code original-code svelte-1u2kfow">`);
                                          push_element($$renderer8, "pre", 1643, 88);
                                          $$renderer8.push(`${escape_html(secFinding.original_code)}</pre>`);
                                          pop_element();
                                          $$renderer8.push(`</div>`);
                                          pop_element();
                                          $$renderer8.push(` <div class="code-column svelte-1u2kfow">`);
                                          push_element($$renderer8, "div", 1645, 84);
                                          $$renderer8.push(`<div class="code-header fixed svelte-1u2kfow">`);
                                          push_element($$renderer8, "div", 1646, 88);
                                          Icon($$renderer8, { name: "check-circle" });
                                          $$renderer8.push(`<!----> Fixed Code</div>`);
                                          pop_element();
                                          $$renderer8.push(` <pre class="solution-code fixed-code svelte-1u2kfow">`);
                                          push_element($$renderer8, "pre", 1649, 88);
                                          $$renderer8.push(`${escape_html(secFinding.solution)}</pre>`);
                                          pop_element();
                                          $$renderer8.push(`</div>`);
                                          pop_element();
                                          $$renderer8.push(`</div>`);
                                          pop_element();
                                        } else {
                                          $$renderer8.push("<!--[!-->");
                                          $$renderer8.push(`<div class="solution-label svelte-1u2kfow">`);
                                          push_element($$renderer8, "div", 1653, 80);
                                          Icon($$renderer8, { name: "lightbulb-fill" });
                                          $$renderer8.push(`<!----> Suggested Fix:</div>`);
                                          pop_element();
                                          $$renderer8.push(` <pre class="solution-code svelte-1u2kfow">`);
                                          push_element($$renderer8, "pre", 1656, 80);
                                          $$renderer8.push(`${escape_html(secFinding.solution)}</pre>`);
                                          pop_element();
                                        }
                                        $$renderer8.push(`<!--]--></div>`);
                                        pop_element();
                                      }),
                                      $$slots: { default: true }
                                    });
                                    $$renderer7.push(`<!---->`);
                                  } else {
                                    $$renderer7.push("<!--[!-->");
                                  }
                                  $$renderer7.push(`<!--]--> <div class="mt-2">`);
                                  push_element($$renderer7, "div", 1661, 64);
                                  Button($$renderer7, {
                                    size: "sm",
                                    color: "primary",
                                    outline: true,
                                    children: prevent_snippet_stringification(($$renderer8) => {
                                      Icon($$renderer8, {
                                        name: "chat-square-text"
                                      });
                                      $$renderer8.push(`<!----> Ask Chat`);
                                    }),
                                    $$slots: { default: true }
                                  });
                                  $$renderer7.push(`<!----></div>`);
                                  pop_element();
                                  $$renderer7.push(`</td>`);
                                  pop_element();
                                  $$renderer7.push(`</tr>`);
                                  pop_element();
                                }
                                $$renderer7.push(`<!--]--></tbody>`);
                                pop_element();
                              }),
                              $$slots: { default: true }
                            });
                          } else {
                            $$renderer6.push("<!--[!-->");
                            $$renderer6.push(`<p class="text-success">`);
                            push_element($$renderer6, "p", 1678, 44);
                            Icon($$renderer6, { name: "shield-check" });
                            $$renderer6.push(`<!----> No security vulnerabilities detected!</p>`);
                            pop_element();
                          }
                          $$renderer6.push(`<!--]--></div>`);
                          pop_element();
                        } else {
                          $$renderer6.push("<!--[!-->");
                        }
                        $$renderer6.push(`<!--]--></div>`);
                        pop_element();
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
          $$renderer3.push(`<!--]--></div>`);
          pop_element();
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> <div${attr_class(`chat-drawer-backdrop ${""}`, "svelte-1u2kfow")}>`);
        push_element($$renderer3, "div", 1690, 4);
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` <aside${attr_class(`finding-chat-drawer ${""}`, "svelte-1u2kfow")}>`);
        push_element($$renderer3, "aside", 1691, 4);
        {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></aside>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      if ($$store_subs) unsubscribe_stores($$store_subs);
    },
    CodeReview
  );
}
CodeReview.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(app)/codereview/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      CodeReview($$renderer2);
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
