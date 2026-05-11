import React, { useEffect, useState } from "react";

const InstallPWA = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const onClick = (evt) => {
    evt.preventDefault();
    if (!promptInstall) {
      return;
    }
    promptInstall.prompt();
  };

  if (!supportsPWA) {
    return null;
  }

  return (
    <button
      className="btn btn-dark rounded-pill position-fixed d-flex align-items-center gap-2"
      style={{ 
          bottom: "20px", 
          left: "20px", 
          zIndex: 9999, 
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          padding: "10px 20px",
          fontWeight: "600"
      }}
      id="setup_button"
      aria-label="Install app"
      title="Install App"
      onClick={onClick}
    >
      <i className="fa fa-download"></i> <span>Install App</span>
    </button>
  );
};

export default InstallPWA;
