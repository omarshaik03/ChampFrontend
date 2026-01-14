import { user } from "../login";

export async function logger_audit (
    user_id: string, 
    user_name: string, 
    group_id: string, 
    url_base: string, 
    token: string,
    logs: string,
    user_question?: string,
    response?: string,
    feedback?: string,
    model_id?: string,
    application?: string,
    database?: string,
    index?: string,
    tokens_used?: Number,
    time_taken?: Number,
    input_tokens?: Number,
    output_tokens?: Number,
    review_score?: string,
) {
    if (user_question === undefined){
        user_question = "N/A";
    }
    if (response === undefined){
        response = "N/A";
    }
    if (feedback === undefined){
        feedback = "N/A";
    }
    if (model_id === undefined){
        model_id = "N/A";
    }
    if (application === undefined){
        application = "N/A";
    }
    if (database === undefined){
        database = "N/A";
    }
    if (index === undefined){
        index = "N/A";
    }
    if (tokens_used === undefined){
        tokens_used = 0;
    }
    if (time_taken === undefined){
        time_taken = 0;
    }
    if (input_tokens === undefined){
        input_tokens = 0;
    }
    if (output_tokens === undefined){
        output_tokens = 0;
    }   
    if (review_score === undefined){
        review_score = "N/A";
    }


    try {
        await fetch(url_base + '/logs', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                "user_id": user_id,
                "user_name": user_name,
                "group_id": group_id,
                "log": logs,
                "user_question": user_question,
                "response": response,
                "feedback": feedback,
                "model_id": model_id,
                "application": application,
                "database": database,
                "index": index,
                "tokens_used": tokens_used,
                "time_taken": time_taken,
                "input_tokens": input_tokens,
                "output_tokens": output_tokens,
                "review_score": review_score
            })
        });
    }
    catch (error) {
        console.error("Error:", error);
    }
}