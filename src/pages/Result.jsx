import { useLocation, useNavigate } from "react-router-dom";

function Result() {
    const location = useLocation();
    const navigate = useNavigate();

    const { answers = {}, questions = [] } = location.state || {};

    let correct = 0;
    let incorrect = 0;
    let notAttempted = 0;

    questions.forEach((question) => {
        const answer = answers[question.id];

        if (!answer) {
            notAttempted++;
        } else if (answer === question.correctAnswer) {
            correct++;
        } else {
            incorrect++;
        }
    });

    const totalMarks = questions.reduce(
        (total, question) => total + question.points,
        0
    );

    const score = questions.reduce((total, question) => {
        if (answers[question.id] === question.correctAnswer) {
            return total + question.points;
        }

        return total;
    }, 0);

    return (
        <div className="result-page">
            <div className="result-card">
                <h1>Quiz Complete</h1>

                <div className="score">
                    {score}
                    <span> / {totalMarks}</span>
                </div>

                <div className="result-stats">
                    <div>
                        <strong>{correct}</strong>
                        <span>Correct</span>
                    </div>

                    <div>
                        <strong>{incorrect}</strong>
                        <span>Incorrect</span>
                    </div>

                    <div>
                        <strong>{notAttempted}</strong>
                        <span>Not Attempted</span>
                    </div>
                </div>

                <button
                    className="result-home"
                    onClick={() => navigate("/")}
                >
                    Back to Quizzes
                </button>
            </div>
        </div>
    );
}

export default Result;