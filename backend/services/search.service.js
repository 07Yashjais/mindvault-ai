import cosineSimilarity
from "compute-cosine-similarity";

import generateEmbedding
from "./embedding.service.js";

import Groq from "groq-sdk";
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const searchRelevantChunks =
async (question, chunks) => {

  const queryEmbedding =
    await generateEmbedding(
      question
    );

  const scoredChunks =
    chunks.map((chunk) => {

      const similarity =
        cosineSimilarity(
          queryEmbedding,
          chunk.embedding
        );

      return {
        text: chunk.text,
        similarity
      };
    });

  scoredChunks.sort(
    (a, b) =>
      b.similarity -
      a.similarity
  );

  return scoredChunks
    .slice(0, 3);
};

export default
searchRelevantChunks;

export const generateAnswer = async (
  question,
  context
) => {
  try {
    const response =
      await groq.chat.completions.create({
        model:
          "llama-3.3-70b-versatile",

        messages: [
          {
            role: "system",
            content:
              "Answer only from provided PDF context. If answer is missing, say 'Answer not found in document'. Keep answers clear and short.",
          },
          {
            role: "user",
            content: `
Question:
${question}

PDF Context:
${context}
            `,
          },
        ],

        temperature: 0.3,
      });

    return response.choices[0]
      .message.content;

  } catch (error) {
    console.log(
      "GROQ ERROR:",
      error.message
    );

    return "Error generating answer";
  }
};