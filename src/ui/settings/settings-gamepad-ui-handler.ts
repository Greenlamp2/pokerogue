import BattleScene from "../../battle-scene";
import {addTextObject, TextStyle} from "../text";
import {Mode} from "../ui";
import {SettingGamepad, settingGamepadDefaults, settingGamepadOptions} from "../../system/settings-gamepad";
import {truncateString} from "../../utils";
import pad_xbox360 from "#app/configs/pad_xbox360";
import pad_dualshock from "#app/configs/pad_dualshock";
import pad_unlicensedSNES from "#app/configs/pad_unlicensedSNES";
import {InterfaceConfig} from "#app/inputs-controller";
import AbstractSettingsUiUiHandler from "#app/ui/settings/abstract-settings-ui-handler";

export default class SettingsGamepadUiHandler extends AbstractSettingsUiUiHandler {

    constructor(scene: BattleScene, mode?: Mode) {
        super(scene, mode);
        this.titleSelected = 'Gamepad';
        this.settingDevice = SettingGamepad;
        this.settingDeviceDefaults = settingGamepadDefaults;
        this.settingDeviceOptions = settingGamepadOptions;
        this.configs = [pad_xbox360, pad_dualshock, pad_unlicensedSNES]
        this.commonSettingsCount = 2;
        this.localStoragePropertyName = 'settingsGamepad';
    }

    setup() {
        super.setup();
        // If no gamepads are detected, set up a default UI prompt in the settings container.
        this.layout['noGamepads'] = new Map();
        const optionsContainer = this.scene.add.container(0, 0);
        optionsContainer.setVisible(false); // Initially hide the container as no gamepads are connected.
        const label = addTextObject(this.scene, 8, 28, 'Please plug a controller or press a button', TextStyle.SETTINGS_LABEL);
        label.setOrigin(0, 0);
        optionsContainer.add(label);
        this.settingsContainer.add(optionsContainer);

        // Map the 'noGamepads' layout options for easy access.
        this.layout['noGamepads'].optionsContainer = optionsContainer;
        this.layout['noGamepads'].label = label;
    }

    getActiveConfig(): InterfaceConfig {
        return this.scene.inputController.getActiveConfig();
    }

    getLocalStorageSetting(): object {
        // Retrieve the gamepad settings from local storage or use an empty object if none exist.
        const settings: object = localStorage.hasOwnProperty('settingsGamepad') ? JSON.parse(localStorage.getItem('settingsGamepad')) : {};
        return settings;
    }

    setLayout(activeConfig: InterfaceConfig): boolean {
        // Check if there is no active configuration (e.g., no gamepad connected).
        if (!activeConfig) {
            // Retrieve the layout for when no gamepads are connected.
            const layout = this.layout['noGamepads'];
            // Make the options container visible to show message.
            layout.optionsContainer.setVisible(true);
            // Return false indicating the layout application was not successful due to lack of gamepad.
            return false;
        }

        return super.setLayout(activeConfig);
    }


    navigateMenuLeft(): boolean {
        this.scene.ui.setMode(Mode.SETTINGS)
        return true;
    }

    navigateMenuRight(): boolean {
        this.scene.ui.setMode(Mode.SETTINGS_KEYBOARD)
        return true;
    }

    updateChosenGamepadDisplay(): void {
        // Update any bindings that might have changed since the last update.
        this.updateBindings();

        // Iterate over the keys in the settingDevice enumeration.
        for (const [index, key] of Object.keys(this.settingDevice).entries()) {
            const setting = this.settingDevice[key] // Get the actual setting value using the key.

            // Check if the current setting corresponds to the default controller setting.
            if (setting === this.settingDevice.Default_Controller) {
                // Iterate over all layouts excluding the 'noGamepads' special case.
                for (const _key of Object.keys(this.layout)) {
                    if (_key === 'noGamepads') continue; // Skip updating the no gamepad layout.

                    // Update the text of the first option label under the current setting to the name of the chosen gamepad,
                    // truncating the name to 30 characters if necessary.
                    this.layout[_key].optionValueLabels[index][0].setText(truncateString(this.scene.inputController.chosenGamepad, 30));
                }
            }
        }
    }

    saveSettingToLocalStorage(setting, cursor): void {
        if (this.settingDevice[setting] !== this.settingDevice.Default_Controller)
            this.scene.gameData.saveGamepadSetting(setting, cursor)
    }
}