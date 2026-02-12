import { d as attr_class, c as bind_props, f as stringify, b as attr, g as attr_style, p as prevent_snippet_stringification, e as ensure_array_like, h as head } from "../../../chunks/index2.js";
import { p as push_element, a as pop_element } from "../../../chunks/dev.js";
import { a3 as FILENAME } from "../../../chunks/utils2.js";
import { B as Button } from "../../../chunks/Tooltip.js";
import { e as escape_html } from "../../../chunks/context.js";
import { a as cart } from "../../../chunks/cartStore.js";
import { t as toasts } from "../../../chunks/toastStore.js";
import { A as AgentsTab } from "../../../chunks/AgentsTab.js";
import "clsx";
TabNavigation[FILENAME] = "src/lib/components/navigation/TabNavigation.svelte";
function TabNavigation($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let activeTab = $$props["activeTab"];
      let onTabChange = $$props["onTabChange"];
      $$renderer2.push(`<div class="tabs-overlap svelte-4byi4s">`);
      push_element($$renderer2, "div", 9, 0);
      $$renderer2.push(`<ul class="nav nav-tabs justify-content-center mb-4 svelte-4byi4s">`);
      push_element($$renderer2, "ul", 10, 1);
      $$renderer2.push(`<li class="nav-item">`);
      push_element($$renderer2, "li", 11, 2);
      $$renderer2.push(`<button type="button"${attr_class(`nav-link ${stringify(activeTab === "apps" ? "active" : "")}`, "svelte-4byi4s")}>`);
      push_element($$renderer2, "button", 12, 3);
      $$renderer2.push(`<i class="bi bi-grid-fill me-2">`);
      push_element($$renderer2, "i", 17, 4);
      $$renderer2.push(`</i>`);
      pop_element();
      $$renderer2.push(`AI Workflows</button>`);
      pop_element();
      $$renderer2.push(`</li>`);
      pop_element();
      $$renderer2.push(` <li class="nav-item">`);
      push_element($$renderer2, "li", 20, 2);
      $$renderer2.push(`<button type="button"${attr_class(`nav-link ${stringify(activeTab === "agents" ? "active" : "")}`, "svelte-4byi4s")}>`);
      push_element($$renderer2, "button", 21, 3);
      $$renderer2.push(`<i class="bi bi-person-lines-fill me-2">`);
      push_element($$renderer2, "i", 26, 4);
      $$renderer2.push(`</i>`);
      pop_element();
      $$renderer2.push(`AI Agents</button>`);
      pop_element();
      $$renderer2.push(`</li>`);
      pop_element();
      $$renderer2.push(` <li class="nav-item">`);
      push_element($$renderer2, "li", 29, 2);
      $$renderer2.push(`<button type="button"${attr_class(`nav-link ${stringify(activeTab === "apis" ? "active" : "")}`, "svelte-4byi4s")}>`);
      push_element($$renderer2, "button", 30, 3);
      $$renderer2.push(`<i class="bi bi-hdd-stack-fill me-2">`);
      push_element($$renderer2, "i", 35, 4);
      $$renderer2.push(`</i>`);
      pop_element();
      $$renderer2.push(`AI APIs</button>`);
      pop_element();
      $$renderer2.push(`</li>`);
      pop_element();
      $$renderer2.push(`</ul>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      bind_props($$props, { activeTab, onTabChange });
    },
    TabNavigation
  );
}
TabNavigation.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
AppCard[FILENAME] = "src/lib/components/ui/AppCard.svelte";
function AppCard($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let app = $$props["app"];
      let onAddToCart = $$props["onAddToCart"];
      $$renderer2.push(`<div class="col-12 col-sm-6 col-lg-4">`);
      push_element($$renderer2, "div", 6, 0);
      $$renderer2.push(`<a${attr("href", app.route)} class="text-decoration-none">`);
      push_element($$renderer2, "a", 7, 1);
      $$renderer2.push(`<div class="app-card position-relative overflow-hidden rounded shadow-lg bg-dark-gray svelte-wxcsyc"${attr_style(`height: 26rem; background-image: url('${stringify(app.image)}'); background-size: cover; background-position: center;`)}>`);
      push_element($$renderer2, "div", 8, 2);
      $$renderer2.push(`<div class="d-flex flex-column justify-content-between p-3 text-white bg-dark bg-opacity-50 h-100 w-100">`);
      push_element($$renderer2, "div", 9, 3);
      $$renderer2.push(`<div class="app-badges svelte-wxcsyc">`);
      push_element($$renderer2, "div", 10, 4);
      if (app.price !== null) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="badge bg-primary mb-2">`);
        push_element($$renderer2, "span", 12, 6);
        $$renderer2.push(`$${escape_html(app.price.toFixed(2))}</span>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<span class="badge bg-info mb-2">`);
        push_element($$renderer2, "span", 14, 6);
        $$renderer2.push(`Contact for Pricing</span>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 17, 4);
      $$renderer2.push(`<h4>`);
      push_element($$renderer2, "h4", 18, 5);
      $$renderer2.push(`${escape_html(app.name)}</h4>`);
      pop_element();
      $$renderer2.push(` <p class="mb-2">`);
      push_element($$renderer2, "p", 19, 5);
      $$renderer2.push(`${escape_html(app.description)}</p>`);
      pop_element();
      $$renderer2.push(` <div class="d-flex gap-2">`);
      push_element($$renderer2, "div", 20, 5);
      Button($$renderer2, {
        color: "success",
        size: "sm",
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<i class="bi bi-cart-plus-fill me-1">`);
          push_element($$renderer3, "i", 22, 7);
          $$renderer3.push(`</i>`);
          pop_element();
          $$renderer3.push(`Add to Cart`);
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
      $$renderer2.push(`</a>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      bind_props($$props, { app, onAddToCart });
    },
    AppCard
  );
}
AppCard.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
const apps = [
  {
    id: "documentinsights",
    name: "Document Insights",
    price: null,
    image: "/images/documentInsights.png",
    route: "/documentinsights",
    description: "Analyze and extract insights from documents"
  },
  {
    id: "memberinsights",
    name: "Member Insights",
    price: null,
    image: "/images/memberInsights.png",
    route: "/memberinsights",
    description: "Understand your community better"
  },
  {
    id: "sqlconvert",
    name: "SQL Convert",
    price: null,
    image: "images/sqlconvert.png",
    route: "/code/convert",
    description: "Convert SQL between different dialects"
  },
  {
    id: "databaseinsights",
    name: "Database Insights",
    price: null,
    image: "/images/databaseInsights.png",
    route: "/databaseinsights",
    description: "Get powerful insights from your database"
  },
  {
    id: "webinsights",
    name: "Web Insights",
    price: null,
    image: "/images/webinsights.png",
    route: "/webinsights",
    description: "Analyze web content and get valuable insights"
  },
  {
    id: "codeinsights",
    name: "Code Insights",
    price: null,
    image: "images/codeInsights.png",
    route: "/code/insights",
    description: "Use codeInsights reports to remediate custom code"
  },
  {
    id: "graphUI",
    name: "Agent Graph Generator",
    price: null,
    image: "images/graphUI.png",
    route: "/jsonParser",
    description: "Use graphs to create node based diagrams"
  },
  {
    id: "codereview",
    name: "Code Review",
    price: null,
    image: "images/codeInsights.png",
    route: "/codereview",
    description: "Analyze Git commits with AI-powered insights"
  }
];
AppsTab[FILENAME] = "src/lib/components/navigation/AppsTab.svelte";
function AppsTab($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      function addToCart(app) {
        cart.addItem(app);
        toasts.push({
          message: `${app.name} added to cart!`,
          color: "success",
          header: "Added to Cart"
        });
      }
      $$renderer2.push(`<div class="tab-pane fade show active">`);
      push_element($$renderer2, "div", 15, 0);
      $$renderer2.push(`<div class="row g-4">`);
      push_element($$renderer2, "div", 16, 1);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(apps);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let app = each_array[$$index];
        AppCard($$renderer2, { app, onAddToCart: addToCart });
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
    },
    AppsTab
  );
}
AppsTab.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
ApisTab[FILENAME] = "src/lib/components/navigation/ApisTab.svelte";
function ApisTab($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      $$renderer2.push(`<div class="tab-pane fade show active text-center py-5">`);
      push_element($$renderer2, "div", 1, 0);
      $$renderer2.push(`<h4>`);
      push_element($$renderer2, "h4", 2, 1);
      $$renderer2.push(`APIs</h4>`);
      pop_element();
      $$renderer2.push(` <table class="table table-bordered text-center">`);
      push_element($$renderer2, "table", 3, 1);
      $$renderer2.push(`<thead class="table-light">`);
      push_element($$renderer2, "thead", 4, 2);
      $$renderer2.push(`<tr>`);
      push_element($$renderer2, "tr", 5, 3);
      $$renderer2.push(`<th>`);
      push_element($$renderer2, "th", 6, 4);
      $$renderer2.push(`API Name</th>`);
      pop_element();
      $$renderer2.push(`<th>`);
      push_element($$renderer2, "th", 7, 4);
      $$renderer2.push(`Documentation Link</th>`);
      pop_element();
      $$renderer2.push(`</tr>`);
      pop_element();
      $$renderer2.push(`</thead>`);
      pop_element();
      $$renderer2.push(`<tbody>`);
      push_element($$renderer2, "tbody", 10, 2);
      $$renderer2.push(`<tr>`);
      push_element($$renderer2, "tr", 11, 3);
      $$renderer2.push(`<td>`);
      push_element($$renderer2, "td", 12, 4);
      $$renderer2.push(`Code Insights</td>`);
      pop_element();
      $$renderer2.push(`<td>`);
      push_element($$renderer2, "td", 13, 4);
      $$renderer2.push(`<a href="https://hpcsiaipoc-codeinsights.azurewebsites.net/docs" target="_blank" class="btn btn-primary">`);
      push_element($$renderer2, "a", 14, 5);
      $$renderer2.push(`<i class="bi bi-link-45deg me-2">`);
      push_element($$renderer2, "i", 15, 6);
      $$renderer2.push(`</i>`);
      pop_element();
      $$renderer2.push(`View Docs</a>`);
      pop_element();
      $$renderer2.push(`</td>`);
      pop_element();
      $$renderer2.push(`</tr>`);
      pop_element();
      $$renderer2.push(`<tr>`);
      push_element($$renderer2, "tr", 19, 3);
      $$renderer2.push(`<td>`);
      push_element($$renderer2, "td", 20, 4);
      $$renderer2.push(`Document Insights</td>`);
      pop_element();
      $$renderer2.push(`<td>`);
      push_element($$renderer2, "td", 21, 4);
      $$renderer2.push(`<a href="https://hpcsiaipoc-document-insights.azurewebsites.net/docs" target="_blank" class="btn btn-primary">`);
      push_element($$renderer2, "a", 22, 5);
      $$renderer2.push(`<i class="bi bi-link-45deg me-2">`);
      push_element($$renderer2, "i", 23, 6);
      $$renderer2.push(`</i>`);
      pop_element();
      $$renderer2.push(`View Docs</a>`);
      pop_element();
      $$renderer2.push(`</td>`);
      pop_element();
      $$renderer2.push(`</tr>`);
      pop_element();
      $$renderer2.push(`<tr>`);
      push_element($$renderer2, "tr", 27, 3);
      $$renderer2.push(`<td>`);
      push_element($$renderer2, "td", 28, 4);
      $$renderer2.push(`Code Review</td>`);
      pop_element();
      $$renderer2.push(`<td>`);
      push_element($$renderer2, "td", 29, 4);
      $$renderer2.push(`<a href="https://hpcsiaipoc-codereview.azurewebsites.net/docs" target="_blank" class="btn btn-primary">`);
      push_element($$renderer2, "a", 30, 5);
      $$renderer2.push(`<i class="bi bi-link-45deg me-2">`);
      push_element($$renderer2, "i", 31, 6);
      $$renderer2.push(`</i>`);
      pop_element();
      $$renderer2.push(`View Docs</a>`);
      pop_element();
      $$renderer2.push(`</td>`);
      pop_element();
      $$renderer2.push(`</tr>`);
      pop_element();
      $$renderer2.push(`<tr>`);
      push_element($$renderer2, "tr", 35, 3);
      $$renderer2.push(`<td>`);
      push_element($$renderer2, "td", 36, 4);
      $$renderer2.push(`SQL Convert</td>`);
      pop_element();
      $$renderer2.push(`<td>`);
      push_element($$renderer2, "td", 37, 4);
      $$renderer2.push(`<a href="https://hpcsiaipoc-codeconvert.azurewebsites.net/docs" target="_blank" class="btn btn-primary">`);
      push_element($$renderer2, "a", 38, 5);
      $$renderer2.push(`<i class="bi bi-link-45deg me-2">`);
      push_element($$renderer2, "i", 39, 6);
      $$renderer2.push(`</i>`);
      pop_element();
      $$renderer2.push(`View Docs</a>`);
      pop_element();
      $$renderer2.push(`</td>`);
      pop_element();
      $$renderer2.push(`</tr>`);
      pop_element();
      $$renderer2.push(`<tr>`);
      push_element($$renderer2, "tr", 42, 11);
      $$renderer2.push(`<td>`);
      push_element($$renderer2, "td", 43, 4);
      $$renderer2.push(`Member Insights</td>`);
      pop_element();
      $$renderer2.push(`<td>`);
      push_element($$renderer2, "td", 44, 4);
      $$renderer2.push(`<button type="button" class="btn btn-secondary disabled">`);
      push_element($$renderer2, "button", 45, 5);
      $$renderer2.push(`<i class="bi bi-link-45deg me-2">`);
      push_element($$renderer2, "i", 46, 6);
      $$renderer2.push(`</i>`);
      pop_element();
      $$renderer2.push(`Coming Soon</button>`);
      pop_element();
      $$renderer2.push(`</td>`);
      pop_element();
      $$renderer2.push(`</tr>`);
      pop_element();
      $$renderer2.push(`<tr>`);
      push_element($$renderer2, "tr", 50, 3);
      $$renderer2.push(`<td>`);
      push_element($$renderer2, "td", 51, 4);
      $$renderer2.push(`Database Insights</td>`);
      pop_element();
      $$renderer2.push(`<td>`);
      push_element($$renderer2, "td", 52, 4);
      $$renderer2.push(`<button type="button" class="btn btn-secondary disabled">`);
      push_element($$renderer2, "button", 53, 5);
      $$renderer2.push(`<i class="bi bi-link-45deg me-2">`);
      push_element($$renderer2, "i", 54, 6);
      $$renderer2.push(`</i>`);
      pop_element();
      $$renderer2.push(`Coming Soon</button>`);
      pop_element();
      $$renderer2.push(`</td>`);
      pop_element();
      $$renderer2.push(`</tr>`);
      pop_element();
      $$renderer2.push(`<tr>`);
      push_element($$renderer2, "tr", 58, 3);
      $$renderer2.push(`<td>`);
      push_element($$renderer2, "td", 59, 4);
      $$renderer2.push(`Web Insights</td>`);
      pop_element();
      $$renderer2.push(`<td>`);
      push_element($$renderer2, "td", 60, 4);
      $$renderer2.push(`<button type="button" class="btn btn-secondary disabled">`);
      push_element($$renderer2, "button", 61, 5);
      $$renderer2.push(`<i class="bi bi-link-45deg me-2">`);
      push_element($$renderer2, "i", 62, 6);
      $$renderer2.push(`</i>`);
      pop_element();
      $$renderer2.push(`Coming Soon</button>`);
      pop_element();
      $$renderer2.push(`</td>`);
      pop_element();
      $$renderer2.push(`</tr>`);
      pop_element();
      $$renderer2.push(`</tbody>`);
      pop_element();
      $$renderer2.push(`</table>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
    },
    ApisTab
  );
}
ApisTab.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(app)/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let activeTab = "apps";
      function handleTabChange(tab) {
        activeTab = tab;
      }
      head("h7bcrl", $$renderer2, ($$renderer3) => {
        $$renderer3.push(`<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>`);
        push_element($$renderer3, "link", 85, 1);
        pop_element();
        $$renderer3.push(` <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"/>`);
        push_element($$renderer3, "link", 86, 1);
        pop_element();
      });
      $$renderer2.push(`<section class="hero d-flex flex-column justify-content-center align-items-center text-center py-5 text-white svelte-h7bcrl">`);
      push_element($$renderer2, "section", 38, 0);
      $$renderer2.push(`<h1 class="display-3 mb-3 animate__animated animate__fadeInDown">`);
      push_element($$renderer2, "h1", 39, 1);
      $$renderer2.push(`Welcome to <img src="/images/champLogo2.png" alt="CHAMP" class="mx-1" style="height: 76px; width: auto; border-radius: 8px;" title="AI Marketplace"/>`);
      push_element($$renderer2, "img", 40, 13);
      pop_element();
      $$renderer2.push(`</h1>`);
      pop_element();
      $$renderer2.push(` <p class="lead mb-4 animate__animated animate__fadeInUp">`);
      push_element($$renderer2, "p", 42, 1);
      $$renderer2.push(`Explore powerful AI apps designed to boost your business</p>`);
      pop_element();
      $$renderer2.push(` `);
      Button($$renderer2, {
        color: "primary",
        size: "lg",
        class: "animate__animated animate__fadeInUp",
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<!---->Explore Content`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></section>`);
      pop_element();
      $$renderer2.push(` <section id="tabbed-content-section" class="container my-5">`);
      push_element($$renderer2, "section", 46, 0);
      TabNavigation($$renderer2, { activeTab, onTabChange: handleTabChange });
      $$renderer2.push(`<!----> <div class="tab-content">`);
      push_element($$renderer2, "div", 48, 1);
      if (activeTab === "apps") {
        $$renderer2.push("<!--[-->");
        AppsTab($$renderer2);
      } else if (activeTab === "agents") {
        $$renderer2.push("<!--[1-->");
        AgentsTab($$renderer2);
      } else if (activeTab === "apis") {
        $$renderer2.push("<!--[2-->");
        ApisTab($$renderer2);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</section>`);
      pop_element();
      $$renderer2.push(` <footer class="footer bg-dark text-white py-4 mt-5">`);
      push_element($$renderer2, "footer", 59, 0);
      $$renderer2.push(`<div class="container text-center">`);
      push_element($$renderer2, "div", 60, 1);
      $$renderer2.push(`<div class="mb-2">`);
      push_element($$renderer2, "div", 61, 2);
      $$renderer2.push(`<img src="/images/champLogo2.png" alt="CHAMP" style="height: 40px; width: auto; border-radius: 6px;"/>`);
      push_element($$renderer2, "img", 62, 3);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 64, 2);
      $$renderer2.push(`<small>`);
      push_element($$renderer2, "small", 65, 3);
      $$renderer2.push(`© ${escape_html((/* @__PURE__ */ new Date()).getFullYear())} CHAMP AI Marketplace. All rights reserved.</small>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="mt-2">`);
      push_element($$renderer2, "div", 67, 2);
      $$renderer2.push(`<a href="#apps" class="text-white me-3 svelte-h7bcrl">`);
      push_element($$renderer2, "a", 68, 3);
      $$renderer2.push(`Apps</a>`);
      pop_element();
      $$renderer2.push(` <a href="#agents" class="text-white me-3 svelte-h7bcrl">`);
      push_element($$renderer2, "a", 69, 3);
      $$renderer2.push(`Agents</a>`);
      pop_element();
      $$renderer2.push(` <a href="#apis" class="text-white svelte-h7bcrl">`);
      push_element($$renderer2, "a", 70, 3);
      $$renderer2.push(`APIs</a>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</footer>`);
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
