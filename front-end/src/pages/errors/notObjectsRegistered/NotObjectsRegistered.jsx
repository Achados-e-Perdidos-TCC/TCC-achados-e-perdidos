import notFoundIllustration from "../../../assets/icons/notobjects/notFound-illustration.png";

import "./notObjectsRegistered.css";

function NotObjectsRegistered() {
  return (
    <div className="notobjectsRegistered__container">
      <div className="notobjectRegistered__content">
        <img className="notobjectRegistered__img" src={notFoundIllustration} />

        <div>
          <h1 className="notobjectRegistered__title">
            {" "}
            Ops! Não encontramos nenhum objeto cadastrado
          </h1>
          <p className="notobjectRegistered__subtitle">
            {" "}
            cadastre um objeto para conseguir visualiza-lo.{" "}
          </p>
        </div>
      </div>
    </div>
  );
}

export default NotObjectsRegistered;
