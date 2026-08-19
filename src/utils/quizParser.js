export function parseQuestions(rows) {
    if (!rows || rows.length < 2) {
        return [];
    }

    const headers = rows[0];

    const column = (name) => headers.indexOf(name);

    const qnIndex = column("Q.N");
    const questionIndex = column("Questions");
    const optionAIndex = column("Option A");
    const optionBIndex = column("Option B");
    const optionCIndex = column("Option C");
    const optionDIndex = column("Option D");
    const optionEIndex = column("Option E");
    const correctIndex = column("Correct Answer");
    const pointsIndex = column("Points");

    return rows
        .slice(1)
        .map((row, index) => ({
            id: Number(row[qnIndex]) || index + 1,

            question: String(row[questionIndex] || ""),

            options: {
                A: String(row[optionAIndex] || ""),
                B: String(row[optionBIndex] || ""),
                C: String(row[optionCIndex] || ""),
                D: String(row[optionDIndex] || ""),
                E: String(row[optionEIndex] || "Not Attempted"),
            },

            correctAnswer: String(row[correctIndex] || "")
                .replace("Option ", "")
                .trim(),

            points: Number(row[pointsIndex]) || 1,
        }))
        .filter((question) => question.question.trim() !== "");
}