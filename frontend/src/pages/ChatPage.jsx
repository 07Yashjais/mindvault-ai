import { useState }
from "react";

import { useParams }
from "react-router-dom";

import API
from "../services/api";

function ChatPage() {

  const { id } =
  useParams();

  const [question,
  setQuestion] =
  useState("");

  const [messages,
  setMessages] =
  useState([]);

  const [loading,
  setLoading] =
  useState(false);

  const askQuestion =
  async () => {

    if (!question.trim())
      return;

    try {

      setLoading(true);

      const response =
      await API.post(
        `/docs/ask/${id}`,
        {
          question,
        }
      );

      const answer =
      response.data.answer;

      setMessages(
        (prev) => [
          ...prev,
          {
            type: "user",
            text:
            question,
          },
          {
            type: "bot",
            text:
            answer,
          },
        ]
      );

      setQuestion("");

    } catch (error) {

      console.log(error);

      alert(
        "Failed to ask question"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="
      min-h-screen
      bg-gray-100
      p-8
    ">

      <h1 className="
        text-3xl
        font-bold
        mb-6
      ">
        MindVault Chat
      </h1>

      <div className="
        bg-white
        rounded-xl
        shadow-md
        p-5
        h-[500px]
        overflow-y-auto
        mb-5
      ">

        {messages.length
        === 0 && (
          <p className="
          text-gray-500
          ">
            Ask anything
            from your PDF
          </p>
        )}

        {messages.map(
          (msg, index) => (

          <div
            key={index}
            className={`
            mb-4
            p-3
            rounded-lg
            max-w-[70%]
            ${
              msg.type
              === "user"
              ? `
                bg-black
                text-white
                ml-auto
              `
              : `
                bg-gray-200
              `
            }
          `}
          >
            {msg.text}
          </div>
        ))}

      </div>

      <div className="
        flex
        gap-4
      ">

        <input
          type="text"
          placeholder="
          Ask question
          from PDF...
          "
          value={
            question
          }
          onChange={(e) =>
            setQuestion(
              e.target.value
            )
          }
          className="
            flex-1
            border
            rounded-lg
            p-3
          "
        />

        <button
          onClick={
            askQuestion
          }
          disabled={
            loading
          }
          className="
            bg-black
            text-white
            px-6
            rounded-lg
          "
        >
          {loading
            ? "Thinking..."
            : "Send"}
        </button>

      </div>

    </div>
  );
}

export default ChatPage;