import { successResponse } from '../utils/apiResponse.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// console.log('Gemini API Key:', process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateQuizFromText = async (req, res, next) => {
  try {
    const { text } = req.body.data;
    
    console.log( text.substr(0, 100) );

    if (!text) {
      const error = new Error('No input text provided');
      error.statusCode = 400;
      return next(error);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
You are an intelligent quiz assistant. Based on the following study material, generate:

1. Three multiple choice questions (each with 4 options), with the correct option clearly marked.
2. Two one-word answer questions.
3. Provide short explanations for all answers.

Format output as valid JSON:
{
  "mcqs": [
    {
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "answer": "...",
      "explanation": "..."
    }
  ],
  "oneWord": [
    {
      "question": "...",
      "answer": "...",
      "explanation": "..."
    }
  ]
}

Text:
""" 
${text}
"""
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const generated = response.text();

    // Extract only the JSON
    const start = generated.indexOf('{');
    const end = generated.lastIndexOf('}');
    const jsonString = generated.slice(start, end + 1);

    let quiz;
    try {
      quiz = JSON.parse(jsonString);
    } catch (parseError) {
      const error = new Error('Failed to parse Gemini response. Possibly malformed JSON.');
      error.statusCode = 502;
      return next(error);
    }

    return successResponse(res, 'Quiz generated successfully', quiz);

  } catch (err) {
    next(err);
  }
};
