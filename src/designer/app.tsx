import React, {useEffect} from "react";
import useDesigner from "#app/designer/hooks/useDesigner";
import {Mode} from "#app/ui/ui";
import Webifier from "#app/designer/webifiers/webifier";

const App = () => {
  const { ready, setMode, handler, mode } = useDesigner();
  useEffect(() => {
    if (ready) {
      setMode(Mode.SETTINGS);
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <div>
      coucou
      <Webifier
        handler={handler}
        mode={mode}
        target={Mode.SETTINGS}
      />
    </div>
  );
};

export default App;
