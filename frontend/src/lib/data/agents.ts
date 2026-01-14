export interface Agent {
	graph_name: string;
	description: string;
	running: boolean;
	full_config: any;
	config_id?: number; // Optional field for backend operations
	created_date?: string; // Optional field for tracking creation date
}

export const defaultAgents: Agent[] = [
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
                availability_score: { type: "float", default: 0.0 },
                cultural_match_score: { type: "float", default: 0.0 },
                clinical_compatibility_score: { type: "float", default: 0.0 },
                geographical_match_score: { type: "float", default: 0.0 },
                match_evaluation_result: { type: "str", default: "pending" },
                matched_provider_ids: { type: "List[Any]", default: [] },
                match_scores: { type: "List[Any]", default: [] },
                match_details: { type: "List[Any]", default: [] },
                best_match_score: { type: "float", default: 0.0 },
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
                        prompt:
                            "You are a healthcare data specialist tasked with retrieving member information from a healthcare database.\n\nBased on the provided member information:\n- Member Last Name: {member_last_name}\n- Member Date of Birth: {member_date_of_birth}\n- Member ID: {member_id}\n\nYour task is to:\n1. Use the available member search tools to find comprehensive member information\n2. Search for member demographics, address, and group membership details\n3. Ensure you retrieve the member's group key and zip code as these will be needed for provider matching\n\nPlease use the member_search tool with the provided member information. Focus on retrieving:\n- Group membership information (GRGR_ID)\n- Current address and zip code (SBAD_ZIP)\n- Complete member profile data\n\nExecute the member search now using the last name and date of birth.",
                        target: ["messages"],
                        llm_id: "openai",
                        tool_names: ["member_search"]
                    }
                },
                {
                    id: "llm_provider_data_node",
                    template: "core.LLMToolNode",
                    config: {
                        prompt:
                            "You are a healthcare network specialist tasked with finding suitable healthcare providers for a member.\n\nBased on the member information retrieved from the previous step:\n- Group Key: {group_key}\n- Member Zip Code: {member_zip_code}\n- Member Location: {member_location}\n- Member Clinical Needs: {member_clinical_needs}\n- Member Cultural Preferences: {member_cultural_preferences}\n\nYour task is to:\n1. Use the available provider search tools to find providers in the member's network\n2. Search for providers that match the member's geographic location and group membership\n3. Focus on providers that can meet the member's clinical and cultural needs\n\nPlease use the provider_search tool with the group key and zip code from the member data. Focus on retrieving:\n- Network providers within the member's group\n- Providers in or near the member's zip code\n- Provider specialties, languages, and availability\n- Complete provider profile data for matching\n\nExecute the provider search now using the group key and member zip code.",
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
