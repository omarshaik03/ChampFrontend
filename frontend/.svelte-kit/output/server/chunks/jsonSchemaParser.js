import { c as bind_props, g as attr_style, f as stringify, b as attr, e as ensure_array_like, p as prevent_snippet_stringification } from "./index2.js";
import { p as push_element, a as pop_element } from "./dev.js";
import { a3 as FILENAME, a4 as fallback } from "./utils2.js";
import { M as Modal, p as FormGroup, L as Label, g as Input, B as Button, i as Container, R as Row, j as Col, C as Card, k as CardHeader, l as CardTitle, h as CardBody, I as Icon, A as Alert, S as Spinner, t as Badge } from "./Tooltip.js";
import { u as useSvelteFlow, H as Handle, A as AgentsTab, S as SvelteFlow, C as Controls, B as Background, M as Minimap, P as Panel } from "./AgentsTab.js";
import { e as escape_html } from "./context.js";
import { Position } from "@xyflow/system";
TextNode[FILENAME] = "src/components/apps/graphUI/TextNode.svelte";
function TextNode($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let id = $$props["id"];
      let data = $$props["data"];
      let open = fallback($$props["open"], false);
      let nodeColor = data.color || "#ffffff";
      let nodeType = data.type || "default";
      let additionalFields = [];
      const { getNode } = useSvelteFlow();
      getNode(id);
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<div class="text-updater-node default-node svelte-1f3suw5"${attr_style(`background-color: ${stringify(nodeColor)}; border: 1px solid grey;`)}>`);
        push_element($$renderer3, "div", 44, 0);
        $$renderer3.push(`<div>`);
        push_element($$renderer3, "div", 45, 4);
        $$renderer3.push(`<form class="svelte-1f3suw5">`);
        push_element($$renderer3, "form", 46, 8);
        $$renderer3.push(`<input id="text" name="text"${attr("value", data.text)} class="svelte-1f3suw5"/>`);
        push_element($$renderer3, "input", 47, 12);
        pop_element();
        $$renderer3.push(` <button class="svelte-1f3suw5">`);
        push_element($$renderer3, "button", 51, 12);
        $$renderer3.push(`Edit</button>`);
        pop_element();
        $$renderer3.push(`</form>`);
        pop_element();
        $$renderer3.push(` `);
        if (additionalFields && additionalFields.length > 0) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="additional-fields-display svelte-1f3suw5">`);
          push_element($$renderer3, "div", 56, 12);
          $$renderer3.push(`<!--[-->`);
          const each_array = ensure_array_like(additionalFields);
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let field = each_array[$$index];
            if (field.name.trim() !== "") {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<div class="field-display svelte-1f3suw5">`);
              push_element($$renderer3, "div", 59, 24);
              $$renderer3.push(`<span class="field-name svelte-1f3suw5">`);
              push_element($$renderer3, "span", 60, 28);
              $$renderer3.push(`${escape_html(field.name)}:</span>`);
              pop_element();
              $$renderer3.push(` <span class="field-value svelte-1f3suw5">`);
              push_element($$renderer3, "span", 61, 28);
              $$renderer3.push(`${escape_html(field.value || "N/A")}</span>`);
              pop_element();
              $$renderer3.push(`</div>`);
              pop_element();
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]-->`);
          }
          $$renderer3.push(`<!--]--></div>`);
          pop_element();
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> `);
        Handle($$renderer3, {
          type: "source",
          position: Position.Top,
          style: { top: "50%" },
          isConnectable: true,
          id: "input"
        });
        $$renderer3.push(`<!----> `);
        Handle($$renderer3, {
          type: "target",
          position: Position.Bottom,
          style: { top: "50%" },
          isConnectable: true,
          id: "output"
        });
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` `);
        Modal($$renderer3, {
          isOpen: open,
          size: "lg",
          children: prevent_snippet_stringification(($$renderer4) => {
            $$renderer4.push(`<div class="modal-header">`);
            push_element($$renderer4, "div", 86, 4);
            $$renderer4.push(`<h5 class="modal-title">`);
            push_element($$renderer4, "h5", 87, 8);
            $$renderer4.push(`Edit Node</h5>`);
            pop_element();
            $$renderer4.push(`</div>`);
            pop_element();
            $$renderer4.push(` <div class="modal-body">`);
            push_element($$renderer4, "div", 89, 4);
            FormGroup($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                Label($$renderer5, {
                  for: "color",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->Node Color:`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> <div class="color-picker-container svelte-1f3suw5">`);
                push_element($$renderer5, "div", 93, 12);
                Input($$renderer5, {
                  type: "color",
                  id: "color",
                  get value() {
                    return nodeColor;
                  },
                  set value($$value) {
                    nodeColor = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!----> <span class="color-preview svelte-1f3suw5"${attr_style(`background-color: ${stringify(nodeColor)}`)}>`);
                push_element($$renderer5, "span", 95, 16);
                $$renderer5.push(`</span>`);
                pop_element();
                $$renderer5.push(` `);
                Input($$renderer5, {
                  type: "text",
                  placeholder: "#ffffff",
                  class: "color-input",
                  get value() {
                    return nodeColor;
                  },
                  set value($$value) {
                    nodeColor = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!----></div>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            FormGroup($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                Label($$renderer5, {
                  for: "type",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->Node Type:`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> `);
                Input($$renderer5, {
                  type: "select",
                  id: "type",
                  get value() {
                    return nodeType;
                  },
                  set value($$value) {
                    nodeType = $$value;
                    $$settled = false;
                  },
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.option({ value: "default" }, ($$renderer7) => {
                      push_element($$renderer7, "option", 104, 16);
                      $$renderer7.push(`Default`);
                      pop_element();
                    });
                    $$renderer6.push(` `);
                    $$renderer6.option({ value: "input" }, ($$renderer7) => {
                      push_element($$renderer7, "option", 105, 16);
                      $$renderer7.push(`Input`);
                      pop_element();
                    });
                    $$renderer6.push(` `);
                    $$renderer6.option({ value: "output" }, ($$renderer7) => {
                      push_element($$renderer7, "option", 106, 16);
                      $$renderer7.push(`Output`);
                      pop_element();
                    });
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!---->`);
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            FormGroup($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                Label($$renderer5, {
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->Additional Fields:`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> <div class="additional-fields svelte-1f3suw5">`);
                push_element($$renderer5, "div", 113, 12);
                $$renderer5.push(`<!--[-->`);
                const each_array_1 = ensure_array_like(additionalFields);
                for (let index = 0, $$length = each_array_1.length; index < $$length; index++) {
                  let field = each_array_1[index];
                  $$renderer5.push(`<div class="field-row svelte-1f3suw5">`);
                  push_element($$renderer5, "div", 115, 20);
                  Input($$renderer5, {
                    type: "text",
                    placeholder: "Field name",
                    class: "field-name",
                    get value() {
                      return field.name;
                    },
                    set value($$value) {
                      field.name = $$value;
                      $$settled = false;
                    }
                  });
                  $$renderer5.push(`<!----> `);
                  Input($$renderer5, {
                    type: "text",
                    placeholder: "Field value",
                    class: "field-value",
                    get value() {
                      return field.value;
                    },
                    set value($$value) {
                      field.value = $$value;
                      $$settled = false;
                    }
                  });
                  $$renderer5.push(`<!----> `);
                  Button($$renderer5, {
                    color: "danger",
                    size: "sm",
                    class: "remove-field-btn",
                    children: prevent_snippet_stringification(($$renderer6) => {
                      $$renderer6.push(`<!---->×`);
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----></div>`);
                  pop_element();
                }
                $$renderer5.push(`<!--]--> `);
                Button($$renderer5, {
                  color: "success",
                  size: "sm",
                  class: "add-field-btn",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->+ Add Field`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----></div>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----></div>`);
            pop_element();
            $$renderer4.push(` <div class="modal-footer">`);
            push_element($$renderer4, "div", 149, 4);
            Button($$renderer4, {
              color: "secondary",
              class: "px-6 py-2",
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
            $$renderer4.push(`<!----></div>`);
            pop_element();
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
      bind_props($$props, { id, data, open });
    },
    TextNode
  );
}
TextNode.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
JsonSchemaParser[FILENAME] = "src/components/apps/graphUI/jsonSchemaParser.svelte";
function JsonSchemaParser($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let jsonData = null;
      let nodes = [];
      let edges = [];
      let error = null;
      let isProcessing = false;
      let jsonTextInput = "";
      const nodeTypes = { textupdater: TextNode };
      const getNodeTypeInfo = (template, config) => {
        const typeMap = {
          "core.HumanInputNode": {
            type: "input",
            color: "#4CAF50",
            icon: "👤",
            label: "Human Input"
          },
          "core.LLMToolNode": {
            type: "default",
            color: "#2196F3",
            icon: "🤖",
            label: "LLM Tool"
          },
          "core.ToolNode": { type: "default", color: "#FF9800", icon: "🔧", label: "Tool" },
          "__start__": { type: "input", color: "#9C27B0", icon: "▶️", label: "Start" },
          "__end__": { type: "output", color: "#F44336", icon: "⏹️", label: "End" }
        };
        return typeMap[template] || {
          type: "default",
          color: "#607D8B",
          icon: "📦",
          label: "Custom Node"
        };
      };
      const calculateNodePositions = (nodes2, edges2) => {
        const positions = {};
        const levels = {};
        const visited = /* @__PURE__ */ new Set();
        const hasIncoming = new Set(edges2.map((e) => e.target));
        const rootNodes = nodes2.filter((n) => !hasIncoming.has(n.id));
        const queue = rootNodes.map((n) => ({ node: n, level: 0 }));
        while (queue.length > 0) {
          const { node, level } = queue.shift();
          if (visited.has(node.id)) continue;
          visited.add(node.id);
          levels[node.id] = level;
          const children = edges2.filter((e) => e.source === node.id).map((e) => nodes2.find((n) => n.id === e.target)).filter((n) => n && !visited.has(n.id));
          children.forEach((child) => {
            queue.push({ node: child, level: level + 1 });
          });
        }
        const levelGroups = {};
        Object.entries(levels).forEach(([nodeId, level]) => {
          if (!levelGroups[level]) levelGroups[level] = [];
          levelGroups[level].push(nodeId);
        });
        Object.entries(levelGroups).forEach(([level, nodeIds]) => {
          const levelNum = parseInt(level);
          const yPos = levelNum * 200 + 100;
          const xSpacing = 300;
          const startX = -(nodeIds.length - 1) * xSpacing / 2 + 400;
          nodeIds.forEach((nodeId, index) => {
            positions[nodeId] = { x: startX + index * xSpacing, y: yPos };
          });
        });
        return positions;
      };
      const parseJsonSchema = (data) => {
        try {
          const parsedNodes = [];
          const parsedEdges = [];
          const nodeIds = data.nodes.map((n) => n.id);
          const hasStart = nodeIds.includes("__start__") || data.edges.some((e) => e.from === "__start__");
          const hasEnd = nodeIds.includes("__end__") || data.edges.some((e) => e.to === "__end__") || data.conditional_edges?.some((ce) => Object.values(ce.routing_map).includes("__end__"));
          if (hasStart && !nodeIds.includes("__start__")) {
            parsedNodes.push({ id: "__start__", template: "__start__", config: {} });
          }
          if (hasEnd && !nodeIds.includes("__end__")) {
            parsedNodes.push({ id: "__end__", template: "__end__", config: {} });
          }
          parsedNodes.push(...data.nodes);
          const allEdges = [
            ...data.edges.map((e) => ({ source: e.from, target: e.to })),
            ...data.conditional_edges?.flatMap((ce) => Object.entries(ce.routing_map).map(([condition, target]) => ({ source: ce.from, target, condition }))) || []
          ];
          const positions = calculateNodePositions(parsedNodes, allEdges);
          const visualNodes = parsedNodes.map((node) => {
            const typeInfo = getNodeTypeInfo(node.template, node.config);
            const position = positions[node.id] || { x: 100, y: 100 };
            const additionalFields = [];
            if (node.config) {
              Object.entries(node.config).forEach(([key, value]) => {
                if (key !== "target" && typeof value !== "object") {
                  additionalFields.push({
                    name: key,
                    value: String(value).length > 30 ? String(value).substring(0, 30) + "..." : String(value)
                  });
                }
              });
            }
            return {
              id: node.id,
              type: "default",
              position,
              data: {
                label: node.id,
                color: typeInfo.color,
                nodeType: typeInfo.type,
                fields: additionalFields,
                template: node.template,
                config: node.config,
                icon: typeInfo.icon
              },
              style: `background-color: ${typeInfo.color}; color: white; border: 2px solid ${typeInfo.color}; border-radius: 8px; padding: 10px; min-width: 150px;`
            };
          });
          const visualEdges = [];
          data.edges.forEach((edge, index) => {
            visualEdges.push({
              id: `edge-${index}`,
              source: edge.from,
              target: edge.to,
              type: "smoothstep",
              animated: false,
              style: "stroke: #b1b1b7; stroke-width: 2px;",
              label: edge.condition || ""
            });
          });
          if (data.conditional_edges) {
            data.conditional_edges.forEach((condEdge) => {
              Object.entries(condEdge.routing_map).forEach(([condition, target], index) => {
                visualEdges.push({
                  id: `cond-edge-${condEdge.from}-${target}-${index}`,
                  source: condEdge.from,
                  target,
                  type: "smoothstep",
                  animated: true,
                  style: "stroke: #FF6B6B; stroke-width: 2px;",
                  label: condition
                });
              });
            });
          }
          return { nodes: visualNodes, edges: visualEdges };
        } catch (err) {
          throw new Error(`Failed to parse JSON schema: ${err.message}`);
        }
      };
      const handleJsonInput = (jsonText) => {
        try {
          error = null;
          isProcessing = true;
          const data = JSON.parse(jsonText);
          jsonData = data;
          const { nodes: parsedNodes, edges: parsedEdges } = parseJsonSchema(data);
          nodes = parsedNodes;
          edges = parsedEdges;
          isProcessing = false;
        } catch (err) {
          error = err.message;
          isProcessing = false;
        }
      };
      if (jsonTextInput.trim()) {
        handleJsonInput(jsonTextInput);
      }
      Container($$renderer2, {
        fluid: true,
        class: "py-4",
        children: prevent_snippet_stringification(($$renderer3) => {
          Row($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              Col($$renderer4, {
                children: prevent_snippet_stringification(($$renderer5) => {
                  Card($$renderer5, {
                    children: prevent_snippet_stringification(($$renderer6) => {
                      CardHeader($$renderer6, {
                        children: prevent_snippet_stringification(($$renderer7) => {
                          CardTitle($$renderer7, {
                            class: "h3 mb-2 d-flex align-items-center",
                            children: prevent_snippet_stringification(($$renderer8) => {
                              $$renderer8.push(`<i class="fas fa-database text-primary me-2">`);
                              push_element($$renderer8, "i", 1379, 14);
                              $$renderer8.push(`</i>`);
                              pop_element();
                              $$renderer8.push(` JSON Schema to Visual Graph`);
                            }),
                            $$slots: { default: true }
                          });
                          $$renderer7.push(`<!----> <p class="text-muted mb-0">`);
                          push_element($$renderer7, "p", 1382, 12);
                          $$renderer7.push(`Upload a JSON schema file or paste JSON to automatically generate a visual flow graph</p>`);
                          pop_element();
                        }),
                        $$slots: { default: true }
                      });
                      $$renderer6.push(`<!----> `);
                      CardBody($$renderer6, {
                        children: prevent_snippet_stringification(($$renderer7) => {
                          Row($$renderer7, {
                            class: "mb-4",
                            children: prevent_snippet_stringification(($$renderer8) => {
                              Col($$renderer8, {
                                lg: 6,
                                children: prevent_snippet_stringification(($$renderer9) => {
                                  Card($$renderer9, {
                                    class: "h-100",
                                    children: prevent_snippet_stringification(($$renderer10) => {
                                      CardBody($$renderer10, {
                                        class: "text-center",
                                        children: prevent_snippet_stringification(($$renderer11) => {
                                          $$renderer11.push(`<i class="fas fa-upload fa-3x text-muted mb-3">`);
                                          push_element($$renderer11, "i", 1393, 20);
                                          $$renderer11.push(`</i>`);
                                          pop_element();
                                          $$renderer11.push(` `);
                                          Label($$renderer11, {
                                            for: "fileInput",
                                            class: "h5 d-block mb-2",
                                            children: prevent_snippet_stringification(($$renderer12) => {
                                              $$renderer12.push(`<!---->Upload JSON Schema`);
                                            }),
                                            $$slots: { default: true }
                                          });
                                          $$renderer11.push(`<!----> `);
                                          Input($$renderer11, {
                                            id: "fileInput",
                                            type: "file",
                                            accept: ".json",
                                            class: "mb-3"
                                          });
                                          $$renderer11.push(`<!----> <div>`);
                                          push_element($$renderer11, "div", 1403, 20);
                                          Button($$renderer11, {
                                            color: "success",
                                            class: "w-100",
                                            style: "margin-bottom: 10px;",
                                            children: prevent_snippet_stringification(($$renderer12) => {
                                              Icon($$renderer12, { name: "play" });
                                              $$renderer12.push(`<!----> Load Agentic JSON`);
                                            }),
                                            $$slots: { default: true }
                                          });
                                          $$renderer11.push(`<!----></div>`);
                                          pop_element();
                                          $$renderer11.push(` <div>`);
                                          push_element($$renderer11, "div", 1409, 20);
                                          Button($$renderer11, {
                                            color: "success",
                                            class: "w-100",
                                            style: "margin-bottom: 10px;",
                                            children: prevent_snippet_stringification(($$renderer12) => {
                                              Icon($$renderer12, { name: "play" });
                                              $$renderer12.push(`<!----> Load PCP JSON`);
                                            }),
                                            $$slots: { default: true }
                                          });
                                          $$renderer11.push(`<!----></div>`);
                                          pop_element();
                                          $$renderer11.push(` <div>`);
                                          push_element($$renderer11, "div", 1415, 20);
                                          $$renderer11.push(`<p>`);
                                          push_element($$renderer11, "p", 1416, 24);
                                          $$renderer11.push(`Don't See A Schema That Matches Your Needs?</p>`);
                                          pop_element();
                                          $$renderer11.push(` `);
                                          Button($$renderer11, {
                                            color: "success",
                                            class: "w-100",
                                            style: "margin-bottom: 10px;",
                                            children: prevent_snippet_stringification(($$renderer12) => {
                                              $$renderer12.push(`<a href="/graphUI" style="text-decoration: none; color: inherit;">`);
                                              push_element($$renderer12, "a", 1418, 28);
                                              $$renderer12.push(`Create Your Own</a>`);
                                              pop_element();
                                            }),
                                            $$slots: { default: true }
                                          });
                                          $$renderer11.push(`<!----></div>`);
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
                              $$renderer8.push(`<!----> `);
                              Col($$renderer8, {
                                lg: 6,
                                children: prevent_snippet_stringification(($$renderer9) => {
                                  Card($$renderer9, {
                                    class: "h-100",
                                    children: prevent_snippet_stringification(($$renderer10) => {
                                      CardBody($$renderer10, {
                                        children: prevent_snippet_stringification(($$renderer11) => {
                                          Label($$renderer11, {
                                            for: "jsonInput",
                                            class: "form-label",
                                            children: prevent_snippet_stringification(($$renderer12) => {
                                              $$renderer12.push(`<!---->Or paste JSON directly:`);
                                            }),
                                            $$slots: { default: true }
                                          });
                                          $$renderer11.push(`<!----> <textarea id="jsonInput" class="form-control font-monospace" rows="10" placeholder="Paste your JSON schema here..." style="resize: none; font-size: 0.875rem;">`);
                                          push_element($$renderer11, "textarea", 1430, 20);
                                          const $$body = escape_html(jsonTextInput);
                                          if ($$body) {
                                            $$renderer11.push(`${$$body}`);
                                          }
                                          $$renderer11.push(`</textarea>`);
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
                              $$renderer8.push(`<!---->`);
                            }),
                            $$slots: { default: true }
                          });
                          $$renderer7.push(`<!----> `);
                          AgentsTab($$renderer7);
                          $$renderer7.push(`<!----> `);
                          if (isProcessing) {
                            $$renderer7.push("<!--[-->");
                            Alert($$renderer7, {
                              color: "info",
                              class: "mb-4",
                              children: prevent_snippet_stringification(($$renderer8) => {
                                $$renderer8.push(`<div class="d-flex align-items-center">`);
                                push_element($$renderer8, "div", 1446, 16);
                                Spinner($$renderer8, { size: "sm", class: "me-2" });
                                $$renderer8.push(`<!----> <span>`);
                                push_element($$renderer8, "span", 1448, 18);
                                $$renderer8.push(`Processing JSON schema...</span>`);
                                pop_element();
                                $$renderer8.push(`</div>`);
                                pop_element();
                              }),
                              $$slots: { default: true }
                            });
                          } else {
                            $$renderer7.push("<!--[!-->");
                          }
                          $$renderer7.push(`<!--]--> `);
                          if (error) {
                            $$renderer7.push("<!--[-->");
                            Alert($$renderer7, {
                              color: "danger",
                              class: "mb-4",
                              children: prevent_snippet_stringification(($$renderer8) => {
                                $$renderer8.push(`<strong>`);
                                push_element($$renderer8, "strong", 1455, 16);
                                $$renderer8.push(`Error:</strong>`);
                                pop_element();
                                $$renderer8.push(` ${escape_html(error)}`);
                              }),
                              $$slots: { default: true }
                            });
                          } else {
                            $$renderer7.push("<!--[!-->");
                          }
                          $$renderer7.push(`<!--]--> `);
                          if (jsonData && !error) {
                            $$renderer7.push("<!--[-->");
                            Card($$renderer7, {
                              class: "mb-4",
                              children: prevent_snippet_stringification(($$renderer8) => {
                                CardHeader($$renderer8, {
                                  children: prevent_snippet_stringification(($$renderer9) => {
                                    CardTitle($$renderer9, {
                                      class: "h5 mb-0",
                                      children: prevent_snippet_stringification(($$renderer10) => {
                                        $$renderer10.push(`<i class="fas fa-file-text me-2">`);
                                        push_element($$renderer10, "i", 1465, 20);
                                        $$renderer10.push(`</i>`);
                                        pop_element();
                                        $$renderer10.push(` Graph Information`);
                                      }),
                                      $$slots: { default: true }
                                    });
                                  }),
                                  $$slots: { default: true }
                                });
                                $$renderer8.push(`<!----> `);
                                CardBody($$renderer8, {
                                  children: prevent_snippet_stringification(($$renderer9) => {
                                    Row($$renderer9, {
                                      children: prevent_snippet_stringification(($$renderer10) => {
                                        Col($$renderer10, {
                                          md: 4,
                                          children: prevent_snippet_stringification(($$renderer11) => {
                                            $$renderer11.push(`<strong>`);
                                            push_element($$renderer11, "strong", 1472, 22);
                                            $$renderer11.push(`Name:</strong>`);
                                            pop_element();
                                            $$renderer11.push(` ${escape_html(jsonData.graph_name || "Unnamed")}`);
                                          }),
                                          $$slots: { default: true }
                                        });
                                        $$renderer10.push(`<!----> `);
                                        Col($$renderer10, {
                                          md: 4,
                                          children: prevent_snippet_stringification(($$renderer11) => {
                                            $$renderer11.push(`<strong>`);
                                            push_element($$renderer11, "strong", 1475, 22);
                                            $$renderer11.push(`Nodes:</strong>`);
                                            pop_element();
                                            $$renderer11.push(` ${escape_html(nodes.length)}`);
                                          }),
                                          $$slots: { default: true }
                                        });
                                        $$renderer10.push(`<!----> `);
                                        Col($$renderer10, {
                                          md: 4,
                                          children: prevent_snippet_stringification(($$renderer11) => {
                                            $$renderer11.push(`<strong>`);
                                            push_element($$renderer11, "strong", 1478, 22);
                                            $$renderer11.push(`Edges:</strong>`);
                                            pop_element();
                                            $$renderer11.push(` ${escape_html(edges.length)}`);
                                          }),
                                          $$slots: { default: true }
                                        });
                                        $$renderer10.push(`<!---->`);
                                      }),
                                      $$slots: { default: true }
                                    });
                                    $$renderer9.push(`<!----> `);
                                    if (jsonData.description) {
                                      $$renderer9.push("<!--[-->");
                                      $$renderer9.push(`<p class="text-muted mt-2 mb-0">`);
                                      push_element($$renderer9, "p", 1482, 20);
                                      $$renderer9.push(`${escape_html(jsonData.description)}</p>`);
                                      pop_element();
                                    } else {
                                      $$renderer9.push("<!--[!-->");
                                    }
                                    $$renderer9.push(`<!--]-->`);
                                  }),
                                  $$slots: { default: true }
                                });
                                $$renderer8.push(`<!---->`);
                              }),
                              $$slots: { default: true }
                            });
                            $$renderer7.push(`<!----> `);
                            Card($$renderer7, {
                              class: "mb-4",
                              children: prevent_snippet_stringification(($$renderer8) => {
                                CardHeader($$renderer8, {
                                  children: prevent_snippet_stringification(($$renderer9) => {
                                    CardTitle($$renderer9, {
                                      class: "h5 mb-0",
                                      children: prevent_snippet_stringification(($$renderer10) => {
                                        $$renderer10.push(`<i class="fas fa-project-diagram me-2">`);
                                        push_element($$renderer10, "i", 1491, 20);
                                        $$renderer10.push(`</i>`);
                                        pop_element();
                                        $$renderer10.push(` Visual Graph`);
                                      }),
                                      $$slots: { default: true }
                                    });
                                  }),
                                  $$slots: { default: true }
                                });
                                $$renderer8.push(`<!----> `);
                                CardBody($$renderer8, {
                                  children: prevent_snippet_stringification(($$renderer9) => {
                                    $$renderer9.push(`<div style="height: 500px; border: 1px solid #dee2e6; border-radius: 0.375rem;">`);
                                    push_element($$renderer9, "div", 1496, 18);
                                    SvelteFlow($$renderer9, {
                                      nodes,
                                      nodeTypes,
                                      edges,
                                      fitView: true,
                                      children: prevent_snippet_stringification(($$renderer10) => {
                                        Controls($$renderer10, {});
                                        $$renderer10.push(`<!----> `);
                                        Background($$renderer10, {});
                                        $$renderer10.push(`<!----> `);
                                        Minimap($$renderer10, {
                                          position: "top-right",
                                          nodeColor: (node) => {
                                            switch (node.type) {
                                              case "Input":
                                                return "#6ede87";
                                              case "Output":
                                                return "#6865A5";
                                              case "default":
                                                return "#ffcc00";
                                              default:
                                                return "#ff0072";
                                            }
                                          },
                                          zoomable: true,
                                          pannable: true
                                        });
                                        $$renderer10.push(`<!----> `);
                                        Panel($$renderer10, {
                                          position: "center-left",
                                          children: prevent_snippet_stringification(($$renderer11) => {
                                            Button($$renderer11, {
                                              children: prevent_snippet_stringification(($$renderer12) => {
                                                $$renderer12.push(`<!---->Add Node`);
                                              }),
                                              $$slots: { default: true }
                                            });
                                          }),
                                          $$slots: { default: true }
                                        });
                                        $$renderer10.push(`<!---->`);
                                      }),
                                      $$slots: { default: true }
                                    });
                                    $$renderer9.push(`<!----></div>`);
                                    pop_element();
                                  }),
                                  $$slots: { default: true }
                                });
                                $$renderer8.push(`<!---->`);
                              }),
                              $$slots: { default: true }
                            });
                            $$renderer7.push(`<!----> `);
                            Row($$renderer7, {
                              children: prevent_snippet_stringification(($$renderer8) => {
                                Col($$renderer8, {
                                  lg: 6,
                                  children: prevent_snippet_stringification(($$renderer9) => {
                                    Card($$renderer9, {
                                      children: prevent_snippet_stringification(($$renderer10) => {
                                        CardHeader($$renderer10, {
                                          children: prevent_snippet_stringification(($$renderer11) => {
                                            CardTitle($$renderer11, {
                                              class: "h5 mb-0",
                                              children: prevent_snippet_stringification(($$renderer12) => {
                                                $$renderer12.push(`<i class="fas fa-cogs me-2">`);
                                                push_element($$renderer12, "i", 1532, 24);
                                                $$renderer12.push(`</i>`);
                                                pop_element();
                                                $$renderer12.push(` Generated Nodes (${escape_html(nodes.length)})`);
                                              }),
                                              $$slots: { default: true }
                                            });
                                          }),
                                          $$slots: { default: true }
                                        });
                                        $$renderer10.push(`<!----> `);
                                        CardBody($$renderer10, {
                                          children: prevent_snippet_stringification(($$renderer11) => {
                                            $$renderer11.push(`<div class="overflow-auto" style="max-height: 300px;">`);
                                            push_element($$renderer11, "div", 1537, 22);
                                            $$renderer11.push(`<!--[-->`);
                                            const each_array = ensure_array_like(nodes);
                                            for (let i = 0, $$length = each_array.length; i < $$length; i++) {
                                              let node = each_array[i];
                                              $$renderer11.push(`<div class="d-flex flex-column mb-2 p-2 bg-light rounded">`);
                                              push_element($$renderer11, "div", 1539, 26);
                                              Button($$renderer11, {
                                                style: "background-color: white; color: black; border: 1px solid #ccc;",
                                                class: "text-start w-100",
                                                children: prevent_snippet_stringification(($$renderer12) => {
                                                  $$renderer12.push(`<div class="d-flex align-items-center mb-1">`);
                                                  push_element($$renderer12, "div", 1541, 30);
                                                  $$renderer12.push(`<div class="rounded-circle me-2"${attr_style(`width: 16px; height: 16px; background-color: ${stringify(node.data.color)};`)}>`);
                                                  push_element($$renderer12, "div", 1542, 32);
                                                  $$renderer12.push(`</div>`);
                                                  pop_element();
                                                  $$renderer12.push(` <span class="fw-bold me-2">`);
                                                  push_element($$renderer12, "span", 1546, 32);
                                                  $$renderer12.push(`${escape_html(node.id)}</span>`);
                                                  pop_element();
                                                  $$renderer12.push(` `);
                                                  Badge($$renderer12, {
                                                    style: "background-color: black; color: white;",
                                                    children: prevent_snippet_stringification(($$renderer13) => {
                                                      $$renderer13.push(`<!---->${escape_html(node.data.nodeType)}`);
                                                    }),
                                                    $$slots: { default: true }
                                                  });
                                                  $$renderer12.push(`<!----> <span class="ms-auto">`);
                                                  push_element($$renderer12, "span", 1548, 32);
                                                  $$renderer12.push(`${escape_html(node.expanded ? "▼" : "▶")}</span>`);
                                                  pop_element();
                                                  $$renderer12.push(`</div>`);
                                                  pop_element();
                                                }),
                                                $$slots: { default: true }
                                              });
                                              $$renderer11.push(`<!----> `);
                                              if (node.expanded) {
                                                $$renderer11.push("<!--[-->");
                                                if (node.data.fields.length > 0) {
                                                  $$renderer11.push("<!--[-->");
                                                  $$renderer11.push(`<div class="ms-2 mb-1">`);
                                                  push_element($$renderer11, "div", 1553, 32);
                                                  $$renderer11.push(`<strong>`);
                                                  push_element($$renderer11, "strong", 1554, 34);
                                                  $$renderer11.push(`Config Fields:</strong>`);
                                                  pop_element();
                                                  $$renderer11.push(` <!--[-->`);
                                                  const each_array_1 = ensure_array_like(node.data.fields);
                                                  for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
                                                    let field = each_array_1[$$index];
                                                    Badge($$renderer11, {
                                                      color: "info",
                                                      class: "me-1",
                                                      children: prevent_snippet_stringification(($$renderer12) => {
                                                        $$renderer12.push(`<!---->${escape_html(field.name)}: ${escape_html(field.value)}`);
                                                      }),
                                                      $$slots: { default: true }
                                                    });
                                                  }
                                                  $$renderer11.push(`<!--]--></div>`);
                                                  pop_element();
                                                } else {
                                                  $$renderer11.push("<!--[!-->");
                                                }
                                                $$renderer11.push(`<!--]--> <div class="ms-2 mb-1">`);
                                                push_element($$renderer11, "div", 1560, 30);
                                                $$renderer11.push(`<strong>`);
                                                push_element($$renderer11, "strong", 1561, 32);
                                                $$renderer11.push(`Template:</strong>`);
                                                pop_element();
                                                $$renderer11.push(` ${escape_html(node.data.template)}</div>`);
                                                pop_element();
                                                $$renderer11.push(` <div class="ms-2 mb-1">`);
                                                push_element($$renderer11, "div", 1563, 30);
                                                $$renderer11.push(`<strong>`);
                                                push_element($$renderer11, "strong", 1564, 32);
                                                $$renderer11.push(`Config:</strong>`);
                                                pop_element();
                                                $$renderer11.push(` <pre style="background: #f5f5f5; padding: 6px; border-radius: 4px; font-size: 11px;">`);
                                                push_element($$renderer11, "pre", 1565, 32);
                                                $$renderer11.push(`${escape_html(JSON.stringify(node.data.config, null, 2))}
                                </pre>`);
                                                pop_element();
                                                $$renderer11.push(`</div>`);
                                                pop_element();
                                              } else {
                                                $$renderer11.push("<!--[!-->");
                                              }
                                              $$renderer11.push(`<!--]--></div>`);
                                              pop_element();
                                            }
                                            $$renderer11.push(`<!--]--></div>`);
                                            pop_element();
                                          }),
                                          $$slots: { default: true }
                                        });
                                        $$renderer10.push(`<!---->`);
                                      }),
                                      $$slots: { default: true }
                                    });
                                  }),
                                  $$slots: { default: true }
                                });
                                $$renderer8.push(`<!----> `);
                                Col($$renderer8, {
                                  lg: 6,
                                  children: prevent_snippet_stringification(($$renderer9) => {
                                    Card($$renderer9, {
                                      children: prevent_snippet_stringification(($$renderer10) => {
                                        CardHeader($$renderer10, {
                                          children: prevent_snippet_stringification(($$renderer11) => {
                                            CardTitle($$renderer11, {
                                              class: "h5 mb-0",
                                              children: prevent_snippet_stringification(($$renderer12) => {
                                                $$renderer12.push(`<i class="fas fa-bolt me-2">`);
                                                push_element($$renderer12, "i", 1582, 24);
                                                $$renderer12.push(`</i>`);
                                                pop_element();
                                                $$renderer12.push(` Generated Edges (${escape_html(edges.length)})`);
                                              }),
                                              $$slots: { default: true }
                                            });
                                          }),
                                          $$slots: { default: true }
                                        });
                                        $$renderer10.push(`<!----> `);
                                        CardBody($$renderer10, {
                                          children: prevent_snippet_stringification(($$renderer11) => {
                                            $$renderer11.push(`<div class="overflow-auto" style="max-height: 300px;">`);
                                            push_element($$renderer11, "div", 1587, 22);
                                            $$renderer11.push(`<!--[-->`);
                                            const each_array_2 = ensure_array_like(edges);
                                            for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
                                              let edge = each_array_2[$$index_2];
                                              $$renderer11.push(`<div class="d-flex align-items-center mb-2 p-2 bg-light rounded">`);
                                              push_element($$renderer11, "div", 1589, 26);
                                              $$renderer11.push(`<div class="d-flex align-items-center">`);
                                              push_element($$renderer11, "div", 1590, 28);
                                              $$renderer11.push(`<small class="fw-bold">`);
                                              push_element($$renderer11, "small", 1591, 30);
                                              $$renderer11.push(`${escape_html(edge.source)}</small>`);
                                              pop_element();
                                              $$renderer11.push(` `);
                                              Icon($$renderer11, {
                                                name: "arrow-right",
                                                style: "margin-left: 8px; margin-right: 8px;"
                                              });
                                              $$renderer11.push(`<!----> <small class="fw-bold">`);
                                              push_element($$renderer11, "small", 1593, 32);
                                              $$renderer11.push(`${escape_html(edge.target)}</small>`);
                                              pop_element();
                                              $$renderer11.push(`</div>`);
                                              pop_element();
                                              $$renderer11.push(` `);
                                              if (edge.animated) {
                                                $$renderer11.push("<!--[-->");
                                                Badge($$renderer11, {
                                                  color: "danger",
                                                  class: "ms-2",
                                                  children: prevent_snippet_stringification(($$renderer12) => {
                                                    $$renderer12.push(`<!---->Conditional`);
                                                  }),
                                                  $$slots: { default: true }
                                                });
                                              } else {
                                                $$renderer11.push("<!--[!-->");
                                              }
                                              $$renderer11.push(`<!--]--></div>`);
                                              pop_element();
                                            }
                                            $$renderer11.push(`<!--]--></div>`);
                                            pop_element();
                                          }),
                                          $$slots: { default: true }
                                        });
                                        $$renderer10.push(`<!---->`);
                                      }),
                                      $$slots: { default: true }
                                    });
                                  }),
                                  $$slots: { default: true }
                                });
                                $$renderer8.push(`<!---->`);
                              }),
                              $$slots: { default: true }
                            });
                            $$renderer7.push(`<!---->`);
                          } else {
                            $$renderer7.push("<!--[!-->");
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
            }),
            $$slots: { default: true }
          });
        }),
        $$slots: { default: true }
      });
    },
    JsonSchemaParser
  );
}
JsonSchemaParser.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  JsonSchemaParser as J,
  TextNode as T
};
