import { a3 as FILENAME } from "../../../../../chunks/utils2.js";
import "clsx";
import { a as store_get, u as unsubscribe_stores, p as prevent_snippet_stringification } from "../../../../../chunks/index2.js";
import { p as push_element, a as pop_element } from "../../../../../chunks/dev.js";
import { i as Container, R as Row, j as Col, C as Card, h as CardBody, S as Spinner, l as CardTitle, m as CardText, B as Button, M as Modal, n as ModalHeader, o as ModalBody, F as Form, p as FormGroup, L as Label, g as Input } from "../../../../../chunks/Tooltip.js";
import "../../../../../chunks/toastStore.js";
import { T as ToastNotifications } from "../../../../../chunks/ToastNotifications.js";
import { L as Logs } from "../../../../../chunks/logs.js";
import { u as userStore } from "../../../../../chunks/userStore.js";
import { e as escape_html } from "../../../../../chunks/context.js";
Profile[FILENAME] = "src/components/auth/profile.svelte";
function Profile($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      let user = store_get($$store_subs ??= {}, "$userStore", userStore);
      let isLoading = !user;
      let open = false;
      let filter;
      filter = [true, "codeconvert"];
      const toggle = () => open = !open;
      let oldPassword = "";
      let newPassword = "";
      let repeatNewPassword = "";
      {
        user = store_get($$store_subs ??= {}, "$userStore", userStore);
        isLoading = !user;
      }
      user?.url_base ? user.url_base + "/info" : "";
      user?.url_base ? user.url_base + "/change_password" : "";
      user?.url_base ? user.url_base + "/last_login" : "";
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        ToastNotifications($$renderer3, { position: "top-right", maxToasts: 5 });
        $$renderer3.push(`<!----> `);
        Container($$renderer3, {
          children: prevent_snippet_stringification(($$renderer4) => {
            if (isLoading) {
              $$renderer4.push("<!--[-->");
              Row($$renderer4, {
                class: "justify-content-center",
                children: prevent_snippet_stringification(($$renderer5) => {
                  Col($$renderer5, {
                    md: "8",
                    children: prevent_snippet_stringification(($$renderer6) => {
                      Card($$renderer6, {
                        class: "mt-4",
                        children: prevent_snippet_stringification(($$renderer7) => {
                          CardBody($$renderer7, {
                            class: "text-center",
                            children: prevent_snippet_stringification(($$renderer8) => {
                              Spinner($$renderer8, { color: "primary" });
                              $$renderer8.push(`<!----> <p class="mt-3">`);
                              push_element($$renderer8, "p", 83, 12);
                              $$renderer8.push(`Loading user information...</p>`);
                              pop_element();
                            }),
                            $$slots: { default: true }
                          });
                        }),
                        $$slots: { default: true }
                      });
                    }),
                    $$slots: { default: true }
                  });
                }),
                $$slots: { default: true }
              });
            } else if (user) {
              $$renderer4.push("<!--[1-->");
              Row($$renderer4, {
                class: "justify-content-center",
                children: prevent_snippet_stringification(($$renderer5) => {
                  Col($$renderer5, {
                    md: "8",
                    children: prevent_snippet_stringification(($$renderer6) => {
                      Card($$renderer6, {
                        class: "mt-4",
                        children: prevent_snippet_stringification(($$renderer7) => {
                          CardBody($$renderer7, {
                            children: prevent_snippet_stringification(($$renderer8) => {
                              CardTitle($$renderer8, {
                                children: prevent_snippet_stringification(($$renderer9) => {
                                  $$renderer9.push(`<!---->User Information`);
                                }),
                                $$slots: { default: true }
                              });
                              $$renderer8.push(`<!----> `);
                              CardText($$renderer8, {
                                class: "text-muted",
                                children: prevent_snippet_stringification(($$renderer9) => {
                                  $$renderer9.push(`<!---->User: ${escape_html(user.name)}`);
                                }),
                                $$slots: { default: true }
                              });
                              $$renderer8.push(`<!----> <div>`);
                              push_element($$renderer8, "div", 95, 12);
                              CardText($$renderer8, {
                                class: "text-muted",
                                id: "access-level",
                                children: prevent_snippet_stringification(($$renderer9) => {
                                  $$renderer9.push(`<!---->Access Level: ${escape_html(user.allowed_apps)}`);
                                }),
                                $$slots: { default: true }
                              });
                              $$renderer8.push(`<!----> `);
                              Button($$renderer8, {
                                color: "secondary",
                                children: prevent_snippet_stringification(($$renderer9) => {
                                  $$renderer9.push(`<!---->Change Password`);
                                }),
                                $$slots: { default: true }
                              });
                              $$renderer8.push(`<!----> `);
                              Modal($$renderer8, {
                                isOpen: open,
                                toggle,
                                children: prevent_snippet_stringification(($$renderer9) => {
                                  ModalHeader($$renderer9, {
                                    toggle,
                                    children: prevent_snippet_stringification(($$renderer10) => {
                                      $$renderer10.push(`<!---->Change Password`);
                                    }),
                                    $$slots: { default: true }
                                  });
                                  $$renderer9.push(`<!----> `);
                                  ModalBody($$renderer9, {
                                    children: prevent_snippet_stringification(($$renderer10) => {
                                      Form($$renderer10, {
                                        children: prevent_snippet_stringification(($$renderer11) => {
                                          FormGroup($$renderer11, {
                                            children: prevent_snippet_stringification(($$renderer12) => {
                                              Label($$renderer12, {
                                                for: "oldPassword",
                                                children: prevent_snippet_stringification(($$renderer13) => {
                                                  $$renderer13.push(`<!---->Old Password`);
                                                }),
                                                $$slots: { default: true }
                                              });
                                              $$renderer12.push(`<!----> `);
                                              Input($$renderer12, {
                                                type: "password",
                                                id: "oldPassword",
                                                required: true,
                                                get value() {
                                                  return oldPassword;
                                                },
                                                set value($$value) {
                                                  oldPassword = $$value;
                                                  $$settled = false;
                                                }
                                              });
                                              $$renderer12.push(`<!---->`);
                                            }),
                                            $$slots: { default: true }
                                          });
                                          $$renderer11.push(`<!----> `);
                                          FormGroup($$renderer11, {
                                            children: prevent_snippet_stringification(($$renderer12) => {
                                              Label($$renderer12, {
                                                for: "newPassword",
                                                children: prevent_snippet_stringification(($$renderer13) => {
                                                  $$renderer13.push(`<!---->New Password`);
                                                }),
                                                $$slots: { default: true }
                                              });
                                              $$renderer12.push(`<!----> `);
                                              Input($$renderer12, {
                                                type: "password",
                                                id: "newPassword",
                                                required: true,
                                                get value() {
                                                  return newPassword;
                                                },
                                                set value($$value) {
                                                  newPassword = $$value;
                                                  $$settled = false;
                                                }
                                              });
                                              $$renderer12.push(`<!---->`);
                                            }),
                                            $$slots: { default: true }
                                          });
                                          $$renderer11.push(`<!----> `);
                                          FormGroup($$renderer11, {
                                            children: prevent_snippet_stringification(($$renderer12) => {
                                              Label($$renderer12, {
                                                for: "repeatNewPassword",
                                                children: prevent_snippet_stringification(($$renderer13) => {
                                                  $$renderer13.push(`<!---->Repeat New Password`);
                                                }),
                                                $$slots: { default: true }
                                              });
                                              $$renderer12.push(`<!----> `);
                                              Input($$renderer12, {
                                                type: "password",
                                                id: "repeatNewPassword",
                                                required: true,
                                                get value() {
                                                  return repeatNewPassword;
                                                },
                                                set value($$value) {
                                                  repeatNewPassword = $$value;
                                                  $$settled = false;
                                                }
                                              });
                                              $$renderer12.push(`<!---->`);
                                            }),
                                            $$slots: { default: true }
                                          });
                                          $$renderer11.push(`<!----> `);
                                          Button($$renderer11, {
                                            color: "secondary",
                                            type: "submit",
                                            children: prevent_snippet_stringification(($$renderer12) => {
                                              $$renderer12.push(`<!---->Change Password`);
                                            }),
                                            $$slots: { default: true }
                                          });
                                          $$renderer11.push(`<!----> `);
                                          Button($$renderer11, {
                                            color: "secondary",
                                            children: prevent_snippet_stringification(($$renderer12) => {
                                              $$renderer12.push(`<!---->Cancel`);
                                            }),
                                            $$slots: { default: true }
                                          });
                                          $$renderer11.push(`<!---->`);
                                        }),
                                        $$slots: { default: true }
                                      });
                                    }),
                                    $$slots: { default: true }
                                  });
                                  $$renderer9.push(`<!---->`);
                                }),
                                $$slots: { default: true }
                              });
                              $$renderer8.push(`<!----></div>`);
                              pop_element();
                            }),
                            $$slots: { default: true }
                          });
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
                      Card($$renderer6, {
                        class: "mt-4",
                        children: prevent_snippet_stringification(($$renderer7) => {
                          CardBody($$renderer7, {
                            children: prevent_snippet_stringification(($$renderer8) => {
                              CardTitle($$renderer8, {
                                children: prevent_snippet_stringification(($$renderer9) => {
                                  $$renderer9.push(`<!---->Token Information`);
                                }),
                                $$slots: { default: true }
                              });
                              $$renderer8.push(`<!----> `);
                              CardText($$renderer8, {
                                children: prevent_snippet_stringification(($$renderer9) => {
                                  $$renderer9.push(`<!---->Tokens Used: ${escape_html(user.tokens_left ?? 0)}`);
                                }),
                                $$slots: { default: true }
                              });
                              $$renderer8.push(`<!----> `);
                              CardText($$renderer8, {
                                children: prevent_snippet_stringification(($$renderer9) => {
                                  $$renderer9.push(`<!---->Tokens Allocated: ${escape_html(user.tokens_allocated ?? 0)}`);
                                }),
                                $$slots: { default: true }
                              });
                              $$renderer8.push(`<!----> `);
                              CardText($$renderer8, {
                                children: prevent_snippet_stringification(($$renderer9) => {
                                  $$renderer9.push(`<!---->Tokens Remaining: ${escape_html((user.tokens_allocated ?? 0) - (user.tokens_left ?? 0))}`);
                                }),
                                $$slots: { default: true }
                              });
                              $$renderer8.push(`<!---->`);
                            }),
                            $$slots: { default: true }
                          });
                        }),
                        $$slots: { default: true }
                      });
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!---->`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              Card($$renderer4, {
                class: "mt-4",
                children: prevent_snippet_stringification(($$renderer5) => {
                  CardBody($$renderer5, {
                    children: prevent_snippet_stringification(($$renderer6) => {
                      CardTitle($$renderer6, {
                        children: prevent_snippet_stringification(($$renderer7) => {
                          $$renderer7.push(`<!---->Activity Log`);
                        }),
                        $$slots: { default: true }
                      });
                      $$renderer6.push(`<!----> <div class="log-content svelte-beoygw">`);
                      push_element($$renderer6, "div", 139, 8);
                      if (user) {
                        $$renderer6.push("<!--[-->");
                        Logs($$renderer6, { data: user, filter });
                      } else {
                        $$renderer6.push("<!--[!-->");
                      }
                      $$renderer6.push(`<!--]--></div>`);
                      pop_element();
                    }),
                    $$slots: { default: true }
                  });
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!---->`);
            } else {
              $$renderer4.push("<!--[!-->");
            }
            $$renderer4.push(`<!--]-->`);
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!---->`);
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      if ($$store_subs) unsubscribe_stores($$store_subs);
    },
    Profile
  );
}
Profile.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(app)/auth/profile/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      Profile($$renderer2);
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
