import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL =
    "https://script.google.com/macros/s/AKfycbxBxASpXXCtWG-MA6iuypnozyb_b4n2UNs1wD9WJzOu8JXHB5e_TDRuQ-sUYt_mtj30Jg/exec";

function Upload() {
    const navigate = useNavigate();
    const iframeRef = useRef(null);

    const [secret, setSecret] = useState("");
    const [sheetName, setSheetName] = useState("SET 1");
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!secret.trim()) {
            toast.error("Enter secret code.");
            return;
        }

        if (!file) {
            toast.error("Please select a CSV file.");
            return;
        }

        if (!file.name.toLowerCase().endsWith(".csv")) {
            toast.error("Only CSV files are allowed.");
            return;
        }

        if (!sheetName.trim()) {
            toast.error("Enter worksheet name.");
            return;
        }

        setUploading(true);

        const reader = new FileReader();

        reader.onload = () => {
            const form = document.createElement("form");

            form.method = "POST";
            form.action = API_URL;
            form.target = "csv-upload-frame";
            form.style.display = "none";

            const secretInput =
                document.createElement("input");

            secretInput.name = "secret";
            secretInput.value = secret;

            const sheetInput =
                document.createElement("input");

            sheetInput.name = "sheetName";
            sheetInput.value = sheetName.trim();

            const csvInput =
                document.createElement("textarea");

            csvInput.name = "csvData";
            csvInput.value = reader.result;

            form.appendChild(secretInput);
            form.appendChild(sheetInput);
            form.appendChild(csvInput);

            document.body.appendChild(form);

            form.submit();

            setTimeout(() => {
                document.body.removeChild(form);

                setUploading(false);

                toast.success(
                    `${sheetName} upload submitted successfully.`
                );

                setSecret("");
                setFile(null);

                const fileInput =
                    document.getElementById("csv-file");

                if (fileInput) {
                    fileInput.value = "";
                }
            }, 2000);
        };

        reader.onerror = () => {
            setUploading(false);
            toast.error("Unable to read CSV file.");
        };

        reader.readAsText(file);
    };

    return (
        <div className="upload-page">

            <div className="upload-card">

                <button
                    className="back-button"
                    onClick={() => navigate("/")}
                >
                    ← Back
                </button>

                <h1>Upload Quiz</h1>

                <p className="upload-description">
                    Upload a CSV file to create or update
                    a quiz worksheet.
                </p>


                <form onSubmit={handleSubmit}>

                    {/* Secret */}
                    <div className="form-group">

                        <label>
                            Secret Code
                        </label>

                        <input
                            type="password"
                            value={secret}
                            onChange={(e) =>
                                setSecret(e.target.value)
                            }
                            placeholder="Enter secret code"
                        />

                    </div>


                    {/* Worksheet */}
                    <div className="form-group">

                        <label>
                            Worksheet
                        </label>

                        <input
                            type="text"
                            value={sheetName}
                            onChange={(e) =>
                                setSheetName(e.target.value)
                            }
                            placeholder="SET 1"
                        />

                        <small>
                            Example: SET 1, SET 2, SET 3
                        </small>

                    </div>


                    {/* CSV */}
                    <div className="form-group">

                        <label>
                            CSV File
                        </label>

                        <input
                            id="csv-file"
                            type="file"
                            accept=".csv,text/csv"
                            onChange={(e) =>
                                setFile(e.target.files[0])
                            }
                        />

                        {file && (
                            <div className="selected-file">
                                📄 {file.name}
                            </div>
                        )}

                    </div>


                    <button
                        type="submit"
                        className="upload-submit-btn"
                        disabled={uploading}
                    >
                        {uploading
                            ? "Uploading..."
                            : "Upload CSV"}
                    </button>

                </form>

            </div>


            {/* Hidden iframe for POST */}
            <iframe
                ref={iframeRef}
                name="csv-upload-frame"
                title="CSV Upload"
                style={{
                    display: "none",
                }}
            />

        </div>
    );
}

export default Upload;