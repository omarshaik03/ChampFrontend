import { e as ensure_array_like, d as attr_class, c as bind_props, p as prevent_snippet_stringification, a as store_get, b as attr, u as unsubscribe_stores } from "./index2.js";
import { a4 as fallback, a3 as FILENAME } from "./utils2.js";
import { p as push_element, a as pop_element } from "./dev.js";
import { e as escape_html } from "./context.js";
import { r as Table, h as CardBody, B as Button } from "./Tooltip.js";
import * as Prism from "prismjs";
import "prismjs/components/prism-sql.js";
import { h as html } from "./html.js";
import { C as Card } from "./Heading.js";
import "clsx";
import { io } from "socket.io-client";
import { w as writable } from "./index.js";
import { u as userStore } from "./userStore.js";
Sidebar[FILENAME] = "src/components/apps/databaseInsights/sidebar.svelte";
function Sidebar($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let selectedDb = fallback($$props["selectedDb"], "SQL");
      let loggedIn = fallback($$props["loggedIn"], false);
      const databases = ["SQL", "MySQL", "PostgreSQL", "SQLite"];
      $$renderer2.push(`<aside class="bg-dark text-white p-3" style="width: 250px; height: 100vh;">`);
      push_element($$renderer2, "aside", 9, 0);
      $$renderer2.push(`<h4>`);
      push_element($$renderer2, "h4", 10, 1);
      $$renderer2.push(`Database Selector</h4>`);
      pop_element();
      $$renderer2.push(` <ul class="list-unstyled">`);
      push_element($$renderer2, "ul", 11, 1);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(databases);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let db = each_array[$$index];
        $$renderer2.push(`<li>`);
        push_element($$renderer2, "li", 13, 3);
        $$renderer2.push(`<button${attr_class("btn btn-link text-white svelte-10cf84a", void 0, { "selected": db === selectedDb })}>`);
        push_element($$renderer2, "button", 14, 4);
        $$renderer2.push(`${escape_html(db)}</button>`);
        pop_element();
        $$renderer2.push(`</li>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></ul>`);
      pop_element();
      $$renderer2.push(` <button class="btn btn-primary">`);
      push_element($$renderer2, "button", 26, 4);
      $$renderer2.push(`Log Out</button>`);
      pop_element();
      $$renderer2.push(`</aside>`);
      pop_element();
      bind_props($$props, { selectedDb, loggedIn });
    },
    Sidebar
  );
}
Sidebar.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Table_1[FILENAME] = "src/components/apps/databaseInsights/table.svelte";
function Table_1($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let data = fallback($$props["data"], () => [], true);
      let use_headers = fallback($$props["use_headers"], false);
      let striped = fallback($$props["striped"], false);
      let bordered = fallback($$props["bordered"], false);
      let hover = fallback($$props["hover"], false);
      let responsive = fallback($$props["responsive"], true);
      let size = fallback($$props["size"], "");
      let headers = [];
      if (use_headers) {
        headers = data[0];
        data = data.slice(1);
      }
      Table($$renderer2, {
        striped,
        bordered,
        hover,
        responsive,
        size,
        children: prevent_snippet_stringification(($$renderer3) => {
          if (use_headers) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<thead>`);
            push_element($$renderer3, "thead", 18, 6);
            $$renderer3.push(`<tr>`);
            push_element($$renderer3, "tr", 19, 8);
            $$renderer3.push(`<!--[-->`);
            const each_array = ensure_array_like(headers);
            for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
              let header = each_array[$$index];
              $$renderer3.push(`<th>`);
              push_element($$renderer3, "th", 21, 12);
              $$renderer3.push(`${escape_html(header)}</th>`);
              pop_element();
            }
            $$renderer3.push(`<!--]--></tr>`);
            pop_element();
            $$renderer3.push(`</thead>`);
            pop_element();
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]--> <tbody>`);
          push_element($$renderer3, "tbody", 26, 4);
          $$renderer3.push(`<!--[-->`);
          const each_array_1 = ensure_array_like(data);
          for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
            let row = each_array_1[$$index_2];
            $$renderer3.push(`<tr>`);
            push_element($$renderer3, "tr", 28, 8);
            $$renderer3.push(`<!--[-->`);
            const each_array_2 = ensure_array_like(row);
            for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
              let cell = each_array_2[$$index_1];
              $$renderer3.push(`<td>`);
              push_element($$renderer3, "td", 30, 12);
              $$renderer3.push(`${escape_html(cell)}</td>`);
              pop_element();
            }
            $$renderer3.push(`<!--]--></tr>`);
            pop_element();
          }
          $$renderer3.push(`<!--]--></tbody>`);
          pop_element();
        }),
        $$slots: { default: true }
      });
      bind_props($$props, {
        data,
        use_headers,
        striped,
        bordered,
        hover,
        responsive,
        size
      });
    },
    Table_1
  );
}
Table_1.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
SqlHighlight[FILENAME] = "src/components/apps/databaseInsights/sqlHighlight.svelte";
function SqlHighlight($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let highlightedCode;
      let content = fallback($$props["content"], "");
      highlightedCode = Prism.highlight(content, Prism.languages.sql, "sql");
      $$renderer2.push(`<pre class="language-sql svelte-1rq5une">`);
      push_element($$renderer2, "pre", 16, 2);
      $$renderer2.push(`
    ${html(highlightedCode)}
  </pre>`);
      pop_element();
      bind_props($$props, { content });
    },
    SqlHighlight
  );
}
SqlHighlight.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
QueryResult[FILENAME] = "src/components/apps/databaseInsights/queryResult.svelte";
function QueryResult($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let content = fallback($$props["content"], "");
      Card($$renderer2, {
        class: "query-result-card",
        children: prevent_snippet_stringification(($$renderer3) => {
          CardBody($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<pre class="query-result svelte-1xxv7jj">`);
              push_element($$renderer4, "pre", 10, 6);
              $$renderer4.push(`
          ${escape_html(content)}
      </pre>`);
              pop_element();
            }),
            $$slots: { default: true }
          });
        }),
        $$slots: { default: true }
      });
      bind_props($$props, { content });
    },
    QueryResult
  );
}
QueryResult.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Spinner[FILENAME] = "src/components/apps/databaseInsights/spinner.svelte";
function Spinner($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let buffering = fallback($$props["buffering"], false);
      if (buffering) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="buffering-spinner svelte-c9behf">`);
        push_element($$renderer2, "div", 6, 4);
        $$renderer2.push(`<div class="spinner svelte-c9behf">`);
        push_element($$renderer2, "div", 7, 6);
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, { buffering });
    },
    Spinner
  );
}
Spinner.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
const socketStore = writable({ socket: void 0 });
function addSocket(socket) {
  socketStore.set({ socket });
}
Canvas[FILENAME] = "src/components/apps/databaseInsights/canvas.svelte";
function Canvas($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      let socket;
      let url_base = $$props["url_base"];
      let token = $$props["token"];
      let selectedDb = $$props["selectedDb"];
      let llm = $$props["llm"];
      let sqlDialect = $$props["sqlDialect"];
      let username = $$props["username"];
      let password = $$props["password"];
      let host = $$props["host"];
      let driver = $$props["driver"];
      let port = fallback($$props["port"], () => void 0, true);
      let database = $$props["database"];
      let poolRecycle = fallback($$props["poolRecycle"], () => void 0, true);
      let isLoading = false;
      let query = "";
      let messages = [];
      function parseTableData(data) {
        let rows = data.slice(1, -1).split("), (");
        return rows.map((row) => {
          return row.replace(/[\(\)]/g, "").split(", ").map((cell) => cell.trim());
        });
      }
      function handleQueryResponse(data) {
        let chunk = data.response;
        let message;
        let message_type = chunk["type"];
        let tool_name = chunk["tool_name"];
        if (message_type === "tool_response") {
          if (tool_name === "sql_db_query") {
            message = {
              precontent: `Tool: ${tool_name} responded with:`,
              content: parseTableData(chunk["content"]),
              type: "table"
            };
          } else if (tool_name === "sql_db_schema" || tool_name === "sql_db_query_checker") {
            message = {
              precontent: `Tool: ${tool_name} responded with:`,
              content: chunk["content"],
              type: "sql"
            };
          } else {
            message = {
              content: `Tool: ${tool_name} responded with: ${chunk["content"]}`,
              type: "chat"
            };
          }
        } else if (message_type === "tool_call") {
          if (tool_name === "sql_db_query" || tool_name === "sql_db_query_checker") {
            message = {
              precontent: `Calling tool: ${tool_name}, with query:`,
              content: `${chunk["arguments"]["query"]}`,
              type: "sql"
            };
          } else {
            message = {
              content: `Calling tool: ${chunk["tool_name"]}, with parameters: ${JSON.stringify(chunk["arguments"], null, 2)}`,
              type: "chat"
            };
          }
        } else if (message_type === "agent_response") {
          message = { content: chunk["content"], type: "chat" };
        } else {
          message = { content: JSON.stringify(chunk, null, 2), type: "unknown" };
        }
        messages = [...messages, message];
      }
      if (llm && sqlDialect && username && password && host && driver && database) {
        if (socket === void 0) {
          addSocket(io(`${url_base}`));
        } else {
          socket.on("connect", () => {
          });
          socket.on("disconnect", () => {
          });
          socket.on("query_response", (data) => {
            handleQueryResponse(data);
          });
          socket.onAny((event, ...args) => {
            console.log(`Event: ${event}, Status: ${args[0].status}, Message: ${args[0].message}`);
          });
        }
      }
      socket = store_get($$store_subs ??= {}, "$socketStore", socketStore).socket;
      $$renderer2.push(`<main class="flex-grow-1 p-4">`);
      push_element($$renderer2, "main", 122, 2);
      $$renderer2.push(`<h2>`);
      push_element($$renderer2, "h2", 123, 4);
      $$renderer2.push(`Database Interaction</h2>`);
      pop_element();
      $$renderer2.push(` <div class="form-group">`);
      push_element($$renderer2, "div", 124, 4);
      $$renderer2.push(`<label for="queryInput">`);
      push_element($$renderer2, "label", 125, 6);
      $$renderer2.push(`Enter SQL Query</label>`);
      pop_element();
      $$renderer2.push(` `);
      Spinner($$renderer2, { buffering: isLoading });
      $$renderer2.push(`<!----> <textarea id="queryInput" class="form-control" rows="5"${attr("placeholder", `Write your ${selectedDb} query here...`)}>`);
      push_element($$renderer2, "textarea", 128, 6);
      const $$body = escape_html(query);
      if ($$body) {
        $$renderer2.push(`${$$body}`);
      }
      $$renderer2.push(`</textarea>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <button class="btn btn-primary mt-2">`);
      push_element($$renderer2, "button", 136, 4);
      $$renderer2.push(`Execute</button>`);
      pop_element();
      $$renderer2.push(` <button class="btn btn-primary mt-2">`);
      push_element($$renderer2, "button", 137, 1);
      $$renderer2.push(`Create Agent</button>`);
      pop_element();
      $$renderer2.push(` <div class="mt-4 message-container svelte-1iaoguu">`);
      push_element($$renderer2, "div", 139, 4);
      if (messages.length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<h5>`);
        push_element($$renderer2, "h5", 141, 3);
        $$renderer2.push(`Query Result:</h5>`);
        pop_element();
        $$renderer2.push(` <!--[-->`);
        const each_array = ensure_array_like(messages);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let message = each_array[$$index];
          $$renderer2.push(`<div class="mt-2">`);
          push_element($$renderer2, "div", 144, 4);
          if (message.type === "table") {
            $$renderer2.push("<!--[-->");
            if (message.precontent) {
              $$renderer2.push("<!--[-->");
              $$renderer2.push(`<p>`);
              push_element($$renderer2, "p", 147, 7);
              $$renderer2.push(`${escape_html(message.precontent)}</p>`);
              pop_element();
            } else {
              $$renderer2.push("<!--[!-->");
            }
            $$renderer2.push(`<!--]--> `);
            Table_1($$renderer2, {
              data: message.content,
              striped: true,
              hover: true,
              bordered: true,
              use_headers: false
            });
            $$renderer2.push(`<!---->`);
          } else if (message.type === "sql") {
            $$renderer2.push("<!--[1-->");
            if (message.precontent) {
              $$renderer2.push("<!--[-->");
              $$renderer2.push(`<p>`);
              push_element($$renderer2, "p", 158, 7);
              $$renderer2.push(`${escape_html(message.precontent)}</p>`);
              pop_element();
            } else {
              $$renderer2.push("<!--[!-->");
            }
            $$renderer2.push(`<!--]--> `);
            SqlHighlight($$renderer2, { content: message.content });
            $$renderer2.push(`<!---->`);
          } else if (message.type === "chat") {
            $$renderer2.push("<!--[2-->");
            $$renderer2.push(`<p>`);
            push_element($$renderer2, "p", 164, 6);
            QueryResult($$renderer2, { content: message.content });
            $$renderer2.push(`<!----></p>`);
            pop_element();
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push(`<p>`);
            push_element($$renderer2, "p", 170, 6);
            QueryResult($$renderer2, { content: message.content });
            $$renderer2.push(`<!----></p>`);
            pop_element();
          }
          $$renderer2.push(`<!--]--></div>`);
          pop_element();
        }
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</main>`);
      pop_element();
      if ($$store_subs) unsubscribe_stores($$store_subs);
      bind_props($$props, {
        url_base,
        token,
        selectedDb,
        llm,
        sqlDialect,
        username,
        password,
        host,
        driver,
        port,
        database,
        poolRecycle
      });
    },
    Canvas
  );
}
Canvas.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Console[FILENAME] = "src/components/apps/databaseInsights/console.svelte";
function Console($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let logMessages = fallback($$props["logMessages"], () => [], true);
      $$renderer2.push(`<div class="bg-light p-3 mt-4" style="height: 200px; overflow-y: scroll;">`);
      push_element($$renderer2, "div", 9, 2);
      $$renderer2.push(`<h5>`);
      push_element($$renderer2, "h5", 10, 4);
      $$renderer2.push(`Console</h5>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 11, 4);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(logMessages);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let message = each_array[$$index];
        $$renderer2.push(`<p>`);
        push_element($$renderer2, "p", 13, 8);
        $$renderer2.push(`${escape_html(message)}</p>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <button class="btn btn-secondary mt-2">`);
      push_element($$renderer2, "button", 16, 4);
      $$renderer2.push(`Clear</button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      bind_props($$props, { logMessages });
    },
    Console
  );
}
Console.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
DbMain[FILENAME] = "src/components/apps/databaseInsights/dbMain.svelte";
function DbMain($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let url_base = $$props["url_base"];
      let token = $$props["token"];
      let llm = $$props["llm"];
      let sqlDialect = $$props["sqlDialect"];
      let username = $$props["username"];
      let password = $$props["password"];
      let host = $$props["host"];
      let driver = $$props["driver"];
      let port = fallback($$props["port"], () => void 0, true);
      let database = $$props["database"];
      let poolRecycle = fallback($$props["poolRecycle"], () => void 0, true);
      let loggedIn = fallback($$props["loggedIn"], false);
      let selectedDb = "SQL";
      let logMessages = [];
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<div class="d-flex svelte-1hy9agr">`);
        push_element($$renderer3, "div", 27, 0);
        Sidebar($$renderer3, {
          get selectedDb() {
            return selectedDb;
          },
          set selectedDb($$value) {
            selectedDb = $$value;
            $$settled = false;
          },
          get loggedIn() {
            return loggedIn;
          },
          set loggedIn($$value) {
            loggedIn = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----> <div class="flex-grow-1 svelte-1hy9agr">`);
        push_element($$renderer3, "div", 32, 1);
        Canvas($$renderer3, {
          url_base,
          token,
          selectedDb,
          get llm() {
            return llm;
          },
          set llm($$value) {
            llm = $$value;
            $$settled = false;
          },
          get sqlDialect() {
            return sqlDialect;
          },
          set sqlDialect($$value) {
            sqlDialect = $$value;
            $$settled = false;
          },
          get username() {
            return username;
          },
          set username($$value) {
            username = $$value;
            $$settled = false;
          },
          get password() {
            return password;
          },
          set password($$value) {
            password = $$value;
            $$settled = false;
          },
          get host() {
            return host;
          },
          set host($$value) {
            host = $$value;
            $$settled = false;
          },
          get driver() {
            return driver;
          },
          set driver($$value) {
            driver = $$value;
            $$settled = false;
          },
          get port() {
            return port;
          },
          set port($$value) {
            port = $$value;
            $$settled = false;
          },
          get database() {
            return database;
          },
          set database($$value) {
            database = $$value;
            $$settled = false;
          },
          get poolRecycle() {
            return poolRecycle;
          },
          set poolRecycle($$value) {
            poolRecycle = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----> `);
        Console($$renderer3, { logMessages });
        $$renderer3.push(`<!----></div>`);
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
      bind_props($$props, {
        url_base,
        token,
        llm,
        sqlDialect,
        username,
        password,
        host,
        driver,
        port,
        database,
        poolRecycle,
        loggedIn
      });
    },
    DbMain
  );
}
DbMain.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Dbinisghtslogin[FILENAME] = "src/components/apps/databaseInsights/dbinisghtslogin.svelte";
function Dbinisghtslogin($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let url_base = $$props["url_base"];
      let token = $$props["token"];
      let llm = $$props["llm"];
      let sqlDialect = fallback($$props["sqlDialect"], () => void 0, true);
      let username = fallback($$props["username"], () => void 0, true);
      let password = fallback($$props["password"], () => void 0, true);
      let host = fallback($$props["host"], () => void 0, true);
      let driver = fallback($$props["driver"], () => void 0, true);
      let port = fallback($$props["port"], () => void 0, true);
      let database = fallback($$props["database"], () => void 0, true);
      let poolRecycle = fallback($$props["poolRecycle"], () => void 0, true);
      let loggedIn = fallback($$props["loggedIn"], false);
      let dialectAndDriverOptions = { "mysql": ["pymysql"], "mssql": ["pymssql"] };
      $$renderer2.push(`<div style="display: flex; justify-content: center; align-items: center; height: 70vh; padding: 20px;">`);
      push_element($$renderer2, "div", 49, 0);
      $$renderer2.push(`<div style="width: 50%; padding: 20px; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9;">`);
      push_element($$renderer2, "div", 50, 4);
      $$renderer2.push(`<input class="form-field svelte-otptru"${attr("value", username)} type="text" placeholder="Username"/>`);
      push_element($$renderer2, "input", 52, 8);
      pop_element();
      $$renderer2.push(` <input class="form-field svelte-otptru"${attr("value", password)} type="password" placeholder="Password"/>`);
      push_element($$renderer2, "input", 60, 8);
      pop_element();
      $$renderer2.push(` `);
      $$renderer2.select(
        { class: "form-field", value: sqlDialect },
        ($$renderer3) => {
          $$renderer3.option({ value: "", disabled: true, selected: true }, ($$renderer4) => {
            push_element($$renderer4, "option", 73, 12);
            $$renderer4.push(`Select Dialect`);
            pop_element();
          });
          $$renderer3.push(`<!--[-->`);
          const each_array = ensure_array_like(Object.keys(dialectAndDriverOptions));
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let dialect = each_array[$$index];
            $$renderer3.option({ value: dialect }, ($$renderer4) => {
              push_element($$renderer4, "option", 75, 16);
              $$renderer4.push(`${escape_html(dialect.toUpperCase())}`);
              pop_element();
            });
          }
          $$renderer3.push(`<!--]-->`);
        },
        "svelte-otptru"
      );
      $$renderer2.push(` `);
      $$renderer2.select(
        { class: "form-field", value: driver, disabled: !sqlDialect },
        ($$renderer3) => {
          $$renderer3.option({ value: "", disabled: true, selected: true }, ($$renderer4) => {
            push_element($$renderer4, "option", 81, 12);
            $$renderer4.push(`Select Driver`);
            pop_element();
          });
          if (sqlDialect) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<!--[-->`);
            const each_array_1 = ensure_array_like(dialectAndDriverOptions[sqlDialect]);
            for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
              let driverOption = each_array_1[$$index_1];
              $$renderer3.option({ value: driverOption }, ($$renderer4) => {
                push_element($$renderer4, "option", 84, 20);
                $$renderer4.push(`${escape_html(driverOption.toUpperCase())}`);
                pop_element();
              });
            }
            $$renderer3.push(`<!--]-->`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]-->`);
        },
        "svelte-otptru"
      );
      $$renderer2.push(` <input class="form-field svelte-otptru"${attr("value", host)} type="text" placeholder="Host"/>`);
      push_element($$renderer2, "input", 90, 8);
      pop_element();
      $$renderer2.push(` <input class="form-field svelte-otptru"${attr("value", port)} type="text" placeholder="Port (Optional)"/>`);
      push_element($$renderer2, "input", 98, 8);
      pop_element();
      $$renderer2.push(` <input class="form-field svelte-otptru"${attr("value", database)} type="text" placeholder="Database"/>`);
      push_element($$renderer2, "input", 106, 8);
      pop_element();
      $$renderer2.push(` <input class="form-field svelte-otptru"${attr("value", poolRecycle)} type="text" placeholder="Pool Recycle (Optional)"/>`);
      push_element($$renderer2, "input", 114, 8);
      pop_element();
      $$renderer2.push(` `);
      Button($$renderer2, {
        style: "\n                width: 100%;\n                padding: 10px;\n                border: none;\n                border-radius: 5px;\n                background-color: #4d4dff;\n                color: #fff; cursor: pointer;\n                transition: background-color 0.3s ease;",
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<!---->Login`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, {
        url_base,
        token,
        llm,
        sqlDialect,
        username,
        password,
        host,
        driver,
        port,
        database,
        poolRecycle,
        loggedIn
      });
    },
    Dbinisghtslogin
  );
}
Dbinisghtslogin.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
DatabaseInsights[FILENAME] = "src/components/apps/databaseInsights/databaseInsights.svelte";
function DatabaseInsights($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      let user = store_get($$store_subs ??= {}, "$userStore", userStore);
      let url_base;
      let sqlDialect;
      let username;
      let password;
      let host;
      let driver;
      let port;
      let database;
      let poolRecycle;
      let llm = "GPT4o";
      let loggedIn = false;
      if (user) {
        url_base = user.url_base;
      }
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        if (user && user.token) {
          $$renderer3.push("<!--[-->");
          if (!loggedIn) {
            $$renderer3.push("<!--[-->");
            Dbinisghtslogin($$renderer3, {
              url_base,
              token: user.token,
              get llm() {
                return llm;
              },
              set llm($$value) {
                llm = $$value;
                $$settled = false;
              },
              get sqlDialect() {
                return sqlDialect;
              },
              set sqlDialect($$value) {
                sqlDialect = $$value;
                $$settled = false;
              },
              get username() {
                return username;
              },
              set username($$value) {
                username = $$value;
                $$settled = false;
              },
              get password() {
                return password;
              },
              set password($$value) {
                password = $$value;
                $$settled = false;
              },
              get host() {
                return host;
              },
              set host($$value) {
                host = $$value;
                $$settled = false;
              },
              get driver() {
                return driver;
              },
              set driver($$value) {
                driver = $$value;
                $$settled = false;
              },
              get port() {
                return port;
              },
              set port($$value) {
                port = $$value;
                $$settled = false;
              },
              get database() {
                return database;
              },
              set database($$value) {
                database = $$value;
                $$settled = false;
              },
              get poolRecycle() {
                return poolRecycle;
              },
              set poolRecycle($$value) {
                poolRecycle = $$value;
                $$settled = false;
              },
              get loggedIn() {
                return loggedIn;
              },
              set loggedIn($$value) {
                loggedIn = $$value;
                $$settled = false;
              }
            });
          } else {
            $$renderer3.push("<!--[!-->");
            DbMain($$renderer3, {
              url_base,
              token: user.token,
              llm,
              sqlDialect,
              username,
              password,
              host,
              driver,
              port,
              database,
              poolRecycle,
              get loggedIn() {
                return loggedIn;
              },
              set loggedIn($$value) {
                loggedIn = $$value;
                $$settled = false;
              }
            });
          }
          $$renderer3.push(`<!--]-->`);
        } else {
          $$renderer3.push("<!--[!-->");
          $$renderer3.push(`<p>`);
          push_element($$renderer3, "p", 54, 1);
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
      if ($$store_subs) unsubscribe_stores($$store_subs);
    },
    DatabaseInsights
  );
}
DatabaseInsights.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  DatabaseInsights as D
};
