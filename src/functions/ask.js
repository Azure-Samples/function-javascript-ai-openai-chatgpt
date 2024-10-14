const { app, input } = require("@azure/functions");

// Simple ask http POST function that returns the completion based on user prompt
// This OpenAI completion input requires a {prompt} binding value
const openAICompletionInput = input.generic({
    prompt: '{prompt}?',
    maxTokens: '100',
    type: 'textCompletion',
    model: '%CHAT_MODEL_DEPLOYMENT_NAME%'
})

app.http('ask', {
    methods: ['POST'],
    route: 'ask',
    authLevel: 'function',
    extraInputs: [openAICompletionInput],
    handler: async (_request, context) => {
        var response = context.extraInputs.get(openAICompletionInput)
        return { body: response.content.trim() }
    }
});

// Simple WhoIs http GET function that returns the completion based on name from user
// This OpenAI completion input requires a {name} binding value.
const openAIWhoIsCompletionInput = input.generic({
    prompt: 'Who is {name}?',
    maxTokens: '100',
    type: 'textCompletion',
    model: '%CHAT_MODEL_DEPLOYMENT_NAME%'
})

app.http('whois', {
    methods: ['GET'],
    route: 'whois/{name}',
    authLevel: 'function',
    extraInputs: [openAIWhoIsCompletionInput],
    handler: async (_request, context) => {
        var response = context.extraInputs.get(openAIWhoIsCompletionInput)
        return { body: response.content.trim() }
    }
});
