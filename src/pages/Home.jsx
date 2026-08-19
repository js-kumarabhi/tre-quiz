import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
    "https://script.google.com/macros/s/AKfycbxBxASpXXCtWG-MA6iuypnozyb_b4n2UNs1wD9WJzOu8JXHB5e_TDRuQ-sUYt_mtj30Jg/exec";

function Home() {

    const navigate = useNavigate();

    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchQuizzes = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}?action=quizzes`
                );

                const result =
                    await response.json();

                if (!result.success) {
                    throw new Error(
                        result.message ||
                        "Failed to load quizzes."
                    );
                }

                setQuizzes(
                    result.quizzes || []
                );

            } catch (error) {

                console.error(
                    "Quiz loading error:",
                    error
                );

                setError(
                    error.message ||
                    "Unable to load quizzes."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchQuizzes();

    }, []);

    const handlePlay = (quiz) => {

        navigate(
            `/quiz/${encodeURIComponent(
                quiz.sheet
            )}`
        );

    }


    return (
        <div className="home-page">

            <header className="page-header">

                <div>

                    <h1>TRE Quiz</h1>

                    <p>
                        Practice tests and mock exams
                    </p>

                </div>


                <button
                    className="upload-btn"
                    onClick={() => navigate("/upload")}
                >
                    Upload CSV
                </button>

            </header>


            <main className="quiz-list">

                {loading && (
                    <p>Loading quizzes...</p>
                )}


                {!loading && error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}


                {!loading &&
                    !error &&
                    quizzes.length === 0 && (
                        <p>
                            No quizzes available.
                        </p>
                    )}


                {!loading &&
                    !error &&
                    quizzes.map((quiz) => (

                        <div
                            className="quiz-card"
                            key={quiz.id}
                        >

                            <div className="quiz-info">

                                <span className="quiz-badge">
                                    {quiz.sheet}
                                </span>


                                <h2>
                                    {quiz.title}
                                </h2>


                                <div className="quiz-meta">

                                    <span>
                                        {quiz.questions} Questions
                                    </span>

                                    <span>
                                        {quiz.questions} Marks
                                    </span>

                                    <span>
                                        7 Minutes
                                    </span>

                                </div>

                            </div>


                            <button
                                className="play-btn"
                                onClick={() =>
                                    handlePlay(quiz)
                                }
                            >
                                Play
                            </button>

                        </div>

                    ))}

            </main>

        </div>
    );
}

export default Home;