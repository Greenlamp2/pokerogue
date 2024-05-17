import {SettingInterface} from "#app/test/cfg_keyboard.example";
import {expect} from "vitest";
import {Button} from "#app/enums/buttons";
import {
    deleteBind,
    getIconWithKeycode,
    getIconWithSettingName,
    getKeyWithKeycode,
    getKeyWithSettingName,
    assign,
    getSettingNameWithKeycode, canIAssignThisKey, canIDeleteThisKey
} from "#app/configs/configHandler";

export class MenuManip {
    private config;
    private settingName;
    private keycode;
    private icon;
    private iconDisplayed;
    private specialCaseIcon;

    constructor(config) {
        this.config = config;
        this.settingName = null;
        this.icon = null;
        this.iconDisplayed = null;
        this.specialCaseIcon = null;
    }

    convertNameToButtonString(input) {
        // Check if the input starts with "Alt_Button"
        if (input.startsWith("Alt_Button")) {
            // Return the last part in uppercase
            return input.split('_').pop().toUpperCase();
        }

        // Split the input string by underscore
        const parts = input.split('_');

        // Skip the first part and join the rest with an underscore
        const result = parts.slice(1).map(part => part.toUpperCase()).join('_');

        return result;
    }

    whenCursorIsOnSetting(settingName) {
        if (!settingName.includes("Button_")) settingName = "Button_" + settingName;
        this.settingName = SettingInterface[settingName];
        const isAlt = settingName.includes("ALT_");
        const buttonName = isAlt ? settingName.toUpperCase().split("ALT_BUTTON_").splice(1)[0] : settingName.toUpperCase().split("BUTTON_").splice(1)[0];
        expect(this.config.settings[this.settingName]).toEqual(Button[buttonName]);
        return this;
    }

    iconDisplayedIs(icon) {
        if (!(icon.toUpperCase().includes("KEY_"))) icon = "KEY_" + icon.toUpperCase();
        this.iconDisplayed = this.config.icons[icon];
        expect(getIconWithSettingName(this.config, this.settingName)).toEqual(this.iconDisplayed);
        return this;
    }

    thereShouldBeNoIconAnymore() {
        const icon = getIconWithSettingName(this.config, this.settingName);
        expect(icon === undefined).toEqual(true);
        return this;
    }

    thereShouldBeNoIcon() {
        return this.thereShouldBeNoIconAnymore();
    }

    nothingShouldHappen() {
        const settingName = getSettingNameWithKeycode(this.config, this.keycode);
        expect(settingName).toEqual(-1);
        return this;
    }

    weWantThisBindInstead(keycode) {
        this.keycode = Phaser.Input.Keyboard.KeyCodes[keycode];
        const icon = getIconWithKeycode(this.config, this.keycode);
        const key = getKeyWithKeycode(this.config, this.keycode);
        const _keys = key.toLowerCase().split("_");
        const iconIdentifier = _keys[_keys.length-1];
        expect(icon.toLowerCase().includes(iconIdentifier)).toEqual(true);
        return this;
    }

    whenWeDelete(settingName?: string) {
        this.settingName = SettingInterface[settingName] || this.settingName;
        const key = getKeyWithSettingName(this.config, this.settingName);
        deleteBind(this.config, this.settingName);
        // expect(this.config.custom[key]).toEqual(-1);
        return this;
    }

    whenWeTryToDelete(settingName?: string) {
        this.settingName = SettingInterface[settingName] || this.settingName;
        deleteBind(this.config, this.settingName);
        return this;
    }

    confirmAssignment() {
        assign(this.config, this.settingName, this.keycode);
    }

    butLetsForceIt() {
        this.confirm();
    }


    confirm() {
        assign(this.config, this.settingName, this.keycode);
    }

    weCantConfirm() {
        const key = getKeyWithKeycode(this.config, this.keycode);
        expect(canIAssignThisKey(this.config, key)).toEqual(false);
        return this;
    }

    weCantDelete() {
        const key = getKeyWithSettingName(this.config, this.settingName);
        expect(canIDeleteThisKey(this.config, key)).toEqual(false);
        return this;
    }
}
