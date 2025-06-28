import { useState } from "react";
import Timer from "./Timer";
import QuizResults from "./QuizResults";

function Quiz({ quizData, duration = 300 }) {
  const mcqs = quizData.mcqs || [];
  const oneWord = quizData.oneWord || [];

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (type, index, value) => {
    setAnswers((prev) => ({ ...prev, [`${type}-${index}`]: value }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return <QuizResults mcqs={mcqs} oneWord={oneWord} answers={answers} />;
  }

  return (
    <div>
      <h2>Quiz</h2>
      <Timer seconds={duration} onComplete={handleSubmit} />

      {/* MCQs */}
      {mcqs.map((q, index) => (
        <div key={`mcq-${index}`} className="question-block">
          <p><strong>MCQ {index + 1}:</strong> {q.question}</p>
          {q.options.map((opt, i) => (
            <div key={i}>
              <input
                type="radio"
                name={`mcq-${index}`}
                value={opt}
                checked={answers[`mcq-${index}`] === opt}
                onChange={() => handleChange("mcq", index, opt)}
              />
              <label>{opt}</label>
            </div>
          ))}
        </div>
      ))}

      {/* One-word questions */}
      {oneWord.map((q, index) => (
        <div key={`one-${index}`} className="question-block">
          <p><strong>One-word {index + 1}:</strong> {q.question}</p>
          <input
            type="text"
            value={answers[`one-${index}`] || ""}
            onChange={(e) => handleChange("one", index, e.target.value)}
          />
        </div>
      ))}

      <button onClick={handleSubmit}>Submit Quiz</button>
    </div>
  );
}

export default Quiz;
