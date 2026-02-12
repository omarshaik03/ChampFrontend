import { c as bind_props, p as prevent_snippet_stringification, b as attr, d as attr_class, e as ensure_array_like, f as stringify, a as store_get, u as unsubscribe_stores } from "../../../../chunks/index2.js";
import { p as push_element, a as pop_element } from "../../../../chunks/dev.js";
import "../../../../chunks/client.js";
import { E as ExclamationCircleOutline, P as PlusOutline, D as DownloadSolid, A as ArrowLeftOutline, a as ArrowRightOutline, L as Logs } from "../../../../chunks/logs.js";
/* empty css                     */
import { M as Modal$1, B as Button$1, H as Heading } from "../../../../chunks/Heading.js";
import { a4 as fallback, a3 as FILENAME } from "../../../../chunks/utils2.js";
import { M as Modal, L as Label, g as Input, B as Button, C as Card, h as CardBody, S as Spinner } from "../../../../chunks/Tooltip.js";
import "../../../../chunks/toastStore.js";
import { e as escape_html } from "../../../../chunks/context.js";
import { T as ToastNotifications } from "../../../../chunks/ToastNotifications.js";
import "clsx";
import { u as userStore } from "../../../../chunks/userStore.js";
User_edit[FILENAME] = "src/components/apps/admin/user_edit.svelte";
function User_edit($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let open = fallback($$props["open"], false);
      let data = $$props["data"];
      let user = $$props["user"];
      let email;
      let firstName;
      let lastName;
      let tokens_used;
      let tokens_allocated;
      let group_id;
      let employee_id;
      let permission;
      data.url_base + "/edit_user";
      data.url_base + "/reset_password";
      console.log(user.id);
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        Modal($$renderer3, {
          isOpen: open,
          title: "Edit User",
          size: "md",
          class: "m-4",
          children: prevent_snippet_stringification(($$renderer4) => {
            $$renderer4.push(`<div class="space-y-6 p-4">`);
            push_element($$renderer4, "div", 106, 1);
            $$renderer4.push(`<form action="#">`);
            push_element($$renderer4, "form", 107, 2);
            $$renderer4.push(`<div class="grid grid-cols-6 gap-6">`);
            push_element($$renderer4, "div", 108, 3);
            Label($$renderer4, {
              class: "col-span-6 space-y-2 sm:col-span-3",
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<span>`);
                push_element($$renderer5, "span", 110, 5);
                $$renderer5.push(`First Name</span>`);
                pop_element();
                $$renderer5.push(` `);
                Input($$renderer5, {
                  name: "first_name",
                  class: "border outline-none rounded-md p-2",
                  placeholder: "e.g. Bonnie",
                  required: true,
                  get value() {
                    return firstName;
                  },
                  set value($$value) {
                    firstName = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!---->`);
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Label($$renderer4, {
              class: "col-span-6 space-y-2 sm:col-span-3",
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<span>`);
                push_element($$renderer5, "span", 114, 5);
                $$renderer5.push(`Last Name</span>`);
                pop_element();
                $$renderer5.push(` `);
                Input($$renderer5, {
                  name: "last_name",
                  class: "border outline-none rounded-md p-2",
                  placeholder: "e.g. Green",
                  required: true,
                  get value() {
                    return lastName;
                  },
                  set value($$value) {
                    lastName = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!---->`);
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Label($$renderer4, {
              class: "col-span-6 space-y-2 sm:col-span-3",
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<span>`);
                push_element($$renderer5, "span", 118, 5);
                $$renderer5.push(`Email</span>`);
                pop_element();
                $$renderer5.push(` `);
                Input($$renderer5, {
                  name: "email",
                  type: "email",
                  class: "border outline-none rounded-md p-2",
                  placeholder: email || "e.g. bonnie@flowbite.com",
                  get value() {
                    return email;
                  },
                  set value($$value) {
                    email = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!---->`);
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Label($$renderer4, {
              class: "col-span-6 space-y-2 sm:col-span-3",
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<span>`);
                push_element($$renderer5, "span", 129, 5);
                $$renderer5.push(`Employee ID</span>`);
                pop_element();
                $$renderer5.push(` `);
                Input($$renderer5, {
                  name: "employee_id",
                  class: "border outline-none rounded-md p-2",
                  placeholder: employee_id || "e.g. 0",
                  required: true,
                  get value() {
                    return employee_id;
                  },
                  set value($$value) {
                    employee_id = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!---->`);
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Label($$renderer4, {
              class: "col-span-6 space-y-2 sm:col-span-3",
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<span>`);
                push_element($$renderer5, "span", 140, 5);
                $$renderer5.push(`Tokens Used</span>`);
                pop_element();
                $$renderer5.push(` `);
                Input($$renderer5, {
                  name: "tokens_used",
                  class: "border outline-none rounded-md p-2",
                  placeholder: tokens_used || "e.g. 0",
                  required: true,
                  get value() {
                    return tokens_used;
                  },
                  set value($$value) {
                    tokens_used = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!---->`);
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Label($$renderer4, {
              class: "col-span-6 space-y-2 sm:col-span-3",
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<span>`);
                push_element($$renderer5, "span", 151, 5);
                $$renderer5.push(`Tokens Allocated</span>`);
                pop_element();
                $$renderer5.push(` `);
                Input($$renderer5, {
                  name: "tokens_allocated",
                  class: "border outline-none rounded-md p-2",
                  placeholder: tokens_allocated || "e.g. 0",
                  required: true,
                  get value() {
                    return tokens_allocated;
                  },
                  set value($$value) {
                    tokens_allocated = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!---->`);
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Label($$renderer4, {
              class: "col-span-6 space-y-2 sm:col-span-3",
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<span>`);
                push_element($$renderer5, "span", 162, 5);
                $$renderer5.push(`Group ID</span>`);
                pop_element();
                $$renderer5.push(` `);
                Input($$renderer5, {
                  name: "group_id",
                  class: "border outline-none rounded-md p-2",
                  placeholder: group_id || "e.g. 0",
                  required: true,
                  get value() {
                    return group_id;
                  },
                  set value($$value) {
                    group_id = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!---->`);
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Label($$renderer4, {
              class: "col-span-6 space-y-2 sm:col-span-3",
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<span>`);
                push_element($$renderer5, "span", 173, 5);
                $$renderer5.push(`Permissions</span>`);
                pop_element();
                $$renderer5.push(` `);
                Input($$renderer5, {
                  name: "password",
                  class: "border outline-none rounded-md p-2",
                  placeholder: Array.isArray(permission) ? permission.join(", ") : permission || "e.g. 0",
                  required: true,
                  get value() {
                    return permission;
                  },
                  set value($$value) {
                    permission = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!---->`);
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----></div>`);
            pop_element();
            $$renderer4.push(`</form>`);
            pop_element();
            $$renderer4.push(`</div>`);
            pop_element();
            $$renderer4.push(` <div class="flex justify-end space-x-4 p-4">`);
            push_element($$renderer4, "div", 187, 1);
            Button($$renderer4, {
              color: "danger",
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<!---->Cancel`);
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Button($$renderer4, {
              color: "primary",
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<!---->Save Changes`);
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Button($$renderer4, {
              color: "secondary",
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<!---->Reset Password`);
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----></div>`);
            pop_element();
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
      bind_props($$props, { open, data, user });
    },
    User_edit
  );
}
User_edit.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Delete[FILENAME] = "src/components/apps/admin/Delete.svelte";
function Delete($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let open = fallback($$props["open"], false);
      let data = $$props["data"];
      let user_id = $$props["user_id"];
      let user_name = $$props["user_name"];
      Modal($$renderer2, {
        isOpen: open,
        size: "sm",
        class: "rounded-lg shadow-lg",
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<div class="p-6">`);
          push_element($$renderer3, "div", 34, 1);
          ExclamationCircleOutline($$renderer3, { class: "mx-auto mb-4 h-12 w-12 text-red-600" });
          $$renderer3.push(`<!----> <h3 class="mb-4 text-center text-xl font-semibold text-gray-700 dark:text-gray-300">`);
          push_element($$renderer3, "h3", 37, 2);
          $$renderer3.push(`Confirm Deletion</h3>`);
          pop_element();
          $$renderer3.push(` <p class="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">`);
          push_element($$renderer3, "p", 40, 2);
          $$renderer3.push(`Are you sure you want to delete the user <span class="font-bold">`);
          push_element($$renderer3, "span", 41, 44);
          $$renderer3.push(`${escape_html(user_name)}</span>`);
          pop_element();
          $$renderer3.push(`? This action cannot be undone.</p>`);
          pop_element();
          $$renderer3.push(` <div class="flex justify-end space-x-4 p-4">`);
          push_element($$renderer3, "div", 44, 2);
          Button($$renderer3, {
            color: "secondary",
            class: "px-6 py-2",
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<!---->No, Cancel`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Button($$renderer3, {
            color: "danger",
            class: "px-6 py-2",
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<!---->Yes, Delete`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----></div>`);
          pop_element();
          $$renderer3.push(`</div>`);
          pop_element();
        }),
        $$slots: { default: true }
      });
      bind_props($$props, { open, data, user_id, user_name });
    },
    Delete
  );
}
Delete.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
User_signup[FILENAME] = "src/components/apps/admin/user_signup.svelte";
function User_signup($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let open = fallback($$props["open"], false);
      let user = $$props["user"];
      let email;
      let password;
      let firstName;
      let lastName;
      let employeeID;
      let url = user.url_base + "/signup";
      console.log(url);
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        if (user) {
          $$renderer3.push("<!--[-->");
          ToastNotifications($$renderer3, { position: "top-right", maxToasts: 5 });
          $$renderer3.push(`<!----> `);
          Modal($$renderer3, {
            isOpen: open,
            title: "Add New User",
            size: "md",
            class: "m-4",
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<div class="space-y-6 p-4">`);
              push_element($$renderer4, "div", 63, 2);
              $$renderer4.push(`<form action="#">`);
              push_element($$renderer4, "form", 64, 3);
              $$renderer4.push(`<div class="grid grid-cols-6 gap-6">`);
              push_element($$renderer4, "div", 65, 4);
              Label($$renderer4, {
                class: "col-span-6 space-y-2 sm:col-span-3",
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<span>`);
                  push_element($$renderer5, "span", 67, 6);
                  $$renderer5.push(`First Name</span>`);
                  pop_element();
                  $$renderer5.push(` `);
                  Input($$renderer5, {
                    name: "first_name",
                    class: "border outline-none",
                    placeholder: "e.g. Bonnie",
                    required: true,
                    get value() {
                      return firstName;
                    },
                    set value($$value) {
                      firstName = $$value;
                      $$settled = false;
                    }
                  });
                  $$renderer5.push(`<!---->`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              Label($$renderer4, {
                class: "col-span-6 space-y-2 sm:col-span-3",
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<span>`);
                  push_element($$renderer5, "span", 71, 6);
                  $$renderer5.push(`Last Name</span>`);
                  pop_element();
                  $$renderer5.push(` `);
                  Input($$renderer5, {
                    name: "last_name",
                    class: "border outline-none",
                    placeholder: "e.g. Green",
                    required: true,
                    get value() {
                      return lastName;
                    },
                    set value($$value) {
                      lastName = $$value;
                      $$settled = false;
                    }
                  });
                  $$renderer5.push(`<!---->`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              Label($$renderer4, {
                class: "col-span-6 space-y-2 sm:col-span-3",
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<span>`);
                  push_element($$renderer5, "span", 75, 6);
                  $$renderer5.push(`Email</span>`);
                  pop_element();
                  $$renderer5.push(` `);
                  Input($$renderer5, {
                    name: "email",
                    type: "email",
                    class: "border outline-none",
                    placeholder: "e.g. bonnie@flowbite.com",
                    get value() {
                      return email;
                    },
                    set value($$value) {
                      email = $$value;
                      $$settled = false;
                    }
                  });
                  $$renderer5.push(`<!---->`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              Label($$renderer4, {
                class: "col-span-6 space-y-2 sm:col-span-3",
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<span>`);
                  push_element($$renderer5, "span", 85, 6);
                  $$renderer5.push(`Tokens Used</span>`);
                  pop_element();
                  $$renderer5.push(` `);
                  Input($$renderer5, {
                    name: "Tokens Used",
                    class: "border outline-none",
                    placeholder: user.tokens_left ? String(user.tokens_left) : "e.g. 0",
                    required: true
                  });
                  $$renderer5.push(`<!---->`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              Label($$renderer4, {
                class: "col-span-6 space-y-2 sm:col-span-3",
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<span>`);
                  push_element($$renderer5, "span", 95, 6);
                  $$renderer5.push(`Tokens Allocated</span>`);
                  pop_element();
                  $$renderer5.push(` `);
                  Input($$renderer5, {
                    name: "Tokens Allocated",
                    class: "border outline-none",
                    placeholder: user.tokens_allocated ? String(user.tokens_allocated) : "e.g. 0",
                    required: true
                  });
                  $$renderer5.push(`<!---->`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              Label($$renderer4, {
                class: "col-span-6 space-y-2 sm:col-span-3",
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<span>`);
                  push_element($$renderer5, "span", 104, 6);
                  $$renderer5.push(`Password</span>`);
                  pop_element();
                  $$renderer5.push(` `);
                  Input($$renderer5, {
                    name: "Password",
                    class: "border outline-none",
                    placeholder: "Password",
                    required: true,
                    get value() {
                      return password;
                    },
                    set value($$value) {
                      password = $$value;
                      $$settled = false;
                    }
                  });
                  $$renderer5.push(`<!---->`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              Label($$renderer4, {
                class: "col-span-6 space-y-2 sm:col-span-3",
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<span>`);
                  push_element($$renderer5, "span", 114, 6);
                  $$renderer5.push(`Employee ID</span>`);
                  pop_element();
                  $$renderer5.push(` `);
                  Input($$renderer5, {
                    name: "Employee ID",
                    class: "border outline-none",
                    placeholder: "optional",
                    required: true,
                    get value() {
                      return employeeID;
                    },
                    set value($$value) {
                      employeeID = $$value;
                      $$settled = false;
                    }
                  });
                  $$renderer5.push(`<!---->`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----></div>`);
              pop_element();
              $$renderer4.push(`</form>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <div class="flex justify-end space-x-4 p-4 border-t">`);
              push_element($$renderer4, "div", 128, 2);
              Button($$renderer4, {
                color: "secondary",
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<!---->Cancel`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              Button($$renderer4, {
                type: "submit",
                color: "primary",
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<!---->Add User`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----></div>`);
              pop_element();
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!---->`);
        } else {
          $$renderer3.push("<!--[!-->");
          $$renderer3.push(`<p>`);
          push_element($$renderer3, "p", 134, 1);
          $$renderer3.push(`Loading...</p>`);
          pop_element();
        }
        $$renderer3.push(`<!--]-->`);
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { open, user });
    },
    User_signup
  );
}
User_signup.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Export[FILENAME] = "src/components/apps/admin/export.svelte";
function Export($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let open = fallback($$props["open"], false);
      let data = $$props["data"];
      let logs = fallback($$props["logs"], () => [], true);
      let selectedLogs = {
        authLogs: false,
        docInsightsLogs: false,
        webInsightsLogs: false,
        codeConvertLogs: false
      };
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        Modal$1($$renderer3, {
          size: "sm",
          get open() {
            return open;
          },
          set open($$value) {
            open = $$value;
            $$settled = false;
          },
          children: prevent_snippet_stringification(($$renderer4) => {
            $$renderer4.push(`<h3 class="mb-6 text-center text-lg text-gray-500 dark:text-gray-400">`);
            push_element($$renderer4, "h3", 46, 1);
            $$renderer4.push(`Please select which logs you want to export:</h3>`);
            pop_element();
            $$renderer4.push(` <div class="space-y-2">`);
            push_element($$renderer4, "div", 49, 4);
            $$renderer4.push(`<label class="flex items-center space-x-2">`);
            push_element($$renderer4, "label", 50, 8);
            $$renderer4.push(`<input type="checkbox"${attr("checked", selectedLogs.authLogs, true)} class="h-4 w-4 text-blue-600"/>`);
            push_element($$renderer4, "input", 51, 12);
            pop_element();
            $$renderer4.push(` <span class="text-gray-700">`);
            push_element($$renderer4, "span", 52, 12);
            $$renderer4.push(`User Logs</span>`);
            pop_element();
            $$renderer4.push(`</label>`);
            pop_element();
            $$renderer4.push(` <label class="flex items-center space-x-2">`);
            push_element($$renderer4, "label", 54, 8);
            $$renderer4.push(`<input type="checkbox"${attr("checked", selectedLogs.codeConvertLogs, true)} class="h-4 w-4 text-blue-600"/>`);
            push_element($$renderer4, "input", 55, 12);
            pop_element();
            $$renderer4.push(` <span class="text-gray-700">`);
            push_element($$renderer4, "span", 56, 12);
            $$renderer4.push(`Code Convert Logs</span>`);
            pop_element();
            $$renderer4.push(`</label>`);
            pop_element();
            $$renderer4.push(` <label class="flex items-center space-x-2">`);
            push_element($$renderer4, "label", 58, 8);
            $$renderer4.push(`<input type="checkbox"${attr("checked", selectedLogs.webInsightsLogs, true)} class="h-4 w-4 text-blue-600"/>`);
            push_element($$renderer4, "input", 59, 12);
            pop_element();
            $$renderer4.push(` <span class="text-gray-700">`);
            push_element($$renderer4, "span", 60, 12);
            $$renderer4.push(`Web Insights Logs</span>`);
            pop_element();
            $$renderer4.push(`</label>`);
            pop_element();
            $$renderer4.push(` <label class="flex items-center space-x-2">`);
            push_element($$renderer4, "label", 62, 8);
            $$renderer4.push(`<input type="checkbox"${attr("checked", selectedLogs.docInsightsLogs, true)} class="h-4 w-4 text-blue-600"/>`);
            push_element($$renderer4, "input", 63, 12);
            pop_element();
            $$renderer4.push(` <span class="text-gray-700">`);
            push_element($$renderer4, "span", 64, 12);
            $$renderer4.push(`Document Insights Logs</span>`);
            pop_element();
            $$renderer4.push(`</label>`);
            pop_element();
            $$renderer4.push(`</div>`);
            pop_element();
            $$renderer4.push(` <div class="flex items-center justify-center">`);
            push_element($$renderer4, "div", 68, 1);
            Button$1($$renderer4, {
              href: "/",
              color: "red",
              class: "mr-2",
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<!---->Export`);
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Button$1($$renderer4, {
              color: "alternative",
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<!---->Cancel`);
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----></div>`);
            pop_element();
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
      bind_props($$props, { open, data, logs });
    },
    Export
  );
}
Export.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Users_1[FILENAME] = "src/components/apps/admin/users.svelte";
function Users_1($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let activeUsers, totalPages, helper, pages;
      let data = $$props["data"];
      let openUser = false;
      let openDelete = false;
      let openSignup = false;
      let Users = [];
      let selected_user_id;
      let selected_user_name;
      let userToSearch = "";
      let row_user = {};
      let openExport = false;
      let logs = [];
      let currentPage = 1;
      let itemsPerPage = 10;
      let selectedUsers = /* @__PURE__ */ new Set();
      let filter = fallback($$props["filter"], () => [false, ""], true);
      activeUsers = Users;
      totalPages = Math.ceil(activeUsers.length / itemsPerPage);
      activeUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
      helper = {
        start: activeUsers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1,
        end: Math.min(currentPage * itemsPerPage, activeUsers.length),
        total: activeUsers.length
      };
      pages = Array.from({ length: totalPages }, (_, i) => ({
        name: (i + 1).toString(),
        href: `#page-${i + 1}`,
        active: currentPage === i + 1
      }));
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<main class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">`);
        push_element($$renderer3, "main", 452, 0);
        $$renderer3.push(`<div class="container-fluid px-4 py-6">`);
        push_element($$renderer3, "div", 453, 1);
        $$renderer3.push(`<div class="mb-8">`);
        push_element($$renderer3, "div", 455, 2);
        Card($$renderer3, {
          class: "border-0 shadow-lg bg-white dark:bg-gray-800",
          children: prevent_snippet_stringification(($$renderer4) => {
            CardBody($$renderer4, {
              class: "p-6",
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">`);
                push_element($$renderer5, "div", 458, 5);
                $$renderer5.push(`<div>`);
                push_element($$renderer5, "div", 459, 6);
                $$renderer5.push(`<h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">`);
                push_element($$renderer5, "h1", 460, 7);
                $$renderer5.push(`User Management</h1>`);
                pop_element();
                $$renderer5.push(` <p class="text-gray-600 dark:text-gray-400">`);
                push_element($$renderer5, "p", 463, 7);
                $$renderer5.push(`Manage user accounts, permissions, and monitor activity</p>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(` <div class="flex flex-col sm:flex-row gap-3">`);
                push_element($$renderer5, "div", 468, 6);
                Button($$renderer5, {
                  color: "primary",
                  class: "d-flex align-items-center gap-2 shadow-sm",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    PlusOutline($$renderer6, { size: "sm" });
                    $$renderer6.push(`<!----> Add User`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> `);
                Button($$renderer5, {
                  color: "outline-secondary",
                  class: "d-flex align-items-center gap-2 shadow-sm",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    DownloadSolid($$renderer6, { size: "sm" });
                    $$renderer6.push(`<!----> Export Data`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----></div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(` <div class="row mb-6">`);
        push_element($$renderer3, "div", 493, 2);
        $$renderer3.push(`<div class="col-md-3 mb-3">`);
        push_element($$renderer3, "div", 494, 3);
        Card($$renderer3, {
          class: "border-0 shadow-sm bg-primary text-white",
          children: prevent_snippet_stringification(($$renderer4) => {
            CardBody($$renderer4, {
              class: "p-4 text-center",
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<h3 class="h2 font-bold mb-1">`);
                push_element($$renderer5, "h3", 497, 6);
                $$renderer5.push(`${escape_html(Users.length)}</h3>`);
                pop_element();
                $$renderer5.push(` <p class="mb-0 opacity-75">`);
                push_element($$renderer5, "p", 498, 6);
                $$renderer5.push(`Total Users</p>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(` <div class="col-md-3 mb-3">`);
        push_element($$renderer3, "div", 502, 3);
        Card($$renderer3, {
          class: "border-0 shadow-sm bg-success text-white",
          children: prevent_snippet_stringification(($$renderer4) => {
            CardBody($$renderer4, {
              class: "p-4 text-center",
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<h3 class="h2 font-bold mb-1">`);
                push_element($$renderer5, "h3", 505, 6);
                $$renderer5.push(`${escape_html(Users.filter((u) => u.last_login).length)}</h3>`);
                pop_element();
                $$renderer5.push(` <p class="mb-0 opacity-75">`);
                push_element($$renderer5, "p", 506, 6);
                $$renderer5.push(`Active Users</p>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(` <div class="col-md-3 mb-3">`);
        push_element($$renderer3, "div", 510, 3);
        Card($$renderer3, {
          class: "border-0 shadow-sm bg-warning text-white",
          children: prevent_snippet_stringification(($$renderer4) => {
            CardBody($$renderer4, {
              class: "p-4 text-center",
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<h3 class="h2 font-bold mb-1">`);
                push_element($$renderer5, "h3", 513, 6);
                $$renderer5.push(`${escape_html(selectedUsers.size)}</h3>`);
                pop_element();
                $$renderer5.push(` <p class="mb-0 opacity-75">`);
                push_element($$renderer5, "p", 514, 6);
                $$renderer5.push(`Selected</p>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(` <div class="col-md-3 mb-3">`);
        push_element($$renderer3, "div", 518, 3);
        Card($$renderer3, {
          class: "border-0 shadow-sm bg-info text-white",
          children: prevent_snippet_stringification(($$renderer4) => {
            CardBody($$renderer4, {
              class: "p-4 text-center",
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<h3 class="h2 font-bold mb-1">`);
                push_element($$renderer5, "h3", 521, 6);
                $$renderer5.push(`${escape_html(activeUsers.length)}</h3>`);
                pop_element();
                $$renderer5.push(` <p class="mb-0 opacity-75">`);
                push_element($$renderer5, "p", 522, 6);
                $$renderer5.push(`Filtered Results</p>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` `);
        Card($$renderer3, {
          class: "border-0 shadow-sm mb-6",
          children: prevent_snippet_stringification(($$renderer4) => {
            CardBody($$renderer4, {
              class: "p-4",
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<div class="row align-items-center">`);
                push_element($$renderer5, "div", 531, 4);
                $$renderer5.push(`<div class="col-md-8 mb-3 mb-md-0">`);
                push_element($$renderer5, "div", 532, 5);
                $$renderer5.push(`<input${attr("value", userToSearch)} placeholder="Search users by name..." class="form-control shadow-sm border-0 bg-gray-50 dark:bg-gray-700"/>`);
                push_element($$renderer5, "input", 533, 6);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(` <div class="col-md-4 text-md-end">`);
                push_element($$renderer5, "div", 540, 5);
                $$renderer5.push(`<div class="d-flex gap-2 justify-content-md-end">`);
                push_element($$renderer5, "div", 541, 6);
                $$renderer5.select(
                  {
                    class: "form-select form-select-sm shadow-sm",
                    value: itemsPerPage
                  },
                  ($$renderer6) => {
                    $$renderer6.option({ value: 10 }, ($$renderer7) => {
                      push_element($$renderer7, "option", 543, 8);
                      $$renderer7.push(`10 per page`);
                      pop_element();
                    });
                    $$renderer6.option({ value: 25 }, ($$renderer7) => {
                      push_element($$renderer7, "option", 544, 8);
                      $$renderer7.push(`25 per page`);
                      pop_element();
                    });
                    $$renderer6.option({ value: 50 }, ($$renderer7) => {
                      push_element($$renderer7, "option", 545, 8);
                      $$renderer7.push(`50 per page`);
                      pop_element();
                    });
                  }
                );
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> `);
        Card($$renderer3, {
          class: "border-0 shadow-lg",
          children: prevent_snippet_stringification(($$renderer4) => {
            CardBody($$renderer4, {
              class: "p-0",
              children: prevent_snippet_stringification(($$renderer5) => {
                {
                  $$renderer5.push("<!--[-->");
                  $$renderer5.push(`<div class="text-center py-5">`);
                  push_element($$renderer5, "div", 557, 5);
                  Spinner($$renderer5, { color: "primary" });
                  $$renderer5.push(`<!----> <p class="mt-3 text-muted">`);
                  push_element($$renderer5, "p", 559, 6);
                  $$renderer5.push(`Loading users...</p>`);
                  pop_element();
                  $$renderer5.push(`</div>`);
                  pop_element();
                }
                $$renderer5.push(`<!--]-->`);
              }),
              $$slots: { default: true }
            });
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> `);
        if (totalPages > 1) {
          $$renderer3.push("<!--[-->");
          Card($$renderer3, {
            class: "border-0 shadow-sm mt-4",
            children: prevent_snippet_stringification(($$renderer4) => {
              CardBody($$renderer4, {
                class: "p-4",
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<div class="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">`);
                  push_element($$renderer5, "div", 687, 5);
                  $$renderer5.push(`<div class="text-muted">`);
                  push_element($$renderer5, "div", 688, 6);
                  $$renderer5.push(`Showing <strong>`);
                  push_element($$renderer5, "strong", 689, 15);
                  $$renderer5.push(`${escape_html(helper.start)}</strong>`);
                  pop_element();
                  $$renderer5.push(` to <strong>`);
                  push_element($$renderer5, "strong", 689, 50);
                  $$renderer5.push(`${escape_html(helper.end)}</strong>`);
                  pop_element();
                  $$renderer5.push(` of <strong>`);
                  push_element($$renderer5, "strong", 689, 83);
                  $$renderer5.push(`${escape_html(helper.total)}</strong>`);
                  pop_element();
                  $$renderer5.push(` entries</div>`);
                  pop_element();
                  $$renderer5.push(` <nav aria-label="User pagination">`);
                  push_element($$renderer5, "nav", 692, 6);
                  $$renderer5.push(`<ul class="pagination pagination-sm mb-0">`);
                  push_element($$renderer5, "ul", 693, 7);
                  $$renderer5.push(`<li${attr_class(`page-item ${stringify("disabled")}`)}>`);
                  push_element($$renderer5, "li", 694, 8);
                  $$renderer5.push(`<button class="page-link d-flex align-items-center gap-2"${attr("disabled", currentPage === 1, true)}>`);
                  push_element($$renderer5, "button", 695, 9);
                  ArrowLeftOutline($$renderer5, { size: "xs" });
                  $$renderer5.push(`<!----> Previous</button>`);
                  pop_element();
                  $$renderer5.push(`</li>`);
                  pop_element();
                  $$renderer5.push(` <!--[-->`);
                  const each_array_1 = ensure_array_like(pages);
                  for (let index = 0, $$length = each_array_1.length; index < $$length; index++) {
                    let page = each_array_1[index];
                    if (totalPages <= 7 || index < 2 || index >= totalPages - 2 || Math.abs(index + 1 - currentPage) <= 1) {
                      $$renderer5.push("<!--[-->");
                      $$renderer5.push(`<li${attr_class(`page-item ${stringify(page.active ? "active" : "")}`)}>`);
                      push_element($$renderer5, "li", 707, 10);
                      $$renderer5.push(`<button class="page-link">`);
                      push_element($$renderer5, "button", 708, 11);
                      $$renderer5.push(`${escape_html(page.name)}</button>`);
                      pop_element();
                      $$renderer5.push(`</li>`);
                      pop_element();
                    } else if (index === 2 || index === totalPages - 3) {
                      $$renderer5.push("<!--[1-->");
                      $$renderer5.push(`<li class="page-item disabled">`);
                      push_element($$renderer5, "li", 716, 10);
                      $$renderer5.push(`<span class="page-link">`);
                      push_element($$renderer5, "span", 717, 11);
                      $$renderer5.push(`...</span>`);
                      pop_element();
                      $$renderer5.push(`</li>`);
                      pop_element();
                    } else {
                      $$renderer5.push("<!--[!-->");
                    }
                    $$renderer5.push(`<!--]-->`);
                  }
                  $$renderer5.push(`<!--]--> <li${attr_class(`page-item ${stringify(currentPage === totalPages ? "disabled" : "")}`)}>`);
                  push_element($$renderer5, "li", 722, 8);
                  $$renderer5.push(`<button class="page-link d-flex align-items-center gap-2"${attr("disabled", currentPage === totalPages, true)}>`);
                  push_element($$renderer5, "button", 723, 9);
                  $$renderer5.push(`Next `);
                  ArrowRightOutline($$renderer5, { size: "xs" });
                  $$renderer5.push(`<!----></button>`);
                  pop_element();
                  $$renderer5.push(`</li>`);
                  pop_element();
                  $$renderer5.push(`</ul>`);
                  pop_element();
                  $$renderer5.push(`</nav>`);
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
        if (selectedUsers.size > 0) {
          $$renderer3.push("<!--[-->");
          Card($$renderer3, {
            class: "border-0 shadow-sm mt-4 bg-primary",
            children: prevent_snippet_stringification(($$renderer4) => {
              CardBody($$renderer4, {
                class: "p-3",
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<div class="d-flex justify-content-between align-items-center text-white">`);
                  push_element($$renderer5, "div", 743, 5);
                  $$renderer5.push(`<span class="fw-semibold">`);
                  push_element($$renderer5, "span", 744, 6);
                  $$renderer5.push(`${escape_html(selectedUsers.size)} user${escape_html(selectedUsers.size > 1 ? "s" : "")} selected</span>`);
                  pop_element();
                  $$renderer5.push(` <div class="d-flex gap-2">`);
                  push_element($$renderer5, "div", 747, 6);
                  Button($$renderer5, {
                    color: "light",
                    size: "sm",
                    children: prevent_snippet_stringification(($$renderer6) => {
                      $$renderer6.push(`<!---->Bulk Edit`);
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----> `);
                  Button($$renderer5, {
                    color: "outline-light",
                    size: "sm",
                    children: prevent_snippet_stringification(($$renderer6) => {
                      $$renderer6.push(`<!---->Export Selected`);
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----></div>`);
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
        $$renderer3.push(`<!--]--></div>`);
        pop_element();
        $$renderer3.push(`</main>`);
        pop_element();
        $$renderer3.push(` `);
        User_edit($$renderer3, {
          data,
          user: row_user,
          get open() {
            return openUser;
          },
          set open($$value) {
            openUser = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----> `);
        User_signup($$renderer3, {
          user: data,
          get open() {
            return openSignup;
          },
          set open($$value) {
            openSignup = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----> `);
        Delete($$renderer3, {
          data,
          get open() {
            return openDelete;
          },
          set open($$value) {
            openDelete = $$value;
            $$settled = false;
          },
          get user_id() {
            return selected_user_id;
          },
          set user_id($$value) {
            selected_user_id = $$value;
            $$settled = false;
          },
          get user_name() {
            return selected_user_name;
          },
          set user_name($$value) {
            selected_user_name = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----> `);
        Export($$renderer3, {
          data,
          get open() {
            return openExport;
          },
          set open($$value) {
            openExport = $$value;
            $$settled = false;
          },
          get logs() {
            return logs;
          },
          set logs($$value) {
            logs = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!---->`);
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { data, filter });
    },
    Users_1
  );
}
Users_1.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(app)/admin/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      if (!store_get($$store_subs ??= {}, "$userStore", userStore)) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="flex justify-center items-center h-screen">`);
        push_element($$renderer2, "div", 20, 4);
        $$renderer2.push(`<div class="text-center">`);
        push_element($$renderer2, "div", 21, 8);
        $$renderer2.push(`<h1 class="text-2xl font-bold">`);
        push_element($$renderer2, "h1", 22, 12);
        $$renderer2.push(`Loading...</h1>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="flex justify-end mb-4 pt-4 pr-4">`);
        push_element($$renderer2, "div", 26, 4);
        Button($$renderer2, {
          color: "dark",
          href: "/admin/testing",
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<!---->API Testing Dashboard`);
          }),
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----></div>`);
        pop_element();
        $$renderer2.push(` `);
        Users_1($$renderer2, {
          data: store_get($$store_subs ??= {}, "$userStore", userStore)
        });
        $$renderer2.push(`<!----> `);
        Heading($$renderer2, {
          tag: "h2",
          class: "mb-4 text-2xl font-bold dark:text-white",
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<!---->User Logs`);
          }),
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----> <div>`);
        push_element($$renderer2, "div", 36, 4);
        Heading($$renderer2, {
          tag: "h3",
          class: "ml-0 mb-2 text-xl font-semibold dark:text-white",
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<!---->User Activity`);
          }),
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----> `);
        Logs($$renderer2, {
          data: store_get($$store_subs ??= {}, "$userStore", userStore),
          filter: [false, "auth"]
        });
        $$renderer2.push(`<!----></div>`);
        pop_element();
        $$renderer2.push(` <br/>`);
        push_element($$renderer2, "br", 44, 4);
        pop_element();
        $$renderer2.push(`<br/>`);
        push_element($$renderer2, "br", 44, 8);
        pop_element();
        $$renderer2.push(` <div>`);
        push_element($$renderer2, "div", 45, 4);
        Heading($$renderer2, {
          tag: "h3",
          class: "ml-0 mb-2 text-xl font-semibold dark:text-white",
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<!---->SQL Convert Logs`);
          }),
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----> `);
        Logs($$renderer2, {
          data: store_get($$store_subs ??= {}, "$userStore", userStore),
          filter: [false, "codeconvert"]
        });
        $$renderer2.push(`<!----></div>`);
        pop_element();
        $$renderer2.push(` <br/>`);
        push_element($$renderer2, "br", 53, 4);
        pop_element();
        $$renderer2.push(`<br/>`);
        push_element($$renderer2, "br", 53, 8);
        pop_element();
        $$renderer2.push(` <div>`);
        push_element($$renderer2, "div", 54, 4);
        Heading($$renderer2, {
          tag: "h3",
          class: "ml-0 mb-2 text-xl font-semibold dark:text-white",
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<!---->Web Insights Logs`);
          }),
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----> `);
        Logs($$renderer2, {
          data: store_get($$store_subs ??= {}, "$userStore", userStore),
          filter: [false, "webinsights"]
        });
        $$renderer2.push(`<!----></div>`);
        pop_element();
        $$renderer2.push(` <br/>`);
        push_element($$renderer2, "br", 62, 4);
        pop_element();
        $$renderer2.push(`<br/>`);
        push_element($$renderer2, "br", 62, 8);
        pop_element();
        $$renderer2.push(` <div>`);
        push_element($$renderer2, "div", 63, 4);
        Heading($$renderer2, {
          tag: "h3",
          class: "ml-0 mb-2 text-xl font-semibold dark:text-white",
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<!---->Document Insights Logs`);
          }),
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----> `);
        Logs($$renderer2, {
          data: store_get($$store_subs ??= {}, "$userStore", userStore),
          filter: [false, "documentinsights"]
        });
        $$renderer2.push(`<!----></div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
      if ($$store_subs) unsubscribe_stores($$store_subs);
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
