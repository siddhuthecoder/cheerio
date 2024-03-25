import "../css/bg.css";

const Background = () => {
  return (
    <>
      <section
        className="w-100 wrapper "
        style={{
          width: "100%",
          height: "100vh",
          position: "fixed",
          top: "0",
          left: "0",
          zIndex: "1",
        }}
      >
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
      </section>
    </>
  );
};

export default Background;
