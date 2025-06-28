import { useState } from "react";
import Quiz from "./components/Quiz";

function App() {
  const [quizData, setQuizData] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePdfSubmit = async () => {
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", pdfFile);

    try {
      const res = await fetch("http://localhost:5000/api/parse/upload-pdf", {
        method: "POST",
        body: formData,
      });

      console.log(res);
      const rawText = await res.text(); // get raw body
      console.log("Raw PDF parse response:", rawText);

      let data;
      try {
        data = JSON.parse(rawText);
      } catch (err) {
        throw new Error("❌ PDF parse did not return valid JSON");
      }

      if (!data || !data.data || !data.data.text) throw new Error("Failed to parse PDF");

      console.log( data );

      // Call quiz generation API
      const quizRes = await fetch("http://localhost:5000/api/quiz/generate_quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: data.data }),
      });

      const quiz = await quizRes.json();
      
      setQuizData(quiz.data);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  const handleYoutubeSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/youtube/fetch-transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: youtubeUrl }),
      });

      const data = await res.json();

      if (!data || !data.data || !data.data.text) throw new Error("Transcript fetch failed");

      const quizRes = await fetch("http://localhost:5000/api/quiz/generate_quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: data.data }),
      });

      const quiz = await quizRes.json();
      setQuizData(quiz.data);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  if (quizData) {
    return <Quiz quizData={quizData} />;
  }

  return (
    <div className="app">
      <h1>🧠 Brush It Up Quiz Generator</h1>

      {error && <p style={{ color: "red" }}>❌ {error}</p>}
      {loading && <p>⏳ Loading...</p>}

      <div style={{ marginBottom: "2rem" }}>
        <h2>Upload PDF</h2>
        <input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files[0])} />
        <button onClick={handlePdfSubmit} disabled={!pdfFile || loading}>Generate Quiz</button>
      </div>

      <div>
        <h2>Or Paste YouTube Video Link</h2>
        <input
          type="text"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          style={{ width: "300px" }}
        />
        <button onClick={handleYoutubeSubmit} disabled={!youtubeUrl || loading}>Generate Quiz</button>
      </div>
    </div>
  );
}

export default App;
