import{c as ht,l as bt}from"./DdfBw5sN.js";import"./DrGrr8K_.js";import{p as yt,$ as $e,T as Nt,f as _,d as t,K as dt,E as f,t as X,a6 as Ct,a as n,b as Tt,U as a,J as o,X as v,Y as E,Z as de,V as g,a0 as m,an as ut,F as l,_ as d,a2 as he,c as kt,a3 as H,ah as It,a4 as At,a5 as St,ao as Ot}from"./_MZGgvaG.js";import{a as c}from"./DjduXCyD.js";import{d as Bt,p as ct,i as ye,w as r,c as Et}from"./D2BTio8A.js";import{M as Ft,F as pt,L as Re,I as Me,c as vt,e as Ge,i as Ye,B as Te,r as Mt,O as Lt,h as Jt,R as et,C as we,j as Oe,k as ze,l as De,n as Be,a as mt,Q as qt,U as gt,S as jt,z as _t}from"./UBY93Ibs.js";import{i as xt}from"./Dc01ouHN.js";import{u as Ut,H as $t,P as tt,A as Ht,S as zt,C as Dt,B as Rt,M as Gt,a as Yt}from"./BI-OWIRA.js";i[l]="src/components/apps/graphUI/TextNode.svelte";var Vt=c(d('<div class="field-display svelte-1f3suw5"><span class="field-name svelte-1f3suw5"> </span> <span class="field-value svelte-1f3suw5"> </span></div>'),i[l],[[59,24,[[60,28],[61,28]]]]),Zt=c(d('<div class="additional-fields-display svelte-1f3suw5"></div>'),i[l],[[56,12]]),Kt=c(d('<!> <div class="color-picker-container svelte-1f3suw5"><!> <span class="color-preview svelte-1f3suw5"></span> <!></div>',1),i[l],[[93,12,[[95,16]]]]),Qt=c(d("<option>Default</option> <option>Input</option> <option>Output</option>",1),i[l],[[104,16],[105,16],[106,16]]),Xt=c(d("<!> <!>",1),i[l],[]),Wt=c(d('<div class="field-row svelte-1f3suw5"><!> <!> <!></div>'),i[l],[[115,20]]),eo=c(d('<!> <div class="additional-fields svelte-1f3suw5"><!> <!></div>',1),i[l],[[113,12]]),to=c(d('<div class="modal-header"><h5 class="modal-title">Edit Node</h5></div> <div class="modal-body"><!> <!> <!></div> <div class="modal-footer"><!> <!></div>',1),i[l],[[86,4,[[87,8]]],[89,4],[149,4]]),oo=c(d('<div class="text-updater-node default-node svelte-1f3suw5"><div><form class="svelte-1f3suw5"><input id="text" name="text" class="svelte-1f3suw5"/> <button class="svelte-1f3suw5">Edit</button></form> <!> <!> <!></div></div> <!>',1),i[l],[[44,0,[[45,4,[[46,8,[[47,12],[51,12]]]]]]]]);function i(ot,Ne){ht(new.target),yt(Ne,!1,i);var ae=Bt(Ne);let re=ct(Ne,"id",8),T=ct(Ne,"data",12),ne=ct(Ne,"open",12,!1),V=$e(T().color||"#ffffff"),Ce=$e(T().type||"default"),w=$e([]);const{getNode:at}=Ut(),rt=at(re());Nt(()=>{T().fields&&Array.isArray(T().fields)&&g(w,T().fields.map(x=>he(typeof x,"string")?{name:x,value:""}:{name:x.name||"",value:x.value||""}))});function nt(x){x.preventDefault(),ne(!0)}function st(){ae.mutation(null,["data","color"],T(T().color=o(V),!0),29,2),ae.mutation(null,["data","type"],T(T().type=o(Ce),!0),30,2),rt.type=o(Ce),ae.mutation(null,["data","fields"],T(T().fields=o(w).filter(x=>he(x.name.trim(),"",!1)),!0),32,2),g(w,[...T().fields]),ne(!1)}function Ve(){g(w,[...o(w),{name:"",value:""}])}function lt(x){g(w,o(w).filter((ce,z)=>he(z,x,!1)))}var Le={...bt()};xt();var Je=oo(),ke=_(Je),Ze=v(ke),qe=v(Ze),je=v(qe);Mt(je);var h=a(je,2);m(qe);var k=a(qe,2);{var Z=x=>{var ce=Zt();t(()=>Ge(ce,5,()=>o(w),Ye,(z,u)=>{var F=kt(),W=_(F);{var s=I=>{var j=Vt(),N=v(j),K=v(N);m(N);var J=a(N,2),pe=v(J,!0);m(J),m(j),X(()=>{H(K,`${o(u),f(()=>o(u).name)??""}:`),H(pe,(o(u),f(()=>o(u).value||"N/A")))}),n(I,j)},$=It(()=>(o(u),f(()=>he(o(u).name.trim(),"",!1))));t(()=>ye(W,I=>{o($)&&I(s)}),"if",i,58,20)}n(z,F)}),"each",i,57,16),m(ce),n(x,ce)};t(()=>ye(k,x=>{o(w),f(()=>o(w)&&o(w).length>0)&&x(Z)}),"if",i,55,8)}var L=a(k,2);t(()=>$t(L,{type:"source",get position(){return dt(tt),f(()=>tt.Top)},style:{top:"50%"},isConnectable:!0,id:"input"}),"component",i,68,8,{componentTag:"Handle"});var se=a(L,2);t(()=>$t(se,{type:"target",get position(){return dt(tt),f(()=>tt.Bottom)},style:{top:"50%"},isConnectable:!0,id:"output"}),"component",i,75,8,{componentTag:"Handle"}),m(Ze),m(ke);var _e=a(ke,2);return t(()=>Ft(_e,{get isOpen(){return ne()},size:"lg",$$events:{close:()=>ne(!1)},children:r(i,(x,ce)=>{var z=to(),u=a(_(z),2),F=v(u);t(()=>pt(F,{children:r(i,(N,K)=>{var J=Kt(),pe=_(J);t(()=>Re(pe,{for:"color",children:r(i,(y,P)=>{E();var D=de("Node Color:");n(y,D)}),$$slots:{default:!0}}),"component",i,92,12,{componentTag:"Label"});var be=a(pe,2),le=v(be);t(()=>Me(le,{type:"color",id:"color",get value(){return o(V)},set value(y){g(V,y)},$$legacy:!0}),"component",i,94,16,{componentTag:"Input"});var A=a(le,2),S=a(A,2);t(()=>Me(S,{type:"text",placeholder:"#ffffff",class:"color-input",get value(){return o(V)},set value(y){g(V,y)},$$legacy:!0}),"component",i,96,16,{componentTag:"Input"}),m(be),X(()=>vt(A,`background-color: ${o(V)??""}`)),n(N,J)}),$$slots:{default:!0}}),"component",i,91,8,{componentTag:"FormGroup"});var W=a(F,2);t(()=>pt(W,{children:r(i,(N,K)=>{var J=Xt(),pe=_(J);t(()=>Re(pe,{for:"type",children:r(i,(le,A)=>{E();var S=de("Node Type:");n(le,S)}),$$slots:{default:!0}}),"component",i,102,12,{componentTag:"Label"});var be=a(pe,2);t(()=>Me(be,{type:"select",id:"type",get value(){return o(Ce)},set value(le){g(Ce,le)},children:r(i,(le,A)=>{var S=Qt(),y=_(S);y.value=y.__value="default";var P=a(y,2);P.value=P.__value="input";var D=a(P,2);D.value=D.__value="output",n(le,S)}),$$slots:{default:!0},$$legacy:!0}),"component",i,103,12,{componentTag:"Input"}),n(N,J)}),$$slots:{default:!0}}),"component",i,101,8,{componentTag:"FormGroup"});var s=a(W,2);t(()=>pt(s,{children:r(i,(N,K)=>{var J=eo(),pe=_(J);t(()=>Re(pe,{children:r(i,(S,y)=>{E();var P=de("Additional Fields:");n(S,P)}),$$slots:{default:!0}}),"component",i,112,12,{componentTag:"Label"});var be=a(pe,2),le=v(be);t(()=>Ge(le,1,()=>o(w),Ye,(S,y,P)=>{var D=Wt(),me=v(D);t(()=>Me(me,{type:"text",placeholder:"Field name",class:"field-name",get value(){return o(y).name},set value(R){o(y).name=R,ut(()=>o(w))},$$legacy:!0}),"component",i,116,24,{componentTag:"Input"});var Ie=a(me,2);t(()=>Me(Ie,{type:"text",placeholder:"Field value",class:"field-value",get value(){return o(y).value},set value(R){o(y).value=R,ut(()=>o(w))},$$legacy:!0}),"component",i,122,24,{componentTag:"Input"});var ee=a(Ie,2);t(()=>Te(ee,{color:"danger",size:"sm",class:"remove-field-btn",$$events:{click:()=>lt(P)},children:r(i,(R,ge)=>{E();var Q=de("×");n(R,Q)}),$$slots:{default:!0}}),"component",i,128,24,{componentTag:"Button"}),m(D),n(S,D)}),"each",i,114,16);var A=a(le,2);t(()=>Te(A,{color:"success",size:"sm",class:"add-field-btn",$$events:{click:Ve},children:r(i,(S,y)=>{E();var P=de("+ Add Field");n(S,P)}),$$slots:{default:!0}}),"component",i,138,16,{componentTag:"Button"}),m(be),n(N,J)}),$$slots:{default:!0}}),"component",i,111,8,{componentTag:"FormGroup"}),m(u);var $=a(u,2),I=v($);t(()=>Te(I,{color:"secondary",class:"px-6 py-2",$$events:{click:()=>ne(!1)},children:r(i,(N,K)=>{E();var J=de("Cancel");n(N,J)}),$$slots:{default:!0}}),"component",i,150,8,{componentTag:"Button"});var j=a(I,2);t(()=>Te(j,{color:"primary",$$events:{click:st},children:r(i,(N,K)=>{E();var J=de("Save Changes");n(N,J)}),$$slots:{default:!0}}),"component",i,151,8,{componentTag:"Button"}),m($),n(x,z)}),$$slots:{default:!0}}),"component",i,85,0,{componentTag:"Modal"}),X(()=>{vt(ke,`background-color: ${o(V)??""};         border: 1px solid grey;`),Lt(je,(dt(T()),f(()=>T().text)))}),Ct("click",h,nt),n(ot,Je),Tt(Le)}e[l]="src/components/apps/graphUI/jsonSchemaParser.svelte";var ao=c(d('<i class="fas fa-database text-primary me-2"></i> JSON Schema to Visual Graph',1),e[l],[[1379,14]]),ro=c(d('<!> <p class="text-muted mb-0">Upload a JSON schema file or paste JSON to automatically generate a visual flow graph</p>',1),e[l],[[1382,12]]),no=c(d("<!> Load Agentic JSON",1),e[l],[]),so=c(d("<!> Load PCP JSON",1),e[l],[]),lo=c(d('<a href="/graphUI" style="text-decoration: none; color: inherit;">Create Your Own</a>'),e[l],[[1418,28]]),io=c(d(`<i class="fas fa-upload fa-3x text-muted mb-3"></i> <!> <!> <div><!></div> <div><!></div> <div><p>Don't See A Schema That Matches Your Needs?</p> <!></div>`,1),e[l],[[1393,20],[1403,20],[1409,20],[1415,20,[[1416,24]]]]),co=c(d('<!> <textarea id="jsonInput" class="form-control font-monospace" rows="10" placeholder="Paste your JSON schema here..." style="resize: none; font-size: 0.875rem;"></textarea>',1),e[l],[[1430,20]]),po=c(d("<!> <!>",1),e[l],[]),mo=c(d('<div class="d-flex align-items-center"><!> <span>Processing JSON schema...</span></div>'),e[l],[[1446,16,[[1448,18]]]]),_o=c(d("<strong>Error:</strong> ",1),e[l],[[1455,16]]),uo=c(d('<i class="fas fa-file-text me-2"></i> Graph Information',1),e[l],[[1465,20]]),vo=c(d("<strong>Name:</strong> ",1),e[l],[[1472,22]]),fo=c(d("<strong>Nodes:</strong> ",1),e[l],[[1475,22]]),go=c(d("<strong>Edges:</strong> ",1),e[l],[[1478,22]]),$o=c(d("<!> <!> <!>",1),e[l],[]),ho=c(d('<p class="text-muted mt-2 mb-0"> </p>'),e[l],[[1482,20]]),bo=c(d("<!> <!>",1),e[l],[]),yo=c(d("<!> <!>",1),e[l],[]),To=c(d('<i class="fas fa-project-diagram me-2"></i> Visual Graph',1),e[l],[[1491,20]]),xo=c(d("<!> <!> <!> <!>",1),e[l],[]),Po=c(d('<div style="height: 500px; border: 1px solid #dee2e6; border-radius: 0.375rem;"><!></div>'),e[l],[[1496,18]]),wo=c(d("<!> <!>",1),e[l],[]),No=c(d('<i class="fas fa-cogs me-2"></i> ',1),e[l],[[1532,24]]),Co=c(d('<div class="d-flex align-items-center mb-1"><div class="rounded-circle me-2"></div> <span class="fw-bold me-2"> </span> <!> <span class="ms-auto"> </span></div>'),e[l],[[1541,30,[[1542,32],[1546,32],[1548,32]]]]),ko=c(d('<div class="ms-2 mb-1"><strong>Config Fields:</strong> <!></div>'),e[l],[[1553,32,[[1554,34]]]]),Io=c(d('<!> <div class="ms-2 mb-1"><strong>Template:</strong> </div> <div class="ms-2 mb-1"><strong>Config:</strong> <pre style="background: #f5f5f5; padding: 6px; border-radius: 4px; font-size: 11px;"> </pre></div>',1),e[l],[[1560,30,[[1561,32]]],[1563,30,[[1564,32],[1565,32]]]]),Ao=c(d('<div class="d-flex flex-column mb-2 p-2 bg-light rounded"><!> <!></div>'),e[l],[[1539,26]]),So=c(d('<div class="overflow-auto" style="max-height: 300px;"></div>'),e[l],[[1537,22]]),Oo=c(d("<!> <!>",1),e[l],[]),Bo=c(d('<i class="fas fa-bolt me-2"></i> ',1),e[l],[[1582,24]]),Eo=c(d('<div class="d-flex align-items-center mb-2 p-2 bg-light rounded"><div class="d-flex align-items-center"><small class="fw-bold"> </small> <!> <small class="fw-bold"> </small></div> <!></div>'),e[l],[[1589,26,[[1590,28,[[1591,30],[1593,32]]]]]]),Fo=c(d('<div class="overflow-auto" style="max-height: 300px;"></div>'),e[l],[[1587,22]]),Mo=c(d("<!> <!>",1),e[l],[]),Lo=c(d("<!> <!>",1),e[l],[]),Jo=c(d("<!> <!> <!>",1),e[l],[]),qo=c(d("<!> <!> <!> <!> <!>",1),e[l],[]),jo=c(d("<!> <!>",1),e[l],[]);function e(ot,Ne){ht(new.target),yt(Ne,!1,e);let ae=$e(null),re=$e([]),T=$e([]),ne=$e(null),V=$e(!1),Ce=$e(),w=$e("");const at={textupdater:i},rt=(h,k)=>({"core.HumanInputNode":{type:"input",color:"#4CAF50",icon:"👤",label:"Human Input"},"core.LLMToolNode":{type:"default",color:"#2196F3",icon:"🤖",label:"LLM Tool"},"core.ToolNode":{type:"default",color:"#FF9800",icon:"🔧",label:"Tool"},__start__:{type:"input",color:"#9C27B0",icon:"▶️",label:"Start"},__end__:{type:"output",color:"#F44336",icon:"⏹️",label:"End"}})[h]||{type:"default",color:"#607D8B",icon:"📦",label:"Custom Node"};function nt(h={}){const k={id:crypto.randomUUID(),type:"textupdater",position:{x:Math.random()*400,y:Math.random()*400},data:{text:"New Node",fields:[]},style:{textAlign:"center"},...h};g(re,[...o(re),k])}const st=(h,k)=>{const Z={},L={},se=new Set,_e=new Set(k.map(u=>u.target)),ce=h.filter(u=>!_e.has(u.id)).map(u=>({node:u,level:0}));for(;ce.length>0;){const{node:u,level:F}=ce.shift();if(se.has(u.id))continue;se.add(u.id),L[u.id]=F,k.filter(s=>he(s.source,u.id)).map(s=>h.find($=>he($.id,s.target))).filter(s=>s&&!se.has(s.id)).forEach(s=>{ce.push({node:s,level:F+1})})}const z={};return Object.entries(L).forEach(([u,F])=>{z[F]||(z[F]=[]),z[F].push(u)}),Object.entries(z).forEach(([u,F])=>{const s=parseInt(u)*200+100,$=300,I=-(F.length-1)*$/2+400;F.forEach((j,N)=>{Z[j]={x:I+N*$,y:s}})}),Z},Ve=h=>{var k,Z;try{const L=[],se=[],_e=h.nodes.map(s=>s.id),x=_e.includes("__start__")||h.edges.some(s=>he(s.from,"__start__")),ce=_e.includes("__end__")||h.edges.some(s=>he(s.to,"__end__"))||((k=h.conditional_edges)==null?void 0:k.some(s=>Object.values(s.routing_map).includes("__end__")));x&&!_e.includes("__start__")&&L.push({id:"__start__",template:"__start__",config:{}}),ce&&!_e.includes("__end__")&&L.push({id:"__end__",template:"__end__",config:{}}),L.push(...h.nodes);const z=[...h.edges.map(s=>({source:s.from,target:s.to})),...((Z=h.conditional_edges)==null?void 0:Z.flatMap(s=>Object.entries(s.routing_map).map(([$,I])=>({source:s.from,target:I,condition:$}))))||[]],u=st(L,z),F=L.map(s=>{const $=rt(s.template,s.config),I=u[s.id]||{x:100,y:100},j=[];return s.config&&Object.entries(s.config).forEach(([N,K])=>{he(N,"target",!1)&&he(typeof K,"object",!1)&&j.push({name:N,value:String(K).length>30?String(K).substring(0,30)+"...":String(K)})}),{id:s.id,type:"default",position:I,data:{label:s.id,color:$.color,nodeType:$.type,fields:j,template:s.template,config:s.config,icon:$.icon},style:`background-color: ${$.color}; color: white; border: 2px solid ${$.color}; border-radius: 8px; padding: 10px; min-width: 150px;`}}),W=[];return h.edges.forEach((s,$)=>{W.push({id:`edge-${$}`,source:s.from,target:s.to,type:"smoothstep",animated:!1,style:"stroke: #b1b1b7; stroke-width: 2px;",label:s.condition||""})}),h.conditional_edges&&h.conditional_edges.forEach(s=>{Object.entries(s.routing_map).forEach(([$,I],j)=>{W.push({id:`cond-edge-${s.from}-${I}-${j}`,source:s.from,target:I,type:"smoothstep",animated:!0,style:"stroke: #FF6B6B; stroke-width: 2px;",label:$})})}),{nodes:F,edges:W}}catch(L){throw new Error(`Failed to parse JSON schema: ${L.message}`)}},lt=h=>{const k=h.target.files[0];if(!k)return;g(V,!0),g(ne,null);const Z=new FileReader;Z.onload=L=>{try{const se=JSON.parse(L.target.result);g(ae,se);const{nodes:_e,edges:x}=Ve(se);g(re,_e),g(T,x),g(V,!1)}catch(se){g(ne,se.message),g(V,!1)}},Z.readAsText(k)},Le=h=>{try{g(ne,null),g(V,!0);const k=JSON.parse(h);g(ae,k);const{nodes:Z,edges:L}=Ve(k);g(re,Z),g(T,L),g(V,!1)}catch(k){g(ne,k.message),g(V,!1)}},Je=`{
    "graph_name": "agentic_flow",
    "description": "A simple agentic workflow that conditionally calls a tool based on user input.",
    "state_schema": {
      "messages": {
        "type": "List[Any]",
        "continue": "str",
        "default": []
      }
    },
    "nodes": [
      {
        "id": "human_input_node",
        "template": "core.HumanInputNode",
        "config": {
          "target": "messages"
        }
      },
      {
        "id": "llm_node",
        "template": "core.LLMToolNode",
        "config": {
          "prompt": "{messages}\\nYou are a helpful assistant. Respond to the user input. Use tools if necessary.\\n\\n",
          "llm_id": "openai",
          "target": "messages",
          "tool_names": [
            "tool_brave_image_search_post",
            "tool_brave_web_search_post"
          ]
        }
      },
      {
        "id": "tool_node",
        "template": "core.ToolNode",
        "config": {
          "target": "messages",
          "tool_names": [
            "tool_brave_web_search_post"
          ]
        }
      }
    ],
    "edges": [
      {
        "from": "__start__",
        "to": "human_input_node"
      },
      {
        "from": "human_input_node",
        "to": "llm_node"
      },
      {
        "from": "tool_node",
        "to": "llm_node"
      }
    ],
    "conditional_edges": [
      {
        "from": "llm_node",
        "target": "messages",
        "routing_map": {
          "tool_call": "tool_node",
          "no_tool_call": "__end__"
        }
      }
    ]
  }`,ke=`
    {

  "graph_name": "pcp_member_match",

  "description": "A workflow for matching members with providers based on various criteria.",

  "state_schema": {

    "messages": {

      "type": "List[Any]",

      "default": []

    },

    "provider_data": {

      "type": "dict",

      "default": {}

    },

    "member_id": {

      "type": "str",

      "default": ""

    },

    "member_name": {

      "type": "str",

      "default": ""

    },

    "member_requirements": {

      "type": "str",

      "default": ""

    },

    "member_location": {

      "type": "str",

      "default": ""

    },

    "member_cultural_preferences": {

      "type": "str",

      "default": ""

    },

    "member_clinical_needs": {

      "type": "str",

      "default": ""

    },

    "member_insurance": {

      "type": "str",

      "default": ""

    },

    "member_urgency": {

      "type": "str",

      "default": ""

    },

    "member_contact": {

      "type": "str",

      "default": ""

    },

    "raw_member_data": {

      "type": "dict",

      "default": {}

    },

    "provider_validation_status": {

      "type": "str",

      "default": "pending"

    },

    "member_profile_analysis": {

      "type": "str",

      "default": "pending"

    },

    "phase2_validation_result": {

      "type": "str",

      "default": "pending"

    },

    "phase2_completion_status": {

      "type": "str",

      "default": "pending"

    },

    "matching_phase_initiated": {

      "type": "str",

      "default": "pending"

    },

    "matching_start_timestamp": {

      "type": "str",

      "default": ""

    },

    "data_error_status": {

      "type": "str",

      "default": "pending"

    },

    "availability_score": {

      "type": "float",

      "default": 0

    },

    "cultural_match_score": {

      "type": "float",

      "default": 0

    },

    "clinical_compatibility_score": {

      "type": "float",

      "default": 0

    },

    "geographical_match_score": {

      "type": "float",

      "default": 0

    },

    "match_evaluation_result": {

      "type": "str",

      "default": "pending"

    },

    "matched_provider_ids": {

      "type": "List[Any]",

      "default": []

    },

    "match_scores": {

      "type": "List[Any]",

      "default": []

    },

    "match_details": {

      "type": "List[Any]",

      "default": []

    },

    "best_match_score": {

      "type": "float",

      "default": 0

    },

    "assignment_status": {

      "type": "str",

      "default": "pending"

    },

    "conflict_status": {

      "type": "str",

      "default": "pending"

    },

    "notification_status": {

      "type": "str",

      "default": "pending"

    },

    "special_case_status": {

      "type": "str",

      "default": "pending"

    },

    "special_case_retry_count": {

      "type": "int",

      "default": 0

    },

    "qa_status": {

      "type": "str",

      "default": "pending"

    },

    "feedback_status": {

      "type": "str",

      "default": "pending"

    },

    "feedback_notes": {

      "type": "str",

      "default": ""

    }

  },

  "nodes": [

    {

      "id": "provider_database_node",

      "template": "provider_member_match.ProviderDatabaseNode",

      "config": {

        "target": "provider_data",

        "database_config": {

          "query_method": "all",

          "max_results": 5,

          "filter_criteria": {},

          "table_format": "structured"

        }

      }

    },
 
{

      "id": "member_data_input_node",

      "template": "provider_member_match.MemberDataInputNode",

      "config": {

        "member_id": {

          "target": "member_id",

          "prompt": "Please enter your member ID:"

        },

        "member_name": {

          "target": "member_name",

          "prompt": "Please enter your member name:"

        },

        "member_requirements": {

          "target": "member_requirements",

          "prompt": "Please enter your member requirements:"

        },

        "member_location": {

          "target": "member_location",

          "prompt": "Please enter your member location (optional):"

        },

        "member_cultural_preferences": {

          "target": "member_cultural_preferences",

          "prompt": "Please enter your member cultural preferences (optional):"

        },

        "member_clinical_needs": {

          "target": "member_clinical_needs",

          "prompt": "Please enter your member clinical needs (optional):"

        },

        "member_insurance": {

          "target": "member_insurance",

          "prompt": "Please enter your member insurance information (optional):"

        },

        "member_urgency": {

          "target": "member_urgency",

          "prompt": "Please enter your member urgency level (optional):"

        },

        "member_contact": {

          "target": "member_contact",

          "prompt": "Please enter your member contact information (optional):"

        }

      }

    },

    {

      "id": "provider_data_validation_node",

      "template": "provider_member_match.ProviderDataValidationNode",

      "config": {

        "required_fields": [

          "provider_id",

          "provider_name",

          "provider_specialties",

          "provider_location"

        ],

        "target": "provider_validation_status"

      }

    },

    {

      "id": "member_profile_analysis_node",

      "template": "provider_member_match.MemberProfileAnalysisNode",

      "config": {

        "required_fields": [

          "member_id",

          "member_name",

          "member_requirements"

        ],

        "target": "member_profile_analysis"

      }

    },

    {

      "id": "data_error_handler_node",

      "template": "provider_member_match.DataErrorHandlerNode",

      "config": {

        "error_mode": "strict",

        "target": "data_error_status"

      }

    },

    {

      "id": "availability_check_node",

      "template": "provider_member_match.AvailabilityCheckNode",

      "config": {

        "target": "availability_score",

        "criteria": {

          "require_weekend_availability": true

        }

      }

    },

    {

      "id": "cultural_matching_node",

      "template": "provider_member_match.CulturalMatchingNode",

      "config": {

        "target": "cultural_match_score",

        "llm_id": "openai"

      }

    },

    {

      "id": "clinical_compatibility_node",

      "template": "provider_member_match.ClinicalCompatibilityNode",

      "config": {

        "target": "clinical_compatibility_score",

        "llm_id": "openai"

      }

    },

    {

      "id": "geographical_matching_node",

      "template": "provider_member_match.GeographicalMatchingNode",

      "config": {

        "target": "geographical_match_score"

      }

    },

    {

      "id": "match_evaluation_node",

      "template": "provider_member_match.MatchEvaluationNode",

      "config": {

        "target": "match_evaluation_result",

        "required_matches": [

          "availability_score",

          "clinical_compatibility_score"

        ],

        "optional_matches": [

          "cultural_match_score",

          "geographical_match_score"

        ]

      }

    },

    {

      "id": "phase2_validation_decision_node",

      "template": "provider_member_match.Phase2ValidationDecisionNode",

      "config": {

        "phase_name": "Phase2_DataPreparation",

        "required_inputs": [

          "provider_validation_status",

          "member_profile_analysis"

        ],

        "target": "phase2_validation_result"

      }

    },

    {

      "id": "matching_coordinator_node",

      "template": "provider_member_match.MatchingCoordinatorNode",

      "config": {

        "target": "matching_phase_initiated"

      }

    },

    {

      "id": "pcp_assignment_node",

      "template": "provider_member_match.PCPAssignmentNode",

      "config": {

        "target": "assignment_status"

      }

    },

    {

      "id": "conflict_resolution_node",

      "template": "provider_member_match.ConflictResolutionNode",

      "config": {

        "target": "conflict_status"

      }

    },

    {

      "id": "member_notification_node",

      "template": "provider_member_match.MemberNotificationNode",

      "config": {

        "target": "notification_status"

      }

    },

    {

      "id": "special_case_handler_node",

      "template": "provider_member_match.SpecialCaseHandlerNode",

      "config": {

        "target": "special_case_status"

      }

    },

    {

      "id": "qa_analysis_node",

      "template": "provider_member_match.QAAnalysisNode",

      "config": {

        "target": "qa_status"

      }

    },

    {

      "id": "feedback_loop_node",

      "template": "provider_member_match.FeedbackLoopNode",

      "config": {

        "target": "feedback_status"

      }

    }

  ],

  "edges": [

    {

      "from": "__start__",

      "to": "provider_database_node"

    },

    {

      "from": "__start__",

      "to": "member_data_input_node"

    },

    {

      "from": "provider_database_node",

      "to": "provider_data_validation_node"

    },

    {

      "from": "member_data_input_node",

      "to": "member_profile_analysis_node"

    },

    {

      "from": "provider_data_validation_node",

      "to": "phase2_validation_decision_node"

    },

    {

      "from": "member_profile_analysis_node",

      "to": "phase2_validation_decision_node"

    },

    {

      "from": "matching_coordinator_node",

      "to": "availability_check_node"

    },

    {

      "from": "matching_coordinator_node",

      "to": "cultural_matching_node"

    },

    {

      "from": "matching_coordinator_node",

      "to": "clinical_compatibility_node"

    },

    {

      "from": "matching_coordinator_node",

      "to": "geographical_matching_node"

    },

    {

      "from": "availability_check_node",

      "to": "match_evaluation_node"

    },

    {

      "from": "cultural_matching_node",

      "to": "match_evaluation_node"

    },

    {

      "from": "clinical_compatibility_node",

      "to": "match_evaluation_node"

    },

    {

      "from": "geographical_matching_node",

      "to": "match_evaluation_node"

    },

    {

      "from": "pcp_assignment_node",

      "to": "member_notification_node"

    },

    {

      "from": "conflict_resolution_node",

      "to": "pcp_assignment_node"

    },

    {

      "from": "member_notification_node",

      "to": "qa_analysis_node"

    },

    {

      "from": "qa_analysis_node",

      "to": "feedback_loop_node"

    },

    {

      "from": "feedback_loop_node",

      "to": "__end__"

    },

    {

      "from": "data_error_handler_node",

      "to": "__end__"

    }

  ],

  "conditional_edges": [

    {

      "from": "phase2_validation_decision_node",

      "target": "phase2_validation_result",

      "routing_map": {

        "validation_passed": "matching_coordinator_node",

        "validation_failed": "data_error_handler_node"

      }

    },

    {

      "from": "match_evaluation_node",

      "target": "match_evaluation_result",

      "routing_map": {

        "no_suitable_match": "special_case_handler_node",

        "suitable_matches_found": "pcp_assignment_node"

      }

    },

    {

      "from": "pcp_assignment_node",

      "target": "assignment_status",

      "routing_map": {

        "conflict": "conflict_resolution_node",

        "assigned": "member_notification_node",

        "no_match": "special_case_handler_node"

      }

    },

    {

      "from": "special_case_handler_node",

      "target": "special_case_status",

      "routing_map": {

        "location_updated": "geographical_matching_node",

        "max_retries_reached": "__end__"

      }

    }

  ],

  "llms": [

    {

      "id": "openai",

      "type": "AzureOpenAI",

      "description": "Azure OpenAI GPT-4o model",

      "config": {

        "azure_endpoint": "YOUR_AZURE_OPENAI_ENDPOINT",

        "api_key": "YOUR_AZURE_OPENAI_API_KEY",

        "api_version": "2024-08-01-preview",

        "azure_deployment": "gpt-35-turbo",

        "model_version": "gpt-3.5-turbo"

      }

    }

  ],

  "tool_config": {

    "brave_web_search": {

      "url": "https://hpcsiaipoc-fastmcp.azurewebsites.net/mcp",

      "transport": "streamable_http"

    }

  }

}
 
    `,Ze=()=>{g(w,Je),Le(Je)},qe=()=>{g(w,ke),Le(ke)};At(()=>o(w),()=>{o(w).trim()&&Le(o(w))}),St();var je={...bt()};return xt(),t(()=>Jt(ot,{fluid:!0,class:"py-4",children:r(e,(h,k)=>{t(()=>et(h,{children:r(e,(Z,L)=>{t(()=>we(Z,{children:r(e,(se,_e)=>{t(()=>Oe(se,{children:r(e,(x,ce)=>{var z=jo(),u=_(z);t(()=>ze(u,{children:r(e,(W,s)=>{var $=ro(),I=_($);t(()=>De(I,{class:"h3 mb-2 d-flex align-items-center",children:r(e,(j,N)=>{var K=ao();E(),n(j,K)}),$$slots:{default:!0}}),"component",e,1378,12,{componentTag:"CardTitle"}),E(2),n(W,$)}),$$slots:{default:!0}}),"component",e,1377,10,{componentTag:"CardHeader"});var F=a(u,2);t(()=>Be(F,{children:r(e,(W,s)=>{var $=qo(),I=_($);t(()=>et(I,{class:"mb-4",children:r(e,(A,S)=>{var y=po(),P=_(y);t(()=>we(P,{lg:6,children:r(e,(me,Ie)=>{t(()=>Oe(me,{class:"h-100",children:r(e,(ee,R)=>{t(()=>Be(ee,{class:"text-center",children:r(e,(ge,Q)=>{var ue=io(),O=a(_(ue),2);t(()=>Re(O,{for:"fileInput",class:"h5 d-block mb-2",children:r(e,(B,p)=>{E();var b=de("Upload JSON Schema");n(B,b)}),$$slots:{default:!0}}),"component",e,1394,20,{componentTag:"Label"});var te=a(O,2);t(()=>Et(Me(te,{id:"fileInput",type:"file",accept:".json",class:"mb-3",$$events:{change:lt},$$legacy:!0}),B=>g(Ce,B),()=>o(Ce)),"component",e,1395,20,{componentTag:"Input"});var C=a(te,2),ie=v(C);t(()=>Te(ie,{color:"success",class:"w-100",style:"margin-bottom: 10px;",$$events:{click:Ze},children:r(e,(B,p)=>{var b=no(),G=_(b);t(()=>mt(G,{name:"play"}),"component",e,1405,24,{componentTag:"Icon"}),E(),n(B,b)}),$$slots:{default:!0}}),"component",e,1404,20,{componentTag:"Button"}),m(C);var q=a(C,2),U=v(q);t(()=>Te(U,{color:"success",class:"w-100",style:"margin-bottom: 10px;",$$events:{click:qe},children:r(e,(B,p)=>{var b=so(),G=_(b);t(()=>mt(G,{name:"play"}),"component",e,1411,24,{componentTag:"Icon"}),E(),n(B,b)}),$$slots:{default:!0}}),"component",e,1410,20,{componentTag:"Button"}),m(q);var oe=a(q,2),M=a(v(oe),2);t(()=>Te(M,{color:"success",class:"w-100",style:"margin-bottom: 10px;",children:r(e,(B,p)=>{var b=lo();n(B,b)}),$$slots:{default:!0}}),"component",e,1417,24,{componentTag:"Button"}),m(oe),n(ge,ue)}),$$slots:{default:!0}}),"component",e,1392,18,{componentTag:"CardBody"})}),$$slots:{default:!0}}),"component",e,1391,16,{componentTag:"Card"})}),$$slots:{default:!0}}),"component",e,1390,14,{componentTag:"Col"});var D=a(P,2);t(()=>we(D,{lg:6,children:r(e,(me,Ie)=>{t(()=>Oe(me,{class:"h-100",children:r(e,(ee,R)=>{t(()=>Be(ee,{children:r(e,(ge,Q)=>{var ue=co(),O=_(ue);t(()=>Re(O,{for:"jsonInput",class:"form-label",children:r(e,(C,ie)=>{E();var q=de("Or paste JSON directly:");n(C,q)}),$$slots:{default:!0}}),"component",e,1429,20,{componentTag:"Label"});var te=a(O,2);Ot(te),qt(te,function(){return o(w)},function(ie){g(w,ie)}),n(ge,ue)}),$$slots:{default:!0}}),"component",e,1428,18,{componentTag:"CardBody"})}),$$slots:{default:!0}}),"component",e,1427,16,{componentTag:"Card"})}),$$slots:{default:!0}}),"component",e,1426,14,{componentTag:"Col"}),n(A,y)}),$$slots:{default:!0}}),"component",e,1388,12,{componentTag:"Row"});var j=a(I,2);t(()=>Ht(j,{}),"component",e,1442,12,{componentTag:"AgentsTab"});var N=a(j,2);{var K=A=>{t(()=>gt(A,{color:"info",class:"mb-4",children:r(e,(S,y)=>{var P=mo(),D=v(P);t(()=>jt(D,{size:"sm",class:"me-2"}),"component",e,1447,18,{componentTag:"Spinner"}),E(2),m(P),n(S,P)}),$$slots:{default:!0}}),"component",e,1445,14,{componentTag:"Alert"})};t(()=>ye(N,A=>{o(V)&&A(K)}),"if",e,1444,12)}var J=a(N,2);{var pe=A=>{t(()=>gt(A,{color:"danger",class:"mb-4",children:r(e,(S,y)=>{var P=_o(),D=a(_(P));X(()=>H(D,` ${o(ne)??""}`)),n(S,P)}),$$slots:{default:!0}}),"component",e,1454,14,{componentTag:"Alert"})};t(()=>ye(J,A=>{o(ne)&&A(pe)}),"if",e,1453,12)}var be=a(J,2);{var le=A=>{var S=Jo(),y=_(S);t(()=>Oe(y,{class:"mb-4",children:r(e,(me,Ie)=>{var ee=yo(),R=_(ee);t(()=>ze(R,{children:r(e,(Q,ue)=>{t(()=>De(Q,{class:"h5 mb-0",children:r(e,(O,te)=>{var C=uo();E(),n(O,C)}),$$slots:{default:!0}}),"component",e,1464,18,{componentTag:"CardTitle"})}),$$slots:{default:!0}}),"component",e,1463,16,{componentTag:"CardHeader"});var ge=a(R,2);t(()=>Be(ge,{children:r(e,(Q,ue)=>{var O=bo(),te=_(O);t(()=>et(te,{children:r(e,(q,U)=>{var oe=$o(),M=_(oe);t(()=>we(M,{md:4,children:r(e,(b,G)=>{var Y=vo(),ve=a(_(Y));X(()=>H(ve,` ${o(ae),f(()=>o(ae).graph_name||"Unnamed")??""}`)),n(b,Y)}),$$slots:{default:!0}}),"component",e,1471,20,{componentTag:"Col"});var B=a(M,2);t(()=>we(B,{md:4,children:r(e,(b,G)=>{var Y=fo(),ve=a(_(Y));X(()=>H(ve,` ${o(re),f(()=>o(re).length)??""}`)),n(b,Y)}),$$slots:{default:!0}}),"component",e,1474,20,{componentTag:"Col"});var p=a(B,2);t(()=>we(p,{md:4,children:r(e,(b,G)=>{var Y=go(),ve=a(_(Y));X(()=>H(ve,` ${o(T),f(()=>o(T).length)??""}`)),n(b,Y)}),$$slots:{default:!0}}),"component",e,1477,20,{componentTag:"Col"}),n(q,oe)}),$$slots:{default:!0}}),"component",e,1470,18,{componentTag:"Row"});var C=a(te,2);{var ie=q=>{var U=ho(),oe=v(U,!0);m(U),X(()=>H(oe,(o(ae),f(()=>o(ae).description)))),n(q,U)};t(()=>ye(C,q=>{o(ae),f(()=>o(ae).description)&&q(ie)}),"if",e,1481,18)}n(Q,O)}),$$slots:{default:!0}}),"component",e,1469,16,{componentTag:"CardBody"}),n(me,ee)}),$$slots:{default:!0}}),"component",e,1462,14,{componentTag:"Card"});var P=a(y,2);t(()=>Oe(P,{class:"mb-4",children:r(e,(me,Ie)=>{var ee=wo(),R=_(ee);t(()=>ze(R,{children:r(e,(Q,ue)=>{t(()=>De(Q,{class:"h5 mb-0",children:r(e,(O,te)=>{var C=To();E(),n(O,C)}),$$slots:{default:!0}}),"component",e,1490,18,{componentTag:"CardTitle"})}),$$slots:{default:!0}}),"component",e,1489,16,{componentTag:"CardHeader"});var ge=a(R,2);t(()=>Be(ge,{children:r(e,(Q,ue)=>{var O=Po(),te=v(O);t(()=>zt(te,{get nodes(){return o(re)},get nodeTypes(){return at},get edges(){return o(T)},fitView:!0,children:r(e,(C,ie)=>{var q=xo(),U=_(q);t(()=>Dt(U,{}),"component",e,1498,22,{componentTag:"Controls"});var oe=a(U,2);t(()=>Rt(oe,{}),"component",e,1499,22,{componentTag:"Background"});var M=a(oe,2);t(()=>Gt(M,{position:"top-right",nodeColor:p=>{switch(p.type){case"Input":return"#6ede87";case"Output":return"#6865A5";case"default":return"#ffcc00";default:return"#ff0072"}},zoomable:!0,pannable:!0}),"component",e,1500,22,{componentTag:"MiniMap"});var B=a(M,2);t(()=>Yt(B,{position:"center-left",children:r(e,(p,b)=>{t(()=>Te(p,{$$events:{click:nt},children:r(e,(G,Y)=>{E();var ve=de("Add Node");n(G,ve)}),$$slots:{default:!0}}),"component",e,1518,24,{componentTag:"Button"})}),$$slots:{default:!0}}),"component",e,1517,20,{componentTag:"Panel"}),n(C,q)}),$$slots:{default:!0}}),"component",e,1497,20,{componentTag:"SvelteFlow"}),m(O),n(Q,O)}),$$slots:{default:!0}}),"component",e,1495,16,{componentTag:"CardBody"}),n(me,ee)}),$$slots:{default:!0}}),"component",e,1488,14,{componentTag:"Card"});var D=a(P,2);t(()=>et(D,{children:r(e,(me,Ie)=>{var ee=Lo(),R=_(ee);t(()=>we(R,{lg:6,children:r(e,(Q,ue)=>{t(()=>Oe(Q,{children:r(e,(O,te)=>{var C=Oo(),ie=_(C);t(()=>ze(ie,{children:r(e,(U,oe)=>{t(()=>De(U,{class:"h5 mb-0",children:r(e,(M,B)=>{var p=No(),b=a(_(p));X(()=>H(b,` Generated Nodes (${o(re),f(()=>o(re).length)??""})`)),n(M,p)}),$$slots:{default:!0}}),"component",e,1531,22,{componentTag:"CardTitle"})}),$$slots:{default:!0}}),"component",e,1530,20,{componentTag:"CardHeader"});var q=a(ie,2);t(()=>Be(q,{children:r(e,(U,oe)=>{var M=So();t(()=>Ge(M,5,()=>o(re),Ye,(B,p,b)=>{var G=Ao(),Y=v(G);t(()=>Te(Y,{style:"background-color: white; color: black; border: 1px solid #ccc;",class:"text-start w-100",$$events:{click:()=>(o(p).expanded=!o(p).expanded,ut(()=>o(re)))},children:r(e,(xe,Ue)=>{var Pe=Co(),Ee=v(Pe),fe=a(Ee,2),He=v(fe,!0);m(fe);var Fe=a(fe,2);t(()=>_t(Fe,{style:"background-color: black; color: white;",children:r(e,(Se,Qe)=>{E();var Xe=de();X(()=>H(Xe,(o(p),f(()=>o(p).data.nodeType)))),n(Se,Xe)}),$$slots:{default:!0}}),"component",e,1547,32,{componentTag:"Badge"});var Ae=a(Fe,2),it=v(Ae,!0);m(Ae),m(Pe),X(()=>{vt(Ee,`width: 16px; height: 16px; background-color: ${o(p),f(()=>o(p).data.color)??""};`),H(He,(o(p),f(()=>o(p).id))),H(it,(o(p),f(()=>o(p).expanded?"▼":"▶")))}),n(xe,Pe)}),$$slots:{default:!0}}),"component",e,1540,28,{componentTag:"Button"});var ve=a(Y,2);{var Ke=xe=>{var Ue=Io(),Pe=_(Ue);{var Ee=Se=>{var Qe=ko(),Xe=a(v(Qe),2);t(()=>Ge(Xe,1,()=>(o(p),f(()=>o(p).data.fields)),Ye,(Pt,We)=>{t(()=>_t(Pt,{color:"info",class:"me-1",children:r(e,(wt,Uo)=>{E();var ft=de();X(()=>H(ft,`${o(We),f(()=>o(We).name)??""}: ${o(We),f(()=>o(We).value)??""}`)),n(wt,ft)}),$$slots:{default:!0}}),"component",e,1556,36,{componentTag:"Badge"})}),"each",e,1555,34),m(Qe),n(Se,Qe)};t(()=>ye(Pe,Se=>{o(p),f(()=>o(p).data.fields.length>0)&&Se(Ee)}),"if",e,1552,30)}var fe=a(Pe,2),He=a(v(fe));m(fe);var Fe=a(fe,2),Ae=a(v(Fe),2),it=v(Ae);m(Ae),m(Fe),X(Se=>{H(He,` ${o(p),f(()=>o(p).data.template)??""}`),H(it,`${Se??""}
                                `)},[()=>(o(p),f(()=>JSON.stringify(o(p).data.config,null,2)))]),n(xe,Ue)};t(()=>ye(ve,xe=>{o(p),f(()=>o(p).expanded)&&xe(Ke)}),"if",e,1551,28)}m(G),n(B,G)}),"each",e,1538,24),m(M),n(U,M)}),$$slots:{default:!0}}),"component",e,1536,20,{componentTag:"CardBody"}),n(O,C)}),$$slots:{default:!0}}),"component",e,1529,18,{componentTag:"Card"})}),$$slots:{default:!0}}),"component",e,1528,16,{componentTag:"Col"});var ge=a(R,2);t(()=>we(ge,{lg:6,children:r(e,(Q,ue)=>{t(()=>Oe(Q,{children:r(e,(O,te)=>{var C=Mo(),ie=_(C);t(()=>ze(ie,{children:r(e,(U,oe)=>{t(()=>De(U,{class:"h5 mb-0",children:r(e,(M,B)=>{var p=Bo(),b=a(_(p));X(()=>H(b,` Generated Edges (${o(T),f(()=>o(T).length)??""})`)),n(M,p)}),$$slots:{default:!0}}),"component",e,1581,22,{componentTag:"CardTitle"})}),$$slots:{default:!0}}),"component",e,1580,20,{componentTag:"CardHeader"});var q=a(ie,2);t(()=>Be(q,{children:r(e,(U,oe)=>{var M=Fo();t(()=>Ge(M,5,()=>o(T),Ye,(B,p)=>{var b=Eo(),G=v(b),Y=v(G),ve=v(Y,!0);m(Y);var Ke=a(Y,2);t(()=>mt(Ke,{name:"arrow-right",style:"margin-left: 8px; margin-right: 8px;"}),"component",e,1592,30,{componentTag:"Icon"});var xe=a(Ke,2),Ue=v(xe,!0);m(xe),m(G);var Pe=a(G,2);{var Ee=fe=>{t(()=>_t(fe,{color:"danger",class:"ms-2",children:r(e,(He,Fe)=>{E();var Ae=de("Conditional");n(He,Ae)}),$$slots:{default:!0}}),"component",e,1596,30,{componentTag:"Badge"})};t(()=>ye(Pe,fe=>{o(p),f(()=>o(p).animated)&&fe(Ee)}),"if",e,1595,28)}m(b),X(()=>{H(ve,(o(p),f(()=>o(p).source))),H(Ue,(o(p),f(()=>o(p).target)))}),n(B,b)}),"each",e,1588,24),m(M),n(U,M)}),$$slots:{default:!0}}),"component",e,1586,20,{componentTag:"CardBody"}),n(O,C)}),$$slots:{default:!0}}),"component",e,1579,18,{componentTag:"Card"})}),$$slots:{default:!0}}),"component",e,1578,16,{componentTag:"Col"}),n(me,ee)}),$$slots:{default:!0}}),"component",e,1526,14,{componentTag:"Row"}),n(A,S)};t(()=>ye(be,A=>{o(ae)&&!o(ne)&&A(le)}),"if",e,1460,12)}n(W,$)}),$$slots:{default:!0}}),"component",e,1386,10,{componentTag:"CardBody"}),n(x,z)}),$$slots:{default:!0}}),"component",e,1376,8,{componentTag:"Card"})}),$$slots:{default:!0}}),"component",e,1375,6,{componentTag:"Col"})}),$$slots:{default:!0}}),"component",e,1374,4,{componentTag:"Row"})}),$$slots:{default:!0}}),"component",e,1373,2,{componentTag:"Container"}),Tt(je)}export{e as J,i as T};
