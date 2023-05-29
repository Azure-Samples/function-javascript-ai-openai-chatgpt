const { app } = require('@azure/functions');

app.http('http', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
      context.log(`Http function processed request for url "${request.url}"`);

      const name = request.query.get('name') || await request.text() || 'world';

      return { body: `Hello, ${name}!` };
  }
});

app.http('chat', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);

    const prompt = request.query.get('prompt') || await request.text() || 'prompt';
  
    if (!prompt) {
      context.error("prompt value is required in the query string or in the request body");
      return;
    }
  
    const {Configuration, OpenAIApi} = require("openai");
  
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openaiClient = new OpenAIApi(configuration);
  
    if (!configuration.apiKey) {
      context.error("OpenAI API key not configured, please follow instructions in README.md");
      return;
    }
  
    if (prompt.trim().length === 0) {
      res.status(400).json({
        error: {
          message: "Please enter a valid prompt",
        }
      });
      return;
    }
  
    let completion;
    try {
      completion = await openaiClient.createCompletion({
        model: "text-davinci-003",
        prompt: generatePrompt(prompt),
        temperature: 0.9,
        max_tokens: 200
      });
  
    } catch(error) {
      // Consider adjusting the error handling logic for your use case
      if (error.response) {
        console.error(error.response.status, error.response.data);
        context.error("Error with OpenAI API request: ${error.message}");
        return;
      } else {
        console.error("Error with OpenAI API request: ${error.message}");
        context.error("Error with OpenAI API request: ${error.message}");
        return;
      }
    }
  
    console.log("Completion result: /n" + completion.data.choices[0].text);
    return { jsonBody: completion.data.choices[0].text };
  }
});
  
function generatePrompt(prompt) {
    const capitalizedPrompt =
    prompt[0].toUpperCase() + prompt.slice(1).toLowerCase();

    // prompt template is important to set some context and training up front in addition to user driven input

    // Freeform question
    const promptTemplate = `${capitalizedPrompt}`; 

    // Chat
    //const promptTemplate = `The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How can I help you today?\nHuman: ${capitalizedPrompt}` 

    // Classification
    //const promptTemplate = `The following is a list of companies and the categories they fall into:\n\nApple, Facebook, Fedex\n\nApple\nCategory: ` 

    // Natural language to Python
    // const promptTemplate = '\"\"\"\n1. Create a list of first names\n2. Create a list of last names\n3. Combine them randomly into a list of 100 full names\n\"\"\"'

    return promptTemplate;
}
