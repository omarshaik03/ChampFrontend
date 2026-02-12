import { j as sanitize_props, k as rest_props, v as validate_dynamic_element_tag, n as validate_void_dynamic_element, o as element, s as slot, l as attributes, m as clsx, c as bind_props, q as spread_props, d as attr_class, p as prevent_snippet_stringification, b as attr, t as sanitize_slots, f as stringify } from "./index2.js";
import { twMerge } from "tailwind-merge";
import { s as setContext, g as getContext, e as escape_html, i as invalid_default_snippet } from "./context.js";
import { a4 as fallback, a3 as FILENAME } from "./utils2.js";
import { p as push_element, a as pop_element } from "./dev.js";
Frame[FILENAME] = "node_modules/flowbite-svelte/dist/utils/Frame.svelte";
const bgColors = {
  gray: "bg-gray-50 dark:bg-gray-800",
  red: "bg-red-50 dark:bg-gray-800",
  yellow: "bg-yellow-50 dark:bg-gray-800 ",
  green: "bg-green-50 dark:bg-gray-800 ",
  indigo: "bg-indigo-50 dark:bg-gray-800 ",
  purple: "bg-purple-50 dark:bg-gray-800 ",
  pink: "bg-pink-50 dark:bg-gray-800 ",
  blue: "bg-blue-50 dark:bg-gray-800 ",
  light: "bg-gray-50 dark:bg-gray-700",
  dark: "bg-gray-50 dark:bg-gray-800",
  default: "bg-white dark:bg-gray-800",
  dropdown: "bg-white dark:bg-gray-700",
  navbar: "bg-white dark:bg-gray-900",
  navbarUl: "bg-gray-50 dark:bg-gray-800",
  form: "bg-gray-50 dark:bg-gray-700",
  primary: "bg-primary-50 dark:bg-gray-800 ",
  orange: "bg-orange-50 dark:bg-orange-800",
  none: ""
};
function Frame($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "tag",
    "color",
    "rounded",
    "border",
    "shadow",
    "node",
    "use",
    "options",
    "role",
    "transition",
    "params",
    "open"
  ]);
  $$renderer.component(
    ($$renderer2) => {
      const noop = () => {
      };
      setContext("background", true);
      let tag = fallback($$props["tag"], () => $$restProps.href ? "a" : "div", true);
      let color = fallback($$props["color"], "default");
      let rounded = fallback($$props["rounded"], false);
      let border = fallback($$props["border"], false);
      let shadow = fallback($$props["shadow"], false);
      let node = fallback($$props["node"], () => void 0, true);
      let use = fallback($$props["use"], noop);
      let options = fallback($$props["options"], () => ({}), true);
      let role = fallback($$props["role"], () => void 0, true);
      let transition = fallback($$props["transition"], () => void 0, true);
      let params = fallback($$props["params"], () => ({}), true);
      let open = fallback($$props["open"], true);
      const textColors = {
        gray: "text-gray-800 dark:text-gray-300",
        red: "text-red-800 dark:text-red-400",
        yellow: "text-yellow-800 dark:text-yellow-300",
        green: "text-green-800 dark:text-green-400",
        indigo: "text-indigo-800 dark:text-indigo-400",
        purple: "text-purple-800 dark:text-purple-400",
        pink: "text-pink-800 dark:text-pink-400",
        blue: "text-blue-800 dark:text-blue-400",
        light: "text-gray-700 dark:text-gray-300",
        dark: "text-gray-700 dark:text-gray-300",
        default: "text-gray-500 dark:text-gray-400",
        dropdown: "text-gray-700 dark:text-gray-200",
        navbar: "text-gray-700 dark:text-gray-200",
        navbarUl: "text-gray-700 dark:text-gray-400",
        form: "text-gray-900 dark:text-white",
        primary: "text-primary-800 dark:text-primary-400",
        orange: "text-orange-800 dark:text-orange-400",
        none: ""
      };
      const borderColors = {
        gray: "border-gray-300 dark:border-gray-800 divide-gray-300 dark:divide-gray-800",
        red: "border-red-300 dark:border-red-800 divide-red-300 dark:divide-red-800",
        yellow: "border-yellow-300 dark:border-yellow-800 divide-yellow-300 dark:divide-yellow-800",
        green: "border-green-300 dark:border-green-800 divide-green-300 dark:divide-green-800",
        indigo: "border-indigo-300 dark:border-indigo-800 divide-indigo-300 dark:divide-indigo-800",
        purple: "border-purple-300 dark:border-purple-800 divide-purple-300 dark:divide-purple-800",
        pink: "border-pink-300 dark:border-pink-800 divide-pink-300 dark:divide-pink-800",
        blue: "border-blue-300 dark:border-blue-800 divide-blue-300 dark:divide-blue-800",
        light: "border-gray-500 divide-gray-500",
        dark: "border-gray-500 divide-gray-500",
        default: "border-gray-200 dark:border-gray-700 divide-gray-200 dark:divide-gray-700",
        dropdown: "border-gray-100 dark:border-gray-600 divide-gray-100 dark:divide-gray-600",
        navbar: "border-gray-100 dark:border-gray-700 divide-gray-100 dark:divide-gray-700",
        navbarUl: "border-gray-100 dark:border-gray-700 divide-gray-100 dark:divide-gray-700",
        form: "border-gray-300 dark:border-gray-700 divide-gray-300 dark:divide-gray-700",
        primary: "border-primary-500 dark:border-primary-200  divide-primary-500 dark:divide-primary-200 ",
        orange: "border-orange-300 dark:border-orange-800 divide-orange-300 dark:divide-orange-800",
        none: ""
      };
      let divClass;
      color = color ?? "default";
      setContext("color", color);
      divClass = twMerge(bgColors[color], textColors[color], rounded && "rounded-lg", border && "border", borderColors[color], shadow && "shadow-md", $$sanitized_props.class);
      if (transition && open) {
        $$renderer2.push("<!--[-->");
        validate_dynamic_element_tag(() => tag);
        validate_void_dynamic_element(() => tag);
        push_element($$renderer2, tag, 91, 2);
        element(
          $$renderer2,
          tag,
          () => {
            $$renderer2.push(`${attributes({ role, ...$$restProps, class: clsx(divClass) })}`);
          },
          () => {
            $$renderer2.push(`<!--[-->`);
            slot($$renderer2, $$props, "default", {}, null);
            $$renderer2.push(`<!--]-->`);
          }
        );
        pop_element();
      } else if (open) {
        $$renderer2.push("<!--[1-->");
        validate_dynamic_element_tag(() => tag);
        validate_void_dynamic_element(() => tag);
        push_element($$renderer2, tag, 95, 2);
        element(
          $$renderer2,
          tag,
          () => {
            $$renderer2.push(`${attributes({ role, ...$$restProps, class: clsx(divClass) })}`);
          },
          () => {
            $$renderer2.push(`<!--[-->`);
            slot($$renderer2, $$props, "default", {}, null);
            $$renderer2.push(`<!--]-->`);
          }
        );
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, {
        tag,
        color,
        rounded,
        border,
        shadow,
        node,
        use,
        options,
        role,
        transition,
        params,
        open
      });
    },
    Frame
  );
}
Frame.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
ToolbarButton[FILENAME] = "node_modules/flowbite-svelte/dist/toolbar/ToolbarButton.svelte";
function ToolbarButton($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["color", "name", "ariaLabel", "size", "href"]);
  $$renderer.component(
    ($$renderer2) => {
      let color = fallback($$props["color"], "default");
      let name = fallback($$props["name"], () => void 0, true);
      let ariaLabel = fallback($$props["ariaLabel"], () => void 0, true);
      let size = fallback($$props["size"], "md");
      let href = fallback($$props["href"], () => void 0, true);
      const background = getContext("background");
      const colors = {
        dark: "text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600",
        gray: "text-gray-500 focus:ring-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 dark:hover:text-gray-300",
        red: "text-red-500 focus:ring-red-400 hover:bg-red-200 dark:hover:bg-red-800 dark:hover:text-red-300",
        yellow: "text-yellow-500 focus:ring-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-800 dark:hover:text-yellow-300",
        green: "text-green-500 focus:ring-green-400 hover:bg-green-200 dark:hover:bg-green-800 dark:hover:text-green-300",
        indigo: "text-indigo-500 focus:ring-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800 dark:hover:text-indigo-300",
        purple: "text-purple-500 focus:ring-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800 dark:hover:text-purple-300",
        pink: "text-pink-500 focus:ring-pink-400 hover:bg-pink-200 dark:hover:bg-pink-800 dark:hover:text-pink-300",
        blue: "text-blue-500 focus:ring-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 dark:hover:text-blue-300",
        primary: "text-primary-500 focus:ring-primary-400 hover:bg-primary-200 dark:hover:bg-primary-800 dark:hover:text-primary-300",
        default: "focus:ring-gray-400 hover:bg-gray-100"
      };
      const sizing = {
        xs: "m-0.5 rounded-sm focus:ring-1 p-0.5",
        sm: "m-0.5 rounded focus:ring-1 p-0.5",
        md: "m-0.5 rounded-lg focus:ring-2 p-1.5",
        lg: "m-0.5 rounded-lg focus:ring-2 p-2.5"
      };
      let buttonClass;
      const svgSizes = {
        xs: "w-3 h-3",
        sm: "w-3.5 h-3.5",
        md: "w-5 h-5",
        lg: "w-5 h-5"
      };
      buttonClass = twMerge("focus:outline-none whitespace-normal", sizing[size], colors[color], color === "default" && (background ? "dark:hover:bg-gray-600" : "dark:hover:bg-gray-700"), $$sanitized_props.class);
      if (href) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<a${attributes({
          href,
          ...$$restProps,
          class: clsx(buttonClass),
          "aria-label": ariaLabel ?? name
        })}>`);
        push_element($$renderer2, "a", 39, 2);
        if (name) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span class="sr-only">`);
          push_element($$renderer2, "span", 40, 14);
          $$renderer2.push(`${escape_html(name)}</span>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> <!--[-->`);
        slot($$renderer2, $$props, "default", { svgSize: svgSizes[size] }, null);
        $$renderer2.push(`<!--]--></a>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<button${attributes({
          type: "button",
          ...$$restProps,
          class: clsx(buttonClass),
          "aria-label": ariaLabel ?? name
        })}>`);
        push_element($$renderer2, "button", 44, 2);
        if (name) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span class="sr-only">`);
          push_element($$renderer2, "span", 45, 14);
          $$renderer2.push(`${escape_html(name)}</span>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> <!--[-->`);
        slot($$renderer2, $$props, "default", { svgSize: svgSizes[size] }, null);
        $$renderer2.push(`<!--]--></button>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, { color, name, ariaLabel, size, href });
    },
    ToolbarButton
  );
}
ToolbarButton.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
CloseButton[FILENAME] = "node_modules/flowbite-svelte/dist/utils/CloseButton.svelte";
function CloseButton($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["name"]);
  $$renderer.component(
    ($$renderer2) => {
      let name = fallback($$props["name"], "Close");
      ToolbarButton($$renderer2, spread_props([
        { name },
        $$restProps,
        {
          class: twMerge("ms-auto", $$sanitized_props.class),
          children: invalid_default_snippet,
          $$slots: {
            default: ($$renderer3, { svgSize }) => {
              $$renderer3.push(`<svg${attr_class(clsx(svgSize))} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">`);
              push_element($$renderer3, "svg", 7, 2);
              $$renderer3.push(`<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd">`);
              push_element($$renderer3, "path", 8, 4);
              $$renderer3.push(`</path>`);
              pop_element();
              $$renderer3.push(`</svg>`);
              pop_element();
            }
          }
        }
      ]));
      bind_props($$props, { name });
    },
    CloseButton
  );
}
CloseButton.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Button[FILENAME] = "node_modules/flowbite-svelte/dist/buttons/Button.svelte";
function Button($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "pill",
    "outline",
    "size",
    "href",
    "type",
    "color",
    "shadow",
    "tag",
    "checked",
    "disabled"
  ]);
  $$renderer.component(
    ($$renderer2) => {
      const group = getContext("group");
      let pill = fallback($$props["pill"], false);
      let outline = fallback($$props["outline"], false);
      let size = fallback($$props["size"], group ? "sm" : "md");
      let href = fallback($$props["href"], () => void 0, true);
      let type = fallback($$props["type"], "button");
      let color = fallback($$props["color"], group ? outline ? "dark" : "alternative" : "primary");
      let shadow = fallback($$props["shadow"], false);
      let tag = fallback($$props["tag"], "button");
      let checked = fallback($$props["checked"], () => void 0, true);
      let disabled = fallback($$props["disabled"], false);
      const colorClasses = {
        alternative: "text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 hover:text-primary-700 focus-within:text-primary-700 dark:focus-within:text-white dark:hover:text-white dark:hover:bg-gray-700",
        blue: "text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700",
        dark: "text-white bg-gray-800 hover:bg-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700",
        green: "text-white bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700",
        light: "text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600",
        primary: "text-white bg-primary-700 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700",
        purple: "text-white bg-purple-700 hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-700",
        red: "text-white bg-red-700 hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-700",
        yellow: "text-white bg-yellow-400 hover:bg-yellow-500 ",
        none: ""
      };
      const colorCheckedClasses = {
        alternative: "text-primary-700 border dark:text-primary-500 bg-gray-100 dark:bg-gray-700 border-gray-300 shadow-gray-300 dark:shadow-gray-800 shadow-inner",
        blue: "text-blue-900 bg-blue-400 dark:bg-blue-500 shadow-blue-700 dark:shadow-blue-800 shadow-inner",
        dark: "text-white bg-gray-500 dark:bg-gray-600 shadow-gray-800 dark:shadow-gray-900 shadow-inner",
        green: "text-green-900 bg-green-400 dark:bg-green-500 shadow-green-700 dark:shadow-green-800 shadow-inner",
        light: "text-gray-900 bg-gray-100 border border-gray-300 dark:bg-gray-500 dark:text-gray-900 dark:border-gray-700 shadow-gray-300 dark:shadow-gray-700 shadow-inner",
        primary: "text-primary-900 bg-primary-400 dark:bg-primary-500 shadow-primary-700 dark:shadow-primary-800 shadow-inner",
        purple: "text-purple-900 bg-purple-400 dark:bg-purple-500 shadow-purple-700 dark:shadow-purple-800 shadow-inner",
        red: "text-red-900 bg-red-400 dark:bg-red-500 shadow-red-700 dark:shadow-red-800 shadow-inner",
        yellow: "text-yellow-900 bg-yellow-300 dark:bg-yellow-400 shadow-yellow-500 dark:shadow-yellow-700 shadow-inner",
        none: ""
      };
      const coloredFocusClasses = {
        alternative: "focus-within:ring-gray-200 dark:focus-within:ring-gray-700",
        blue: "focus-within:ring-blue-300 dark:focus-within:ring-blue-800",
        dark: "focus-within:ring-gray-300 dark:focus-within:ring-gray-700",
        green: "focus-within:ring-green-300 dark:focus-within:ring-green-800",
        light: "focus-within:ring-gray-200 dark:focus-within:ring-gray-700",
        primary: "focus-within:ring-primary-300 dark:focus-within:ring-primary-800",
        purple: "focus-within:ring-purple-300 dark:focus-within:ring-purple-900",
        red: "focus-within:ring-red-300 dark:focus-within:ring-red-900",
        yellow: "focus-within:ring-yellow-300 dark:focus-within:ring-yellow-900",
        none: ""
      };
      const coloredShadowClasses = {
        alternative: "shadow-gray-500/50 dark:shadow-gray-800/80",
        blue: "shadow-blue-500/50 dark:shadow-blue-800/80",
        dark: "shadow-gray-500/50 dark:shadow-gray-800/80",
        green: "shadow-green-500/50 dark:shadow-green-800/80",
        light: "shadow-gray-500/50 dark:shadow-gray-800/80",
        primary: "shadow-primary-500/50 dark:shadow-primary-800/80",
        purple: "shadow-purple-500/50 dark:shadow-purple-800/80",
        red: "shadow-red-500/50 dark:shadow-red-800/80 ",
        yellow: "shadow-yellow-500/50 dark:shadow-yellow-800/80 ",
        none: ""
      };
      const outlineClasses = {
        alternative: "text-gray-900 dark:text-gray-400 hover:text-white border border-gray-800 hover:bg-gray-900 focus-within:bg-gray-900 focus-within:text-white focus-within:ring-gray-300 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-600 dark:focus-within:ring-gray-800",
        blue: "text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600",
        dark: "text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus-within:bg-gray-900 focus-within:text-white dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-600",
        green: "text-green-700 hover:text-white border border-green-700 hover:bg-green-800 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600",
        light: "text-gray-500 hover:text-gray-900 bg-white border border-gray-200 dark:border-gray-600 dark:hover:text-white dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600",
        primary: "text-primary-700 hover:text-white border border-primary-700 hover:bg-primary-700 dark:border-primary-500 dark:text-primary-500 dark:hover:text-white dark:hover:bg-primary-600",
        purple: "text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500",
        red: "text-red-700 hover:text-white border border-red-700 hover:bg-red-800 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600",
        yellow: "text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400",
        none: ""
      };
      const sizeClasses = {
        xs: "px-3 py-2 text-xs",
        sm: "px-4 py-2 text-sm",
        md: "px-5 py-2.5 text-sm",
        lg: "px-5 py-3 text-base",
        xl: "px-6 py-3.5 text-base"
      };
      const hasBorder = () => outline || color === "alternative" || color === "light";
      let buttonClass;
      buttonClass = twMerge(
        "text-center font-medium",
        group ? "focus-within:ring-2" : "focus-within:ring-4",
        group && "focus-within:z-10",
        group || "focus-within:outline-none",
        "inline-flex items-center justify-center " + sizeClasses[size],
        outline && checked && "border dark:border-gray-900",
        outline && checked && colorCheckedClasses[color],
        outline && !checked && outlineClasses[color],
        !outline && checked && colorCheckedClasses[color],
        !outline && !checked && colorClasses[color],
        color === "alternative" && (group && !checked ? "dark:bg-gray-700 dark:text-white dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-600" : "dark:bg-transparent dark:border-gray-600 dark:hover:border-gray-600"),
        outline && color === "dark" && (group ? checked ? "bg-gray-900 border-gray-800 dark:border-white dark:bg-gray-600" : "dark:text-white border-gray-800 dark:border-white" : "dark:text-gray-400 dark:border-gray-700"),
        coloredFocusClasses[color],
        hasBorder() && group && "[&:not(:first-child)]:-ms-px",
        group ? pill && "first:rounded-s-full last:rounded-e-full" || "first:rounded-s-lg last:rounded-e-lg" : pill && "rounded-full" || "rounded-lg",
        shadow && "shadow-lg",
        shadow && coloredShadowClasses[color],
        disabled && "cursor-not-allowed opacity-50",
        $$sanitized_props.class
      );
      if (href && !disabled) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<a${attributes({
          href,
          ...$$restProps,
          class: clsx(buttonClass),
          role: "button"
        })}>`);
        push_element($$renderer2, "a", 107, 2);
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {}, null);
        $$renderer2.push(`<!--]--></a>`);
        pop_element();
      } else if (tag === "button") {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<button${attributes({ type, ...$$restProps, disabled, class: clsx(buttonClass) })}>`);
        push_element($$renderer2, "button", 111, 2);
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {}, null);
        $$renderer2.push(`<!--]--></button>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        validate_dynamic_element_tag(() => tag);
        validate_void_dynamic_element(() => tag);
        push_element($$renderer2, tag, 115, 2);
        element(
          $$renderer2,
          tag,
          () => {
            $$renderer2.push(`${attributes({ ...$$restProps, class: clsx(buttonClass) })}`);
          },
          () => {
            $$renderer2.push(`<!--[-->`);
            slot($$renderer2, $$props, "default", {}, null);
            $$renderer2.push(`<!--]-->`);
          }
        );
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, {
        pill,
        outline,
        size,
        href,
        type,
        color,
        shadow,
        tag,
        checked,
        disabled
      });
    },
    Button
  );
}
Button.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Card[FILENAME] = "node_modules/flowbite-svelte/dist/cards/Card.svelte";
function Card($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "href",
    "horizontal",
    "reverse",
    "img",
    "padding",
    "size",
    "imgClass"
  ]);
  $$renderer.component(
    ($$renderer2) => {
      let href = fallback($$props["href"], () => void 0, true);
      let horizontal = fallback($$props["horizontal"], false);
      let reverse = fallback($$props["reverse"], false);
      let img = fallback($$props["img"], () => void 0, true);
      let padding = fallback($$props["padding"], "lg");
      let size = fallback($$props["size"], "sm");
      let imgClass = fallback($$props["imgClass"], "");
      const paddings = {
        none: "",
        xs: "p-2",
        sm: "p-4",
        md: "p-4 sm:p-5",
        lg: "p-4 sm:p-6",
        xl: "p-4 sm:p-8"
      };
      const sizes = {
        none: "",
        xs: "max-w-xs",
        sm: "max-w-sm",
        md: "max-w-xl",
        lg: "max-w-2xl",
        xl: "max-w-screen-xl"
      };
      let innerPadding;
      let cardClass;
      let imgCls;
      innerPadding = paddings[padding];
      cardClass = twMerge("flex w-full", sizes[size], reverse ? "flex-col-reverse" : "flex-col", horizontal && (reverse ? "md:flex-row-reverse" : "md:flex-row"), href && "hover:bg-gray-100 dark:hover:bg-gray-700", !img && innerPadding, $$sanitized_props.class);
      imgCls = twMerge(reverse ? "rounded-b-lg" : "rounded-t-lg", horizontal && "object-cover w-full h-96 md:h-auto md:w-48 md:rounded-none", horizontal && (reverse ? "md:rounded-e-lg" : "md:rounded-s-lg"), imgClass);
      Frame($$renderer2, spread_props([
        {
          tag: href ? "a" : "div",
          rounded: true,
          shadow: true,
          border: true,
          href
        },
        $$restProps,
        {
          class: cardClass,
          children: prevent_snippet_stringification(($$renderer3) => {
            if (img) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<img${attr_class(clsx(imgCls))}${attr("src", img)} alt=""/>`);
              push_element($$renderer3, "img", 36, 4);
              pop_element();
              $$renderer3.push(` <div${attr_class(clsx(innerPadding))}>`);
              push_element($$renderer3, "div", 37, 4);
              $$renderer3.push(`<!--[-->`);
              slot($$renderer3, $$props, "default", {}, null);
              $$renderer3.push(`<!--]--></div>`);
              pop_element();
            } else {
              $$renderer3.push("<!--[!-->");
              $$renderer3.push(`<!--[-->`);
              slot($$renderer3, $$props, "default", {}, null);
              $$renderer3.push(`<!--]-->`);
            }
            $$renderer3.push(`<!--]-->`);
          }),
          $$slots: { default: true }
        }
      ]));
      bind_props($$props, { href, horizontal, reverse, img, padding, size, imgClass });
    },
    Card
  );
}
Card.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Modal[FILENAME] = "node_modules/flowbite-svelte/dist/modal/Modal.svelte";
function Modal($$renderer, $$props) {
  const $$slots = sanitize_slots($$props);
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "open",
    "title",
    "size",
    "color",
    "placement",
    "autoclose",
    "outsideclose",
    "dismissable",
    "backdropClass",
    "classBackdrop",
    "dialogClass",
    "classDialog",
    "defaultClass",
    "headerClass",
    "classHeader",
    "bodyClass",
    "classBody",
    "footerClass",
    "classFooter"
  ]);
  $$renderer.component(
    ($$renderer2) => {
      let backdropCls, dialogCls, frameCls, headerCls, bodyCls, footerCls;
      let open = fallback($$props["open"], false);
      let title = fallback($$props["title"], "");
      let size = fallback($$props["size"], "md");
      let color = fallback($$props["color"], "default");
      let placement = fallback($$props["placement"], "center");
      let autoclose = fallback($$props["autoclose"], false);
      let outsideclose = fallback($$props["outsideclose"], false);
      let dismissable = fallback($$props["dismissable"], true);
      let backdropClass = fallback($$props["backdropClass"], "fixed inset-0 z-40 bg-gray-900 bg-opacity-50 dark:bg-opacity-80");
      let classBackdrop = fallback($$props["classBackdrop"], () => void 0, true);
      let dialogClass = fallback($$props["dialogClass"], "fixed top-0 start-0 end-0 h-modal md:inset-0 md:h-full z-50 w-full p-4 flex");
      let classDialog = fallback($$props["classDialog"], () => void 0, true);
      let defaultClass = fallback($$props["defaultClass"], "relative flex flex-col mx-auto");
      let headerClass = fallback($$props["headerClass"], "flex justify-between items-center p-4 md:p-5 rounded-t-lg");
      let classHeader = fallback($$props["classHeader"], () => void 0, true);
      let bodyClass = fallback($$props["bodyClass"], "p-4 md:p-5 space-y-4 flex-1 overflow-y-auto overscroll-contain");
      let classBody = fallback($$props["classBody"], () => void 0, true);
      let footerClass = fallback($$props["footerClass"], "flex items-center p-4 md:p-5 space-x-3 rtl:space-x-reverse rounded-b-lg");
      let classFooter = fallback($$props["classFooter"], () => void 0, true);
      const getPlacementClasses = (placement2) => {
        switch (placement2) {
          case "top-left":
            return ["justify-start", "items-start"];
          case "top-center":
            return ["justify-center", "items-start"];
          case "top-right":
            return ["justify-end", "items-start"];
          case "center-left":
            return ["justify-start", "items-center"];
          case "center":
            return ["justify-center", "items-center"];
          case "center-right":
            return ["justify-end", "items-center"];
          case "bottom-left":
            return ["justify-start", "items-end"];
          case "bottom-center":
            return ["justify-center", "items-end"];
          case "bottom-right":
            return ["justify-end", "items-end"];
          default:
            return ["justify-center", "items-center"];
        }
      };
      const sizes = {
        xs: "max-w-md",
        sm: "max-w-lg",
        md: "max-w-2xl",
        lg: "max-w-4xl",
        xl: "max-w-7xl"
      };
      backdropCls = twMerge(backdropClass, classBackdrop);
      dialogCls = twMerge(dialogClass, classDialog, getPlacementClasses(placement));
      frameCls = twMerge(defaultClass, "w-full divide-y", $$sanitized_props.class);
      headerCls = twMerge(headerClass, classHeader);
      bodyCls = twMerge(bodyClass, classBody);
      footerCls = twMerge(footerClass, classFooter);
      if (open) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div${attr_class(clsx(backdropCls))}>`);
        push_element($$renderer2, "div", 96, 2);
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`  <div${attr_class(clsx(dialogCls))} tabindex="-1" aria-modal="true" role="dialog">`);
        push_element($$renderer2, "div", 99, 2);
        $$renderer2.push(`<div${attr_class(`flex relative ${stringify(sizes[size])} w-full max-h-full`)}>`);
        push_element($$renderer2, "div", 100, 4);
        Frame($$renderer2, spread_props([
          { rounded: true, shadow: true },
          $$restProps,
          {
            class: frameCls,
            color,
            children: prevent_snippet_stringification(($$renderer3) => {
              if ($$slots.header || title) {
                $$renderer3.push("<!--[-->");
                Frame($$renderer3, {
                  class: headerCls,
                  color,
                  children: prevent_snippet_stringification(($$renderer4) => {
                    $$renderer4.push(`<!--[-->`);
                    slot($$renderer4, $$props, "header", {}, () => {
                      $$renderer4.push(`<h3${attr_class(`text-xl font-semibold ${stringify(color === "default" ? "" : "text-gray-900 dark:text-white")} p-0`)}>`);
                      push_element($$renderer4, "h3", 107, 14);
                      $$renderer4.push(`${escape_html(title)}</h3>`);
                      pop_element();
                    });
                    $$renderer4.push(`<!--]--> `);
                    if (dismissable) {
                      $$renderer4.push("<!--[-->");
                      CloseButton($$renderer4, { name: "Close modal", color });
                    } else {
                      $$renderer4.push("<!--[!-->");
                    }
                    $$renderer4.push(`<!--]-->`);
                  }),
                  $$slots: { default: true }
                });
              } else {
                $$renderer3.push("<!--[!-->");
              }
              $$renderer3.push(`<!--]--> <div${attr_class(clsx(bodyCls))} role="document">`);
              push_element($$renderer3, "div", 115, 8);
              if (dismissable && !$$slots.header && !title) {
                $$renderer3.push("<!--[-->");
                CloseButton($$renderer3, { name: "Close modal", class: "absolute top-3 end-2.5", color });
              } else {
                $$renderer3.push("<!--[!-->");
              }
              $$renderer3.push(`<!--]--> <!--[-->`);
              slot($$renderer3, $$props, "default", {}, null);
              $$renderer3.push(`<!--]--></div>`);
              pop_element();
              $$renderer3.push(` `);
              if ($$slots.footer) {
                $$renderer3.push("<!--[-->");
                Frame($$renderer3, {
                  class: footerCls,
                  color,
                  children: prevent_snippet_stringification(($$renderer4) => {
                    $$renderer4.push(`<!--[-->`);
                    slot($$renderer4, $$props, "footer", {}, null);
                    $$renderer4.push(`<!--]-->`);
                  }),
                  $$slots: { default: true }
                });
              } else {
                $$renderer3.push("<!--[!-->");
              }
              $$renderer3.push(`<!--]-->`);
            }),
            $$slots: { default: true }
          }
        ]));
        $$renderer2.push(`<!----></div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, {
        open,
        title,
        size,
        color,
        placement,
        autoclose,
        outsideclose,
        dismissable,
        backdropClass,
        classBackdrop,
        dialogClass,
        classDialog,
        defaultClass,
        headerClass,
        classHeader,
        bodyClass,
        classBody,
        footerClass,
        classFooter
      });
    },
    Modal
  );
}
Modal.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Heading[FILENAME] = "node_modules/flowbite-svelte/dist/typography/Heading.svelte";
function Heading($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["tag", "color", "customSize"]);
  $$renderer.component(
    ($$renderer2) => {
      let tag = fallback($$props["tag"], "h1");
      let color = fallback($$props["color"], "text-gray-900 dark:text-white");
      let customSize = fallback($$props["customSize"], "");
      const textSizes = {
        h1: "text-5xl font-extrabold",
        h2: "text-4xl font-bold",
        h3: "text-3xl font-bold",
        h4: "text-2xl font-bold",
        h5: "text-xl font-bold",
        h6: "text-lg font-bold"
      };
      validate_dynamic_element_tag(() => tag);
      validate_void_dynamic_element(() => tag);
      push_element($$renderer2, tag, 15, 0);
      element(
        $$renderer2,
        tag,
        () => {
          $$renderer2.push(`${attributes({
            ...$$restProps,
            class: clsx(twMerge(customSize ? customSize : textSizes[tag], color, "w-full", $$sanitized_props.class))
          })}`);
        },
        () => {
          $$renderer2.push(`<!--[-->`);
          slot($$renderer2, $$props, "default", {}, null);
          $$renderer2.push(`<!--]-->`);
        }
      );
      pop_element();
      bind_props($$props, { tag, color, customSize });
    },
    Heading
  );
}
Heading.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  Button as B,
  Card as C,
  Heading as H,
  Modal as M
};
