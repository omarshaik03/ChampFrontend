import { j as sanitize_props, k as rest_props, l as attributes, m as clsx, s as slot, c as bind_props, t as sanitize_slots, d as attr_class, b as attr, a as store_get, u as unsubscribe_stores, q as spread_props, e as ensure_array_like, p as prevent_snippet_stringification } from "./index2.js";
import { a5 as noop, a4 as fallback, a3 as FILENAME } from "./utils2.js";
import { p as push_element, a as pop_element } from "./dev.js";
import { a as ssr_context, e as escape_html, s as setContext, g as getContext } from "./context.js";
import { createPopper } from "@popperjs/core";
import { w as writable } from "./index.js";
import "clsx";
function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
function createEventDispatcher() {
  return noop;
}
function isObject(value) {
  const type = typeof value;
  return value !== null && (type === "object" || type === "function");
}
function getColumnSizeClass(isXs, colWidth, colSize) {
  if (colSize === true || colSize === "") {
    return isXs ? "col" : `col-${colWidth}`;
  } else if (colSize === "auto") {
    return isXs ? "col-auto" : `col-${colWidth}-auto`;
  }
  return isXs ? `col-${colSize}` : `col-${colWidth}-${colSize}`;
}
function toClassName(value) {
  let result = "";
  if (typeof value === "string" || typeof value === "number") {
    result += value;
  } else if (typeof value === "object") {
    if (Array.isArray(value)) {
      result = value.map(toClassName).filter(Boolean).join(" ");
    } else {
      for (let key in value) {
        if (value[key]) {
          result && (result += " ");
          result += key;
        }
      }
    }
  }
  return result;
}
const classnames = (...args) => args.map(toClassName).filter(Boolean).join(" ");
function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
Collapse[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/Collapse/Collapse.svelte";
function Collapse($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "isOpen",
    "class",
    "horizontal",
    "navbar",
    "onEntering",
    "onEntered",
    "onExiting",
    "onExited",
    "expand",
    "toggler"
  ]);
  $$renderer.component(
    ($$renderer2) => {
      let classes;
      const dispatch = createEventDispatcher();
      let isOpen = fallback($$props["isOpen"], false);
      let className = fallback($$props["class"], "");
      let horizontal = fallback($$props["horizontal"], false);
      let navbar = fallback($$props["navbar"], false);
      let onEntering = fallback($$props["onEntering"], () => dispatch("opening"));
      let onEntered = fallback($$props["onEntered"], () => dispatch("open"));
      let onExiting = fallback($$props["onExiting"], () => dispatch("closing"));
      let onExited = fallback($$props["onExited"], () => dispatch("close"));
      let expand = fallback($$props["expand"], false);
      let toggler = fallback($$props["toggler"], null);
      let windowWidth = 0;
      let _wasMaximized = false;
      const minWidth = {};
      minWidth["xs"] = 0;
      minWidth["sm"] = 576;
      minWidth["md"] = 768;
      minWidth["lg"] = 992;
      minWidth["xl"] = 1200;
      classes = classnames(className, { "collapse-horizontal": horizontal, "navbar-collapse": navbar });
      if (navbar && expand) {
        if (windowWidth >= minWidth[expand] && !isOpen) {
          isOpen = true;
          _wasMaximized = true;
        } else if (windowWidth < minWidth[expand] && _wasMaximized) {
          isOpen = false;
          _wasMaximized = false;
        }
      }
      if (isOpen) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div${attributes({
          style: navbar ? void 0 : "overflow: hidden;",
          ...$$restProps,
          class: clsx(classes)
        })}>`);
        push_element($$renderer2, "div", 64, 2);
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {}, null);
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, {
        isOpen,
        class: className,
        horizontal,
        navbar,
        onEntering,
        onEntered,
        onExiting,
        onExited,
        expand,
        toggler
      });
    },
    Collapse
  );
}
Collapse.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Alert[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/Alert/Alert.svelte";
function Alert($$renderer, $$props) {
  const $$slots = sanitize_slots($$props);
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "class",
    "content",
    "closeAriaLabel",
    "closeClassName",
    "color",
    "dismissible",
    "fade",
    "heading",
    "isOpen",
    "toggle",
    "theme",
    "transition"
  ]);
  $$renderer.component(
    ($$renderer2) => {
      let showClose, classes, closeClassNames;
      let className = fallback($$props["class"], "");
      let content = fallback($$props["content"], void 0);
      let closeAriaLabel = fallback($$props["closeAriaLabel"], "Close");
      let closeClassName = fallback($$props["closeClassName"], "");
      let color = fallback($$props["color"], "success");
      let dismissible = fallback($$props["dismissible"], false);
      let fade = fallback($$props["fade"], true);
      let heading = fallback($$props["heading"], "");
      let isOpen = fallback($$props["isOpen"], true);
      let toggle = fallback($$props["toggle"], void 0);
      let theme = fallback($$props["theme"], void 0);
      let transition = fallback($$props["transition"], () => ({ duration: fade ? 400 : 0 }), true);
      showClose = dismissible || toggle;
      classes = classnames(className, "alert", `alert-${color}`, { "alert-dismissible": showClose });
      closeClassNames = classnames("btn-close", closeClassName);
      if (isOpen) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div${attributes({
          ...$$restProps,
          "data-bs-theme": theme,
          class: clsx(classes),
          role: "alert"
        })}>`);
        push_element($$renderer2, "div", 97, 2);
        if (heading || $$slots.heading) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<h4 class="alert-heading">`);
          push_element($$renderer2, "h4", 99, 6);
          $$renderer2.push(`${escape_html(heading)}<!--[-->`);
          slot($$renderer2, $$props, "heading", {}, null);
          $$renderer2.push(`<!--]--></h4>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (showClose) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<button type="button"${attr_class(clsx(closeClassNames))}${attr("aria-label", closeAriaLabel)}>`);
          push_element($$renderer2, "button", 104, 6);
          $$renderer2.push(`</button>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (content) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`${escape_html(content)}`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<!--[-->`);
          slot($$renderer2, $$props, "default", {}, null);
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, {
        class: className,
        content,
        closeAriaLabel,
        closeClassName,
        color,
        dismissible,
        fade,
        heading,
        isOpen,
        toggle,
        theme,
        transition
      });
    },
    Alert
  );
}
Alert.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Badge[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/Badge/Badge.svelte";
function Badge($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "ariaLabel",
    "border",
    "class",
    "content",
    "color",
    "href",
    "indicator",
    "pill",
    "positioned",
    "placement",
    "shadow",
    "theme"
  ]);
  $$renderer.component(
    ($$renderer2) => {
      let classes;
      let ariaLabel = fallback($$props["ariaLabel"], "");
      let border = fallback($$props["border"], false);
      let className = fallback($$props["class"], "");
      let content = fallback($$props["content"], "");
      let color = fallback($$props["color"], "secondary");
      let href = fallback($$props["href"], "");
      let indicator = fallback($$props["indicator"], false);
      let pill = fallback($$props["pill"], false);
      let positioned = fallback($$props["positioned"], false);
      let placement = fallback($$props["placement"], "top-0 start-100");
      let shadow = fallback($$props["shadow"], false);
      let theme = fallback($$props["theme"], void 0);
      classes = classnames(
        "badge",
        `text-bg-${color}`,
        pill ? "rounded-pill" : false,
        positioned ? "position-absolute translate-middle" : false,
        positioned ? placement : false,
        indicator ? "p-2" : false,
        border ? typeof border === "string" ? border : "border" : false,
        shadow ? typeof shadow === "string" ? shadow : "shadow" : false,
        className
      );
      if (href) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<a${attributes({
          ...$$restProps,
          href,
          class: clsx(classes),
          "data-bs-theme": theme
        })}>`);
        push_element($$renderer2, "a", 103, 2);
        if (content) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`${escape_html(content)}`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<!--[-->`);
          slot($$renderer2, $$props, "default", {}, null);
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--> `);
        if (positioned || indicator) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span class="visually-hidden">`);
          push_element($$renderer2, "span", 110, 6);
          $$renderer2.push(`${escape_html(ariaLabel)}</span>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></a>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<span${attributes({
          ...$$restProps,
          class: clsx(classes),
          "data-bs-theme": theme
        })}>`);
        push_element($$renderer2, "span", 114, 2);
        if (content) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`${escape_html(content)}`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<!--[-->`);
          slot($$renderer2, $$props, "default", {}, null);
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--> `);
        if (positioned || indicator) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span class="visually-hidden">`);
          push_element($$renderer2, "span", 121, 6);
          $$renderer2.push(`${escape_html(ariaLabel)}</span>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></span>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, {
        ariaLabel,
        border,
        class: className,
        content,
        color,
        href,
        indicator,
        pill,
        positioned,
        placement,
        shadow,
        theme
      });
    },
    Badge
  );
}
Badge.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Button[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/Button/Button.svelte";
function Button($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "class",
    "active",
    "block",
    "content",
    "close",
    "color",
    "disabled",
    "href",
    "inner",
    "outline",
    "size",
    "value"
  ]);
  $$renderer.component(
    ($$renderer2) => {
      let ariaLabel, classes, defaultAriaLabel;
      let className = fallback($$props["class"], "");
      let active = fallback($$props["active"], false);
      let block = fallback($$props["block"], false);
      let content = fallback($$props["content"], "");
      let close = fallback($$props["close"], false);
      let color = fallback($$props["color"], "secondary");
      let disabled = fallback($$props["disabled"], false);
      let href = fallback($$props["href"], "");
      let inner = fallback($$props["inner"], void 0);
      let outline = fallback($$props["outline"], false);
      let size = fallback($$props["size"], "");
      let value = fallback($$props["value"], "");
      ariaLabel = $$sanitized_props["aria-label"];
      classes = classnames(className, close ? "btn-close" : "btn", close || `btn${outline ? "-outline" : ""}-${color}`, size ? `btn-${size}` : false, block ? "d-block w-100" : false, { active });
      defaultAriaLabel = close ? "Close" : null;
      if (href) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<a${attributes(
          {
            ...$$restProps,
            class: clsx(classes),
            href,
            "aria-label": ariaLabel || defaultAriaLabel
          },
          void 0,
          { disabled }
        )}>`);
        push_element($$renderer2, "a", 107, 2);
        if (content) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`${escape_html(content)}`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<!--[-->`);
          slot($$renderer2, $$props, "default", {}, null);
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--></a>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<button${attributes({
          ...$$restProps,
          class: clsx(classes),
          disabled,
          value,
          "aria-label": ariaLabel || defaultAriaLabel
        })}>`);
        push_element($$renderer2, "button", 125, 2);
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {}, () => {
          if (content) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`${escape_html(content)}`);
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push(`<!--[-->`);
            slot($$renderer2, $$props, "default", {}, null);
            $$renderer2.push(`<!--]-->`);
          }
          $$renderer2.push(`<!--]-->`);
        });
        $$renderer2.push(`<!--]--></button>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, {
        class: className,
        active,
        block,
        content,
        close,
        color,
        disabled,
        href,
        inner,
        outline,
        size,
        value
      });
    },
    Button
  );
}
Button.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
function createPopperActions(initOptions) {
  let contentNode;
  let options = initOptions;
  let popperInstance = null;
  let referenceNode;
  const initPopper = () => {
    if (referenceNode && contentNode) {
      popperInstance = createPopper(referenceNode, contentNode, options);
    }
  };
  const deinitPopper = () => {
    if (popperInstance) {
      popperInstance.destroy();
      popperInstance = null;
    }
  };
  const referenceAction = (node) => {
    referenceNode = node;
    initPopper();
    return {
      destroy() {
        deinitPopper();
      }
    };
  };
  const contentAction = (node, contentOptions) => {
    contentNode = node;
    options = Object.assign(Object.assign({}, initOptions), contentOptions);
    initPopper();
    return {
      update(newContentOptions) {
        options = Object.assign(Object.assign({}, initOptions), newContentOptions);
        if (popperInstance && options) {
          popperInstance.setOptions(options);
        }
      },
      destroy() {
        deinitPopper();
      }
    };
  };
  return [referenceAction, contentAction, () => popperInstance];
}
const createContext = () => writable({});
Dropdown[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/Dropdown/Dropdown.svelte";
function Dropdown($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "class",
    "active",
    "autoClose",
    "direction",
    "dropup",
    "group",
    "inNavbar",
    "isOpen",
    "nav",
    "setActiveFromChild",
    "size",
    "theme",
    "toggle"
  ]);
  $$renderer.component(
    ($$renderer2) => {
      let subItemIsActive, handleToggle, classes;
      const noop2 = () => void 0;
      let context = createContext();
      setContext("dropdownContext", context);
      const navbarContext = getContext("navbar");
      let className = fallback($$props["class"], "");
      let active = fallback($$props["active"], false);
      let autoClose = fallback($$props["autoClose"], true);
      let direction = fallback($$props["direction"], "down");
      let dropup = fallback($$props["dropup"], false);
      let group = fallback($$props["group"], false);
      let inNavbar = fallback($$props["inNavbar"], () => navbarContext ? navbarContext.inNavbar : false, true);
      let isOpen = fallback($$props["isOpen"], false);
      let nav = fallback($$props["nav"], false);
      let setActiveFromChild = fallback($$props["setActiveFromChild"], false);
      let size = fallback($$props["size"], "");
      let theme = fallback($$props["theme"], null);
      let toggle = fallback($$props["toggle"], void 0);
      const [popperRef, popperContent] = createPopperActions();
      const validDirections = ["up", "down", "left", "right", "start", "end"];
      if (validDirections.indexOf(direction) === -1) {
        throw new Error(`Invalid direction sent: '${direction}' is not one of 'up', 'down', 'left', 'right', 'start', 'end'`);
      }
      let component;
      let dropdownDirection;
      function handleDocumentClick(e) {
        if (e && (e.which === 3 || e.type === "keyup" && e.which !== 9)) return;
        if (component.contains(e.target) && component !== e.target && (e.type !== "keyup" || e.which === 9)) {
          return;
        }
        if (autoClose === true || autoClose === "outside") {
          handleToggle(e);
        }
      }
      onDestroy(() => {
        if (typeof document !== "undefined") {
          ["click", "touchstart", "keyup"].forEach((event) => document.removeEventListener(event, handleDocumentClick, true));
        }
      });
      subItemIsActive = false;
      {
        if (direction === "left") dropdownDirection = "start";
        else if (direction === "right") dropdownDirection = "end";
        else dropdownDirection = direction;
      }
      handleToggle = toggle || (() => isOpen = !isOpen);
      classes = classnames(className, direction !== "down" && `drop${dropdownDirection}`, nav && active ? "active" : false, setActiveFromChild && subItemIsActive ? "active" : false, {
        "btn-group": group,
        [`btn-group-${size}`]: !!size,
        dropdown: !group,
        show: isOpen,
        "nav-item": nav
      });
      {
        if (typeof document !== "undefined") {
          if (isOpen) {
            ["click", "touchstart", "keyup"].forEach((event) => document.addEventListener(event, handleDocumentClick, true));
          } else {
            ["click", "touchstart", "keyup"].forEach((event) => document.removeEventListener(event, handleDocumentClick, true));
          }
        }
      }
      {
        context.update(() => {
          return {
            toggle: handleToggle,
            isOpen,
            autoClose,
            direction: direction === "down" && dropup ? "up" : direction,
            inNavbar: nav || inNavbar,
            popperRef: nav ? noop2 : popperRef,
            popperContent: nav ? noop2 : popperContent
          };
        });
      }
      if (nav) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<li${attributes({
          ...$$restProps,
          class: clsx(classes),
          "data-bs-theme": theme
        })}>`);
        push_element($$renderer2, "li", 187, 2);
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {}, null);
        $$renderer2.push(`<!--]--></li>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div${attributes({
          ...$$restProps,
          class: clsx(classes),
          "data-bs-theme": theme
        })}>`);
        push_element($$renderer2, "div", 191, 2);
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {}, null);
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, {
        class: className,
        active,
        autoClose,
        direction,
        dropup,
        group,
        inNavbar,
        isOpen,
        nav,
        setActiveFromChild,
        size,
        theme,
        toggle
      });
    },
    Dropdown
  );
}
Dropdown.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Card[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/Card/Card.svelte";
function Card($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "body", "color", "inverse", "outline", "theme"]);
  $$renderer.component(
    ($$renderer2) => {
      let classes;
      let className = fallback($$props["class"], "");
      let body = fallback($$props["body"], false);
      let color = fallback($$props["color"], "");
      let inverse = fallback($$props["inverse"], false);
      let outline = fallback($$props["outline"], false);
      let theme = fallback($$props["theme"], void 0);
      classes = classnames(className, "card", inverse ? "text-white" : false, body ? "card-body" : false, color ? `${outline ? "border" : "bg"}-${color}` : false);
      $$renderer2.push(`<div${attributes({
        ...$$restProps,
        "data-bs-theme": theme,
        class: clsx(classes)
      })}>`);
      push_element($$renderer2, "div", 56, 0);
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      bind_props($$props, { class: className, body, color, inverse, outline, theme });
    },
    Card
  );
}
Card.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
CardBody[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/CardBody/CardBody.svelte";
function CardBody($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class"]);
  $$renderer.component(
    ($$renderer2) => {
      let classes;
      let className = fallback($$props["class"], "");
      classes = classnames(className, "card-body");
      $$renderer2.push(`<div${attributes({ ...$$restProps, class: clsx(classes) })}>`);
      push_element($$renderer2, "div", 15, 0);
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      bind_props($$props, { class: className });
    },
    CardBody
  );
}
CardBody.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
CardFooter[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/CardFooter/CardFooter.svelte";
function CardFooter($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class"]);
  $$renderer.component(
    ($$renderer2) => {
      let classes;
      let className = fallback($$props["class"], "");
      classes = classnames(className, "card-footer");
      $$renderer2.push(`<div${attributes({ ...$$restProps, class: clsx(classes) })}>`);
      push_element($$renderer2, "div", 15, 0);
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      bind_props($$props, { class: className });
    },
    CardFooter
  );
}
CardFooter.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
CardHeader[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/CardHeader/CardHeader.svelte";
function CardHeader($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "tag"]);
  $$renderer.component(
    ($$renderer2) => {
      let classes;
      let className = fallback($$props["class"], "");
      let tag = fallback($$props["tag"], "div");
      classes = classnames(className, "card-header");
      if (tag === "h3") {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<h3${attributes({ ...$$restProps, class: clsx(classes) })}>`);
        push_element($$renderer2, "h3", 24, 2);
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {}, null);
        $$renderer2.push(`<!--]--></h3>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div${attributes({ ...$$restProps, class: clsx(classes) })}>`);
        push_element($$renderer2, "div", 29, 2);
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {}, null);
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, { class: className, tag });
    },
    CardHeader
  );
}
CardHeader.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
CardText[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/CardText/CardText.svelte";
function CardText($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class"]);
  $$renderer.component(
    ($$renderer2) => {
      let classes;
      let className = fallback($$props["class"], "");
      classes = classnames(className, "card-text");
      $$renderer2.push(`<p${attributes({ ...$$restProps, class: clsx(classes) })}>`);
      push_element($$renderer2, "p", 15, 0);
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]--></p>`);
      pop_element();
      bind_props($$props, { class: className });
    },
    CardText
  );
}
CardText.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
CardTitle[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/CardTitle/CardTitle.svelte";
function CardTitle($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class"]);
  $$renderer.component(
    ($$renderer2) => {
      let classes;
      let className = fallback($$props["class"], "");
      classes = classnames(className, "card-title");
      $$renderer2.push(`<h5${attributes({ ...$$restProps, class: clsx(classes) })}>`);
      push_element($$renderer2, "h5", 15, 0);
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]--></h5>`);
      pop_element();
      bind_props($$props, { class: className });
    },
    CardTitle
  );
}
CardTitle.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Col[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/Col/Col.svelte";
function Col($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "xs", "sm", "md", "lg", "xl", "xxl"]);
  $$renderer.component(
    ($$renderer2) => {
      let className = fallback($$props["class"], "");
      let xs = fallback($$props["xs"], void 0);
      let sm = fallback($$props["sm"], void 0);
      let md = fallback($$props["md"], void 0);
      let lg = fallback($$props["lg"], void 0);
      let xl = fallback($$props["xl"], void 0);
      let xxl = fallback($$props["xxl"], void 0);
      const colClasses = [];
      const lookup = { xs, sm, md, lg, xl, xxl };
      Object.keys(lookup).forEach((colWidth) => {
        const columnProp = lookup[colWidth];
        if (!columnProp && columnProp !== "") {
          return;
        }
        const isXs = colWidth === "xs";
        if (isObject(columnProp)) {
          const colSizeInterfix = isXs ? "-" : `-${colWidth}-`;
          const colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);
          if (columnProp.size || columnProp.size === "") {
            colClasses.push(colClass);
          }
          if (columnProp.push) {
            colClasses.push(`push${colSizeInterfix}${columnProp.push}`);
          }
          if (columnProp.pull) {
            colClasses.push(`pull${colSizeInterfix}${columnProp.pull}`);
          }
          if (columnProp.offset) {
            colClasses.push(`offset${colSizeInterfix}${columnProp.offset}`);
          }
          if (columnProp.order) {
            colClasses.push(`order${colSizeInterfix}${columnProp.order}`);
          }
        } else {
          colClasses.push(getColumnSizeClass(isXs, colWidth, columnProp));
        }
      });
      if (!colClasses.length) {
        colClasses.push("col");
      }
      if (className) {
        colClasses.push(className);
      }
      $$renderer2.push(`<div${attributes({ ...$$restProps, class: clsx(colClasses.join(" ")) })}>`);
      push_element($$renderer2, "div", 64, 0);
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      bind_props($$props, { class: className, xs, sm, md, lg, xl, xxl });
    },
    Col
  );
}
Col.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Container[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/Container/Container.svelte";
function Container($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "sm", "md", "lg", "xl", "xxl", "fluid"]);
  $$renderer.component(
    ($$renderer2) => {
      let classes;
      let className = fallback($$props["class"], "");
      let sm = fallback($$props["sm"], void 0);
      let md = fallback($$props["md"], void 0);
      let lg = fallback($$props["lg"], void 0);
      let xl = fallback($$props["xl"], void 0);
      let xxl = fallback($$props["xxl"], void 0);
      let fluid = fallback($$props["fluid"], false);
      classes = classnames(className, {
        "container-sm": sm,
        "container-md": md,
        "container-lg": lg,
        "container-xl": xl,
        "container-xxl": xxl,
        "container-fluid": fluid,
        container: !sm && !md && !lg && !xl && !xxl && !fluid
      });
      $$renderer2.push(`<div${attributes({ ...$$restProps, class: clsx(classes) })}>`);
      push_element($$renderer2, "div", 60, 0);
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      bind_props($$props, { class: className, sm, md, lg, xl, xxl, fluid });
    },
    Container
  );
}
Container.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
DropdownItem[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/DropdownItem/DropdownItem.svelte";
function DropdownItem($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "class",
    "active",
    "disabled",
    "divider",
    "header",
    "toggle",
    "href"
  ]);
  $$renderer.component(
    ($$renderer2) => {
      let classes;
      getContext("dropdownContext");
      let className = fallback($$props["class"], "");
      let active = fallback($$props["active"], false);
      let disabled = fallback($$props["disabled"], false);
      let divider = fallback($$props["divider"], false);
      let header = fallback($$props["header"], false);
      let toggle = fallback($$props["toggle"], true);
      let href = fallback($$props["href"], "");
      classes = classnames(className, {
        disabled,
        "dropdown-item": !divider && !header,
        active,
        "dropdown-header": header,
        "dropdown-divider": divider
      });
      $$renderer2.push(`<li>`);
      push_element($$renderer2, "li", 37, 0);
      if (header) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<h6${attributes({ ...$$restProps, class: clsx(classes) })}>`);
        push_element($$renderer2, "h6", 39, 4);
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {}, null);
        $$renderer2.push(`<!--]--></h6>`);
        pop_element();
      } else if (divider) {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<div${attributes({ ...$$restProps, class: clsx(classes) })}>`);
        push_element($$renderer2, "div", 44, 4);
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {}, null);
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      } else if (href) {
        $$renderer2.push("<!--[2-->");
        $$renderer2.push(`<a${attributes({ ...$$restProps, click: true, href, class: clsx(classes) })}>`);
        push_element($$renderer2, "a", 48, 4);
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {}, null);
        $$renderer2.push(`<!--]--></a>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<button${attributes({ type: "button", ...$$restProps, class: clsx(classes) })}>`);
        push_element($$renderer2, "button", 52, 4);
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {}, null);
        $$renderer2.push(`<!--]--></button>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></li>`);
      pop_element();
      bind_props($$props, {
        class: className,
        active,
        disabled,
        divider,
        header,
        toggle,
        href
      });
    },
    DropdownItem
  );
}
DropdownItem.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
DropdownMenu[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/DropdownMenu/DropdownMenu.svelte";
function DropdownMenu($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "end", "right"]);
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      let classes;
      const context = getContext("dropdownContext");
      let className = fallback($$props["class"], "");
      let end = fallback($$props["end"], false);
      let right = fallback($$props["right"], false);
      const popperPlacement = (direction, end2) => {
        let prefix = direction;
        if (direction === "up") {
          prefix = "top";
        }
        if (direction === "down") {
          prefix = "bottom";
        }
        let suffix = end2 ? "end" : "start";
        return `${prefix}-${suffix}`;
      };
      ({
        modifiers: [
          { name: "flip" },
          { name: "offset", options: { offset: [0, 2] } }
        ],
        placement: popperPlacement(store_get($$store_subs ??= {}, "$context", context).direction, end || right)
      });
      classes = classnames(className, "dropdown-menu", {
        "dropdown-menu-end": end || right,
        show: store_get($$store_subs ??= {}, "$context", context).isOpen
      });
      $$renderer2.push(`<ul${attributes({
        ...$$restProps,
        class: clsx(classes),
        "data-bs-popper": store_get($$store_subs ??= {}, "$context", context).inNavbar ? "static" : void 0
      })}>`);
      push_element($$renderer2, "ul", 46, 0);
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]--></ul>`);
      pop_element();
      if ($$store_subs) unsubscribe_stores($$store_subs);
      bind_props($$props, { class: className, end, right });
    },
    DropdownMenu
  );
}
DropdownMenu.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
DropdownToggle[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/DropdownToggle/DropdownToggle.svelte";
function DropdownToggle($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "class",
    "ariaLabel",
    "active",
    "block",
    "caret",
    "color",
    "disabled",
    "inner",
    "nav",
    "outline",
    "size",
    "split",
    "tag"
  ]);
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      let classes, btnClasses;
      const context = getContext("dropdownContext");
      let className = fallback($$props["class"], "");
      let ariaLabel = fallback($$props["ariaLabel"], "Toggle Dropdown");
      let active = fallback($$props["active"], false);
      let block = fallback($$props["block"], false);
      let caret = fallback($$props["caret"], false);
      let color = fallback($$props["color"], "secondary");
      let disabled = fallback($$props["disabled"], false);
      let inner = fallback($$props["inner"], void 0);
      let nav = fallback($$props["nav"], false);
      let outline = fallback($$props["outline"], false);
      let size = fallback($$props["size"], "");
      let split = fallback($$props["split"], false);
      let tag = fallback($$props["tag"], null);
      classes = classnames(className, {
        "dropdown-toggle": caret || split,
        "dropdown-toggle-split": split,
        "nav-link": nav,
        show: store_get($$store_subs ??= {}, "$context", context).isOpen
      });
      btnClasses = classnames(classes, "btn", `btn${outline ? "-outline" : ""}-${color}`, size ? `btn-${size}` : false, block ? "d-block w-100" : false, { active });
      if (nav) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<a${attributes({
          ...$$restProps,
          href: "#nav",
          "aria-expanded": store_get($$store_subs ??= {}, "$context", context).isOpen,
          class: clsx(classes)
        })}>`);
        push_element($$renderer2, "a", 53, 2);
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {}, () => {
          $$renderer2.push(`<span class="visually-hidden">`);
          push_element($$renderer2, "span", 64, 6);
          $$renderer2.push(`${escape_html(ariaLabel)}</span>`);
          pop_element();
        });
        $$renderer2.push(`<!--]--></a>`);
        pop_element();
      } else if (tag === "div") {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<div${attributes({
          ...$$restProps,
          "aria-expanded": store_get($$store_subs ??= {}, "$context", context).isOpen,
          class: clsx(classes)
        })}>`);
        push_element($$renderer2, "div", 69, 2);
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {}, () => {
          $$renderer2.push(`<span class="visually-hidden">`);
          push_element($$renderer2, "span", 79, 6);
          $$renderer2.push(`${escape_html(ariaLabel)}</span>`);
          pop_element();
        });
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      } else if (tag === "span") {
        $$renderer2.push("<!--[2-->");
        $$renderer2.push(`<span${attributes({
          ...$$restProps,
          "aria-expanded": store_get($$store_subs ??= {}, "$context", context).isOpen,
          class: clsx(classes)
        })}>`);
        push_element($$renderer2, "span", 84, 2);
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {}, () => {
          $$renderer2.push(`<span class="visually-hidden">`);
          push_element($$renderer2, "span", 94, 6);
          $$renderer2.push(`${escape_html(ariaLabel)}</span>`);
          pop_element();
        });
        $$renderer2.push(`<!--]--></span>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<button${attributes({
          ...$$restProps,
          type: "button",
          "aria-expanded": store_get($$store_subs ??= {}, "$context", context).isOpen,
          class: clsx(btnClasses)
        })}>`);
        push_element($$renderer2, "button", 98, 2);
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {}, () => {
          $$renderer2.push(`<span class="visually-hidden">`);
          push_element($$renderer2, "span", 109, 6);
          $$renderer2.push(`${escape_html(ariaLabel)}</span>`);
          pop_element();
        });
        $$renderer2.push(`<!--]--></button>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
      if ($$store_subs) unsubscribe_stores($$store_subs);
      bind_props($$props, {
        class: className,
        ariaLabel,
        active,
        block,
        caret,
        color,
        disabled,
        inner,
        nav,
        outline,
        size,
        split,
        tag
      });
    },
    DropdownToggle
  );
}
DropdownToggle.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Form[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/Form/Form.svelte";
function Form($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "inline", "validated"]);
  $$renderer.component(
    ($$renderer2) => {
      let classes;
      let className = fallback($$props["class"], "");
      let inline = fallback($$props["inline"], false);
      let validated = fallback($$props["validated"], false);
      classes = classnames(className, { "form-inline": inline, "was-validated": validated });
      $$renderer2.push(`<form${attributes({ ...$$restProps, class: clsx(classes) })}>`);
      push_element($$renderer2, "form", 15, 0);
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]--></form>`);
      pop_element();
      bind_props($$props, { class: className, inline, validated });
    },
    Form
  );
}
Form.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
FormCheck[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/FormCheck/FormCheck.svelte";
function FormCheck($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "class",
    "checked",
    "disabled",
    "group",
    "id",
    "inline",
    "inner",
    "invalid",
    "label",
    "name",
    "reverse",
    "size",
    "type",
    "valid",
    "value"
  ]);
  $$renderer.component(
    ($$renderer2) => {
      let classes, inputClasses, idFor;
      let className = fallback($$props["class"], "");
      let checked = fallback($$props["checked"], false);
      let disabled = fallback($$props["disabled"], false);
      let group = fallback($$props["group"], void 0);
      let id = fallback($$props["id"], void 0);
      let inline = fallback($$props["inline"], false);
      let inner = fallback($$props["inner"], void 0);
      let invalid = fallback($$props["invalid"], false);
      let label = fallback($$props["label"], "");
      let name = fallback($$props["name"], "");
      let reverse = fallback($$props["reverse"], false);
      let size = fallback($$props["size"], "");
      let type = fallback($$props["type"], "checkbox");
      let valid = fallback($$props["valid"], false);
      let value = fallback($$props["value"], void 0);
      classes = classnames(className, "form-check", {
        "form-check-reverse": reverse,
        "form-switch": type === "switch",
        "form-check-inline": inline,
        [`form-control-${size}`]: size
      });
      inputClasses = classnames("form-check-input", { "is-invalid": invalid, "is-valid": valid });
      idFor = id || label;
      $$renderer2.push(`<div${attr_class(clsx(classes))}>`);
      push_element($$renderer2, "div", 35, 0);
      if (type === "radio") {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<input${attributes(
          {
            ...$$restProps,
            class: clsx(inputClasses),
            id: idFor,
            type: "radio",
            checked: group === value,
            disabled,
            name,
            value
          },
          void 0,
          void 0,
          void 0,
          4
        )}/>`);
        push_element($$renderer2, "input", 37, 4);
        pop_element();
      } else if (type === "switch") {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<input${attributes(
          {
            ...$$restProps,
            class: clsx(inputClasses),
            id: idFor,
            type: "checkbox",
            checked,
            disabled,
            name,
            value
          },
          void 0,
          void 0,
          void 0,
          4
        )}/>`);
        push_element($$renderer2, "input", 53, 4);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<input${attributes(
          {
            ...$$restProps,
            class: clsx(inputClasses),
            id: idFor,
            type: "checkbox",
            checked,
            disabled,
            name,
            value
          },
          void 0,
          void 0,
          void 0,
          4
        )}/>`);
        push_element($$renderer2, "input", 69, 4);
        pop_element();
      }
      $$renderer2.push(`<!--]--> `);
      if (label) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<label class="form-check-label"${attr("for", idFor)}>`);
        push_element($$renderer2, "label", 86, 4);
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "label", {}, () => {
          $$renderer2.push(`${escape_html(label)}`);
        });
        $$renderer2.push(`<!--]--></label>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      bind_props($$props, {
        class: className,
        checked,
        disabled,
        group,
        id,
        inline,
        inner,
        invalid,
        label,
        name,
        reverse,
        size,
        type,
        valid,
        value
      });
    },
    FormCheck
  );
}
FormCheck.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
FormFeedback[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/FormFeedback/FormFeedback.svelte";
function FormFeedback($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "valid", "tooltip"]);
  $$renderer.component(
    ($$renderer2) => {
      let className = fallback($$props["class"], "");
      let valid = fallback($$props["valid"], void 0);
      let tooltip = fallback($$props["tooltip"], false);
      let classes;
      {
        const validMode = tooltip ? "tooltip" : "feedback";
        classes = classnames(className, valid ? `valid-${validMode}` : `invalid-${validMode}`);
      }
      $$renderer2.push(`<div${attributes({ ...$$restProps, class: clsx(classes) })}>`);
      push_element($$renderer2, "div", 17, 0);
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      bind_props($$props, { class: className, valid, tooltip });
    },
    FormFeedback
  );
}
FormFeedback.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
FormGroup[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/FormGroup/FormGroup.svelte";
function FormGroup($$renderer, $$props) {
  const $$slots = sanitize_slots($$props);
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "class",
    "check",
    "disabled",
    "floating",
    "inline",
    "label",
    "row",
    "spacing",
    "tag"
  ]);
  $$renderer.component(
    ($$renderer2) => {
      let classes;
      let className = fallback($$props["class"], "");
      let check = fallback($$props["check"], false);
      let disabled = fallback($$props["disabled"], false);
      let floating = fallback($$props["floating"], false);
      let inline = fallback($$props["inline"], false);
      let label = fallback($$props["label"], "");
      let row = fallback($$props["row"], false);
      let spacing = fallback($$props["spacing"], "mb-3");
      let tag = fallback($$props["tag"], null);
      classes = classnames(className, spacing, {
        row,
        "form-check": check,
        "form-check-inline": check && inline,
        "form-floating": floating,
        disabled: check && disabled
      });
      if (tag === "fieldset") {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<fieldset${attributes({ ...$$restProps, class: clsx(classes) })}>`);
        push_element($$renderer2, "fieldset", 69, 2);
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {}, null);
        $$renderer2.push(`<!--]--> `);
        if (label || $$slots.label) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<label>`);
          push_element($$renderer2, "label", 73, 6);
          $$renderer2.push(`${escape_html(label)} <!--[-->`);
          slot($$renderer2, $$props, "label", {}, null);
          $$renderer2.push(`<!--]--></label>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></fieldset>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div${attributes({ ...$$restProps, class: clsx(classes) })}>`);
        push_element($$renderer2, "div", 80, 2);
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {}, null);
        $$renderer2.push(`<!--]--> `);
        if (label || $$slots.label) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<label>`);
          push_element($$renderer2, "label", 84, 6);
          $$renderer2.push(`${escape_html(label)} <!--[-->`);
          slot($$renderer2, $$props, "label", {}, null);
          $$renderer2.push(`<!--]--></label>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, {
        class: className,
        check,
        disabled,
        floating,
        inline,
        label,
        row,
        spacing,
        tag
      });
    },
    FormGroup
  );
}
FormGroup.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Icon[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/Icon/Icon.svelte";
function Icon($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "name"]);
  $$renderer.component(
    ($$renderer2) => {
      let classes;
      let className = fallback($$props["class"], "");
      let name = fallback($$props["name"], "");
      classes = classnames(className, `bi-${name}`);
      $$renderer2.push(`<i${attributes({ ...$$restProps, class: clsx(classes) })}>`);
      push_element($$renderer2, "i", 22, 0);
      $$renderer2.push(`</i>`);
      pop_element();
      bind_props($$props, { class: className, name });
    },
    Icon
  );
}
Icon.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
InlineContainer[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/InlineContainer/InlineContainer.svelte";
function InlineContainer($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 5, 0);
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
    },
    InlineContainer
  );
}
InlineContainer.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Input[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/Input/Input.svelte";
function Input($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "class",
    "bsSize",
    "checked",
    "color",
    "disabled",
    "feedback",
    "files",
    "group",
    "inner",
    "invalid",
    "label",
    "max",
    "min",
    "multiple",
    "name",
    "placeholder",
    "plaintext",
    "readonly",
    "reverse",
    "size",
    "theme",
    "type",
    "valid",
    "value"
  ]);
  $$renderer.component(
    ($$renderer2) => {
      let className = fallback($$props["class"], "");
      let bsSize = fallback($$props["bsSize"], void 0);
      let checked = fallback($$props["checked"], false);
      let color = fallback($$props["color"], void 0);
      let disabled = fallback($$props["disabled"], void 0);
      let feedback = fallback($$props["feedback"], void 0);
      let files = fallback($$props["files"], void 0);
      let group = fallback($$props["group"], void 0);
      let inner = fallback($$props["inner"], void 0);
      let invalid = fallback($$props["invalid"], false);
      let label = fallback($$props["label"], void 0);
      let max = fallback($$props["max"], void 0);
      let min = fallback($$props["min"], void 0);
      let multiple = fallback($$props["multiple"], void 0);
      let name = fallback($$props["name"], "");
      let placeholder = fallback($$props["placeholder"], "");
      let plaintext = fallback($$props["plaintext"], false);
      let readonly = fallback($$props["readonly"], void 0);
      let reverse = fallback($$props["reverse"], false);
      let size = fallback($$props["size"], void 0);
      let theme = fallback($$props["theme"], void 0);
      let type = fallback($$props["type"], "text");
      let valid = fallback($$props["valid"], false);
      let value = fallback($$props["value"], void 0);
      let classes;
      let tag;
      {
        const isNotaNumber = new RegExp("\\D", "g");
        let isBtn = false;
        let formControlClass = "form-control";
        tag = "input";
        switch (type) {
          case "color":
            formControlClass = `form-control form-control-color`;
            break;
          case "range":
            formControlClass = "form-range";
            break;
          case "select":
            formControlClass = `form-select`;
            tag = "select";
            break;
          case "textarea":
            tag = "textarea";
            break;
          case "button":
          case "reset":
          case "submit":
            formControlClass = `btn btn-${color || "secondary"}`;
            isBtn = true;
            break;
          case "hidden":
          case "image":
            formControlClass = void 0;
            break;
          default:
            formControlClass = "form-control";
            tag = "input";
        }
        if (plaintext) {
          formControlClass = `${formControlClass}-plaintext`;
          tag = "input";
        }
        if (size && isNotaNumber.test(size)) {
          console.warn(`Please use the prop "bsSize" instead of the "size" to bootstrap's input sizing.`);
          bsSize = size;
          size = void 0;
        }
        classes = classnames(className, formControlClass, {
          "is-invalid": invalid,
          "is-valid": valid,
          [`form-control-${bsSize}`]: bsSize && !isBtn && tag !== "select",
          [`form-select-${bsSize}`]: bsSize && tag === "select",
          [`btn-${bsSize}`]: bsSize && isBtn
        });
      }
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        if (tag === "input") {
          $$renderer3.push("<!--[-->");
          if (type === "text" || type === "password" || type === "search" || type === "tel" || type === "url") {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<input${attributes(
              {
                ...$$restProps,
                ...{ type },
                "data-bs-theme": theme,
                class: clsx(classes),
                value,
                disabled,
                name,
                placeholder,
                readonly,
                size
              },
              void 0,
              void 0,
              void 0,
              4
            )}/>`);
            push_element($$renderer3, "input", 244, 4);
            pop_element();
          } else if (type === "color") {
            $$renderer3.push("<!--[1-->");
            $$renderer3.push(`<input${attributes(
              {
                ...$$restProps,
                "data-bs-theme": theme,
                class: clsx(classes),
                type: "color",
                value,
                disabled,
                name,
                placeholder,
                readonly
              },
              void 0,
              void 0,
              void 0,
              4
            )}/>`);
            push_element($$renderer3, "input", 269, 4);
            pop_element();
          } else if (type === "email") {
            $$renderer3.push("<!--[2-->");
            $$renderer3.push(`<input${attributes(
              {
                ...$$restProps,
                "data-bs-theme": theme,
                class: clsx(classes),
                type: "email",
                value,
                disabled,
                multiple,
                name,
                placeholder,
                readonly,
                size
              },
              void 0,
              void 0,
              void 0,
              4
            )}/>`);
            push_element($$renderer3, "input", 293, 4);
            pop_element();
          } else if (type === "file") {
            $$renderer3.push("<!--[3-->");
            $$renderer3.push(`<input${attributes(
              {
                ...$$restProps,
                "data-bs-theme": theme,
                class: clsx(classes),
                type: "file",
                disabled,
                invalid,
                multiple,
                name,
                placeholder,
                readonly,
                valid
              },
              void 0,
              void 0,
              void 0,
              4
            )}/>`);
            push_element($$renderer3, "input", 319, 4);
            pop_element();
          } else if (type === "checkbox" || type === "radio" || type === "switch") {
            $$renderer3.push("<!--[4-->");
            FormCheck($$renderer3, spread_props([
              $$restProps,
              {
                "data-bs-theme": theme,
                class: className,
                size: bsSize,
                type,
                disabled,
                invalid,
                label,
                name,
                placeholder,
                reverse,
                readonly,
                valid,
                get checked() {
                  return checked;
                },
                set checked($$value) {
                  checked = $$value;
                  $$settled = false;
                },
                get inner() {
                  return inner;
                },
                set inner($$value) {
                  inner = $$value;
                  $$settled = false;
                },
                get group() {
                  return group;
                },
                set group($$value) {
                  group = $$value;
                  $$settled = false;
                },
                get value() {
                  return value;
                },
                set value($$value) {
                  value = $$value;
                  $$settled = false;
                }
              }
            ]));
          } else if (type === "number") {
            $$renderer3.push("<!--[5-->");
            $$renderer3.push(`<input${attributes(
              {
                ...$$restProps,
                type: "number",
                "data-bs-theme": theme,
                class: clsx(classes),
                value,
                disabled,
                max,
                min,
                name,
                placeholder,
                readonly
              },
              void 0,
              void 0,
              void 0,
              4
            )}/>`);
            push_element($$renderer3, "input", 375, 4);
            pop_element();
          } else if (type === "range") {
            $$renderer3.push("<!--[6-->");
            $$renderer3.push(`<input${attributes(
              {
                ...$$restProps,
                type: "range",
                "data-bs-theme": theme,
                class: clsx(classes),
                value,
                disabled,
                max,
                min,
                name,
                placeholder,
                readonly
              },
              void 0,
              void 0,
              void 0,
              4
            )}/>`);
            push_element($$renderer3, "input", 401, 4);
            pop_element();
          } else if (type === "date" || type === "datetime" || type === "datetime-local" || type === "month" || type === "time" || type === "week") {
            $$renderer3.push("<!--[7-->");
            $$renderer3.push(`<input${attributes(
              {
                ...$$restProps,
                ...{ type },
                "data-bs-theme": theme,
                class: clsx(classes),
                value,
                disabled,
                max,
                min,
                name,
                placeholder,
                readonly
              },
              void 0,
              void 0,
              void 0,
              4
            )}/>`);
            push_element($$renderer3, "input", 427, 4);
            pop_element();
          } else {
            $$renderer3.push("<!--[!-->");
            $$renderer3.push(`<input${attributes(
              {
                ...$$restProps,
                "data-bs-theme": theme,
                class: clsx(classes),
                ...{ type },
                value,
                name,
                disabled,
                placeholder,
                readonly
              },
              void 0,
              void 0,
              void 0,
              4
            )}/>`);
            push_element($$renderer3, "input", 453, 4);
            pop_element();
          }
          $$renderer3.push(`<!--]-->`);
        } else if (tag === "textarea") {
          $$renderer3.push("<!--[1-->");
          $$renderer3.push(`<textarea${attributes({
            ...$$restProps,
            "data-bs-theme": theme,
            class: clsx(classes),
            disabled,
            name,
            placeholder,
            readonly
          })}>`);
          push_element($$renderer3, "textarea", 478, 2);
          const $$body = escape_html(value);
          if ($$body) {
            $$renderer3.push(`${$$body}`);
          }
          $$renderer3.push(`</textarea>`);
          pop_element();
        } else if (tag === "select" && !multiple) {
          $$renderer3.push("<!--[2-->");
          $$renderer3.select(
            {
              ...$$restProps,
              "data-bs-theme": theme,
              class: classes,
              value,
              this: inner,
              name,
              disabled,
              readonly
            },
            ($$renderer4) => {
              $$renderer4.push(`<!--[-->`);
              slot($$renderer4, $$props, "default", {}, null);
              $$renderer4.push(`<!--]-->`);
            },
            void 0,
            void 0,
            void 0,
            void 0,
            true
          );
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> `);
        if (feedback) {
          $$renderer3.push("<!--[-->");
          if (Array.isArray(feedback)) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<!--[-->`);
            const each_array = ensure_array_like(feedback);
            for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
              let msg = each_array[$$index];
              FormFeedback($$renderer3, {
                valid,
                children: prevent_snippet_stringification(($$renderer4) => {
                  $$renderer4.push(`<!---->${escape_html(msg)}`);
                }),
                $$slots: { default: true }
              });
            }
            $$renderer3.push(`<!--]-->`);
          } else {
            $$renderer3.push("<!--[!-->");
            FormFeedback($$renderer3, {
              valid,
              children: prevent_snippet_stringification(($$renderer4) => {
                $$renderer4.push(`<!---->${escape_html(feedback)}`);
              }),
              $$slots: { default: true }
            });
          }
          $$renderer3.push(`<!--]-->`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]-->`);
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, {
        class: className,
        bsSize,
        checked,
        color,
        disabled,
        feedback,
        files,
        group,
        inner,
        invalid,
        label,
        max,
        min,
        multiple,
        name,
        placeholder,
        plaintext,
        readonly,
        reverse,
        size,
        theme,
        type,
        valid,
        value
      });
    },
    Input
  );
}
Input.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
InputGroup[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/InputGroup/InputGroup.svelte";
function InputGroup($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "size", "theme"]);
  $$renderer.component(
    ($$renderer2) => {
      let classes;
      let className = fallback($$props["class"], "");
      let size = fallback($$props["size"], "");
      let theme = fallback($$props["theme"], null);
      classes = classnames(className, "input-group", size ? `input-group-${size}` : null);
      $$renderer2.push(`<div${attributes({
        ...$$restProps,
        class: clsx(classes),
        "data-bs-theme": theme
      })}>`);
      push_element($$renderer2, "div", 28, 0);
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      bind_props($$props, { class: className, size, theme });
    },
    InputGroup
  );
}
InputGroup.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Label[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/Label/Label.svelte";
function Label($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "class",
    "hidden",
    "check",
    "size",
    "for",
    "xs",
    "sm",
    "md",
    "lg",
    "xl",
    "xxl",
    "widths"
  ]);
  $$renderer.component(
    ($$renderer2) => {
      let classes;
      let className = fallback($$props["class"], "");
      let hidden = fallback($$props["hidden"], false);
      let check = fallback($$props["check"], false);
      let size = fallback($$props["size"], "");
      let fore = fallback($$props["for"], null);
      let xs = fallback($$props["xs"], "");
      let sm = fallback($$props["sm"], "");
      let md = fallback($$props["md"], "");
      let lg = fallback($$props["lg"], "");
      let xl = fallback($$props["xl"], "");
      let xxl = fallback($$props["xxl"], "");
      const colWidths = { xs, sm, md, lg, xl, xxl };
      let widths = fallback($$props["widths"], () => Object.keys(colWidths), true);
      const colClasses = [];
      widths.forEach((colWidth) => {
        let columnProp = $$sanitized_props[colWidth];
        if (!columnProp && columnProp !== "") {
          return;
        }
        const isXs = colWidth === "xs";
        let colClass;
        if (isObject(columnProp)) {
          const colSizeInterfix = isXs ? "-" : `-${colWidth}-`;
          colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);
          colClasses.push(classnames({
            [colClass]: columnProp.size || columnProp.size === "",
            [`order${colSizeInterfix}${columnProp.order}`]: columnProp.order || columnProp.order === 0,
            [`offset${colSizeInterfix}${columnProp.offset}`]: columnProp.offset || columnProp.offset === 0
          }));
        } else {
          colClass = getColumnSizeClass(isXs, colWidth, columnProp);
          colClasses.push(colClass);
        }
      });
      classes = classnames(className, hidden ? "visually-hidden" : false, check ? "form-check-label" : false, size ? `col-form-label-${size}` : false, colClasses, colClasses.length ? "col-form-label" : "form-label");
      $$renderer2.push(`<label${attributes({ ...$$restProps, class: clsx(classes), for: fore })}>`);
      push_element($$renderer2, "label", 68, 0);
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]--></label>`);
      pop_element();
      bind_props($$props, {
        class: className,
        hidden,
        check,
        size,
        for: fore,
        xs,
        sm,
        md,
        lg,
        xl,
        xxl,
        widths
      });
    },
    Label
  );
}
Label.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
ModalBackdrop[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/ModalBackdrop/ModalBackdrop.svelte";
function ModalBackdrop($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  rest_props($$sanitized_props, ["class", "isOpen", "fade"]);
  $$renderer.component(
    ($$renderer2) => {
      let className = fallback($$props["class"], "");
      let isOpen = fallback($$props["isOpen"], false);
      let fade = fallback($$props["fade"], true);
      classnames(className, "modal-backdrop");
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, { class: className, isOpen, fade });
    },
    ModalBackdrop
  );
}
ModalBackdrop.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
ModalBody[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/ModalBody/ModalBody.svelte";
function ModalBody($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class"]);
  $$renderer.component(
    ($$renderer2) => {
      let classes;
      let className = fallback($$props["class"], "");
      classes = classnames(className, "modal-body");
      $$renderer2.push(`<div${attributes({ ...$$restProps, class: clsx(classes) })}>`);
      push_element($$renderer2, "div", 14, 0);
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      bind_props($$props, { class: className });
    },
    ModalBody
  );
}
ModalBody.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
ModalHeader[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/ModalHeader/ModalHeader.svelte";
function ModalHeader($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "toggle", "closeAriaLabel", "id", "content"]);
  $$renderer.component(
    ($$renderer2) => {
      let classes;
      let className = fallback($$props["class"], "");
      let toggle = fallback($$props["toggle"], void 0);
      let closeAriaLabel = fallback($$props["closeAriaLabel"], "Close");
      let id = fallback($$props["id"], void 0);
      let content = fallback($$props["content"], void 0);
      classes = classnames(className, "modal-header");
      $$renderer2.push(`<div${attributes({ ...$$restProps, class: clsx(classes) })}>`);
      push_element($$renderer2, "div", 34, 0);
      $$renderer2.push(`<h5 class="modal-title"${attr("id", id)}>`);
      push_element($$renderer2, "h5", 35, 2);
      if (content) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`${escape_html(content)}`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {}, null);
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></h5>`);
      pop_element();
      $$renderer2.push(` <!--[-->`);
      slot($$renderer2, $$props, "close", {}, () => {
        if (typeof toggle === "function") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<button type="button" class="btn-close"${attr("aria-label", closeAriaLabel)}>`);
          push_element($$renderer2, "button", 44, 6);
          $$renderer2.push(`</button>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
      });
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      bind_props($$props, { class: className, toggle, closeAriaLabel, id, content });
    },
    ModalHeader
  );
}
ModalHeader.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Portal[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/Portal/Portal.svelte";
function Portal($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, []);
  $$renderer.component(
    ($$renderer2) => {
      onDestroy(() => {
      });
      $$renderer2.push(`<div${attributes({ ...$$restProps })}>`);
      push_element($$renderer2, "div", 19, 0);
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
    },
    Portal
  );
}
Portal.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Modal[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/Modal/Modal.svelte";
function Modal($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  rest_props($$sanitized_props, [
    "class",
    "static",
    "autoFocus",
    "body",
    "centered",
    "container",
    "fullscreen",
    "header",
    "isOpen",
    "keyboard",
    "backdrop",
    "contentClassName",
    "fade",
    "labelledBy",
    "modalClassName",
    "modalStyle",
    "returnFocusAfterClose",
    "scrollable",
    "size",
    "theme",
    "toggle",
    "unmountOnClose",
    "wrapClassName"
  ]);
  $$renderer.component(
    ($$renderer2) => {
      let outer;
      let className = fallback($$props["class"], "");
      let staticModal = fallback($$props["static"], false);
      let autoFocus = fallback($$props["autoFocus"], true);
      let body = fallback($$props["body"], false);
      let centered = fallback($$props["centered"], false);
      let container = fallback($$props["container"], void 0);
      let fullscreen = fallback($$props["fullscreen"], false);
      let header = fallback($$props["header"], void 0);
      let isOpen = fallback($$props["isOpen"], false);
      let keyboard = fallback($$props["keyboard"], true);
      let backdrop = fallback($$props["backdrop"], true);
      let contentClassName = fallback($$props["contentClassName"], "");
      let fade = fallback($$props["fade"], true);
      let labelledBy = fallback($$props["labelledBy"], () => header ? `modal-${uuid()}` : void 0, true);
      let modalClassName = fallback($$props["modalClassName"], "");
      let modalStyle = fallback($$props["modalStyle"], null);
      let returnFocusAfterClose = fallback($$props["returnFocusAfterClose"], true);
      let scrollable = fallback($$props["scrollable"], false);
      let size = fallback($$props["size"], "");
      let theme = fallback($$props["theme"], null);
      let toggle = fallback($$props["toggle"], void 0);
      let unmountOnClose = fallback($$props["unmountOnClose"], true);
      let wrapClassName = fallback($$props["wrapClassName"], "");
      onDestroy(() => {
      });
      const dialogBaseClass = "modal-dialog";
      classnames(dialogBaseClass, className, {
        [`modal-${size}`]: size,
        "modal-fullscreen": fullscreen === true,
        [`modal-fullscreen-${fullscreen}-down`]: fullscreen && typeof fullscreen === "string",
        [`${dialogBaseClass}-centered`]: centered,
        [`${dialogBaseClass}-scrollable`]: scrollable
      });
      outer = container === "inline" || staticModal ? InlineContainer : Portal;
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (backdrop && !staticModal) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push("<!---->");
        outer?.($$renderer2, {
          children: prevent_snippet_stringification(($$renderer3) => {
            ModalBackdrop($$renderer3, { fade, isOpen });
          }),
          $$slots: { default: true }
        });
        $$renderer2.push(`<!---->`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, {
        class: className,
        static: staticModal,
        autoFocus,
        body,
        centered,
        container,
        fullscreen,
        header,
        isOpen,
        keyboard,
        backdrop,
        contentClassName,
        fade,
        labelledBy,
        modalClassName,
        modalStyle,
        returnFocusAfterClose,
        scrollable,
        size,
        theme,
        toggle,
        unmountOnClose,
        wrapClassName
      });
    },
    Modal
  );
}
Modal.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
ModalFooter[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/ModalFooter/ModalFooter.svelte";
function ModalFooter($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class"]);
  $$renderer.component(
    ($$renderer2) => {
      let classes;
      let className = fallback($$props["class"], "");
      classes = classnames(className, "modal-footer");
      $$renderer2.push(`<div${attributes({ ...$$restProps, class: clsx(classes) })}>`);
      push_element($$renderer2, "div", 14, 0);
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      bind_props($$props, { class: className });
    },
    ModalFooter
  );
}
ModalFooter.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Nav[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/Nav/Nav.svelte";
function Nav($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "class",
    "tabs",
    "pills",
    "vertical",
    "horizontal",
    "justified",
    "fill",
    "navbar",
    "card",
    "theme",
    "underline"
  ]);
  $$renderer.component(
    ($$renderer2) => {
      let classes;
      let className = fallback($$props["class"], "");
      let tabs = fallback($$props["tabs"], false);
      let pills = fallback($$props["pills"], false);
      let vertical = fallback($$props["vertical"], "");
      let horizontal = fallback($$props["horizontal"], "");
      let justified = fallback($$props["justified"], false);
      let fill = fallback($$props["fill"], false);
      let navbar = fallback($$props["navbar"], false);
      let card = fallback($$props["card"], false);
      let theme = fallback($$props["theme"], null);
      let underline = fallback($$props["underline"], false);
      function getVerticalClass(vertical2) {
        if (!vertical2) {
          return false;
        }
        if (vertical2 === true || vertical2 === "xs") {
          return "flex-column";
        }
        return `flex-${vertical2}-column`;
      }
      classes = classnames(className, navbar ? "navbar-nav" : "nav", horizontal ? `justify-content-${horizontal}` : false, getVerticalClass(vertical), {
        "nav-tabs": tabs,
        "card-header-tabs": card && tabs,
        "nav-pills": pills,
        "card-header-pills": card && pills,
        "nav-justified": justified,
        "nav-fill": fill,
        "nav-underline": underline
      });
      $$renderer2.push(`<ul${attributes({
        ...$$restProps,
        class: clsx(classes),
        "data-bs-theme": theme
      })}>`);
      push_element($$renderer2, "ul", 109, 0);
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]--></ul>`);
      pop_element();
      bind_props($$props, {
        class: className,
        tabs,
        pills,
        vertical,
        horizontal,
        justified,
        fill,
        navbar,
        card,
        theme,
        underline
      });
    },
    Nav
  );
}
Nav.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Navbar[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/Navbar/Navbar.svelte";
function Navbar($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "class",
    "container",
    "color",
    "dark",
    "expand",
    "fixed",
    "light",
    "sticky",
    "theme"
  ]);
  $$renderer.component(
    ($$renderer2) => {
      let classes;
      setContext("navbar", { inNavbar: true });
      let className = fallback($$props["class"], "");
      let container = fallback($$props["container"], "fluid");
      let color = fallback($$props["color"], "");
      let dark = fallback($$props["dark"], false);
      let expand = fallback($$props["expand"], "");
      let fixed = fallback($$props["fixed"], "");
      let light = fallback($$props["light"], false);
      let sticky = fallback($$props["sticky"], "");
      let theme = fallback($$props["theme"], null);
      let containerProps = {
        sm: container === "sm",
        md: container === "md",
        lg: container === "lg",
        xl: container === "xl",
        xxl: container === "xxl",
        fluid: container === "fluid"
      };
      function getExpandClass(expand2) {
        if (expand2 === false) {
          return false;
        }
        if (expand2 === true || expand2 === "xs") {
          return "navbar-expand";
        }
        return `navbar-expand-${expand2}`;
      }
      theme = dark ? "dark" : light ? "light" : theme;
      classes = classnames(className, "navbar", getExpandClass(expand), {
        [`bg-${color}`]: color,
        [`fixed-${fixed}`]: fixed,
        [`sticky-${sticky}`]: sticky
      });
      $$renderer2.push(`<nav${attributes({
        ...$$restProps,
        class: clsx(classes),
        "data-bs-theme": theme
      })}>`);
      push_element($$renderer2, "nav", 100, 0);
      if (container) {
        $$renderer2.push("<!--[-->");
        Container($$renderer2, spread_props([
          containerProps,
          {
            children: prevent_snippet_stringification(($$renderer3) => {
              $$renderer3.push(`<!--[-->`);
              slot($$renderer3, $$props, "default", {}, null);
              $$renderer3.push(`<!--]-->`);
            }),
            $$slots: { default: true }
          }
        ]));
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {}, null);
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></nav>`);
      pop_element();
      bind_props($$props, {
        class: className,
        container,
        color,
        dark,
        expand,
        fixed,
        light,
        sticky,
        theme
      });
    },
    Navbar
  );
}
Navbar.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
NavItem[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/NavItem/NavItem.svelte";
function NavItem($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "active"]);
  $$renderer.component(
    ($$renderer2) => {
      let classes;
      let className = fallback($$props["class"], "");
      let active = fallback($$props["active"], false);
      classes = classnames(className, "nav-item", active ? "active" : false);
      $$renderer2.push(`<li${attributes({ ...$$restProps, class: clsx(classes) })}>`);
      push_element($$renderer2, "li", 20, 0);
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]--></li>`);
      pop_element();
      bind_props($$props, { class: className, active });
    },
    NavItem
  );
}
NavItem.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
NavbarBrand[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/NavbarBrand/NavbarBrand.svelte";
function NavbarBrand($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "href"]);
  $$renderer.component(
    ($$renderer2) => {
      let classes;
      let className = fallback($$props["class"], "");
      let href = fallback($$props["href"], "/");
      classes = classnames(className, "navbar-brand");
      $$renderer2.push(`<a${attributes({ ...$$restProps, class: clsx(classes), href })}>`);
      push_element($$renderer2, "a", 20, 0);
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]--></a>`);
      pop_element();
      bind_props($$props, { class: className, href });
    },
    NavbarBrand
  );
}
NavbarBrand.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Pagination[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/Pagination/Pagination.svelte";
function Pagination($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["ariaLabel", "class", "listClassName", "size", "theme"]);
  $$renderer.component(
    ($$renderer2) => {
      let classes, listClasses;
      let ariaLabel = fallback($$props["ariaLabel"], "pagination");
      let className = fallback($$props["class"], "");
      let listClassName = fallback($$props["listClassName"], "");
      let size = fallback($$props["size"], "");
      let theme = fallback($$props["theme"], null);
      classes = classnames(className);
      listClasses = classnames(listClassName, "pagination", { [`pagination-${size}`]: !!size });
      $$renderer2.push(`<nav${attributes({
        ...$$restProps,
        class: clsx(classes),
        "aria-label": ariaLabel,
        "data-bs-theme": theme
      })}>`);
      push_element($$renderer2, "nav", 45, 0);
      $$renderer2.push(`<ul${attr_class(clsx(listClasses))}>`);
      push_element($$renderer2, "ul", 46, 2);
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]--></ul>`);
      pop_element();
      $$renderer2.push(`</nav>`);
      pop_element();
      bind_props($$props, { ariaLabel, class: className, listClassName, size, theme });
    },
    Pagination
  );
}
Pagination.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
PaginationItem[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/PaginationItem/PaginationItem.svelte";
function PaginationItem($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "active", "disabled"]);
  $$renderer.component(
    ($$renderer2) => {
      let classes;
      let className = fallback($$props["class"], "");
      let active = fallback($$props["active"], false);
      let disabled = fallback($$props["disabled"], false);
      classes = classnames(className, "page-item", { active, disabled });
      $$renderer2.push(`<li${attributes({ ...$$restProps, class: clsx(classes) })}>`);
      push_element($$renderer2, "li", 15, 0);
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]--></li>`);
      pop_element();
      bind_props($$props, { class: className, active, disabled });
    },
    PaginationItem
  );
}
PaginationItem.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
PaginationLink[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/PaginationLink/PaginationLink.svelte";
function PaginationLink($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "class",
    "next",
    "previous",
    "first",
    "last",
    "ariaLabel",
    "href"
  ]);
  $$renderer.component(
    ($$renderer2) => {
      let classes, realLabel;
      let className = fallback($$props["class"], "");
      let next = fallback($$props["next"], false);
      let previous = fallback($$props["previous"], false);
      let first = fallback($$props["first"], false);
      let last = fallback($$props["last"], false);
      let ariaLabel = fallback($$props["ariaLabel"], "");
      let href = fallback($$props["href"], "");
      let defaultAriaLabel;
      let defaultCaret;
      classes = classnames(className, "page-link");
      if (previous) {
        defaultAriaLabel = "Previous";
      } else if (next) {
        defaultAriaLabel = "Next";
      } else if (first) {
        defaultAriaLabel = "First";
      } else if (last) {
        defaultAriaLabel = "Last";
      }
      realLabel = ariaLabel || defaultAriaLabel;
      if (previous) {
        defaultCaret = "‹";
      } else if (next) {
        defaultCaret = "›";
      } else if (first) {
        defaultCaret = "«";
      } else if (last) {
        defaultCaret = "»";
      }
      $$renderer2.push(`<a${attributes({ ...$$restProps, class: clsx(classes), href })}>`);
      push_element($$renderer2, "a", 41, 0);
      if (previous || next || first || last) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span aria-hidden="true">`);
        push_element($$renderer2, "span", 43, 4);
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {}, () => {
          $$renderer2.push(`${escape_html(defaultCaret)}`);
        });
        $$renderer2.push(`<!--]--></span>`);
        pop_element();
        $$renderer2.push(` <span class="visually-hidden">`);
        push_element($$renderer2, "span", 46, 4);
        $$renderer2.push(`${escape_html(realLabel)}</span>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {}, null);
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></a>`);
      pop_element();
      bind_props($$props, {
        class: className,
        next,
        previous,
        first,
        last,
        ariaLabel,
        href
      });
    },
    PaginationLink
  );
}
PaginationLink.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Row[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/Row/Row.svelte";
function Row($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "noGutters", "form", "cols", "inner"]);
  $$renderer.component(
    ($$renderer2) => {
      let classes;
      let className = fallback($$props["class"], "");
      let noGutters = fallback($$props["noGutters"], false);
      let form = fallback($$props["form"], false);
      let cols = fallback($$props["cols"], 0);
      let inner = fallback($$props["inner"], void 0);
      function getCols(cols2) {
        const colsValue = parseInt(cols2);
        if (!isNaN(colsValue)) {
          if (colsValue > 0) {
            return [`row-cols-${colsValue}`];
          }
        } else if (typeof cols2 === "object") {
          return ["xs", "sm", "md", "lg", "xl"].map((colWidth) => {
            const isXs = colWidth === "xs";
            const colSizeInterfix = isXs ? "-" : `-${colWidth}-`;
            const value = cols2[colWidth];
            if (typeof value === "number" && value > 0) {
              return `row-cols${colSizeInterfix}${value}`;
            }
            return null;
          }).filter((value) => !!value);
        }
        return [];
      }
      classes = classnames(className, noGutters ? "gx-0" : null, form ? "form-row" : "row", ...getCols(cols));
      $$renderer2.push(`<div${attributes({ ...$$restProps, class: clsx(classes) })}>`);
      push_element($$renderer2, "div", 36, 0);
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      bind_props($$props, { class: className, noGutters, form, cols, inner });
    },
    Row
  );
}
Row.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Spinner[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/Spinner/Spinner.svelte";
function Spinner($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "type", "size", "color"]);
  $$renderer.component(
    ($$renderer2) => {
      let classes;
      let className = fallback($$props["class"], "");
      let type = fallback($$props["type"], "border");
      let size = fallback($$props["size"], "");
      let color = fallback($$props["color"], "");
      classes = classnames(className, size ? `spinner-${type}-${size}` : false, `spinner-${type}`, color ? `text-${color}` : false);
      $$renderer2.push(`<div${attributes({ ...$$restProps, role: "status", class: clsx(classes) })}>`);
      push_element($$renderer2, "div", 39, 0);
      $$renderer2.push(`<span class="visually-hidden">`);
      push_element($$renderer2, "span", 40, 2);
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", {}, () => {
        $$renderer2.push(`Loading...`);
      });
      $$renderer2.push(`<!--]--></span>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      bind_props($$props, { class: className, type, size, color });
    },
    Spinner
  );
}
Spinner.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Colgroup[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/Colgroup/Colgroup.svelte";
function Colgroup($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      setContext("colgroup", true);
      $$renderer2.push(`<colgroup>`);
      push_element($$renderer2, "colgroup", 7, 0);
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]--></colgroup>`);
      pop_element();
    },
    Colgroup
  );
}
Colgroup.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
ResponsiveContainer[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/ResponsiveContainer/ResponsiveContainer.svelte";
function ResponsiveContainer($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let responsiveClassName;
      let className = fallback($$props["class"], "");
      let responsive = fallback($$props["responsive"], false);
      responsiveClassName = classnames(className, {
        "table-responsive": responsive === true,
        [`table-responsive-${responsive}`]: typeof responsive === "string"
      });
      if (responsive) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div${attr_class(clsx(responsiveClassName))}>`);
        push_element($$renderer2, "div", 15, 2);
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {}, null);
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {}, null);
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, { class: className, responsive });
    },
    ResponsiveContainer
  );
}
ResponsiveContainer.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
TableFooter[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/TableFooter/TableFooter.svelte";
function TableFooter($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, []);
  $$renderer.component(
    ($$renderer2) => {
      setContext("footer", true);
      $$renderer2.push(`<tfoot${attributes({ ...$$restProps })}>`);
      push_element($$renderer2, "tfoot", 7, 0);
      $$renderer2.push(`<tr>`);
      push_element($$renderer2, "tr", 8, 2);
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]--></tr>`);
      pop_element();
      $$renderer2.push(`</tfoot>`);
      pop_element();
    },
    TableFooter
  );
}
TableFooter.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
TableHeader[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/TableHeader/TableHeader.svelte";
function TableHeader($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, []);
  $$renderer.component(
    ($$renderer2) => {
      setContext("header", true);
      $$renderer2.push(`<thead${attributes({ ...$$restProps })}>`);
      push_element($$renderer2, "thead", 7, 0);
      $$renderer2.push(`<tr>`);
      push_element($$renderer2, "tr", 8, 2);
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]--></tr>`);
      pop_element();
      $$renderer2.push(`</thead>`);
      pop_element();
    },
    TableHeader
  );
}
TableHeader.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Table[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/Table/Table.svelte";
function Table($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "class",
    "size",
    "bordered",
    "borderless",
    "striped",
    "hover",
    "responsive",
    "rows"
  ]);
  $$renderer.component(
    ($$renderer2) => {
      let classes;
      let className = fallback($$props["class"], "");
      let size = fallback($$props["size"], "");
      let bordered = fallback($$props["bordered"], false);
      let borderless = fallback($$props["borderless"], false);
      let striped = fallback($$props["striped"], false);
      let hover = fallback($$props["hover"], false);
      let responsive = fallback($$props["responsive"], false);
      let rows = fallback($$props["rows"], void 0);
      classes = classnames(className, "table", size ? "table-" + size : false, bordered ? "table-bordered" : false, borderless ? "table-borderless" : false, striped ? "table-striped" : false, hover ? "table-hover" : false);
      ResponsiveContainer($$renderer2, {
        responsive,
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<table${attributes({ ...$$restProps, class: clsx(classes) })}>`);
          push_element($$renderer3, "table", 70, 2);
          if (rows) {
            $$renderer3.push("<!--[-->");
            Colgroup($$renderer3, {
              children: prevent_snippet_stringification(($$renderer4) => {
                $$renderer4.push(`<!--[-->`);
                slot($$renderer4, $$props, "default", {}, null);
                $$renderer4.push(`<!--]-->`);
              }),
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----> `);
            TableHeader($$renderer3, {
              children: prevent_snippet_stringification(($$renderer4) => {
                $$renderer4.push(`<!--[-->`);
                slot($$renderer4, $$props, "default", {}, null);
                $$renderer4.push(`<!--]-->`);
              }),
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----> <tbody>`);
            push_element($$renderer3, "tbody", 78, 6);
            $$renderer3.push(`<!--[-->`);
            const each_array = ensure_array_like(rows);
            for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
              let row = each_array[$$index];
              $$renderer3.push(`<tr>`);
              push_element($$renderer3, "tr", 80, 10);
              $$renderer3.push(`<!--[-->`);
              slot($$renderer3, $$props, "default", { row }, null);
              $$renderer3.push(`<!--]--></tr>`);
              pop_element();
            }
            $$renderer3.push(`<!--]--></tbody>`);
            pop_element();
            $$renderer3.push(` `);
            TableFooter($$renderer3, {
              children: prevent_snippet_stringification(($$renderer4) => {
                $$renderer4.push(`<!--[-->`);
                slot($$renderer4, $$props, "default", {}, null);
                $$renderer4.push(`<!--]-->`);
              }),
              $$slots: { default: true }
            });
            $$renderer3.push(`<!---->`);
          } else {
            $$renderer3.push("<!--[!-->");
            $$renderer3.push(`<!--[-->`);
            slot($$renderer3, $$props, "default", {}, null);
            $$renderer3.push(`<!--]-->`);
          }
          $$renderer3.push(`<!--]--></table>`);
          pop_element();
        }),
        $$slots: { default: true }
      });
      bind_props($$props, {
        class: className,
        size,
        bordered,
        borderless,
        striped,
        hover,
        responsive,
        rows
      });
    },
    Table
  );
}
Table.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
const colorMode = writable(getInitialColorMode());
colorMode.subscribe((mode) => useColorMode(mode));
function getInitialColorMode() {
  const currentTheme = globalThis.document?.documentElement.getAttribute("data-bs-theme") || "light";
  const prefersDarkMode = typeof globalThis.window?.matchMedia === "function" ? globalThis.window?.matchMedia("(prefers-color-scheme: dark)").matches : false;
  return currentTheme === "dark" || currentTheme === "auto" && prefersDarkMode ? "dark" : "light";
}
function useColorMode(element, mode) {
  let target = element;
  if (arguments.length === 1) {
    target = globalThis.document?.documentElement;
    if (!target) {
      return;
    }
    mode = element;
    colorMode.update(() => mode);
  }
  target.setAttribute("data-bs-theme", mode);
}
ToastBody[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/ToastBody/ToastBody.svelte";
function ToastBody($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class"]);
  $$renderer.component(
    ($$renderer2) => {
      let classes;
      let className = fallback($$props["class"], "");
      classes = classnames(className, "toast-body");
      $$renderer2.push(`<div${attributes({ ...$$restProps, class: clsx(classes) })}>`);
      push_element($$renderer2, "div", 10, 0);
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      bind_props($$props, { class: className });
    },
    ToastBody
  );
}
ToastBody.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
ToastHeader[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/ToastHeader/ToastHeader.svelte";
function ToastHeader($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "icon", "toggle", "closeAriaLabel"]);
  $$renderer.component(
    ($$renderer2) => {
      let classes, tagClassName;
      let className = fallback($$props["class"], "");
      let icon = fallback($$props["icon"], null);
      let toggle = fallback($$props["toggle"], null);
      let closeAriaLabel = fallback($$props["closeAriaLabel"], "Close");
      classes = classnames(className, "toast-header");
      tagClassName = classnames("me-auto", { "ms-2": icon !== null });
      $$renderer2.push(`<div${attributes({ ...$$restProps, class: clsx(classes) })}>`);
      push_element($$renderer2, "div", 16, 0);
      if (icon) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<svg${attr_class(`rounded text-${icon}`)} width="20" height="20" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img">`);
        push_element($$renderer2, "svg", 18, 4);
        $$renderer2.push(`<rect fill="currentColor" width="100%" height="100%">`);
        push_element($$renderer2, "rect", 27, 6);
        $$renderer2.push(`</rect>`);
        pop_element();
        $$renderer2.push(`</svg>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "icon", {}, null);
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--> <strong${attr_class(clsx(tagClassName))}>`);
      push_element($$renderer2, "strong", 32, 2);
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]--></strong>`);
      pop_element();
      $$renderer2.push(` `);
      if (toggle) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "close", {}, () => {
          Button($$renderer2, { close: true, "aria-label": closeAriaLabel });
        });
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      bind_props($$props, { class: className, icon, toggle, closeAriaLabel });
    },
    ToastHeader
  );
}
ToastHeader.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Toast[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/Toast/Toast.svelte";
function Toast($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "class",
    "autohide",
    "body",
    "delay",
    "duration",
    "fade",
    "header",
    "isOpen",
    "theme",
    "toggle"
  ]);
  $$renderer.component(
    ($$renderer2) => {
      let classes;
      let className = fallback($$props["class"], "");
      let autohide = fallback($$props["autohide"], false);
      let body = fallback($$props["body"], false);
      let delay = fallback($$props["delay"], 5e3);
      let duration = fallback($$props["duration"], 200);
      let fade = fallback($$props["fade"], true);
      let header = fallback($$props["header"], void 0);
      let isOpen = fallback($$props["isOpen"], true);
      let theme = fallback($$props["theme"], null);
      let toggle = fallback($$props["toggle"], null);
      let timeout;
      onDestroy(() => {
        return () => clearTimeout(timeout);
      });
      if (isOpen && autohide) {
        timeout = setTimeout(() => isOpen = false, delay);
      }
      classes = classnames(className, "toast", { show: isOpen });
      if (isOpen) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div${attributes({
          ...$$restProps,
          class: clsx(classes),
          "data-bs-theme": theme,
          role: "alert"
        })}>`);
        push_element($$renderer2, "div", 102, 2);
        if (header) {
          $$renderer2.push("<!--[-->");
          ToastHeader($$renderer2, {
            toggle,
            children: prevent_snippet_stringification(($$renderer3) => {
              $$renderer3.push(`<!---->${escape_html(header)}`);
            }),
            $$slots: { default: true }
          });
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (body) {
          $$renderer2.push("<!--[-->");
          ToastBody($$renderer2, {
            children: prevent_snippet_stringification(($$renderer3) => {
              $$renderer3.push(`<!--[-->`);
              slot($$renderer3, $$props, "default", {}, null);
              $$renderer3.push(`<!--]-->`);
            }),
            $$slots: { default: true }
          });
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<!--[-->`);
          slot($$renderer2, $$props, "default", {}, null);
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, {
        class: className,
        autohide,
        body,
        delay,
        duration,
        fade,
        header,
        isOpen,
        theme,
        toggle
      });
    },
    Toast
  );
}
Toast.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Tooltip[FILENAME] = "node_modules/@sveltestrap/sveltestrap/dist/Tooltip/Tooltip.svelte";
function Tooltip($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "class",
    "animation",
    "content",
    "container",
    "id",
    "isOpen",
    "placement",
    "target",
    "theme",
    "delay"
  ]);
  $$renderer.component(
    ($$renderer2) => {
      let classes, outer;
      let className = fallback($$props["class"], "");
      let animation = fallback($$props["animation"], true);
      let content = fallback($$props["content"], "");
      let container = fallback($$props["container"], void 0);
      let id = fallback($$props["id"], () => `tooltip_${uuid()}`, true);
      let isOpen = fallback($$props["isOpen"], false);
      let placement = fallback($$props["placement"], "top");
      let target = fallback($$props["target"], "");
      let theme = fallback($$props["theme"], null);
      let delay = fallback($$props["delay"], 0);
      let bsPlacement;
      let popperInstance;
      let popperPlacement = placement;
      let targetEl;
      let tooltipEl;
      let showTimer;
      const checkPopperPlacement = {
        name: "checkPopperPlacement",
        enabled: true,
        phase: "main",
        fn({ state }) {
          popperPlacement = state.placement;
        }
      };
      const open = () => {
        clearTimeout(showTimer);
        showTimer = setTimeout(() => isOpen = true, delay);
      };
      const close = () => {
        clearTimeout(showTimer);
        isOpen = false;
      };
      onDestroy(() => {
        unregisterEventListeners();
        clearTimeout(showTimer);
      });
      function registerEventListeners() {
        if (target == null || !target) {
          targetEl = null;
          return;
        }
        try {
          if (target instanceof HTMLElement) {
            targetEl = target;
          }
        } catch (e) {
        }
        if (targetEl == null) {
          try {
            targetEl = document.querySelector(`#${target}`);
          } catch (e) {
          }
        }
        if (targetEl) {
          targetEl.addEventListener("mouseover", open);
          targetEl.addEventListener("mouseleave", close);
          targetEl.addEventListener("focus", open);
          targetEl.addEventListener("blur", close);
        }
      }
      function unregisterEventListeners() {
        if (targetEl) {
          targetEl.removeEventListener("mouseover", open);
          targetEl.removeEventListener("mouseleave", close);
          targetEl.removeEventListener("focus", open);
          targetEl.removeEventListener("blur", close);
          targetEl.removeAttribute("aria-describedby");
        }
      }
      {
        if (isOpen && tooltipEl) {
          popperInstance = createPopper(targetEl, tooltipEl, { placement, modifiers: [checkPopperPlacement] });
        } else if (popperInstance) {
          popperInstance.destroy();
          popperInstance = void 0;
        }
      }
      if (target) {
        unregisterEventListeners();
        registerEventListeners();
      }
      if (targetEl) {
        if (isOpen) {
          targetEl.setAttribute("aria-describedby", id);
        } else {
          targetEl.removeAttribute("aria-describedby");
        }
      }
      {
        if (popperPlacement === "left") {
          bsPlacement = "start";
        } else if (popperPlacement === "right") {
          bsPlacement = "end";
        } else {
          bsPlacement = popperPlacement;
        }
      }
      classes = classnames(className, "tooltip", `bs-tooltip-${bsPlacement}`, animation ? "fade" : false, isOpen ? "show" : false);
      outer = container === "inline" ? InlineContainer : Portal;
      if (isOpen) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push("<!---->");
        outer?.($$renderer2, {
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<div${attributes({
              ...$$restProps,
              class: clsx(classes),
              id,
              role: "tooltip",
              "data-bs-theme": theme,
              "data-bs-delay": delay,
              "x-placement": popperPlacement
            })}>`);
            push_element($$renderer3, "div", 218, 4);
            $$renderer3.push(`<div class="tooltip-arrow" data-popper-arrow="">`);
            push_element($$renderer3, "div", 228, 6);
            $$renderer3.push(`</div>`);
            pop_element();
            $$renderer3.push(` <div class="tooltip-inner">`);
            push_element($$renderer3, "div", 229, 6);
            if (content) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`${escape_html(content)}`);
            } else {
              $$renderer3.push("<!--[!-->");
              $$renderer3.push(`<!--[-->`);
              slot($$renderer3, $$props, "default", {}, null);
              $$renderer3.push(`<!--]-->`);
            }
            $$renderer3.push(`<!--]--></div>`);
            pop_element();
            $$renderer3.push(`</div>`);
            pop_element();
          }),
          $$slots: { default: true }
        });
        $$renderer2.push(`<!---->`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, {
        class: className,
        animation,
        content,
        container,
        id,
        isOpen,
        placement,
        target,
        theme,
        delay
      });
    },
    Tooltip
  );
}
Tooltip.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  Alert as A,
  Button as B,
  Card as C,
  Dropdown as D,
  Toast as E,
  Form as F,
  ToastHeader as G,
  ToastBody as H,
  Icon as I,
  Label as L,
  Modal as M,
  Navbar as N,
  Pagination as P,
  Row as R,
  Spinner as S,
  Tooltip as T,
  NavbarBrand as a,
  Nav as b,
  NavItem as c,
  DropdownToggle as d,
  DropdownMenu as e,
  DropdownItem as f,
  Input as g,
  CardBody as h,
  Container as i,
  Col as j,
  CardHeader as k,
  CardTitle as l,
  CardText as m,
  ModalHeader as n,
  ModalBody as o,
  FormGroup as p,
  FormCheck as q,
  Table as r,
  ModalFooter as s,
  Badge as t,
  Collapse as u,
  InputGroup as v,
  onDestroy as w,
  CardFooter as x,
  PaginationItem as y,
  PaginationLink as z
};
