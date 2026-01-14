<script>
// @ts-nocheck

    import * as Prism from 'prismjs';
    import 'prismjs/components/prism-sql';
    import 'prismjs/themes/prism-tomorrow.css';
  
    export let content = '';
    $: highlightedCode = Prism.highlight(
      content, 
      Prism.languages.sql, 
      'sql'
    );
  </script>
  
  <pre class="language-sql">
    {@html highlightedCode}
  </pre>
  
  <style>
    pre {
      padding: 1rem;
      background-color: #2d2d2d;
      border-radius: 0.5rem;
      overflow-x: auto;
    }
  </style>