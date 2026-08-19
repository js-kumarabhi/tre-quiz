import { HashRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import Upload from "./pages/Upload";

function App() {
  return (
    <HashRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/quiz/:quizId"
          element={<Quiz />}
        />

        <Route
          path="/result/:quizId"
          element={<Result />}
        />

        <Route
          path="/upload"
          element={<Upload />}
        />

      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />

    </HashRouter>
  );
}

export default App;