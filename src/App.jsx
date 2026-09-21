import FeedbackForm from "./components/FeedbackForm";

function App() {
  return (
    <div className="app">
      <h1 style={{ textAlign: "center", marginTop: "30px", color: "#1d2939" }}>
        Форма обратной связи
      </h1>
      <FeedbackForm />
    </div>
  );
}

export default App;