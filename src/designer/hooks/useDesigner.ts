import BattleScene from "#app/battle-scene.js";
import {useEffect, useState} from "react";
import {Mode} from "#app/ui/ui";
import useWebify from "./useWebify";


const useDesigner = () => {
  const [_game, setGame] = useState<Phaser.Game>(null);
  const [_battleScene, setBattleScene] = useState<BattleScene>(null);
  const [_ui, setUi] = useState(null);
  const [_mode, setMode] = useState(null);
  const [_handler, setHandler] = useState(null);
  const { render } = useWebify(_handler);

  useEffect(() => {
    import("../../main").then((game) => {
      setGame(game.game);
    });
  }, []);

  useEffect(() => {
    if (_game) {
      console.log("_game", _game);
      setBattleScene(_game.scene.getScene("battle") as BattleScene);
    }
  }, [_game]);

  useEffect(() => {
    if (!_battleScene?.ui) {
      return;
    }
    console.log("_battleScene", _battleScene);
    setUi(_battleScene.ui);
  }, [_battleScene]);

  useEffect(() => {
    if (!_ui) {
      return;
    }
    console.log("_ui", _ui);
    setHandler(_ui.getHandler());
  }, [_ui]);

  useEffect(() => {
    if (!_ui) {
      return;
    }
    setMode(_ui.getMode());
  }, [_ui]);

  return {
    scene: _battleScene,
    game: _game,
    mode: _mode,
    handler: _handler,
    setMode: (arg: Mode) => _battleScene?.ui?.setMode(arg),
    ready: !!_mode,
    render,
  };
};

export default useDesigner;
