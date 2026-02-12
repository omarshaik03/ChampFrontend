import { p as prevent_snippet_stringification, e as ensure_array_like, a as store_get, b as attr, u as unsubscribe_stores, c as bind_props, s as slot } from "../../../chunks/index2.js";
/* empty css                  */
import { u as userStore } from "../../../chunks/userStore.js";
import { a4 as fallback, a3 as FILENAME } from "../../../chunks/utils2.js";
import { p as push_element, a as pop_element } from "../../../chunks/dev.js";
import { N as Navbar$1, a as NavbarBrand, b as Nav, c as NavItem, I as Icon, D as Dropdown, d as DropdownToggle, e as DropdownMenu, f as DropdownItem, B as Button, T as Tooltip } from "../../../chunks/Tooltip.js";
import "../../../chunks/client.js";
import { c as cartCount, a as cart } from "../../../chunks/cartStore.js";
import { e as escape_html } from "../../../chunks/context.js";
import { T as ToastNotifications } from "../../../chunks/ToastNotifications.js";
const APPS = {
  Home: {
    alias: "Home",
    route: "/"
  },
  Profile: {
    alias: "Profile",
    route: "/auth/profile"
  },
  CodeConvert: {
    alias: "Code Conversion",
    route: "/code/convert"
  },
  CodeInsights: {
    alias: "Code Insights",
    route: "/code/insights"
  },
  DatabaseInsights: {
    alias: "Database Insights",
    route: "/databaseinsights"
  },
  DocumentInsights: {
    alias: "Document Insights",
    route: "/documentinsights"
  },
  "DocumentInights(CrewAI)": {
    alias: "Document Insights (CrewAI)",
    route: "/documentinsights/crewai"
  },
  WebInsights: {
    alias: "Web Insights",
    route: "/webinsights"
  },
  MemberInsights: {
    alias: "Member Insights",
    route: "/memberinsights"
  },
  // CodeReview: {
  //     alias: "Code Review",
  //     route: "/codereview"
  // },
  Admin: {
    alias: "Admin",
    route: "/admin"
  }
};
Navbar[FILENAME] = "src/components/common/navbar.svelte";
function Navbar($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      let allowedApps = fallback($$props["allowedApps"], () => [], true);
      let authenticated = fallback($$props["authenticated"], false);
      let currentApp = fallback($$props["currentApp"], "Home");
      let appAlias = fallback($$props["appAlias"], "No App Selected");
      let userName = fallback($$props["userName"], "User");
      function isAppAccessible(appName, allowedApps2 = []) {
        return authenticated && allowedApps2.includes(appName);
      }
      function getAppIcon(appName) {
        switch (appName) {
          case "Home":
            return "house-door";
          case "Profile":
            return "person-circle";
          case "CodeInsights":
          case "CodeConvert":
            return "code-slash";
          case "SQLConvert":
            return "code-square";
          case "DocumentInsights":
          case "DocumentInights(CrewAI)":
            return "file-earmark-text";
          case "DatabaseInsights":
            return "database";
          case "WebInsights":
            return "globe";
          case "MemberInsights":
            return "people";
          default:
            return "app";
        }
      }
      Navbar$1($$renderer2, {
        dark: true,
        color: "dark",
        expand: "md",
        class: "shadow-lg py-2 bg-dark",
        children: prevent_snippet_stringification(($$renderer3) => {
          NavbarBrand($$renderer3, {
            href: "/",
            class: "d-flex align-items-center",
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<img src="/images/CognizantLogoWhite.png" alt="Cognizant" class="mx-1" style="height: 50px; width: auto;" title="Cognizant"/>`);
              push_element($$renderer4, "img", 49, 2);
              pop_element();
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Nav($$renderer3, {
            class: "ml-auto d-flex gap-3",
            navbar: true,
            children: prevent_snippet_stringification(($$renderer4) => {
              if (authenticated) {
                $$renderer4.push("<!--[-->");
                NavItem($$renderer4, {
                  class: "d-flex align-items-center",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    $$renderer5.push(`<div class="d-flex align-items-center px-3 text-light">`);
                    push_element($$renderer5, "div", 54, 4);
                    Icon($$renderer5, { name: "person-circle", class: "me-2 fs-5" });
                    $$renderer5.push(`<!----> <span>`);
                    push_element($$renderer5, "span", 56, 5);
                    $$renderer5.push(`Welcome, ${escape_html(userName)}</span>`);
                    pop_element();
                    $$renderer5.push(`</div>`);
                    pop_element();
                  }),
                  $$slots: { default: true }
                });
              } else {
                $$renderer4.push("<!--[!-->");
              }
              $$renderer4.push(`<!--]--> `);
              NavItem($$renderer4, {
                class: "d-flex align-items-center",
                children: prevent_snippet_stringification(($$renderer5) => {
                  Dropdown($$renderer5, {
                    theme: "light",
                    direction: "down",
                    children: prevent_snippet_stringification(($$renderer6) => {
                      DropdownToggle($$renderer6, {
                        color: "light",
                        caret: true,
                        children: prevent_snippet_stringification(($$renderer7) => {
                          Icon($$renderer7, { name: "grid-3x3-gap", class: "me-1" });
                          $$renderer7.push(`<!----> ${escape_html(appAlias)}`);
                        }),
                        $$slots: { default: true }
                      });
                      $$renderer6.push(`<!----> `);
                      DropdownMenu($$renderer6, {
                        children: prevent_snippet_stringification(($$renderer7) => {
                          if (authenticated) {
                            $$renderer7.push("<!--[-->");
                            $$renderer7.push(`<!--[-->`);
                            const each_array = ensure_array_like(Object.keys(APPS));
                            for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                              let app = each_array[$$index];
                              if (isAppAccessible(app, allowedApps)) {
                                $$renderer7.push("<!--[-->");
                                DropdownItem($$renderer7, {
                                  children: prevent_snippet_stringification(($$renderer8) => {
                                    Icon($$renderer8, { name: getAppIcon(app), class: "me-2" });
                                    $$renderer8.push(`<!----> ${escape_html(APPS[app].alias)}`);
                                  }),
                                  $$slots: { default: true }
                                });
                              } else {
                                $$renderer7.push("<!--[!-->");
                                DropdownItem($$renderer7, {
                                  disabled: true,
                                  class: "text-muted",
                                  children: prevent_snippet_stringification(($$renderer8) => {
                                    Icon($$renderer8, { name: getAppIcon(app), class: "me-2" });
                                    $$renderer8.push(`<!----> <span>`);
                                    push_element($$renderer8, "span", 78, 9);
                                    $$renderer8.push(`${escape_html(APPS[app].alias)}</span>`);
                                    pop_element();
                                    $$renderer8.push(` <small class="ms-2">`);
                                    push_element($$renderer8, "small", 79, 9);
                                    $$renderer8.push(`(No Access)</small>`);
                                    pop_element();
                                  }),
                                  $$slots: { default: true }
                                });
                              }
                              $$renderer7.push(`<!--]-->`);
                            }
                            $$renderer7.push(`<!--]-->`);
                          } else {
                            $$renderer7.push("<!--[!-->");
                            DropdownItem($$renderer7, {
                              disabled: true,
                              class: "text-muted",
                              children: prevent_snippet_stringification(($$renderer8) => {
                                Icon($$renderer8, { name: "lock", class: "me-2" });
                                $$renderer8.push(`<!----> <span>`);
                                push_element($$renderer8, "span", 86, 7);
                                $$renderer8.push(`Please log in to access apps</span>`);
                                pop_element();
                              }),
                              $$slots: { default: true }
                            });
                            $$renderer7.push(`<!----> <!--[-->`);
                            const each_array_1 = ensure_array_like(Object.keys(APPS));
                            for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
                              let app = each_array_1[$$index_1];
                              DropdownItem($$renderer7, {
                                disabled: true,
                                class: "text-muted",
                                children: prevent_snippet_stringification(($$renderer8) => {
                                  Icon($$renderer8, { name: getAppIcon(app), class: "me-2" });
                                  $$renderer8.push(`<!----> <span>`);
                                  push_element($$renderer8, "span", 91, 8);
                                  $$renderer8.push(`${escape_html(APPS[app].alias)}</span>`);
                                  pop_element();
                                }),
                                $$slots: { default: true }
                              });
                            }
                            $$renderer7.push(`<!--]-->`);
                          }
                          $$renderer7.push(`<!--]-->`);
                        }),
                        $$slots: { default: true }
                      });
                      $$renderer6.push(`<!---->`);
                    }),
                    $$slots: { default: true }
                  });
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              if (authenticated) {
                $$renderer4.push("<!--[-->");
                NavItem($$renderer4, {
                  class: "d-flex align-items-center",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    $$renderer5.push(`<a href="/auth/profile">`);
                    push_element($$renderer5, "a", 101, 4);
                    Button($$renderer5, {
                      color: "outline-light",
                      children: prevent_snippet_stringification(($$renderer6) => {
                        Icon($$renderer6, { name: "person-badge", class: "me-1" });
                        $$renderer6.push(`<!----> My Profile`);
                      }),
                      $$slots: { default: true }
                    });
                    $$renderer5.push(`<!----></a>`);
                    pop_element();
                  }),
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!----> `);
                NavItem($$renderer4, {
                  class: "d-flex align-items-center",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    Button($$renderer5, {
                      color: "outline-light",
                      children: prevent_snippet_stringification(($$renderer6) => {
                        Icon($$renderer6, { name: "box-arrow-right", class: "me-1" });
                        $$renderer6.push(`<!----> Logout`);
                      }),
                      $$slots: { default: true }
                    });
                  }),
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!---->`);
              } else {
                $$renderer4.push("<!--[!-->");
                NavItem($$renderer4, {
                  class: "d-flex align-items-center",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    Button($$renderer5, {
                      class: "login-btn",
                      style: "background-color: #6c757d; border: none; color: #fff; transition: background-color 0.3s ease;",
                      href: "/auth/login",
                      children: prevent_snippet_stringification(($$renderer6) => {
                        Icon($$renderer6, { name: "box-arrow-in-right", class: "me-1" });
                        $$renderer6.push(`<!----> Login`);
                      }),
                      $$slots: { default: true }
                    });
                  }),
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!----> `);
                NavItem($$renderer4, {
                  class: "d-flex align-items-center",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    Button($$renderer5, {
                      color: "outline-light",
                      href: "/auth/signup",
                      children: prevent_snippet_stringification(($$renderer6) => {
                        Icon($$renderer6, { name: "person-plus", class: "me-1" });
                        $$renderer6.push(`<!----> Register`);
                      }),
                      $$slots: { default: true }
                    });
                  }),
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!---->`);
              }
              $$renderer4.push(`<!--]--> `);
              NavItem($$renderer4, {
                class: "d-flex align-items-center me-2",
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<div class="cart-dropdown svelte-13b8zdw">`);
                  push_element($$renderer5, "div", 135, 3);
                  $$renderer5.push(`<a href="/cart" class="position-relative cart-icon">`);
                  push_element($$renderer5, "a", 136, 4);
                  Button($$renderer5, {
                    color: "outline-light",
                    children: prevent_snippet_stringification(($$renderer6) => {
                      Icon($$renderer6, { name: "cart", class: "me-1" });
                      $$renderer6.push(`<!----> Cart `);
                      if (store_get($$store_subs ??= {}, "$cartCount", cartCount) > 0) {
                        $$renderer6.push("<!--[-->");
                        $$renderer6.push(`<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">`);
                        push_element($$renderer6, "span", 141, 7);
                        $$renderer6.push(`${escape_html(store_get($$store_subs ??= {}, "$cartCount", cartCount))} <span class="visually-hidden">`);
                        push_element($$renderer6, "span", 143, 8);
                        $$renderer6.push(`items in cart</span>`);
                        pop_element();
                        $$renderer6.push(`</span>`);
                        pop_element();
                      } else {
                        $$renderer6.push("<!--[!-->");
                      }
                      $$renderer6.push(`<!--]-->`);
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----></a>`);
                  pop_element();
                  $$renderer5.push(` `);
                  if (store_get($$store_subs ??= {}, "$cartCount", cartCount) > 0) {
                    $$renderer5.push("<!--[-->");
                    $$renderer5.push(`<div class="cart-preview svelte-13b8zdw">`);
                    push_element($$renderer5, "div", 150, 5);
                    $$renderer5.push(`<div class="cart-preview-header svelte-13b8zdw">`);
                    push_element($$renderer5, "div", 151, 6);
                    $$renderer5.push(`<h6 class="m-0">`);
                    push_element($$renderer5, "h6", 152, 7);
                    $$renderer5.push(`Cart (${escape_html(store_get($$store_subs ??= {}, "$cartCount", cartCount))} ${escape_html(store_get($$store_subs ??= {}, "$cartCount", cartCount) === 1 ? "item" : "items")})</h6>`);
                    pop_element();
                    $$renderer5.push(`</div>`);
                    pop_element();
                    $$renderer5.push(` <div class="cart-preview-body svelte-13b8zdw">`);
                    push_element($$renderer5, "div", 153, 18);
                    $$renderer5.push(`<!--[-->`);
                    const each_array_2 = ensure_array_like(store_get($$store_subs ??= {}, "$cart", cart).slice(0, 3));
                    for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
                      let item = each_array_2[$$index_2];
                      $$renderer5.push(`<div class="cart-preview-item svelte-13b8zdw">`);
                      push_element($$renderer5, "div", 155, 8);
                      $$renderer5.push(`<img${attr("src", item.image)}${attr("alt", item.name)} class="cart-preview-img svelte-13b8zdw"/>`);
                      push_element($$renderer5, "img", 155, 48);
                      pop_element();
                      $$renderer5.push(` <div class="cart-preview-details svelte-13b8zdw">`);
                      push_element($$renderer5, "div", 156, 9);
                      $$renderer5.push(`<span class="cart-preview-name svelte-13b8zdw">`);
                      push_element($$renderer5, "span", 157, 10);
                      $$renderer5.push(`${escape_html(item.name)}</span>`);
                      pop_element();
                      $$renderer5.push(` `);
                      if (item.price !== null) {
                        $$renderer5.push("<!--[-->");
                        $$renderer5.push(`<span class="cart-preview-price svelte-13b8zdw">`);
                        push_element($$renderer5, "span", 159, 11);
                        $$renderer5.push(`$${escape_html(item.price.toFixed(2))}</span>`);
                        pop_element();
                      } else {
                        $$renderer5.push("<!--[!-->");
                        $$renderer5.push(`<span class="cart-preview-price text-info svelte-13b8zdw">`);
                        push_element($$renderer5, "span", 161, 11);
                        $$renderer5.push(`Contact for Pricing</span>`);
                        pop_element();
                      }
                      $$renderer5.push(`<!--]--></div>`);
                      pop_element();
                      $$renderer5.push(`</div>`);
                      pop_element();
                    }
                    $$renderer5.push(`<!--]--> `);
                    if (store_get($$store_subs ??= {}, "$cartCount", cartCount) > 3) {
                      $$renderer5.push("<!--[-->");
                      $$renderer5.push(`<div class="text-center py-2">`);
                      push_element($$renderer5, "div", 167, 8);
                      $$renderer5.push(`<small>`);
                      push_element($$renderer5, "small", 168, 9);
                      $$renderer5.push(`+ ${escape_html(store_get($$store_subs ??= {}, "$cartCount", cartCount) - 3)} more items</small>`);
                      pop_element();
                      $$renderer5.push(`</div>`);
                      pop_element();
                    } else {
                      $$renderer5.push("<!--[!-->");
                    }
                    $$renderer5.push(`<!--]--></div>`);
                    pop_element();
                    $$renderer5.push(` <div class="cart-preview-footer svelte-13b8zdw">`);
                    push_element($$renderer5, "div", 172, 6);
                    $$renderer5.push(`<a href="/cart" class="btn btn-primary btn-sm w-100">`);
                    push_element($$renderer5, "a", 173, 7);
                    $$renderer5.push(`View Cart</a>`);
                    pop_element();
                    $$renderer5.push(`</div>`);
                    pop_element();
                    $$renderer5.push(`</div>`);
                    pop_element();
                  } else {
                    $$renderer5.push("<!--[!-->");
                  }
                  $$renderer5.push(`<!--]--></div>`);
                  pop_element();
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              NavItem($$renderer4, {
                class: "d-flex align-items-center",
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<button class="btn btn-dark ms-1">`);
                  push_element($$renderer5, "button", 181, 3);
                  Icon($$renderer5, { name: "question-circle", id: "disclaimer" });
                  $$renderer5.push(`<!----> `);
                  Tooltip($$renderer5, {
                    target: "disclaimer",
                    placement: "left",
                    children: prevent_snippet_stringification(($$renderer6) => {
                      $$renderer6.push(`<!---->Disclaimer:
					This portal is intended solely for use in conversion-related activities. Users are strictly prohibited from uploading, processing, or sharing any Personal Health Information (PHI), sensitive personal data, or any non-approved code through this platform. Any unauthorized use of this portal, including the submission of non-conversion-related materials, is prohibited and may result in disciplinary action, including termination of access. By using this portal, you agree to comply with these terms and acknowledge that any violation may be subject to applicable legal or regulatory consequences.`);
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----></button>`);
                  pop_element();
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!---->`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!---->`);
        }),
        $$slots: { default: true }
      });
      if ($$store_subs) unsubscribe_stores($$store_subs);
      bind_props($$props, { allowedApps, authenticated, currentApp, appAlias, userName });
    },
    Navbar
  );
}
Navbar.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_layout[FILENAME] = "src/routes/(app)/+layout.svelte";
function _layout($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      let data = $$props["data"];
      let currentApp;
      let appAlias;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        ToastNotifications($$renderer3, { position: "top-right" });
        $$renderer3.push(`<!----> `);
        if (store_get($$store_subs ??= {}, "$userStore", userStore)) {
          $$renderer3.push("<!--[-->");
          Navbar($$renderer3, {
            allowedApps: store_get($$store_subs ??= {}, "$userStore", userStore).allowed_apps,
            authenticated: !!store_get($$store_subs ??= {}, "$userStore", userStore).token,
            userName: store_get($$store_subs ??= {}, "$userStore", userStore).name,
            get currentApp() {
              return currentApp;
            },
            set currentApp($$value) {
              currentApp = $$value;
              $$settled = false;
            },
            get appAlias() {
              return appAlias;
            },
            set appAlias($$value) {
              appAlias = $$value;
              $$settled = false;
            }
          });
          $$renderer3.push(`<!----> <!--[-->`);
          slot($$renderer3, $$props, "default", {}, null);
          $$renderer3.push(`<!--]-->`);
        } else {
          $$renderer3.push("<!--[!-->");
          Navbar($$renderer3, {
            get currentApp() {
              return currentApp;
            },
            set currentApp($$value) {
              currentApp = $$value;
              $$settled = false;
            },
            get appAlias() {
              return appAlias;
            },
            set appAlias($$value) {
              appAlias = $$value;
              $$settled = false;
            }
          });
          $$renderer3.push(`<!----> <!--[-->`);
          slot($$renderer3, $$props, "default", {}, null);
          $$renderer3.push(`<!--]-->`);
        }
        $$renderer3.push(`<!--]-->`);
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      if ($$store_subs) unsubscribe_stores($$store_subs);
      bind_props($$props, { data });
    },
    _layout
  );
}
_layout.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  _layout as default
};
