import BattleScene from "#app/battle-scene.js";
import {useEffect, useState} from "react";
import {Mode} from "#app/ui/ui";
import useOnChange from "#app/designer/hooks/useOnChange";


const useDesigner = () => {
  const [_game, setGame] = useState<Phaser.Game>(null);
  const [_battleScene, setBattleScene] = useState<BattleScene>(null);
  const [_ui, setUi] = useState(null);
  const [_mode, setMode] = useState(null);
  const [_ready, setReady] = useState(false);
  const [_handler, setHandler] = useState(null);

  useEffect(() => {
    import("../../main").then((game) => {
      setGame(game.game);
      setBattleScene(game.game.scene.getScene("battle") as BattleScene);
    });
  }, []);

  const onUiChange = (ui) => {
    setUi(ui);
  }
  const onModeChange = (mode) => {
    setMode(mode);
    const handler = _ui.getHandler();
    setHandler(handler);
    if (mode === Mode.TITLE) {
      setReady(true);
    }
  }
  useOnChange(_battleScene || {}, "ui", onUiChange);
  useOnChange(_ui || {}, "mode", onModeChange);

  return {
    scene: _battleScene,
    game: _game,
    handler: _handler,
    setMode: (arg: Mode) => _battleScene?.ui?.setMode(arg),
    ready: _ready,
    mode: _mode,
  };
};

export default useDesigner;
