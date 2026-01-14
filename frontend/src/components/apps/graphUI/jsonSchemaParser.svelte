<script>
    import { 
      Container, 
      Row, 
      Col, 
      Card, 
      CardHeader, 
      CardBody, 
      CardTitle, 
      Button, 
      Input, 
      Label, 
      Alert, 
      Spinner,
      Badge,
      Icon
    } from '@sveltestrap/sveltestrap';
    
    import { SvelteFlow, Controls, Background, MiniMap, Panel} from '@xyflow/svelte';
    import '@xyflow/svelte/dist/style.css';
    import TextUpdaterNode from './TextNode.svelte';
    import AgentsTab from '$lib/components/agents/AgentsTab.svelte';
    
    // State variables
    let jsonData = null;
    let nodes = [];
    let edges = [];
    let error = null;
    let isProcessing = false;
    let fileInput;
    let jsonTextInput = '';
    
    const nodeTypes = { textupdater: TextUpdaterNode };

    // Node type mapping and styling
    const getNodeTypeInfo = (template, config) => {
      const typeMap = {
        'core.HumanInputNode': {
          type: 'input',
          color: '#4CAF50',
          icon: '👤',
          label: 'Human Input'
        },
        'core.LLMToolNode': {
          type: 'default',
          color: '#2196F3',
          icon: '🤖',
          label: 'LLM Tool'
        },
        'core.ToolNode': {
          type: 'default',
          color: '#FF9800',
          icon: '🔧',
          label: 'Tool'
        },
        '__start__': {
          type: 'input',
          color: '#9C27B0',
          icon: '▶️',
          label: 'Start'
        },
        '__end__': {
          type: 'output',
          color: '#F44336',
          icon: '⏹️',
          label: 'End'
        }
      };
  
      return typeMap[template] || {
        type: 'default',
        color: '#607D8B',
        icon: '📦',
        label: 'Custom Node'
      };
    };
  

    function addNode(optionalFields = {}) {
        const newNode = {
            id: crypto.randomUUID(),
            type: 'textupdater',
            position: { x: Math.random() * 400, y: Math.random() * 400 },
            data: { 
                text: 'New Node',
                fields: [] // Initialize fields array
            },
            style: { textAlign: 'center' },
            ...optionalFields // Merge optional fields into the new node
        };
        nodes = [...nodes, newNode];
    }
    // Calculate node positions using a simple layout algorithm
    const calculateNodePositions = (nodes, edges) => {
      const positions = {};
      const levels = {};
      const visited = new Set();
      
      // Find root nodes (no incoming edges)
      const hasIncoming = new Set(edges.map(e => e.target));
      const rootNodes = nodes.filter(n => !hasIncoming.has(n.id));
      
      // BFS to assign levels
      const queue = rootNodes.map(n => ({ node: n, level: 0 }));
      
      while (queue.length > 0) {
        const { node, level } = queue.shift();
        
        if (visited.has(node.id)) continue;
        visited.add(node.id);
        
        levels[node.id] = level;
        
        // Find children
        const children = edges
          .filter(e => e.source === node.id)
          .map(e => nodes.find(n => n.id === e.target))
          .filter(n => n && !visited.has(n.id));
        
        children.forEach(child => {
          queue.push({ node: child, level: level + 1 });
        });
      }
      
      // Calculate positions
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
          positions[nodeId] = {
            x: startX + index * xSpacing,
            y: yPos
          };
        });
      });
      
      return positions;
    };
  
    // Parse JSON schema and convert to nodes/edges
    const parseJsonSchema = (data) => {
      try {
        const parsedNodes = [];
        const parsedEdges = [];
        
        // Add special start and end nodes if they don't exist
        const nodeIds = data.nodes.map(n => n.id);
        const hasStart = nodeIds.includes('__start__') || data.edges.some(e => e.from === '__start__');
        const hasEnd = nodeIds.includes('__end__') || data.edges.some(e => e.to === '__end__') || 
                      data.conditional_edges?.some(ce => Object.values(ce.routing_map).includes('__end__'));
        
        if (hasStart && !nodeIds.includes('__start__')) {
          parsedNodes.push({
            id: '__start__',
            template: '__start__',
            config: {}
          });
        }
        
        if (hasEnd && !nodeIds.includes('__end__')) {
          parsedNodes.push({
            id: '__end__',
            template: '__end__',
            config: {}
          });
        }
        
        // Add regular nodes
        parsedNodes.push(...data.nodes);
        
        // Calculate positions
        const allEdges = [
          ...data.edges.map(e => ({ source: e.from, target: e.to })),
          ...(data.conditional_edges?.flatMap(ce => 
            Object.entries(ce.routing_map).map(([condition, target]) => ({
              source: ce.from,
              target: target,
              condition
            }))
          ) || [])
        ];
        
        const positions = calculateNodePositions(parsedNodes, allEdges);
        
        // Convert to visual nodes
        const visualNodes = parsedNodes.map(node => {
          const typeInfo = getNodeTypeInfo(node.template, node.config);
          const position = positions[node.id] || { x: 100, y: 100 };
          
          // Create additional fields from config
          const additionalFields = [];
          if (node.config) {
            Object.entries(node.config).forEach(([key, value]) => {
              if (key !== 'target' && typeof value !== 'object') {
                additionalFields.push({
                  name: key,
                  value: String(value).length > 30 ? String(value).substring(0, 30) + '...' : String(value)
                });
              }
            });
          }
          
          return {
            id: node.id,
            type: 'default',
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
        
        // Convert to visual edges
        const visualEdges = [];
        
        // Regular edges
        data.edges.forEach((edge, index) => {
          visualEdges.push({
            id: `edge-${index}`,
            source: edge.from,
            target: edge.to,
            type: 'smoothstep',
            animated: false,
            style: 'stroke: #b1b1b7; stroke-width: 2px;',
            label: edge.condition || ''
          });
        });
        
        // Conditional edges
        if (data.conditional_edges) {
          data.conditional_edges.forEach(condEdge => {
            Object.entries(condEdge.routing_map).forEach(([condition, target], index) => {
              visualEdges.push({
                id: `cond-edge-${condEdge.from}-${target}-${index}`,
                source: condEdge.from,
                target: target,
                type: 'smoothstep',
                animated: true,
                style: 'stroke: #FF6B6B; stroke-width: 2px;',
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
  
    // Handle file upload
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      isProcessing = true;
      error = null;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
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
      
      reader.readAsText(file);
    };
  
    // Handle JSON text input
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
  
    // Sample JSON for testing
    const sampleJson = `{
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
  }`;
  
    const samplePCPjson = `
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
 
    `
    const loadSampleJson = () => {
      jsonTextInput = sampleJson;
      handleJsonInput(sampleJson);
    };
    const loadSampleJson2 = () => {
      jsonTextInput = samplePCPjson;
      handleJsonInput(samplePCPjson);
    };
    // Reactive statement to handle text input changes
    $: if (jsonTextInput.trim()) {
      handleJsonInput(jsonTextInput);
    }
  </script>
  
  <Container fluid class="py-4">
    <Row>
      <Col>
        <Card>
          <CardHeader>
            <CardTitle class="h3 mb-2 d-flex align-items-center">
              <i class="fas fa-database text-primary me-2"></i>
              JSON Schema to Visual Graph
            </CardTitle>
            <p class="text-muted mb-0">
              Upload a JSON schema file or paste JSON to automatically generate a visual flow graph
            </p>
          </CardHeader>
          <CardBody>
            <!-- Input Section -->
            <Row class="mb-4">
              <!-- File Upload -->
              <Col lg={6}>
                <Card class="h-100">
                  <CardBody class="text-center">
                    <i class="fas fa-upload fa-3x text-muted mb-3"></i>
                    <Label for="fileInput" class="h5 d-block mb-2">Upload JSON Schema</Label>
                    <Input
                      id="fileInput"
                      type="file"
                      accept=".json"
                      bind:this={fileInput}
                      on:change={handleFileUpload}
                      class="mb-3"
                    />
                    <div>
                    <Button color="success" on:click={loadSampleJson} class="w-100" style="margin-bottom: 10px;">
                        <Icon name="play" />
                      Load Agentic JSON
                    </Button>
                    </div>
                    <div>
                    <Button color="success" on:click={loadSampleJson2} class="w-100" style="margin-bottom: 10px;">
                        <Icon name="play" />
                        Load PCP JSON
                      </Button>
                    </div>
                    <div>
                        <p>Don't See A Schema That Matches Your Needs?</p>
                        <Button color="success" class="w-100" style="margin-bottom: 10px;">
                            <a href="/graphUI" style="text-decoration: none; color: inherit;">Create Your Own</a>
                          </Button>
                        </div>
                  </CardBody>
                </Card>
              </Col>
  
              <!-- JSON Text Input -->
              <Col lg={6}>
                <Card class="h-100">
                  <CardBody>
                    <Label for="jsonInput" class="form-label">Or paste JSON directly:</Label>
                    <textarea
                      id="jsonInput"
                      bind:value={jsonTextInput}
                      class="form-control font-monospace"
                      rows="10"
                      placeholder="Paste your JSON schema here..."
                      style="resize: none; font-size: 0.875rem;"
                    ></textarea>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <AgentsTab/>
            <!-- Processing/Error States -->
            {#if isProcessing}
              <Alert color="info" class="mb-4">
                <div class="d-flex align-items-center">
                  <Spinner size="sm" class="me-2" />
                  <span>Processing JSON schema...</span>
                </div>
              </Alert>
            {/if}
  
            {#if error}
              <Alert color="danger" class="mb-4">
                <strong>Error:</strong> {error}
              </Alert>
            {/if}
  
            <!-- Results -->
            {#if jsonData && !error}
              <!-- Graph Info -->
              <Card class="mb-4">
                <CardHeader>
                  <CardTitle class="h5 mb-0">
                    <i class="fas fa-file-text me-2"></i>
                    Graph Information
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md={4}>
                      <strong>Name:</strong> {jsonData.graph_name || 'Unnamed'}
                    </Col>
                    <Col md={4}>
                      <strong>Nodes:</strong> {nodes.length}
                    </Col>
                    <Col md={4}>
                      <strong>Edges:</strong> {edges.length}
                    </Col>
                  </Row>
                  {#if jsonData.description}
                    <p class="text-muted mt-2 mb-0">{jsonData.description}</p>
                  {/if}
                </CardBody>
              </Card>
  
              <!-- Visual Graph -->
              <Card class="mb-4">
                <CardHeader>
                  <CardTitle class="h5 mb-0">
                    <i class="fas fa-project-diagram me-2"></i>
                    Visual Graph
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div style="height: 500px; border: 1px solid #dee2e6; border-radius: 0.375rem;">
                    <SvelteFlow {nodes} {nodeTypes}{edges} fitView>
                      <Controls />
                      <Background />
                      <MiniMap position="top-right"
                        nodeColor={(node) => {
                        switch (node.type) {
                            case 'Input':
                            return '#6ede87';
                            case 'Output':
                            return '#6865A5';
                            case 'default':
                            return '#ffcc00'; 
                            default:
                            return '#ff0072';
                        
                        }
                        }}
                        zoomable
                        pannable
                    />
                    <Panel position="center-left">
                        <Button on:click={addNode}>Add Node</Button>
                    </Panel>
                    </SvelteFlow>
                  </div>
                </CardBody>
              </Card>
  
              <!-- Generated Data -->
              <Row>
                <!-- Nodes -->
                <Col lg={6}>
                  <Card>
                    <CardHeader>
                      <CardTitle class="h5 mb-0">
                        <i class="fas fa-cogs me-2"></i>
                        Generated Nodes ({nodes.length})
                      </CardTitle>
                    </CardHeader>
                    <CardBody>
                      <div class="overflow-auto" style="max-height: 300px;">
                        {#each nodes as node, i}
                          <div class="d-flex flex-column mb-2 p-2 bg-light rounded">
                            <Button style="background-color: white; color: black; border: 1px solid #ccc;" class="text-start w-100" on:click={() => node.expanded = !node.expanded}>
                              <div class="d-flex align-items-center mb-1">
                                <div 
                                  class="rounded-circle me-2"
                                  style="width: 16px; height: 16px; background-color: {node.data.color};"
                                ></div>
                                <span class="fw-bold me-2">{node.id}</span>
                                <Badge style="background-color: black; color: white;">{node.data.nodeType}</Badge>
                                <span class="ms-auto">{node.expanded ? '▼' : '▶'}</span>
                              </div>
                            </Button>
                            {#if node.expanded}
                              {#if node.data.fields.length > 0}
                                <div class="ms-2 mb-1">
                                  <strong>Config Fields:</strong>
                                  {#each node.data.fields as field}
                                    <Badge color="info" class="me-1">{field.name}: {field.value}</Badge>
                                  {/each}
                                </div>
                              {/if}
                              <div class="ms-2 mb-1">
                                <strong>Template:</strong> {node.data.template}
                              </div>
                              <div class="ms-2 mb-1">
                                <strong>Config:</strong>
                                <pre style="background: #f5f5f5; padding: 6px; border-radius: 4px; font-size: 11px;">
{JSON.stringify(node.data.config, null, 2)}
                                </pre>
                              </div>
                            {/if}
                          </div>
                        {/each}
                      </div>
                    </CardBody>
                  </Card>
                </Col>
  
                <!-- Edges -->
                <Col lg={6}>
                  <Card>
                    <CardHeader>
                      <CardTitle class="h5 mb-0">
                        <i class="fas fa-bolt me-2"></i>
                        Generated Edges ({edges.length})
                      </CardTitle>
                    </CardHeader>
                    <CardBody>
                      <div class="overflow-auto" style="max-height: 300px;">
                        {#each edges as edge}
                          <div class="d-flex align-items-center mb-2 p-2 bg-light rounded">
                            <div class="d-flex align-items-center">
                              <small class="fw-bold">{edge.source}</small>
                              <Icon name="arrow-right" style="margin-left: 8px; margin-right: 8px;" />
                                <small class="fw-bold">{edge.target}</small>
                            </div>
                            {#if edge.animated}
                              <Badge color="danger" class="ms-2">Conditional</Badge>
                            {/if}
                          </div>
                        {/each}
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
  
              <!-- Export Instructions -->
              
            {/if}
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
  
  <style>
    :global(.svelteflow) {
      background: #f8f9fa;
    }
    
    :global(.svelteflow .svelte-flow__node) {
      font-size: 12px;
      text-align: center;
    }
    
    :global(.svelteflow .svelte-flow__edge-label) {
      font-size: 10px;
      background: rgba(255, 255, 255, 0.8);
      padding: 2px 4px;
      border-radius: 3px;
    }
  </style>