import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { getSheetData } from "../services/googleSheets";
import { parseQuestions } from "../utils/quizParser";

function Quiz() {
    const { quizId } = useParams();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const sheetName = quizId.replace("tre-4-pre-set-", "SET ");

    useEffect(() => {
        async function loadQuiz() {
            try {
                setLoading(true);

                const rows = await getSheetData(sheetName);
                const parsedQuestions = parseQuestions(rows);

                if (parsedQuestions.length === 0) {
                    throw new Error("No questions found.");
                }

                setQuestions(parsedQuestions);
            } catch (err) {
                console.error(err);
                setError(err.message || "Unable to load quiz.");
            } finally {
                setLoading(false);
            }
        }

        loadQuiz();
    }, [sheetName]);

    const selectAnswer = (questionId, answer) => {
        setAnswers((previous) => ({
            ...previous,
            [questionId]: answer,
        }));
    };

    const submitQuiz = () => {
        const unansweredQuestions = questions.filter(
            (question) =>
                answers[question.id] === undefined
        );

        if (unansweredQuestions.length > 0) {
            toast.error(
                `Please answer all questions. ${unansweredQuestions.length} question${unansweredQuestions.length > 1 ? "s are" : " is"
                } still unanswered.`,
                {
                    position: "top-right",
                    autoClose: 3000,
                }
            );

            const firstUnanswered =
                unansweredQuestions[0];

            document
                .getElementById(
                    `question-${firstUnanswered.id}`
                )
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });

            return;
        }

        toast.success("Quiz submitted successfully!");

        navigate(`/result/${quizId}`, {
            state: {
                answers,
                questions,
            },
        });
    };
    if (loading) {
        return (
            <div className="quiz-loading">
                <div className="loading-spinner"></div>
                <p>Loading quiz...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="quiz-error">
                <h2>Unable to load quiz</h2>
                <p>{error}</p>

                <button onClick={() => navigate("/")}>
                    Back to Quizzes
                </button>
            </div>
        );
    }

    return (
        <div className="quiz-page">

            {/* Header */}
            <header className="quiz-header">

                <div>
                    <h1>TRE 4 PRE</h1>
                    <p>{sheetName}</p>
                </div>

                <div className="quiz-summary">
                    <span>
                        {questions.length} Questions
                    </span>

                    <span>
                        {Object.keys(answers).length} /{" "}
                        {questions.length} Answered
                    </span>
                </div>

            </header>


            {/* Questions */}
            <main className="all-questions-container">

                {questions.map((question, index) => {

                    const selectedAnswer =
                        answers[question.id];

                    return (
                        <div
                            key={question.id}
                            id={`question-${question.id}`}
                            className={`question-card ${selectedAnswer === undefined
                                ? "unanswered"
                                : ""
                                }`}
                        >

                            <div className="question-top">

                                <span className="question-number">
                                    Question {index + 1}
                                </span>

                                <span className="question-points">
                                    {question.points} Mark
                                    {question.points !== 1
                                        ? "s"
                                        : ""}
                                </span>

                            </div>


                            <h2>
                                {question.question}
                            </h2>


                            {/* Options */}
                            <div className="options">

                                {Object.entries(
                                    question.options
                                ).map(([key, value]) => {

                                    const selected =
                                        selectedAnswer === key;

                                    return (
                                        <label
                                            key={key}
                                            className={`option ${selected
                                                ? "selected"
                                                : ""
                                                }`}
                                        >

                                            <input
                                                type="radio"
                                                name={`question-${question.id}`}
                                                value={key}
                                                checked={selected}
                                                onChange={() =>
                                                    selectAnswer(
                                                        question.id,
                                                        key
                                                    )
                                                }
                                            />

                                            <span className="option-key">
                                                {key}
                                            </span>

                                            <span className="option-text">
                                                {value}
                                            </span>

                                        </label>
                                    );
                                })}

                            </div>

                        </div>
                    );
                })}


                {/* Submit section */}
                <div className="submit-section">

                    <div className="submit-info">
                        <strong>
                            {Object.keys(answers).length}
                        </strong>

                        <span>
                            / {questions.length} questions answered
                        </span>
                    </div>

                    <button
                        className="submit-quiz-btn"
                        onClick={submitQuiz}
                    >
                        Submit Quiz
                    </button>

                </div>

            </main>

        </div>
    );
}

export default Quiz;