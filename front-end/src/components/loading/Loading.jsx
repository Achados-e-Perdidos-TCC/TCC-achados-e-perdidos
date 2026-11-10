import "./Loading.css";

function Loading() {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <span className="loading-text">Carregando...</span>
    </div>
  );
}

export default Loading;
