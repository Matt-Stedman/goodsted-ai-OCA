import { OPEN_AI_API_KEY } from "../secrets";
import axios from "axios";

const apiClient = axios.create({
    baseURL: "https://api.openai.com/v1",
    headers: {
        Authorization: `Bearer ${OPEN_AI_API_KEY}`,
        "Content-Type": "application/json",
    },
});

/**
 * Function to create general feedback for the entire posting
 */
export async function reviewEntireOpportunityGenerally(opportunity) {
    const prompt = `
        I am writing a volunteering opportunity on a volunteering platform called Goodsted. I want this opportunity to be clearer, friendlier, and more attractive to get more applicants.
        Give me a clear list of changes to make for the opportunity as bullet points in the style of "CHANGE [original this] TO [clearer/better this] BECAUSE [human-friendly reason]".
        For each change, you must only and always include the "CHANGE", "TO", and "BECAUSE" tags in each line you return. You must not use any other keyword.
        The opportunity is:
        '${opportunity}'`;

    const response = await apiClient.post("/chat/completions", {
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
        max_tokens: 100,
    });

    console.log(response);

    return response.data.choices[0].message.content;
}

export const checklist = {
    Title: "Provide a clear, engaging title that sums up the volunteering opportunity.",
    "Organization's Information": "Include the name of your organization and a brief introduction of what you do.",
    "Purpose of the Volunteer Position":
        "Explain why this volunteer role exists and its relevance to the organization's mission.",
    "Key Responsibilities": "List the tasks the volunteer will be expected to perform.",
    "Skills and Experience Required":
        "Outline any necessary skills or experience that would be beneficial for the role.",
    "Time Commitment": "Clearly state the expected time commitment (e.g., 5 hours per week, one-day event).",
    "Training and Support": "Mention any training or support that will be provided to the volunteer.",
    Location: "If applicable, specify whether the work is remote or in a specific location.",
    "Benefits to the Volunteer":
        "What will the volunteer gain from this experience? This could be anything from acquiring new skills, meeting new people, or the satisfaction of contributing to a good cause.",
    "How to Apply":
        "Provide instructions on how volunteers can express their interest or apply. Include contact information for any further questions.",
    Deadline: "If applicable, mention the deadline for application or the date by which volunteers are needed.",
    Acknowledgement: "Acknowledge the potential volunteers' time and thank them for considering your opportunity.",
};

/**
 *  Function to evalute what's missing from the post
 */
export async function reviewEntireOpportunityAgainstChecklist(opportunity) {
    const prompt = `
        Evaluate the following volunteering opportunity post for completeness, evaluated against each topic (line by line) in the following checklist, indicating whether each is present (with "true") or missing ("false"):

        Please provide your evaluation by including "true" or "false" after each topic based on its presence or absence in the volunteering opportunity post. Use the format: "Topic: true" if the topic is present or "Topic: false" if the topic is missing.

        ${Object.entries(checklist)
            .map(([topic, description]) => `- ${topic}: ${description}`)
            .join("\n")}

        In addition, please provide any general notes or feedback in a single paragraph under the "Notes" section.

        Example response:
        ${Object.keys(checklist)
            .map((topic) => `${topic}: true`)
            .join("\n")}

        Notes: Please consider adding more details about the organization's background and the specific training and support provided to volunteers.

        The opportunity is: '${opportunity}'`;

    const response = await apiClient.post("/chat/completions", {
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
    });

    console.log(response);
    let content = response.data.choices[0].message.content;

    return content;
}

/**
 * Function to create a posting given a form response
 */
export async function createOpportunityFromForm(form_data) {
    const prompt = `
        I am writing a volunteering opportunity. Please convert the following bulletpoints (at the end of my message, under THIS IS THE DATA) into the format:
        
        ${Object.entries(checklist)
            .map(([topic, description]) => `- ${topic}: ${description}`)
            .join("\n")}

        For each topic, either list what you find in the opportunity text or can reliably infer, however if you cannot find any information relating to that topic just completely ignore it.
        So if there is no Deadline detailed, for example, do not return the deadline topic. Include html formatting for headers where each header is <h1> .. </h1> and each topic is wrapped in <p> .. </p>.

        THIS IS THE DATA:
        
        *What do we want to achieve?*
        ${form_data.what_do_we_want_to_achieve}
        
        *What do we need help with?*
        ${form_data.what_do_we_need_help_with}
        
        *What do we already have in place?*
        ${form_data.what_do_we_already_have_in_place}

        
        *Meta data*
        Location: ${form_data.metadata.loction}
        Title: ${form_data.metadata.title}
        Cause: ${form_data.metadata.cause}
        Deadline: ${form_data.metadata.deadline}
        Skills: ${form_data.metadata.skills.map((skill) => skill).join(", ")}
        Poster: ${form_data.metadata.poster}
        Company: ${form_data.metadata.company}
        `;

    const response = await apiClient.post("/chat/completions", {
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
    });

    console.log(response);
    let content = response.data.choices[0].message.content;

    return content;
}

/**
 * Function to get feedback on updates
 */
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
