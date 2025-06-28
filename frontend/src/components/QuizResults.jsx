function QuizResults({ mcqs, oneWord, answers }) {
    let score = 0;
  
    return (
      <div>
        <h2>Quiz Results</h2>
  
        {mcqs.map((q, index) => {
          const userAns = answers[`mcq-${index}`];
          const correct = userAns === q.answer;
          if (correct) score++;
  
          return (
            <div key={`mcq-${index}`}>
              <p><strong>MCQ {index + 1}:</strong> {q.question}</p>
              <p>Your Answer: {userAns || "No answer"}</p>
              <p>Correct Answer: {q.answer}</p>
              <p>Explanation: {q.explanation}</p>
              <p style={{ color: correct ? "green" : "red" }}>
                {correct ? "✔ Correct" : "✖ Incorrect"}
              </p>
              <hr />
            </div>
          );
        })}
  
        {oneWord.map((q, index) => {
          const userAns = (answers[`one-${index}`] || "").trim().toLowerCase();
          const correctAns = q.answer.trim().toLowerCase();
          const correct = userAns === correctAns;
          if (correct) score++;
  
          return (
            <div key={`one-${index}`}>
              <p><strong>One-word {index + 1}:</strong> {q.question}</p>
              <p>Your Answer: {userAns || "No answer"}</p>
              <p>Correct Answer: {q.answer}</p>
              <p>Explanation: {q.explanation}</p>
              <p style={{ color: correct ? "green" : "red" }}>
                {correct ? "✔ Correct" : "✖ Incorrect"}
              </p>
              <hr />
            </div>
          );
        })}
  
        <h3>Your Score: {score} / {mcqs.length + oneWord.length}</h3>
      </div>
    );
  }
  
  export default QuizResults;
  