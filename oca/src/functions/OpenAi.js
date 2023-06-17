import { OPEN_AI_API_KEY } from "../secrets";
import axios from "axios";

const apiClient = axios.create({
    baseURL: "https://api.openai.com/v1",
    headers: {
        Authorization: `Bearer ${OPEN_AI_API_KEY}`,
        "Content-Type": "application/json",
    },
});

// Function to create general feedback for the entire posting
export async function reviewEntireOpportunitiyGenerally(opportunity) {
    const prompt = `
        I am writing a volunteering opportunity on a volunteering platform called Goodsted. I want this opportunity to be clearer, friendlier and more attractive to get more applicants.
        Give me a clear list of changes to make for the opportunity as bulletpoints in style of "CHANGE [original this] TO [clearer/better this] BECAUSE [human-friendly reason]".
        For each change please include the "CHANGE", "TO", and "BECAUSE" tags in each line you return.
        If you have no feedback for the entire opportunity just write "NO FEEDBACK".
        The opportunity is:
        '${opportunity}'`;

    const response = await apiClient.post("/chat/completions", {
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
    });

    console.log(response);

    return response.data.choices[0].message.content;
}

// Function to evalute what's missing from the post
export async function whatsMissingFromThisOpportunity(opportunity) {
    const prompt = `Evaluate the following volunteering opportunity post for completeness, given the following checklist review the sections and indicate whether each is present (with "true") or missing ("false"):

    Title: Provide a clear, engaging title that sums up the volunteering opportunity.
    Organization's Information: Include the name of your organization and a brief introduction of what you do.
    Purpose of the Volunteer Position: Explain why this volunteer role exists and its relevance to the organization's mission.
    Key Responsibilities: List the tasks the volunteer will be expected to perform.
    Skills and Experience Required: Outline any necessary skills or experience that would be beneficial for the role.
    Time Commitment: Clearly state the expected time commitment (e.g., 5 hours per week, one-day event).
    Training and Support: Mention any training or support that will be provided to the volunteer.
    Location: If applicable, specify whether the work is remote or in a specific location.
    Benefits to the Volunteer: What will the volunteer gain from this experience? This could be anything from acquiring new skills, meeting new people, or the satisfaction of contributing to a good cause.
    How to Apply: Provide instructions on how volunteers can express their interest or apply. Include contact information for any further questions.
    Deadline: If applicable, mention the deadline for application or the date by which volunteers are needed.
    Acknowledgement: Acknowledge the potential volunteers' time and thank them for considering your opportunity.
    
    Include any further notes as a single paragraph after a "Notes: " tag.
    The opportunity is:'${opportunity}'`;

    const response = await apiClient.post("/chat/completions", {
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
    });

    console.log(response);
    let content = response.data.choices[0].message.content; 

    return content;
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
