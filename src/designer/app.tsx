import React, {useEffect, useState} from "react";
import useDesigner from "#app/designer/hooks/useDesigner";
import Webifier from "#app/designer/webifiers/webifier";
import SettingsUiHandler from "#app/ui/settings/settings-ui-handler";
import {initStatsKeys} from "#app/ui/game-stats-ui-handler";
import {initPokemonPrevolutions} from "#app/data/pokemon-evolutions";
import {initBiomes} from "#app/data/biomes";
import {initEggMoves} from "#app/data/egg-moves";
import {initPokemonForms} from "#app/data/pokemon-forms";
import {initSpecies} from "#app/data/pokemon-species";
import {initMoves} from "#app/data/move";
import {initAbilities} from "#app/data/ability";
import {initLoggedInUser} from "#app/account";
import {initVouchers} from "#app/system/voucher";
import {initAchievements} from "#app/system/achv";
import Phaser from "phaser";
import GameManager from "#test/utils/gameManager";
import BattleScene from "#app/battle-scene.js";
import GameWrapper from "#test/utils/gameWrapper";
import MockTextureManager from "#test/utils/mocks/mockTextureManager";

const App = () => {
  const [_loaded, setLoaded] = useState(false);
  const { target } = useDesigner();

  useEffect(() => {
    initVouchers();
    initAchievements();
    initStatsKeys();
    initPokemonPrevolutions();
    initBiomes();
    initEggMoves();
    initPokemonForms();
    initSpecies();
    initMoves();
    initAbilities();
    initLoggedInUser();
    const phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
    const scene = new BattleScene();
    const mockTextureManager = new MockTextureManager(scene);
    scene.add = mockTextureManager.add;
    setLoaded(true);
  }, []);

  if (!_loaded) return null;

  return (
    <div>
      <Webifier
        target={target}
      />
    </div>
  );
};

export default App;
