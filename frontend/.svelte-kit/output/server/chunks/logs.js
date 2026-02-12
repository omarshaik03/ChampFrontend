import { j as sanitize_props, k as rest_props, l as attributes, m as clsx, b as attr, c as bind_props, p as prevent_snippet_stringification, g as attr_style, f as stringify, e as ensure_array_like, d as attr_class } from "./index2.js";
import "dayjs";
import "dayjs/plugin/localizedFormat.js";
import { M as Modal } from "./Heading.js";
import { a4 as fallback, a3 as FILENAME } from "./utils2.js";
import { p as push_element, a as pop_element } from "./dev.js";
import { g as getContext, e as escape_html } from "./context.js";
import { twMerge } from "tailwind-merge";
import { R as Row, j as Col, C as Card, h as CardBody, D as Dropdown, d as DropdownToggle, e as DropdownMenu, f as DropdownItem, q as FormCheck, g as Input, S as Spinner } from "./Tooltip.js";
/* empty css    */
import { diffLines, diffWords } from "diff";
import "clsx";
ArrowLeftOutline[FILENAME] = "node_modules/flowbite-svelte-icons/dist/ArrowLeftOutline.svelte";
function ArrowLeftOutline($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "size",
    "role",
    "color",
    "withEvents",
    "title",
    "strokeWidth",
    "desc",
    "ariaLabel"
  ]);
  $$renderer.component(
    ($$renderer2) => {
      const ctx = getContext("iconCtx") ?? {};
      const sizes = {
        xs: "w-3 h-3",
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
        xl: "w-8 h-8"
      };
      let size = fallback($$props["size"], () => ctx.size || "md", true);
      let role = fallback($$props["role"], () => ctx.role || "img", true);
      let color = fallback($$props["color"], () => ctx.color || "currentColor", true);
      let withEvents = fallback($$props["withEvents"], () => ctx.withEvents || false, true);
      let title = fallback($$props["title"], () => ({}), true);
      let strokeWidth = fallback($$props["strokeWidth"], () => ctx.strokeWidth || "2", true);
      let desc = fallback($$props["desc"], () => ({}), true);
      let ariaDescribedby = `${title.id || ""} ${desc.id || ""}`;
      let hasDescription = false;
      let ariaLabel = fallback($$props["ariaLabel"], "arrow left outline");
      if (title.id || desc.id) {
        hasDescription = true;
      } else {
        hasDescription = false;
      }
      if (withEvents) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<svg${attributes(
          {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            color,
            ...$$restProps,
            class: clsx(twMerge("shrink-0", sizes[size ?? "md"], $$sanitized_props.class)),
            role,
            "aria-label": ariaLabel,
            "aria-describedby": hasDescription ? ariaDescribedby : void 0,
            viewBox: "0 0 24 24"
          },
          void 0,
          void 0,
          void 0,
          3
        )}>`);
        push_element($$renderer2, "svg", 30, 2);
        if (title.id && title.title) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<title${attr("id", title.id)}>`);
          push_element($$renderer2, "title", 51, 6);
          $$renderer2.push(`${escape_html(title.title)}</title>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
        if (desc.id && desc.desc) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<desc${attr("id", desc.id)}>`);
          push_element($$renderer2, "desc", 54, 6);
          $$renderer2.push(`${escape_html(desc.desc)}</desc>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", strokeWidth)} d="M5 12h14M5 12l4-4m-4 4 4 4">`);
        push_element($$renderer2, "path", 56, 4);
        $$renderer2.push(`</path>`);
        pop_element();
        $$renderer2.push(`</svg>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<svg${attributes(
          {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            color,
            ...$$restProps,
            class: clsx(twMerge("shrink-0", sizes[size ?? "md"], $$sanitized_props.class)),
            role,
            "aria-label": ariaLabel,
            "aria-describedby": hasDescription ? ariaDescribedby : void 0,
            viewBox: "0 0 24 24"
          },
          void 0,
          void 0,
          void 0,
          3
        )}>`);
        push_element($$renderer2, "svg", 65, 2);
        if (title.id && title.title) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<title${attr("id", title.id)}>`);
          push_element($$renderer2, "title", 77, 6);
          $$renderer2.push(`${escape_html(title.title)}</title>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
        if (desc.id && desc.desc) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<desc${attr("id", desc.id)}>`);
          push_element($$renderer2, "desc", 80, 6);
          $$renderer2.push(`${escape_html(desc.desc)}</desc>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", strokeWidth)} d="M5 12h14M5 12l4-4m-4 4 4 4">`);
        push_element($$renderer2, "path", 82, 4);
        $$renderer2.push(`</path>`);
        pop_element();
        $$renderer2.push(`</svg>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, {
        size,
        role,
        color,
        withEvents,
        title,
        strokeWidth,
        desc,
        ariaLabel
      });
    },
    ArrowLeftOutline
  );
}
ArrowLeftOutline.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
ArrowRightOutline[FILENAME] = "node_modules/flowbite-svelte-icons/dist/ArrowRightOutline.svelte";
function ArrowRightOutline($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "size",
    "role",
    "color",
    "withEvents",
    "title",
    "strokeWidth",
    "desc",
    "ariaLabel"
  ]);
  $$renderer.component(
    ($$renderer2) => {
      const ctx = getContext("iconCtx") ?? {};
      const sizes = {
        xs: "w-3 h-3",
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
        xl: "w-8 h-8"
      };
      let size = fallback($$props["size"], () => ctx.size || "md", true);
      let role = fallback($$props["role"], () => ctx.role || "img", true);
      let color = fallback($$props["color"], () => ctx.color || "currentColor", true);
      let withEvents = fallback($$props["withEvents"], () => ctx.withEvents || false, true);
      let title = fallback($$props["title"], () => ({}), true);
      let strokeWidth = fallback($$props["strokeWidth"], () => ctx.strokeWidth || "2", true);
      let desc = fallback($$props["desc"], () => ({}), true);
      let ariaDescribedby = `${title.id || ""} ${desc.id || ""}`;
      let hasDescription = false;
      let ariaLabel = fallback($$props["ariaLabel"], "arrow right outline");
      if (title.id || desc.id) {
        hasDescription = true;
      } else {
        hasDescription = false;
      }
      if (withEvents) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<svg${attributes(
          {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            color,
            ...$$restProps,
            class: clsx(twMerge("shrink-0", sizes[size ?? "md"], $$sanitized_props.class)),
            role,
            "aria-label": ariaLabel,
            "aria-describedby": hasDescription ? ariaDescribedby : void 0,
            viewBox: "0 0 24 24"
          },
          void 0,
          void 0,
          void 0,
          3
        )}>`);
        push_element($$renderer2, "svg", 30, 2);
        if (title.id && title.title) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<title${attr("id", title.id)}>`);
          push_element($$renderer2, "title", 51, 6);
          $$renderer2.push(`${escape_html(title.title)}</title>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
        if (desc.id && desc.desc) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<desc${attr("id", desc.id)}>`);
          push_element($$renderer2, "desc", 54, 6);
          $$renderer2.push(`${escape_html(desc.desc)}</desc>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", strokeWidth)} d="M19 12H5m14 0-4 4m4-4-4-4">`);
        push_element($$renderer2, "path", 56, 4);
        $$renderer2.push(`</path>`);
        pop_element();
        $$renderer2.push(`</svg>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<svg${attributes(
          {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            color,
            ...$$restProps,
            class: clsx(twMerge("shrink-0", sizes[size ?? "md"], $$sanitized_props.class)),
            role,
            "aria-label": ariaLabel,
            "aria-describedby": hasDescription ? ariaDescribedby : void 0,
            viewBox: "0 0 24 24"
          },
          void 0,
          void 0,
          void 0,
          3
        )}>`);
        push_element($$renderer2, "svg", 65, 2);
        if (title.id && title.title) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<title${attr("id", title.id)}>`);
          push_element($$renderer2, "title", 77, 6);
          $$renderer2.push(`${escape_html(title.title)}</title>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
        if (desc.id && desc.desc) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<desc${attr("id", desc.id)}>`);
          push_element($$renderer2, "desc", 80, 6);
          $$renderer2.push(`${escape_html(desc.desc)}</desc>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", strokeWidth)} d="M19 12H5m14 0-4 4m4-4-4-4">`);
        push_element($$renderer2, "path", 82, 4);
        $$renderer2.push(`</path>`);
        pop_element();
        $$renderer2.push(`</svg>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, {
        size,
        role,
        color,
        withEvents,
        title,
        strokeWidth,
        desc,
        ariaLabel
      });
    },
    ArrowRightOutline
  );
}
ArrowRightOutline.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
DownloadSolid[FILENAME] = "node_modules/flowbite-svelte-icons/dist/DownloadSolid.svelte";
function DownloadSolid($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "size",
    "role",
    "color",
    "withEvents",
    "title",
    "desc",
    "ariaLabel"
  ]);
  $$renderer.component(
    ($$renderer2) => {
      const ctx = getContext("iconCtx") ?? {};
      const sizes = {
        xs: "w-3 h-3",
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
        xl: "w-8 h-8"
      };
      let size = fallback($$props["size"], () => ctx.size || "md", true);
      let role = fallback($$props["role"], () => ctx.role || "img", true);
      let color = fallback($$props["color"], () => ctx.color || "currentColor", true);
      let withEvents = fallback($$props["withEvents"], () => ctx.withEvents || false, true);
      let title = fallback($$props["title"], () => ({}), true);
      let desc = fallback($$props["desc"], () => ({}), true);
      let ariaDescribedby = `${title.id || ""} ${desc.id || ""}`;
      let hasDescription = false;
      let ariaLabel = fallback($$props["ariaLabel"], "download solid");
      if (title.id || desc.id) {
        hasDescription = true;
      } else {
        hasDescription = false;
      }
      if (withEvents) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<svg${attributes(
          {
            xmlns: "http://www.w3.org/2000/svg",
            fill: color,
            ...$$restProps,
            class: clsx(twMerge("shrink-0", sizes[size ?? "md"], $$sanitized_props.class)),
            role,
            "aria-label": ariaLabel,
            "aria-describedby": hasDescription ? ariaDescribedby : void 0,
            viewBox: "0 0 24 24"
          },
          void 0,
          void 0,
          void 0,
          3
        )}>`);
        push_element($$renderer2, "svg", 29, 2);
        if (title.id && title.title) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<title${attr("id", title.id)}>`);
          push_element($$renderer2, "title", 49, 6);
          $$renderer2.push(`${escape_html(title.title)}</title>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
        if (desc.id && desc.desc) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<desc${attr("id", desc.id)}>`);
          push_element($$renderer2, "desc", 52, 6);
          $$renderer2.push(`${escape_html(desc.desc)}</desc>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--><path fill-rule="evenodd" d="M13 11.15V4a1 1 0 1 0-2 0v7.15L8.78 8.374a1 1 0 1 0-1.56 1.25l4 5a1 1 0 0 0 1.56 0l4-5a1 1 0 1 0-1.56-1.25L13 11.15Z" clip-rule="evenodd">`);
        push_element($$renderer2, "path", 54, 4);
        $$renderer2.push(`</path>`);
        pop_element();
        $$renderer2.push(`<path fill-rule="evenodd" d="M9.657 15.874 7.358 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2.358l-2.3 2.874a3 3 0 0 1-4.685 0ZM17 16a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z" clip-rule="evenodd">`);
        push_element($$renderer2, "path", 59, 4);
        $$renderer2.push(`</path>`);
        pop_element();
        $$renderer2.push(`</svg>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<svg${attributes(
          {
            xmlns: "http://www.w3.org/2000/svg",
            fill: color,
            ...$$restProps,
            class: clsx(twMerge("shrink-0", sizes[size ?? "md"], $$sanitized_props.class)),
            role,
            "aria-label": ariaLabel,
            "aria-describedby": hasDescription ? ariaDescribedby : void 0,
            viewBox: "0 0 24 24"
          },
          void 0,
          void 0,
          void 0,
          3
        )}>`);
        push_element($$renderer2, "svg", 66, 2);
        if (title.id && title.title) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<title${attr("id", title.id)}>`);
          push_element($$renderer2, "title", 77, 6);
          $$renderer2.push(`${escape_html(title.title)}</title>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
        if (desc.id && desc.desc) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<desc${attr("id", desc.id)}>`);
          push_element($$renderer2, "desc", 80, 6);
          $$renderer2.push(`${escape_html(desc.desc)}</desc>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--><path fill-rule="evenodd" d="M13 11.15V4a1 1 0 1 0-2 0v7.15L8.78 8.374a1 1 0 1 0-1.56 1.25l4 5a1 1 0 0 0 1.56 0l4-5a1 1 0 1 0-1.56-1.25L13 11.15Z" clip-rule="evenodd">`);
        push_element($$renderer2, "path", 82, 4);
        $$renderer2.push(`</path>`);
        pop_element();
        $$renderer2.push(`<path fill-rule="evenodd" d="M9.657 15.874 7.358 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2.358l-2.3 2.874a3 3 0 0 1-4.685 0ZM17 16a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z" clip-rule="evenodd">`);
        push_element($$renderer2, "path", 87, 4);
        $$renderer2.push(`</path>`);
        pop_element();
        $$renderer2.push(`</svg>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, { size, role, color, withEvents, title, desc, ariaLabel });
    },
    DownloadSolid
  );
}
DownloadSolid.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
ExclamationCircleOutline[FILENAME] = "node_modules/flowbite-svelte-icons/dist/ExclamationCircleOutline.svelte";
function ExclamationCircleOutline($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "size",
    "role",
    "color",
    "withEvents",
    "title",
    "strokeWidth",
    "desc",
    "ariaLabel"
  ]);
  $$renderer.component(
    ($$renderer2) => {
      const ctx = getContext("iconCtx") ?? {};
      const sizes = {
        xs: "w-3 h-3",
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
        xl: "w-8 h-8"
      };
      let size = fallback($$props["size"], () => ctx.size || "md", true);
      let role = fallback($$props["role"], () => ctx.role || "img", true);
      let color = fallback($$props["color"], () => ctx.color || "currentColor", true);
      let withEvents = fallback($$props["withEvents"], () => ctx.withEvents || false, true);
      let title = fallback($$props["title"], () => ({}), true);
      let strokeWidth = fallback($$props["strokeWidth"], () => ctx.strokeWidth || "2", true);
      let desc = fallback($$props["desc"], () => ({}), true);
      let ariaDescribedby = `${title.id || ""} ${desc.id || ""}`;
      let hasDescription = false;
      let ariaLabel = fallback($$props["ariaLabel"], "exclamation circle outline");
      if (title.id || desc.id) {
        hasDescription = true;
      } else {
        hasDescription = false;
      }
      if (withEvents) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<svg${attributes(
          {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            color,
            ...$$restProps,
            class: clsx(twMerge("shrink-0", sizes[size ?? "md"], $$sanitized_props.class)),
            role,
            "aria-label": ariaLabel,
            "aria-describedby": hasDescription ? ariaDescribedby : void 0,
            viewBox: "0 0 24 24"
          },
          void 0,
          void 0,
          void 0,
          3
        )}>`);
        push_element($$renderer2, "svg", 30, 2);
        if (title.id && title.title) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<title${attr("id", title.id)}>`);
          push_element($$renderer2, "title", 51, 6);
          $$renderer2.push(`${escape_html(title.title)}</title>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
        if (desc.id && desc.desc) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<desc${attr("id", desc.id)}>`);
          push_element($$renderer2, "desc", 54, 6);
          $$renderer2.push(`${escape_html(desc.desc)}</desc>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", strokeWidth)} d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z">`);
        push_element($$renderer2, "path", 56, 4);
        $$renderer2.push(`</path>`);
        pop_element();
        $$renderer2.push(`</svg>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<svg${attributes(
          {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            color,
            ...$$restProps,
            class: clsx(twMerge("shrink-0", sizes[size ?? "md"], $$sanitized_props.class)),
            role,
            "aria-label": ariaLabel,
            "aria-describedby": hasDescription ? ariaDescribedby : void 0,
            viewBox: "0 0 24 24"
          },
          void 0,
          void 0,
          void 0,
          3
        )}>`);
        push_element($$renderer2, "svg", 65, 2);
        if (title.id && title.title) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<title${attr("id", title.id)}>`);
          push_element($$renderer2, "title", 77, 6);
          $$renderer2.push(`${escape_html(title.title)}</title>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
        if (desc.id && desc.desc) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<desc${attr("id", desc.id)}>`);
          push_element($$renderer2, "desc", 80, 6);
          $$renderer2.push(`${escape_html(desc.desc)}</desc>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", strokeWidth)} d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z">`);
        push_element($$renderer2, "path", 82, 4);
        $$renderer2.push(`</path>`);
        pop_element();
        $$renderer2.push(`</svg>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, {
        size,
        role,
        color,
        withEvents,
        title,
        strokeWidth,
        desc,
        ariaLabel
      });
    },
    ExclamationCircleOutline
  );
}
ExclamationCircleOutline.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
PlusOutline[FILENAME] = "node_modules/flowbite-svelte-icons/dist/PlusOutline.svelte";
function PlusOutline($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "size",
    "role",
    "color",
    "withEvents",
    "title",
    "strokeWidth",
    "desc",
    "ariaLabel"
  ]);
  $$renderer.component(
    ($$renderer2) => {
      const ctx = getContext("iconCtx") ?? {};
      const sizes = {
        xs: "w-3 h-3",
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
        xl: "w-8 h-8"
      };
      let size = fallback($$props["size"], () => ctx.size || "md", true);
      let role = fallback($$props["role"], () => ctx.role || "img", true);
      let color = fallback($$props["color"], () => ctx.color || "currentColor", true);
      let withEvents = fallback($$props["withEvents"], () => ctx.withEvents || false, true);
      let title = fallback($$props["title"], () => ({}), true);
      let strokeWidth = fallback($$props["strokeWidth"], () => ctx.strokeWidth || "2", true);
      let desc = fallback($$props["desc"], () => ({}), true);
      let ariaDescribedby = `${title.id || ""} ${desc.id || ""}`;
      let hasDescription = false;
      let ariaLabel = fallback($$props["ariaLabel"], "plus outline");
      if (title.id || desc.id) {
        hasDescription = true;
      } else {
        hasDescription = false;
      }
      if (withEvents) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<svg${attributes(
          {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            color,
            ...$$restProps,
            class: clsx(twMerge("shrink-0", sizes[size ?? "md"], $$sanitized_props.class)),
            role,
            "aria-label": ariaLabel,
            "aria-describedby": hasDescription ? ariaDescribedby : void 0,
            viewBox: "0 0 24 24"
          },
          void 0,
          void 0,
          void 0,
          3
        )}>`);
        push_element($$renderer2, "svg", 30, 2);
        if (title.id && title.title) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<title${attr("id", title.id)}>`);
          push_element($$renderer2, "title", 51, 6);
          $$renderer2.push(`${escape_html(title.title)}</title>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
        if (desc.id && desc.desc) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<desc${attr("id", desc.id)}>`);
          push_element($$renderer2, "desc", 54, 6);
          $$renderer2.push(`${escape_html(desc.desc)}</desc>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", strokeWidth)} d="M5 12h14m-7 7V5">`);
        push_element($$renderer2, "path", 56, 4);
        $$renderer2.push(`</path>`);
        pop_element();
        $$renderer2.push(`</svg>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<svg${attributes(
          {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            color,
            ...$$restProps,
            class: clsx(twMerge("shrink-0", sizes[size ?? "md"], $$sanitized_props.class)),
            role,
            "aria-label": ariaLabel,
            "aria-describedby": hasDescription ? ariaDescribedby : void 0,
            viewBox: "0 0 24 24"
          },
          void 0,
          void 0,
          void 0,
          3
        )}>`);
        push_element($$renderer2, "svg", 65, 2);
        if (title.id && title.title) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<title${attr("id", title.id)}>`);
          push_element($$renderer2, "title", 77, 6);
          $$renderer2.push(`${escape_html(title.title)}</title>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
        if (desc.id && desc.desc) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<desc${attr("id", desc.id)}>`);
          push_element($$renderer2, "desc", 80, 6);
          $$renderer2.push(`${escape_html(desc.desc)}</desc>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", strokeWidth)} d="M5 12h14m-7 7V5">`);
        push_element($$renderer2, "path", 82, 4);
        $$renderer2.push(`</path>`);
        pop_element();
        $$renderer2.push(`</svg>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, {
        size,
        role,
        color,
        withEvents,
        title,
        strokeWidth,
        desc,
        ariaLabel
      });
    },
    PlusOutline
  );
}
PlusOutline.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Linecompare[FILENAME] = "src/components/apps/admin/linecompare.svelte";
function Linecompare($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let oldText = $$props["oldText"];
      let newText = $$props["newText"];
      let removedColor = fallback($$props["removedColor"], "red");
      let addedColor = fallback($$props["addedColor"], "limegreen");
      let replacedColor = fallback($$props["replacedColor"], "yellow");
      let emptyColor = fallback($$props["emptyColor"], "lightgrey");
      let backgroundColor = fallback($$props["backgroundColor"], "white");
      let open = fallback($$props["open"], false);
      let color;
      color = {
        newText: {
          added: addedColor,
          removed: emptyColor,
          replaced: replacedColor
        },
        oldText: {
          added: emptyColor,
          removed: removedColor,
          replaced: replacedColor
        }
      };
      class MyChangeLine {
        oldText;
        newText;
        changeType;
        //One of added, removed, or replaced, or unchanged
        constructor(oldText2, newText2, changeType) {
          this.oldText = oldText2;
          this.newText = newText2;
          this.changeType = changeType;
          const CHANGE_TYPES = [
            "added",
            "removed",
            "replaced",
            "unchanged",
            "edit-added",
            "edit-removed"
          ];
          if (!CHANGE_TYPES.includes(changeType)) {
            throw new Error("Invalid change type");
          }
        }
        toString() {
          return `Old: ${this.oldText}, New: ${this.newText}, Change Type: ${this.changeType}`;
        }
      }
      function myDiffLines(oldString, newString) {
        let diff = diffLines(oldString, newString, { ignoreWhitespace: false, newlineIsToken: false });
        let myChangeLineArray2 = [];
        for (let i = 0; i < diff.length; i++) {
          if (i < diff.length - 1 && diff[i].removed && diff[i + 1].added) {
            let diffArrays = myDiffWordsArray(diff[i].value, diff[i + 1].value);
            myChangeLineArray2.push(new MyChangeLine(diffArrays.oldOutputArray, diffArrays.newOutputArray, "replaced"));
            i++;
          } else if (diff[i].removed && (i === diff.length - 1 || !diff[i + 1].added)) {
            myChangeLineArray2.push(new MyChangeLine([{ text: diff[i].value }], [{ text: "" }], "removed"));
          } else if (diff[i].added && (i === 0 || !diff[i - 1].removed)) {
            myChangeLineArray2.push(new MyChangeLine([{ text: "" }], [{ text: diff[i].value }], "added"));
          } else if (!diff[i].added && !diff[i].removed) {
            let unchangedLines = diff[i].value.split("\n");
            for (let j = 0; j < unchangedLines.length; j++) {
              myChangeLineArray2.push(new MyChangeLine([{ text: unchangedLines[j] }], [{ text: unchangedLines[j] }], "unchanged"));
            }
          }
        }
        return myChangeLineArray2;
      }
      function myDiffWordsArray(oldString, newString) {
        let diff = diffWords(oldString, newString, { ignoreWhitespace: true });
        let oldOutputArray = [];
        let newOutputArray = [];
        for (let i = 0; i < diff.length; i++) {
          if (diff[i].added) {
            newOutputArray.push({ text: diff[i].value, added: true });
          } else if (diff[i].removed) {
            oldOutputArray.push({ text: diff[i].value, removed: true });
          } else {
            oldOutputArray.push({ text: diff[i].value });
            newOutputArray.push({ text: diff[i].value });
          }
        }
        return { oldOutputArray, newOutputArray };
      }
      let myChangeLineArray = [];
      if (oldText && newText) {
        oldText = oldText.replace(/\r/g, "");
        newText = newText.replace(/\r/g, "");
        myChangeLineArray = myDiffLines(oldText, newText);
      }
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        Modal($$renderer3, {
          title: "Code Conversion",
          size: "md",
          class: "m-4",
          get open() {
            return open;
          },
          set open($$value) {
            open = $$value;
            $$settled = false;
          },
          children: prevent_snippet_stringification(($$renderer4) => {
            $$renderer4.push(`<div${attr_style(`background-color: ${stringify(backgroundColor)};`)} class="svelte-b99ki6">`);
            push_element($$renderer4, "div", 94, 4);
            Row($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                Col($$renderer5, {
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<h2>`);
                    push_element($$renderer6, "h2", 97, 16);
                    $$renderer6.push(`Original:</h2>`);
                    pop_element();
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> `);
                Col($$renderer5, {
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<h2>`);
                    push_element($$renderer6, "h2", 100, 16);
                    $$renderer6.push(`Remediated:</h2>`);
                    pop_element();
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!---->`);
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> <!--[-->`);
            const each_array = ensure_array_like(myChangeLineArray);
            for (let $$index_2 = 0, $$length = each_array.length; $$index_2 < $$length; $$index_2++) {
              let myChangeLine = each_array[$$index_2];
              Row($$renderer4, {
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<div class="col w-50 svelte-b99ki6"${attr_style(`background-color: ${stringify(color.oldText[myChangeLine.changeType])}`)}>`);
                  push_element($$renderer5, "div", 105, 16);
                  $$renderer5.push(`<!--[-->`);
                  const each_array_1 = ensure_array_like(myChangeLine.oldText);
                  for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
                    let oldTextObj = each_array_1[$$index];
                    if (oldTextObj.removed) {
                      $$renderer5.push("<!--[-->");
                      $$renderer5.push(`<mark${attr_style(`background-color: ${stringify(removedColor)};`)}>`);
                      push_element($$renderer5, "mark", 108, 28);
                      $$renderer5.push(`${escape_html(oldTextObj.text)}</mark>`);
                      pop_element();
                    } else {
                      $$renderer5.push("<!--[!-->");
                      $$renderer5.push(`${escape_html(oldTextObj.text)}`);
                    }
                    $$renderer5.push(`<!--]-->`);
                  }
                  $$renderer5.push(`<!--]--></div>`);
                  pop_element();
                  $$renderer5.push(` <div class="col w-50 svelte-b99ki6"${attr_style(`background-color: ${stringify(color.newText[myChangeLine.changeType])}`)}>`);
                  push_element($$renderer5, "div", 114, 16);
                  $$renderer5.push(`<!--[-->`);
                  const each_array_2 = ensure_array_like(myChangeLine.newText);
                  for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
                    let newTextObj = each_array_2[$$index_1];
                    if (newTextObj.added) {
                      $$renderer5.push("<!--[-->");
                      $$renderer5.push(`<mark${attr_style(`background-color: ${stringify(addedColor)};`)}>`);
                      push_element($$renderer5, "mark", 117, 28);
                      $$renderer5.push(`${escape_html(newTextObj.text)}</mark>`);
                      pop_element();
                    } else {
                      $$renderer5.push("<!--[!-->");
                      $$renderer5.push(`${escape_html(newTextObj.text)}`);
                    }
                    $$renderer5.push(`<!--]-->`);
                  }
                  $$renderer5.push(`<!--]--></div>`);
                  pop_element();
                }),
                $$slots: { default: true }
              });
            }
            $$renderer4.push(`<!--]--></div>`);
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
      bind_props($$props, {
        oldText,
        newText,
        removedColor,
        addedColor,
        replacedColor,
        emptyColor,
        backgroundColor,
        open
      });
    },
    Linecompare
  );
}
Linecompare.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Logs[FILENAME] = "src/components/apps/admin/logs.svelte";
function Logs($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let successCount, errorCount, filteredLogs, totalPages, helper;
      let dark = fallback($$props["dark"], false);
      let data = $$props["data"];
      let filter = fallback($$props["filter"], () => [Boolean, String], true);
      let lineCompare = false;
      let oldText = "";
      let newText = "";
      let filtered = "all";
      let fromDate = null;
      let toDate = null;
      let currentPage = 1;
      let itemsPerPage = 15;
      let searchQuery = "";
      let logs = [];
      successCount = logs.filter((log) => log.status === "success").length;
      errorCount = logs.filter((log) => log.status === "error").length;
      filteredLogs = logs.filter((log) => {
        let dateMatch = true;
        if (fromDate || toDate) {
          const timestamp = new Date(log.timestamp);
          const from = fromDate ? /* @__PURE__ */ new Date(fromDate + "T00:00:00") : null;
          const to = toDate ? /* @__PURE__ */ new Date(toDate + "T23:59:59") : null;
          if (from && timestamp < from) dateMatch = false;
          if (to && timestamp > to) dateMatch = false;
        }
        return dateMatch;
      });
      totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
      filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
      helper = {
        start: filteredLogs.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1,
        end: Math.min(currentPage * itemsPerPage, filteredLogs.length),
        total: filteredLogs.length
      };
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<main class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">`);
        push_element($$renderer3, "main", 446, 0);
        $$renderer3.push(`<div class="container-fluid px-4 py-6">`);
        push_element($$renderer3, "div", 447, 1);
        $$renderer3.push(`<div class="mb-8">`);
        push_element($$renderer3, "div", 449, 2);
        Card($$renderer3, {
          class: "border-0 shadow-lg bg-white dark:bg-gray-800",
          children: prevent_snippet_stringification(($$renderer4) => {
            CardBody($$renderer4, {
              class: "p-6",
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">`);
                push_element($$renderer5, "div", 452, 5);
                $$renderer5.push(`<div>`);
                push_element($$renderer5, "div", 453, 6);
                $$renderer5.push(`<h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">`);
                push_element($$renderer5, "h1", 454, 7);
                $$renderer5.push(`Activity Logs</h1>`);
                pop_element();
                $$renderer5.push(` <p class="text-gray-600 dark:text-gray-400">`);
                push_element($$renderer5, "p", 457, 7);
                $$renderer5.push(`Monitor system activity, user interactions, and application performance</p>`);
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
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(` <div class="row mb-6">`);
        push_element($$renderer3, "div", 467, 2);
        $$renderer3.push(`<div class="col-lg-3 col-md-6 mb-3">`);
        push_element($$renderer3, "div", 468, 3);
        Card($$renderer3, {
          class: "border-0 shadow-sm bg-primary text-white",
          children: prevent_snippet_stringification(($$renderer4) => {
            CardBody($$renderer4, {
              class: "p-4 text-center",
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<h3 class="h2 font-bold mb-1">`);
                push_element($$renderer5, "h3", 471, 6);
                $$renderer5.push(`${escape_html(logs.length)}</h3>`);
                pop_element();
                $$renderer5.push(` <p class="mb-0 opacity-75">`);
                push_element($$renderer5, "p", 472, 6);
                $$renderer5.push(`Total Logs</p>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(` <div class="col-lg-3 col-md-6 mb-3">`);
        push_element($$renderer3, "div", 476, 3);
        Card($$renderer3, {
          class: "border-0 shadow-sm bg-success text-white",
          children: prevent_snippet_stringification(($$renderer4) => {
            CardBody($$renderer4, {
              class: "p-4 text-center",
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<h3 class="h2 font-bold mb-1">`);
                push_element($$renderer5, "h3", 479, 6);
                $$renderer5.push(`${escape_html(successCount)}</h3>`);
                pop_element();
                $$renderer5.push(` <p class="mb-0 opacity-75">`);
                push_element($$renderer5, "p", 480, 6);
                $$renderer5.push(`Successful</p>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(` <div class="col-lg-3 col-md-6 mb-3">`);
        push_element($$renderer3, "div", 484, 3);
        Card($$renderer3, {
          class: "border-0 shadow-sm bg-danger text-white",
          children: prevent_snippet_stringification(($$renderer4) => {
            CardBody($$renderer4, {
              class: "p-4 text-center",
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<h3 class="h2 font-bold mb-1">`);
                push_element($$renderer5, "h3", 487, 6);
                $$renderer5.push(`${escape_html(errorCount)}</h3>`);
                pop_element();
                $$renderer5.push(` <p class="mb-0 opacity-75">`);
                push_element($$renderer5, "p", 488, 6);
                $$renderer5.push(`Errors</p>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(` <div class="col-lg-3 col-md-6 mb-3">`);
        push_element($$renderer3, "div", 492, 3);
        Card($$renderer3, {
          class: "border-0 shadow-sm bg-info text-white",
          children: prevent_snippet_stringification(($$renderer4) => {
            CardBody($$renderer4, {
              class: "p-4 text-center",
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<h3 class="h2 font-bold mb-1">`);
                push_element($$renderer5, "h3", 495, 6);
                $$renderer5.push(`${escape_html(filteredLogs.length)}</h3>`);
                pop_element();
                $$renderer5.push(` <p class="mb-0 opacity-75">`);
                push_element($$renderer5, "p", 496, 6);
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
                $$renderer5.push(`<div class="row g-3">`);
                push_element($$renderer5, "div", 505, 4);
                $$renderer5.push(`<div class="col-lg-4 col-md-6">`);
                push_element($$renderer5, "div", 506, 5);
                $$renderer5.push(`<input${attr("value", searchQuery)} placeholder="Search logs, users, or applications..." class="form-control shadow-sm border-0 bg-gray-50 dark:bg-gray-700"/>`);
                push_element($$renderer5, "input", 507, 6);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(` <div class="col-lg-2 col-md-6">`);
                push_element($$renderer5, "div", 513, 5);
                Dropdown($$renderer5, {
                  children: prevent_snippet_stringification(($$renderer6) => {
                    DropdownToggle($$renderer6, {
                      color: "outline-secondary",
                      class: "w-100 d-flex justify-content-between align-items-center",
                      children: prevent_snippet_stringification(($$renderer7) => {
                        $$renderer7.push(`<!---->Status Filter <i class="fas fa-chevron-down">`);
                        push_element($$renderer7, "i", 517, 8);
                        $$renderer7.push(`</i>`);
                        pop_element();
                      }),
                      $$slots: { default: true }
                    });
                    $$renderer6.push(`<!----> `);
                    DropdownMenu($$renderer6, {
                      children: prevent_snippet_stringification(($$renderer7) => {
                        DropdownItem($$renderer7, {
                          children: prevent_snippet_stringification(($$renderer8) => {
                            FormCheck($$renderer8, {
                              type: "radio",
                              name: "statusFilter",
                              checked: filtered === "all",
                              label: `All Logs (${stringify(logs.length)})`
                            });
                          }),
                          $$slots: { default: true }
                        });
                        $$renderer7.push(`<!----> `);
                        DropdownItem($$renderer7, {
                          children: prevent_snippet_stringification(($$renderer8) => {
                            FormCheck($$renderer8, {
                              type: "radio",
                              name: "statusFilter",
                              checked: filtered === "success",
                              label: `Success (${stringify(successCount)})`
                            });
                          }),
                          $$slots: { default: true }
                        });
                        $$renderer7.push(`<!----> `);
                        DropdownItem($$renderer7, {
                          children: prevent_snippet_stringification(($$renderer8) => {
                            FormCheck($$renderer8, {
                              type: "radio",
                              name: "statusFilter",
                              checked: filtered === "error",
                              label: `Errors (${stringify(errorCount)})`
                            });
                          }),
                          $$slots: { default: true }
                        });
                        $$renderer7.push(`<!---->`);
                      }),
                      $$slots: { default: true }
                    });
                    $$renderer6.push(`<!---->`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----></div>`);
                pop_element();
                $$renderer5.push(` <div class="col-lg-2 col-md-6">`);
                push_element($$renderer5, "div", 550, 5);
                Input($$renderer5, {
                  type: "date",
                  placeholder: "From Date",
                  class: "shadow-sm border-0 bg-gray-50 dark:bg-gray-700",
                  get value() {
                    return fromDate;
                  },
                  set value($$value) {
                    fromDate = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!----></div>`);
                pop_element();
                $$renderer5.push(` <div class="col-lg-2 col-md-6">`);
                push_element($$renderer5, "div", 558, 5);
                Input($$renderer5, {
                  type: "date",
                  placeholder: "To Date",
                  class: "shadow-sm border-0 bg-gray-50 dark:bg-gray-700",
                  get value() {
                    return toDate;
                  },
                  set value($$value) {
                    toDate = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!----></div>`);
                pop_element();
                $$renderer5.push(` <div class="col-lg-2 col-md-6">`);
                push_element($$renderer5, "div", 566, 5);
                $$renderer5.select(
                  {
                    class: "form-select shadow-sm border-0 bg-gray-50 dark:bg-gray-700",
                    value: itemsPerPage
                  },
                  ($$renderer6) => {
                    $$renderer6.option({ value: 10 }, ($$renderer7) => {
                      push_element($$renderer7, "option", 568, 7);
                      $$renderer7.push(`10 per page`);
                      pop_element();
                    });
                    $$renderer6.option({ value: 15 }, ($$renderer7) => {
                      push_element($$renderer7, "option", 569, 7);
                      $$renderer7.push(`15 per page`);
                      pop_element();
                    });
                    $$renderer6.option({ value: 25 }, ($$renderer7) => {
                      push_element($$renderer7, "option", 570, 7);
                      $$renderer7.push(`25 per page`);
                      pop_element();
                    });
                    $$renderer6.option({ value: 50 }, ($$renderer7) => {
                      push_element($$renderer7, "option", 571, 7);
                      $$renderer7.push(`50 per page`);
                      pop_element();
                    });
                  }
                );
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
                  push_element($$renderer5, "div", 582, 5);
                  Spinner($$renderer5, { color: "primary" });
                  $$renderer5.push(`<!----> <p class="mt-3 text-muted">`);
                  push_element($$renderer5, "p", 584, 6);
                  $$renderer5.push(`Loading activity logs...</p>`);
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
                  push_element($$renderer5, "div", 752, 5);
                  $$renderer5.push(`<div class="text-muted">`);
                  push_element($$renderer5, "div", 753, 6);
                  $$renderer5.push(`Showing <strong>`);
                  push_element($$renderer5, "strong", 754, 15);
                  $$renderer5.push(`${escape_html(helper.start)}</strong>`);
                  pop_element();
                  $$renderer5.push(` to <strong>`);
                  push_element($$renderer5, "strong", 754, 50);
                  $$renderer5.push(`${escape_html(helper.end)}</strong>`);
                  pop_element();
                  $$renderer5.push(` of <strong>`);
                  push_element($$renderer5, "strong", 754, 83);
                  $$renderer5.push(`${escape_html(helper.total)}</strong>`);
                  pop_element();
                  $$renderer5.push(` entries</div>`);
                  pop_element();
                  $$renderer5.push(` <nav aria-label="Log pagination">`);
                  push_element($$renderer5, "nav", 757, 6);
                  $$renderer5.push(`<ul class="pagination pagination-sm mb-0">`);
                  push_element($$renderer5, "ul", 758, 7);
                  $$renderer5.push(`<li${attr_class(`page-item ${stringify("disabled")}`)}>`);
                  push_element($$renderer5, "li", 759, 8);
                  $$renderer5.push(`<button class="page-link d-flex align-items-center gap-2"${attr("disabled", currentPage === 1, true)}>`);
                  push_element($$renderer5, "button", 760, 9);
                  $$renderer5.push(`<i class="fas fa-chevron-left">`);
                  push_element($$renderer5, "i", 765, 10);
                  $$renderer5.push(`</i>`);
                  pop_element();
                  $$renderer5.push(` Previous</button>`);
                  pop_element();
                  $$renderer5.push(`</li>`);
                  pop_element();
                  $$renderer5.push(` <!--[-->`);
                  const each_array_3 = ensure_array_like(Array.from({ length: totalPages }, (_, i) => i + 1));
                  for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
                    let page = each_array_3[$$index_3];
                    if (totalPages <= 7 || page <= 2 || page >= totalPages - 1 || Math.abs(page - currentPage) <= 1) {
                      $$renderer5.push("<!--[-->");
                      $$renderer5.push(`<li${attr_class(`page-item ${stringify(currentPage === page ? "active" : "")}`)}>`);
                      push_element($$renderer5, "li", 772, 10);
                      $$renderer5.push(`<button class="page-link">`);
                      push_element($$renderer5, "button", 773, 11);
                      $$renderer5.push(`${escape_html(page)}</button>`);
                      pop_element();
                      $$renderer5.push(`</li>`);
                      pop_element();
                    } else if (page === 3 || page === totalPages - 2) {
                      $$renderer5.push("<!--[1-->");
                      $$renderer5.push(`<li class="page-item disabled">`);
                      push_element($$renderer5, "li", 781, 10);
                      $$renderer5.push(`<span class="page-link">`);
                      push_element($$renderer5, "span", 782, 11);
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
                  push_element($$renderer5, "li", 787, 8);
                  $$renderer5.push(`<button class="page-link d-flex align-items-center gap-2"${attr("disabled", currentPage === totalPages, true)}>`);
                  push_element($$renderer5, "button", 788, 9);
                  $$renderer5.push(`Next <i class="fas fa-chevron-right">`);
                  push_element($$renderer5, "i", 794, 10);
                  $$renderer5.push(`</i>`);
                  pop_element();
                  $$renderer5.push(`</button>`);
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
        $$renderer3.push(`<!--]--></div>`);
        pop_element();
        $$renderer3.push(`</main>`);
        pop_element();
        $$renderer3.push(` `);
        Linecompare($$renderer3, {
          oldText,
          newText,
          get open() {
            return lineCompare;
          },
          set open($$value) {
            lineCompare = $$value;
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
      bind_props($$props, { dark, data, filter });
    },
    Logs
  );
}
Logs.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  ArrowLeftOutline as A,
  DownloadSolid as D,
  ExclamationCircleOutline as E,
  Logs as L,
  PlusOutline as P,
  ArrowRightOutline as a
};
