import {useEffect, useState} from "react";
import Phaser from "phaser";
import SettingsUiHandler from "../../ui/settings/settings-ui-handler.js";


const useDesigner = () => {
  const [_mode, setMode] = useState(null);
  const [_target, setTarget] = useState(null);
  useEffect(() => {
    const phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
    const instance = new SettingsUiHandler(undefined);
    setTarget(instance);
  }, []);

  return {
    target: _target,
    setTarget,
  };
};

export default useDesigner;
