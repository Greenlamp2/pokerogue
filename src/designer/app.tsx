import React, {useEffect} from "react";
import useDesigner from "#app/designer/hooks/useDesigner";
import {Mode} from "#app/ui/ui";
import useWebify from "#app/designer/hooks/useWebify";

const App = () => {
  const { ready, setMode, mode, handler, render } = useDesigner();
  useEffect(() => {
    if (ready) {
      setMode(Mode.SETTINGS);
    }
  }, [ready]);

  useEffect(() => {
    if (mode) {
      // console.log("current mode:", mode);
    }
  }, [mode]);

  useEffect(() => {
    if (handler) {
      // console.log("current handler :", handler);
    }
  }, [handler]);
  if (!ready) {
    return null;
  }

  return (
    <div>
      { render() }
    </div>
  );
};

export default App;
