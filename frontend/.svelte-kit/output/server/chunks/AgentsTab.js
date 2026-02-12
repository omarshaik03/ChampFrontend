import { w as state_snapshot_uncloneable, l as attributes, m as clsx, f as stringify, b as attr, d as attr_class, g as attr_style, p as prevent_snippet_stringification, x as derived, c as bind_props, e as ensure_array_like, q as spread_props, y as css_props, a as store_get, u as unsubscribe_stores } from "./index2.js";
import { p as push_element, a as pop_element } from "./dev.js";
import { a6 as is_array, a7 as get_prototype_of, a8 as object_prototype, a3 as FILENAME, a9 as run, a4 as fallback } from "./utils2.js";
import { w as onDestroy, B as Button, M as Modal, n as ModalHeader, o as ModalBody, s as ModalFooter, t as Badge, L as Label, g as Input, i as Container, R as Row, j as Col, C as Card, h as CardBody, A as Alert, k as CardHeader, x as CardFooter, P as Pagination, y as PaginationItem, z as PaginationLink } from "./Tooltip.js";
import { h as hasContext, g as getContext, s as setContext, e as escape_html } from "./context.js";
import { l as llmConfigStore, L as LlmConfigSelector } from "./LlmConfigSelector.js";
import { r as runtimeConfig } from "./runtime-config.js";
import { marked } from "marked";
import { h as html } from "./html.js";
import { Position, ConnectionMode, isEdgeBase, isNodeBase, getBezierPath, getSmoothStepPath, getStraightPath, getNodesInside, isEdgeVisible, getEdgePosition, getElevatedEdgeZIndex, initialConnection, fitViewport, getInternalNodesBounds, getViewportForBounds, adoptUserNodes, updateConnectionLookup, infiniteExtent, SelectionMode, mergeAriaLabelConfig, pointToRendererPoint, createMarkerIds, devWarn, panBy, snapPosition, calculateNodePosition, errorMessages, updateNodeInternals, updateAbsolutePositions, getHandlePosition, addEdge, nodeHasDimensions, getMarkerId, MarkerType, isNumeric, getNodesBounds, rendererPointToPoint, getElementsToRemove, isRectObject, getOverlappingArea, nodeToRect, evaluateAbsolutePosition, isMacOs, ConnectionLineType, getConnectionStatus, PanOnScrollMode, getBoundsOfRects, getNodeDimensions } from "@xyflow/system";
import "clsx";
import { t as toasts } from "./toastStore.js";
import { u as userStore } from "./userStore.js";
const empty = [];
function snapshot(value, skip_warning = false, no_tojson = false) {
  if (!skip_warning) {
    const paths = [];
    const copy = clone(value, /* @__PURE__ */ new Map(), "", paths, null, no_tojson);
    if (paths.length === 1 && paths[0] === "") {
      state_snapshot_uncloneable();
    } else if (paths.length > 0) {
      const slice = paths.length > 10 ? paths.slice(0, 7) : paths.slice(0, 10);
      const excess = paths.length - slice.length;
      let uncloned = slice.map((path) => `- <value>${path}`).join("\n");
      if (excess > 0) uncloned += `
- ...and ${excess} more`;
      state_snapshot_uncloneable(uncloned);
    }
    return copy;
  }
  return clone(value, /* @__PURE__ */ new Map(), "", empty, null, no_tojson);
}
function clone(value, cloned, path, paths, original = null, no_tojson = false) {
  if (typeof value === "object" && value !== null) {
    var unwrapped = cloned.get(value);
    if (unwrapped !== void 0) return unwrapped;
    if (value instanceof Map) return (
      /** @type {Snapshot<T>} */
      new Map(value)
    );
    if (value instanceof Set) return (
      /** @type {Snapshot<T>} */
      new Set(value)
    );
    if (is_array(value)) {
      var copy = (
        /** @type {Snapshot<any>} */
        Array(value.length)
      );
      cloned.set(value, copy);
      if (original !== null) {
        cloned.set(original, copy);
      }
      for (var i = 0; i < value.length; i += 1) {
        var element = value[i];
        if (i in value) {
          copy[i] = clone(element, cloned, `${path}[${i}]`, paths, null, no_tojson);
        }
      }
      return copy;
    }
    if (get_prototype_of(value) === object_prototype) {
      copy = {};
      cloned.set(value, copy);
      if (original !== null) {
        cloned.set(original, copy);
      }
      for (var key2 in value) {
        copy[key2] = clone(
          // @ts-expect-error
          value[key2],
          cloned,
          `${path}.${key2}`,
          paths,
          null,
          no_tojson
        );
      }
      return copy;
    }
    if (value instanceof Date) {
      return (
        /** @type {Snapshot<T>} */
        structuredClone(value)
      );
    }
    if (typeof /** @type {T & { toJSON?: any } } */
    value.toJSON === "function" && !no_tojson) {
      return clone(
        /** @type {T & { toJSON(): any } } */
        value.toJSON(),
        cloned,
        `${path}.toJSON()`,
        paths,
        // Associate the instance with the toJSON clone
        value
      );
    }
  }
  if (value instanceof EventTarget) {
    return (
      /** @type {Snapshot<T>} */
      value
    );
  }
  try {
    return (
      /** @type {Snapshot<T>} */
      structuredClone(value)
    );
  } catch (e) {
    {
      paths.push(path);
    }
    return (
      /** @type {Snapshot<T>} */
      value
    );
  }
}
function createContext() {
  const key2 = {};
  return [
    (errorMessage) => {
      if (errorMessage && !hasContext(key2)) {
        throw new Error(errorMessage);
      }
      return getContext(key2);
    },
    (context) => setContext(key2, context)
  ];
}
const [getNodeIdContext, setNodeIdContext] = createContext();
const [getNodeConnectableContext, setNodeConnectableContext] = createContext();
const [getEdgeIdContext, setEdgeIdContext] = createContext();
Handle[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/Handle/Handle.svelte";
function Handle($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        id: handleId = null,
        type = "source",
        position = Position.Top,
        style,
        class: className,
        isConnectable: isConnectableProp,
        isConnectableStart = true,
        isConnectableEnd = true,
        isValidConnection,
        onconnect,
        ondisconnect,
        children,
        $$slots,
        $$events,
        ...rest
      } = $$props;
      const nodeId = getNodeIdContext("Handle must be used within a Custom Node component");
      const isConnectableContext = getNodeConnectableContext("Handle must be used within a Custom Node component");
      let isTarget = type === "target";
      let isConnectable = isConnectableProp !== void 0 ? isConnectableProp : isConnectableContext.value;
      let store = useStore();
      let ariaLabelConfig = store.ariaLabelConfig;
      let [
        connectionInProgress,
        connectingFrom,
        connectingTo,
        isPossibleTargetHandle,
        valid
      ] = (() => {
        if (!store.connection.inProgress) {
          return [false, false, false, false, null];
        }
        const { fromHandle, toHandle, isValid } = store.connection;
        const connectingFrom2 = fromHandle && fromHandle.nodeId === nodeId && fromHandle.type === type && fromHandle.id === handleId;
        const connectingTo2 = toHandle && toHandle.nodeId === nodeId && toHandle.type === type && toHandle.id === handleId;
        const isPossibleTargetHandle2 = store.connectionMode === ConnectionMode.Strict ? fromHandle?.type !== type : nodeId !== fromHandle?.nodeId || handleId !== fromHandle?.id;
        const valid2 = connectingTo2 && isValid;
        return [
          true,
          connectingFrom2,
          connectingTo2,
          isPossibleTargetHandle2,
          valid2
        ];
      })();
      $$renderer2.push(`<div${attributes(
        {
          "data-handleid": handleId,
          "data-nodeid": nodeId,
          "data-handlepos": position,
          "data-id": `${stringify(store.flowId)}-${stringify(nodeId)}-${stringify(handleId ?? "null")}-${stringify(type)}`,
          class: clsx([
            "svelte-flow__handle",
            `svelte-flow__handle-${position}`,
            store.noDragClass,
            store.noPanClass,
            position,
            className
          ]),
          style,
          role: "button",
          "aria-label": ariaLabelConfig[`handle.ariaLabel`],
          tabindex: "-1",
          ...rest
        },
        void 0,
        {
          valid,
          connectingto: connectingTo,
          connectingfrom: connectingFrom,
          source: !isTarget,
          target: isTarget,
          connectablestart: isConnectableStart,
          connectableend: isConnectableEnd,
          connectable: isConnectable,
          connectionindicator: isConnectable && (!connectionInProgress || isPossibleTargetHandle) && (connectionInProgress || store.clickConnectStartHandle ? isConnectableEnd : isConnectableStart)
        }
      )}>`);
      push_element($$renderer2, "div", 151, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div>`);
      pop_element();
    },
    Handle
  );
}
Handle.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
DefaultNode[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/nodes/DefaultNode.svelte";
function DefaultNode($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        data,
        targetPosition = Position.Top,
        sourcePosition = Position.Bottom
      } = $$props;
      Handle($$renderer2, { type: "target", position: targetPosition });
      $$renderer2.push(`<!----> ${escape_html(data?.label)} `);
      Handle($$renderer2, { type: "source", position: sourcePosition });
      $$renderer2.push(`<!---->`);
    },
    DefaultNode
  );
}
DefaultNode.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
InputNode[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/nodes/InputNode.svelte";
function InputNode($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { data = { label: "Node" }, sourcePosition = Position.Bottom } = $$props;
      $$renderer2.push(`<!---->${escape_html(data?.label)} `);
      Handle($$renderer2, { type: "source", position: sourcePosition });
      $$renderer2.push(`<!---->`);
    },
    InputNode
  );
}
InputNode.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
OutputNode[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/nodes/OutputNode.svelte";
function OutputNode($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { data = { label: "Node" }, targetPosition = Position.Top } = $$props;
      $$renderer2.push(`<!---->${escape_html(data?.label)} `);
      Handle($$renderer2, { type: "target", position: targetPosition });
      $$renderer2.push(`<!---->`);
    },
    OutputNode
  );
}
OutputNode.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
GroupNode[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/nodes/GroupNode.svelte";
function GroupNode($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
    },
    GroupNode
  );
}
GroupNode.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
function hideOnSSR() {
  let hide = typeof window === "undefined";
  return {
    get value() {
      return hide;
    }
  };
}
const isNode = (element) => isNodeBase(element);
const isEdge = (element) => isEdgeBase(element);
function toPxString(value) {
  return value === void 0 ? void 0 : `${value}px`;
}
EdgeLabel[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/EdgeLabel/EdgeLabel.svelte";
function EdgeLabel($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        x = 0,
        y = 0,
        width,
        height,
        selectEdgeOnClick = false,
        transparent = false,
        class: className,
        children,
        $$slots,
        $$events,
        ...rest
      } = $$props;
      const store = useStore();
      const edgeId = getEdgeIdContext("EdgeLabel must be used within a Custom Edge component");
      let z = (() => {
        return store.visible.edges.get(edgeId)?.zIndex;
      })();
      $$renderer2.push(`<div${attributes(
        {
          class: clsx(["svelte-flow__edge-label", { transparent }, className]),
          tabindex: "-1",
          ...rest
        },
        "svelte-1wg91mu",
        void 0,
        {
          display: hideOnSSR().value ? "none" : void 0,
          cursor: selectEdgeOnClick ? "pointer" : void 0,
          transform: `translate(-50%, -50%) translate(${stringify(x)}px,${stringify(y)}px)`,
          "pointer-events": "all",
          width: toPxString(width),
          height: toPxString(height),
          "z-index": z
        }
      )}>`);
      push_element($$renderer2, "div", 23, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div>`);
      pop_element();
    },
    EdgeLabel
  );
}
EdgeLabel.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
BaseEdge[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/edges/BaseEdge.svelte";
function BaseEdge($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        id,
        path,
        label,
        labelX,
        labelY,
        labelStyle,
        markerStart,
        markerEnd,
        style,
        interactionWidth = 20,
        class: className,
        $$slots,
        $$events,
        ...rest
      } = $$props;
      $$renderer2.push(`<path${attr("id", id)}${attr("d", path)}${attr_class(clsx(["svelte-flow__edge-path", className]))}${attr("marker-start", markerStart)}${attr("marker-end", markerEnd)} fill="none"${attr_style(style)}>`);
      push_element($$renderer2, "path", 18, 0);
      $$renderer2.push(`</path>`);
      pop_element();
      if (interactionWidth > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<path${attributes(
          {
            d: path,
            "stroke-opacity": 0,
            "stroke-width": interactionWidth,
            fill: "none",
            class: "svelte-flow__edge-interaction",
            ...rest
          },
          void 0,
          void 0,
          void 0,
          3
        )}>`);
        push_element($$renderer2, "path", 29, 2);
        $$renderer2.push(`</path>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
      if (label) {
        $$renderer2.push("<!--[-->");
        EdgeLabel($$renderer2, {
          x: labelX,
          y: labelY,
          style: labelStyle,
          selectEdgeOnClick: true,
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<!---->${escape_html(label)}`);
          }),
          $$slots: { default: true }
        });
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    },
    BaseEdge
  );
}
BaseEdge.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
BezierEdge[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/edges/BezierEdge.svelte";
function BezierEdge($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        id,
        interactionWidth,
        label,
        labelStyle,
        markerEnd,
        markerStart,
        pathOptions,
        sourcePosition,
        sourceX,
        sourceY,
        style,
        targetPosition,
        targetX,
        targetY
      } = $$props;
      let [path, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
        curvature: pathOptions?.curvature
      });
      BaseEdge($$renderer2, {
        id,
        path,
        labelX,
        labelY,
        label,
        labelStyle,
        markerStart,
        markerEnd,
        interactionWidth,
        style
      });
    },
    BezierEdge
  );
}
BezierEdge.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
SmoothStepEdgeInternal[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/edges/SmoothStepEdgeInternal.svelte";
function SmoothStepEdgeInternal($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        interactionWidth,
        label,
        labelStyle,
        style,
        markerEnd,
        markerStart,
        sourcePosition,
        sourceX,
        sourceY,
        targetPosition,
        targetX,
        targetY
      } = $$props;
      let [path, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition
      });
      BaseEdge($$renderer2, {
        path,
        labelX,
        labelY,
        label,
        labelStyle,
        markerStart,
        markerEnd,
        interactionWidth,
        style
      });
    },
    SmoothStepEdgeInternal
  );
}
SmoothStepEdgeInternal.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
StraightEdgeInternal[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/edges/StraightEdgeInternal.svelte";
function StraightEdgeInternal($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        sourceX,
        sourceY,
        targetX,
        targetY,
        label,
        labelStyle,
        markerStart,
        markerEnd,
        interactionWidth,
        style
      } = $$props;
      let [path, labelX, labelY] = getStraightPath({ sourceX, sourceY, targetX, targetY });
      BaseEdge($$renderer2, {
        path,
        labelX,
        labelY,
        label,
        labelStyle,
        markerStart,
        markerEnd,
        interactionWidth,
        style
      });
    },
    StraightEdgeInternal
  );
}
StraightEdgeInternal.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
StepEdgeInternal[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/edges/StepEdgeInternal.svelte";
function StepEdgeInternal($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        label,
        labelStyle,
        markerStart,
        markerEnd,
        interactionWidth,
        style
      } = $$props;
      let [path, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
        borderRadius: 0
      });
      BaseEdge($$renderer2, {
        path,
        labelX,
        labelY,
        label,
        labelStyle,
        markerStart,
        markerEnd,
        interactionWidth,
        style
      });
    },
    StepEdgeInternal
  );
}
StepEdgeInternal.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
class MediaQuery {
  current;
  /**
   * @param {string} query
   * @param {boolean} [matches]
   */
  constructor(query, matches = false) {
    this.current = matches;
  }
}
function getVisibleNodes(nodeLookup, transform, width, height) {
  const visibleNodes = /* @__PURE__ */ new Map();
  getNodesInside(nodeLookup, { x: 0, y: 0, width, height }, transform, true).forEach((node) => {
    visibleNodes.set(node.id, node);
  });
  return visibleNodes;
}
function getLayoutedEdges(options) {
  const { edges, defaultEdgeOptions, nodeLookup, previousEdges, connectionMode, onerror, onlyRenderVisible, elevateEdgesOnSelect, zIndexMode } = options;
  const layoutedEdges = /* @__PURE__ */ new Map();
  for (const edge of edges) {
    const sourceNode = nodeLookup.get(edge.source);
    const targetNode = nodeLookup.get(edge.target);
    if (!sourceNode || !targetNode) {
      continue;
    }
    if (onlyRenderVisible) {
      const { visibleNodes, transform, width, height } = options;
      if (isEdgeVisible({
        sourceNode,
        targetNode,
        width,
        height,
        transform
      })) {
        visibleNodes.set(sourceNode.id, sourceNode);
        visibleNodes.set(targetNode.id, targetNode);
      } else {
        continue;
      }
    }
    const previous = previousEdges.get(edge.id);
    if (previous && edge === previous.edge && sourceNode == previous.sourceNode && targetNode == previous.targetNode) {
      layoutedEdges.set(edge.id, previous);
      continue;
    }
    const edgePosition = getEdgePosition({
      id: edge.id,
      sourceNode,
      targetNode,
      sourceHandle: edge.sourceHandle || null,
      targetHandle: edge.targetHandle || null,
      connectionMode,
      onError: onerror
    });
    if (edgePosition) {
      layoutedEdges.set(edge.id, {
        ...defaultEdgeOptions,
        ...edge,
        ...edgePosition,
        zIndex: getElevatedEdgeZIndex({
          selected: edge.selected,
          zIndex: edge.zIndex ?? defaultEdgeOptions.zIndex,
          sourceNode,
          targetNode,
          elevateOnSelect: elevateEdgesOnSelect,
          zIndexMode
        }),
        sourceNode,
        targetNode,
        edge
      });
    }
  }
  return layoutedEdges;
}
const initialNodeTypes = {
  input: InputNode,
  output: OutputNode,
  default: DefaultNode,
  group: GroupNode
};
const initialEdgeTypes = {
  straight: StraightEdgeInternal,
  smoothstep: SmoothStepEdgeInternal,
  default: BezierEdge,
  step: StepEdgeInternal
};
function getInitialViewport(_nodesInitialized, fitView, initialViewport, width, height, nodeLookup) {
  if (fitView && !initialViewport && width && height) {
    const bounds = getInternalNodesBounds(nodeLookup, {
      filter: (node) => !!((node.width || node.initialWidth) && (node.height || node.initialHeight))
    });
    return getViewportForBounds(bounds, width, height, 0.5, 2, 0.1);
  } else {
    return initialViewport ?? { x: 0, y: 0, zoom: 1 };
  }
}
function getInitialStore(signals) {
  class SvelteFlowStore {
    #flowId = derived(() => signals.props.id ?? "1");
    get flowId() {
      return this.#flowId();
    }
    set flowId($$value) {
      return this.#flowId($$value);
    }
    domNode = null;
    panZoom = null;
    width = signals.width ?? 0;
    height = signals.height ?? 0;
    zIndexMode = signals.props.zIndexMode ?? "basic";
    #nodesInitialized = derived(() => {
      const nodesInitialized = adoptUserNodes(signals.nodes, this.nodeLookup, this.parentLookup, {
        nodeExtent: this.nodeExtent,
        nodeOrigin: this.nodeOrigin,
        elevateNodesOnSelect: signals.props.elevateNodesOnSelect ?? true,
        checkEquality: true,
        zIndexMode: this.zIndexMode
      });
      if (this.fitViewQueued && nodesInitialized) {
        if (this.fitViewOptions?.duration) {
          this.resolveFitView();
        } else {
          queueMicrotask(() => {
            this.resolveFitView();
          });
        }
      }
      return nodesInitialized;
    });
    get nodesInitialized() {
      return this.#nodesInitialized();
    }
    set nodesInitialized($$value) {
      return this.#nodesInitialized($$value);
    }
    #viewportInitialized = derived(() => this.panZoom !== null);
    get viewportInitialized() {
      return this.#viewportInitialized();
    }
    set viewportInitialized($$value) {
      return this.#viewportInitialized($$value);
    }
    #_edges = derived(() => {
      updateConnectionLookup(this.connectionLookup, this.edgeLookup, signals.edges);
      return signals.edges;
    });
    get _edges() {
      return this.#_edges();
    }
    set _edges($$value) {
      return this.#_edges($$value);
    }
    get nodes() {
      this.nodesInitialized;
      return signals.nodes;
    }
    set nodes(nodes) {
      signals.nodes = nodes;
    }
    get edges() {
      return this._edges;
    }
    set edges(edges) {
      signals.edges = edges;
    }
    _prevSelectedNodes = [];
    _prevSelectedNodeIds = /* @__PURE__ */ new Set();
    #selectedNodes = derived(() => {
      const selectedNodesCount = this._prevSelectedNodeIds.size;
      const selectedNodeIds = /* @__PURE__ */ new Set();
      const selectedNodes = this.nodes.filter((node) => {
        if (node.selected) {
          selectedNodeIds.add(node.id);
          this._prevSelectedNodeIds.delete(node.id);
        }
        return node.selected;
      });
      if (selectedNodesCount !== selectedNodeIds.size || this._prevSelectedNodeIds.size > 0) {
        this._prevSelectedNodes = selectedNodes;
      }
      this._prevSelectedNodeIds = selectedNodeIds;
      return this._prevSelectedNodes;
    });
    get selectedNodes() {
      return this.#selectedNodes();
    }
    set selectedNodes($$value) {
      return this.#selectedNodes($$value);
    }
    _prevSelectedEdges = [];
    _prevSelectedEdgeIds = /* @__PURE__ */ new Set();
    #selectedEdges = derived(() => {
      const selectedEdgesCount = this._prevSelectedEdgeIds.size;
      const selectedEdgeIds = /* @__PURE__ */ new Set();
      const selectedEdges = this.edges.filter((edge) => {
        if (edge.selected) {
          selectedEdgeIds.add(edge.id);
          this._prevSelectedEdgeIds.delete(edge.id);
        }
        return edge.selected;
      });
      if (selectedEdgesCount !== selectedEdgeIds.size || this._prevSelectedEdgeIds.size > 0) {
        this._prevSelectedEdges = selectedEdges;
      }
      this._prevSelectedEdgeIds = selectedEdgeIds;
      return this._prevSelectedEdges;
    });
    get selectedEdges() {
      return this.#selectedEdges();
    }
    set selectedEdges($$value) {
      return this.#selectedEdges($$value);
    }
    selectionChangeHandlers = /* @__PURE__ */ new Map();
    nodeLookup = /* @__PURE__ */ new Map();
    parentLookup = /* @__PURE__ */ new Map();
    connectionLookup = /* @__PURE__ */ new Map();
    edgeLookup = /* @__PURE__ */ new Map();
    _prevVisibleEdges = /* @__PURE__ */ new Map();
    #visible = derived(() => {
      const {
        // We need to access this._nodes to trigger on changes
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        nodes,
        _edges: edges,
        _prevVisibleEdges: previousEdges,
        nodeLookup,
        connectionMode,
        onerror,
        onlyRenderVisibleElements,
        defaultEdgeOptions,
        zIndexMode
      } = this;
      let visibleNodes;
      let visibleEdges;
      const options = {
        edges,
        defaultEdgeOptions,
        previousEdges,
        nodeLookup,
        connectionMode,
        elevateEdgesOnSelect: signals.props.elevateEdgesOnSelect ?? true,
        zIndexMode,
        onerror
      };
      if (onlyRenderVisibleElements) {
        const { viewport, width, height } = this;
        const transform = [viewport.x, viewport.y, viewport.zoom];
        visibleNodes = getVisibleNodes(nodeLookup, transform, width, height);
        visibleEdges = getLayoutedEdges({
          ...options,
          onlyRenderVisible: true,
          visibleNodes,
          transform,
          width,
          height
        });
      } else {
        visibleNodes = this.nodeLookup;
        visibleEdges = getLayoutedEdges(options);
      }
      return { nodes: visibleNodes, edges: visibleEdges };
    });
    get visible() {
      return this.#visible();
    }
    set visible($$value) {
      return this.#visible($$value);
    }
    #nodesDraggable = derived(() => signals.props.nodesDraggable ?? true);
    get nodesDraggable() {
      return this.#nodesDraggable();
    }
    set nodesDraggable($$value) {
      return this.#nodesDraggable($$value);
    }
    #nodesConnectable = derived(() => signals.props.nodesConnectable ?? true);
    get nodesConnectable() {
      return this.#nodesConnectable();
    }
    set nodesConnectable($$value) {
      return this.#nodesConnectable($$value);
    }
    #elementsSelectable = derived(() => signals.props.elementsSelectable ?? true);
    get elementsSelectable() {
      return this.#elementsSelectable();
    }
    set elementsSelectable($$value) {
      return this.#elementsSelectable($$value);
    }
    #nodesFocusable = derived(() => signals.props.nodesFocusable ?? true);
    get nodesFocusable() {
      return this.#nodesFocusable();
    }
    set nodesFocusable($$value) {
      return this.#nodesFocusable($$value);
    }
    #edgesFocusable = derived(() => signals.props.edgesFocusable ?? true);
    get edgesFocusable() {
      return this.#edgesFocusable();
    }
    set edgesFocusable($$value) {
      return this.#edgesFocusable($$value);
    }
    #disableKeyboardA11y = derived(() => signals.props.disableKeyboardA11y ?? false);
    get disableKeyboardA11y() {
      return this.#disableKeyboardA11y();
    }
    set disableKeyboardA11y($$value) {
      return this.#disableKeyboardA11y($$value);
    }
    #minZoom = derived(() => signals.props.minZoom ?? 0.5);
    get minZoom() {
      return this.#minZoom();
    }
    set minZoom($$value) {
      return this.#minZoom($$value);
    }
    #maxZoom = derived(() => signals.props.maxZoom ?? 2);
    get maxZoom() {
      return this.#maxZoom();
    }
    set maxZoom($$value) {
      return this.#maxZoom($$value);
    }
    #nodeOrigin = derived(() => signals.props.nodeOrigin ?? [0, 0]);
    get nodeOrigin() {
      return this.#nodeOrigin();
    }
    set nodeOrigin($$value) {
      return this.#nodeOrigin($$value);
    }
    #nodeExtent = derived(() => signals.props.nodeExtent ?? infiniteExtent);
    get nodeExtent() {
      return this.#nodeExtent();
    }
    set nodeExtent($$value) {
      return this.#nodeExtent($$value);
    }
    #translateExtent = derived(() => signals.props.translateExtent ?? infiniteExtent);
    get translateExtent() {
      return this.#translateExtent();
    }
    set translateExtent($$value) {
      return this.#translateExtent($$value);
    }
    #defaultEdgeOptions = derived(() => signals.props.defaultEdgeOptions ?? {});
    get defaultEdgeOptions() {
      return this.#defaultEdgeOptions();
    }
    set defaultEdgeOptions($$value) {
      return this.#defaultEdgeOptions($$value);
    }
    #nodeDragThreshold = derived(() => signals.props.nodeDragThreshold ?? 1);
    get nodeDragThreshold() {
      return this.#nodeDragThreshold();
    }
    set nodeDragThreshold($$value) {
      return this.#nodeDragThreshold($$value);
    }
    #autoPanOnNodeDrag = derived(() => signals.props.autoPanOnNodeDrag ?? true);
    get autoPanOnNodeDrag() {
      return this.#autoPanOnNodeDrag();
    }
    set autoPanOnNodeDrag($$value) {
      return this.#autoPanOnNodeDrag($$value);
    }
    #autoPanOnConnect = derived(() => signals.props.autoPanOnConnect ?? true);
    get autoPanOnConnect() {
      return this.#autoPanOnConnect();
    }
    set autoPanOnConnect($$value) {
      return this.#autoPanOnConnect($$value);
    }
    #autoPanOnNodeFocus = derived(() => signals.props.autoPanOnNodeFocus ?? true);
    get autoPanOnNodeFocus() {
      return this.#autoPanOnNodeFocus();
    }
    set autoPanOnNodeFocus($$value) {
      return this.#autoPanOnNodeFocus($$value);
    }
    #autoPanSpeed = derived(() => signals.props.autoPanSpeed ?? 15);
    get autoPanSpeed() {
      return this.#autoPanSpeed();
    }
    set autoPanSpeed($$value) {
      return this.#autoPanSpeed($$value);
    }
    #connectionDragThreshold = derived(() => signals.props.connectionDragThreshold ?? 1);
    get connectionDragThreshold() {
      return this.#connectionDragThreshold();
    }
    set connectionDragThreshold($$value) {
      return this.#connectionDragThreshold($$value);
    }
    fitViewQueued = signals.props.fitView ?? false;
    fitViewOptions = signals.props.fitViewOptions;
    fitViewResolver = null;
    #snapGrid = derived(() => signals.props.snapGrid ?? null);
    get snapGrid() {
      return this.#snapGrid();
    }
    set snapGrid($$value) {
      return this.#snapGrid($$value);
    }
    dragging = false;
    selectionRect = null;
    selectionKeyPressed = false;
    multiselectionKeyPressed = false;
    deleteKeyPressed = false;
    panActivationKeyPressed = false;
    zoomActivationKeyPressed = false;
    selectionRectMode = null;
    ariaLiveMessage = "";
    #selectionMode = derived(() => signals.props.selectionMode ?? SelectionMode.Partial);
    get selectionMode() {
      return this.#selectionMode();
    }
    set selectionMode($$value) {
      return this.#selectionMode($$value);
    }
    #nodeTypes = derived(() => ({ ...initialNodeTypes, ...signals.props.nodeTypes }));
    get nodeTypes() {
      return this.#nodeTypes();
    }
    set nodeTypes($$value) {
      return this.#nodeTypes($$value);
    }
    #edgeTypes = derived(() => ({ ...initialEdgeTypes, ...signals.props.edgeTypes }));
    get edgeTypes() {
      return this.#edgeTypes();
    }
    set edgeTypes($$value) {
      return this.#edgeTypes($$value);
    }
    #noPanClass = derived(() => signals.props.noPanClass ?? "nopan");
    get noPanClass() {
      return this.#noPanClass();
    }
    set noPanClass($$value) {
      return this.#noPanClass($$value);
    }
    #noDragClass = derived(() => signals.props.noDragClass ?? "nodrag");
    get noDragClass() {
      return this.#noDragClass();
    }
    set noDragClass($$value) {
      return this.#noDragClass($$value);
    }
    #noWheelClass = derived(() => signals.props.noWheelClass ?? "nowheel");
    get noWheelClass() {
      return this.#noWheelClass();
    }
    set noWheelClass($$value) {
      return this.#noWheelClass($$value);
    }
    #ariaLabelConfig = derived(() => mergeAriaLabelConfig(signals.props.ariaLabelConfig));
    get ariaLabelConfig() {
      return this.#ariaLabelConfig();
    }
    set ariaLabelConfig($$value) {
      return this.#ariaLabelConfig($$value);
    }
    _viewport = getInitialViewport(this.nodesInitialized, signals.props.fitView, signals.props.initialViewport, this.width, this.height, this.nodeLookup);
    get viewport() {
      return signals.viewport ?? this._viewport;
    }
    set viewport(newViewport) {
      if (signals.viewport) {
        signals.viewport = newViewport;
      }
      this._viewport = newViewport;
    }
    // _connection is viewport independent and originating from XYHandle
    _connection = initialConnection;
    #connection = derived(
      // We derive a viewport dependent connection here
      () => {
        if (!this._connection.inProgress) {
          return this._connection;
        }
        return {
          ...this._connection,
          to: pointToRendererPoint(this._connection.to, [this.viewport.x, this.viewport.y, this.viewport.zoom])
        };
      }
    );
    get connection() {
      return this.#connection();
    }
    set connection($$value) {
      return this.#connection($$value);
    }
    #connectionMode = derived(() => signals.props.connectionMode ?? ConnectionMode.Strict);
    get connectionMode() {
      return this.#connectionMode();
    }
    set connectionMode($$value) {
      return this.#connectionMode($$value);
    }
    #connectionRadius = derived(() => signals.props.connectionRadius ?? 20);
    get connectionRadius() {
      return this.#connectionRadius();
    }
    set connectionRadius($$value) {
      return this.#connectionRadius($$value);
    }
    #isValidConnection = derived(() => signals.props.isValidConnection ?? (() => true));
    get isValidConnection() {
      return this.#isValidConnection();
    }
    set isValidConnection($$value) {
      return this.#isValidConnection($$value);
    }
    #selectNodesOnDrag = derived(() => signals.props.selectNodesOnDrag ?? true);
    get selectNodesOnDrag() {
      return this.#selectNodesOnDrag();
    }
    set selectNodesOnDrag($$value) {
      return this.#selectNodesOnDrag($$value);
    }
    #defaultMarkerColor = derived(() => signals.props.defaultMarkerColor === void 0 ? "#b1b1b7" : signals.props.defaultMarkerColor);
    get defaultMarkerColor() {
      return this.#defaultMarkerColor();
    }
    set defaultMarkerColor($$value) {
      return this.#defaultMarkerColor($$value);
    }
    #markers = derived(() => {
      return createMarkerIds(signals.edges, {
        defaultColor: this.defaultMarkerColor,
        id: this.flowId,
        defaultMarkerStart: this.defaultEdgeOptions.markerStart,
        defaultMarkerEnd: this.defaultEdgeOptions.markerEnd
      });
    });
    get markers() {
      return this.#markers();
    }
    set markers($$value) {
      return this.#markers($$value);
    }
    #onlyRenderVisibleElements = derived(() => signals.props.onlyRenderVisibleElements ?? false);
    get onlyRenderVisibleElements() {
      return this.#onlyRenderVisibleElements();
    }
    set onlyRenderVisibleElements($$value) {
      return this.#onlyRenderVisibleElements($$value);
    }
    #onerror = derived(() => signals.props.onflowerror ?? devWarn);
    get onerror() {
      return this.#onerror();
    }
    set onerror($$value) {
      return this.#onerror($$value);
    }
    #ondelete = derived(() => signals.props.ondelete);
    get ondelete() {
      return this.#ondelete();
    }
    set ondelete($$value) {
      return this.#ondelete($$value);
    }
    #onbeforedelete = derived(() => signals.props.onbeforedelete);
    get onbeforedelete() {
      return this.#onbeforedelete();
    }
    set onbeforedelete($$value) {
      return this.#onbeforedelete($$value);
    }
    #onbeforeconnect = derived(() => signals.props.onbeforeconnect);
    get onbeforeconnect() {
      return this.#onbeforeconnect();
    }
    set onbeforeconnect($$value) {
      return this.#onbeforeconnect($$value);
    }
    #onconnect = derived(() => signals.props.onconnect);
    get onconnect() {
      return this.#onconnect();
    }
    set onconnect($$value) {
      return this.#onconnect($$value);
    }
    #onconnectstart = derived(() => signals.props.onconnectstart);
    get onconnectstart() {
      return this.#onconnectstart();
    }
    set onconnectstart($$value) {
      return this.#onconnectstart($$value);
    }
    #onconnectend = derived(() => signals.props.onconnectend);
    get onconnectend() {
      return this.#onconnectend();
    }
    set onconnectend($$value) {
      return this.#onconnectend($$value);
    }
    #onbeforereconnect = derived(() => signals.props.onbeforereconnect);
    get onbeforereconnect() {
      return this.#onbeforereconnect();
    }
    set onbeforereconnect($$value) {
      return this.#onbeforereconnect($$value);
    }
    #onreconnect = derived(() => signals.props.onreconnect);
    get onreconnect() {
      return this.#onreconnect();
    }
    set onreconnect($$value) {
      return this.#onreconnect($$value);
    }
    #onreconnectstart = derived(() => signals.props.onreconnectstart);
    get onreconnectstart() {
      return this.#onreconnectstart();
    }
    set onreconnectstart($$value) {
      return this.#onreconnectstart($$value);
    }
    #onreconnectend = derived(() => signals.props.onreconnectend);
    get onreconnectend() {
      return this.#onreconnectend();
    }
    set onreconnectend($$value) {
      return this.#onreconnectend($$value);
    }
    #clickConnect = derived(() => signals.props.clickConnect ?? true);
    get clickConnect() {
      return this.#clickConnect();
    }
    set clickConnect($$value) {
      return this.#clickConnect($$value);
    }
    #onclickconnectstart = derived(() => signals.props.onclickconnectstart);
    get onclickconnectstart() {
      return this.#onclickconnectstart();
    }
    set onclickconnectstart($$value) {
      return this.#onclickconnectstart($$value);
    }
    #onclickconnectend = derived(() => signals.props.onclickconnectend);
    get onclickconnectend() {
      return this.#onclickconnectend();
    }
    set onclickconnectend($$value) {
      return this.#onclickconnectend($$value);
    }
    clickConnectStartHandle = null;
    #onselectiondrag = derived(() => signals.props.onselectiondrag);
    get onselectiondrag() {
      return this.#onselectiondrag();
    }
    set onselectiondrag($$value) {
      return this.#onselectiondrag($$value);
    }
    #onselectiondragstart = derived(() => signals.props.onselectiondragstart);
    get onselectiondragstart() {
      return this.#onselectiondragstart();
    }
    set onselectiondragstart($$value) {
      return this.#onselectiondragstart($$value);
    }
    #onselectiondragstop = derived(() => signals.props.onselectiondragstop);
    get onselectiondragstop() {
      return this.#onselectiondragstop();
    }
    set onselectiondragstop($$value) {
      return this.#onselectiondragstop($$value);
    }
    resolveFitView = async () => {
      if (!this.panZoom) {
        return;
      }
      await fitViewport(
        {
          nodes: this.nodeLookup,
          width: this.width,
          height: this.height,
          panZoom: this.panZoom,
          minZoom: this.minZoom,
          maxZoom: this.maxZoom
        },
        this.fitViewOptions
      );
      this.fitViewResolver?.resolve(true);
      this.fitViewQueued = false;
      this.fitViewOptions = void 0;
      this.fitViewResolver = null;
    };
    _prefersDark = new MediaQuery("(prefers-color-scheme: dark)", signals.props.colorModeSSR === "dark");
    #colorMode = derived(() => signals.props.colorMode === "system" ? this._prefersDark.current ? "dark" : "light" : signals.props.colorMode ?? "light");
    get colorMode() {
      return this.#colorMode();
    }
    set colorMode($$value) {
      return this.#colorMode($$value);
    }
    constructor() {
      if (process.env.NODE_ENV === "development") {
        warnIfDeeplyReactive(signals.nodes, "nodes");
        warnIfDeeplyReactive(signals.edges, "edges");
      }
    }
    resetStoreValues() {
      this.dragging = false;
      this.selectionRect = null;
      this.selectionRectMode = null;
      this.selectionKeyPressed = false;
      this.multiselectionKeyPressed = false;
      this.deleteKeyPressed = false;
      this.panActivationKeyPressed = false;
      this.zoomActivationKeyPressed = false;
      this._connection = initialConnection;
      this.clickConnectStartHandle = null;
      this.viewport = signals.props.initialViewport ?? { x: 0, y: 0, zoom: 1 };
      this.ariaLiveMessage = "";
    }
  }
  return new SvelteFlowStore();
}
function warnIfDeeplyReactive(array, name) {
  try {
    if (array && array.length > 0) {
      structuredClone(array[0]);
    }
  } catch {
    console.warn(`Use $state.raw for ${name} to prevent performance issues.`);
  }
}
function useStore() {
  const storeContext = getContext(key);
  if (!storeContext) {
    throw new Error("To call useStore outside of <SvelteFlow /> you need to wrap your component in a <SvelteFlowProvider />");
  }
  return storeContext.getStore();
}
const key = Symbol();
function createStore(signals) {
  const store = getInitialStore(signals);
  function setNodeTypes(nodeTypes) {
    store.nodeTypes = {
      ...initialNodeTypes,
      ...nodeTypes
    };
  }
  function setEdgeTypes(edgeTypes) {
    store.edgeTypes = {
      ...initialEdgeTypes,
      ...edgeTypes
    };
  }
  function addEdge$1(edgeParams) {
    store.edges = addEdge(edgeParams, store.edges);
  }
  const updateNodePositions = (nodeDragItems, dragging = false) => {
    store.nodes = store.nodes.map((node) => {
      if (store.connection.inProgress && store.connection.fromNode.id === node.id) {
        const internalNode = store.nodeLookup.get(node.id);
        if (internalNode) {
          store.connection = {
            ...store.connection,
            from: getHandlePosition(internalNode, store.connection.fromHandle, Position.Left, true)
          };
        }
      }
      const dragItem = nodeDragItems.get(node.id);
      return dragItem ? { ...node, position: dragItem.position, dragging } : node;
    });
  };
  function updateNodeInternals$1(updates) {
    const { changes, updatedInternals } = updateNodeInternals(updates, store.nodeLookup, store.parentLookup, store.domNode, store.nodeOrigin, store.nodeExtent, store.zIndexMode);
    if (!updatedInternals) {
      return;
    }
    updateAbsolutePositions(store.nodeLookup, store.parentLookup, {
      nodeOrigin: store.nodeOrigin,
      nodeExtent: store.nodeExtent,
      zIndexMode: store.zIndexMode
    });
    if (store.fitViewQueued) {
      store.resolveFitView();
    }
    const newNodes = /* @__PURE__ */ new Map();
    for (const change of changes) {
      const userNode = store.nodeLookup.get(change.id)?.internals.userNode;
      if (!userNode) {
        continue;
      }
      const node = { ...userNode };
      switch (change.type) {
        case "dimensions": {
          const measured = { ...node.measured, ...change.dimensions };
          if (change.setAttributes) {
            node.width = change.dimensions?.width ?? node.width;
            node.height = change.dimensions?.height ?? node.height;
          }
          node.measured = measured;
          break;
        }
        case "position":
          node.position = change.position ?? node.position;
          break;
      }
      newNodes.set(change.id, node);
    }
    store.nodes = store.nodes.map((node) => newNodes.get(node.id) ?? node);
  }
  function fitView(options) {
    const fitViewResolver = store.fitViewResolver ?? Promise.withResolvers();
    store.fitViewQueued = true;
    store.fitViewOptions = options;
    store.fitViewResolver = fitViewResolver;
    store.nodes = [...store.nodes];
    return fitViewResolver.promise;
  }
  async function setCenter(x, y, options) {
    const nextZoom = typeof options?.zoom !== "undefined" ? options.zoom : store.maxZoom;
    const currentPanZoom = store.panZoom;
    if (!currentPanZoom) {
      return Promise.resolve(false);
    }
    await currentPanZoom.setViewport({
      x: store.width / 2 - x * nextZoom,
      y: store.height / 2 - y * nextZoom,
      zoom: nextZoom
    }, { duration: options?.duration, ease: options?.ease, interpolate: options?.interpolate });
    return Promise.resolve(true);
  }
  function zoomBy(factor, options) {
    const panZoom = store.panZoom;
    if (!panZoom) {
      return Promise.resolve(false);
    }
    return panZoom.scaleBy(factor, options);
  }
  function zoomIn(options) {
    return zoomBy(1.2, options);
  }
  function zoomOut(options) {
    return zoomBy(1 / 1.2, options);
  }
  function setMinZoom(minZoom) {
    const panZoom = store.panZoom;
    if (panZoom) {
      panZoom.setScaleExtent([minZoom, store.maxZoom]);
      store.minZoom = minZoom;
    }
  }
  function setMaxZoom(maxZoom) {
    const panZoom = store.panZoom;
    if (panZoom) {
      panZoom.setScaleExtent([store.minZoom, maxZoom]);
      store.maxZoom = maxZoom;
    }
  }
  function setTranslateExtent(extent) {
    const panZoom = store.panZoom;
    if (panZoom) {
      panZoom.setTranslateExtent(extent);
      store.translateExtent = extent;
    }
  }
  function deselect(elements, elementsToDeselect = null) {
    let deselected = false;
    const newElements = elements.map((element) => {
      const shouldDeselect = elementsToDeselect ? elementsToDeselect.has(element.id) : true;
      if (shouldDeselect && element.selected) {
        deselected = true;
        return { ...element, selected: false };
      }
      return element;
    });
    return [deselected, newElements];
  }
  function unselectNodesAndEdges(params) {
    const nodesToDeselect = params?.nodes ? new Set(params.nodes.map((node) => node.id)) : null;
    const [nodesDeselected, newNodes] = deselect(store.nodes, nodesToDeselect);
    if (nodesDeselected) {
      store.nodes = newNodes;
    }
    const edgesToDeselect = params?.edges ? new Set(params.edges.map((node) => node.id)) : null;
    const [edgesDeselected, newEdges] = deselect(store.edges, edgesToDeselect);
    if (edgesDeselected) {
      store.edges = newEdges;
    }
  }
  function addSelectedNodes(ids) {
    const isMultiSelection = store.multiselectionKeyPressed;
    store.nodes = store.nodes.map((node) => {
      const nodeWillBeSelected = ids.includes(node.id);
      const selected = isMultiSelection ? node.selected || nodeWillBeSelected : nodeWillBeSelected;
      if (!!node.selected !== selected) {
        return { ...node, selected };
      }
      return node;
    });
    if (!isMultiSelection) {
      unselectNodesAndEdges({ nodes: [] });
    }
  }
  function addSelectedEdges(ids) {
    const isMultiSelection = store.multiselectionKeyPressed;
    store.edges = store.edges.map((edge) => {
      const edgeWillBeSelected = ids.includes(edge.id);
      const selected = isMultiSelection ? edge.selected || edgeWillBeSelected : edgeWillBeSelected;
      if (!!edge.selected !== selected) {
        return { ...edge, selected };
      }
      return edge;
    });
    if (!isMultiSelection) {
      unselectNodesAndEdges({ edges: [] });
    }
  }
  function handleNodeSelection(id, unselect, nodeRef) {
    const node = store.nodeLookup.get(id);
    if (!node) {
      console.warn("012", errorMessages["error012"](id));
      return;
    }
    store.selectionRect = null;
    store.selectionRectMode = null;
    if (!node.selected) {
      addSelectedNodes([id]);
    } else if (unselect || node.selected && store.multiselectionKeyPressed) {
      unselectNodesAndEdges({ nodes: [node], edges: [] });
      requestAnimationFrame(() => nodeRef?.blur());
    }
  }
  function handleEdgeSelection(id) {
    const edge = store.edgeLookup.get(id);
    if (!edge) {
      console.warn("012", errorMessages["error012"](id));
      return;
    }
    const selectable = edge.selectable || store.elementsSelectable && typeof edge.selectable === "undefined";
    if (selectable) {
      store.selectionRect = null;
      store.selectionRectMode = null;
      if (!edge.selected) {
        addSelectedEdges([id]);
      } else if (edge.selected && store.multiselectionKeyPressed) {
        unselectNodesAndEdges({ nodes: [], edges: [edge] });
      }
    }
  }
  function moveSelectedNodes(direction, factor) {
    const { nodeExtent, snapGrid, nodeOrigin, nodeLookup, nodesDraggable, onerror } = store;
    const nodeUpdates = /* @__PURE__ */ new Map();
    const xVelo = snapGrid?.[0] ?? 5;
    const yVelo = snapGrid?.[1] ?? 5;
    const xDiff = direction.x * xVelo * factor;
    const yDiff = direction.y * yVelo * factor;
    for (const node of nodeLookup.values()) {
      const isSelected = node.selected && (node.draggable || nodesDraggable && typeof node.draggable === "undefined");
      if (!isSelected) {
        continue;
      }
      let nextPosition = {
        x: node.internals.positionAbsolute.x + xDiff,
        y: node.internals.positionAbsolute.y + yDiff
      };
      if (snapGrid) {
        nextPosition = snapPosition(nextPosition, snapGrid);
      }
      const { position, positionAbsolute } = calculateNodePosition({
        nodeId: node.id,
        nextPosition,
        nodeLookup,
        nodeExtent,
        nodeOrigin,
        onError: onerror
      });
      node.position = position;
      node.internals.positionAbsolute = positionAbsolute;
      nodeUpdates.set(node.id, node);
    }
    updateNodePositions(nodeUpdates);
  }
  function panBy$1(delta) {
    return panBy({
      delta,
      panZoom: store.panZoom,
      transform: [store.viewport.x, store.viewport.y, store.viewport.zoom],
      translateExtent: store.translateExtent,
      width: store.width,
      height: store.height
    });
  }
  const updateConnection = (newConnection) => {
    store._connection = { ...newConnection };
  };
  function cancelConnection() {
    store._connection = initialConnection;
  }
  function reset() {
    store.resetStoreValues();
    unselectNodesAndEdges();
  }
  const storeWithActions = Object.assign(store, {
    setNodeTypes,
    setEdgeTypes,
    addEdge: addEdge$1,
    updateNodePositions,
    updateNodeInternals: updateNodeInternals$1,
    zoomIn,
    zoomOut,
    fitView,
    setCenter,
    setMinZoom,
    setMaxZoom,
    setTranslateExtent,
    unselectNodesAndEdges,
    addSelectedNodes,
    addSelectedEdges,
    handleNodeSelection,
    handleEdgeSelection,
    moveSelectedNodes,
    panBy: panBy$1,
    updateConnection,
    cancelConnection,
    reset
  });
  return storeWithActions;
}
Zoom[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/container/Zoom/Zoom.svelte";
function Zoom($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        store = void 0,
        panOnScrollMode,
        preventScrolling,
        zoomOnScroll,
        zoomOnDoubleClick,
        zoomOnPinch,
        panOnDrag,
        panOnScroll,
        panOnScrollSpeed,
        paneClickDistance,
        selectionOnDrag,
        onmovestart,
        onmove,
        onmoveend,
        oninit,
        children
      } = $$props;
      store.panActivationKeyPressed || panOnDrag;
      store.panActivationKeyPressed || panOnScroll;
      const { viewport: initialViewport } = store;
      $$renderer2.push(`<div class="svelte-flow__zoom svelte-flow__container">`);
      push_element($$renderer2, "div", 33, 0);
      children($$renderer2);
      $$renderer2.push(`<!----></div>`);
      pop_element();
      bind_props($$props, { store });
    },
    Zoom
  );
}
Zoom.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Pane[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/container/Pane/Pane.svelte";
function Pane($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        store = void 0,
        panOnDrag = true,
        paneClickDistance = 1,
        selectionOnDrag,
        onpaneclick,
        onpanecontextmenu,
        onselectionstart,
        onselectionend,
        children
      } = $$props;
      let panOnDragActive = store.panActivationKeyPressed || panOnDrag;
      let isSelecting = store.selectionKeyPressed || !!store.selectionRect || selectionOnDrag && panOnDragActive !== true;
      store.elementsSelectable && (isSelecting || store.selectionRectMode === "user");
      $$renderer2.push(`<div${attr_class("svelte-flow__pane svelte-flow__container", void 0, {
        "draggable": panOnDrag === true || Array.isArray(panOnDrag) && panOnDrag.includes(0),
        "dragging": store.dragging,
        "selection": isSelecting
      })}>`);
      push_element($$renderer2, "div", 178, 0);
      children($$renderer2);
      $$renderer2.push(`<!----></div>`);
      pop_element();
      bind_props($$props, { store });
    },
    Pane
  );
}
Pane.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Viewport[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/container/Viewport/Viewport.svelte";
function Viewport($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { store = void 0, children } = $$props;
      $$renderer2.push(`<div class="svelte-flow__viewport xyflow__viewport svelte-flow__container"${attr_style("", {
        transform: `translate(${stringify(store.viewport.x)}px, ${stringify(store.viewport.y)}px) scale(${stringify(store.viewport.zoom)})`
      })}>`);
      push_element($$renderer2, "div", 7, 0);
      children($$renderer2);
      $$renderer2.push(`<!----></div>`);
      pop_element();
      bind_props($$props, { store });
    },
    Viewport
  );
}
Viewport.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
A11yDescriptions[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/A11yDescriptions/A11yDescriptions.svelte";
function A11yDescriptions($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { store } = $$props;
      $$renderer2.push(`<div${attr("id", `${ARIA_NODE_DESC_KEY}-${store.flowId}`)} class="a11y-hidden svelte-13pq11u">`);
      push_element($$renderer2, "div", 5, 0);
      $$renderer2.push(`${escape_html(store.disableKeyboardA11y ? store.ariaLabelConfig["node.a11yDescription.default"] : store.ariaLabelConfig["node.a11yDescription.keyboardDisabled"])}</div>`);
      pop_element();
      $$renderer2.push(` <div${attr("id", `${ARIA_EDGE_DESC_KEY}-${store.flowId}`)} class="a11y-hidden svelte-13pq11u">`);
      push_element($$renderer2, "div", 10, 0);
      $$renderer2.push(`${escape_html(store.ariaLabelConfig["edge.a11yDescription.default"])}</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (!store.disableKeyboardA11y) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div${attr("id", `${ARIA_LIVE_MESSAGE}-${store.flowId}`)} aria-live="assertive" aria-atomic="true" class="a11y-live-msg svelte-13pq11u">`);
        push_element($$renderer2, "div", 15, 2);
        $$renderer2.push(`${escape_html(store.ariaLiveMessage)}</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    },
    A11yDescriptions
  );
}
A11yDescriptions.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
const ARIA_NODE_DESC_KEY = "svelte-flow__node-desc";
const ARIA_EDGE_DESC_KEY = "svelte-flow__edge-desc";
const ARIA_LIVE_MESSAGE = "svelte-flow__aria-live";
NodeWrapper[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/NodeWrapper/NodeWrapper.svelte";
function NodeWrapper($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        store = void 0,
        node,
        resizeObserver,
        nodeClickDistance,
        onnodeclick,
        onnodedrag,
        onnodedragstart,
        onnodedragstop,
        onnodepointerenter,
        onnodepointerleave,
        onnodepointermove,
        onnodecontextmenu
      } = $$props;
      let {
        data = {},
        selected = false,
        draggable: _draggable,
        selectable: _selectable,
        deletable = true,
        connectable: _connectable,
        focusable: _focusable,
        hidden = false,
        dragging = false,
        style = "",
        class: className,
        type = "default",
        parentId,
        sourcePosition,
        targetPosition,
        measured: { width: measuredWidth, height: measuredHeight } = { width: 0, height: 0 },
        initialWidth,
        initialHeight,
        width,
        height,
        dragHandle,
        internals: {
          z: zIndex = 0,
          positionAbsolute: { x: positionX, y: positionY },
          userNode
        }
      } = node;
      let { id } = node;
      let draggable = _draggable ?? store.nodesDraggable;
      let selectable = _selectable ?? store.elementsSelectable;
      let connectable = _connectable ?? store.nodesConnectable;
      let hasDimensions = nodeHasDimensions(node);
      !!node.internals.handleBounds;
      let focusable = _focusable ?? store.nodesFocusable;
      function isInParentLookup(id2) {
        return store.parentLookup.has(id2);
      }
      let isParent = isInParentLookup(id);
      let NodeComponent = store.nodeTypes[type] ?? DefaultNode;
      store.ariaLabelConfig;
      let connectableContext = {
        get value() {
          return connectable;
        }
      };
      setNodeIdContext(id);
      setNodeConnectableContext(connectableContext);
      if (process.env.NODE_ENV === "development") ;
      let nodeStyle = (() => {
        const w = measuredWidth === void 0 ? width ?? initialWidth : width;
        const h = measuredHeight === void 0 ? height ?? initialHeight : height;
        if (w === void 0 && h === void 0 && style === void 0) {
          return void 0;
        }
        return `${style};${w ? `width:${toPxString(w)};` : ""}${h ? `height:${toPxString(h)};` : ""}`;
      })();
      if (!hidden) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div${attributes(
          {
            "data-id": id,
            class: clsx(["svelte-flow__node", `svelte-flow__node-${type}`, className]),
            style: nodeStyle,
            tabindex: focusable ? 0 : void 0,
            role: node.ariaRole ?? (focusable ? "group" : void 0),
            "aria-roledescription": "node",
            "aria-describedby": store.disableKeyboardA11y ? void 0 : `${ARIA_NODE_DESC_KEY}-${store.flowId}`,
            ...node.domAttributes
          },
          void 0,
          {
            dragging,
            selected,
            draggable,
            connectable,
            selectable,
            nopan: draggable,
            parent: isParent
          },
          {
            "z-index": zIndex,
            transform: `translate(${stringify(positionX)}px, ${stringify(positionY)}px)`,
            visibility: hasDimensions ? "visible" : "hidden"
          }
        )}>`);
        push_element($$renderer2, "div", 180, 2);
        $$renderer2.push("<!---->");
        NodeComponent?.($$renderer2, {
          data,
          id,
          selected,
          selectable,
          deletable,
          sourcePosition,
          targetPosition,
          zIndex,
          dragging,
          draggable,
          dragHandle,
          parentId,
          type,
          isConnectable: connectable,
          positionAbsoluteX: positionX,
          positionAbsoluteY: positionY,
          width,
          height
        });
        $$renderer2.push(`<!----></div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, { store });
    },
    NodeWrapper
  );
}
NodeWrapper.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
NodeRenderer[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/container/NodeRenderer/NodeRenderer.svelte";
function NodeRenderer($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        store = void 0,
        nodeClickDistance,
        onnodeclick,
        onnodecontextmenu,
        onnodepointerenter,
        onnodepointermove,
        onnodepointerleave,
        onnodedrag,
        onnodedragstart,
        onnodedragstop
      } = $$props;
      const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver((entries) => {
        const updates = /* @__PURE__ */ new Map();
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-id");
          updates.set(id, { id, nodeElement: entry.target, force: true });
        });
        store.updateNodeInternals(updates);
      });
      onDestroy(() => {
        resizeObserver?.disconnect();
      });
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<div class="svelte-flow__nodes">`);
        push_element($$renderer3, "div", 32, 0);
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(store.visible.nodes.values());
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let node = each_array[$$index];
          NodeWrapper($$renderer3, {
            node,
            resizeObserver,
            nodeClickDistance,
            onnodeclick,
            onnodepointerenter,
            onnodepointermove,
            onnodepointerleave,
            onnodedrag,
            onnodedragstart,
            onnodedragstop,
            onnodecontextmenu,
            get store() {
              return store;
            },
            set store($$value) {
              store = $$value;
              $$settled = false;
            }
          });
        }
        $$renderer3.push(`<!--]--></div>`);
        pop_element();
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { store });
    },
    NodeRenderer
  );
}
NodeRenderer.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
EdgeWrapper[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/EdgeWrapper/EdgeWrapper.svelte";
function EdgeWrapper($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const {
        edge,
        store = void 0,
        onedgeclick,
        onedgecontextmenu,
        onedgepointerenter,
        onedgepointerleave
      } = $$props;
      let {
        id,
        source,
        target,
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
        animated = false,
        selected = false,
        label,
        labelStyle,
        data = {},
        style,
        interactionWidth,
        type = "default",
        sourceHandle,
        targetHandle,
        markerStart,
        markerEnd,
        selectable: _selectable,
        focusable: _focusable,
        deletable = true,
        hidden,
        zIndex,
        class: className,
        ariaLabel
      } = edge;
      setEdgeIdContext(id);
      let selectable = _selectable ?? store.elementsSelectable;
      let focusable = _focusable ?? store.edgesFocusable;
      let EdgeComponent = store.edgeTypes[type] ?? BezierEdge;
      let markerStartUrl = markerStart ? `url('#${getMarkerId(markerStart, store.flowId)}')` : void 0;
      let markerEndUrl = markerEnd ? `url('#${getMarkerId(markerEnd, store.flowId)}')` : void 0;
      if (!hidden) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<svg class="svelte-flow__edge-wrapper"${attr_style("", { "z-index": zIndex })}>`);
        push_element($$renderer2, "svg", 83, 2);
        $$renderer2.push(`<g${attributes(
          {
            class: clsx(["svelte-flow__edge", className]),
            "data-id": id,
            "aria-label": ariaLabel === null ? void 0 : ariaLabel ? ariaLabel : `Edge from ${source} to ${target}`,
            "aria-describedby": focusable ? `${ARIA_EDGE_DESC_KEY}-${store.flowId}` : void 0,
            role: edge.ariaRole ?? (focusable ? "group" : "img"),
            "aria-roledescription": "edge",
            tabindex: focusable ? 0 : void 0,
            ...edge.domAttributes
          },
          void 0,
          { animated, selected, selectable },
          void 0,
          3
        )}>`);
        push_element($$renderer2, "g", 84, 4);
        $$renderer2.push("<!---->");
        EdgeComponent?.($$renderer2, {
          id,
          source,
          target,
          sourceX,
          sourceY,
          targetX,
          targetY,
          sourcePosition,
          targetPosition,
          animated,
          selected,
          label,
          labelStyle,
          data,
          style,
          interactionWidth,
          selectable,
          deletable,
          type,
          sourceHandleId: sourceHandle,
          targetHandleId: targetHandle,
          markerStart: markerStartUrl,
          markerEnd: markerEndUrl
        });
        $$renderer2.push(`<!----></g>`);
        pop_element();
        $$renderer2.push(`</svg>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, { store });
    },
    EdgeWrapper
  );
}
EdgeWrapper.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
MarkerDefinition[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/container/EdgeRenderer/MarkerDefinition/MarkerDefinition.svelte";
function MarkerDefinition($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const store = useStore();
      $$renderer2.push(`<defs>`);
      push_element($$renderer2, "defs", 6, 0);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(store.markers);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let marker = each_array[$$index];
        Marker($$renderer2, spread_props([marker]));
      }
      $$renderer2.push(`<!--]--></defs>`);
      pop_element();
    },
    MarkerDefinition
  );
}
MarkerDefinition.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Marker[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/container/EdgeRenderer/MarkerDefinition/Marker.svelte";
function Marker($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        id,
        type,
        width = 12.5,
        height = 12.5,
        markerUnits = "strokeWidth",
        orient = "auto-start-reverse",
        color = "none",
        strokeWidth
      } = $$props;
      $$renderer2.push(`<marker class="svelte-flow__arrowhead"${attr("id", id)}${attr("markerWidth", `${width}`)}${attr("markerHeight", `${height}`)} viewBox="-10 -10 20 20"${attr("markerUnits", markerUnits)}${attr("orient", orient)} refX="0" refY="0">`);
      push_element($$renderer2, "marker", 14, 0);
      if (type === MarkerType.Arrow) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<polyline class="arrow" fill="none" stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", strokeWidth)} points="-5,-4 0,0 -5,4"${attr_style("", { stroke: color })}>`);
        push_element($$renderer2, "polyline", 26, 4);
        $$renderer2.push(`</polyline>`);
        pop_element();
      } else if (type === MarkerType.ArrowClosed) {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<polyline class="arrowclosed" stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", strokeWidth)} points="-5,-4 0,0 -5,4 -5,-4"${attr_style("", { stroke: color, fill: color })}>`);
        push_element($$renderer2, "polyline", 36, 4);
        $$renderer2.push(`</polyline>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></marker>`);
      pop_element();
    },
    Marker
  );
}
Marker.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
EdgeRenderer[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/container/EdgeRenderer/EdgeRenderer.svelte";
function EdgeRenderer($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        store = void 0,
        onedgeclick,
        onedgecontextmenu,
        onedgepointerenter,
        onedgepointerleave
      } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<div class="svelte-flow__edges">`);
        push_element($$renderer3, "div", 12, 0);
        $$renderer3.push(`<svg class="svelte-flow__marker">`);
        push_element($$renderer3, "svg", 13, 2);
        MarkerDefinition($$renderer3);
        $$renderer3.push(`<!----></svg>`);
        pop_element();
        $$renderer3.push(` <!--[-->`);
        const each_array = ensure_array_like(store.visible.edges.values());
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let edge = each_array[$$index];
          EdgeWrapper($$renderer3, {
            edge,
            onedgeclick,
            onedgecontextmenu,
            onedgepointerenter,
            onedgepointerleave,
            get store() {
              return store;
            },
            set store($$value) {
              store = $$value;
              $$settled = false;
            }
          });
        }
        $$renderer3.push(`<!--]--></div>`);
        pop_element();
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { store });
    },
    EdgeRenderer
  );
}
EdgeRenderer.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Selection[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/Selection/Selection.svelte";
function Selection($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { x = 0, y = 0, width = 0, height = 0, isVisible = true } = $$props;
      if (isVisible) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="svelte-flow__selection svelte-1vr3gfi"${attr_style("", {
          width: typeof width === "string" ? width : toPxString(width),
          height: typeof height === "string" ? height : toPxString(height),
          transform: `translate(${x}px, ${y}px)`
        })}>`);
        push_element($$renderer2, "div", 12, 2);
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    },
    Selection
  );
}
Selection.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
NodeSelection[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/NodeSelection/NodeSelection.svelte";
function NodeSelection($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        store = void 0,
        onnodedrag,
        onnodedragstart,
        onnodedragstop,
        onselectionclick,
        onselectioncontextmenu
      } = $$props;
      let bounds = (() => {
        if (store.selectionRectMode === "nodes") {
          store.nodes;
          const nodeBounds = getInternalNodesBounds(store.nodeLookup, { filter: (node) => !!node.selected });
          if (nodeBounds.width > 0 && nodeBounds.height > 0) {
            return nodeBounds;
          }
        }
        return null;
      })();
      if (store.selectionRectMode === "nodes" && bounds && isNumeric(bounds.x) && isNumeric(bounds.y)) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div${attr_class(clsx(["svelte-flow__selection-wrapper", store.noPanClass]), "svelte-sf2y5e")}${attr("role", store.disableKeyboardA11y ? void 0 : "button")}${attr("tabindex", store.disableKeyboardA11y ? void 0 : -1)}${attr_style("", {
          width: toPxString(bounds.width),
          height: toPxString(bounds.height),
          transform: `translate(${stringify(bounds.x)}px, ${stringify(bounds.y)}px)`
        })}>`);
        push_element($$renderer2, "div", 50, 2);
        Selection($$renderer2, { width: "100%", height: "100%", x: 0, y: 0 });
        $$renderer2.push(`<!----></div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, { store });
    },
    NodeSelection
  );
}
NodeSelection.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
function useSvelteFlow() {
  const store = useStore();
  const getNodeRect = (node) => {
    const nodeToUse = isNode(node) ? node : store.nodeLookup.get(node.id);
    const position = nodeToUse.parentId ? evaluateAbsolutePosition(nodeToUse.position, nodeToUse.measured, nodeToUse.parentId, store.nodeLookup, store.nodeOrigin) : nodeToUse.position;
    const nodeWithPosition = {
      ...nodeToUse,
      position,
      width: nodeToUse.measured?.width ?? nodeToUse.width,
      height: nodeToUse.measured?.height ?? nodeToUse.height
    };
    return nodeToRect(nodeWithPosition);
  };
  function updateNode(id, nodeUpdate, options = { replace: false }) {
    store.nodes = run(() => store.nodes).map((node) => {
      if (node.id === id) {
        const nextNode = typeof nodeUpdate === "function" ? nodeUpdate(node) : nodeUpdate;
        return options?.replace && isNode(nextNode) ? nextNode : { ...node, ...nextNode };
      }
      return node;
    });
  }
  function updateEdge(id, edgeUpdate, options = { replace: false }) {
    store.edges = run(() => store.edges).map((edge) => {
      if (edge.id === id) {
        const nextEdge = typeof edgeUpdate === "function" ? edgeUpdate(edge) : edgeUpdate;
        return options.replace && isEdge(nextEdge) ? nextEdge : { ...edge, ...nextEdge };
      }
      return edge;
    });
  }
  const getInternalNode = (id) => store.nodeLookup.get(id);
  return {
    zoomIn: store.zoomIn,
    zoomOut: store.zoomOut,
    getInternalNode,
    getNode: (id) => getInternalNode(id)?.internals.userNode,
    getNodes: (ids) => ids === void 0 ? store.nodes : getElements(store.nodeLookup, ids),
    getEdge: (id) => store.edgeLookup.get(id),
    getEdges: (ids) => ids === void 0 ? store.edges : getElements(store.edgeLookup, ids),
    setZoom: (zoomLevel, options) => {
      const panZoom = store.panZoom;
      return panZoom ? panZoom.scaleTo(zoomLevel, { duration: options?.duration }) : Promise.resolve(false);
    },
    getZoom: () => store.viewport.zoom,
    setViewport: async (nextViewport, options) => {
      const currentViewport = store.viewport;
      if (!store.panZoom) {
        return Promise.resolve(false);
      }
      await store.panZoom.setViewport(
        {
          x: nextViewport.x ?? currentViewport.x,
          y: nextViewport.y ?? currentViewport.y,
          zoom: nextViewport.zoom ?? currentViewport.zoom
        },
        options
      );
      return Promise.resolve(true);
    },
    getViewport: () => snapshot(store.viewport),
    setCenter: async (x, y, options) => store.setCenter(x, y, options),
    fitView: (options) => store.fitView(options),
    fitBounds: async (bounds, options) => {
      if (!store.panZoom) {
        return Promise.resolve(false);
      }
      const viewport = getViewportForBounds(bounds, store.width, store.height, store.minZoom, store.maxZoom, options?.padding ?? 0.1);
      await store.panZoom.setViewport(viewport, {
        duration: options?.duration,
        ease: options?.ease,
        interpolate: options?.interpolate
      });
      return Promise.resolve(true);
    },
    /**
     * Partial is defined as "the 2 nodes/areas are intersecting partially".
     * If a is contained in b or b is contained in a, they are both
     * considered fully intersecting.
     */
    getIntersectingNodes: (nodeOrRect, partially = true, nodesToIntersect) => {
      const isRect = isRectObject(nodeOrRect);
      const nodeRect = isRect ? nodeOrRect : getNodeRect(nodeOrRect);
      if (!nodeRect) {
        return [];
      }
      return (nodesToIntersect || store.nodes).filter((n) => {
        const internalNode = store.nodeLookup.get(n.id);
        if (!internalNode || !isRect && n.id === nodeOrRect.id) {
          return false;
        }
        const currNodeRect = nodeToRect(internalNode);
        const overlappingArea = getOverlappingArea(currNodeRect, nodeRect);
        const partiallyVisible = partially && overlappingArea > 0;
        return partiallyVisible || overlappingArea >= currNodeRect.width * currNodeRect.height || overlappingArea >= nodeRect.width * nodeRect.height;
      });
    },
    isNodeIntersecting: (nodeOrRect, area, partially = true) => {
      const isRect = isRectObject(nodeOrRect);
      const nodeRect = isRect ? nodeOrRect : getNodeRect(nodeOrRect);
      if (!nodeRect) {
        return false;
      }
      const overlappingArea = getOverlappingArea(nodeRect, area);
      const partiallyVisible = partially && overlappingArea > 0;
      return partiallyVisible || overlappingArea >= area.width * area.height || overlappingArea >= nodeRect.width * nodeRect.height;
    },
    deleteElements: async ({ nodes: nodesToRemove = [], edges: edgesToRemove = [] }) => {
      const { nodes: matchingNodes, edges: matchingEdges } = await getElementsToRemove({
        nodesToRemove,
        edgesToRemove,
        nodes: store.nodes,
        edges: store.edges,
        onBeforeDelete: store.onbeforedelete
      });
      if (matchingNodes) {
        store.nodes = run(() => store.nodes).filter((node) => !matchingNodes.some(({ id }) => id === node.id));
      }
      if (matchingEdges) {
        store.edges = run(() => store.edges).filter((edge) => !matchingEdges.some(({ id }) => id === edge.id));
      }
      if (matchingNodes.length > 0 || matchingEdges.length > 0) {
        store.ondelete?.({ nodes: matchingNodes, edges: matchingEdges });
      }
      return { deletedNodes: matchingNodes, deletedEdges: matchingEdges };
    },
    screenToFlowPosition: (position, options = { snapToGrid: true }) => {
      if (!store.domNode) {
        return position;
      }
      const _snapGrid = options.snapToGrid ? store.snapGrid : false;
      const { x, y, zoom } = store.viewport;
      const { x: domX, y: domY } = store.domNode.getBoundingClientRect();
      const correctedPosition = { x: position.x - domX, y: position.y - domY };
      return pointToRendererPoint(correctedPosition, [x, y, zoom], _snapGrid !== null, _snapGrid || [1, 1]);
    },
    /**
     *
     * @param position
     * @returns
     */
    flowToScreenPosition: (position) => {
      if (!store.domNode) {
        return position;
      }
      const { x, y, zoom } = store.viewport;
      const { x: domX, y: domY } = store.domNode.getBoundingClientRect();
      const rendererPosition = rendererPointToPoint(position, [x, y, zoom]);
      return { x: rendererPosition.x + domX, y: rendererPosition.y + domY };
    },
    toObject: () => {
      return structuredClone({
        nodes: [...store.nodes],
        edges: [...store.edges],
        viewport: { ...store.viewport }
      });
    },
    updateNode,
    updateNodeData: (id, dataUpdate, options) => {
      const node = store.nodeLookup.get(id)?.internals.userNode;
      if (!node) {
        return;
      }
      const nextData = typeof dataUpdate === "function" ? dataUpdate(node) : dataUpdate;
      updateNode(id, (node2) => ({
        ...node2,
        data: options?.replace ? nextData : { ...node2.data, ...nextData }
      }));
    },
    updateEdge,
    getNodesBounds: (nodes) => {
      return getNodesBounds(nodes, { nodeLookup: store.nodeLookup, nodeOrigin: store.nodeOrigin });
    },
    getHandleConnections: ({ type, id, nodeId }) => Array.from(store.connectionLookup.get(`${nodeId}-${type}-${id ?? null}`)?.values() ?? [])
  };
}
function getElements(lookup, ids) {
  const result = [];
  for (const id of ids) {
    const item = lookup.get(id);
    if (item) {
      const element = "internals" in item ? item.internals?.userNode : item;
      result.push(element);
    }
  }
  return result;
}
KeyHandler[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/KeyHandler/KeyHandler.svelte";
function KeyHandler($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        store = void 0,
        selectionKey = "Shift",
        multiSelectionKey = isMacOs() ? "Meta" : "Control",
        deleteKey = "Backspace",
        panActivationKey = " ",
        zoomActivationKey = isMacOs() ? "Meta" : "Control"
      } = $$props;
      useSvelteFlow();
      bind_props($$props, { store });
    },
    KeyHandler
  );
}
KeyHandler.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
ConnectionLine[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/ConnectionLine/ConnectionLine.svelte";
function ConnectionLine($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { store = void 0, type, containerStyle, style, LineComponent } = $$props;
      let path = (() => {
        if (!store.connection.inProgress) {
          return "";
        }
        const pathParams = {
          sourceX: store.connection.from.x,
          sourceY: store.connection.from.y,
          sourcePosition: store.connection.fromPosition,
          targetX: store.connection.to.x,
          targetY: store.connection.to.y,
          targetPosition: store.connection.toPosition
        };
        switch (type) {
          case ConnectionLineType.Bezier: {
            const [path2] = getBezierPath(pathParams);
            return path2;
          }
          case ConnectionLineType.Straight: {
            const [path2] = getStraightPath(pathParams);
            return path2;
          }
          case ConnectionLineType.Step:
          case ConnectionLineType.SmoothStep: {
            const [path2] = getSmoothStepPath({
              ...pathParams,
              borderRadius: type === ConnectionLineType.Step ? 0 : void 0
            });
            return path2;
          }
        }
      })();
      if (store.connection.inProgress) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<svg${attr("width", store.width)}${attr("height", store.height)} class="svelte-flow__connectionline"${attr_style(containerStyle)}>`);
        push_element($$renderer2, "svg", 49, 2);
        $$renderer2.push(`<g${attr_class(clsx([
          "svelte-flow__connection",
          getConnectionStatus(store.connection.isValid)
        ]))}>`);
        push_element($$renderer2, "g", 55, 4);
        if (LineComponent) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push("<!---->");
          LineComponent?.($$renderer2, {});
          $$renderer2.push(`<!---->`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<path${attr("d", path)}${attr_style(style)} fill="none" class="svelte-flow__connection-path">`);
          push_element($$renderer2, "path", 59, 8);
          $$renderer2.push(`</path>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></g>`);
        pop_element();
        $$renderer2.push(`</svg>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, { store });
    },
    ConnectionLine
  );
}
ConnectionLine.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Panel[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/container/Panel/Panel.svelte";
function Panel($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        position = "top-right",
        style,
        class: className,
        children,
        $$slots,
        $$events,
        ...rest
      } = $$props;
      let positionClasses = `${position}`.split("-");
      $$renderer2.push(`<div${attributes({
        class: clsx(["svelte-flow__panel", className, ...positionClasses]),
        style,
        ...rest
      })}>`);
      push_element($$renderer2, "div", 5, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div>`);
      pop_element();
    },
    Panel
  );
}
Panel.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Attribution[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/Attribution/Attribution.svelte";
function Attribution($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { proOptions, position = "bottom-right" } = $$props;
      if (!proOptions?.hideAttribution) {
        $$renderer2.push("<!--[-->");
        Panel($$renderer2, {
          position,
          class: "svelte-flow__attribution",
          "data-message": "Feel free to remove the attribution or check out how you could support us: https://svelteflow.dev/support-us",
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<a href="https://svelteflow.dev" target="_blank" rel="noopener noreferrer" aria-label="Svelte Flow attribution">`);
            push_element($$renderer3, "a", 11, 4);
            $$renderer3.push(`Svelte Flow</a>`);
            pop_element();
          }),
          $$slots: { default: true }
        });
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    },
    Attribution
  );
}
Attribution.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Wrapper[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/container/SvelteFlow/Wrapper.svelte";
function Wrapper($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        width,
        height,
        colorMode,
        domNode = void 0,
        clientWidth = void 0,
        clientHeight = void 0,
        children,
        rest
      } = $$props;
      let {
        id,
        class: className,
        nodeTypes,
        edgeTypes,
        colorMode: _colorMode,
        isValidConnection,
        onmove,
        onmovestart,
        onmoveend,
        onflowerror,
        ondelete,
        onbeforedelete,
        onbeforeconnect,
        onconnect,
        onconnectstart,
        onconnectend,
        onbeforereconnect,
        onreconnect,
        onreconnectstart,
        onreconnectend,
        onclickconnectstart,
        onclickconnectend,
        oninit,
        onselectionchange,
        onselectiondragstart,
        onselectiondrag,
        onselectiondragstop,
        onselectionstart,
        onselectionend,
        clickConnect,
        fitView,
        fitViewOptions,
        nodeOrigin,
        nodeDragThreshold,
        connectionDragThreshold,
        minZoom,
        maxZoom,
        initialViewport,
        connectionRadius,
        connectionMode,
        selectionMode,
        selectNodesOnDrag,
        snapGrid,
        defaultMarkerColor,
        translateExtent,
        nodeExtent,
        onlyRenderVisibleElements,
        autoPanOnConnect,
        autoPanOnNodeDrag,
        colorModeSSR,
        defaultEdgeOptions,
        elevateNodesOnSelect,
        elevateEdgesOnSelect,
        nodesDraggable,
        autoPanOnNodeFocus,
        nodesConnectable,
        elementsSelectable,
        nodesFocusable,
        edgesFocusable,
        disableKeyboardA11y,
        noDragClass,
        noPanClass,
        noWheelClass,
        ariaLabelConfig,
        autoPanSpeed,
        panOnScrollSpeed,
        zIndexMode,
        ...divAttributes
      } = rest;
      $$renderer2.push(`<div${attributes(
        {
          class: clsx([
            "svelte-flow",
            "svelte-flow__container",
            className,
            colorMode
          ]),
          "data-testid": "svelte-flow__wrapper",
          role: "application",
          ...divAttributes
        },
        "svelte-mkap6j",
        void 0,
        { width: toPxString(width), height: toPxString(height) }
      )}>`);
      push_element($$renderer2, "div", 91, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div>`);
      pop_element();
      bind_props($$props, { domNode, clientWidth, clientHeight });
    },
    Wrapper
  );
}
Wrapper.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
SvelteFlow[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/container/SvelteFlow/SvelteFlow.svelte";
function SvelteFlow($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        width,
        height,
        proOptions,
        selectionKey,
        deleteKey,
        panActivationKey,
        multiSelectionKey,
        zoomActivationKey,
        paneClickDistance = 1,
        nodeClickDistance = 1,
        onmovestart,
        onmoveend,
        onmove,
        oninit,
        onnodeclick,
        onnodecontextmenu,
        onnodedrag,
        onnodedragstart,
        onnodedragstop,
        onnodepointerenter,
        onnodepointermove,
        onnodepointerleave,
        onselectionclick,
        onselectioncontextmenu,
        onselectionstart,
        onselectionend,
        onedgeclick,
        onedgecontextmenu,
        onedgepointerenter,
        onedgepointerleave,
        onpaneclick,
        onpanecontextmenu,
        panOnScrollMode = PanOnScrollMode.Free,
        preventScrolling = true,
        zoomOnScroll = true,
        zoomOnDoubleClick = true,
        zoomOnPinch = true,
        panOnScroll = false,
        panOnScrollSpeed = 0.5,
        panOnDrag = true,
        selectionOnDrag = false,
        connectionLineComponent,
        connectionLineStyle,
        connectionLineContainerStyle,
        connectionLineType = ConnectionLineType.Bezier,
        attributionPosition,
        children,
        nodes = [],
        edges = [],
        viewport = void 0,
        $$slots,
        $$events,
        ...props
      } = $$props;
      let store = createStore({
        props,
        width,
        height,
        get nodes() {
          return nodes;
        },
        set nodes(newNodes) {
          nodes = newNodes;
        },
        get edges() {
          return edges;
        },
        set edges(newEdges) {
          edges = newEdges;
        },
        get viewport() {
          return viewport;
        },
        set viewport(newViewport) {
          viewport = newViewport;
        }
      });
      const providerContext = getContext(key);
      if (providerContext && providerContext.setStore) {
        providerContext.setStore(store);
      }
      setContext(key, {
        provider: false,
        getStore() {
          return store;
        }
      });
      onDestroy(() => {
        store.reset();
      });
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        Wrapper($$renderer3, {
          colorMode: store.colorMode,
          width,
          height,
          rest: props,
          get domNode() {
            return store.domNode;
          },
          set domNode($$value) {
            store.domNode = $$value;
            $$settled = false;
          },
          get clientWidth() {
            return store.width;
          },
          set clientWidth($$value) {
            store.width = $$value;
            $$settled = false;
          },
          get clientHeight() {
            return store.height;
          },
          set clientHeight($$value) {
            store.height = $$value;
            $$settled = false;
          },
          children: prevent_snippet_stringification(($$renderer4) => {
            KeyHandler($$renderer4, {
              selectionKey,
              deleteKey,
              panActivationKey,
              multiSelectionKey,
              zoomActivationKey,
              get store() {
                return store;
              },
              set store($$value) {
                store = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----> `);
            Zoom($$renderer4, {
              panOnScrollMode,
              preventScrolling,
              zoomOnScroll,
              zoomOnDoubleClick,
              zoomOnPinch,
              panOnScroll,
              panOnScrollSpeed,
              panOnDrag,
              paneClickDistance,
              selectionOnDrag,
              onmovestart,
              onmove,
              onmoveend,
              oninit,
              get store() {
                return store;
              },
              set store($$value) {
                store = $$value;
                $$settled = false;
              },
              children: prevent_snippet_stringification(($$renderer5) => {
                Pane($$renderer5, {
                  onpaneclick,
                  onpanecontextmenu,
                  onselectionstart,
                  onselectionend,
                  panOnDrag,
                  paneClickDistance,
                  selectionOnDrag,
                  get store() {
                    return store;
                  },
                  set store($$value) {
                    store = $$value;
                    $$settled = false;
                  },
                  children: prevent_snippet_stringification(($$renderer6) => {
                    Viewport($$renderer6, {
                      get store() {
                        return store;
                      },
                      set store($$value) {
                        store = $$value;
                        $$settled = false;
                      },
                      children: prevent_snippet_stringification(($$renderer7) => {
                        $$renderer7.push(`<div class="svelte-flow__viewport-back svelte-flow__container">`);
                        push_element($$renderer7, "div", 160, 8);
                        $$renderer7.push(`</div>`);
                        pop_element();
                        $$renderer7.push(` `);
                        EdgeRenderer($$renderer7, {
                          onedgeclick,
                          onedgecontextmenu,
                          onedgepointerenter,
                          onedgepointerleave,
                          get store() {
                            return store;
                          },
                          set store($$value) {
                            store = $$value;
                            $$settled = false;
                          }
                        });
                        $$renderer7.push(`<!----> <div class="svelte-flow__edge-labels svelte-flow__container">`);
                        push_element($$renderer7, "div", 168, 8);
                        $$renderer7.push(`</div>`);
                        pop_element();
                        $$renderer7.push(` `);
                        ConnectionLine($$renderer7, {
                          type: connectionLineType,
                          LineComponent: connectionLineComponent,
                          containerStyle: connectionLineContainerStyle,
                          style: connectionLineStyle,
                          get store() {
                            return store;
                          },
                          set store($$value) {
                            store = $$value;
                            $$settled = false;
                          }
                        });
                        $$renderer7.push(`<!----> `);
                        NodeRenderer($$renderer7, {
                          nodeClickDistance,
                          onnodeclick,
                          onnodecontextmenu,
                          onnodepointerenter,
                          onnodepointermove,
                          onnodepointerleave,
                          onnodedrag,
                          onnodedragstart,
                          onnodedragstop,
                          get store() {
                            return store;
                          },
                          set store($$value) {
                            store = $$value;
                            $$settled = false;
                          }
                        });
                        $$renderer7.push(`<!----> `);
                        NodeSelection($$renderer7, {
                          onselectionclick,
                          onselectioncontextmenu,
                          onnodedrag,
                          onnodedragstart,
                          onnodedragstop,
                          get store() {
                            return store;
                          },
                          set store($$value) {
                            store = $$value;
                            $$settled = false;
                          }
                        });
                        $$renderer7.push(`<!----> <div class="svelte-flow__viewport-front svelte-flow__container">`);
                        push_element($$renderer7, "div", 196, 8);
                        $$renderer7.push(`</div>`);
                        pop_element();
                      }),
                      $$slots: { default: true }
                    });
                    $$renderer6.push(`<!----> `);
                    Selection($$renderer6, {
                      isVisible: !!(store.selectionRect && store.selectionRectMode === "user"),
                      width: store.selectionRect?.width,
                      height: store.selectionRect?.height,
                      x: store.selectionRect?.x,
                      y: store.selectionRect?.y
                    });
                    $$renderer6.push(`<!---->`);
                  }),
                  $$slots: { default: true }
                });
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Attribution($$renderer4, { proOptions, position: attributionPosition });
            $$renderer4.push(`<!----> `);
            A11yDescriptions($$renderer4, { store });
            $$renderer4.push(`<!----> `);
            children?.($$renderer4);
            $$renderer4.push(`<!---->`);
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
      bind_props($$props, { nodes, edges, viewport });
    },
    SvelteFlow
  );
}
SvelteFlow.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
ControlButton[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/plugins/Controls/ControlButton.svelte";
function ControlButton($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        class: className,
        bgColor,
        bgColorHover,
        color,
        colorHover,
        borderColor,
        onclick,
        children,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      $$renderer2.push(`<button${attributes(
        {
          type: "button",
          class: clsx(["svelte-flow__controls-button", className]),
          ...restProps
        },
        void 0,
        void 0,
        {
          "--xy-controls-button-background-color-props": bgColor,
          "--xy-controls-button-background-color-hover-props": bgColorHover,
          "--xy-controls-button-color-props": color,
          "--xy-controls-button-color-hover-props": colorHover,
          "--xy-controls-button-border-color-props": borderColor
        }
      )}>`);
      push_element($$renderer2, "button", 14, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></button>`);
      pop_element();
    },
    ControlButton
  );
}
ControlButton.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Plus[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/plugins/Controls/Icons/Plus.svelte";
function Plus($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      $$renderer2.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">`);
      push_element($$renderer2, "svg", 1, 0);
      $$renderer2.push(`<path d="M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z">`);
      push_element($$renderer2, "path", 2, 2);
      $$renderer2.push(`</path>`);
      pop_element();
      $$renderer2.push(`</svg>`);
      pop_element();
    },
    Plus
  );
}
Plus.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Minus[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/plugins/Controls/Icons/Minus.svelte";
function Minus($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      $$renderer2.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 5">`);
      push_element($$renderer2, "svg", 1, 0);
      $$renderer2.push(`<path d="M0 0h32v4.2H0z">`);
      push_element($$renderer2, "path", 2, 2);
      $$renderer2.push(`</path>`);
      pop_element();
      $$renderer2.push(`</svg>`);
      pop_element();
    },
    Minus
  );
}
Minus.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Fit[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/plugins/Controls/Icons/Fit.svelte";
function Fit($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      $$renderer2.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 30">`);
      push_element($$renderer2, "svg", 1, 0);
      $$renderer2.push(`<path d="M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0027.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94c-.531 0-.939-.4-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z">`);
      push_element($$renderer2, "path", 2, 2);
      $$renderer2.push(`</path>`);
      pop_element();
      $$renderer2.push(`</svg>`);
      pop_element();
    },
    Fit
  );
}
Fit.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Lock[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/plugins/Controls/Icons/Lock.svelte";
function Lock($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      $$renderer2.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 32">`);
      push_element($$renderer2, "svg", 1, 0);
      $$renderer2.push(`<path d="M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z">`);
      push_element($$renderer2, "path", 2, 2);
      $$renderer2.push(`</path>`);
      pop_element();
      $$renderer2.push(`</svg>`);
      pop_element();
    },
    Lock
  );
}
Lock.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Unlock[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/plugins/Controls/Icons/Unlock.svelte";
function Unlock($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      $$renderer2.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 32">`);
      push_element($$renderer2, "svg", 1, 0);
      $$renderer2.push(`<path d="M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047z">`);
      push_element($$renderer2, "path", 2, 2);
      $$renderer2.push(`</path>`);
      pop_element();
      $$renderer2.push(`</svg>`);
      pop_element();
    },
    Unlock
  );
}
Unlock.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Controls[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/plugins/Controls/Controls.svelte";
function Controls($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        position = "bottom-left",
        orientation = "vertical",
        showZoom = true,
        showFitView = true,
        showLock = true,
        style,
        class: className,
        buttonBgColor,
        buttonBgColorHover,
        buttonColor,
        buttonColorHover,
        buttonBorderColor,
        fitViewOptions,
        children,
        before,
        after,
        $$slots,
        $$events,
        ...rest
      } = $$props;
      let store = useStore();
      const buttonProps = {
        bgColor: buttonBgColor,
        bgColorHover: buttonBgColorHover,
        color: buttonColor,
        colorHover: buttonColorHover,
        borderColor: buttonBorderColor
      };
      let isInteractive = store.nodesDraggable || store.nodesConnectable || store.elementsSelectable;
      let minZoomReached = store.viewport.zoom <= store.minZoom;
      let maxZoomReached = store.viewport.zoom >= store.maxZoom;
      let ariaLabelConfig = store.ariaLabelConfig;
      let orientationClass = orientation === "horizontal" ? "horizontal" : "vertical";
      const onZoomInHandler = () => {
        store.zoomIn();
      };
      const onZoomOutHandler = () => {
        store.zoomOut();
      };
      const onFitViewHandler = () => {
        store.fitView(fitViewOptions);
      };
      const onToggleInteractivity = () => {
        let interactive = !isInteractive;
        store.nodesDraggable = interactive;
        store.nodesConnectable = interactive;
        store.elementsSelectable = interactive;
      };
      Panel($$renderer2, spread_props([
        {
          class: ["svelte-flow__controls", orientationClass, className],
          position,
          "data-testid": "svelte-flow__controls",
          "aria-label": ariaLabelConfig["controls.ariaLabel"],
          style
        },
        rest,
        {
          children: prevent_snippet_stringification(($$renderer3) => {
            if (before) {
              $$renderer3.push("<!--[-->");
              before($$renderer3);
              $$renderer3.push(`<!---->`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--> `);
            if (showZoom) {
              $$renderer3.push("<!--[-->");
              ControlButton($$renderer3, spread_props([
                {
                  onclick: onZoomInHandler,
                  class: "svelte-flow__controls-zoomin",
                  title: ariaLabelConfig["controls.zoomIn.ariaLabel"],
                  "aria-label": ariaLabelConfig["controls.zoomIn.ariaLabel"],
                  disabled: maxZoomReached
                },
                buttonProps,
                {
                  children: prevent_snippet_stringification(($$renderer4) => {
                    Plus($$renderer4);
                  }),
                  $$slots: { default: true }
                }
              ]));
              $$renderer3.push(`<!----> `);
              ControlButton($$renderer3, spread_props([
                {
                  onclick: onZoomOutHandler,
                  class: "svelte-flow__controls-zoomout",
                  title: ariaLabelConfig["controls.zoomOut.ariaLabel"],
                  "aria-label": ariaLabelConfig["controls.zoomOut.ariaLabel"],
                  disabled: minZoomReached
                },
                buttonProps,
                {
                  children: prevent_snippet_stringification(($$renderer4) => {
                    Minus($$renderer4);
                  }),
                  $$slots: { default: true }
                }
              ]));
              $$renderer3.push(`<!---->`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--> `);
            if (showFitView) {
              $$renderer3.push("<!--[-->");
              ControlButton($$renderer3, spread_props([
                {
                  class: "svelte-flow__controls-fitview",
                  onclick: onFitViewHandler,
                  title: ariaLabelConfig["controls.fitView.ariaLabel"],
                  "aria-label": ariaLabelConfig["controls.fitView.ariaLabel"]
                },
                buttonProps,
                {
                  children: prevent_snippet_stringification(($$renderer4) => {
                    Fit($$renderer4);
                  }),
                  $$slots: { default: true }
                }
              ]));
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--> `);
            if (showLock) {
              $$renderer3.push("<!--[-->");
              ControlButton($$renderer3, spread_props([
                {
                  class: "svelte-flow__controls-interactive",
                  onclick: onToggleInteractivity,
                  title: ariaLabelConfig["controls.interactive.ariaLabel"],
                  "aria-label": ariaLabelConfig["controls.interactive.ariaLabel"]
                },
                buttonProps,
                {
                  children: prevent_snippet_stringification(($$renderer4) => {
                    if (isInteractive) {
                      $$renderer4.push("<!--[-->");
                      Unlock($$renderer4);
                    } else {
                      $$renderer4.push("<!--[!-->");
                      Lock($$renderer4);
                    }
                    $$renderer4.push(`<!--]-->`);
                  }),
                  $$slots: { default: true }
                }
              ]));
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--> `);
            if (children) {
              $$renderer3.push("<!--[-->");
              children($$renderer3);
              $$renderer3.push(`<!---->`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--> `);
            if (after) {
              $$renderer3.push("<!--[-->");
              after($$renderer3);
              $$renderer3.push(`<!---->`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]-->`);
          }),
          $$slots: { default: true }
        }
      ]));
    },
    Controls
  );
}
Controls.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
var BackgroundVariant;
(function(BackgroundVariant2) {
  BackgroundVariant2["Lines"] = "lines";
  BackgroundVariant2["Dots"] = "dots";
  BackgroundVariant2["Cross"] = "cross";
})(BackgroundVariant || (BackgroundVariant = {}));
DotPattern[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/plugins/Background/DotPattern.svelte";
function DotPattern($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { radius, class: className } = $$props;
      $$renderer2.push(`<circle${attr("cx", radius)}${attr("cy", radius)}${attr("r", radius)}${attr_class(clsx(["svelte-flow__background-pattern", "dots", className]))}>`);
      push_element($$renderer2, "circle", 4, 0);
      $$renderer2.push(`</circle>`);
      pop_element();
    },
    DotPattern
  );
}
DotPattern.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
LinePattern[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/plugins/Background/LinePattern.svelte";
function LinePattern($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { lineWidth, dimensions, variant, class: className } = $$props;
      $$renderer2.push(`<path${attr("stroke-width", lineWidth)}${attr("d", `M${dimensions[0] / 2} 0 V${dimensions[1]} M0 ${dimensions[1] / 2} H${dimensions[0]}`)}${attr_class(clsx(["svelte-flow__background-pattern", variant, className]))}>`);
      push_element($$renderer2, "path", 9, 0);
      $$renderer2.push(`</path>`);
      pop_element();
    },
    LinePattern
  );
}
LinePattern.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Background[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/plugins/Background/Background.svelte";
const defaultSize = {
  [BackgroundVariant.Dots]: 1,
  [BackgroundVariant.Lines]: 1,
  [BackgroundVariant.Cross]: 6
};
function Background($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        id,
        variant = BackgroundVariant.Dots,
        gap = 20,
        size,
        lineWidth = 1,
        bgColor,
        patternColor,
        patternClass,
        class: className
      } = $$props;
      let store = useStore();
      let isDots = variant === BackgroundVariant.Dots;
      let isCross = variant === BackgroundVariant.Cross;
      let gapXY = Array.isArray(gap) ? gap : [gap, gap];
      let patternId = `background-pattern-${store.flowId}-${id ?? ""}`;
      let scaledGap = [
        gapXY[0] * store.viewport.zoom || 1,
        gapXY[1] * store.viewport.zoom || 1
      ];
      let scaledSize = (size ?? defaultSize[variant]) * store.viewport.zoom;
      let patternDimensions = isCross ? [scaledSize, scaledSize] : scaledGap;
      let patternOffset = isDots ? [scaledSize / 2, scaledSize / 2] : [patternDimensions[0] / 2, patternDimensions[1] / 2];
      $$renderer2.push(`<svg${attr_class(clsx([
        "svelte-flow__background",
        "svelte-flow__container",
        className
      ]))} data-testid="svelte-flow__background"${attr_style("", {
        "--xy-background-color-props": bgColor,
        "--xy-background-pattern-color-props": patternColor
      })}>`);
      push_element($$renderer2, "svg", 41, 0);
      $$renderer2.push(`<pattern${attr("id", patternId)}${attr("x", store.viewport.x % scaledGap[0])}${attr("y", store.viewport.y % scaledGap[1])}${attr("width", scaledGap[0])}${attr("height", scaledGap[1])} patternUnits="userSpaceOnUse"${attr("patternTransform", `translate(-${patternOffset[0]},-${patternOffset[1]})`)}>`);
      push_element($$renderer2, "pattern", 47, 2);
      if (isDots) {
        $$renderer2.push("<!--[-->");
        DotPattern($$renderer2, { radius: scaledSize / 2, class: patternClass });
      } else {
        $$renderer2.push("<!--[!-->");
        LinePattern($$renderer2, {
          dimensions: patternDimensions,
          variant,
          lineWidth,
          class: patternClass
        });
      }
      $$renderer2.push(`<!--]--></pattern>`);
      pop_element();
      $$renderer2.push(`<rect x="0" y="0" width="100%" height="100%"${attr("fill", `url(#${patternId})`)}>`);
      push_element($$renderer2, "rect", 62, 2);
      $$renderer2.push(`</rect>`);
      pop_element();
      $$renderer2.push(`</svg>`);
      pop_element();
    },
    Background
  );
}
Background.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
MinimapNode[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/plugins/Minimap/MinimapNode.svelte";
function MinimapNode($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        id,
        x,
        y,
        width,
        height,
        borderRadius = 5,
        color,
        shapeRendering,
        strokeColor,
        strokeWidth = 2,
        selected,
        class: className,
        nodeComponent
      } = $$props;
      if (nodeComponent) {
        $$renderer2.push("<!--[-->");
        const CustomComponent = nodeComponent;
        $$renderer2.push("<!---->");
        CustomComponent?.($$renderer2, {
          id,
          x,
          y,
          width,
          height,
          borderRadius,
          class: className,
          color,
          shapeRendering,
          strokeColor,
          strokeWidth,
          selected
        });
        $$renderer2.push(`<!---->`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<rect${attr_class(clsx(["svelte-flow__minimap-node", className]), void 0, { "selected": selected })}${attr("x", x)}${attr("y", y)}${attr("rx", borderRadius)}${attr("ry", borderRadius)}${attr("width", width)}${attr("height", height)}${attr("shape-rendering", shapeRendering)}${attr_style("", {
          fill: color,
          stroke: strokeColor,
          "stroke-width": strokeWidth
        })}>`);
        push_element($$renderer2, "rect", 36, 2);
        $$renderer2.push(`</rect>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
    },
    MinimapNode
  );
}
MinimapNode.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Minimap[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/plugins/Minimap/Minimap.svelte";
const getAttrFunction = (func) => func instanceof Function ? func : () => func;
function Minimap($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        position = "bottom-right",
        ariaLabel,
        nodeStrokeColor = "transparent",
        nodeColor,
        nodeClass = "",
        nodeBorderRadius = 5,
        nodeStrokeWidth = 2,
        nodeComponent,
        bgColor,
        maskColor,
        maskStrokeColor,
        maskStrokeWidth,
        width = 200,
        height = 150,
        pannable = true,
        zoomable = true,
        inversePan,
        zoomStep,
        class: className,
        $$slots,
        $$events,
        ...rest
      } = $$props;
      let store = useStore();
      let ariaLabelConfig = store.ariaLabelConfig;
      const nodeColorFunc = nodeColor === void 0 ? void 0 : getAttrFunction(nodeColor);
      const nodeStrokeColorFunc = getAttrFunction(nodeStrokeColor);
      const nodeClassFunc = getAttrFunction(nodeClass);
      const shapeRendering = (
        // @ts-expect-error - TS doesn't know about chrome
        typeof window === "undefined" || !!window.chrome ? "crispEdges" : "geometricPrecision"
      );
      let labelledBy = `svelte-flow__minimap-desc-${store.flowId}`;
      let viewBB = {
        x: -store.viewport.x / store.viewport.zoom,
        y: -store.viewport.y / store.viewport.zoom,
        width: store.width / store.viewport.zoom,
        height: store.height / store.viewport.zoom
      };
      let boundingRect = getBoundsOfRects(getInternalNodesBounds(store.nodeLookup, { filter: (n) => !n.hidden }), viewBB);
      let scaledWidth = boundingRect.width / width;
      let scaledHeight = boundingRect.height / height;
      let viewScale = Math.max(scaledWidth, scaledHeight);
      let viewWidth = viewScale * width;
      let viewHeight = viewScale * height;
      let offset = 5 * viewScale;
      let x = boundingRect.x - (viewWidth - boundingRect.width) / 2 - offset;
      let y = boundingRect.y - (viewHeight - boundingRect.height) / 2 - offset;
      let viewboxWidth = viewWidth + offset * 2;
      let viewboxHeight = viewHeight + offset * 2;
      css_props($$renderer2, true, { "--xy-minimap-background-color-props": bgColor }, () => {
        Panel($$renderer2, spread_props([
          {
            position,
            class: ["svelte-flow__minimap", className],
            "data-testid": "svelte-flow__minimap"
          },
          rest,
          {
            children: prevent_snippet_stringification(($$renderer3) => {
              if (store.panZoom) {
                $$renderer3.push("<!--[-->");
                $$renderer3.push(`<svg${attr("width", width)}${attr("height", height)}${attr("viewBox", `${stringify(x)} ${stringify(y)} ${stringify(viewboxWidth)} ${stringify(viewboxHeight)}`)} class="svelte-flow__minimap-svg" role="img"${attr("aria-labelledby", labelledBy)}${attr_style("", {
                  "--xy-minimap-mask-background-color-props": maskColor,
                  "--xy-minimap-mask-stroke-color-props": maskStrokeColor,
                  "--xy-minimap-mask-stroke-width-props": maskStrokeWidth ? maskStrokeWidth * viewScale : void 0
                })}>`);
                push_element($$renderer3, "svg", 76, 4);
                if (ariaLabel ?? ariaLabelConfig["minimap.ariaLabel"]) {
                  $$renderer3.push("<!--[-->");
                  $$renderer3.push(`<title${attr("id", labelledBy)}>`);
                  push_element($$renderer3, "title", 102, 8);
                  $$renderer3.push(`${escape_html(ariaLabel ?? ariaLabelConfig["minimap.ariaLabel"])}</title>`);
                  pop_element();
                } else {
                  $$renderer3.push("<!--[!-->");
                }
                $$renderer3.push(`<!--]--><!--[-->`);
                const each_array = ensure_array_like(store.nodes);
                for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                  let userNode = each_array[$$index];
                  const node = store.nodeLookup.get(userNode.id);
                  if (node && nodeHasDimensions(node) && !node.hidden) {
                    $$renderer3.push("<!--[-->");
                    const nodeDimesions = getNodeDimensions(node);
                    MinimapNode($$renderer3, spread_props([
                      {
                        id: node.id,
                        x: node.internals.positionAbsolute.x,
                        y: node.internals.positionAbsolute.y
                      },
                      nodeDimesions,
                      {
                        selected: node.selected,
                        nodeComponent,
                        color: nodeColorFunc?.(node),
                        borderRadius: nodeBorderRadius,
                        strokeColor: nodeStrokeColorFunc(node),
                        strokeWidth: nodeStrokeWidth,
                        shapeRendering,
                        class: nodeClassFunc(node)
                      }
                    ]));
                  } else {
                    $$renderer3.push("<!--[!-->");
                  }
                  $$renderer3.push(`<!--]-->`);
                }
                $$renderer3.push(`<!--]--><path class="svelte-flow__minimap-mask"${attr("d", `M${stringify(x - offset)},${stringify(y - offset)}h${stringify(viewboxWidth + offset * 2)}v${stringify(viewboxHeight + offset * 2)}h${stringify(-viewboxWidth - offset * 2)}z
      M${stringify(viewBB.x)},${stringify(viewBB.y)}h${stringify(viewBB.width)}v${stringify(viewBB.height)}h${stringify(-viewBB.width)}z`)} fill-rule="evenodd" pointer-events="none">`);
                push_element($$renderer3, "path", 125, 6);
                $$renderer3.push(`</path>`);
                pop_element();
                $$renderer3.push(`</svg>`);
                pop_element();
              } else {
                $$renderer3.push("<!--[!-->");
              }
              $$renderer3.push(`<!--]-->`);
            }),
            $$slots: { default: true }
          }
        ]));
      });
    },
    Minimap
  );
}
Minimap.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
AgentListItem[FILENAME] = "src/lib/components/agents/AgentListItem.svelte";
function AgentListItem($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let displayName;
      let agent = $$props["agent"];
      let onRun = $$props["onRun"];
      let runButtonEnabled = fallback($$props["runButtonEnabled"], true);
      let onEdit = $$props["onEdit"];
      let onDelete = $$props["onDelete"];
      let onShowGraph = $$props["onShowGraph"];
      let onDuplicate = fallback($$props["onDuplicate"], () => void 0, true);
      let displayGraphName = fallback($$props["displayGraphName"], null);
      displayName = (() => {
        if (displayGraphName) {
          return displayGraphName;
        }
        if (agent.full_config?.graph_name) {
          return agent.full_config.graph_name;
        }
        return agent.graph_name;
      })();
      $$renderer2.push(`<li class="list-group-item d-flex justify-content-between align-items-center">`);
      push_element($$renderer2, "li", 21, 0);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 22, 1);
      $$renderer2.push(`<h5 class="mb-1">`);
      push_element($$renderer2, "h5", 23, 2);
      $$renderer2.push(`${escape_html(displayName)}</h5>`);
      pop_element();
      $$renderer2.push(` <p class="mb-1 text-muted" style="font-size: 0.9rem;">`);
      push_element($$renderer2, "p", 24, 2);
      $$renderer2.push(`${escape_html(agent.full_config.description)}</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 26, 1);
      Button($$renderer2, {
        color: runButtonEnabled ? "primary" : "secondary",
        size: "sm",
        disabled: !runButtonEnabled,
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<i${attr_class(`${stringify(runButtonEnabled ? "bi bi-play-fill" : "bi bi-pause-fill")} me-1`)}>`);
          push_element($$renderer3, "i", 33, 3);
          $$renderer3.push(`</i>`);
          pop_element();
          $$renderer3.push(`${escape_html(runButtonEnabled ? "Run" : "Waiting for Input")}`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Button($$renderer2, {
        color: "secondary",
        size: "sm",
        class: "ms-2",
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<i class="bi bi-pencil-fill me-1">`);
          push_element($$renderer3, "i", 37, 3);
          $$renderer3.push(`</i>`);
          pop_element();
          $$renderer3.push(`Edit`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Button($$renderer2, {
        color: "info",
        size: "sm",
        class: "ms-2",
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<i class="bi bi-diagram-3 me-1">`);
          push_element($$renderer3, "i", 41, 3);
          $$renderer3.push(`</i>`);
          pop_element();
          $$renderer3.push(`Graph`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      if (onDuplicate) {
        $$renderer2.push("<!--[-->");
        Button($$renderer2, {
          color: "secondary",
          size: "sm",
          class: "ms-2",
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<i class="bi bi-files me-1">`);
            push_element($$renderer3, "i", 46, 3);
            $$renderer3.push(`</i>`);
            pop_element();
            $$renderer3.push(`Duplicate`);
          }),
          $$slots: { default: true }
        });
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      Button($$renderer2, {
        color: "danger",
        size: "sm",
        class: "ms-2",
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<i class="bi bi-trash me-1">`);
          push_element($$renderer3, "i", 51, 3);
          $$renderer3.push(`</i>`);
          pop_element();
          $$renderer3.push(`Delete`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(`</li>`);
      pop_element();
      bind_props($$props, {
        agent,
        onRun,
        runButtonEnabled,
        onEdit,
        onDelete,
        onShowGraph,
        onDuplicate,
        displayGraphName
      });
    },
    AgentListItem
  );
}
AgentListItem.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
class AgentValidation {
  static validateAgentConfig(config) {
    const errors = [];
    try {
      if (typeof config === "string") {
        config = JSON.parse(config);
      }
      const requiredFields = ["graph_name", "nodes", "edges"];
      for (const field of requiredFields) {
        if (!config[field]) {
          errors.push(`Missing required field: ${field}`);
        }
      }
      if (config.graph_name && typeof config.graph_name !== "string") {
        errors.push("graph_name must be a string");
      }
      if (config.nodes) {
        if (!Array.isArray(config.nodes)) {
          errors.push("nodes must be an array");
        } else {
          config.nodes.forEach((node, index) => {
            if (!node.id) {
              errors.push(`Node at index ${index} missing required field: id`);
            }
            if (!node.template) {
              errors.push(`Node at index ${index} missing required field: template`);
            }
            if (!node.config) {
              errors.push(`Node at index ${index} missing required field: config`);
            }
            if (node.id && typeof node.id !== "string") {
              errors.push(`Node at index ${index}: id must be a string`);
            }
            if (node.template && typeof node.template !== "string") {
              errors.push(`Node at index ${index}: template must be a string`);
            }
            if (node.config && typeof node.config !== "object") {
              errors.push(`Node at index ${index}: config must be an object`);
            }
            if (node.config) {
              if (node.template && (node.template.includes("LLM") || node.template.includes("llm"))) {
                if (!node.config.prompt) {
                  errors.push(`Node '${node.id}' (LLM node) missing required config field: prompt`);
                }
                if (!node.config.llm_id) {
                  errors.push(`Node '${node.id}' (LLM node) missing required config field: llm_id`);
                }
                if (!node.config.target) {
                  errors.push(`Node '${node.id}' (LLM node) missing required config field: target`);
                }
              }
              if (node.template && node.template.includes("Tool")) {
                if (!node.config.target) {
                  errors.push(`Node '${node.id}' (Tool node) missing required config field: target`);
                }
                const hasToolNames = node.config.tool_names && Array.isArray(node.config.tool_names);
                const hasToolConfig = node.config.tool_config;
                const hasTools = node.config.tools;
                if (!hasToolNames && !hasToolConfig && !hasTools) {
                  errors.push(`Node '${node.id}' (Tool node) must have either 'tool_names' (array), 'tool_config' (object), or 'tools' field`);
                }
                if (node.config.tool_names && !Array.isArray(node.config.tool_names)) {
                  errors.push(`Node '${node.id}' (Tool node) tool_names must be an array`);
                }
                if (node.config.tools) {
                  if (typeof node.config.tools !== "string" && !Array.isArray(node.config.tools)) {
                    errors.push(`Node '${node.id}' (Tool node) tools must be a string or array`);
                  }
                }
                if (node.config.tool_config) {
                  if (typeof node.config.tool_config !== "object" || Array.isArray(node.config.tool_config)) {
                    errors.push(`Node '${node.id}' (Tool node) tool_config must be an object`);
                  } else {
                    Object.entries(node.config.tool_config).forEach(([toolName, toolConfig]) => {
                      if (toolConfig !== null && typeof toolConfig !== "object") {
                        errors.push(`Node '${node.id}' (Tool node) tool_config['${toolName}'] must be an object or null`);
                      }
                    });
                  }
                }
              }
              if (node.template && node.template.includes("HumanInput")) {
                if (!node.config.targets_prompts) {
                  errors.push(`Node '${node.id}' (HumanInput node) missing required config field: targets_prompts`);
                } else if (typeof node.config.targets_prompts !== "object") {
                  errors.push(`Node '${node.id}' (HumanInput node) targets_prompts must be an object`);
                }
              }
            }
          });
        }
      }
      if (config.edges) {
        if (!Array.isArray(config.edges)) {
          errors.push("edges must be an array");
        } else {
          config.edges.forEach((edge, index) => {
            if (!edge.from) {
              errors.push(`Edge at index ${index} missing required field: from`);
            }
            if (!edge.to) {
              errors.push(`Edge at index ${index} missing required field: to`);
            }
            if (edge.from && typeof edge.from !== "string") {
              errors.push(`Edge at index ${index}: from must be a string`);
            }
            if (edge.to && typeof edge.to !== "string") {
              errors.push(`Edge at index ${index}: to must be a string`);
            }
          });
        }
      }
      if (config.nodes && config.edges && Array.isArray(config.nodes) && Array.isArray(config.edges)) {
        const nodeIds = new Set(config.nodes.map((node) => node.id));
        config.edges.forEach((edge, index) => {
          if (edge.from !== "__start__" && !nodeIds.has(edge.from)) {
            errors.push(`Edge at index ${index} references non-existent source node '${edge.from}'`);
          }
          if (edge.to !== "__end__" && !nodeIds.has(edge.to)) {
            errors.push(`Edge at index ${index} references non-existent target node '${edge.to}'`);
          }
          if (edge.from === edge.to && edge.from !== "__start__" && edge.from !== "__end__") {
            errors.push(`Edge at index ${index} creates a circular reference: node '${edge.from}' cannot connect to itself`);
          }
        });
        if (config.conditional_edges && Array.isArray(config.conditional_edges)) {
          config.conditional_edges.forEach((condEdge, index) => {
            if (!nodeIds.has(condEdge.from)) {
              errors.push(`Conditional edge at index ${index} references non-existent source node '${condEdge.from}'`);
            }
            if (condEdge.routing_map && typeof condEdge.routing_map === "object") {
              Object.entries(condEdge.routing_map).forEach(([condition, target]) => {
                if (typeof target === "string" && target !== "__end__" && !nodeIds.has(target)) {
                  errors.push(`Conditional edge routing_map condition '${condition}' references non-existent target node '${target}'`);
                }
                if (typeof target === "string" && target === condEdge.from) {
                  errors.push(`Conditional edge at index ${index} creates a circular reference: node '${condEdge.from}' cannot conditionally route to itself (condition: '${condition}')`);
                }
              });
            }
          });
        }
        const hasStartEdge = config.edges.some((edge) => edge.from === "__start__");
        if (!hasStartEdge) {
          errors.push("Graph must have at least one edge starting from __start__");
        }
        const reachableNodes = /* @__PURE__ */ new Set();
        config.edges.forEach((edge) => {
          if (edge.from === "__start__") {
            reachableNodes.add(edge.to);
          }
        });
        let foundNewNodes = true;
        while (foundNewNodes) {
          foundNewNodes = false;
          config.edges.forEach((edge) => {
            if (reachableNodes.has(edge.from) && !reachableNodes.has(edge.to) && edge.to !== "__end__") {
              reachableNodes.add(edge.to);
              foundNewNodes = true;
            }
          });
          if (config.conditional_edges) {
            config.conditional_edges.forEach((condEdge) => {
              if (reachableNodes.has(condEdge.from) && condEdge.routing_map) {
                Object.values(condEdge.routing_map).forEach((target) => {
                  if (typeof target === "string" && target !== "__end__" && !reachableNodes.has(target)) {
                    reachableNodes.add(target);
                    foundNewNodes = true;
                  }
                });
              }
            });
          }
        }
        for (const nodeId of nodeIds) {
          if (!reachableNodes.has(nodeId)) {
            console.warn(`Warning: Node '${nodeId}' may not be reachable from __start__`);
          }
        }
      }
      if (config.conditional_edges) {
        if (!Array.isArray(config.conditional_edges)) {
          errors.push("conditional_edges must be an array");
        } else {
          config.conditional_edges.forEach((condEdge, index) => {
            if (!condEdge.from) {
              errors.push(`Conditional edge at index ${index} missing required field: from`);
            }
            if (!condEdge.target) {
              errors.push(`Conditional edge at index ${index} missing required field: target`);
            }
            if (!condEdge.routing_map || typeof condEdge.routing_map !== "object") {
              errors.push(`Conditional edge at index ${index} missing or invalid routing_map`);
            } else {
              const routeCount = Object.keys(condEdge.routing_map).length;
              if (routeCount < 2) {
                errors.push(`Conditional edge at index ${index} must have at least 2 routes in routing_map, found ${routeCount}`);
              }
            }
          });
        }
      }
      if (config.llms) {
        if (!Array.isArray(config.llms)) {
          errors.push("llms must be an array");
        } else {
          config.llms.forEach((llm, index) => {
            if (!llm.id) {
              errors.push(`LLM at index ${index} missing required field: id`);
            }
            if (!llm.type) {
              errors.push(`LLM at index ${index} missing required field: type`);
            }
            if (!llm.config) {
              errors.push(`LLM at index ${index} missing required field: config`);
            }
            if (llm.id && typeof llm.id !== "string") {
              errors.push(`LLM at index ${index}: id must be a string`);
            }
            if (llm.type && typeof llm.type !== "string") {
              errors.push(`LLM at index ${index}: type must be a string`);
            }
          });
        }
      }
      if (config.nodes && config.llms) {
        const llmIds = new Set(config.llms.map((llm) => llm.id));
        config.nodes.forEach((node) => {
          if (node.config && node.config.llm_id) {
            if (!llmIds.has(node.config.llm_id)) {
              errors.push(`Node '${node.id}' references non-existent LLM '${node.config.llm_id}'`);
            }
          }
        });
      }
    } catch (parseError) {
      errors.push(`Invalid JSON: ${parseError.message}`);
    }
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  /**
   * Validate a single node configuration
   */
  static validateNodeConfig(node, index) {
    const errors = [];
    const nodeRef = index !== void 0 ? `Node at index ${index}` : `Node '${node.id || "unknown"}'`;
    if (!node.id) {
      errors.push(`${nodeRef} missing required field: id`);
    }
    if (!node.template) {
      errors.push(`${nodeRef} missing required field: template`);
    }
    if (!node.config) {
      errors.push(`${nodeRef} missing required field: config`);
    }
    if (node.id && typeof node.id !== "string") {
      errors.push(`${nodeRef}: id must be a string`);
    }
    if (node.template && typeof node.template !== "string") {
      errors.push(`${nodeRef}: template must be a string`);
    }
    if (node.config && typeof node.config !== "object") {
      errors.push(`${nodeRef}: config must be an object`);
    }
    return errors;
  }
  /**
   * Validate edge configuration
   */
  static validateEdgeConfig(edge, index) {
    const errors = [];
    const edgeRef = index !== void 0 ? `Edge at index ${index}` : "Edge";
    if (!edge.from) {
      errors.push(`${edgeRef} missing required field: from`);
    }
    if (!edge.to) {
      errors.push(`${edgeRef} missing required field: to`);
    }
    if (edge.from && typeof edge.from !== "string") {
      errors.push(`${edgeRef}: from must be a string`);
    }
    if (edge.to && typeof edge.to !== "string") {
      errors.push(`${edgeRef}: to must be a string`);
    }
    return errors;
  }
  /**
   * Validate LLM configuration
   */
  static validateLLMConfig(llm, index) {
    const errors = [];
    const llmRef = index !== void 0 ? `LLM at index ${index}` : `LLM '${llm.id || "unknown"}'`;
    if (!llm.id) {
      errors.push(`${llmRef} missing required field: id`);
    }
    if (!llm.type) {
      errors.push(`${llmRef} missing required field: type`);
    }
    if (!llm.config) {
      errors.push(`${llmRef} missing required field: config`);
    }
    if (llm.id && typeof llm.id !== "string") {
      errors.push(`${llmRef}: id must be a string`);
    }
    if (llm.type && typeof llm.type !== "string") {
      errors.push(`${llmRef}: type must be a string`);
    }
    return errors;
  }
}
class AgentService {
  static API_URL = `${runtimeConfig.AI_AGENTIC_URL}/graph/stream`;
  // private static readonly API_URL = 'http://localhost:8000/graph/stream';
  static parseSSEEvents(rawData) {
    const events = [];
    const chunks = rawData.split("\n\n");
    for (const chunk of chunks) {
      if (!chunk.trim()) continue;
      const lines = chunk.split("\n");
      let eventType = "";
      let eventData = "";
      for (const line of lines) {
        if (line.startsWith("event: ")) {
          eventType = line.substring(7);
        } else if (line.startsWith("data: ")) {
          eventData = line.substring(6);
        }
      }
      if (eventType && eventData) {
        try {
          const parsedData = JSON.parse(eventData);
          events.push({ type: eventType, ...parsedData });
        } catch (error) {
          console.error("Error parsing SSE event data:", error, eventData);
        }
      }
    }
    return events;
  }
  /**
   * Parses agent execution events and handles the targets_prompts format for interrupts.
   * 
   * For interrupts, expects:
   * - targets_prompts: { target1: prompt1, target2: prompt2, ... }
   * 
   * Resume responses should be in format: { target1: response1, target2: response2, ... }
   */
  static parseAgentOutput(events, setCurrentSessionId, setWaitingForResume, setResumePrompts) {
    if (!events || events.length === 0) return "";
    let output = "";
    for (const event of events) {
      switch (event.type) {
        case "session_start":
          output += `🚀 Session started (ID: ${event.session_id})
`;
          if (event.message) output += `${event.message}
`;
          break;
        case "execution_chunk":
          if (event.data) {
            for (const [key2, value] of Object.entries(event.data)) {
              if (Array.isArray(value)) {
                output += `🔹 ${key2}:
`;
                for (const item of value) {
                  if (typeof item === "string") {
                    output += `  - ${item}
`;
                  } else if (item?.content) {
                    output += `  - ${item.content}
`;
                  } else {
                    output += `  - ${JSON.stringify(item)}
`;
                  }
                }
              } else if (typeof value === "object" && value !== null) {
                output += `🔹 ${key2}: ${JSON.stringify(value, null, 2)}
`;
              } else {
                output += `🔹 ${key2}: ${value}
`;
              }
            }
          }
          if (event.message) output += `${event.message}
`;
          break;
        case "interrupt":
          output += `⏸️ Execution interrupted - User input required
`;
          if (event.targets_prompts) {
            const normalizedPrompts = {};
            Object.entries(event.targets_prompts).forEach(([target, value]) => {
              if (value && typeof value === "object" && !Array.isArray(value) && "prompt" in value) {
                const valueObj = value;
                let promptText = "";
                if (typeof valueObj.prompt === "string") {
                  promptText = valueObj.prompt;
                } else if (valueObj.prompt !== void 0 && valueObj.prompt !== null) {
                  try {
                    promptText = JSON.stringify(valueObj.prompt);
                  } catch {
                    promptText = String(valueObj.prompt);
                  }
                }
                const defaultValue = typeof valueObj.default === "string" ? valueObj.default : void 0;
                normalizedPrompts[target] = defaultValue ? { prompt: promptText, default: defaultValue } : { prompt: promptText };
              } else {
                let promptText = "";
                if (typeof value === "string") {
                  promptText = value;
                } else if (value !== void 0 && value !== null) {
                  try {
                    promptText = JSON.stringify(value);
                  } catch {
                    promptText = String(value);
                  }
                }
                normalizedPrompts[target] = { prompt: promptText };
              }
            });
            const targets = Object.keys(normalizedPrompts);
            for (const target of targets) {
              const promptInfo = normalizedPrompts[target];
              const defaultSuffix = promptInfo.default ? ` (default: ${promptInfo.default})` : "";
              output += `${target}: ${promptInfo.prompt}${defaultSuffix}
`;
            }
            setCurrentSessionId(event.session_id);
            setWaitingForResume(true);
            setResumePrompts(normalizedPrompts);
          } else {
            console.warn("Interrupt event received without targets_prompts");
            setCurrentSessionId(event.session_id);
            setWaitingForResume(true);
            setResumePrompts({
              default: { prompt: "Please provide input to continue:" }
            });
          }
          break;
        case "execution_complete":
          output += `✅ Execution completed successfully
`;
          if (event.message) output += `${event.message}
`;
          setWaitingForResume(false);
          setCurrentSessionId(null);
          setResumePrompts({});
          break;
        case "error":
          output += `❌ Error: ${event.error || event.message}
`;
          if (event.error_type) output += `Error Type: ${event.error_type}
`;
          setWaitingForResume(false);
          setCurrentSessionId(null);
          setResumePrompts({});
          break;
        case "resume_start":
          output += `🔄 Resuming execution
`;
          if (event.message) output += `${event.message}
`;
          setWaitingForResume(false);
          break;
        default:
          if (event.message) output += `${event.message}
`;
          break;
      }
    }
    return output.trim();
  }
  static async executeAgentRequest(requestBody) {
    if (requestBody.graph_config) {
      requestBody.graph_config.llms = {};
      llmConfigStore.configs.subscribe((configs) => {
        requestBody.graph_config.llms = configs.map((config) => ({
          id: config.name,
          type: config.provider,
          description: "sample description",
          config: config.config
        }));
      });
    }
    console.log("Executing agent request with body:", requestBody);
    const response = await fetch(this.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "text/event-stream"
      },
      body: JSON.stringify(requestBody)
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }
    if (!response.body) throw new Error("No response body");
    return response.body;
  }
  static createNewAgentTemplate(agentName) {
    console.log("🔧 createNewAgentTemplate called with agentName:", agentName);
    const template = {
      graph_name: agentName,
      description: "A newly created agent. Click 'Edit JSON' to configure.",
      running: false,
      full_config: {
        graph_name: agentName,
        description: "Default configuration for a new agent. Please edit.",
        state_schema: {
          messages: { type: "List[AnyMessage]", default: [] }
        },
        nodes: [
          {
            id: "initial_node",
            template: "llm_prompt_node",
            config: {
              prompt: "This is a new agent. Configure its prompt.",
              llm_id: "default_llm",
              target: "messages"
            }
          }
        ],
        edges: [{ from: "__start__", to: "initial_node" }],
        conditional_edges: [],
        llms: [
          {
            id: "default_llm",
            type: "AzureOpenAI",
            description: "Configure your LLM details here.",
            config: {
              azure_endpoint: "YOUR_ENDPOINT",
              api_key: "YOUR_API_KEY",
              api_version: "2024-08-01-preview",
              azure_deployment: "YOUR_DEPLOYMENT",
              model_version: "YOUR_MODEL"
            }
          }
        ],
        tool_config: {}
      }
    };
    console.log("🔧 Created template:", {
      graph_name: template.graph_name,
      full_config_graph_name: template.full_config.graph_name
    });
    return template;
  }
  static validateAgentConfig(config) {
    return AgentValidation.validateAgentConfig(config);
  }
}
AgentEditModal[FILENAME] = "src/lib/components/agents/AgentEditModal.svelte";
function AgentEditModal($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let isOpen = fallback($$props["isOpen"], false);
      let agent = fallback($$props["agent"], null);
      let onSave = $$props["onSave"];
      let onClose = $$props["onClose"];
      let jsonEditString = "";
      if (isOpen && agent) {
        $$renderer2.push("<!--[-->");
        Modal($$renderer2, {
          isOpen,
          toggle: onClose,
          size: "lg",
          backdrop: "static",
          children: prevent_snippet_stringification(($$renderer3) => {
            ModalHeader($$renderer3, {
              toggle: onClose,
              children: prevent_snippet_stringification(($$renderer4) => {
                $$renderer4.push(`<!---->Edit Agent Configuration: ${escape_html(agent.graph_name)}`);
              }),
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----> `);
            ModalBody($$renderer3, {
              children: prevent_snippet_stringification(($$renderer4) => {
                $$renderer4.push(`<textarea class="form-control" rows="20" style="font-family: monospace; font-size: 0.9rem;">`);
                push_element($$renderer4, "textarea", 55, 3);
                const $$body = escape_html(jsonEditString);
                if ($$body) {
                  $$renderer4.push(`${$$body}`);
                }
                $$renderer4.push(`</textarea>`);
                pop_element();
                $$renderer4.push(` `);
                {
                  $$renderer4.push("<!--[!-->");
                }
                $$renderer4.push(`<!--]--> `);
                {
                  $$renderer4.push("<!--[!-->");
                }
                $$renderer4.push(`<!--]-->`);
              }),
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----> `);
            ModalFooter($$renderer3, {
              children: prevent_snippet_stringification(($$renderer4) => {
                Button($$renderer4, {
                  color: "info",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    $$renderer5.push(`<i class="bi bi-check-circle me-1">`);
                    push_element($$renderer5, "i", 88, 4);
                    $$renderer5.push(`</i>`);
                    pop_element();
                    $$renderer5.push(`Validate Config`);
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
                    $$renderer5.push(`<!---->Close`);
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
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, { isOpen, agent, onSave, onClose });
    },
    AgentEditModal
  );
}
AgentEditModal.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
AgentConsoleViewport[FILENAME] = "src/lib/components/agents/AgentConsoleViewport.svelte";
function AgentConsoleViewport($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let showVerbose = fallback($$props["showVerbose"], false);
      let streamEvents = fallback($$props["streamEvents"], () => [], true);
      let agentOutput = fallback($$props["agentOutput"], "");
      let agentStreaming = fallback($$props["agentStreaming"], false);
      let waitingForResume = fallback($$props["waitingForResume"], false);
      let scrollEl = fallback($$props["scrollEl"], null);
      function sanitizeOutput(text) {
        if (!text) return "";
        try {
          return text.replace(/\uFFFD/g, "?").replace(/\0/g, "").replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").normalize("NFC");
        } catch (error) {
          console.warn("Error sanitizing output:", error);
          return text.replace(/[^\x20-\x7E\n\r\t]/g, "?");
        }
      }
      function formatAgentOutput(output) {
        if (!output) return "No output yet...";
        try {
          const sanitized = sanitizeOutput(output);
          let formatted = sanitized.replace(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/g, "\n**$1**").replace(/(Step \d+|Phase \d+)/gi, "\n### $1").replace(/\[SESSION_START\]/g, "🚀").replace(/\[INTERRUPT\]/g, "⏸️").replace(/\[SUCCESS\]/g, "✅").replace(/\[ERROR\]/g, "❌").replace(/\[RESUME\]/g, "�").replace(/(\[Error\]|\[ERROR\])/gi, "\n🚨 **$1**").replace(/(\[Success\]|\[SUCCESS\])/gi, "\n✅ **$1**").replace(/(\[Info\]|\[INFO\])/gi, "\n💡 **$1**").replace(/(\[Warning\]|\[WARNING\]|\[Warn\]|\[WARN\])/gi, "\n⚠️ **$1**").replace(/(\{[\s\S]*?\})/g, (match) => {
            try {
              JSON.parse(match);
              return `
\`\`\`json
${match}
\`\`\`
`;
            } catch {
              return `
\`${match}\`
`;
            }
          }).replace(/\n{3,}/g, "\n\n");
          return formatted.trim();
        } catch (error) {
          console.warn("Error formatting agent output:", error);
          return sanitizeOutput(output) || "Error displaying output";
        }
      }
      $$renderer2.push(`<div class="console-container svelte-rrtmkr">`);
      push_element($$renderer2, "div", 43, 0);
      $$renderer2.push(`<pre class="console-output p-3 svelte-rrtmkr">`);
      push_element($$renderer2, "pre", 44, 4);
      if (showVerbose) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<code class="json-output svelte-rrtmkr">`);
        push_element($$renderer2, "code", 44, 74);
        $$renderer2.push(`${escape_html(JSON.stringify(streamEvents, null, 2))}</code>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="formatted-output svelte-rrtmkr">`);
        push_element($$renderer2, "div", 44, 153);
        $$renderer2.push(`${html(marked.parse(formatAgentOutput(agentOutput || "")))}</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
      if (agentStreaming) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="blinking-cursor svelte-rrtmkr">`);
        push_element($$renderer2, "span", 44, 272);
        $$renderer2.push(`▊</span>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></pre>`);
      pop_element();
      $$renderer2.push(` `);
      if (waitingForResume) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="resume-indicator p-2 text-center bg-warning svelte-rrtmkr">`);
        push_element($$renderer2, "div", 47, 8);
        $$renderer2.push(`<small class="text-dark svelte-rrtmkr">`);
        push_element($$renderer2, "small", 48, 12);
        $$renderer2.push(`<i class="bi bi-pause-circle-fill me-1 svelte-rrtmkr">`);
        push_element($$renderer2, "i", 49, 16);
        $$renderer2.push(`</i>`);
        pop_element();
        $$renderer2.push(` Agent paused - waiting for user input</small>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      bind_props($$props, {
        showVerbose,
        streamEvents,
        agentOutput,
        agentStreaming,
        waitingForResume,
        scrollEl
      });
    },
    AgentConsoleViewport
  );
}
AgentConsoleViewport.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
AgentConsole[FILENAME] = "src/lib/components/agents/AgentConsole.svelte";
function AgentConsole($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let areInputsFilled, buttonDisabled;
      let agentOutput = fallback($$props["agentOutput"], "");
      let agentStreaming = fallback($$props["agentStreaming"], false);
      let streamEvents = fallback($$props["streamEvents"], () => [], true);
      let waitingForResume = fallback($$props["waitingForResume"], false);
      let resumePrompts = fallback($$props["resumePrompts"], () => ({}), true);
      let resumeInputs = fallback($$props["resumeInputs"], () => ({}), true);
      let currentSessionId = fallback($$props["currentSessionId"], null);
      let onResumeAgent = $$props["onResumeAgent"];
      let onCancelResume = $$props["onCancelResume"];
      let showVerbose = false;
      let inlineConsoleRef = null;
      let modalConsoleRef = null;
      let resumeModalOpen = false;
      let consoleModalOpen = false;
      let hasAgentOutput = false;
      let consoleStatusLabel = "Awaiting first run";
      let previousRunActive = false;
      let manualClosedWhileActive = false;
      function handleToggleConsole() {
        const runActive = agentStreaming || waitingForResume;
        if (consoleModalOpen) {
          consoleModalOpen = false;
          if (runActive) {
            manualClosedWhileActive = true;
          }
        } else {
          consoleModalOpen = true;
          manualClosedWhileActive = false;
        }
      }
      if (waitingForResume && Object.keys(resumePrompts).length > 0) {
        resumeModalOpen = true;
      }
      if (!waitingForResume) {
        resumeModalOpen = false;
      }
      {
        const runActive = agentStreaming || waitingForResume;
        if (runActive && !previousRunActive && !manualClosedWhileActive) {
          consoleModalOpen = true;
        }
        if (!runActive && previousRunActive) {
          manualClosedWhileActive = false;
        }
        previousRunActive = runActive;
      }
      {
        if (resumePrompts && Object.keys(resumePrompts).length > 0) {
          const newResumeInputs = { ...resumeInputs };
          Object.entries(resumePrompts).forEach(([target, promptConfig]) => {
            if (!(target in newResumeInputs)) {
              newResumeInputs[target] = promptConfig.default ?? "";
            }
          });
          Object.keys(newResumeInputs).forEach((target) => {
            if (!(target in resumePrompts)) {
              delete newResumeInputs[target];
            }
          });
          if (JSON.stringify(newResumeInputs) !== JSON.stringify(resumeInputs)) {
            resumeInputs = newResumeInputs;
          }
        }
      }
      areInputsFilled = (() => {
        const targets = Object.keys(resumePrompts);
        if (targets.length === 0) return false;
        return targets.every((target) => {
          const input = resumeInputs[target];
          return input !== void 0 && input.trim().length > 0;
        });
      })();
      buttonDisabled = !areInputsFilled;
      console.log("Resume state:", {
        resumePrompts,
        resumeInputs,
        areInputsFilled,
        buttonDisabled,
        targetsCount: Object.keys(resumePrompts).length,
        inputsCount: Object.keys(resumeInputs).length
      });
      hasAgentOutput = Boolean(agentOutput && agentOutput.trim().length > 0);
      consoleStatusLabel = agentStreaming ? "Agent run in progress" : waitingForResume ? "Agent waiting for input" : hasAgentOutput ? "Last run output available" : "Awaiting first run";
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        if (!consoleModalOpen) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="inline-console mt-3 svelte-1xu2tgp">`);
          push_element($$renderer3, "div", 112, 1);
          $$renderer3.push(`<div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">`);
          push_element($$renderer3, "div", 113, 2);
          $$renderer3.push(`<h6 class="mb-0">`);
          push_element($$renderer3, "h6", 114, 3);
          $$renderer3.push(`Agent Output Console</h6>`);
          pop_element();
          $$renderer3.push(` <div class="d-flex align-items-center gap-2">`);
          push_element($$renderer3, "div", 115, 3);
          $$renderer3.push(`<div class="form-check form-switch m-0">`);
          push_element($$renderer3, "div", 116, 4);
          $$renderer3.push(`<input id="inline-showVerbose" type="checkbox"${attr("checked", showVerbose, true)} class="form-check-input"/>`);
          push_element($$renderer3, "input", 117, 5);
          pop_element();
          $$renderer3.push(` <label for="inline-showVerbose" class="form-check-label small">`);
          push_element($$renderer3, "label", 123, 5);
          $$renderer3.push(`Show raw events</label>`);
          pop_element();
          $$renderer3.push(`</div>`);
          pop_element();
          $$renderer3.push(` `);
          Button($$renderer3, {
            color: agentStreaming ? "warning" : "secondary",
            outline: true,
            size: "sm",
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<i class="bi bi-arrows-fullscreen me-1">`);
              push_element($$renderer4, "i", 128, 5);
              $$renderer4.push(`</i>`);
              pop_element();
              $$renderer4.push(` Open in modal`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Badge($$renderer3, {
            color: agentStreaming ? "warning" : waitingForResume ? "info" : hasAgentOutput ? "success" : "secondary",
            pill: true,
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<!---->${escape_html(consoleStatusLabel)}`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          if (currentSessionId) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<code class="session-pill svelte-1xu2tgp">`);
            push_element($$renderer3, "code", 135, 5);
            $$renderer3.push(`Session: ${escape_html(currentSessionId)}</code>`);
            pop_element();
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]--></div>`);
          pop_element();
          $$renderer3.push(`</div>`);
          pop_element();
          $$renderer3.push(` `);
          AgentConsoleViewport($$renderer3, {
            showVerbose,
            streamEvents,
            agentOutput,
            agentStreaming,
            waitingForResume,
            get scrollEl() {
              return inlineConsoleRef;
            },
            set scrollEl($$value) {
              inlineConsoleRef = $$value;
              $$settled = false;
            }
          });
          $$renderer3.push(`<!----></div>`);
          pop_element();
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> `);
        Modal($$renderer3, {
          class: "agent-console-modal",
          isOpen: consoleModalOpen,
          toggle: handleToggleConsole,
          size: "xl",
          children: prevent_snippet_stringification(($$renderer4) => {
            ModalHeader($$renderer4, {
              toggle: handleToggleConsole,
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<i class="bi bi-terminal-fill text-primary me-2">`);
                push_element($$renderer5, "i", 158, 2);
                $$renderer5.push(`</i>`);
                pop_element();
                $$renderer5.push(` <span>`);
                push_element($$renderer5, "span", 159, 2);
                $$renderer5.push(`Agent Output Console</span>`);
                pop_element();
                $$renderer5.push(` `);
                Badge($$renderer5, {
                  color: agentStreaming ? "warning" : waitingForResume ? "info" : hasAgentOutput ? "success" : "secondary",
                  pill: true,
                  class: "ms-2",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->${escape_html(consoleStatusLabel)}`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> <div class="form-check form-switch ms-auto">`);
                push_element($$renderer5, "div", 163, 2);
                $$renderer5.push(`<input id="modal-showVerbose" type="checkbox"${attr("checked", showVerbose, true)} class="form-check-input"/>`);
                push_element($$renderer5, "input", 164, 3);
                pop_element();
                $$renderer5.push(` <label for="modal-showVerbose" class="form-check-label small">`);
                push_element($$renderer5, "label", 170, 3);
                $$renderer5.push(`Show raw events</label>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            ModalBody($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                AgentConsoleViewport($$renderer5, {
                  showVerbose,
                  streamEvents,
                  agentOutput,
                  agentStreaming,
                  waitingForResume,
                  get scrollEl() {
                    return modalConsoleRef;
                  },
                  set scrollEl($$value) {
                    modalConsoleRef = $$value;
                    $$settled = false;
                  }
                });
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            ModalFooter($$renderer4, {
              class: "justify-content-between flex-wrap gap-2",
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<small class="text-muted">`);
                push_element($$renderer5, "small", 187, 2);
                $$renderer5.push(`<i class="bi bi-info-circle me-1">`);
                push_element($$renderer5, "i", 188, 3);
                $$renderer5.push(`</i>`);
                pop_element();
                $$renderer5.push(` ${escape_html(consoleStatusLabel)}</small>`);
                pop_element();
                $$renderer5.push(` `);
                Button($$renderer5, {
                  color: "secondary",
                  size: "sm",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<i class="bi bi-x-circle me-2">`);
                    push_element($$renderer6, "i", 193, 3);
                    $$renderer6.push(`</i>`);
                    pop_element();
                    $$renderer6.push(` Close Console`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!---->`);
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!---->`);
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> `);
        Modal($$renderer3, {
          isOpen: resumeModalOpen,
          toggle: () => {
          },
          backdrop: "static",
          keyboard: false,
          size: "lg",
          children: prevent_snippet_stringification(($$renderer4) => {
            ModalHeader($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<div class="d-flex align-items-center">`);
                push_element($$renderer5, "div", 202, 2);
                $$renderer5.push(`<i class="bi bi-chat-square-text-fill me-2 text-primary">`);
                push_element($$renderer5, "i", 203, 3);
                $$renderer5.push(`</i>`);
                pop_element();
                $$renderer5.push(` Agent Input Required</div>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            ModalBody($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<div class="alert alert-info d-flex align-items-center">`);
                push_element($$renderer5, "div", 208, 2);
                $$renderer5.push(`<i class="bi bi-info-circle-fill me-2">`);
                push_element($$renderer5, "i", 209, 3);
                $$renderer5.push(`</i>`);
                pop_element();
                $$renderer5.push(` <div>`);
                push_element($$renderer5, "div", 210, 3);
                $$renderer5.push(`The agent execution has been paused and requires your input to continue.
				Please provide the requested information below.</div>`);
                pop_element();
                $$renderer5.push(`</div>`);
                pop_element();
                $$renderer5.push(` <!--[-->`);
                const each_array = ensure_array_like(Object.entries(resumePrompts));
                for (let index = 0, $$length = each_array.length; index < $$length; index++) {
                  let [target, promptConfig] = each_array[index];
                  $$renderer5.push(`<div class="mb-4">`);
                  push_element($$renderer5, "div", 217, 3);
                  Label($$renderer5, {
                    for: `input-${stringify(target)}`,
                    class: "form-label fw-bold text-primary",
                    children: prevent_snippet_stringification(($$renderer6) => {
                      $$renderer6.push(`<i class="bi bi-arrow-right-circle me-1">`);
                      push_element($$renderer6, "i", 219, 5);
                      $$renderer6.push(`</i>`);
                      pop_element();
                      $$renderer6.push(` ${escape_html(target)}`);
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----> <div class="prompt-text p-2 mb-2 bg-light border-start border-primary border-3 svelte-1xu2tgp">`);
                  push_element($$renderer5, "div", 222, 4);
                  $$renderer5.push(`<small class="text-muted">`);
                  push_element($$renderer5, "small", 223, 5);
                  $$renderer5.push(`${escape_html(promptConfig.prompt)}</small>`);
                  pop_element();
                  $$renderer5.push(`</div>`);
                  pop_element();
                  $$renderer5.push(` `);
                  Input($$renderer5, {
                    id: `input-${stringify(target)}`,
                    type: "text",
                    placeholder: "Enter your response...",
                    class: "form-control-lg",
                    get value() {
                      return resumeInputs[target];
                    },
                    set value($$value) {
                      resumeInputs[target] = $$value;
                      $$settled = false;
                    }
                  });
                  $$renderer5.push(`<!----></div>`);
                  pop_element();
                }
                $$renderer5.push(`<!--]--> `);
                if (currentSessionId) {
                  $$renderer5.push("<!--[-->");
                  $$renderer5.push(`<div class="mt-3 p-2 bg-light rounded">`);
                  push_element($$renderer5, "div", 237, 3);
                  $$renderer5.push(`<small class="text-muted">`);
                  push_element($$renderer5, "small", 238, 4);
                  $$renderer5.push(`<i class="bi bi-tag me-1">`);
                  push_element($$renderer5, "i", 239, 5);
                  $$renderer5.push(`</i>`);
                  pop_element();
                  $$renderer5.push(` Session ID: <code>`);
                  push_element($$renderer5, "code", 240, 17);
                  $$renderer5.push(`${escape_html(currentSessionId)}</code>`);
                  pop_element();
                  $$renderer5.push(`</small>`);
                  pop_element();
                  $$renderer5.push(`</div>`);
                  pop_element();
                } else {
                  $$renderer5.push("<!--[!-->");
                }
                $$renderer5.push(`<!--]-->`);
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            ModalFooter($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                Button($$renderer5, {
                  color: "secondary",
                  size: "lg",
                  outline: true,
                  class: "px-4",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<i class="bi bi-x-circle me-2">`);
                    push_element($$renderer6, "i", 253, 3);
                    $$renderer6.push(`</i>`);
                    pop_element();
                    $$renderer6.push(` Cancel`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> `);
                Button($$renderer5, {
                  color: "primary",
                  size: "lg",
                  disabled: buttonDisabled,
                  class: "px-4",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<i class="bi bi-play-fill me-2">`);
                    push_element($$renderer6, "i", 263, 3);
                    $$renderer6.push(`</i>`);
                    pop_element();
                    $$renderer6.push(` Continue Agent Execution`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!---->`);
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!---->`);
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
        agentOutput,
        agentStreaming,
        streamEvents,
        waitingForResume,
        resumePrompts,
        resumeInputs,
        currentSessionId,
        onResumeAgent,
        onCancelResume
      });
    },
    AgentConsole
  );
}
AgentConsole.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
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
    "core.ToolNode": {
      type: "default",
      color: "#FF9800",
      icon: "🔧",
      label: "Tool"
    },
    "__start__": {
      type: "input",
      color: "#9C27B0",
      icon: "▶️",
      label: "Start"
    },
    "__end__": {
      type: "output",
      color: "#F44336",
      icon: "⏹️",
      label: "End"
    }
  };
  return typeMap[template] || {
    type: "default",
    color: "#607D8B",
    icon: "📦",
    label: "Custom Node"
  };
};
const calculateNodePositions = (nodes, edges) => {
  const positions = {};
  const levels = {};
  const visited = /* @__PURE__ */ new Set();
  const hasIncoming = new Set(edges.map((e) => e.target));
  const rootNodes = nodes.filter((n) => !hasIncoming.has(n.id));
  const queue = rootNodes.map((n) => ({ node: n, level: 0 }));
  while (queue.length > 0) {
    const { node, level } = queue.shift();
    if (visited.has(node.id)) continue;
    visited.add(node.id);
    levels[node.id] = level;
    const children = edges.filter((e) => e.source === node.id).map((e) => nodes.find((n) => n.id === e.target)).filter((n) => n && !visited.has(n.id));
    children.forEach((child) => {
      queue.push({ node: child, level: level + 1 });
    });
  }
  const levelGroups = {};
  Object.entries(levels).forEach(([nodeId, level]) => {
    const levelNum = level;
    if (!levelGroups[levelNum]) levelGroups[levelNum] = [];
    levelGroups[levelNum].push(nodeId);
  });
  Object.entries(levelGroups).forEach(([level, nodeIds]) => {
    const levelNum = parseInt(level);
    const yPos = levelNum * 200 + 100;
    const xSpacing = 300;
    const nodeArray = nodeIds;
    const startX = -(nodeArray.length - 1) * xSpacing / 2 + 400;
    nodeArray.forEach((nodeId, index) => {
      positions[nodeId] = {
        x: startX + index * xSpacing,
        y: yPos
      };
    });
  });
  return positions;
};
const parseAgentConfig = (config, executionPath = [], showExecutionOnly = false) => {
  try {
    if (!config || typeof config !== "object") {
      throw new Error("Invalid agent configuration");
    }
    const parsedNodes = [];
    const parsedEdges = [];
    const nodeIds = config.nodes?.map((n) => n.id) || [];
    const hasStart = nodeIds.includes("__start__") || config.edges?.some((e) => e.from === "__start__");
    const hasEnd = nodeIds.includes("__end__") || config.edges?.some((e) => e.to === "__end__") || config.conditional_edges?.some((ce) => Object.values(ce.routing_map).includes("__end__"));
    if (hasStart && !nodeIds.includes("__start__")) {
      parsedNodes.push({
        id: "__start__",
        template: "__start__",
        config: {}
      });
    }
    if (hasEnd && !nodeIds.includes("__end__")) {
      parsedNodes.push({
        id: "__end__",
        template: "__end__",
        config: {}
      });
    }
    if (config.nodes) {
      parsedNodes.push(...config.nodes);
    }
    const nodesToShow = showExecutionOnly ? parsedNodes.filter((node) => executionPath.includes(node.id)) : parsedNodes;
    const allEdges = [
      ...config.edges?.map((e) => ({ source: e.from, target: e.to })) || [],
      ...config.conditional_edges?.flatMap(
        (ce) => Object.entries(ce.routing_map).map(([condition, target]) => ({
          source: ce.from,
          target,
          condition
        }))
      ) || []
    ];
    const edgesToShow = showExecutionOnly ? allEdges.filter((edge) => {
      const sourceExecuted = executionPath.includes(edge.source);
      const targetExecuted = executionPath.includes(edge.target);
      return sourceExecuted && targetExecuted;
    }) : allEdges;
    const positions = calculateNodePositions(nodesToShow, edgesToShow);
    const visualNodes = nodesToShow.map((node) => {
      const typeInfo = getNodeTypeInfo(node.template, node.config);
      const position = positions[node.id] || { x: 100, y: 100 };
      const wasExecuted = executionPath.includes(node.id);
      let nodeColor = typeInfo.color;
      let borderStyle = `2px solid ${typeInfo.color}`;
      let nodeIcon = typeInfo.icon;
      if (executionPath.length > 0) {
        if (wasExecuted) {
          nodeColor = typeInfo.color;
          borderStyle = `3px solid #00ff00`;
          nodeIcon = `✅ ${typeInfo.icon}`;
        } else {
          nodeColor = "#cccccc";
          borderStyle = `2px solid #cccccc`;
          nodeIcon = `⚪ ${typeInfo.icon}`;
        }
      }
      return {
        id: node.id,
        type: "default",
        position,
        data: {
          label: node.id,
          color: nodeColor,
          nodeType: typeInfo.type,
          template: node.template,
          config: node.config,
          icon: nodeIcon,
          executed: wasExecuted
        },
        style: `background-color: ${nodeColor}; color: ${wasExecuted ? "white" : "#666"}; border: ${borderStyle}; border-radius: 8px; padding: 10px; min-width: 150px; ${wasExecuted ? "box-shadow: 0 0 10px rgba(0,255,0,0.5);" : "opacity: 0.7;"}`
      };
    });
    const visualEdges = [];
    if (config.edges) {
      config.edges.forEach((edge, index) => {
        if (!showExecutionOnly || executionPath.includes(edge.from) && executionPath.includes(edge.to)) {
          const wasUsed = executionPath.includes(edge.from) && executionPath.includes(edge.to);
          visualEdges.push({
            id: `edge-${index}`,
            source: edge.from,
            target: edge.to,
            type: "smoothstep",
            animated: wasUsed,
            style: wasUsed ? "stroke: #00ff00; stroke-width: 3px;" : "stroke: #cccccc; stroke-width: 2px;",
            label: edge.condition || ""
          });
        }
      });
    }
    if (config.conditional_edges) {
      config.conditional_edges.forEach((condEdge) => {
        Object.entries(condEdge.routing_map).forEach(([condition, target], index) => {
          if (!showExecutionOnly || executionPath.includes(condEdge.from) && executionPath.includes(target)) {
            const wasUsed = executionPath.includes(condEdge.from) && executionPath.includes(target);
            visualEdges.push({
              id: `cond-edge-${condEdge.from}-${target}-${index}`,
              source: condEdge.from,
              target,
              type: "smoothstep",
              animated: wasUsed,
              style: wasUsed ? "stroke: #00ff00; stroke-width: 3px;" : "stroke: #FF6B6B; stroke-width: 2px;",
              label: condition
            });
          }
        });
      });
    }
    return { nodes: visualNodes, edges: visualEdges };
  } catch (err) {
    throw new Error(`Failed to parse agent configuration: ${err.message}`);
  }
};
const extractExecutionPath = (executionData) => {
  const path = [];
  if (!executionData || executionData.length === 0) {
    return path;
  }
  console.log("🔍 Extracting execution path from events:", executionData);
  for (const event of executionData) {
    console.log("📝 Processing event:", event.type, event);
    if (event.node_id && !path.includes(event.node_id)) {
      path.push(event.node_id);
      console.log("✅ Added node from node_id:", event.node_id);
    }
    if (event.data) {
      const nodeFields = ["current_node", "node_id", "node", "executing_node"];
      for (const field of nodeFields) {
        if (event.data[field] && !path.includes(event.data[field])) {
          path.push(event.data[field]);
          console.log(`✅ Added node from data.${field}:`, event.data[field]);
        }
      }
    }
    if (event.type === "execution_chunk") {
      if (event.step || event.stage) {
        const stepNode = event.step || event.stage;
        if (typeof stepNode === "string" && !path.includes(stepNode)) {
          path.push(stepNode);
          console.log("✅ Added node from step/stage:", stepNode);
        }
      }
    }
  }
  if (path.length === 0 && executionData.some((e) => e.type === "session_start")) {
    path.push("__start__");
    console.log("✅ Added default start node");
  }
  if (executionData.some((e) => e.type === "execution_complete") && !path.includes("__end__")) {
    path.push("__end__");
    console.log("✅ Added end node from completion");
  }
  console.log("🎯 Final execution path:", path);
  return path;
};
function updateInlineGraph(agent, executionData = []) {
  try {
    const executionPath = extractExecutionPath(executionData);
    const { nodes: parsedNodes, edges: parsedEdges } = parseAgentConfig(agent.full_config, executionPath, false);
    return {
      nodes: parsedNodes,
      edges: parsedEdges,
      error: null,
      executionPath
    };
  } catch (err) {
    return {
      nodes: [],
      edges: [],
      error: err.message,
      executionPath: []
    };
  }
}
AgentGraphModal[FILENAME] = "src/lib/components/AgentGraphModal.svelte";
function AgentGraphModal($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let isOpen = fallback($$props["isOpen"], false);
      let agent = fallback($$props["agent"], null);
      let onClose = $$props["onClose"];
      let executionPath = fallback($$props["executionPath"], () => [], true);
      let executionData = fallback($$props["executionData"], () => [], true);
      let nodes = [];
      let edges = [];
      let error = null;
      let showExecutionOnly = false;
      const getNodeTypeInfo2 = (template, config) => {
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
          "core.ToolNode": {
            type: "default",
            color: "#FF9800",
            icon: "🔧",
            label: "Tool"
          },
          "__start__": {
            type: "input",
            color: "#9C27B0",
            icon: "▶️",
            label: "Start"
          },
          "__end__": {
            type: "output",
            color: "#F44336",
            icon: "⏹️",
            label: "End"
          }
        };
        return typeMap[template] || {
          type: "default",
          color: "#607D8B",
          icon: "📦",
          label: "Custom Node"
        };
      };
      const calculateNodePositions2 = (nodes2, edges2) => {
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
          const levelNum = level;
          if (!levelGroups[levelNum]) levelGroups[levelNum] = [];
          levelGroups[levelNum].push(nodeId);
        });
        Object.entries(levelGroups).forEach(([level, nodeIds]) => {
          const levelNum = parseInt(level);
          const yPos = levelNum * 200 + 100;
          const xSpacing = 300;
          const nodeArray = nodeIds;
          const startX = -(nodeArray.length - 1) * xSpacing / 2 + 400;
          nodeArray.forEach((nodeId, index) => {
            positions[nodeId] = { x: startX + index * xSpacing, y: yPos };
          });
        });
        return positions;
      };
      const parseAgentConfig2 = (config, executionPath2 = [], showExecutionOnly2 = false) => {
        try {
          if (!config || typeof config !== "object") {
            throw new Error("Invalid agent configuration");
          }
          const parsedNodes = [];
          const parsedEdges = [];
          const nodeIds = config.nodes?.map((n) => n.id) || [];
          const hasStart = nodeIds.includes("__start__") || config.edges?.some((e) => e.from === "__start__");
          const hasEnd = nodeIds.includes("__end__") || config.edges?.some((e) => e.to === "__end__") || config.conditional_edges?.some((ce) => Object.values(ce.routing_map).includes("__end__"));
          if (hasStart && !nodeIds.includes("__start__")) {
            parsedNodes.push({ id: "__start__", template: "__start__", config: {} });
          }
          if (hasEnd && !nodeIds.includes("__end__")) {
            parsedNodes.push({ id: "__end__", template: "__end__", config: {} });
          }
          if (config.nodes) {
            parsedNodes.push(...config.nodes);
          }
          const nodesToShow = showExecutionOnly2 ? parsedNodes.filter((node) => executionPath2.includes(node.id)) : parsedNodes;
          const allEdges = [
            ...config.edges?.map((e) => ({ source: e.from, target: e.to })) || [],
            ...config.conditional_edges?.flatMap((ce) => Object.entries(ce.routing_map).map(([condition, target]) => ({ source: ce.from, target, condition }))) || []
          ];
          const edgesToShow = showExecutionOnly2 ? allEdges.filter((edge) => {
            const sourceExecuted = executionPath2.includes(edge.source);
            const targetExecuted = executionPath2.includes(edge.target);
            return sourceExecuted && targetExecuted;
          }) : allEdges;
          const positions = calculateNodePositions2(nodesToShow, edgesToShow);
          const visualNodes = nodesToShow.map((node) => {
            const typeInfo = getNodeTypeInfo2(node.template, node.config);
            const position = positions[node.id] || { x: 100, y: 100 };
            const wasExecuted = executionPath2.includes(node.id);
            const additionalFields = [];
            if (node.config) {
              Object.entries(node.config).forEach(([key2, value]) => {
                if (key2 !== "target" && typeof value !== "object") {
                  additionalFields.push({
                    name: key2,
                    value: String(value).length > 30 ? String(value).substring(0, 30) + "..." : String(value)
                  });
                }
              });
            }
            let nodeColor = typeInfo.color;
            let borderStyle = `2px solid ${typeInfo.color}`;
            let nodeIcon = typeInfo.icon;
            if (executionPath2.length > 0) {
              if (wasExecuted) {
                nodeColor = typeInfo.color;
                borderStyle = `3px solid #00ff00`;
                nodeIcon = `✅ ${typeInfo.icon}`;
              } else {
                nodeColor = "#cccccc";
                borderStyle = `2px solid #cccccc`;
                nodeIcon = `⚪ ${typeInfo.icon}`;
              }
            }
            return {
              id: node.id,
              type: "default",
              position,
              data: {
                label: node.id,
                color: nodeColor,
                nodeType: typeInfo.type,
                fields: additionalFields,
                template: node.template,
                config: node.config,
                icon: nodeIcon,
                executed: wasExecuted
              },
              style: `background-color: ${nodeColor}; color: ${wasExecuted ? "white" : "black"}; border: ${borderStyle}; border-radius: 8px; padding: 10px; min-width: 150px; ${wasExecuted ? "box-shadow: 0 0 10px rgba(0,255,0,0.5);" : "opacity: 0.7;"}`
            };
          });
          const visualEdges = [];
          if (config.edges) {
            config.edges.forEach((edge, index) => {
              if (!showExecutionOnly2 || executionPath2.includes(edge.from) && executionPath2.includes(edge.to)) {
                const wasUsed = executionPath2.includes(edge.from) && executionPath2.includes(edge.to);
                visualEdges.push({
                  id: `edge-${index}`,
                  source: edge.from,
                  target: edge.to,
                  type: "smoothstep",
                  animated: wasUsed,
                  style: wasUsed ? "stroke: #00ff00; stroke-width: 3px;" : "stroke: #cccccc; stroke-width: 2px;",
                  label: edge.condition || ""
                });
              }
            });
          }
          if (config.conditional_edges) {
            config.conditional_edges.forEach((condEdge) => {
              Object.entries(condEdge.routing_map).forEach(([condition, target], index) => {
                if (!showExecutionOnly2 || executionPath2.includes(condEdge.from) && executionPath2.includes(target)) {
                  const wasUsed = executionPath2.includes(condEdge.from) && executionPath2.includes(target);
                  visualEdges.push({
                    id: `cond-edge-${condEdge.from}-${target}-${index}`,
                    source: condEdge.from,
                    target,
                    type: "smoothstep",
                    animated: wasUsed,
                    style: wasUsed ? "stroke: #00ff00; stroke-width: 3px;" : "stroke: #FF6B6B; stroke-width: 2px;",
                    label: condition
                  });
                }
              });
            });
          }
          return { nodes: visualNodes, edges: visualEdges };
        } catch (err) {
          throw new Error(`Failed to parse agent configuration: ${err.message}`);
        }
      };
      const extractExecutionPath2 = (executionData2) => {
        const path = [];
        if (!executionData2 || executionData2.length === 0) {
          return path;
        }
        console.log("🔍 Extracting execution path from events:", executionData2);
        for (const event of executionData2) {
          console.log("📝 Processing event:", event.type, event);
          if (event.node_id && !path.includes(event.node_id)) {
            path.push(event.node_id);
            console.log("✅ Added node from node_id:", event.node_id);
          }
          if (event.data) {
            const nodeFields = ["current_node", "node_id", "node", "executing_node"];
            for (const field of nodeFields) {
              if (event.data[field] && !path.includes(event.data[field])) {
                path.push(event.data[field]);
                console.log(`✅ Added node from data.${field}:`, event.data[field]);
              }
            }
          }
          if (event.type === "execution_chunk") {
            if (event.step || event.stage) {
              const stepNode = event.step || event.stage;
              if (typeof stepNode === "string" && !path.includes(stepNode)) {
                path.push(stepNode);
                console.log("✅ Added node from step/stage:", stepNode);
              }
            }
          }
        }
        if (path.length === 0 && executionData2.some((e) => e.type === "session_start")) {
          path.push("__start__");
          console.log("✅ Added default start node");
        }
        if (executionData2.some((e) => e.type === "execution_complete") && !path.includes("__end__")) {
          path.push("__end__");
          console.log("✅ Added end node from completion");
        }
        console.log("🎯 Final execution path:", path);
        return path;
      };
      if (executionData && executionData.length > 0) {
        executionPath = extractExecutionPath2(executionData);
      }
      if (agent && isOpen) {
        try {
          error = null;
          const { nodes: parsedNodes, edges: parsedEdges } = parseAgentConfig2(agent.full_config, executionPath, showExecutionOnly);
          nodes = parsedNodes;
          edges = parsedEdges;
        } catch (err) {
          error = err.message;
          nodes = [];
          edges = [];
        }
      }
      Modal($$renderer2, {
        isOpen,
        toggle: onClose,
        size: "xl",
        class: "modal-xl",
        children: prevent_snippet_stringification(($$renderer3) => {
          ModalHeader($$renderer3, {
            toggle: onClose,
            children: prevent_snippet_stringification(($$renderer4) => {
              if (agent) {
                $$renderer4.push("<!--[-->");
                $$renderer4.push(`<i class="bi bi-diagram-3 me-2">`);
                push_element($$renderer4, "i", 296, 3);
                $$renderer4.push(`</i>`);
                pop_element();
                $$renderer4.push(`Agent Graph: ${escape_html(agent.graph_name)}`);
              } else {
                $$renderer4.push("<!--[!-->");
                $$renderer4.push(`Agent Graph`);
              }
              $$renderer4.push(`<!--]-->`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          ModalBody($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              if (agent) {
                $$renderer4.push("<!--[-->");
                Container($$renderer4, {
                  fluid: true,
                  children: prevent_snippet_stringification(($$renderer5) => {
                    Row($$renderer5, {
                      class: "mb-3",
                      children: prevent_snippet_stringification(($$renderer6) => {
                        Col($$renderer6, {
                          children: prevent_snippet_stringification(($$renderer7) => {
                            Card($$renderer7, {
                              children: prevent_snippet_stringification(($$renderer8) => {
                                CardBody($$renderer8, {
                                  class: "py-2",
                                  children: prevent_snippet_stringification(($$renderer9) => {
                                    $$renderer9.push(`<div class="d-flex justify-content-between align-items-center">`);
                                    push_element($$renderer9, "div", 308, 8);
                                    $$renderer9.push(`<div>`);
                                    push_element($$renderer9, "div", 309, 9);
                                    $$renderer9.push(`<h6 class="mb-1">`);
                                    push_element($$renderer9, "h6", 310, 10);
                                    $$renderer9.push(`${escape_html(agent.graph_name)}</h6>`);
                                    pop_element();
                                    $$renderer9.push(` <small class="text-muted">`);
                                    push_element($$renderer9, "small", 311, 10);
                                    $$renderer9.push(`${escape_html(agent.description)}</small>`);
                                    pop_element();
                                    $$renderer9.push(`</div>`);
                                    pop_element();
                                    $$renderer9.push(` <div class="d-flex gap-2">`);
                                    push_element($$renderer9, "div", 313, 9);
                                    Badge($$renderer9, {
                                      color: "info",
                                      children: prevent_snippet_stringification(($$renderer10) => {
                                        $$renderer10.push(`<!---->${escape_html(nodes.length)} nodes`);
                                      }),
                                      $$slots: { default: true }
                                    });
                                    $$renderer9.push(`<!----> `);
                                    Badge($$renderer9, {
                                      color: "secondary",
                                      children: prevent_snippet_stringification(($$renderer10) => {
                                        $$renderer10.push(`<!---->${escape_html(edges.length)} edges`);
                                      }),
                                      $$slots: { default: true }
                                    });
                                    $$renderer9.push(`<!----> `);
                                    if (executionPath.length > 0) {
                                      $$renderer9.push("<!--[-->");
                                      Badge($$renderer9, {
                                        color: "success",
                                        children: prevent_snippet_stringification(($$renderer10) => {
                                          $$renderer10.push(`<!---->${escape_html(executionPath.length)} executed`);
                                        }),
                                        $$slots: { default: true }
                                      });
                                    } else {
                                      $$renderer9.push("<!--[!-->");
                                    }
                                    $$renderer9.push(`<!--]--></div>`);
                                    pop_element();
                                    $$renderer9.push(`</div>`);
                                    pop_element();
                                    $$renderer9.push(` `);
                                    if (executionPath.length > 0) {
                                      $$renderer9.push("<!--[-->");
                                      $$renderer9.push(`<div class="mt-2">`);
                                      push_element($$renderer9, "div", 322, 9);
                                      $$renderer9.push(`<div class="form-check">`);
                                      push_element($$renderer9, "div", 323, 10);
                                      $$renderer9.push(`<input class="form-check-input" type="checkbox"${attr("checked", showExecutionOnly, true)} id="showExecutionOnly"/>`);
                                      push_element($$renderer9, "input", 324, 11);
                                      pop_element();
                                      $$renderer9.push(` <label class="form-check-label" for="showExecutionOnly">`);
                                      push_element($$renderer9, "label", 330, 11);
                                      $$renderer9.push(`Show only executed nodes and edges</label>`);
                                      pop_element();
                                      $$renderer9.push(`</div>`);
                                      pop_element();
                                      $$renderer9.push(`</div>`);
                                      pop_element();
                                    } else {
                                      $$renderer9.push("<!--[!-->");
                                    }
                                    $$renderer9.push(`<!--]-->`);
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
                    $$renderer5.push(`<!----> `);
                    if (executionPath.length > 0) {
                      $$renderer5.push("<!--[-->");
                      Row($$renderer5, {
                        class: "mb-3",
                        children: prevent_snippet_stringification(($$renderer6) => {
                          Col($$renderer6, {
                            children: prevent_snippet_stringification(($$renderer7) => {
                              Card($$renderer7, {
                                children: prevent_snippet_stringification(($$renderer8) => {
                                  CardBody($$renderer8, {
                                    class: "py-2",
                                    children: prevent_snippet_stringification(($$renderer9) => {
                                      $$renderer9.push(`<h6 class="mb-2">`);
                                      push_element($$renderer9, "h6", 346, 9);
                                      $$renderer9.push(`<i class="bi bi-play-circle me-2">`);
                                      push_element($$renderer9, "i", 347, 10);
                                      $$renderer9.push(`</i>`);
                                      pop_element();
                                      $$renderer9.push(` Execution Summary</h6>`);
                                      pop_element();
                                      $$renderer9.push(` <div class="row">`);
                                      push_element($$renderer9, "div", 350, 9);
                                      $$renderer9.push(`<div class="col-md-6">`);
                                      push_element($$renderer9, "div", 351, 10);
                                      $$renderer9.push(`<small class="text-muted d-block">`);
                                      push_element($$renderer9, "small", 352, 11);
                                      $$renderer9.push(`Execution Path:</small>`);
                                      pop_element();
                                      $$renderer9.push(` <div class="d-flex flex-wrap gap-1">`);
                                      push_element($$renderer9, "div", 353, 11);
                                      $$renderer9.push(`<!--[-->`);
                                      const each_array = ensure_array_like(executionPath);
                                      for (let index = 0, $$length = each_array.length; index < $$length; index++) {
                                        let nodeId = each_array[index];
                                        Badge($$renderer9, {
                                          color: "success",
                                          class: "small",
                                          children: prevent_snippet_stringification(($$renderer10) => {
                                            $$renderer10.push(`<!---->${escape_html(index + 1)}. ${escape_html(nodeId)}`);
                                          }),
                                          $$slots: { default: true }
                                        });
                                        $$renderer9.push(`<!----> `);
                                        if (index < executionPath.length - 1) {
                                          $$renderer9.push("<!--[-->");
                                          $$renderer9.push(`<i class="bi bi-arrow-right text-muted small align-self-center">`);
                                          push_element($$renderer9, "i", 359, 14);
                                          $$renderer9.push(`</i>`);
                                          pop_element();
                                        } else {
                                          $$renderer9.push("<!--[!-->");
                                        }
                                        $$renderer9.push(`<!--]-->`);
                                      }
                                      $$renderer9.push(`<!--]--></div>`);
                                      pop_element();
                                      $$renderer9.push(`</div>`);
                                      pop_element();
                                      $$renderer9.push(` <div class="col-md-6">`);
                                      push_element($$renderer9, "div", 364, 10);
                                      $$renderer9.push(`<small class="text-muted d-block">`);
                                      push_element($$renderer9, "small", 365, 11);
                                      $$renderer9.push(`Execution Events:</small>`);
                                      pop_element();
                                      $$renderer9.push(` <div class="d-flex flex-wrap gap-1">`);
                                      push_element($$renderer9, "div", 366, 11);
                                      $$renderer9.push(`<!--[-->`);
                                      const each_array_1 = ensure_array_like(executionData.filter((e) => [
                                        "session_start",
                                        "execution_chunk",
                                        "interrupt",
                                        "execution_complete",
                                        "error"
                                      ].includes(e.type)));
                                      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
                                        let event = each_array_1[$$index_1];
                                        Badge($$renderer9, {
                                          color: event.type === "session_start" ? "primary" : event.type === "execution_chunk" ? "info" : event.type === "interrupt" ? "warning" : event.type === "execution_complete" ? "success" : "danger",
                                          class: "small",
                                          children: prevent_snippet_stringification(($$renderer10) => {
                                            $$renderer10.push(`<!---->${escape_html(event.type)}`);
                                          }),
                                          $$slots: { default: true }
                                        });
                                      }
                                      $$renderer9.push(`<!--]--></div>`);
                                      pop_element();
                                      $$renderer9.push(`</div>`);
                                      pop_element();
                                      $$renderer9.push(`</div>`);
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
                    } else {
                      $$renderer5.push("<!--[!-->");
                    }
                    $$renderer5.push(`<!--]--> `);
                    if (error) {
                      $$renderer5.push("<!--[-->");
                      Row($$renderer5, {
                        class: "mb-3",
                        children: prevent_snippet_stringification(($$renderer6) => {
                          Col($$renderer6, {
                            children: prevent_snippet_stringification(($$renderer7) => {
                              Alert($$renderer7, {
                                color: "danger",
                                children: prevent_snippet_stringification(($$renderer8) => {
                                  $$renderer8.push(`<i class="bi bi-exclamation-triangle me-2">`);
                                  push_element($$renderer8, "i", 391, 8);
                                  $$renderer8.push(`</i>`);
                                  pop_element();
                                  $$renderer8.push(` Error parsing agent configuration: ${escape_html(error)}`);
                                }),
                                $$slots: { default: true }
                              });
                            }),
                            $$slots: { default: true }
                          });
                        }),
                        $$slots: { default: true }
                      });
                    } else if (nodes.length > 0) {
                      $$renderer5.push("<!--[1-->");
                      Row($$renderer5, {
                        children: prevent_snippet_stringification(($$renderer6) => {
                          Col($$renderer6, {
                            children: prevent_snippet_stringification(($$renderer7) => {
                              $$renderer7.push(`<div style="height: 500px; width: 100%; border: 1px solid #dee2e6; border-radius: 0.375rem;">`);
                              push_element($$renderer7, "div", 399, 7);
                              SvelteFlow($$renderer7, {
                                nodes,
                                edges,
                                fitView: true,
                                children: prevent_snippet_stringification(($$renderer8) => {
                                  Controls($$renderer8, {});
                                  $$renderer8.push(`<!----> `);
                                  Background($$renderer8, {});
                                  $$renderer8.push(`<!----> `);
                                  Minimap($$renderer8, {});
                                  $$renderer8.push(`<!----> `);
                                  Panel($$renderer8, {
                                    position: "top-right",
                                    children: prevent_snippet_stringification(($$renderer9) => {
                                      $$renderer9.push(`<div class="bg-white p-2 rounded shadow-sm">`);
                                      push_element($$renderer9, "div", 405, 10);
                                      $$renderer9.push(`<small class="text-muted">`);
                                      push_element($$renderer9, "small", 406, 11);
                                      $$renderer9.push(`<i class="bi bi-info-circle me-1">`);
                                      push_element($$renderer9, "i", 407, 12);
                                      $$renderer9.push(`</i>`);
                                      pop_element();
                                      $$renderer9.push(` Use mouse wheel to zoom, drag to pan</small>`);
                                      pop_element();
                                      $$renderer9.push(` `);
                                      if (executionPath.length > 0) {
                                        $$renderer9.push("<!--[-->");
                                        $$renderer9.push(`<hr class="my-2"/>`);
                                        push_element($$renderer9, "hr", 411, 12);
                                        pop_element();
                                        $$renderer9.push(` <div class="mb-1">`);
                                        push_element($$renderer9, "div", 412, 12);
                                        $$renderer9.push(`<small class="text-success">`);
                                        push_element($$renderer9, "small", 413, 13);
                                        $$renderer9.push(`<i class="bi bi-check-circle me-1">`);
                                        push_element($$renderer9, "i", 414, 14);
                                        $$renderer9.push(`</i>`);
                                        pop_element();
                                        $$renderer9.push(` <strong>`);
                                        push_element($$renderer9, "strong", 415, 14);
                                        $$renderer9.push(`Executed</strong>`);
                                        pop_element();
                                        $$renderer9.push(`</small>`);
                                        pop_element();
                                        $$renderer9.push(`</div>`);
                                        pop_element();
                                        $$renderer9.push(` <div class="mb-1">`);
                                        push_element($$renderer9, "div", 418, 12);
                                        $$renderer9.push(`<small class="text-muted">`);
                                        push_element($$renderer9, "small", 419, 13);
                                        $$renderer9.push(`<i class="bi bi-circle me-1">`);
                                        push_element($$renderer9, "i", 420, 14);
                                        $$renderer9.push(`</i>`);
                                        pop_element();
                                        $$renderer9.push(` Not executed</small>`);
                                        pop_element();
                                        $$renderer9.push(`</div>`);
                                        pop_element();
                                        $$renderer9.push(` <div>`);
                                        push_element($$renderer9, "div", 424, 12);
                                        $$renderer9.push(`<small class="text-success">`);
                                        push_element($$renderer9, "small", 425, 13);
                                        $$renderer9.push(`<i class="bi bi-arrow-right me-1">`);
                                        push_element($$renderer9, "i", 426, 14);
                                        $$renderer9.push(`</i>`);
                                        pop_element();
                                        $$renderer9.push(` Used paths</small>`);
                                        pop_element();
                                        $$renderer9.push(`</div>`);
                                        pop_element();
                                      } else {
                                        $$renderer9.push("<!--[!-->");
                                      }
                                      $$renderer9.push(`<!--]--></div>`);
                                      pop_element();
                                    }),
                                    $$slots: { default: true }
                                  });
                                  $$renderer8.push(`<!---->`);
                                }),
                                $$slots: { default: true }
                              });
                              $$renderer7.push(`<!----></div>`);
                              pop_element();
                            }),
                            $$slots: { default: true }
                          });
                        }),
                        $$slots: { default: true }
                      });
                    } else {
                      $$renderer5.push("<!--[!-->");
                      Row($$renderer5, {
                        children: prevent_snippet_stringification(($$renderer6) => {
                          Col($$renderer6, {
                            children: prevent_snippet_stringification(($$renderer7) => {
                              Alert($$renderer7, {
                                color: "warning",
                                children: prevent_snippet_stringification(($$renderer8) => {
                                  $$renderer8.push(`<i class="bi bi-exclamation-triangle me-2">`);
                                  push_element($$renderer8, "i", 441, 8);
                                  $$renderer8.push(`</i>`);
                                  pop_element();
                                  $$renderer8.push(` No nodes found in agent configuration. The agent may not be properly configured.`);
                                }),
                                $$slots: { default: true }
                              });
                            }),
                            $$slots: { default: true }
                          });
                        }),
                        $$slots: { default: true }
                      });
                    }
                    $$renderer5.push(`<!--]-->`);
                  }),
                  $$slots: { default: true }
                });
              } else {
                $$renderer4.push("<!--[!-->");
                $$renderer4.push(`<div class="text-center py-4">`);
                push_element($$renderer4, "div", 449, 3);
                $$renderer4.push(`<i class="bi bi-diagram-3 text-muted" style="font-size: 3rem;">`);
                push_element($$renderer4, "i", 450, 4);
                $$renderer4.push(`</i>`);
                pop_element();
                $$renderer4.push(` <p class="text-muted mt-2">`);
                push_element($$renderer4, "p", 451, 4);
                $$renderer4.push(`No agent selected</p>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
              }
              $$renderer4.push(`<!--]-->`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          ModalFooter($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              Button($$renderer4, {
                color: "secondary",
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<!---->Close`);
                }),
                $$slots: { default: true }
              });
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!---->`);
        }),
        $$slots: { default: true }
      });
      bind_props($$props, { isOpen, agent, onClose, executionPath, executionData });
    },
    AgentGraphModal
  );
}
AgentGraphModal.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
const defaultAgents = [
  {
    graph_name: "agentic_flow",
    description: "A simple agentic workflow that conditionally calls a tool based on user input.",
    running: false,
    full_config: {
      graph_name: "agentic_flow",
      description: "A simple agentic workflow that conditionally calls a tool based on user input.",
      state_schema: {
        messages: {
          type: "List[Any]",
          default: []
        },
        test_field: {
          type: "str",
          default: "This is a test field."
        }
      },
      nodes: [
        {
          id: "human_input_node",
          template: "core.HumanInputNode",
          config: {
            targets_prompts: {
              messages: "Input your initial message or question:",
              test_field: "This is a test field. You can modify it if needed."
            }
          }
        },
        {
          id: "llm_node",
          template: "core.LLMToolNode",
          config: {
            prompt: "{messages}\nYou are a helpful assistant. Respond to the user input. Use tools if necessary.\n\n",
            llm_id: "openai",
            target: "messages",
            tool_names: [
              "tool_brave_image_search_post",
              "tool_brave_web_search_post",
              "tool_brave_local_search_post",
              "tool_brave_news_search_post",
              "tool_brave_video_search_post"
            ]
          }
        },
        {
          id: "tool_node",
          template: "core.ToolNode",
          config: {
            target: "messages",
            tool_names: [
              "tool_brave_image_search_post",
              "tool_brave_web_search_post",
              "tool_brave_local_search_post",
              "tool_brave_news_search_post",
              "tool_brave_video_search_post"
            ]
          }
        }
      ],
      edges: [
        { from: "__start__", to: "human_input_node" },
        { from: "human_input_node", to: "llm_node" },
        { from: "tool_node", to: "llm_node" }
      ],
      conditional_edges: [
        {
          from: "llm_node",
          target: "messages",
          routing_map: {
            tool_call: "tool_node",
            no_tool_call: "__end__"
          }
        }
      ],
      llms: [
        {
          id: "openai",
          type: "AzureOpenAI",
          description: "Azure OpenAI GPT-4o model",
          config: {
            azure_endpoint: "AZURE_ENDPOINT",
            api_key: "AZURE_API_KEY",
            api_version: "2024-08-01-preview",
            azure_deployment: "gpt-4o",
            model_version: "gpt-4o-2024-11-20"
          }
        }
      ],
      tool_config: {
        brave_web_search: {
          url: "https://hpcsiaipoc-fastmcp.azurewebsites.net/mcp",
          transport: "streamable_http"
        }
      }
    }
  },
  {
    graph_name: "basic_summarizer",
    description: "A simple agent to summarize provided text.",
    running: false,
    full_config: {
      graph_name: "summarization_flow",
      description: "Summarizes input text.",
      nodes: [
        {
          id: "summarize_node",
          template: "llm_prompt_node",
          config: {
            prompt: "Summarize the following text: {text_input}\n\nSummary:",
            llm_id: "openai_summary",
            target: "summary_output"
          }
        }
      ],
      llms: [
        {
          id: "openai_summary",
          type: "AzureOpenAI",
          description: "Azure OpenAI for summarization",
          config: {
            azure_endpoint: "YOUR_AZURE_OPENAI_ENDPOINT",
            api_key: "YOUR_AZURE_OPENAI_API_KEY",
            api_version: "2024-08-01-preview",
            azure_deployment: "gpt-35-turbo",
            model_version: "gpt-3.5-turbo"
          }
        }
      ],
      edges: [{ from: "__start__", to: "summarize_node" }]
    }
  },
  {
    graph_name: "pcp_member_match",
    description: "A workflow for matching members with providers based on various criteria.",
    running: false,
    full_config: {
      graph_name: "data_intake_workflow",
      description: "A simplified workflow focusing on the Data Intake phase: parallel provider database query and member data input collection.",
      state_schema: {
        messages: { type: "List[Any]", default: [] },
        provider_data: { type: "dict", default: {} },
        group_key: { type: "str", default: "" },
        member_id: { type: "str", default: "" },
        member_first_name: { type: "str", default: "" },
        member_last_name: { type: "str", default: "" },
        member_date_of_birth: { type: "str", default: "" },
        member_requirements: { type: "str", default: "" },
        member_location: { type: "str", default: "" },
        member_zip_code: { type: "str", default: "" },
        member_cultural_preferences: { type: "str", default: "" },
        member_clinical_needs: { type: "str", default: "" },
        member_insurance: { type: "str", default: "" },
        member_urgency: { type: "str", default: "" },
        member_contact: { type: "str", default: "" },
        raw_member_data: { type: "dict", default: {} },
        provider_validation_status: { type: "str", default: "pending" },
        member_profile_analysis: { type: "str", default: "pending" },
        phase2_validation_result: { type: "str", default: "pending" },
        phase2_completion_status: { type: "str", default: "pending" },
        matching_phase_initiated: { type: "str", default: "pending" },
        matching_start_timestamp: { type: "str", default: "" },
        data_error_status: { type: "str", default: "pending" },
        availability_score: { type: "float", default: 0 },
        cultural_match_score: { type: "float", default: 0 },
        clinical_compatibility_score: { type: "float", default: 0 },
        geographical_match_score: { type: "float", default: 0 },
        match_evaluation_result: { type: "str", default: "pending" },
        matched_provider_ids: { type: "List[Any]", default: [] },
        match_scores: { type: "List[Any]", default: [] },
        match_details: { type: "List[Any]", default: [] },
        best_match_score: { type: "float", default: 0 },
        assignment_status: { type: "str", default: "pending" },
        conflict_status: { type: "str", default: "pending" },
        notification_status: { type: "str", default: "pending" },
        special_case_status: { type: "str", default: "pending" },
        special_case_retry_count: { type: "int", default: 0 },
        qa_status: { type: "str", default: "pending" },
        feedback_status: { type: "str", default: "pending" },
        feedback_notes: { type: "str", default: "" }
      },
      nodes: [
        {
          id: "member_data_input_node",
          template: "provider_member_match.MemberDataInputNode",
          config: {
            member_first_name: { target: "member_first_name", prompt: "Please enter your member first name:" },
            member_last_name: { target: "member_last_name", prompt: "Please enter your member last name:" },
            member_date_of_birth: { target: "member_date_of_birth", prompt: "Please enter your member date of birth (MM-DD-YYYY):" },
            member_id: { target: "member_id", prompt: "Please enter your member ID:" },
            member_name: { target: "member_name", prompt: "Please enter your member name:" },
            member_requirements: { target: "member_requirements", prompt: "Please enter your member requirements:" },
            member_location: { target: "member_location", prompt: "Please enter your member location (optional):" },
            member_cultural_preferences: { target: "member_cultural_preferences", prompt: "Please enter your member cultural preferences (optional):" },
            member_clinical_needs: { target: "member_clinical_needs", prompt: "Please enter your member clinical needs (optional):" },
            member_insurance: { target: "member_insurance", prompt: "Please enter your member insurance information (optional):" },
            member_urgency: { target: "member_urgency", prompt: "Please enter your member urgency level (optional):" },
            member_contact: { target: "member_contact", prompt: "Please enter your member contact information (optional):" }
          }
        },
        {
          id: "llm_member_data_node",
          template: "core.LLMToolNode",
          config: {
            prompt: "You are a healthcare data specialist tasked with retrieving member information from a healthcare database.\n\nBased on the provided member information:\n- Member Last Name: {member_last_name}\n- Member Date of Birth: {member_date_of_birth}\n- Member ID: {member_id}\n\nYour task is to:\n1. Use the available member search tools to find comprehensive member information\n2. Search for member demographics, address, and group membership details\n3. Ensure you retrieve the member's group key and zip code as these will be needed for provider matching\n\nPlease use the member_search tool with the provided member information. Focus on retrieving:\n- Group membership information (GRGR_ID)\n- Current address and zip code (SBAD_ZIP)\n- Complete member profile data\n\nExecute the member search now using the last name and date of birth.",
            target: ["messages"],
            llm_id: "openai",
            tool_names: ["member_search"]
          }
        },
        {
          id: "llm_provider_data_node",
          template: "core.LLMToolNode",
          config: {
            prompt: "You are a healthcare network specialist tasked with finding suitable healthcare providers for a member.\n\nBased on the member information retrieved from the previous step:\n- Group Key: {group_key}\n- Member Zip Code: {member_zip_code}\n- Member Location: {member_location}\n- Member Clinical Needs: {member_clinical_needs}\n- Member Cultural Preferences: {member_cultural_preferences}\n\nYour task is to:\n1. Use the available provider search tools to find providers in the member's network\n2. Search for providers that match the member's geographic location and group membership\n3. Focus on providers that can meet the member's clinical and cultural needs\n\nPlease use the provider_search tool with the group key and zip code from the member data. Focus on retrieving:\n- Network providers within the member's group\n- Providers in or near the member's zip code\n- Provider specialties, languages, and availability\n- Complete provider profile data for matching\n\nExecute the provider search now using the group key and member zip code.",
            target: ["messages"],
            llm_id: "openai",
            tool_names: ["provider_search"]
          }
        },
        {
          id: "provider_data_validation_node",
          template: "provider_member_match.ProviderDataValidationNode",
          config: {
            required_fields: [
              "PRPR_ID",
              "PRPR_NAME",
              "PRPR_MCTR_TYPE",
              "PRPR_MCTR_TYPE_DESC",
              "PRCF_MCTR_SPEC_DESC",
              "PRCF_MCTR_SPEC2_DESC",
              "PRPR_MCTR_LANG_DESC",
              "PRAD_ADDR1",
              "PRAD_CITY",
              "PRAD_STATE",
              "PRAD_ZIP"
            ],
            target: "provider_validation_status"
          }
        },
        {
          id: "member_profile_analysis_node",
          template: "provider_member_match.MemberProfileAnalysisNode",
          config: {
            required_fields: ["group_key", "member_zip_code", "member_location"],
            target: "member_profile_analysis"
          }
        },
        {
          id: "data_error_handler_node",
          template: "provider_member_match.DataErrorHandlerNode",
          config: {
            error_mode: "strict",
            target: "data_error_status"
          }
        },
        {
          id: "availability_check_node",
          template: "provider_member_match.AvailabilityCheckNode",
          config: {
            target: "availability_score",
            criteria: { require_weekend_availability: true }
          }
        },
        {
          id: "cultural_matching_node",
          template: "provider_member_match.CulturalMatchingNode",
          config: {
            target: "cultural_match_score",
            llm_id: "openai"
          }
        },
        {
          id: "clinical_compatibility_node",
          template: "provider_member_match.ClinicalCompatibilityNode",
          config: {
            target: "clinical_compatibility_score",
            llm_id: "openai"
          }
        },
        {
          id: "geographical_matching_node",
          template: "provider_member_match.GeographicalMatchingNode",
          config: {
            target: "geographical_match_score"
          }
        },
        {
          id: "match_evaluation_node",
          template: "provider_member_match.MatchEvaluationNode",
          config: {
            target: "match_evaluation_result",
            required_matches: ["availability_score", "clinical_compatibility_score"],
            optional_matches: ["cultural_match_score", "geographical_match_score"]
          }
        },
        {
          id: "phase2_validation_decision_node",
          template: "provider_member_match.Phase2ValidationDecisionNode",
          config: {
            phase_name: "Phase2_DataPreparation",
            required_inputs: ["provider_validation_status", "member_profile_analysis"],
            target: "phase2_validation_result"
          }
        },
        {
          id: "matching_coordinator_node",
          template: "provider_member_match.MatchingCoordinatorNode",
          config: {
            target: "matching_phase_initiated"
          }
        },
        {
          id: "pcp_assignment_node",
          template: "provider_member_match.PCPAssignmentNode",
          config: {
            target: "assignment_status"
          }
        },
        {
          id: "conflict_resolution_node",
          template: "provider_member_match.ConflictResolutionNode",
          config: {
            target: "conflict_status"
          }
        },
        {
          id: "member_notification_node",
          template: "provider_member_match.MemberNotificationNode",
          config: {
            target: "notification_status"
          }
        },
        {
          id: "special_case_handler_node",
          template: "provider_member_match.SpecialCaseHandlerNode",
          config: {
            target: "special_case_status"
          }
        },
        {
          id: "qa_analysis_node",
          template: "provider_member_match.QAAnalysisNode",
          config: {
            target: "qa_status"
          }
        },
        {
          id: "feedback_loop_node",
          template: "provider_member_match.FeedbackLoopNode",
          config: {
            target: "feedback_status"
          }
        }
      ],
      edges: [
        { from: "__start__", to: "member_data_input_node" },
        { from: "member_data_input_node", to: "llm_member_data_node" },
        { from: "llm_member_data_node", to: "llm_provider_data_node" },
        { from: "llm_provider_data_node", to: "member_profile_analysis_node" },
        { from: "llm_provider_data_node", to: "provider_data_validation_node" },
        { from: "provider_data_validation_node", to: "phase2_validation_decision_node" },
        { from: "member_profile_analysis_node", to: "phase2_validation_decision_node" },
        { from: "matching_coordinator_node", to: "availability_check_node" },
        { from: "matching_coordinator_node", to: "cultural_matching_node" },
        { from: "matching_coordinator_node", to: "clinical_compatibility_node" },
        { from: "matching_coordinator_node", to: "geographical_matching_node" },
        { from: "availability_check_node", to: "match_evaluation_node" },
        { from: "cultural_matching_node", to: "match_evaluation_node" },
        { from: "clinical_compatibility_node", to: "match_evaluation_node" },
        { from: "geographical_matching_node", to: "match_evaluation_node" },
        { from: "pcp_assignment_node", to: "member_notification_node" },
        { from: "conflict_resolution_node", to: "pcp_assignment_node" },
        { from: "member_notification_node", to: "qa_analysis_node" },
        { from: "qa_analysis_node", to: "feedback_loop_node" },
        { from: "feedback_loop_node", to: "__end__" },
        { from: "data_error_handler_node", to: "__end__" }
      ],
      conditional_edges: [
        {
          from: "phase2_validation_decision_node",
          target: "phase2_validation_result",
          routing_map: {
            validation_passed: "matching_coordinator_node",
            validation_failed: "data_error_handler_node"
          }
        },
        {
          from: "match_evaluation_node",
          target: "match_evaluation_result",
          routing_map: {
            no_suitable_match: "special_case_handler_node",
            suitable_matches_found: "pcp_assignment_node"
          }
        },
        {
          from: "pcp_assignment_node",
          target: "assignment_status",
          routing_map: {
            conflict: "conflict_resolution_node",
            assigned: "member_notification_node",
            no_match: "special_case_handler_node"
          }
        },
        {
          from: "special_case_handler_node",
          target: "special_case_status",
          routing_map: {
            location_updated: "geographical_matching_node",
            max_retries_reached: "__end__"
          }
        }
      ],
      llms: [
        {
          id: "openai",
          type: "AzureOpenAI",
          description: "Azure OpenAI GPT-4o model",
          config: {
            azure_endpoint: "AZURE_OPENAI_ENDPOINT",
            api_key: "AZURE_OPENAI_API_KEY",
            api_version: "2024-08-01-preview",
            azure_deployment: "gpt-4o",
            model_version: "gpt-4o-2024-11-20"
          }
        }
      ],
      tool_config: {
        provider_member_search: {
          url: "https://hpcsiaipoc-fastmcp-2.azurewebsites.net/mcp",
          transport: "streamable_http"
        }
      }
    }
  }
];
class AgentCrudService {
  static CONFIG_API_URL = runtimeConfig.AI_AGENTIC_URL;
  // private static readonly CONFIG_API_URL = 'http://localhost:8000';
  /**
   * Helper method to create a user info object from user store data
   */
  static createUserInfo(user) {
    return {
      username: user?.name,
      email: user?.email
    };
  }
  /**
   * Save agent graph configuration to the backend
   */
  static async saveGraphConfig(userId, graphConfig, description, username, email) {
    try {
      const requestBody = {
        user_id: userId,
        graph_config: graphConfig,
        description,
        username,
        email
      };
      const response = await fetch(`${this.CONFIG_API_URL}/save_graph_config`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();
      if (result.user_created) {
        console.log(`New user created: ${username} (${email}) with ID: ${userId}`);
      }
      if (result.config_ids && result.config_ids.length > 0) {
        result.config_id = result.config_ids[0];
        console.log(`Config saved with config_id: ${result.config_id}`);
      }
      return result;
    } catch (error) {
      console.error("Error saving graph config:", error);
      return {
        status: "error",
        detail: error.message
      };
    }
  }
  /**
   * Retrieve agent graph configurations for a user
   */
  static async getGraphConfigs(userId) {
    try {
      const response = await fetch(`${this.CONFIG_API_URL}/get_graph_configs/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error retrieving graph configs:", error);
      return {
        status: "error",
        detail: error.message
      };
    }
  }
  /**
   * Save an agent configuration with metadata
   */
  static async saveAgent(userId, agent, description, username, email) {
    const configWithId = agent.config_id ? { ...agent.full_config, config_id: agent.config_id } : agent.full_config;
    return this.saveGraphConfig(userId, configWithId, description || agent.description, username, email);
  }
  /**
   * Load saved agents for a user and convert them to the expected format
   */
  static async loadUserAgents(userId) {
    const result = await this.getGraphConfigs(userId);
    console.log("Full backend response:", result);
    console.log("Response status:", result.status);
    console.log("Config dict exists:", !!result.config_dict);
    console.log("Config dict content:", result.config_dict);
    console.log("Config records exists:", !!result.config_records);
    console.log("Config records content:", result.config_records);
    if (result.status !== "success") {
      console.warn("Backend returned non-success status:", result.status, result.detail);
      return [];
    }
    if (result.config_records && Array.isArray(result.config_records)) {
      console.log("Processing config_records to reconstruct individual agents");
      const agentGroups = {};
      result.config_records.forEach((record) => {
        if (!agentGroups[record.config_id]) {
          agentGroups[record.config_id] = [];
        }
        agentGroups[record.config_id].push(record);
      });
      const agents = Object.entries(agentGroups).map(([configIdStr, configs]) => {
        const configId = parseInt(configIdStr);
        let description = "";
        let created_date = "";
        let tool_id;
        const full_config = {};
        configs.forEach((config) => {
          if (config.key && config.value !== null && config.value !== void 0) {
            try {
              full_config[config.key] = typeof config.value === "string" ? JSON.parse(config.value) : config.value;
            } catch {
              full_config[config.key] = config.value;
            }
          }
          if (!description && config.description) {
            description = config.description;
          }
          if (!created_date && config.created_date) {
            created_date = config.created_date;
          }
          if (!tool_id) {
            tool_id = config.tool_id;
          }
        });
        if (Object.keys(full_config).length === 0 && result.config_dict) {
          console.log(`Using config_dict fallback for config_id ${configId}`);
          Object.assign(full_config, result.config_dict);
        }
        return {
          graph_name: full_config.graph_name || `agent_${configId}`,
          description: description || full_config.description || "Saved agent configuration",
          running: false,
          full_config: full_config.graph_config || {},
          created_date,
          config_id: configId,
          tool_id
          // Keep for backward compatibility
        };
      });
      console.log("Processed agents:", agents);
      return agents;
    } else {
      console.warn("No config_records found in response or invalid format");
      return [];
    }
  }
  /**
   * Delete an agent configuration using config_id
   */
  static async deleteAgent(configId) {
    try {
      console.log(`🗑️ Starting delete process for config_id: ${configId}`);
      const deleteUrl = `${this.CONFIG_API_URL}/delete_graph_config/${configId}`;
      console.log(`🌐 Making DELETE request to: ${deleteUrl}`);
      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });
      console.log(`📡 Delete response status: ${response.status} ${response.statusText}`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Delete API failed: ${response.status} - ${errorText}`);
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }
      const deleteResult = await response.json();
      console.log("✅ Delete API success response:", deleteResult);
      return deleteResult;
    } catch (error) {
      console.error("💥 Error deleting agent config:", error);
      return {
        status: "error",
        detail: error.message
      };
    }
  }
  /**
   * Update an existing agent configuration using the dedicated update endpoint
   */
  static async updateGraphConfig(configId, graphConfig, description) {
    try {
      console.log(`🔄 Starting update process for config_id: ${configId}`);
      const requestBody = {
        graph_config: graphConfig,
        description
      };
      const updateUrl = `${this.CONFIG_API_URL}/update_graph_config/${configId}`;
      console.log(`🌐 Making PUT request to: ${updateUrl}`);
      const response = await fetch(updateUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });
      console.log(`📡 Update response status: ${response.status} ${response.statusText}`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Update API failed: ${response.status} - ${errorText}`);
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }
      const updateResult = await response.json();
      console.log("✅ Update API success response:", updateResult);
      return updateResult;
    } catch (error) {
      console.error("💥 Error updating graph config:", error);
      return {
        status: "error",
        detail: error.message
      };
    }
  }
  /**
   * Update an existing agent configuration
   */
  static async updateAgent(userId, agent, description, username, email) {
    const configId = agent.config_id;
    if (configId) {
      return this.updateGraphConfig(configId, agent.full_config, description || agent.description);
    }
    return this.saveGraphConfig(userId, agent.full_config, description || agent.description, username, email);
  }
  /**
   * Get a specific agent configuration by config_id
   */
  static async getAgent(userId, configId) {
    const result = await this.getGraphConfigs(userId);
    if (result.status !== "success") {
      console.warn("Failed to load user agents:", result.detail);
      return null;
    }
    console.log(`Looking for agent with config_id: ${configId}`);
    console.log("Available data:", {
      has_config_dict: !!result.config_dict,
      has_config_records: !!result.config_records
    });
    if (result.config_records && result.config_dict) {
      const agentRecords = result.config_records.filter((record) => record.config_id === configId);
      if (agentRecords.length > 0) {
        let description = "";
        let created_date = "";
        let tool_id;
        agentRecords.forEach((config) => {
          if (!description && config.description) {
            description = config.description;
          }
          if (!created_date && config.created_date) {
            created_date = config.created_date;
          }
          if (!tool_id) {
            tool_id = config.tool_id;
          }
        });
        const full_config = result.config_dict;
        console.log(`Found agent config for config_id ${configId} using config_dict`);
        return {
          graph_name: full_config.graph_name || `agent_${configId}`,
          description: description || full_config.description || "Saved agent configuration",
          running: false,
          full_config,
          created_date,
          tool_id,
          config_id: configId
        };
      }
    }
    if (result.config_records) {
      const agentRecords = result.config_records.filter((record) => record.config_id === configId);
      if (agentRecords.length > 0) {
        const full_config = {};
        let description = "";
        let tool_id;
        agentRecords.forEach((config) => {
          full_config[config.key] = config.value;
          if (!description && config.description) {
            description = config.description;
          }
          if (!tool_id) {
            tool_id = config.tool_id;
          }
        });
        return {
          graph_name: full_config.graph_name || `agent_${configId}`,
          description: description || full_config.description || "Saved agent configuration",
          running: false,
          full_config,
          tool_id,
          config_id: configId
        };
      }
    }
    console.warn(`Agent with config_id ${configId} not found`);
    return null;
  }
  /**
   * Duplicate an existing agent using config_id
   */
  static async duplicateAgent(userId, sourceConfigId, newConfigId, username, email) {
    const sourceAgent = await this.getAgent(userId, sourceConfigId);
    if (!sourceAgent) {
      return {
        status: "error",
        detail: "Source agent not found"
      };
    }
    const duplicatedConfig = { ...sourceAgent.full_config };
    duplicatedConfig.graph_name = `${sourceAgent.graph_name}_copy_${Date.now()}`;
    delete duplicatedConfig.config_id;
    return this.saveGraphConfig(
      userId,
      duplicatedConfig,
      `Copy of ${sourceAgent.description}`,
      username,
      email
    );
  }
}
AgentsTab[FILENAME] = "src/lib/components/agents/AgentsTab.svelte";
function AgentsTab($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      let currentUser, userId, userIsAuthenticated, totalAgentPages, paginatedAgents;
      const AGENTS_PER_PAGE = 5;
      const TOAST_MESSAGES = {
        AGENT_UPDATED: "updated successfully!",
        AGENT_DELETED: "deleted.",
        AGENT_CREATED: "created. You can now edit its JSON.",
        AGENT_ALREADY_RUNNING: "is already running.",
        AGENT_RUN_ATTEMPT: "Attempting to run agent:",
        AGENT_COMPLETE: "Agent execution completed!",
        AGENT_INTERRUPTED: "Agent paused - waiting for user input to continue.",
        AGENT_CANCELLED: "Agent input cancelled. Execution halted.",
        AGENT_ERROR: "Agent execution failed:",
        NO_SESSION: "No active session to resume.",
        RESUME_REQUIRED: "Please provide input for all required fields to resume the agent execution."
      };
      llmConfigStore.activeConfig.subscribe((config) => {
      });
      let agents = [...defaultAgents];
      let isEditModalOpen = false;
      let selectedAgentForEdit = null;
      let isGraphModalOpen = false;
      let selectedAgentForGraph = null;
      async function loadAgentsFromBackend() {
        if (!userIsAuthenticated) {
          console.log("User not authenticated, skipping backend agent load");
          return;
        }
        try {
          const backendAgents = await AgentCrudService.loadUserAgents(userId);
          console.log(`🔍 loadAgentsFromBackend: Received ${backendAgents.length} agents from backend for user ${userId}`);
          console.log("🔍 Backend agents:", backendAgents.map((a) => ({ graph_name: a.graph_name, config_id: a.config_id })));
          const backendAgentNames = new Set(backendAgents.map((agent) => agent.graph_name));
          const nonConflictingDefaultAgents = defaultAgents.filter((defaultAgent) => !backendAgentNames.has(defaultAgent.graph_name));
          agents = [...backendAgents, ...nonConflictingDefaultAgents];
          const newTotalPages = Math.max(1, Math.ceil(agents.length / AGENTS_PER_PAGE));
          if (agentsCurrentPage > newTotalPages) {
            agentsCurrentPage = 1;
          }
          console.log(`✅ Final agent list: ${agents.length} total (${backendAgents.length} backend + ${nonConflictingDefaultAgents.length} non-conflicting default agents)`);
        } catch (error) {
          console.warn("Failed to load agents from backend:", error);
        }
      }
      async function refreshAgentsFromBackend() {
        if (!userIsAuthenticated) {
          toasts.push({
            message: "Please log in to refresh agents from backend",
            color: "warning",
            header: "Authentication Required"
          });
          return;
        }
        try {
          const backendAgents = await AgentCrudService.loadUserAgents(userId);
          console.log(`🔄 refreshAgentsFromBackend: Received ${backendAgents.length} agents from backend for user ${userId}`);
          console.log("🔄 Backend agents:", backendAgents.map((a) => ({ graph_name: a.graph_name, config_id: a.config_id })));
          const backendAgentNames = new Set(backendAgents.map((agent) => agent.graph_name));
          const nonConflictingDefaultAgents = defaultAgents.filter((defaultAgent) => !backendAgentNames.has(defaultAgent.graph_name));
          agents = [...backendAgents, ...nonConflictingDefaultAgents];
          const newTotalPages = Math.max(1, Math.ceil(agents.length / AGENTS_PER_PAGE));
          if (agentsCurrentPage > newTotalPages) {
            agentsCurrentPage = 1;
          }
          console.log(`✅ Refresh complete: ${agents.length} total agents (${backendAgents.length} backend + ${nonConflictingDefaultAgents.length} non-conflicting default)`);
          toasts.push({
            message: `Refreshed ${backendAgents.length} agents from backend`,
            color: "success",
            header: "Agents Refreshed"
          });
        } catch (error) {
          console.error("Failed to refresh agents from backend:", error);
          toasts.push({
            message: `Failed to refresh agents: ${error.message}`,
            color: "danger",
            header: "Refresh Failed"
          });
        }
      }
      async function handleDuplicateAgent(agent) {
        if (!userIsAuthenticated) {
          toasts.push({
            message: "Please log in to duplicate agents",
            color: "warning",
            header: "Authentication Required"
          });
          return;
        }
        try {
          if (agent.config_id) {
            const result = await AgentCrudService.duplicateAgent(userId, agent.config_id, void 0, currentUser?.name, currentUser?.email);
            if (result.status === "success") {
              await refreshAgentsFromBackend();
              toasts.push({
                message: `Agent '${agent.graph_name}' duplicated successfully`,
                color: "success",
                header: "Agent Duplicated"
              });
            } else {
              throw new Error(result.detail || "Failed to duplicate agent");
            }
          } else {
            const duplicatedAgent = {
              ...agent,
              graph_name: `${agent.graph_name}_copy_${Date.now()}`,
              full_config: {
                ...agent.full_config,
                graph_name: `${agent.graph_name}_copy_${Date.now()}`
              }
            };
            const result = await AgentCrudService.saveAgent(userId, duplicatedAgent, `Copy of ${agent.description}`, currentUser?.name, currentUser?.email);
            if (result.status === "success") {
              await refreshAgentsFromBackend();
              toasts.push({
                message: `Agent '${agent.graph_name}' duplicated successfully`,
                color: "success",
                header: "Agent Duplicated"
              });
            } else {
              throw new Error(result.detail || "Failed to save duplicated agent");
            }
          }
        } catch (error) {
          console.error("Failed to duplicate agent:", error);
          toasts.push({
            message: `Failed to duplicate agent: ${error.message}`,
            color: "danger",
            header: "Duplication Failed"
          });
        }
      }
      let agentOutput = "";
      let agentStreaming = false;
      let currentAgent = null;
      let streamEvents = [];
      let currentSessionId = null;
      let waitingForResume = false;
      let resumePrompts = {};
      let resumeInputs = {};
      let showInlineGraph = false;
      let graphNodes = [];
      let graphEdges = [];
      let graphError = null;
      let graphExecutionPath = [];
      let showExecutionOnly = false;
      let agentsCurrentPage = 1;
      function resetExecutionState() {
        agentOutput = "";
        streamEvents = [];
        agentStreaming = false;
        waitingForResume = false;
        currentSessionId = null;
        resumePrompts = {};
        resumeInputs = {};
        showInlineGraph = false;
        graphNodes = [];
        graphEdges = [];
        graphError = null;
        graphExecutionPath = [];
        showExecutionOnly = false;
        if (currentAgent) {
          currentAgent.running = false;
          currentAgent = null;
        }
        agents = [...agents];
      }
      function createAgentRequest(operation, data, sessionId) {
        const baseRequest = { operation, metadata: {} };
        if (operation === "execute") {
          return { ...baseRequest, graph_config: data, input_data: {} };
        } else {
          return { ...baseRequest, session_id: sessionId, resume_data: data };
        }
      }
      function validateResumeInputs() {
        const targets = Object.keys(resumePrompts);
        return targets.length > 0 && targets.every((target) => resumeInputs[target]?.trim());
      }
      function createResumeResponseData() {
        const targets = Object.keys(resumePrompts);
        const responseData = {};
        targets.forEach((target) => {
          responseData[target] = (resumeInputs[target] ?? "").trim();
        });
        return responseData;
      }
      function openEditModal(agent) {
        selectedAgentForEdit = agent;
        isEditModalOpen = true;
      }
      function closeEditModal() {
        isEditModalOpen = false;
        selectedAgentForEdit = null;
      }
      function openGraphModal(agent) {
        selectedAgentForGraph = agent;
        isGraphModalOpen = true;
      }
      function closeGraphModal() {
        isGraphModalOpen = false;
        selectedAgentForGraph = null;
      }
      async function handleSaveAgentChanges(newConfig) {
        if (!selectedAgentForEdit) return;
        if (!userIsAuthenticated) {
          toasts.push({
            message: "Please log in to save agent changes",
            color: "warning",
            header: "Authentication Required"
          });
          return;
        }
        const agentIndex = agents.findIndex((a) => a.config_id === selectedAgentForEdit.config_id);
        if (agentIndex !== -1) {
          agents[agentIndex].full_config = newConfig;
          agents = [...agents];
          try {
            const updatedAgent = { ...selectedAgentForEdit, full_config: newConfig };
            const result = await AgentCrudService.updateAgent(userId, updatedAgent, selectedAgentForEdit.description, currentUser?.name, currentUser?.email);
            if (result.status === "success") {
              toasts.push({
                message: `Agent '${selectedAgentForEdit.graph_name}' ${TOAST_MESSAGES.AGENT_UPDATED}`,
                color: "success",
                header: "Agent Updated"
              });
            } else {
              throw new Error(result.detail || "Failed to save agent");
            }
          } catch (error) {
            console.error("Failed to save agent to backend:", error);
            toasts.push({
              message: `Failed to save agent to backend: ${error.message}`,
              color: "warning",
              header: "Save Warning"
            });
          }
          closeEditModal();
        }
      }
      async function handleDeleteAgent(config_id) {
        console.log("🗑️ handleDeleteAgent called with config_id:", config_id, "type:", typeof config_id);
        console.log("🗑️ All agents:", agents.map((a) => ({
          graph_name: a.graph_name,
          config_id: a.config_id,
          config_id_type: typeof a.config_id,
          config_id_str: a.config_id?.toString()
        })));
        if (!config_id || config_id === "undefined" || config_id === "") {
          console.error("❌ Invalid config_id provided:", config_id);
          toasts.push({
            message: "Agent deleted locally (no backend ID)",
            color: "info",
            header: "Agent Deleted"
          });
          return;
        }
        const agentToDelete = agents.find((a) => a.config_id?.toString() === config_id);
        console.log("🗑️ Delete request for agent:", {
          config_id,
          agentToDelete: agentToDelete ? {
            graph_name: agentToDelete.graph_name,
            config_id: agentToDelete.config_id,
            has_config_id: !!agentToDelete.config_id
          } : null,
          userIsAuthenticated,
          userId,
          currentUser: currentUser ? {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email
          } : null
        });
        if (!agentToDelete) {
          console.error("❌ Agent not found with config_id:", config_id);
          toasts.push({
            message: "Agent not found for deletion",
            color: "danger",
            header: "Delete Failed"
          });
          return;
        }
        agents = agents.filter((a) => a.config_id?.toString() !== config_id);
        if (userIsAuthenticated && agentToDelete.config_id) {
          console.log(`🔄 Attempting backend deletion for config_id: ${agentToDelete.config_id}`);
          try {
            const result = await AgentCrudService.deleteAgent(parseInt(config_id));
            console.log("🔄 Delete result:", result);
            if (result.status === "success") {
              console.log("✅ Successfully deleted agent from backend:", result.message);
              toasts.push({
                message: `Agent '${agentToDelete.graph_name}' ${TOAST_MESSAGES.AGENT_DELETED}`,
                color: "success",
                header: "Agent Deleted"
              });
            } else {
              console.warn("⚠️ Failed to delete agent from backend:", result.detail);
              toasts.push({
                message: `Agent deleted locally but backend deletion failed: ${result.detail}`,
                color: "warning",
                header: "Delete Warning"
              });
            }
          } catch (error) {
            console.error("💥 Failed to delete agent from backend:", error);
            toasts.push({
              message: `Agent deleted locally but backend deletion failed: ${error.message}`,
              color: "warning",
              header: "Delete Warning"
            });
          }
        } else {
          console.log("❌ Skipping backend delete because user not authenticated or agent has no config_id");
          toasts.push({
            message: "Agent deleted locally. Please log in to delete from backend.",
            color: "warning",
            header: "Authentication Required"
          });
        }
      }
      function handleDeleteLocalAgent(graphName) {
        console.log("🗑️ Deleting local agent:", graphName);
        agents = agents.filter((a) => a.graph_name !== graphName);
        toasts.push({
          message: `Agent '${graphName}' deleted locally`,
          color: "info",
          header: "Agent Deleted"
        });
      }
      async function handleRunAgent(agent) {
        console.log("Running agent with config:", agent.full_config);
        if (agent.running) {
          toasts.push({
            message: `Agent '${agent.graph_name}' ${TOAST_MESSAGES.AGENT_ALREADY_RUNNING}`,
            color: "warning",
            header: "Agent Already Running"
          });
          return;
        }
        const validation = AgentService.validateAgentConfig(agent.full_config);
        if (!validation.isValid) {
          toasts.push({
            message: `Agent configuration is invalid: ${validation.errors.join(", ")}`,
            color: "danger",
            header: "Invalid Configuration"
          });
          return;
        }
        agent.running = agentStreaming = true;
        agentOutput = "";
        streamEvents = [];
        currentAgent = agent;
        waitingForResume = false;
        currentSessionId = null;
        resumePrompts = {};
        resumeInputs = {};
        const result = updateInlineGraph(agent, streamEvents);
        graphNodes = result.nodes;
        graphEdges = result.edges;
        graphError = result.error;
        graphExecutionPath = result.executionPath;
        showInlineGraph = true;
        toasts.push({
          message: `${TOAST_MESSAGES.AGENT_RUN_ATTEMPT} ${agent.graph_name}`,
          color: "info",
          header: "Agent Run"
        });
        await executeAgentRequest(createAgentRequest("execute", agent.full_config));
      }
      async function handleResumeAgent() {
        if (!currentSessionId) {
          toasts.push({
            message: TOAST_MESSAGES.NO_SESSION,
            color: "warning",
            header: "Resume Required"
          });
          return;
        }
        if (!validateResumeInputs()) {
          toasts.push({
            message: TOAST_MESSAGES.RESUME_REQUIRED,
            color: "warning",
            header: "Resume Required"
          });
          return;
        }
        const requestBody = createAgentRequest("resume", createResumeResponseData(), currentSessionId);
        resumeInputs = {};
        await executeAgentRequest(requestBody);
      }
      function handleCancelResume() {
        const cancellationMessage = "[Info]: Agent resume cancelled by user.";
        agentOutput = agentOutput ? `${agentOutput}
${cancellationMessage}` : cancellationMessage;
        waitingForResume = false;
        agentStreaming = false;
        currentSessionId = null;
        resumePrompts = {};
        resumeInputs = {};
        if (currentAgent) {
          currentAgent.running = false;
        }
        agents = [...agents];
        toasts.push({
          message: TOAST_MESSAGES.AGENT_CANCELLED,
          color: "warning",
          header: "Agent Cancelled"
        });
      }
      async function executeAgentRequest(requestBody) {
        try {
          const responseBody = await AgentService.executeAgentRequest(requestBody);
          if (!responseBody) throw new Error("No response body");
          await processStreamResponse(responseBody);
          handleExecutionCompletion();
        } catch (err) {
          handleExecutionError(err);
        }
      }
      async function processStreamResponse(responseBody) {
        const reader = responseBody.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let done = false;
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            buffer += decoder.decode(value, { stream: true });
            buffer = processStreamBuffer(buffer);
          }
        }
        if (buffer.trim()) {
          processStreamBuffer(buffer);
        }
      }
      function processStreamBuffer(buffer) {
        const newEvents = AgentService.parseSSEEvents(buffer);
        if (newEvents.length > 0) {
          streamEvents = [...streamEvents, ...newEvents];
          agentOutput = AgentService.parseAgentOutput(streamEvents, (id) => currentSessionId = id, (waiting) => waitingForResume = waiting, (prompts) => resumePrompts = prompts);
          const lastEventEnd = buffer.lastIndexOf("\n\n");
          return lastEventEnd !== -1 ? buffer.substring(lastEventEnd + 2) : "";
        }
        return buffer;
      }
      function handleExecutionCompletion() {
        if (!waitingForResume) {
          if (currentAgent) {
            currentAgent.running = false;
          }
          toasts.push({
            message: TOAST_MESSAGES.AGENT_COMPLETE,
            color: "success",
            header: "Agent Complete"
          });
        } else {
          toasts.push({
            message: TOAST_MESSAGES.AGENT_INTERRUPTED,
            color: "info",
            header: "Agent Interrupted"
          });
        }
      }
      function handleExecutionError(err) {
        resetExecutionState();
        agentOutput += `
[Error]: ${err.message}`;
        toasts.push({
          message: `${TOAST_MESSAGES.AGENT_ERROR} ${err.message}`,
          color: "danger",
          header: "Agent Error"
        });
      }
      currentUser = store_get($$store_subs ??= {}, "$userStore", userStore);
      userId = currentUser?.id ? typeof currentUser.id === "string" ? parseInt(currentUser.id) : currentUser.id : null;
      userIsAuthenticated = userId !== null && !isNaN(userId);
      if (userIsAuthenticated) {
        loadAgentsFromBackend();
      }
      totalAgentPages = Math.max(1, Math.ceil(agents.length / AGENTS_PER_PAGE));
      paginatedAgents = agents.slice((agentsCurrentPage - 1) * AGENTS_PER_PAGE, agentsCurrentPage * AGENTS_PER_PAGE);
      if (agents.length > 0) {
        console.log(`📄 Pagination Debug:`, {
          totalAgents: agents.length,
          agentsPerPage: AGENTS_PER_PAGE,
          currentPage: agentsCurrentPage,
          totalPages: totalAgentPages,
          paginatedAgentsCount: paginatedAgents.length,
          startIndex: (agentsCurrentPage - 1) * AGENTS_PER_PAGE,
          endIndex: agentsCurrentPage * AGENTS_PER_PAGE,
          paginatedAgents: paginatedAgents.map((a) => ({ graph_name: a.graph_name, config_id: a.config_id }))
        });
      }
      if (currentAgent) {
        console.log(`📄 Current Agent Debug:`, {
          graph_name: currentAgent.graph_name,
          config_id: currentAgent.config_id,
          running: currentAgent.running
        });
      }
      if (currentAgent && showInlineGraph && streamEvents.length > 0) {
        const result = updateInlineGraph(currentAgent, streamEvents);
        graphNodes = result.nodes;
        graphEdges = result.edges;
        graphError = result.error;
        graphExecutionPath = result.executionPath;
      }
      if (currentAgent && showInlineGraph) {
        const { nodes: parsedNodes, edges: parsedEdges } = parseAgentConfig(currentAgent.full_config, graphExecutionPath, showExecutionOnly);
        graphNodes = parsedNodes;
        graphEdges = parsedEdges;
      }
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<div class="tab-pane fade show active">`);
        push_element($$renderer3, "div", 745, 0);
        Card($$renderer3, {
          class: "mb-4",
          children: prevent_snippet_stringification(($$renderer4) => {
            CardHeader($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<div class="d-flex mt-2 mt-md-0">`);
                push_element($$renderer5, "div", 748, 3);
                Button($$renderer5, {
                  color: "success",
                  size: "sm",
                  class: "flex-shrink-0 me-2",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<i class="bi bi-plus-circle-fill me-1">`);
                    push_element($$renderer6, "i", 750, 5);
                    $$renderer6.push(`</i>`);
                    pop_element();
                    $$renderer6.push(`Create New Agent`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> `);
                Button($$renderer5, {
                  color: "info",
                  size: "sm",
                  class: "flex-shrink-0 me-2",
                  disabled: !userIsAuthenticated,
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<i class="bi bi-arrow-clockwise me-1">`);
                    push_element($$renderer6, "i", 759, 5);
                    $$renderer6.push(`</i>`);
                    pop_element();
                    $$renderer6.push(`Refresh`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> <div class="m-1">`);
                push_element($$renderer5, "div", 762, 4);
                LlmConfigSelector($$renderer5, { placeholder: "Select LLM configuration" });
                $$renderer5.push(`<!----></div>`);
                pop_element();
                $$renderer5.push(` `);
                if (!userIsAuthenticated) {
                  $$renderer5.push("<!--[-->");
                  Badge($$renderer5, {
                    color: "warning",
                    class: "me-2 align-self-center",
                    children: prevent_snippet_stringification(($$renderer6) => {
                      $$renderer6.push(`<i class="bi bi-exclamation-triangle me-1">`);
                      push_element($$renderer6, "i", 770, 6);
                      $$renderer6.push(`</i>`);
                      pop_element();
                      $$renderer6.push(`Not logged in - backend features disabled`);
                    }),
                    $$slots: { default: true }
                  });
                } else if (currentUser) {
                  $$renderer5.push("<!--[1-->");
                  Badge($$renderer5, {
                    color: "success",
                    class: "me-2 align-self-center",
                    children: prevent_snippet_stringification(($$renderer6) => {
                      $$renderer6.push(`<i class="bi bi-person-check me-1">`);
                      push_element($$renderer6, "i", 774, 6);
                      $$renderer6.push(`</i>`);
                      pop_element();
                      $$renderer6.push(`Logged in as ${escape_html(currentUser.name)}`);
                    }),
                    $$slots: { default: true }
                  });
                } else {
                  $$renderer5.push("<!--[!-->");
                }
                $$renderer5.push(`<!--]--> <div class="input-group w-100 w-md-auto">`);
                push_element($$renderer5, "div", 777, 4);
                $$renderer5.push(`<span class="input-group-text">`);
                push_element($$renderer5, "span", 778, 5);
                $$renderer5.push(`<i class="bi bi-search">`);
                push_element($$renderer5, "i", 778, 36);
                $$renderer5.push(`</i>`);
                pop_element();
                $$renderer5.push(`</span>`);
                pop_element();
                $$renderer5.push(` `);
                Input($$renderer5, { type: "text", placeholder: "Search agents..." });
                $$renderer5.push(`<!----> `);
                Button($$renderer5, {
                  outline: true,
                  color: "secondary",
                  disabled: true,
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<i class="bi bi-funnel-fill me-1">`);
                    push_element($$renderer6, "i", 780, 48);
                    $$renderer6.push(`</i>`);
                    pop_element();
                    $$renderer6.push(`Filters`);
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
            $$renderer4.push(`<!----> `);
            CardBody($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                if (agents.length > 0) {
                  $$renderer5.push("<!--[-->");
                  $$renderer5.push(`<ul class="list-group mb-3">`);
                  push_element($$renderer5, "ul", 786, 4);
                  $$renderer5.push(`<!--[-->`);
                  const each_array = ensure_array_like(paginatedAgents);
                  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                    let agent = each_array[$$index];
                    AgentListItem($$renderer5, {
                      agent,
                      onRun: handleRunAgent,
                      runButtonEnabled: (currentAgent && currentAgent.running || !waitingForResume) === true,
                      onEdit: openEditModal,
                      onDelete: () => {
                        if (agent.config_id) {
                          handleDeleteAgent(agent.config_id.toString());
                        } else {
                          handleDeleteLocalAgent(agent.graph_name);
                        }
                      },
                      onShowGraph: openGraphModal,
                      onDuplicate: handleDuplicateAgent
                    });
                  }
                  $$renderer5.push(`<!--]--></ul>`);
                  pop_element();
                } else {
                  $$renderer5.push("<!--[!-->");
                  $$renderer5.push(`<p class="text-center text-muted mb-3">`);
                  push_element($$renderer5, "p", 806, 4);
                  $$renderer5.push(`No agents configured yet.</p>`);
                  pop_element();
                }
                $$renderer5.push(`<!--]--> `);
                AgentConsole($$renderer5, {
                  agentOutput,
                  agentStreaming,
                  streamEvents,
                  waitingForResume,
                  resumePrompts,
                  currentSessionId,
                  onResumeAgent: handleResumeAgent,
                  onCancelResume: handleCancelResume,
                  get resumeInputs() {
                    return resumeInputs;
                  },
                  set resumeInputs($$value) {
                    resumeInputs = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!----> `);
                if (showInlineGraph) {
                  $$renderer5.push("<!--[-->");
                  Card($$renderer5, {
                    class: "mt-4",
                    children: prevent_snippet_stringification(($$renderer6) => {
                      CardHeader($$renderer6, {
                        children: prevent_snippet_stringification(($$renderer7) => {
                          Row($$renderer7, {
                            children: prevent_snippet_stringification(($$renderer8) => {
                              Col($$renderer8, {
                                children: prevent_snippet_stringification(($$renderer9) => {
                                  $$renderer9.push(`<h5 class="mb-0">`);
                                  push_element($$renderer9, "h5", 827, 8);
                                  $$renderer9.push(`<i class="bi bi-diagram-3 me-2">`);
                                  push_element($$renderer9, "i", 828, 9);
                                  $$renderer9.push(`</i>`);
                                  pop_element();
                                  $$renderer9.push(` Agent Workflow Graph `);
                                  if (currentAgent) {
                                    $$renderer9.push("<!--[-->");
                                    $$renderer9.push(`- ${escape_html(currentAgent.graph_name)}`);
                                  } else {
                                    $$renderer9.push("<!--[!-->");
                                  }
                                  $$renderer9.push(`<!--]--></h5>`);
                                  pop_element();
                                  $$renderer9.push(` `);
                                  if (graphExecutionPath.length > 0) {
                                    $$renderer9.push("<!--[-->");
                                    $$renderer9.push(`<small class="text-muted">`);
                                    push_element($$renderer9, "small", 835, 9);
                                    $$renderer9.push(`Execution Path: ${escape_html(graphExecutionPath.join(" → "))}</small>`);
                                    pop_element();
                                  } else {
                                    $$renderer9.push("<!--[!-->");
                                  }
                                  $$renderer9.push(`<!--]-->`);
                                }),
                                $$slots: { default: true }
                              });
                              $$renderer8.push(`<!----> `);
                              Col($$renderer8, {
                                xs: "auto",
                                children: prevent_snippet_stringification(($$renderer9) => {
                                  $$renderer9.push(`<div class="d-flex gap-2">`);
                                  push_element($$renderer9, "div", 841, 8);
                                  Badge($$renderer9, {
                                    color: "info",
                                    children: prevent_snippet_stringification(($$renderer10) => {
                                      $$renderer10.push(`<!---->${escape_html(graphNodes.length)} nodes`);
                                    }),
                                    $$slots: { default: true }
                                  });
                                  $$renderer9.push(`<!----> `);
                                  Badge($$renderer9, {
                                    color: "secondary",
                                    children: prevent_snippet_stringification(($$renderer10) => {
                                      $$renderer10.push(`<!---->${escape_html(graphEdges.length)} edges`);
                                    }),
                                    $$slots: { default: true }
                                  });
                                  $$renderer9.push(`<!----> `);
                                  if (graphExecutionPath.length > 0) {
                                    $$renderer9.push("<!--[-->");
                                    Badge($$renderer9, {
                                      color: "success",
                                      children: prevent_snippet_stringification(($$renderer10) => {
                                        $$renderer10.push(`<!---->${escape_html(graphExecutionPath.length)} executed`);
                                      }),
                                      $$slots: { default: true }
                                    });
                                  } else {
                                    $$renderer9.push("<!--[!-->");
                                  }
                                  $$renderer9.push(`<!--]--> `);
                                  Button($$renderer9, {
                                    size: "sm",
                                    color: "outline-secondary",
                                    children: prevent_snippet_stringification(($$renderer10) => {
                                      $$renderer10.push(`<i class="bi bi-x">`);
                                      push_element($$renderer10, "i", 852, 10);
                                      $$renderer10.push(`</i>`);
                                      pop_element();
                                      $$renderer10.push(` Hide Graph`);
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
                        }),
                        $$slots: { default: true }
                      });
                      $$renderer6.push(`<!----> `);
                      CardBody($$renderer6, {
                        children: prevent_snippet_stringification(($$renderer7) => {
                          if (graphExecutionPath.length > 0) {
                            $$renderer7.push("<!--[-->");
                            $$renderer7.push(`<div class="mb-3">`);
                            push_element($$renderer7, "div", 860, 7);
                            $$renderer7.push(`<div class="form-check">`);
                            push_element($$renderer7, "div", 861, 8);
                            $$renderer7.push(`<input class="form-check-input" type="checkbox"${attr("checked", showExecutionOnly, true)} id="showInlineExecutionOnly"/>`);
                            push_element($$renderer7, "input", 862, 9);
                            pop_element();
                            $$renderer7.push(` <label class="form-check-label" for="showInlineExecutionOnly">`);
                            push_element($$renderer7, "label", 868, 9);
                            $$renderer7.push(`Show only executed nodes and edges</label>`);
                            pop_element();
                            $$renderer7.push(`</div>`);
                            pop_element();
                            $$renderer7.push(`</div>`);
                            pop_element();
                          } else {
                            $$renderer7.push("<!--[!-->");
                          }
                          $$renderer7.push(`<!--]--> `);
                          if (graphError) {
                            $$renderer7.push("<!--[-->");
                            Alert($$renderer7, {
                              color: "danger",
                              children: prevent_snippet_stringification(($$renderer8) => {
                                $$renderer8.push(`<i class="bi bi-exclamation-triangle me-2">`);
                                push_element($$renderer8, "i", 876, 8);
                                $$renderer8.push(`</i>`);
                                pop_element();
                                $$renderer8.push(` Error parsing agent configuration: ${escape_html(graphError)}`);
                              }),
                              $$slots: { default: true }
                            });
                          } else if (graphNodes.length > 0) {
                            $$renderer7.push("<!--[1-->");
                            $$renderer7.push(`<div style="height: 400px; width: 100%; border: 1px solid #dee2e6; border-radius: 0.375rem;">`);
                            push_element($$renderer7, "div", 880, 7);
                            SvelteFlow($$renderer7, {
                              nodes: graphNodes,
                              edges: graphEdges,
                              fitView: true,
                              children: prevent_snippet_stringification(($$renderer8) => {
                                Controls($$renderer8, {});
                                $$renderer8.push(`<!----> `);
                                Background($$renderer8, {});
                                $$renderer8.push(`<!----> `);
                                Minimap($$renderer8, {});
                                $$renderer8.push(`<!----> `);
                                Panel($$renderer8, {
                                  position: "top-right",
                                  children: prevent_snippet_stringification(($$renderer9) => {
                                    $$renderer9.push(`<div class="bg-white p-2 rounded shadow-sm">`);
                                    push_element($$renderer9, "div", 886, 10);
                                    $$renderer9.push(`<small class="text-muted">`);
                                    push_element($$renderer9, "small", 887, 11);
                                    $$renderer9.push(`<i class="bi bi-info-circle me-1">`);
                                    push_element($$renderer9, "i", 888, 12);
                                    $$renderer9.push(`</i>`);
                                    pop_element();
                                    $$renderer9.push(` Use mouse wheel to zoom, drag to pan</small>`);
                                    pop_element();
                                    $$renderer9.push(` `);
                                    if (graphExecutionPath.length > 0) {
                                      $$renderer9.push("<!--[-->");
                                      $$renderer9.push(`<hr class="my-2"/>`);
                                      push_element($$renderer9, "hr", 892, 12);
                                      pop_element();
                                      $$renderer9.push(` <div class="mb-1">`);
                                      push_element($$renderer9, "div", 893, 12);
                                      $$renderer9.push(`<small class="text-success">`);
                                      push_element($$renderer9, "small", 894, 13);
                                      $$renderer9.push(`<i class="bi bi-check-circle me-1">`);
                                      push_element($$renderer9, "i", 895, 14);
                                      $$renderer9.push(`</i>`);
                                      pop_element();
                                      $$renderer9.push(` <strong>`);
                                      push_element($$renderer9, "strong", 896, 14);
                                      $$renderer9.push(`Executed</strong>`);
                                      pop_element();
                                      $$renderer9.push(`</small>`);
                                      pop_element();
                                      $$renderer9.push(`</div>`);
                                      pop_element();
                                      $$renderer9.push(` <div class="mb-1">`);
                                      push_element($$renderer9, "div", 899, 12);
                                      $$renderer9.push(`<small class="text-muted">`);
                                      push_element($$renderer9, "small", 900, 13);
                                      $$renderer9.push(`<i class="bi bi-circle me-1">`);
                                      push_element($$renderer9, "i", 901, 14);
                                      $$renderer9.push(`</i>`);
                                      pop_element();
                                      $$renderer9.push(` Not executed</small>`);
                                      pop_element();
                                      $$renderer9.push(`</div>`);
                                      pop_element();
                                      $$renderer9.push(` <div>`);
                                      push_element($$renderer9, "div", 905, 12);
                                      $$renderer9.push(`<small class="text-success">`);
                                      push_element($$renderer9, "small", 906, 13);
                                      $$renderer9.push(`<i class="bi bi-arrow-right me-1">`);
                                      push_element($$renderer9, "i", 907, 14);
                                      $$renderer9.push(`</i>`);
                                      pop_element();
                                      $$renderer9.push(` Used paths</small>`);
                                      pop_element();
                                      $$renderer9.push(`</div>`);
                                      pop_element();
                                    } else {
                                      $$renderer9.push("<!--[!-->");
                                    }
                                    $$renderer9.push(`<!--]--></div>`);
                                    pop_element();
                                  }),
                                  $$slots: { default: true }
                                });
                                $$renderer8.push(`<!---->`);
                              }),
                              $$slots: { default: true }
                            });
                            $$renderer7.push(`<!----></div>`);
                            pop_element();
                          } else {
                            $$renderer7.push("<!--[!-->");
                            Alert($$renderer7, {
                              color: "warning",
                              children: prevent_snippet_stringification(($$renderer8) => {
                                $$renderer8.push(`<i class="bi bi-exclamation-triangle me-2">`);
                                push_element($$renderer8, "i", 918, 8);
                                $$renderer8.push(`</i>`);
                                pop_element();
                                $$renderer8.push(` No nodes found in agent configuration. The agent may not be properly configured.`);
                              }),
                              $$slots: { default: true }
                            });
                          }
                          $$renderer7.push(`<!--]-->`);
                        }),
                        $$slots: { default: true }
                      });
                      $$renderer6.push(`<!---->`);
                    }),
                    $$slots: { default: true }
                  });
                } else {
                  $$renderer5.push("<!--[!-->");
                }
                $$renderer5.push(`<!--]-->`);
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            CardFooter($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<div class="d-flex justify-content-center">`);
                push_element($$renderer5, "div", 927, 3);
                Pagination($$renderer5, {
                  children: prevent_snippet_stringification(($$renderer6) => {
                    PaginationItem($$renderer6, {
                      disabled: agentsCurrentPage === 1 || agents.length === 0,
                      children: prevent_snippet_stringification(($$renderer7) => {
                        PaginationLink($$renderer7, { previous: true, href: "#" });
                      }),
                      $$slots: { default: true }
                    });
                    $$renderer6.push(`<!----> <!--[-->`);
                    const each_array_1 = ensure_array_like(Array(totalAgentPages));
                    for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
                      each_array_1[i];
                      const pageNum = i + 1;
                      PaginationItem($$renderer6, {
                        active: agentsCurrentPage === pageNum && agents.length > 0,
                        disabled: agents.length === 0 && pageNum > 1,
                        children: prevent_snippet_stringification(($$renderer7) => {
                          PaginationLink($$renderer7, {
                            href: "#",
                            children: prevent_snippet_stringification(($$renderer8) => {
                              $$renderer8.push(`<!---->${escape_html(pageNum)}`);
                            }),
                            $$slots: { default: true }
                          });
                        }),
                        $$slots: { default: true }
                      });
                    }
                    $$renderer6.push(`<!--]--> `);
                    PaginationItem($$renderer6, {
                      disabled: agentsCurrentPage === totalAgentPages || agents.length === 0,
                      children: prevent_snippet_stringification(($$renderer7) => {
                        PaginationLink($$renderer7, { next: true, href: "#" });
                      }),
                      $$slots: { default: true }
                    });
                    $$renderer6.push(`<!---->`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----></div>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!---->`);
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(` `);
        if (isEditModalOpen && selectedAgentForEdit) {
          $$renderer3.push("<!--[-->");
          AgentEditModal($$renderer3, {
            isOpen: isEditModalOpen,
            agent: selectedAgentForEdit,
            onSave: handleSaveAgentChanges,
            onClose: closeEditModal
          });
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> `);
        if (isGraphModalOpen && selectedAgentForGraph) {
          $$renderer3.push("<!--[-->");
          AgentGraphModal($$renderer3, {
            isOpen: isGraphModalOpen,
            agent: selectedAgentForGraph,
            onClose: closeGraphModal,
            executionData: streamEvents
          });
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> `);
        {
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
      if ($$store_subs) unsubscribe_stores($$store_subs);
    },
    AgentsTab
  );
}
AgentsTab.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  AgentsTab as A,
  Background as B,
  Controls as C,
  Handle as H,
  Minimap as M,
  Panel as P,
  SvelteFlow as S,
  useSvelteFlow as u
};
