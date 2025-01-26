import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BestRoute from "./components/BestRoute";
import NavBar from "./components/NavBar";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Router>
      <main className="flex flex-col items-center justify-center w-screen gap-8">
        <NavBar />
        <ToastContainer theme="dark" position="bottom-center" hideProgressBar />

        <Routes>
          <Route
            path="/"
            element={
              <BestRoute startPoint="Santiago de Compostela" endPoint="Touro" />
            }
          />
        </Routes>

        <footer className="mt-8 mb-8 text-center text-sm p-2 mx-auto">
          Creado por{" "}
          <a
            href="."
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 font-semibold hover:underline"
          >
            sanluisdev
          </a>
          .
          <div className="text-xs flex-wrap mt-2">
            <span>Este xogo creouse con fins educativos</span>
            <span>
              , inspirándose no{" "}
              <a
                href="https://travle.earth"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 font-semibold hover:underline"
              >
                travle.earth
              </a>
              .
            </span>
          </div>
          <p className="text-xs mt-2">
            Os datos dos concellos proceden do © Instituto Xeográfico Nacional
            de España.
          </p>
        </footer>
      </main>
    </Router>
  );
}

export default App;
