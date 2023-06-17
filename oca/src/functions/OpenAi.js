import { OPEN_AI_API_KEY } from "../secrets";
import axios from "axios";

const apiClient = axios.create({
    baseURL: "https://api.openai.com/v1",
    headers: {
        Authorization: `Bearer ${OPEN_AI_API_KEY}`,
        "Content-Type": "application/json",
    },
});

// Function to create initial prompt
export async function reviewEntireOpportunitiyGenerally(opportunity) {
    const prompt = `I am writing a volunteering opportunity on a platform called Goodsted. Can you give me a your initial thoughts very briefly for the entire opportunity as bulletpoints in the style of "CHANGE [this] TO [this] BECAUSE [reason]?. You absolutely must include "CHANGE", "TO", and "BECAUSE" in each line. If you cannot provide any feedback then please just write "NO FEEDBACK". Currently, my entire opportunity looks like this: '${opportunity}'`;

    const response = await apiClient.post("/chat/completions", {
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
    });

    console.log(response);

    return response.data.choices[0].message.content;
}

// Function to get feedback on updates
export async function getFeedbackOnUpdate(currentOpportunity, pastOpportunities) {
    let pastOps = "";
    pastOpportunities.forEach((op) => {
        pastOps += `'${op}', `;
    });

    const prompt = `The current volunteer opportunity is '${currentOpportunity}'. Past opportunities are ${pastOps}. Please provide feedback on the current opportunity, taking into consideration the past opportunities.`;

    const response = await apiClient.post("/chat/completions", {
        prompt,
        max_tokens: 60,
    });

    return response.data.choices[0].text;
}

// Function for final check
export async function finalCheck(finalOpportunity) {
    const prompt = `Here is the final draft of the volunteer opportunity '${finalOpportunity}'. Please perform a final check and provide any additional feedback.`;

    const response = await apiClient.post("/chat/completions", {
        prompt,
        max_tokens: 60,
    });

    return response.data.choices[0].text;
}
