import { g as attr_style, f as stringify, p as prevent_snippet_stringification, b as attr, e as ensure_array_like, c as bind_props, d as attr_class, a as store_get, u as unsubscribe_stores } from "../../../../../chunks/index2.js";
import { a4 as fallback, a3 as FILENAME } from "../../../../../chunks/utils2.js";
import { p as push_element, a as pop_element } from "../../../../../chunks/dev.js";
import { R as Row, j as Col, M as Modal, n as ModalHeader, o as ModalBody, S as Spinner, s as ModalFooter, B as Button, i as Container, p as FormGroup, L as Label, g as Input, D as Dropdown, d as DropdownToggle, e as DropdownMenu, f as DropdownItem, I as Icon } from "../../../../../chunks/Tooltip.js";
import { diffLines, diffWords } from "diff";
import { e as escape_html } from "../../../../../chunks/context.js";
import { l as llmConfigStore, L as LlmConfigSelector } from "../../../../../chunks/LlmConfigSelector.js";
import { g as get } from "../../../../../chunks/index.js";
import { u as userStore } from "../../../../../chunks/userStore.js";
import { r as runtimeConfig } from "../../../../../chunks/runtime-config.js";
import { t as toasts } from "../../../../../chunks/toastStore.js";
import { T as ToastNotifications } from "../../../../../chunks/ToastNotifications.js";
import { g as goto } from "../../../../../chunks/client.js";
LineCompare[FILENAME] = "src/lib/components/code-conversion/LineCompare.svelte";
function LineCompare($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let oldText = $$props["oldText"];
      let newText = $$props["newText"];
      let removedColor = fallback($$props["removedColor"], "red");
      let addedColor = fallback($$props["addedColor"], "limegreen");
      let replacedColor = fallback($$props["replacedColor"], "yellow");
      let emptyColor = fallback($$props["emptyColor"], "lightgrey");
      let backgroundColor = fallback($$props["backgroundColor"], "white");
      let input = fallback($$props["input"], "Oracle");
      let output = fallback($$props["output"], "SQL Server");
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
      function getLogoPath(language) {
        switch (language) {
          case "Oracle":
            return "/images/oracle.png";
          case "SQL Server":
            return "/images/sqlserver.png";
          case "Sybase":
            return "/images/sybase.png";
          case "PostgreSQL":
            return "/images/PostgreSQL-Logo.png";
          default:
            return "";
        }
      }
      if (oldText && newText) {
        oldText = oldText.replace(/\r/g, "");
        newText = newText.replace(/\r/g, "");
        myChangeLineArray = myDiffLines(oldText, newText);
      }
      $$renderer2.push(`<div${attr_style(`background-color: ${stringify(backgroundColor)};`)}>`);
      push_element($$renderer2, "div", 103, 0);
      Row($$renderer2, {
        children: prevent_snippet_stringification(($$renderer3) => {
          Col($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<div class="d-flex align-items-center">`);
              push_element($$renderer4, "div", 106, 12);
              $$renderer4.push(`<h3 class="fs-3 fw-bold me-3">`);
              push_element($$renderer4, "h3", 107, 16);
              $$renderer4.push(`Original:</h3>`);
              pop_element();
              $$renderer4.push(` `);
              if (getLogoPath(input)) {
                $$renderer4.push("<!--[-->");
                $$renderer4.push(`<img id="logo" class="image fade-in svelte-12uwaoa"${attr("src", getLogoPath(input))}${attr("alt", `${stringify(input)} logo`)}/>`);
                push_element($$renderer4, "img", 109, 20);
                pop_element();
              } else {
                $$renderer4.push("<!--[!-->");
              }
              $$renderer4.push(`<!--]--></div>`);
              pop_element();
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Col($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<div class="d-flex align-items-center">`);
              push_element($$renderer4, "div", 114, 12);
              $$renderer4.push(`<h3 class="fs-3 fw-bold me-3">`);
              push_element($$renderer4, "h3", 115, 16);
              $$renderer4.push(`Remediated:</h3>`);
              pop_element();
              $$renderer4.push(` `);
              if (getLogoPath(output)) {
                $$renderer4.push("<!--[-->");
                $$renderer4.push(`<img id="logo" class="image fade-in svelte-12uwaoa"${attr("src", getLogoPath(output))}${attr("alt", `${stringify(output)} logo`)}/>`);
                push_element($$renderer4, "img", 117, 20);
                pop_element();
              } else {
                $$renderer4.push("<!--[!-->");
              }
              $$renderer4.push(`<!--]--></div>`);
              pop_element();
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!---->`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> <!--[-->`);
      const each_array = ensure_array_like(myChangeLineArray);
      for (let $$index_2 = 0, $$length = each_array.length; $$index_2 < $$length; $$index_2++) {
        let myChangeLine = each_array[$$index_2];
        Row($$renderer2, {
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<div class="col w-50 content svelte-12uwaoa"${attr_style(`background-color: ${stringify(color.oldText[myChangeLine.changeType])}`)}>`);
            push_element($$renderer3, "div", 124, 12);
            $$renderer3.push(`<!--[-->`);
            const each_array_1 = ensure_array_like(myChangeLine.oldText);
            for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
              let oldTextObj = each_array_1[$$index];
              if (oldTextObj.removed) {
                $$renderer3.push("<!--[-->");
                $$renderer3.push(`<mark${attr_style(`background-color: ${stringify(removedColor)};`)}>`);
                push_element($$renderer3, "mark", 127, 24);
                $$renderer3.push(`${escape_html(oldTextObj.text)}</mark>`);
                pop_element();
              } else {
                $$renderer3.push("<!--[!-->");
                $$renderer3.push(`${escape_html(oldTextObj.text)}`);
              }
              $$renderer3.push(`<!--]-->`);
            }
            $$renderer3.push(`<!--]--></div>`);
            pop_element();
            $$renderer3.push(` <div class="col w-50 content svelte-12uwaoa"${attr_style(`background-color: ${stringify(color.newText[myChangeLine.changeType])}`)}>`);
            push_element($$renderer3, "div", 133, 12);
            $$renderer3.push(`<!--[-->`);
            const each_array_2 = ensure_array_like(myChangeLine.newText);
            for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
              let newTextObj = each_array_2[$$index_1];
              if (newTextObj.added) {
                $$renderer3.push("<!--[-->");
                $$renderer3.push(`<mark${attr_style(`background-color: ${stringify(addedColor)};`)}>`);
                push_element($$renderer3, "mark", 136, 24);
                $$renderer3.push(`${escape_html(newTextObj.text)}</mark>`);
                pop_element();
              } else {
                $$renderer3.push("<!--[!-->");
                $$renderer3.push(`${escape_html(newTextObj.text)}`);
              }
              $$renderer3.push(`<!--]-->`);
            }
            $$renderer3.push(`<!--]--></div>`);
            pop_element();
          }),
          $$slots: { default: true }
        });
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      bind_props($$props, {
        oldText,
        newText,
        removedColor,
        addedColor,
        replacedColor,
        emptyColor,
        backgroundColor,
        input,
        output
      });
    },
    LineCompare
  );
}
LineCompare.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
CostEstimationModal[FILENAME] = "src/components/common/CostEstimationModal.svelte";
function CostEstimationModal($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let isEstimationMode, isResultsMode;
      let isOpen = fallback($$props["isOpen"], false);
      let isLoading = fallback($$props["isLoading"], false);
      let mode = fallback($$props["mode"], "estimation");
      let inputTokens = fallback($$props["inputTokens"], null);
      let promptTokens = fallback($$props["promptTokens"], null);
      let sqlCodeTokens = fallback($$props["sqlCodeTokens"], null);
      let projectedOutputTokens = fallback($$props["projectedOutputTokens"], null);
      let projectedCost = fallback($$props["projectedCost"], null);
      let estimationError = fallback($$props["estimationError"], null);
      let actualOutputTokens = fallback($$props["actualOutputTokens"], null);
      let actualCost = fallback($$props["actualCost"], null);
      let timeTaken = fallback($$props["timeTaken"], null);
      let onConfirm = fallback($$props["onConfirm"], () => {
      });
      let onCancel = fallback($$props["onCancel"], () => {
      });
      function handleCancel() {
        onCancel();
      }
      isEstimationMode = mode === "estimation";
      isResultsMode = mode === "results";
      if (isOpen) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="cost-modal-dim svelte-1o4tdh3" aria-hidden="true">`);
        push_element($$renderer2, "div", 29, 4);
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      Modal($$renderer2, {
        isOpen,
        toggle: handleCancel,
        centered: true,
        backdrop: false,
        container: "inline",
        modalClassName: "show cost-estimation-modal",
        fade: false,
        children: prevent_snippet_stringification(($$renderer3) => {
          ModalHeader($$renderer3, {
            toggle: handleCancel,
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<!---->${escape_html(isEstimationMode ? "Cost Estimation" : "Conversion Results")}`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          ModalBody($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              if (isLoading) {
                $$renderer4.push("<!--[-->");
                $$renderer4.push(`<div class="text-center">`);
                push_element($$renderer4, "div", 46, 12);
                Spinner($$renderer4, { color: "primary", class: "mb-2" });
                $$renderer4.push(`<!----> <p>`);
                push_element($$renderer4, "p", 48, 16);
                $$renderer4.push(`Calculating token counts and cost...</p>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
              } else if (estimationError && isEstimationMode) {
                $$renderer4.push("<!--[1-->");
                $$renderer4.push(`<div class="alert alert-danger" role="alert">`);
                push_element($$renderer4, "div", 51, 12);
                $$renderer4.push(`<strong>`);
                push_element($$renderer4, "strong", 52, 16);
                $$renderer4.push(`Error:</strong>`);
                pop_element();
                $$renderer4.push(` ${escape_html(estimationError)}</div>`);
                pop_element();
              } else {
                $$renderer4.push("<!--[!-->");
                $$renderer4.push(`<div class="cost-estimation-container svelte-1o4tdh3">`);
                push_element($$renderer4, "div", 55, 12);
                $$renderer4.push(`<div class="estimation-row svelte-1o4tdh3">`);
                push_element($$renderer4, "div", 56, 16);
                $$renderer4.push(`<div class="svelte-1o4tdh3">`);
                push_element($$renderer4, "div", 57, 20);
                $$renderer4.push(`Total Input Tokens:</div>`);
                pop_element();
                $$renderer4.push(` <span class="value svelte-1o4tdh3">`);
                push_element($$renderer4, "span", 58, 20);
                $$renderer4.push(`${escape_html(inputTokens !== null ? inputTokens.toLocaleString() : "N/A")}</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="estimation-row sub-row svelte-1o4tdh3">`);
                push_element($$renderer4, "div", 60, 16);
                $$renderer4.push(`<div class="svelte-1o4tdh3">`);
                push_element($$renderer4, "div", 61, 20);
                $$renderer4.push(`└─ Prompt Tokens:</div>`);
                pop_element();
                $$renderer4.push(` <span class="value svelte-1o4tdh3">`);
                push_element($$renderer4, "span", 62, 20);
                $$renderer4.push(`${escape_html(promptTokens !== null ? promptTokens.toLocaleString() : "N/A")}</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="estimation-row sub-row svelte-1o4tdh3">`);
                push_element($$renderer4, "div", 64, 16);
                $$renderer4.push(`<div class="svelte-1o4tdh3">`);
                push_element($$renderer4, "div", 65, 20);
                $$renderer4.push(`└─ SQL Code Tokens:</div>`);
                pop_element();
                $$renderer4.push(` <span class="value svelte-1o4tdh3">`);
                push_element($$renderer4, "span", 66, 20);
                $$renderer4.push(`${escape_html(sqlCodeTokens !== null ? sqlCodeTokens.toLocaleString() : "N/A")}</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="estimation-row svelte-1o4tdh3">`);
                push_element($$renderer4, "div", 68, 16);
                $$renderer4.push(`<div class="svelte-1o4tdh3">`);
                push_element($$renderer4, "div", 69, 20);
                $$renderer4.push(`${escape_html(isEstimationMode ? "Projected" : "Actual")} Output Tokens:</div>`);
                pop_element();
                $$renderer4.push(` <span class="value svelte-1o4tdh3">`);
                push_element($$renderer4, "span", 70, 20);
                if (isEstimationMode) {
                  $$renderer4.push("<!--[-->");
                  $$renderer4.push(`${escape_html(projectedOutputTokens !== null ? projectedOutputTokens.toLocaleString() : "N/A")}`);
                } else {
                  $$renderer4.push("<!--[!-->");
                  $$renderer4.push(`${escape_html(actualOutputTokens !== null ? actualOutputTokens.toLocaleString() : "N/A")}`);
                }
                $$renderer4.push(`<!--]--></span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` `);
                if (isResultsMode && timeTaken !== null) {
                  $$renderer4.push("<!--[-->");
                  $$renderer4.push(`<div class="estimation-row svelte-1o4tdh3">`);
                  push_element($$renderer4, "div", 80, 20);
                  $$renderer4.push(`<div class="svelte-1o4tdh3">`);
                  push_element($$renderer4, "div", 81, 24);
                  $$renderer4.push(`Time Taken:</div>`);
                  pop_element();
                  $$renderer4.push(` <span class="value svelte-1o4tdh3">`);
                  push_element($$renderer4, "span", 82, 24);
                  $$renderer4.push(`${escape_html(timeTaken.toFixed(2))} seconds</span>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                } else {
                  $$renderer4.push("<!--[!-->");
                }
                $$renderer4.push(`<!--]--> <hr/>`);
                push_element($$renderer4, "hr", 86, 16);
                pop_element();
                $$renderer4.push(` <div class="estimation-row total svelte-1o4tdh3">`);
                push_element($$renderer4, "div", 87, 16);
                $$renderer4.push(`<div class="svelte-1o4tdh3">`);
                push_element($$renderer4, "div", 88, 20);
                $$renderer4.push(`<strong>`);
                push_element($$renderer4, "strong", 88, 25);
                $$renderer4.push(`${escape_html(isEstimationMode ? "Estimated" : "Actual")} Cost:</strong>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <span class="value svelte-1o4tdh3">`);
                push_element($$renderer4, "span", 89, 20);
                $$renderer4.push(`<strong>`);
                push_element($$renderer4, "strong", 90, 24);
                if (isEstimationMode) {
                  $$renderer4.push("<!--[-->");
                  $$renderer4.push(`${escape_html(projectedCost !== null ? projectedCost : "N/A")}`);
                } else {
                  $$renderer4.push("<!--[!-->");
                  $$renderer4.push(`${escape_html(actualCost !== null ? actualCost : "N/A")}`);
                }
                $$renderer4.push(`<!--]--> USD</strong>`);
                pop_element();
                $$renderer4.push(`</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` `);
                if (isEstimationMode) {
                  $$renderer4.push("<!--[-->");
                  $$renderer4.push(`<small class="text-muted d-block mt-3">`);
                  push_element($$renderer4, "small", 102, 20);
                  $$renderer4.push(`* Projected output tokens are estimated based on typical SQL conversion patterns.</small>`);
                  pop_element();
                  $$renderer4.push(` <small class="text-muted d-block">`);
                  push_element($$renderer4, "small", 105, 20);
                  $$renderer4.push(`* The actual cost will be calculated based on the exact output token count once the conversion completes.</small>`);
                  pop_element();
                } else {
                  $$renderer4.push("<!--[!-->");
                }
                $$renderer4.push(`<!--]--></div>`);
                pop_element();
              }
              $$renderer4.push(`<!--]-->`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          ModalFooter($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              if (isEstimationMode) {
                $$renderer4.push("<!--[-->");
                Button($$renderer4, {
                  color: "secondary",
                  disabled: isLoading,
                  children: prevent_snippet_stringification(($$renderer5) => {
                    $$renderer5.push(`<!---->Cancel`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!----> `);
                Button($$renderer4, {
                  color: "primary",
                  disabled: isLoading || estimationError !== null,
                  children: prevent_snippet_stringification(($$renderer5) => {
                    $$renderer5.push(`<!---->Proceed with Conversion`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!---->`);
              } else {
                $$renderer4.push("<!--[!-->");
                Button($$renderer4, {
                  color: "primary",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    $$renderer5.push(`<!---->Close`);
                  }),
                  $$slots: { default: true }
                });
              }
              $$renderer4.push(`<!--]-->`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!---->`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!---->`);
      bind_props($$props, {
        isOpen,
        isLoading,
        mode,
        inputTokens,
        promptTokens,
        sqlCodeTokens,
        projectedOutputTokens,
        projectedCost,
        estimationError,
        actualOutputTokens,
        actualCost,
        timeTaken,
        onConfirm,
        onCancel
      });
    },
    CostEstimationModal
  );
}
CostEstimationModal.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
const availableLanguages = [
  { name: "SQL Server", displayName: "MS SQL Server", logoPath: "/images/sqlserver.png" },
  { name: "Oracle", displayName: "Oracle", logoPath: "/images/oracle.png" },
  { name: "PostgreSQL", displayName: "PostgreSQL", logoPath: "/images/PostgreSQL-Logo.png" },
  { name: "Sybase", displayName: "Sybase", logoPath: "/images/sybase.png" }
];
const conversionPrompts = {
  "Default": {
    "Default": `You are an expert SQL developer, familiar with both {input_language} and {target_language}.
You have been tasked with converting {input_language} SQL code into {target_language} SQL code.
While converting retain the business logic, name, order, comments, variable names, object names.
While converting assume the DB objects exists already.  Output should  be optimized for performance.
INCLUDE THE ENTIRE CODE CHUNK IN THE RESPONSE.`
  },
  "Oracle_SQL Server": {
    "Complex Procedure": `Convert the Oracle stored procedure into a SQL Server stored procedure while ensuring that the functionality remains consistent.

Formatting Considerations:
    Comments: Comments, denoted by -- or ** blocks, should be preserved across the conversion.
    Naming Conventions: Ensure that all table names, column names, variables, and other identifiers are properly converted and retained.
    Descriptions: Ensure all descriptions, comments, and metadata are properly converted and strictly retained. Specifically, make sure to retain specific characters such as '$', etc.
    Newline Characters: Handle newline characters ("\\n") appropriately. They should not be added at the end of variable declarations or in the middle of statements.
    Indentation: Maintain proper indentation for readability and consistency.

Performance Tuning Considerations:
    Reducing Table Size: Filter data to include only the observations needed for the procedure.
    Reduce Join Complexity: Filter the tables before joining them to reduce the number of rows processed.
    Temporary Tables: Use temporary tables to store intermediate results and reduce the number of times data is read from disk.

Conversion Considerations:
    PL/SQL syntax to T-SQL syntax: Ensure proper translation of Oracle's PL/SQL constructs into SQL Server's T-SQL.
    Data types: Convert Oracle-specific data types (e.g., NUMBER, VARCHAR2, DATE) into their SQL Server equivalents (e.g., DECIMAL, VARCHAR, DATETIME).
    Error handling: Replace Oracle's EXCEPTION handling with SQL Server's TRY...CATCH mechanism. Retain the error messages and any other specific logic.
    Sequences: If the Oracle procedure uses sequences (e.g., sequence_name.NEXTVAL), replace them with SQL Server identity columns or SEQUENCE objects.
    Cursors and loops: If cursors and loops are used in the procedure, convert them to SQL Server's equivalent syntax.
    Transaction control: Convert Oracle's transaction control (e.g., COMMIT, ROLLBACK) to SQL Server's.
    OUT parameters: Translate Oracle's IN OUT and OUT parameters to SQL Server's equivalent.`,
    "Complex Statement": `Convert the Oracle statement into a SQL Server statement while ensuring that the functionality remains consistent.

Formatting Considerations:
    Comments: Comments, denoted by -- or ** blocks, should be preserved across the conversion.
    Naming Conventions: Ensure that all table names, column names, variables, and other identifiers are properly converted and retained.
    Descriptions: Ensure all descriptions, comments, and metadata are properly converted and strictly retained. Specifically, make sure to retain specific characters such as '$', etc.
    Newline Characters: Handle newline characters ("\\n") appropriately. They should not be added at the end of variable declarations or in the middle of statements.
    Indentation: Maintain proper indentation for readability and consistency.

Performance Tuning Considerations:
    Reducing Table Size: Filter data to include only the observations needed for the procedure.
    Reduce Join Complexity: Filter the tables before joining them to reduce the number of rows processed.
    Temporary Tables: Use temporary tables to store intermediate results and reduce the number of times data is read from disk.

Conversion Considerations:
    Data types: Convert Oracle-specific data types (e.g., NUMBER, VARCHAR2, DATE) into their SQL Server equivalents (e.g., DECIMAL, VARCHAR, DATETIME).
    Functions: Replace Oracle's specific functions with SQL Server equivalents (e.g., NVL with ISNULL, TO_CHAR with CONVERT).
    Joins: Ensure proper join syntax conversion, especially for outer joins (Oracle's (+) operator to SQL Server's LEFT/RIGHT JOIN).
    Date functions: Convert Oracle's date functions (e.g., SYSDATE) to SQL Server's (e.g., GETDATE()).
    String functions: Convert Oracle's string functions (e.g., SUBSTR) to SQL Server's (e.g., SUBSTRING).`,
    "Simple Statement": `Convert the Oracle statement into a SQL Server statement while ensuring that the functionality remains consistent.

Key Areas:
    Data types: Convert Oracle-specific data types to SQL Server equivalents.
    Functions: Replace Oracle functions with SQL Server equivalents.
    Joins: Convert Oracle join syntax to ANSI standard.
    Date handling: Replace Oracle date functions with SQL Server equivalents.`,
    "Default": `You are an expert SQL developer, familiar with both Oracle and SQL Server.
You have been tasked with converting Oracle SQL code into SQL Server SQL code.
While converting retain the business logic, name, order, comments, variable names, object names.
While converting assume the DB objects exists already. Output should be optimized for performance.
INCLUDE THE ENTIRE CODE CHUNK IN THE RESPONSE.`
  },
  "Sybase_SQL Server": {
    "Complex Procedure": `Convert the Sybase stored procedure into a SQL Server stored procedure while ensuring that the functionality remains consistent.

Formatting Considerations:
    Comments: Comments, denoted by -- or ** blocks, should be preserved across the conversion.
    Naming Conventions: Ensure that all table names, column names, variables, and other identifiers are properly converted and retained.
    Descriptions: Ensure all descriptions, comments, and metadata are properly converted and strictly retained.
    Newline Characters: Handle newline characters appropriately.
    Indentation: Maintain proper indentation for readability and consistency.

Conversion Considerations:
    Stored procedure syntax: Convert Sybase procedure syntax to SQL Server T-SQL.
    Data types: Convert Sybase-specific data types to SQL Server equivalents.
    Error handling: Convert Sybase error handling to SQL Server TRY...CATCH.
    Transaction control: Ensure proper transaction handling conversion.
    Variable declarations: Convert Sybase variable syntax to SQL Server.`,
    "Default": `You are an expert SQL developer, familiar with both Sybase and SQL Server.
You have been tasked with converting Sybase SQL code into SQL Server SQL code.
While converting retain the business logic, name, order, comments, variable names, object names.
While converting assume the DB objects exists already. Output should be optimized for performance.
INCLUDE THE ENTIRE CODE CHUNK IN THE RESPONSE.`
  }
};
function createLanguageConfigPromptStore() {
  const store = {};
  for (const inputLang of availableLanguages) {
    for (const targetLang of availableLanguages) {
      if (inputLang.name !== targetLang.name) {
        const key = `${inputLang.name}_${targetLang.name}`;
        const prompts = conversionPrompts[key] || conversionPrompts["Default"];
        store[key] = {
          original: prompts,
          current: Object.entries(prompts)[0][1]
        };
      }
    }
  }
  return store;
}
class CodeConversionService {
  static STREAM_URL = `${runtimeConfig.CODE_CONVERSION_URL}/sql/stream`;
  static WORKFLOW_URL = `${runtimeConfig.CODE_CONVERSION_URL}/sql/workflow`;
  static TOKENS_URL = `${runtimeConfig.API_BASE_URL}/api/util/get-tokens`;
  //Make sure this is supplied with two inputs: the input text and the llm name
  static LLM_PRICE_URL = `${runtimeConfig.API_BASE_URL}/api/util/get-llm-price`;
  /**
   * Gets the number of tokens for a given input using a specified LLM
   */
  static async getTokenCount(input, llmName) {
    const user = get(userStore);
    const token = user?.token;
    if (!token) {
      console.error("No auth token available for getTokenCount");
      throw new Error("Authentication required");
    }
    try {
      const response = await fetch(this.TOKENS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          input,
          llm: llmName
        })
      });
      if (!response.ok) {
        throw new Error(`Failed to get token count: ${response.status}`);
      }
      const data = await response.json();
      return data.num_tokens || 0;
    } catch (error) {
      console.error("Error getting token count:", error);
      throw error;
    }
  }
  /**
   * Gets the pricing information for a specified LLM
   */
  static async getLlmPrice(llmName) {
    const user = get(userStore);
    const token = user?.token;
    if (!token) {
      console.error("No auth token available for getLlmPrice");
      throw new Error("Authentication required");
    }
    try {
      const response = await fetch(this.LLM_PRICE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          llm: llmName
        })
      });
      if (!response.ok) {
        throw new Error(`Failed to get LLM price: ${response.status}`);
      }
      const data = await response.json();
      return {
        cost_per_input_token: data.cost_per_input_token || 0,
        cost_per_output_token: data.cost_per_output_token || 0
      };
    } catch (error) {
      console.error("Error getting LLM price:", error);
      throw error;
    }
  }
  /**
   * Converts code from one SQL language to another using streaming response
   * Uses llmConfigStore for configuration management
   */
  static async convertCodeStream(request, accessKey, configId, controller) {
    const requestBody = this.buildRequestBody(request, accessKey, configId);
    return fetch(CodeConversionService.STREAM_URL, {
      method: "POST",
      signal: controller?.signal,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });
  }
  /**
   * Executes SQL workflow conversion using non-streaming response
   * Uses workflow endpoint for batch processing
   */
  static async convertCodeWorkflow(request, accessKey, configId, controller) {
    const requestBody = this.buildWorkflowRequestBody(request, accessKey, configId);
    return fetch(CodeConversionService.WORKFLOW_URL, {
      method: "POST",
      signal: controller?.signal,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });
  }
  /**
   * Builds the request body using llmConfigStore
   */
  static buildRequestBody(request, accessKey, configId) {
    const llmConfig = llmConfigStore.getApiConfig(configId);
    return {
      access_key: {
        access_key: accessKey
      },
      llm_config: llmConfig,
      sql_convert: {
        sql_code: request.code,
        source_dialect: request.input_language,
        target_dialect: request.target_language,
        specific_instructions: request.prompt,
        add_explanation: request.add_explanation
      }
    };
  }
  /**
   * Builds the workflow request body using llmConfigStore
   */
  static buildWorkflowRequestBody(request, accessKey, configId) {
    const llmConfig = llmConfigStore.getApiConfig(configId);
    return {
      access_key: {
        access_key: accessKey
      },
      llm_config: llmConfig,
      sql_workflow: {
        sql_code: request.sql_code,
        source_dialect: request.source_dialect,
        target_dialect: request.target_dialect,
        specific_instructions: request.specific_instructions
      }
    };
  }
  /**
   * Processes streaming response from code conversion API
   * Follows agentService pattern for consistency and extensibility
   */
  static async processStreamResponse(body, onChunk, onComplete, onError) {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = this.parseSSEEvents(buffer);
        for (const event of events) {
          const responseData = this.normalizeResponse(event);
          onChunk(responseData);
        }
        const lastEventIndex = buffer.lastIndexOf("\n\n");
        if (lastEventIndex !== -1) {
          buffer = buffer.substring(lastEventIndex + 2);
        }
      }
      onComplete();
    } catch (error) {
      console.error("Error processing stream:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      onError(`Stream processing error: ${errorMessage}`);
    } finally {
      reader.releaseLock();
    }
  }
  /**
   * Processes streaming workflow response
   * Uses the same streaming pattern as convertCodeStream but for workflow endpoint
   */
  static async processWorkflowResponse(body, onChunk, onComplete, onError) {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = this.parseSSEEvents(buffer);
        for (const event of events) {
          const responseData = this.normalizeResponse(event);
          onChunk(responseData);
        }
        const lastEventIndex = buffer.lastIndexOf("\n\n");
        if (lastEventIndex !== -1) {
          buffer = buffer.substring(lastEventIndex + 2);
        }
      }
      onComplete();
    } catch (error) {
      console.error("Error processing workflow stream:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      onError(`Workflow stream processing error: ${errorMessage}`);
    } finally {
      reader.releaseLock();
    }
  }
  /**
   * Parses SSE events similar to agentService pattern
   * More robust handling of event/data pairs
   */
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
      if (!eventType && eventData) {
        try {
          const parsedData = JSON.parse(eventData);
          events.push(parsedData);
        } catch (error) {
          console.error("Error parsing SSE event data:", error, eventData);
        }
      } else if (eventType && eventData) {
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
   * Normalizes different response formats to consistent CodeConversionResponse
   * Extensible design for supporting various backend formats
   */
  static normalizeResponse(parsedChunk) {
    if (parsedChunk.event_type === "workflow_completed" && parsedChunk.final_code !== void 0) {
      return {
        output: parsedChunk.final_code || "",
        tokens: {
          input: parsedChunk.workflow_metadata?.estimated_tokens || 0,
          output: 0
          // Not provided in workflow completion
        },
        time: parseFloat((parsedChunk.processing_time || 0).toFixed(2))
      };
    }
    const responseMappers = [
      this.mapPrimaryFormat,
      this.mapLegacyFormat,
      this.mapAlternativeFormats
    ];
    for (const mapper of responseMappers) {
      const result = mapper(parsedChunk);
      if (result) return result;
    }
    const fallbackContent = this.extractTextContent(parsedChunk);
    return {
      output: fallbackContent,
      tokens: { input: 0, output: 0 },
      time: 0
    };
  }
  /**
   * Maps primary backend response format (uses 'code' field)
   */
  static mapPrimaryFormat(chunk) {
    if (chunk.code === void 0) return null;
    return {
      output: chunk.code || "",
      tokens: {
        input: chunk.tokens?.input || 0,
        output: chunk.tokens?.output || 0
      },
      time: parseFloat((chunk.time || 0).toFixed(2)),
      ...chunk.explanation && chunk.explanation !== null && { explanation: chunk.explanation }
    };
  }
  /**
   * Maps legacy format with 'output' field and explanation separator
   */
  static mapLegacyFormat(chunk) {
    if (chunk.output === void 0) return null;
    const [output, explanation] = chunk.output.split(/\[=+\]/);
    return {
      output: output || "",
      tokens: {
        input: chunk.tokens?.input || 0,
        output: chunk.tokens?.output || 0
      },
      time: parseFloat((chunk.time || 0).toFixed(2)),
      ...explanation && { explanation }
    };
  }
  /**
   * Maps alternative response formats (content, data, message, text fields)
   */
  static mapAlternativeFormats(chunk) {
    const contentField = chunk.content || chunk.data || chunk.message || chunk.text;
    if (!contentField) return null;
    return {
      output: contentField,
      tokens: {
        input: chunk.tokens?.input || chunk.input_tokens || 0,
        output: chunk.tokens?.output || chunk.output_tokens || 0
      },
      time: parseFloat((chunk.time || chunk.elapsed_time || 0).toFixed(2))
    };
  }
  /**
   * Extracts any text content as fallback
   */
  static extractTextContent(chunk) {
    if (typeof chunk === "string") return chunk;
    if (chunk && typeof chunk === "object") {
      const textFields = ["final_code", "code", "output", "content", "data", "message", "text", "result"];
      for (const field of textFields) {
        if (chunk[field] && typeof chunk[field] === "string") {
          return chunk[field];
        }
      }
      return JSON.stringify(chunk);
    }
    return "";
  }
  /**
   * Utility methods for file operations and common tasks
   */
  /**
   * Validates response and handles common error scenarios
   * Extensible error handling for different response types
   */
  static validateResponse(response) {
    const validators = [
      () => response ? null : "No response from server",
      () => response.status === 401 ? "Unauthorized - please check your access key" : null,
      () => response.status === 429 ? "Rate limit exceeded - please try again later" : null,
      () => response.status === 500 ? "Internal server error - please try again" : null,
      () => response.status !== 200 ? `Server error: ${response.status} ${response.statusText}` : null,
      () => !response.body ? "No response body received" : null
    ];
    for (const validator of validators) {
      const error = validator();
      if (error) return { isValid: false, errorMessage: error };
    }
    return { isValid: true };
  }
  /**
   * Downloads content as a file
   */
  static downloadAsFile(content, filename = "output.sql") {
    if (!content) {
      throw new Error("No content to download");
    }
    const file = new File([content], filename, { type: "text/plain" });
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
  /**
   * Copies text to clipboard
   */
  static async copyToClipboard(text) {
    if (!text) {
      throw new Error("No text to copy");
    }
    await navigator.clipboard.writeText(text);
  }
  /**
   * Reads file content as text
   */
  static readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }
}
CodeConversion[FILENAME] = "src/lib/components/code-conversion/CodeConversion.svelte";
function CodeConversion($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let urlBase = $$props["urlBase"];
      let onUnauthorized = fallback($$props["onUnauthorized"], () => {
      });
      const removedColor = "#e8a095";
      const addedColor = "lightgreen";
      const replacedColor = "#e2e895";
      const emptyColor = "lightsteelblue";
      const backgroundColor = "white";
      const codeConversionLogo = "file-code";
      let selectedLlmConfig;
      llmConfigStore.activeConfig.subscribe((config) => {
        selectedLlmConfig = config;
      });
      let backendAccessKey = "gAAAAABpaq1KvYRhAAf1vOIIDYztdJd8VStSsAn2uERRiWsUHEXVAdjxQX5EP79q_YY-Pin68xpNcuIcoDrmVjKNfEsMgoLaUw==";
      let inputSqlLanguage = "Oracle";
      let targetSqlLanguage = "SQL Server";
      let selectedEndpoint = "stream";
      const endpointOptions = [
        {
          value: "stream",
          label: "Stream Conversion",
          description: "Real-time streaming response"
        },
        {
          value: "workflow",
          label: "Workflow Conversion",
          description: "Workflow-based processing"
        }
      ];
      let processing = false;
      let view = "input_only";
      let leftPanelWidth = 400;
      let isResizing = false;
      let sqlFileInput;
      let sqlContent = { inputContent: "", outputContent: "" };
      let addExplanation = false;
      let explanation = "";
      let customPrompt = "";
      let languageConfigPromptStore = createLanguageConfigPromptStore();
      let input_tokens;
      let output_tokens;
      let price;
      let time_taken = null;
      let processingStartTime = null;
      let displayTime = 0;
      let timerInterval = null;
      let showCostModal = false;
      let costModalLoading = false;
      let costModalMode = "estimation";
      let costEstimation = {
        inputTokens: null,
        promptTokens: null,
        sqlCodeTokens: null,
        projectedOutputTokens: null,
        projectedCost: null,
        costPerInputToken: 0,
        costPerOutputToken: 0
      };
      let costEstimationError = null;
      let pendingConversionRequest = null;
      let controller = new AbortController();
      function openResultsModal() {
        costModalMode = "results";
        showCostModal = true;
      }
      function closeCostModal() {
        showCostModal = false;
        costEstimationError = null;
        pendingConversionRequest = null;
      }
      async function proceedWithConversion() {
        const request = pendingConversionRequest;
        closeCostModal();
        if (!request) {
          toasts.push({ message: "Conversion request was lost", color: "danger" });
          return;
        }
        try {
          time_taken = 0;
          displayTime = 0;
          processingStartTime = Date.now();
          processing = true;
          resetSqlContent();
          view = "output_only";
          timerInterval = window.setInterval(
            () => {
              if (processingStartTime) {
                displayTime = (Date.now() - processingStartTime) / 1e3;
              }
            },
            100
          );
          await ConversionManager.execute(request, backendAccessKey, urlBase, selectedLlmConfig.id, controller, selectedEndpoint, {
            onChunk: handleChunk,
            onComplete: handleComplete,
            onError: handleError
          });
        } catch (error) {
          console.error("Conversion error:", error);
          if (error instanceof Error && error.message.includes("401")) {
            onUnauthorized();
          }
          toasts.push({
            message: error instanceof Error ? error.message : "Conversion failed",
            color: "danger"
          });
        } finally {
          if (timerInterval !== null) {
            clearInterval(timerInterval);
            timerInterval = null;
          }
          processingStartTime = null;
          processing = false;
          if (output_tokens && input_tokens && price) {
            openResultsModal();
          }
        }
      }
      class ConversionManager {
        static async execute(request, backendKey, urlBase2, configId, controller2, endpoint, callbacks) {
          let response;
          if (endpoint === "stream") {
            response = await CodeConversionService.convertCodeStream(request, backendKey, configId, controller2);
            const validation = CodeConversionService.validateResponse(response);
            if (!validation.isValid) {
              throw new Error(validation.errorMessage);
            }
            await CodeConversionService.processStreamResponse(response.body, callbacks.onChunk, callbacks.onComplete, callbacks.onError);
          } else {
            const workflowRequest = {
              sql_code: request.code,
              source_dialect: request.input_language,
              target_dialect: request.target_language,
              specific_instructions: request.prompt
            };
            response = await CodeConversionService.convertCodeWorkflow(workflowRequest, backendKey, configId, controller2);
            const validation = CodeConversionService.validateResponse(response);
            if (!validation.isValid) {
              throw new Error(validation.errorMessage);
            }
            await CodeConversionService.processWorkflowResponse(response.body, callbacks.onChunk, callbacks.onComplete, callbacks.onError);
          }
        }
        static buildRequest(content, inputLang, targetLang, prompt, explanation2) {
          return {
            code: content,
            debug: false,
            input_language: inputLang,
            target_language: targetLang,
            prompt,
            add_explanation: explanation2
          };
        }
      }
      class ResponseHandler {
        static updateResults(data, outputSetter, explanationSetter) {
          outputSetter(data.output);
          if (data.explanation) {
            explanationSetter(data.explanation);
          }
        }
        static updateTokens(data, inputTokenSetter, outputTokenSetter) {
          inputTokenSetter(data.tokens.input);
          outputTokenSetter(data.tokens.output);
        }
        static updateTiming(data, timeSetter) {
          timeSetter(data.time);
        }
      }
      function handleChunk(data) {
        ResponseHandler.updateResults(
          data,
          (content) => {
            sqlContent.outputContent = content;
          },
          (exp) => {
            explanation = exp;
          }
        );
        ResponseHandler.updateTokens(
          data,
          (tokens) => {
            input_tokens = tokens;
          },
          (tokens) => {
            output_tokens = tokens;
          }
        );
        ResponseHandler.updateTiming(data, (time) => {
          time_taken = time;
        });
        if (output_tokens && input_tokens) {
          const actualInputCost = input_tokens * costEstimation.costPerInputToken;
          const actualOutputCost = output_tokens * costEstimation.costPerOutputToken;
          const actualTotalCost = actualInputCost + actualOutputCost;
          price = actualTotalCost.toFixed(6);
        }
      }
      function handleComplete() {
      }
      function handleError(reason) {
        toasts.push({ message: `Conversion failed: ${reason}`, color: "danger" });
      }
      function resetSqlContent() {
        sqlContent = { inputContent: sqlContent.inputContent, outputContent: "" };
        explanation = "";
      }
      function getAvailableLanguagesExcept(except) {
        return availableLanguages.filter((lang) => lang.name !== except);
      }
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        Container($$renderer3, {
          fluid: true,
          class: "conversion-container",
          children: prevent_snippet_stringification(($$renderer4) => {
            CostEstimationModal($$renderer4, {
              isOpen: showCostModal,
              isLoading: costModalLoading,
              mode: costModalMode,
              inputTokens: costEstimation.inputTokens,
              promptTokens: costEstimation.promptTokens,
              sqlCodeTokens: costEstimation.sqlCodeTokens,
              projectedOutputTokens: costEstimation.projectedOutputTokens,
              projectedCost: costEstimation.projectedCost,
              actualOutputTokens: output_tokens,
              actualCost: price,
              timeTaken: displayTime,
              estimationError: costEstimationError,
              onConfirm: proceedWithConversion,
              onCancel: closeCostModal
            });
            $$renderer4.push(`<!----> <div${attr_class("conversion-layout svelte-u25rbc", void 0, { "resizing": isResizing })}>`);
            push_element($$renderer4, "div", 499, 4);
            $$renderer4.push(`<div class="panel-group svelte-u25rbc">`);
            push_element($$renderer4, "div", 500, 8);
            $$renderer4.push(`<div class="conversion-panel svelte-u25rbc"${attr_style(`width: ${leftPanelWidth}px;`)}>`);
            push_element($$renderer4, "div", 501, 12);
            $$renderer4.push(`<div class="conversion-panel-content svelte-u25rbc">`);
            push_element($$renderer4, "div", 502, 16);
            FormGroup($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                Label($$renderer5, {
                  for: "input_sql_file",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->Upload SQL file:`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> `);
                Input($$renderer5, {
                  type: "file",
                  id: "input_sql_file",
                  get files() {
                    return sqlFileInput;
                  },
                  set files($$value) {
                    sqlFileInput = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!---->`);
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> <div class="mb-3">`);
            push_element($$renderer4, "div", 509, 20);
            Label($$renderer4, {
              for: "llmConfigSelect",
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<!---->LLM Configuration <span class="text-danger">`);
                push_element($$renderer5, "span", 512, 28);
                $$renderer5.push(`*</span>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> <div class="llm-config-wrapper svelte-u25rbc">`);
            push_element($$renderer4, "div", 514, 24);
            LlmConfigSelector($$renderer4, { placeholder: "Select LLM configuration" });
            $$renderer4.push(`<!----></div>`);
            pop_element();
            $$renderer4.push(`</div>`);
            pop_element();
            $$renderer4.push(` `);
            FormGroup($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                Label($$renderer5, {
                  for: "backendAccessKey",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->Access Key:`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> <span class="text-danger">`);
                push_element($$renderer5, "span", 524, 24);
                $$renderer5.push(`*</span>`);
                pop_element();
                $$renderer5.push(` `);
                Input($$renderer5, {
                  type: "password",
                  id: "backendAccessKey",
                  get value() {
                    return backendAccessKey;
                  },
                  set value($$value) {
                    backendAccessKey = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!---->`);
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            FormGroup($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                Label($$renderer5, {
                  for: "endpointSelect",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->Conversion Endpoint:`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> `);
                Dropdown($$renderer5, {
                  direction: "down",
                  class: "mb-2",
                  id: "endpointSelect",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    DropdownToggle($$renderer6, {
                      caret: true,
                      class: "btn btn-styled btn-styled-primary w-100",
                      children: prevent_snippet_stringification(($$renderer7) => {
                        $$renderer7.push(`<!---->${escape_html(endpointOptions.find((opt) => opt.value === selectedEndpoint)?.label || "Select Endpoint")}`);
                      }),
                      $$slots: { default: true }
                    });
                    $$renderer6.push(`<!----> `);
                    DropdownMenu($$renderer6, {
                      style: "width: 100%;",
                      children: prevent_snippet_stringification(($$renderer7) => {
                        $$renderer7.push(`<!--[-->`);
                        const each_array = ensure_array_like(endpointOptions);
                        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                          let option = each_array[$$index];
                          DropdownItem($$renderer7, {
                            children: prevent_snippet_stringification(($$renderer8) => {
                              $$renderer8.push(`<div>`);
                              push_element($$renderer8, "div", 538, 40);
                              $$renderer8.push(`<strong>`);
                              push_element($$renderer8, "strong", 539, 44);
                              $$renderer8.push(`${escape_html(option.label)}</strong>`);
                              pop_element();
                              $$renderer8.push(` <br/>`);
                              push_element($$renderer8, "br", 540, 44);
                              pop_element();
                              $$renderer8.push(` <small class="text-muted">`);
                              push_element($$renderer8, "small", 541, 44);
                              $$renderer8.push(`${escape_html(option.description)}</small>`);
                              pop_element();
                              $$renderer8.push(`</div>`);
                              pop_element();
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
                $$renderer5.push(`<!---->`);
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> <hr/>`);
            push_element($$renderer4, "hr", 548, 20);
            pop_element();
            $$renderer4.push(` <label class="mb-2">`);
            push_element($$renderer4, "label", 550, 20);
            $$renderer4.push(`Select Initial and Target SQL Language:</label>`);
            pop_element();
            $$renderer4.push(` <span class="text-danger">`);
            push_element($$renderer4, "span", 551, 20);
            $$renderer4.push(`*</span>`);
            pop_element();
            $$renderer4.push(` <div class="d-flex align-items-center gap-2 mb-3">`);
            push_element($$renderer4, "div", 552, 20);
            Dropdown($$renderer4, {
              direction: "down",
              class: "flex-grow-1",
              id: "sql-dropdown",
              children: prevent_snippet_stringification(($$renderer5) => {
                DropdownToggle($$renderer5, {
                  caret: true,
                  class: "btn btn-styled btn-styled-primary w-100",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->${escape_html(inputSqlLanguage)}`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> `);
                DropdownMenu($$renderer5, {
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!--[-->`);
                    const each_array_1 = ensure_array_like(getAvailableLanguagesExcept(targetSqlLanguage));
                    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
                      let language = each_array_1[$$index_1];
                      DropdownItem($$renderer6, {
                        children: prevent_snippet_stringification(($$renderer7) => {
                          $$renderer7.push(`<!---->${escape_html(language.displayName)}`);
                        }),
                        $$slots: { default: true }
                      });
                    }
                    $$renderer6.push(`<!--]-->`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!---->`);
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Icon($$renderer4, { name: "arrow-right" });
            $$renderer4.push(`<!----> `);
            Dropdown($$renderer4, {
              direction: "down",
              class: "flex-grow-1",
              children: prevent_snippet_stringification(($$renderer5) => {
                DropdownToggle($$renderer5, {
                  caret: true,
                  class: "btn btn-styled btn-styled-primary w-100",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->${escape_html(targetSqlLanguage)}`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> `);
                DropdownMenu($$renderer5, {
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!--[-->`);
                    const each_array_2 = ensure_array_like(getAvailableLanguagesExcept(inputSqlLanguage));
                    for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
                      let language = each_array_2[$$index_2];
                      DropdownItem($$renderer6, {
                        children: prevent_snippet_stringification(($$renderer7) => {
                          $$renderer7.push(`<!---->${escape_html(language.displayName)}`);
                        }),
                        $$slots: { default: true }
                      });
                    }
                    $$renderer6.push(`<!--]-->`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!---->`);
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----></div>`);
            pop_element();
            $$renderer4.push(` <hr/>`);
            push_element($$renderer4, "hr", 577, 20);
            pop_element();
            $$renderer4.push(` `);
            if (input_tokens || output_tokens || price || time_taken) {
              $$renderer4.push("<!--[-->");
              if (input_tokens) {
                $$renderer4.push("<!--[-->");
                $$renderer4.push(`<div>`);
                push_element($$renderer4, "div", 581, 28);
                $$renderer4.push(`Input Tokens: <b>`);
                push_element($$renderer4, "b", 581, 47);
                $$renderer4.push(`${escape_html(input_tokens)}</b>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
              } else {
                $$renderer4.push("<!--[!-->");
              }
              $$renderer4.push(`<!--]--> `);
              if (output_tokens) {
                $$renderer4.push("<!--[-->");
                $$renderer4.push(`<div>`);
                push_element($$renderer4, "div", 584, 28);
                $$renderer4.push(`Output Tokens: <b>`);
                push_element($$renderer4, "b", 584, 48);
                $$renderer4.push(`${escape_html(output_tokens)}</b>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
              } else {
                $$renderer4.push("<!--[!-->");
              }
              $$renderer4.push(`<!--]--> `);
              if (price) {
                $$renderer4.push("<!--[-->");
                $$renderer4.push(`<div>`);
                push_element($$renderer4, "div", 587, 28);
                $$renderer4.push(`${escape_html(output_tokens ? "Actual" : "Estimated")} Price: <b>`);
                push_element($$renderer4, "b", 587, 81);
                $$renderer4.push(`$${escape_html(price)}</b>`);
                pop_element();
                $$renderer4.push(` USD</div>`);
                pop_element();
              } else {
                $$renderer4.push("<!--[!-->");
              }
              $$renderer4.push(`<!--]--> `);
              if (displayTime) {
                $$renderer4.push("<!--[-->");
                $$renderer4.push(`<div>`);
                push_element($$renderer4, "div", 590, 28);
                $$renderer4.push(`Time taken: <b>`);
                push_element($$renderer4, "b", 590, 45);
                $$renderer4.push(`${escape_html(displayTime.toFixed(2))}</b>`);
                pop_element();
                $$renderer4.push(` seconds</div>`);
                pop_element();
              } else {
                $$renderer4.push("<!--[!-->");
              }
              $$renderer4.push(`<!--]--> <hr/>`);
              push_element($$renderer4, "hr", 592, 24);
              pop_element();
            } else {
              $$renderer4.push("<!--[!-->");
            }
            $$renderer4.push(`<!--]--> <div>`);
            push_element($$renderer4, "div", 595, 20);
            if (processing) {
              $$renderer4.push("<!--[-->");
              $$renderer4.push(`<button class="panel-button panel-button-danger w-100 svelte-u25rbc">`);
              push_element($$renderer4, "button", 597, 28);
              $$renderer4.push(`Cancel</button>`);
              pop_element();
            } else if (view === "input_only") {
              $$renderer4.push("<!--[1-->");
              if (sqlContent && sqlContent.inputContent && sqlContent.inputContent !== "" && sqlContent.outputContent && sqlContent.outputContent !== "") {
                $$renderer4.push("<!--[-->");
                $$renderer4.push(`<button class="panel-button panel-button-secondary w-100 svelte-u25rbc">`);
                push_element($$renderer4, "button", 600, 32);
                $$renderer4.push(`View Output</button>`);
                pop_element();
              } else {
                $$renderer4.push("<!--[!-->");
              }
              $$renderer4.push(`<!--]-->`);
            } else if (view === "output_only") {
              $$renderer4.push("<!--[2-->");
              $$renderer4.push(`<div class="action-grid svelte-u25rbc">`);
              push_element($$renderer4, "div", 603, 28);
              $$renderer4.push(`<button class="panel-button panel-button-primary svelte-u25rbc">`);
              push_element($$renderer4, "button", 604, 32);
              $$renderer4.push(`Retry Conversion</button>`);
              pop_element();
              $$renderer4.push(` <button class="panel-button panel-button-secondary svelte-u25rbc">`);
              push_element($$renderer4, "button", 605, 32);
              $$renderer4.push(`Change Input</button>`);
              pop_element();
              $$renderer4.push(` <button class="panel-button panel-button-secondary svelte-u25rbc">`);
              push_element($$renderer4, "button", 606, 32);
              $$renderer4.push(`Copy Output</button>`);
              pop_element();
              $$renderer4.push(` <button class="panel-button panel-button-secondary svelte-u25rbc">`);
              push_element($$renderer4, "button", 607, 32);
              $$renderer4.push(`Download Output</button>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
            } else {
              $$renderer4.push("<!--[!-->");
              $$renderer4.push(`<div>`);
              push_element($$renderer4, "div", 610, 28);
              $$renderer4.push(`Unexpected Error</div>`);
              pop_element();
            }
            $$renderer4.push(`<!--]--></div>`);
            pop_element();
            $$renderer4.push(` <hr/>`);
            push_element($$renderer4, "hr", 613, 20);
            pop_element();
            $$renderer4.push(` `);
            Row($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<span>`);
                push_element($$renderer5, "span", 616, 24);
                $$renderer5.push(`Legend:</span>`);
                pop_element();
                $$renderer5.push(` <span>`);
                push_element($$renderer5, "span", 617, 24);
                $$renderer5.push(`<span${attr_style(`color:${stringify(removedColor)};`)}>`);
                push_element($$renderer5, "span", 617, 30);
                Icon($$renderer5, { name: "square-fill" });
                $$renderer5.push(`<!----></span>`);
                pop_element();
                $$renderer5.push(` - Removed</span>`);
                pop_element();
                $$renderer5.push(` <span>`);
                push_element($$renderer5, "span", 618, 24);
                $$renderer5.push(`<span${attr_style(`color:${stringify(addedColor)};`)}>`);
                push_element($$renderer5, "span", 618, 30);
                Icon($$renderer5, { name: "square-fill" });
                $$renderer5.push(`<!----></span>`);
                pop_element();
                $$renderer5.push(` - Added</span>`);
                pop_element();
                $$renderer5.push(` <span>`);
                push_element($$renderer5, "span", 619, 24);
                $$renderer5.push(`<span${attr_style(`color:${stringify(replacedColor)};`)}>`);
                push_element($$renderer5, "span", 619, 30);
                Icon($$renderer5, { name: "square-fill" });
                $$renderer5.push(`<!----></span>`);
                pop_element();
                $$renderer5.push(` - Replaced</span>`);
                pop_element();
                $$renderer5.push(` <span>`);
                push_element($$renderer5, "span", 620, 24);
                $$renderer5.push(`<span${attr_style(`color:${stringify(emptyColor)};`)}>`);
                push_element($$renderer5, "span", 620, 30);
                Icon($$renderer5, { name: "square-fill" });
                $$renderer5.push(`<!----></span>`);
                pop_element();
                $$renderer5.push(` - Empty</span>`);
                pop_element();
                $$renderer5.push(` <span>`);
                push_element($$renderer5, "span", 621, 24);
                $$renderer5.push(`<span${attr_style(`color:${stringify(backgroundColor)};`)}>`);
                push_element($$renderer5, "span", 621, 30);
                Icon($$renderer5, { name: "square-fill" });
                $$renderer5.push(`<!----></span>`);
                pop_element();
                $$renderer5.push(` - Background</span>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> <hr/>`);
            push_element($$renderer4, "hr", 623, 20);
            pop_element();
            $$renderer4.push(`</div>`);
            pop_element();
            $$renderer4.push(`</div>`);
            pop_element();
            $$renderer4.push(` <div class="resize-handle svelte-u25rbc" title="Drag to resize">`);
            push_element($$renderer4, "div", 626, 12);
            Icon($$renderer4, { name: "grip-vertical" });
            $$renderer4.push(`<!----></div>`);
            pop_element();
            $$renderer4.push(`</div>`);
            pop_element();
            $$renderer4.push(` <div class="conversion-main svelte-u25rbc">`);
            push_element($$renderer4, "div", 630, 8);
            $$renderer4.push(`<div class="header-section svelte-u25rbc">`);
            push_element($$renderer4, "div", 631, 12);
            $$renderer4.push(`<h2 class="svelte-u25rbc">`);
            push_element($$renderer4, "h2", 632, 16);
            Icon($$renderer4, { name: codeConversionLogo });
            $$renderer4.push(`<!----> SQL Code Conversion</h2>`);
            pop_element();
            $$renderer4.push(` <p class="text-muted">`);
            push_element($$renderer4, "p", 633, 16);
            $$renderer4.push(`Convert between SQL dialects using AI.</p>`);
            pop_element();
            $$renderer4.push(`</div>`);
            pop_element();
            $$renderer4.push(` <hr class="my-4"/>`);
            push_element($$renderer4, "hr", 635, 12);
            pop_element();
            $$renderer4.push(` `);
            if (sqlContent && sqlContent.inputContent && sqlContent.outputContent && sqlContent.inputContent !== "" && sqlContent.outputContent !== "" && view === "output_only") {
              $$renderer4.push("<!--[-->");
              $$renderer4.push(`<br/>`);
              push_element($$renderer4, "br", 643, 16);
              pop_element();
              $$renderer4.push(` `);
              Row($$renderer4, {
                children: prevent_snippet_stringification(($$renderer5) => {
                  Col($$renderer5, {
                    children: prevent_snippet_stringification(($$renderer6) => {
                      LineCompare($$renderer6, {
                        removedColor,
                        addedColor,
                        replacedColor,
                        emptyColor,
                        backgroundColor,
                        input: inputSqlLanguage,
                        output: targetSqlLanguage,
                        get oldText() {
                          return sqlContent.inputContent;
                        },
                        set oldText($$value) {
                          sqlContent.inputContent = $$value;
                          $$settled = false;
                        },
                        get newText() {
                          return sqlContent.outputContent;
                        },
                        set newText($$value) {
                          sqlContent.outputContent = $$value;
                          $$settled = false;
                        }
                      });
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----> `);
                  if (explanation) {
                    $$renderer5.push("<!--[-->");
                    Col($$renderer5, {
                      xs: "3",
                      children: prevent_snippet_stringification(($$renderer6) => {
                        $$renderer6.push(`<h2 class="fs-2 fw-bold">`);
                        push_element($$renderer6, "h2", 660, 28);
                        $$renderer6.push(`Explanation</h2>`);
                        pop_element();
                        $$renderer6.push(` <p>`);
                        push_element($$renderer6, "p", 661, 28);
                        $$renderer6.push(`${escape_html(explanation)}</p>`);
                        pop_element();
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
              $$renderer4.push(`<!---->`);
            } else if (view === "input_only") {
              $$renderer4.push("<!--[1-->");
              $$renderer4.push(`<br/>`);
              push_element($$renderer4, "br", 666, 16);
              pop_element();
              $$renderer4.push(` `);
              Row($$renderer4, {
                children: prevent_snippet_stringification(($$renderer5) => {
                  Col($$renderer5, {});
                  $$renderer5.push(`<!----> `);
                  Col($$renderer5, {
                    style: "display: flex; align-items: center;",
                    children: prevent_snippet_stringification(($$renderer6) => {
                      Dropdown($$renderer6, {
                        direction: "down",
                        class: "mb-3",
                        children: prevent_snippet_stringification(($$renderer7) => {
                          DropdownToggle($$renderer7, {
                            caret: true,
                            class: "btn btn-styled btn-styled-primary",
                            children: prevent_snippet_stringification(($$renderer8) => {
                              $$renderer8.push(`<!---->Select Prompt`);
                            }),
                            $$slots: { default: true }
                          });
                          $$renderer7.push(`<!----> `);
                          DropdownMenu($$renderer7, {
                            children: prevent_snippet_stringification(($$renderer8) => {
                              $$renderer8.push(`<!--[-->`);
                              const each_array_3 = ensure_array_like(Object.entries(languageConfigPromptStore[`${inputSqlLanguage}_${targetSqlLanguage}`].original));
                              for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
                                let [key, value] = each_array_3[$$index_3];
                                DropdownItem($$renderer8, {
                                  children: prevent_snippet_stringification(($$renderer9) => {
                                    $$renderer9.push(`<!---->${escape_html(key)}`);
                                  }),
                                  $$slots: { default: true }
                                });
                              }
                              $$renderer8.push(`<!--]-->`);
                            }),
                            $$slots: { default: true }
                          });
                          $$renderer7.push(`<!---->`);
                        }),
                        $$slots: { default: true }
                      });
                      $$renderer6.push(`<!----> <div class="form-check mx-2 mb-3">`);
                      push_element($$renderer6, "div", 680, 24);
                      $$renderer6.push(`<input class="form-check-input" type="checkbox"${attr("checked", addExplanation, true)} id="addExplanation"/>`);
                      push_element($$renderer6, "input", 681, 28);
                      pop_element();
                      $$renderer6.push(` <label class="form-check-label" for="addExplanation">`);
                      push_element($$renderer6, "label", 682, 28);
                      $$renderer6.push(`Add Explanation</label>`);
                      pop_element();
                      $$renderer6.push(`</div>`);
                      pop_element();
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!---->`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              Row($$renderer4, {
                children: prevent_snippet_stringification(($$renderer5) => {
                  Col($$renderer5, {
                    children: prevent_snippet_stringification(($$renderer6) => {
                      $$renderer6.push(`<textarea placeholder="Enter SQL code here" rows="20" style="width: 100%">`);
                      push_element($$renderer6, "textarea", 688, 24);
                      const $$body = escape_html(sqlContent.inputContent);
                      if ($$body) {
                        $$renderer6.push(`${$$body}`);
                      }
                      $$renderer6.push(`</textarea>`);
                      pop_element();
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----> `);
                  Col($$renderer5, {
                    children: prevent_snippet_stringification(($$renderer6) => {
                      $$renderer6.push(`<textarea placeholder="Enter custom prompt here" rows="20" style="width: 100%">`);
                      push_element($$renderer6, "textarea", 691, 24);
                      const $$body_1 = escape_html(customPrompt);
                      if ($$body_1) {
                        $$renderer6.push(`${$$body_1}`);
                      }
                      $$renderer6.push(`</textarea>`);
                      pop_element();
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!---->`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> <div class="d-flex justify-content-center mt-3">`);
              push_element($$renderer4, "div", 694, 16);
              $$renderer4.push(`<button class="btn btn-styled btn-convert-main w-25 py-2 svelte-u25rbc">`);
              push_element($$renderer4, "button", 695, 20);
              $$renderer4.push(`Convert</button>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
            } else if (processing) {
              $$renderer4.push("<!--[2-->");
              if (displayTime !== null) {
                $$renderer4.push("<!--[-->");
                $$renderer4.push(`<div class="d-flex justify-content-center align-items-center mt-5">`);
                push_element($$renderer4, "div", 699, 20);
                Spinner($$renderer4, { color: "primary" });
                $$renderer4.push(`<!----> <h4 class="m-0 ms-3">`);
                push_element($$renderer4, "h4", 701, 24);
                $$renderer4.push(`${escape_html(displayTime.toFixed(2))}s</h4>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
              } else {
                $$renderer4.push("<!--[!-->");
              }
              $$renderer4.push(`<!--]-->`);
            } else {
              $$renderer4.push("<!--[!-->");
              $$renderer4.push(`<div>`);
              push_element($$renderer4, "div", 705, 16);
              $$renderer4.push(`Unexpected Error</div>`);
              pop_element();
            }
            $$renderer4.push(`<!--]--></div>`);
            pop_element();
            $$renderer4.push(`</div>`);
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
      bind_props($$props, { urlBase, onUnauthorized });
    },
    CodeConversion
  );
}
CodeConversion.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(app)/code/convert/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      let user = store_get($$store_subs ??= {}, "$userStore", userStore);
      let url_base;
      function handleUnauthorized() {
        toasts.push({ message: "Unauthorized. Please login.", color: "danger" });
        goto();
      }
      if (user?.url_base) {
        url_base = user.url_base;
      }
      ToastNotifications($$renderer2, { position: "top-right", maxToasts: 5 });
      $$renderer2.push(`<!----> `);
      if (user?.token && url_base) {
        $$renderer2.push("<!--[-->");
        CodeConversion($$renderer2, { urlBase: url_base, onUnauthorized: handleUnauthorized });
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="d-flex justify-content-center align-items-center" style="min-height: 50vh;">`);
        push_element($$renderer2, "div", 26, 4);
        $$renderer2.push(`<div class="text-center">`);
        push_element($$renderer2, "div", 27, 8);
        $$renderer2.push(`<h3>`);
        push_element($$renderer2, "h3", 28, 12);
        $$renderer2.push(`Authentication Required</h3>`);
        pop_element();
        $$renderer2.push(` <p>`);
        push_element($$renderer2, "p", 29, 12);
        $$renderer2.push(`Please log in to use the code conversion tool.</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
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
