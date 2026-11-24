import LegalPage from "./pages/Legal.jsx";

const routesLegal = [
  { path: "/termos-de-uso", element: <LegalPage type="terms" /> },
  { path: "/politica-de-privacidade", element: <LegalPage type="privacy" /> },
];

export default routesLegal;
