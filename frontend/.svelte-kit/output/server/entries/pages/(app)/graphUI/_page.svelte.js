import { a3 as FILENAME, a4 as fallback } from "../../../../chunks/utils2.js";
import "clsx";
import { c as bind_props, h as head, b as attr, g as attr_style, f as stringify, p as prevent_snippet_stringification } from "../../../../chunks/index2.js";
import { S as SvelteFlow, B as Background, C as Controls, M as Minimap, P as Panel } from "../../../../chunks/AgentsTab.js";
import { p as push_element, a as pop_element } from "../../../../chunks/dev.js";
import { M as Modal, p as FormGroup, g as Input, L as Label, B as Button } from "../../../../chunks/Tooltip.js";
import { getBezierPath, Position, ConnectionLineType } from "@xyflow/system";
import { e as escape_html } from "../../../../chunks/context.js";
import dagre from "@dagrejs/dagre";
import { T as TextNode } from "../../../../chunks/jsonSchemaParser.js";
import "@sveltejs/kit";
CustomEdge[FILENAME] = "src/components/apps/graphUI/CustomEdge.svelte";
function CustomEdge($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let edgePath, labelX, labelY, dynamicMarkerEnd, strokeDasharray, edgeStyles;
      let id = $$props["id"];
      let sourceX = $$props["sourceX"];
      let sourceY = $$props["sourceY"];
      let targetX = $$props["targetX"];
      let targetY = $$props["targetY"];
      let sourcePosition = $$props["sourcePosition"];
      let targetPosition = $$props["targetPosition"];
      let data = fallback($$props["data"], () => ({}), true);
      let markerEnd = fallback($$props["markerEnd"], "");
      let style = fallback($$props["style"], "");
      let open = fallback($$props["open"], false);
      let isAnimated = data.animated || false;
      let hasArrow = data.arrow || false;
      let edgeColor = data.color || "#b1b1b7";
      let strokeWidth = data.strokeWidth || 2;
      [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition
      });
      dynamicMarkerEnd = hasArrow ? "url(#arrowhead)" : "";
      strokeDasharray = isAnimated ? "5,5" : "";
      edgeStyles = {
        stroke: edgeColor,
        strokeWidth,
        strokeDasharray,
        animation: isAnimated ? "dashdraw 0.5s linear infinite" : "none"
      };
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        head("dhioj0", $$renderer3, ($$renderer4) => {
          $$renderer4.push(`<style>
      @keyframes dashdraw {
          to {
              stroke-dashoffset: -10;
          }
      }
  </style>`);
        });
        $$renderer3.push(`<g>`);
        push_element($$renderer3, "g", 76, 0);
        $$renderer3.push(`<defs>`);
        push_element($$renderer3, "defs", 78, 2);
        $$renderer3.push(`<marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">`);
        push_element($$renderer3, "marker", 79, 6);
        $$renderer3.push(`<polygon points="0 0, 10 3.5, 0 7"${attr("fill", edgeColor)}>`);
        push_element($$renderer3, "polygon", 87, 10);
        $$renderer3.push(`</polygon>`);
        pop_element();
        $$renderer3.push(`</marker>`);
        pop_element();
        $$renderer3.push(`</defs>`);
        pop_element();
        $$renderer3.push(`<path${attr("d", edgePath)} stroke="transparent" stroke-width="20" fill="none" style="cursor: pointer;">`);
        push_element($$renderer3, "path", 95, 2);
        $$renderer3.push(`</path>`);
        pop_element();
        $$renderer3.push(`<path${attr("id", id)}${attr("d", edgePath)}${attr("stroke", edgeStyles.stroke)}${attr("stroke-width", edgeStyles.strokeWidth)}${attr("stroke-dasharray", edgeStyles.strokeDasharray)} fill="none"${attr("marker-end", dynamicMarkerEnd)}${attr_style(`animation: ${stringify(edgeStyles.animation)}`)}>`);
        push_element($$renderer3, "path", 106, 2);
        $$renderer3.push(`</path>`);
        pop_element();
        {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></g>`);
        pop_element();
        Modal($$renderer3, {
          isOpen: open,
          size: "lg",
          children: prevent_snippet_stringification(($$renderer4) => {
            $$renderer4.push(`<div class="modal-header">`);
            push_element($$renderer4, "div", 141, 2);
            $$renderer4.push(`<h5 class="modal-title">`);
            push_element($$renderer4, "h5", 142, 6);
            $$renderer4.push(`Edit Edge</h5>`);
            pop_element();
            $$renderer4.push(`</div>`);
            pop_element();
            $$renderer4.push(` <div class="modal-body">`);
            push_element($$renderer4, "div", 144, 2);
            FormGroup($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<div class="form-check svelte-dhioj0">`);
                push_element($$renderer5, "div", 147, 10);
                Input($$renderer5, {
                  type: "checkbox",
                  id: "animated",
                  class: "form-check-input",
                  get checked() {
                    return isAnimated;
                  },
                  set checked($$value) {
                    isAnimated = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!----> `);
                Label($$renderer5, {
                  for: "animated",
                  class: "form-check-label",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->Animated Edge`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----></div>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            FormGroup($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<div class="form-check svelte-dhioj0">`);
                push_element($$renderer5, "div", 162, 10);
                Input($$renderer5, {
                  type: "checkbox",
                  id: "arrow",
                  class: "form-check-input",
                  get checked() {
                    return hasArrow;
                  },
                  set checked($$value) {
                    hasArrow = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!----> `);
                Label($$renderer5, {
                  for: "arrow",
                  class: "form-check-label",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->Show Arrow`);
                  }),
                  $$slots: { default: true }
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
                  for: "edgeColor",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->Edge Color:`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> <div class="color-picker-container svelte-dhioj0">`);
                push_element($$renderer5, "div", 178, 10);
                Input($$renderer5, {
                  type: "color",
                  id: "edgeColor",
                  get value() {
                    return edgeColor;
                  },
                  set value($$value) {
                    edgeColor = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!----> <span class="color-preview svelte-dhioj0"${attr_style(`background-color: ${stringify(edgeColor)}`)}>`);
                push_element($$renderer5, "span", 180, 14);
                $$renderer5.push(`</span>`);
                pop_element();
                $$renderer5.push(` `);
                Input($$renderer5, {
                  type: "text",
                  placeholder: "#b1b1b7",
                  class: "color-input",
                  get value() {
                    return edgeColor;
                  },
                  set value($$value) {
                    edgeColor = $$value;
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
                  for: "strokeWidth",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->Stroke Width:`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> `);
                Input($$renderer5, {
                  type: "range",
                  id: "strokeWidth",
                  min: "1",
                  max: "10",
                  get value() {
                    return strokeWidth;
                  },
                  set value($$value) {
                    strokeWidth = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!----> <span class="stroke-width-value svelte-dhioj0">`);
                push_element($$renderer5, "span", 195, 10);
                $$renderer5.push(`${escape_html(strokeWidth)}px</span>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            FormGroup($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                Label($$renderer5, {
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->Preview:`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> <div class="edge-preview svelte-dhioj0">`);
                push_element($$renderer5, "div", 201, 10);
                $$renderer5.push(`<svg width="200" height="50">`);
                push_element($$renderer5, "svg", 202, 14);
                $$renderer5.push(`<defs>`);
                push_element($$renderer5, "defs", 203, 18);
                $$renderer5.push(`<marker id="preview-arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">`);
                push_element($$renderer5, "marker", 204, 22);
                $$renderer5.push(`<polygon points="0 0, 10 3.5, 0 7"${attr("fill", edgeColor)}>`);
                push_element($$renderer5, "polygon", 212, 26);
                $$renderer5.push(`</polygon>`);
                pop_element();
                $$renderer5.push(`</marker>`);
                pop_element();
                $$renderer5.push(`</defs>`);
                pop_element();
                $$renderer5.push(`<path d="M 20 25 L 180 25"${attr("stroke", edgeColor)}${attr("stroke-width", strokeWidth)}${attr("stroke-dasharray", isAnimated ? "5,5" : "")} fill="none"${attr("marker-end", hasArrow ? "url(#preview-arrowhead)" : "")}${attr_style(`animation: ${stringify(isAnimated ? "dashdraw 0.5s linear infinite" : "none")}`)}>`);
                push_element($$renderer5, "path", 218, 18);
                $$renderer5.push(`</path>`);
                pop_element();
                $$renderer5.push(`</svg>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----></div>`);
            pop_element();
            $$renderer4.push(` <div class="modal-footer">`);
            push_element($$renderer4, "div", 231, 2);
            Button($$renderer4, {
              color: "secondary",
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
      bind_props($$props, {
        id,
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
        data,
        markerEnd,
        style,
        open
      });
    },
    CustomEdge
  );
}
CustomEdge.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
GraphUI[FILENAME] = "src/components/apps/graphUI/graphUI.svelte";
function GraphUI($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const nodeTypes = { textupdater: TextNode };
      const edgeTypes = { "custom-edge": CustomEdge };
      const dagreGraph = new dagre.graphlib.Graph();
      dagreGraph.setDefaultEdgeLabel(() => ({}));
      function getLayoutedElements(nodes2, edges2, direction = "TB") {
        const isHorizontal = direction === "LR";
        dagreGraph.setGraph({ rankdir: direction });
        nodes2.forEach((node) => {
          dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
        });
        edges2.forEach((edge) => {
          dagreGraph.setEdge(edge.source, edge.target);
        });
        dagre.layout(dagreGraph);
        const layoutedNodes2 = nodes2.map((node) => {
          const nodeWithPosition = dagreGraph.node(node.id);
          node.targetPosition = isHorizontal ? Position.Left : Position.Top;
          node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
          return {
            ...node,
            position: {
              x: nodeWithPosition.x - nodeWidth / 2,
              y: nodeWithPosition.y - nodeHeight / 2
            }
          };
        });
        return { nodes: layoutedNodes2, edges: edges2 };
      }
      const nodeWidth = 172;
      const nodeHeight = 36;
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements([], []);
      let nodes = layoutedNodes;
      let edges = layoutedEdges;
      function onLayout(direction) {
        const layoutedElements = getLayoutedElements(nodes, edges, direction);
        nodes = layoutedElements.nodes;
        edges = layoutedElements.edges;
      }
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<div${attr_style("", { width: "100vw", height: "100vh" })}>`);
        push_element($$renderer3, "div", 83, 0);
        SvelteFlow($$renderer3, {
          nodeTypes,
          edgeTypes,
          fitView: true,
          connectionLineType: ConnectionLineType.SmoothStep,
          defaultEdgeOptions: { type: "smoothstep" },
          get nodes() {
            return nodes;
          },
          set nodes($$value) {
            nodes = $$value;
            $$settled = false;
          },
          get edges() {
            return edges;
          },
          set edges($$value) {
            edges = $$value;
            $$settled = false;
          },
          children: prevent_snippet_stringification(($$renderer4) => {
            Background($$renderer4, {});
            $$renderer4.push(`<!----> `);
            Controls($$renderer4, { position: "top-left" });
            $$renderer4.push(`<!----> `);
            Minimap($$renderer4, {
              position: "top-right",
              nodeColor: (node) => {
                switch (node.type) {
                  case "input":
                    return "#6ede87";
                  case "output":
                    return "#6865A5";
                  case "textupdater":
                    return "#ffcc00";
                  default:
                    return "#ff0072";
                }
              },
              zoomable: true,
              pannable: true
            });
            $$renderer4.push(`<!----> `);
            Panel($$renderer4, {
              position: "center-left",
              children: prevent_snippet_stringification(($$renderer5) => {
                Button($$renderer5, {
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->Add Node`);
                  }),
                  $$slots: { default: true }
                });
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Panel($$renderer4, {
              position: "top-center",
              children: prevent_snippet_stringification(($$renderer5) => {
                Button($$renderer5, {
                  onclick: () => onLayout("TB"),
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->vertical layout`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> `);
                Button($$renderer5, {
                  onclick: () => onLayout("LR"),
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->horizontal layout`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> `);
                Button($$renderer5, {
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<a href="/jsonParser" style="text-decoration: none; color: inherit;">`);
                    push_element($$renderer6, "a", 120, 16);
                    $$renderer6.push(`JSON Schema Parser</a>`);
                    pop_element();
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!---->`);
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Panel($$renderer4, { position: "center-right" });
            $$renderer4.push(`<!---->`);
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div>`);
        pop_element();
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
    },
    GraphUI
  );
}
GraphUI.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(app)/graphUI/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      GraphUI($$renderer2);
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
