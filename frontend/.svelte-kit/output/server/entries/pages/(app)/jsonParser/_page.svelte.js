import { a3 as FILENAME } from "../../../../chunks/utils2.js";
import "clsx";
import { J as JsonSchemaParser } from "../../../../chunks/jsonSchemaParser.js";
_page[FILENAME] = "src/routes/(app)/jsonParser/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      JsonSchemaParser($$renderer2);
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
