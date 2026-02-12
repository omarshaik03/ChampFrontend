import { a3 as FILENAME } from "../../../../../chunks/utils2.js";
import "clsx";
import { p as prevent_snippet_stringification } from "../../../../../chunks/index2.js";
import { p as push_element, a as pop_element } from "../../../../../chunks/dev.js";
import "../../../../../chunks/client.js";
import { g as Input, B as Button, I as Icon } from "../../../../../chunks/Tooltip.js";
import { r as runtimeConfig } from "../../../../../chunks/runtime-config.js";
Login[FILENAME] = "src/components/auth/login.svelte";
function Login($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const url_base = runtimeConfig.API_BASE_URL;
      if (!url_base) {
        throw new Error("Missing API_BASE_URL in runtime config");
      }
      let email = "";
      let password = "";
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<div style="width: 100%; display: flex; justify-content: center; margin-bottom: 20px; padding-top:50px">`);
        push_element($$renderer3, "div", 85, 0);
        $$renderer3.push(`<a href="/">`);
        push_element($$renderer3, "a", 86, 4);
        $$renderer3.push(`<img src="/images/Cognizant_logo_2022.png" alt="Cognizant Logo" width="700" height="130"/>`);
        push_element($$renderer3, "img", 87, 8);
        pop_element();
        $$renderer3.push(`</a>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` <div style="text-align: center; margin-bottom: 20px; padding-top:50px;">`);
        push_element($$renderer3, "div", 91, 0);
        $$renderer3.push(`<h1 class="text-4xl font-bold">`);
        push_element($$renderer3, "h1", 92, 4);
        $$renderer3.push(`Welcome to the AI Marketplace</h1>`);
        pop_element();
        $$renderer3.push(` <p>`);
        push_element($$renderer3, "p", 93, 4);
        $$renderer3.push(`Please enter your username and password to log in.</p>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` <div style="text-align: center; margin-bottom: 15px; width: 20%; margin: auto">`);
        push_element($$renderer3, "div", 96, 0);
        Input($$renderer3, {
          type: "email",
          placeholder: "Email",
          style: "margin-bottom: 15px;",
          get value() {
            return email;
          },
          set value($$value) {
            email = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----> `);
        Input($$renderer3, {
          type: "password",
          placeholder: "Password",
          style: "margin-bottom: 15px;",
          get value() {
            return password;
          },
          set value($$value) {
            password = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(` <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 20px;">`);
        push_element($$renderer3, "div", 101, 0);
        Input($$renderer3, { type: "checkbox", label: "Remember Me" });
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(` <div style="text-align: center; margin-bottom: 20px;">`);
        push_element($$renderer3, "div", 105, 0);
        Button($$renderer3, {
          color: "primary",
          children: prevent_snippet_stringification(($$renderer4) => {
            $$renderer4.push(`<!---->Log In`);
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(` <p style="text-align: center; margin-bottom: 15px;">`);
        push_element($$renderer3, "p", 109, 0);
        $$renderer3.push(`Need to create an Account?</p>`);
        pop_element();
        $$renderer3.push(` <div style="text-align: center; margin-bottom: 20px;">`);
        push_element($$renderer3, "div", 111, 0);
        $$renderer3.push(`<a href="/auth/signup">`);
        push_element($$renderer3, "a", 112, 1);
        Button($$renderer3, {
          color: "primary",
          children: prevent_snippet_stringification(($$renderer4) => {
            $$renderer4.push(`<!---->Register`);
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></a>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` <div style="padding-top:123px;">`);
        push_element($$renderer3, "div", 117, 0);
        $$renderer3.push(`<p style="text-align: center; margin: 10px; padding: 20px; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9;">`);
        push_element($$renderer3, "p", 118, 1);
        Icon($$renderer3, { name: "exclamation-triangle" });
        $$renderer3.push(`<!----> <b>`);
        push_element($$renderer3, "b", 120, 2);
        $$renderer3.push(`Disclaimer:</b>`);
        pop_element();
        $$renderer3.push(` This portal is intended solely for use in conversion-related activities. Users are strictly prohibited from uploading, processing, or sharing any Personal Health Information (PHI), sensitive personal data, or any non-approved code through this platform. Any unauthorized use of this portal, including the submission of non-conversion-related materials, is prohibited and may result in disciplinary action, including termination of access. By using this portal, you agree to comply with these terms and acknowledge that any violation may be subject to applicable legal or regulatory consequences.</p>`);
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
    },
    Login
  );
}
Login.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page_[FILENAME] = "src/routes/(app)/auth/login/+page@.svelte";
function _page_($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      Login($$renderer2);
    },
    _page_
  );
}
_page_.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  _page_ as default
};
