import { useState } from "react";
import axios from "../utils/api";

function QuizSetup({ onQuizGenerated }) {
  const [file, setFile] = useState(null);
  const [ytLink, setYtLink] = useState("");

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      else if (ytLink) formData.append("url", ytLink);

      const endpoint = file ? "/api/parse/upload-pdf" : "/api/parse/youtube-transcript";
      const { data } = await axios.post(endpoint, formData);

      // Call the LLM quiz generation API here
      const quizRes = await axios.post("/api/quiz/generate", { text: data.data.text });
      onQuizGenerated(quizRes.data.data.questions);
    } catch (err) {
      console.error(err);
      alert("Error generating quiz");
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <input type="text" placeholder="YouTube link" value={ytLink} onChange={(e) => setYtLink(e.target.value)} />
      <button onClick={handleUpload}>Generate Quiz</button>
    </div>
  );
}

export default QuizSetup;
