import { z as hash } from "./index2.js";
function html(value) {
  var html2 = String(value ?? "");
  var open = `<!--${hash(html2)}-->`;
  return open + html2 + "<!---->";
}
export {
  html as h
};
