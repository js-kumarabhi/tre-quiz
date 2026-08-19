const API_URL =
    "https://script.google.com/macros/s/AKfycbxBxASpXXCtWG-MA6iuypnozyb_b4n2UNs1wD9WJzOu8JXHB5e_TDRuQ-sUYt_mtj30Jg/exec";


export async function getSheetData(sheetName) {
    const url =
        `${API_URL}?sheet=${encodeURIComponent(sheetName)}`;

    const response = await fetch(url);
    console.log("Response:", response);
    if (!response.ok) {
        throw new Error("Unable to connect to API");
    }

    const result = await response.json();

    if (!result.success) {
        throw new Error(result.message);
    }

    return result.data;
}