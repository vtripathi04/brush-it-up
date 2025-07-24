import React from "react";
import { QuestionCard } from "./QuestionCard";

export function QuizPage() {

    return (
        <QuestionCard  
            questionNumber={1} 
            questionText={"Do you like suagar ?"} 
            questionType={"mcq"}
            options={["little", "very", "no", "fu"]}
        />
    );

}