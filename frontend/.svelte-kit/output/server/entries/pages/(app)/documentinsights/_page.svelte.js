import { a4 as fallback, a3 as FILENAME } from "../../../../chunks/utils2.js";
import "clsx";
import { a as store_get, u as unsubscribe_stores, c as bind_props, p as prevent_snippet_stringification, d as attr_class, m as clsx } from "../../../../chunks/index2.js";
import { p as push_element, a as pop_element } from "../../../../chunks/dev.js";
import { B as Button, I as Icon, v as InputGroup, S as Spinner } from "../../../../chunks/Tooltip.js";
import { C as Chatbox, S as Settingstab, a as Structuredoutput, b as Searchbar } from "../../../../chunks/userFeedback.svelte_svelte_type_style_lang.js";
import { T as Toastwrapper } from "../../../../chunks/toastwrapper.js";
import { T as Timer } from "../../../../chunks/timer.js";
import "../../../../chunks/toastStore.js";
import { T as ToastNotifications } from "../../../../chunks/ToastNotifications.js";
import { u as userStore } from "../../../../chunks/userStore.js";
import "../../../../chunks/runtime-config.js";
Documentinsights[FILENAME] = "src/components/apps/docInsights/documentinsights.svelte";
function Documentinsights($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      let user = store_get($$store_subs ??= {}, "$userStore", userStore);
      if (user) {
        user.token;
      }
      let index = fallback($$props["index"], "image_test");
      let debug = fallback($$props["debug"], false);
      let query = "";
      let listOfDefaultQuestions = {
        "RFP Comparison": {
          "index": "1_8",
          "questions": [
            "What strategic differentiators are health plans implementing to meet the Nebraska's RFP requirements? Compare these to Molina. The relavent plans are Molina, Centene/Nebraska Total Care, Healthy Blue, United.",
            "What is the level of experience of the proposer in managing Medicaid or Medicare programs? The proposals concern New Mexico and the Molina, BCBS, UHC, and PHP plans.",
            "What strategic differentiators are health plans implementing to meet the state's RFP requirements? How do these compare to Molina's current initiatives as outlined in their proposal? Please specify programs and their intended goals. Specify the exact text from where it is being taken from the document",
            //"Compare the responses and tell me which health plan has comprehensive and strong response.  Also highlight the strength areas and weak areas of each plan region wise",
            "Compliance and Regulatory Adherence - How well does the proposal comply with federal and state regulations for Medicaid or Medicare?",
            "Compliance and Regulatory Adherence - Are there any specific regulatory requirements or guidelines addressed that demonstrate a thorough understanding of the compliance landscape?",
            "Experience and Expertise - What is the level of experience of the proposer in managing Medicaid or Medicare programs?",
            "Experience and Expertise - Do they provide evidence of past successes or case studies that illustrate their expertise?",
            "Service Delivery and Quality - How does the proposal address service delivery improvements and quality of care?",
            "Service Delivery and Quality - Are there innovative strategies or methodologies proposed to enhance patient outcomes?",
            "Cost and Financial Management- What is the cost structure of the proposal, and how does it ensure cost-effectiveness?",
            "Cost and Financial Management - Are there any unique financial management strategies or budgetary controls outlined?",
            "Community and Population Health - How does the proposal address the specific needs of low-income populations and vulnerable groups covered by Medicaid?",
            "Community and Population Health - Are there strategies for addressing social determinants of health and improving community health outcomes?",
            "Integration and Coordination of Care - How well does the proposal integrate various services such as primary care, behavioral health, and long-term services and supports (LTSS)?",
            "Integration and Coordination of Care - Does the proposal include plans for coordinating care across multiple providers and settings?",
            "Member Engagement and Accessibility - What approaches are proposed for engaging Medicaid members and ensuring accessibility of services?",
            "Member Engagement and Accessibility - Are there specific initiatives to improve health literacy and member communication?",
            "Chronic Disease Management - How does the proposal address chronic disease management for the elderly and disabled populations served by Medicare?",
            "Chronic Disease Management - Specific to Medicare - Are there innovative programs for managing high-cost, high-need beneficiaries?",
            "Technology and Innovation - Does the proposal include advanced technology solutions such as telehealth, remote monitoring, or data analytics for improving care delivery?",
            "Technology and Innovation - How does the proposer plan to leverage technology to enhance patient care and operational efficiency?",
            "Quality Metrics and Performance Improvement - What quality metrics and performance improvement plans are included in the proposal?",
            "Quality Metrics and Performance Improvement - Are there specific targets or benchmarks for quality improvement, and how will they be measured and reported?",
            "Differentiation and Competitive Edge - What unique features or value propositions does the proposal offer that set it apart from competitors?",
            "Differentiation and Competitive Edge - Are there any proprietary methodologies, partnerships, or innovations highlighted?",
            "Scalability and Flexibility - How scalable and adaptable is the proposal to changes in program size, demographics, or regulatory requirements?",
            "Scalability and Flexibility - Does the proposal include contingency plans or strategies for managing potential risks and uncertainties?",
            "Data Quality and Completeness - How thorough and complete is the data provided in the proposal?",
            "Data Quality and Completeness - Are there specific sections or responses that consistently lack detail or clarity?",
            "Language Analysis - What is the tone and sentiment of the proposal? Is it positive, neutral, or negative?",
            "Language Analysis - Are there recurring keywords or phrases that indicate a strong commitment to certain aspects of care or program management?",
            "Comparative Analysis - How do proposals compare against each other in terms of meeting the key evaluation criteria?",
            "Comparative Analysis - Are there common strengths or weaknesses that can be identified across multiple proposals?",
            "What strategic or competitive differentiators are health plans driving to address the state's RFP requests and requirements? Compare these differentiators to what Molina is currently doing from the proposal. Call out specific programs and their intended goals."
          ]
        },
        "RFP Codes": {
          "index": "1_10",
          "questions": [
            "What are the codes added for physical therapy, occupational therapy, outpatient speech-language pathology services effective January 1, 2024.",
            "What are the deleted codes from Radiology and certain other imaging services Effective January 1, 2024?"
          ]
        }
      };
      let chatContents = [];
      let activeStructuredOutput = false;
      let listOfColumns = [];
      listOfColumns = [
        {
          column_name: "Health Plan",
          column_description: "The health plan"
        },
        {
          column_name: "Differentiators",
          column_description: "The strategic differentiators"
        },
        {
          column_name: "Compare/Contrast",
          column_description: "Compare/Contrast to the Molina plan"
        },
        {
          column_name: "Score",
          column_description: "The score awarded to the plan"
        }
      ];
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        ToastNotifications($$renderer3, { position: "top-right", maxToasts: 5 });
        $$renderer3.push(`<!----> <div id="main" class="main svelte-1caqt5l">`);
        push_element($$renderer3, "div", 243, 0);
        $$renderer3.push(`<div class="chat-container">`);
        push_element($$renderer3, "div", 244, 4);
        if (chatContents.length > 0) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="message-group">`);
          push_element($$renderer3, "div", 247, 8);
          Chatbox($$renderer3, { chatContents: [chatContents[0]], debug });
          $$renderer3.push(`<!----> `);
          {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]--></div>`);
          pop_element();
          $$renderer3.push(` `);
          if (chatContents.length > 1) {
            $$renderer3.push("<!--[-->");
            Chatbox($$renderer3, { chatContents: chatContents.slice(1), debug });
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]-->`);
        } else {
          $$renderer3.push("<!--[!-->");
          Chatbox($$renderer3, { chatContents, debug });
        }
        $$renderer3.push(`<!--]--></div>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` `);
        if (user) {
          $$renderer3.push("<!--[-->");
          Settingstab($$renderer3, {
            user,
            app: "documentinsights",
            get index() {
              return index;
            },
            set index($$value) {
              index = $$value;
              $$settled = false;
            },
            children: prevent_snippet_stringification(($$renderer4) => {
              Structuredoutput($$renderer4, {
                get listOfColumns() {
                  return listOfColumns;
                },
                set listOfColumns($$value) {
                  listOfColumns = $$value;
                  $$settled = false;
                },
                get activeStructuredOutput() {
                  return activeStructuredOutput;
                },
                set activeStructuredOutput($$value) {
                  activeStructuredOutput = $$value;
                  $$settled = false;
                }
              });
            }),
            $$slots: { default: true }
          });
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> <div class="bottom-div svelte-1caqt5l">`);
        push_element($$renderer3, "div", 285, 0);
        $$renderer3.push(`<div class="w-100">`);
        push_element($$renderer3, "div", 286, 4);
        {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div style="text-align:right; margin-bottom: 7px;">`);
          push_element($$renderer3, "div", 288, 8);
          Button($$renderer3, {
            color: "primary",
            children: prevent_snippet_stringification(($$renderer4) => {
              Icon($$renderer4, { name: "upload" });
              $$renderer4.push(`<!----> Upload Files`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----></div>`);
          pop_element();
        }
        $$renderer3.push(`<!--]--> `);
        InputGroup($$renderer3, {
          class: "mt-2",
          children: prevent_snippet_stringification(($$renderer4) => {
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
        $$renderer3.push(`<!----> <div style="margin-top: 6px;">`);
        push_element($$renderer3, "div", 359, 8);
        Searchbar($$renderer3, {
          listOfDefaultQuestions,
          get query() {
            return query;
          },
          set query($$value) {
            query = $$value;
            $$settled = false;
          },
          get chatContents() {
            return chatContents;
          },
          set chatContents($$value) {
            chatContents = $$value;
            $$settled = false;
          },
          get index() {
            return index;
          },
          set index($$value) {
            index = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(` `);
        {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></div>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` <div${attr_class(clsx("d-none"))}>`);
        push_element($$renderer3, "div", 368, 0);
        Toastwrapper($$renderer3, {
          open: true,
          width: "200px",
          $$slots: {
            body: ($$renderer4) => {
              $$renderer4.push(`<div class="d-flex justify-content-between align-items-center" slot="body">`);
              push_element($$renderer4, "div", 370, 8);
              Spinner($$renderer4, { color: "primary" });
              $$renderer4.push(`<!----> <h4 class="m-0">`);
              push_element($$renderer4, "h4", 372, 12);
              Timer($$renderer4, {});
              $$renderer4.push(`<!---->s</h4>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
            }
          }
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
      if ($$store_subs) unsubscribe_stores($$store_subs);
      bind_props($$props, { index, debug });
    },
    Documentinsights
  );
}
Documentinsights.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(app)/documentinsights/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      Documentinsights($$renderer2, {});
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
