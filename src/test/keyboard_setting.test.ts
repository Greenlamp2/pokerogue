import {afterEach, beforeEach, describe, expect, it} from "vitest";
import cfg_keyboardv2_example from "#app/test/cfg_keyboard.example";
import {SettingInterfaceKeyboard} from "#app/test/cfg_keyboard.example";
import {Button} from "#app/enums/buttons";
import {deepCopy} from "#app/utils";
import {
    deleteBind,
    getButtonWithSettingName, getIconSpecialCase, getIconWithKey, getIconWithKeycode, getIconWithSettingName,
    getKeyWithKeycode,
    getKeyWithSettingName,
    getSettingNameWithKeycode, isAlreadyBinded, regenerateIdentifiers, swap
} from "#app/configs/configHandler";


class MenuManip {
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
        this.settingName = SettingInterfaceKeyboard[settingName];
        const buttonName = this.convertNameToButtonString(settingName);
        expect(this.config.settings[this.settingName]).toEqual(Button[buttonName]);
        return this;
    }

    iconDisplayedIs(icon) {
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

    weWantThisBindInstead(keycode) {
        this.keycode = Phaser.Input.Keyboard.KeyCodes[keycode];
        const icon = getIconWithKeycode(this.config, this.keycode);
        const key = getKeyWithKeycode(this.config, this.keycode);
        const _keys = key.toLowerCase().split("_");
        const iconIdentifier = _keys[_keys.length-1];
        expect(icon.toLowerCase().includes(iconIdentifier)).toEqual(true);
        return this;
    }

    OopsSpecialCaseIcon(icon) {
        this.specialCaseIcon = this.config.icons[icon];
        const potentialExistingKey = getIconSpecialCase(this.config, this.keycode, this.settingName);
        const prev_key = potentialExistingKey || getKeyWithSettingName(this.config, this.settingName);
        expect(getIconWithKey(this.config, prev_key)).toEqual(this.specialCaseIcon);
        return this;
    }

    whenWeDelete(settingName?: string) {
        this.settingName = SettingInterfaceKeyboard[settingName] || this.settingName;
        const key = getKeyWithSettingName(this.config, this.settingName);
        deleteBind(this.config, this.settingName);
        expect(this.config.custom[key]).toEqual(-1);
        return this;
    }

    confirm() {
        swap(this.config, this.settingName, this.keycode);
    }
}

class InGameManip {
    private config;
    private keycode;
    private settingName;
    private icon;
    constructor(config) {
        this.config = config;
        this.keycode = null;
        this.settingName = null;
        this.icon = null;
    }

    whenWePressOnKeyboard(keycode) {
        this.keycode = Phaser.Input.Keyboard.KeyCodes[keycode.toUpperCase()];
        return this;
    }

    nothingShouldHappen() {
        const settingName = getSettingNameWithKeycode(this.config, this.keycode);
        expect(settingName).toEqual(-1);
        return this;
    }

    normalizeSettingNameString(input) {
        // Convert the input string to lower case
        const lowerCasedInput = input.toLowerCase();

        // Replace underscores with spaces, capitalize the first letter of each word, and join them back with underscores
        const words = lowerCasedInput.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1));
        const result = words.join('_');

        return result;
    }

    weShouldTriggerTheButton(settingName) {
        this.settingName = SettingInterfaceKeyboard[this.normalizeSettingNameString(settingName)];
        expect(getSettingNameWithKeycode(this.config, this.keycode)).toEqual(this.settingName);
        return this;
    }
}


describe('Test Keyboard v2', () => {
    let config;
    let inGame;
    let inTheSettingMenu;
    beforeEach(() => {
        config = deepCopy(cfg_keyboardv2_example);
        config.custom = {...config.default}
        regenerateIdentifiers(config);
        inGame = new InGameManip(config);
        inTheSettingMenu = new MenuManip(config);
    });

    it('Check if config is loaded', () => {
        expect(config).not.toBeNull();
    });
    it('Check button for setting name', () => {
        const settingName = SettingInterfaceKeyboard.Button_Left;
        const button = config.settings[settingName];
        expect(button).toEqual(Button.LEFT);
    });
    it('Check key for Keyboard KeyCode', () => {
        const key = getKeyWithKeycode(config, Phaser.Input.Keyboard.KeyCodes.LEFT);
        const settingName = config.custom[key];
        const button = config.settings[settingName];
        expect(button).toEqual(Button.LEFT);
    });
    it('Check key for currenly Assigned to action not alt', () => {
        const key = getKeyWithKeycode(config, Phaser.Input.Keyboard.KeyCodes.Q);
        const settingName = config.custom[key];
        const button = config.settings[settingName];
        expect(button).toEqual(Button.LEFT);
    });

    it('Check key for currenly Assigned to setting name', () => {
        const settingName = SettingInterfaceKeyboard.Button_Left;
        const key = getKeyWithSettingName(config, settingName);
        expect(key).toEqual('KEY_ARROW_LEFT');
    });
    it('Check key for currenly Assigned to setting name alt', () => {
        const settingName = SettingInterfaceKeyboard.Alt_Button_Left;
        const key = getKeyWithSettingName(config, settingName);
        expect(key).toEqual('KEY_Q');
    });
    it('Check key from key code', () => {
        const keycode = Phaser.Input.Keyboard.KeyCodes.LEFT;
        const key = getKeyWithKeycode(config, keycode);
        expect(key).toEqual('KEY_ARROW_LEFT');
    });
    it('Check icon for currenly Assigned to key code', () => {
        const keycode = Phaser.Input.Keyboard.KeyCodes.LEFT;
        const key = getKeyWithKeycode(config, keycode);
        const icon = config.icons[key];
        expect(icon).toEqual('T_Left_Key_Dark.png');
    });
    it('Check icon for currenly Assigned to key code', () => {
        const keycode = Phaser.Input.Keyboard.KeyCodes.Q;
        const key = getKeyWithKeycode(config, keycode);
        const icon = config.icons[key];
        expect(icon).toEqual('T_Q_Key_Dark.png');
    });
    it('Check icon for currenly Assigned to setting name', () => {
        const settingName = SettingInterfaceKeyboard.Button_Left;
        const key = getKeyWithSettingName(config, settingName);
        const icon = config.icons[key];
        expect(icon).toEqual('T_Left_Key_Dark.png');
    });
    it('Check icon for currenly Assigned to setting name alt', () => {
        const settingName = SettingInterfaceKeyboard.Alt_Button_Left;
        const key = getKeyWithSettingName(config, settingName);
        const icon = config.icons[key];
        expect(icon).toEqual('T_Q_Key_Dark.png');
    });
    it('Check if  is working', () => {
        const settingNameA = SettingInterfaceKeyboard.Button_Left;
        const settingNameB = SettingInterfaceKeyboard.Button_Right;
        swap(config, SettingInterfaceKeyboard.Button_Left, Phaser.Input.Keyboard.KeyCodes.RIGHT);
        expect(getButtonWithSettingName(config, settingNameA)).toEqual(Button.LEFT);
        expect(getSettingNameWithKeycode(config, Phaser.Input.Keyboard.KeyCodes.RIGHT)).toEqual(SettingInterfaceKeyboard.Button_Left)
        expect(getButtonWithSettingName(config, settingNameB)).toEqual(Button.RIGHT);
        expect(getSettingNameWithKeycode(config, Phaser.Input.Keyboard.KeyCodes.LEFT)).toEqual(SettingInterfaceKeyboard.Button_Right)
        expect(getIconWithSettingName(config, settingNameA)).toEqual(config.icons.KEY_ARROW_RIGHT);
        expect(getIconWithSettingName(config, settingNameB)).toEqual(config.icons.KEY_ARROW_LEFT);
    });

    it('Check if double swap is working', () => {
        inGame.whenWePressOnKeyboard("LEFT").weShouldTriggerTheButton("Button_Left");
        inGame.whenWePressOnKeyboard("RIGHT").weShouldTriggerTheButton("Button_Right");
        inGame.whenWePressOnKeyboard("UP").weShouldTriggerTheButton("Button_Up");

        inTheSettingMenu.whenCursorIsOnSetting("Button_Left").iconDisplayedIs("KEY_ARROW_LEFT").weWantThisBindInstead("RIGHT").confirm();

        inGame.whenWePressOnKeyboard("LEFT").weShouldTriggerTheButton("Button_Right");
        inGame.whenWePressOnKeyboard("RIGHT").weShouldTriggerTheButton("Button_Left");
        inGame.whenWePressOnKeyboard("UP").weShouldTriggerTheButton("Button_Up");

        inTheSettingMenu.whenCursorIsOnSetting("Button_Left").iconDisplayedIs("KEY_ARROW_RIGHT").weWantThisBindInstead("UP").confirm();

        inGame.whenWePressOnKeyboard("LEFT").weShouldTriggerTheButton("Button_Right");
        inGame.whenWePressOnKeyboard("RIGHT").weShouldTriggerTheButton("Button_Up");
        inGame.whenWePressOnKeyboard("UP").weShouldTriggerTheButton("Button_Left");

        inTheSettingMenu.whenCursorIsOnSetting("Button_Left").iconDisplayedIs("KEY_ARROW_UP").weWantThisBindInstead("RIGHT").confirm();

        inGame.whenWePressOnKeyboard("LEFT").weShouldTriggerTheButton("Button_Right");
        inGame.whenWePressOnKeyboard("RIGHT").weShouldTriggerTheButton("Button_Left");
        inGame.whenWePressOnKeyboard("UP").weShouldTriggerTheButton("Button_Up");
    });

    it('Check if triple swap is working', () => {
        inTheSettingMenu.whenCursorIsOnSetting("Button_Left").iconDisplayedIs("KEY_ARROW_LEFT").weWantThisBindInstead("RIGHT").confirm();

        inGame.whenWePressOnKeyboard("LEFT").weShouldTriggerTheButton("Button_Right");
        inGame.whenWePressOnKeyboard("RIGHT").weShouldTriggerTheButton("Button_Left");
        inGame.whenWePressOnKeyboard("UP").weShouldTriggerTheButton("Button_Up");

        inTheSettingMenu.whenCursorIsOnSetting("Button_Right").iconDisplayedIs("KEY_ARROW_LEFT").weWantThisBindInstead("UP").confirm();
        inGame.whenWePressOnKeyboard("LEFT").weShouldTriggerTheButton("Button_Up");
        inGame.whenWePressOnKeyboard("RIGHT").weShouldTriggerTheButton("Button_Left");
        inGame.whenWePressOnKeyboard("UP").weShouldTriggerTheButton("Button_Right");

        inTheSettingMenu.whenCursorIsOnSetting("Button_Left").iconDisplayedIs("KEY_ARROW_RIGHT").weWantThisBindInstead("LEFT").confirm();
        inGame.whenWePressOnKeyboard("LEFT").weShouldTriggerTheButton("Button_Left");
        inGame.whenWePressOnKeyboard("RIGHT").weShouldTriggerTheButton("Button_Up");
        inGame.whenWePressOnKeyboard("UP").weShouldTriggerTheButton("Button_Right");
    });

    it('Swap alt with another main', () => {
        inGame.whenWePressOnKeyboard("D").weShouldTriggerTheButton("Alt_Button_Right");
        inGame.whenWePressOnKeyboard("LEFT").weShouldTriggerTheButton("Button_Left");
        inGame.whenWePressOnKeyboard("Q").weShouldTriggerTheButton("Alt_Button_Left");
        inTheSettingMenu.whenCursorIsOnSetting("Button_Left").iconDisplayedIs("KEY_ARROW_LEFT").weWantThisBindInstead("D").OopsSpecialCaseIcon("KEY_Q").confirm();
        inGame.whenWePressOnKeyboard("D").weShouldTriggerTheButton("Alt_Button_Left");
        inGame.whenWePressOnKeyboard("LEFT").weShouldTriggerTheButton("Button_Left");
        inGame.whenWePressOnKeyboard("Q").weShouldTriggerTheButton("Alt_Button_Right");
    });

    it('multiple Swap alt with another main', () => {
        inGame.whenWePressOnKeyboard("D").weShouldTriggerTheButton("Alt_Button_Right");
        inGame.whenWePressOnKeyboard("LEFT").weShouldTriggerTheButton("Button_Left");
        inGame.whenWePressOnKeyboard("LEFT").weShouldTriggerTheButton("Button_Left");
        inGame.whenWePressOnKeyboard("UP").weShouldTriggerTheButton("Button_Up");
        inTheSettingMenu.whenCursorIsOnSetting("Button_Left").iconDisplayedIs("KEY_ARROW_LEFT").weWantThisBindInstead("D").OopsSpecialCaseIcon("KEY_Q").confirm();
        inGame.whenWePressOnKeyboard("D").weShouldTriggerTheButton("Alt_Button_Left");
        inGame.whenWePressOnKeyboard("LEFT").weShouldTriggerTheButton("Button_Left");
        inGame.whenWePressOnKeyboard("Q").weShouldTriggerTheButton("Alt_Button_Right");
        inGame.whenWePressOnKeyboard("UP").weShouldTriggerTheButton("Button_Up");
        inTheSettingMenu.whenCursorIsOnSetting("Button_Up").iconDisplayedIs("KEY_ARROW_UP").weWantThisBindInstead("LEFT").confirm();
        inGame.whenWePressOnKeyboard("D").weShouldTriggerTheButton("Alt_Button_Left");
        inGame.whenWePressOnKeyboard("LEFT").weShouldTriggerTheButton("Button_Up");
        inGame.whenWePressOnKeyboard("Q").weShouldTriggerTheButton("Alt_Button_Right");
        inGame.whenWePressOnKeyboard("UP").weShouldTriggerTheButton("Button_Left");
    });

    it('Swap alt with a key not binded yet', () => {
        inGame.whenWePressOnKeyboard("Z").weShouldTriggerTheButton("Alt_Button_Up");
        inGame.whenWePressOnKeyboard("B").nothingShouldHappen();
        inTheSettingMenu.whenCursorIsOnSetting("Alt_Button_Up").iconDisplayedIs("KEY_Z").weWantThisBindInstead("B").confirm();
        inGame.whenWePressOnKeyboard("Z").nothingShouldHappen();
        inGame.whenWePressOnKeyboard("B").weShouldTriggerTheButton("Alt_Button_Up");

    });

    it('Delete bind', () => {
        inGame.whenWePressOnKeyboard("LEFT").weShouldTriggerTheButton("Button_Left");
        inTheSettingMenu.whenWeDelete("Button_Left").thereShouldBeNoIconAnymore();
        inGame.whenWePressOnKeyboard("LEFT").nothingShouldHappen();
    });

    it('Delete bind then assign a not yet binded button', () => {
        inGame.whenWePressOnKeyboard("LEFT").weShouldTriggerTheButton("Button_Left");
        inGame.whenWePressOnKeyboard("Q").weShouldTriggerTheButton("Alt_Button_Left");
        inGame.whenWePressOnKeyboard("B").nothingShouldHappen();
        inTheSettingMenu.whenWeDelete("Button_Left").thereShouldBeNoIconAnymore();
        inGame.whenWePressOnKeyboard("LEFT").nothingShouldHappen();
        inGame.whenWePressOnKeyboard("Q").weShouldTriggerTheButton("Alt_Button_Left");
        inGame.whenWePressOnKeyboard("B").nothingShouldHappen();

        inTheSettingMenu.whenCursorIsOnSetting("Button_Left").thereShouldBeNoIcon().weWantThisBindInstead("B").confirm();
        inGame.whenWePressOnKeyboard("B").weShouldTriggerTheButton("Button_Left");
        inGame.whenWePressOnKeyboard("LEFT").nothingShouldHappen();
        inGame.whenWePressOnKeyboard("Q").weShouldTriggerTheButton("Alt_Button_Left");
    })

    it('Delete bind then assign a not yet binded button', () => {
        inGame.whenWePressOnKeyboard("LEFT").weShouldTriggerTheButton("Button_Left");
        inGame.whenWePressOnKeyboard("Q").weShouldTriggerTheButton("Alt_Button_Left");
        inGame.whenWePressOnKeyboard("B").nothingShouldHappen();
        inTheSettingMenu.whenWeDelete("Button_Left").thereShouldBeNoIconAnymore();
        inGame.whenWePressOnKeyboard("LEFT").nothingShouldHappen();
        inGame.whenWePressOnKeyboard("RIGHT").weShouldTriggerTheButton("Button_Right");
        inTheSettingMenu.whenCursorIsOnSetting("Button_Left").thereShouldBeNoIcon().weWantThisBindInstead("RIGHT").confirm();
        inGame.whenWePressOnKeyboard("LEFT").nothingShouldHappen();
        inGame.whenWePressOnKeyboard("RIGHT").weShouldTriggerTheButton("Button_Left");
    });


    it('swap 2 bind, than delete 1 bind than assign another bind', () => {
        inGame.whenWePressOnKeyboard("LEFT").weShouldTriggerTheButton("Button_Left");
        inGame.whenWePressOnKeyboard("RIGHT").weShouldTriggerTheButton("Button_Right");
        inTheSettingMenu.whenCursorIsOnSetting("Button_Left").iconDisplayedIs("KEY_ARROW_LEFT").weWantThisBindInstead("RIGHT").confirm();
        inGame.whenWePressOnKeyboard("LEFT").weShouldTriggerTheButton("Button_Right");
        inGame.whenWePressOnKeyboard("RIGHT").weShouldTriggerTheButton("Button_Left");
        inTheSettingMenu.whenCursorIsOnSetting("Button_Left").whenWeDelete().thereShouldBeNoIconAnymore();
        inGame.whenWePressOnKeyboard("LEFT").weShouldTriggerTheButton("Button_Right");
        inGame.whenWePressOnKeyboard("RIGHT").nothingShouldHappen();
        inTheSettingMenu.whenCursorIsOnSetting("Alt_Button_Up").iconDisplayedIs("KEY_Z").weWantThisBindInstead("B").confirm();
        inGame.whenWePressOnKeyboard("LEFT").weShouldTriggerTheButton("Button_Right");
        inGame.whenWePressOnKeyboard("RIGHT").nothingShouldHappen();
        inGame.whenWePressOnKeyboard("B").weShouldTriggerTheButton("Alt_Button_Up");
    });


    it('Delete bind then assign not already existing button', () => {
        inGame.whenWePressOnKeyboard("LEFT").weShouldTriggerTheButton("Button_Left");
        inGame.whenWePressOnKeyboard("Q").weShouldTriggerTheButton("Alt_Button_Left");
        inGame.whenWePressOnKeyboard("B").nothingShouldHappen();
        inTheSettingMenu.whenWeDelete("Button_Left").thereShouldBeNoIconAnymore();
        inGame.whenWePressOnKeyboard("LEFT").nothingShouldHappen();
        inGame.whenWePressOnKeyboard("RIGHT").weShouldTriggerTheButton("Button_Right");
        inTheSettingMenu.whenCursorIsOnSetting("Button_Left").thereShouldBeNoIcon().weWantThisBindInstead("L").confirm();
        inGame.whenWePressOnKeyboard("L").weShouldTriggerTheButton("Button_Left");
    });

    it('change alt bind to not already existing button, than another one alt bind with another not already existing button', () => {
        inGame.whenWePressOnKeyboard("Z").weShouldTriggerTheButton("Alt_Button_Up");
        inGame.whenWePressOnKeyboard("S").weShouldTriggerTheButton("Alt_Button_Down");
        inGame.whenWePressOnKeyboard("T").nothingShouldHappen();
        inTheSettingMenu.whenCursorIsOnSetting("Alt_Button_Up").iconDisplayedIs("KEY_Z").weWantThisBindInstead("T").confirm();
        inGame.whenWePressOnKeyboard("T").weShouldTriggerTheButton("Alt_Button_Up");
        inGame.whenWePressOnKeyboard("Z").nothingShouldHappen();
        inGame.whenWePressOnKeyboard("U").nothingShouldHappen();
        inGame.whenWePressOnKeyboard("S").weShouldTriggerTheButton("Alt_Button_Down");
        inTheSettingMenu.whenCursorIsOnSetting("Alt_Button_Down").iconDisplayedIs("KEY_S").weWantThisBindInstead("U").confirm();
        inGame.whenWePressOnKeyboard("T").weShouldTriggerTheButton("Alt_Button_Up");
        inGame.whenWePressOnKeyboard("Z").nothingShouldHappen();
        inGame.whenWePressOnKeyboard("U").weShouldTriggerTheButton("Alt_Button_Down");
        inGame.whenWePressOnKeyboard("S").nothingShouldHappen();
    });

    it('Swap multiple touch alt and main', () => {
        inGame.whenWePressOnKeyboard("UP").weShouldTriggerTheButton("Button_Up");
        inGame.whenWePressOnKeyboard("RIGHT").weShouldTriggerTheButton("Button_Right");
        inGame.whenWePressOnKeyboard("Z").weShouldTriggerTheButton("Alt_Button_Up");
        inGame.whenWePressOnKeyboard("D").weShouldTriggerTheButton("Alt_Button_Right");
        inTheSettingMenu.whenCursorIsOnSetting("Button_Up").iconDisplayedIs("KEY_ARROW_UP").weWantThisBindInstead("RIGHT").confirm();
        inGame.whenWePressOnKeyboard("UP").weShouldTriggerTheButton("Button_Right");
        inGame.whenWePressOnKeyboard("RIGHT").weShouldTriggerTheButton("Button_Up");
        inGame.whenWePressOnKeyboard("Z").weShouldTriggerTheButton("Alt_Button_Up");
        inGame.whenWePressOnKeyboard("D").weShouldTriggerTheButton("Alt_Button_Right");

        inTheSettingMenu.whenCursorIsOnSetting("Alt_Button_Up").iconDisplayedIs("KEY_Z").weWantThisBindInstead("D").confirm();
        inGame.whenWePressOnKeyboard("UP").weShouldTriggerTheButton("Button_Right");
        inGame.whenWePressOnKeyboard("RIGHT").weShouldTriggerTheButton("Button_Up");
        inGame.whenWePressOnKeyboard("Z").weShouldTriggerTheButton("Alt_Button_Right");
        inGame.whenWePressOnKeyboard("D").weShouldTriggerTheButton("Alt_Button_Up");

        inTheSettingMenu.whenCursorIsOnSetting("Alt_Button_Up").iconDisplayedIs("KEY_D").weWantThisBindInstead("Z").confirm();
        inGame.whenWePressOnKeyboard("UP").weShouldTriggerTheButton("Button_Right");
        inGame.whenWePressOnKeyboard("RIGHT").weShouldTriggerTheButton("Button_Up");
        inGame.whenWePressOnKeyboard("Z").weShouldTriggerTheButton("Alt_Button_Up");
        inGame.whenWePressOnKeyboard("D").weShouldTriggerTheButton("Alt_Button_Right");
    })


    it('Delete 2 bind then reassign one of them', () => {
        inGame.whenWePressOnKeyboard("LEFT").weShouldTriggerTheButton("Button_Left");
        inGame.whenWePressOnKeyboard("Q").weShouldTriggerTheButton("Alt_Button_Left");
        inGame.whenWePressOnKeyboard("B").nothingShouldHappen();

        inTheSettingMenu.whenWeDelete("Button_Left").thereShouldBeNoIconAnymore();
        inGame.whenWePressOnKeyboard("LEFT").nothingShouldHappen();
        inGame.whenWePressOnKeyboard("Q").weShouldTriggerTheButton("Alt_Button_Left");
        inGame.whenWePressOnKeyboard("B").nothingShouldHappen();

        inTheSettingMenu.whenWeDelete("Alt_Button_Left").thereShouldBeNoIconAnymore();
        inGame.whenWePressOnKeyboard("LEFT").nothingShouldHappen();
        inGame.whenWePressOnKeyboard("Q").nothingShouldHappen();
        inGame.whenWePressOnKeyboard("B").nothingShouldHappen();

        inTheSettingMenu.whenCursorIsOnSetting("Alt_Button_Left").thereShouldBeNoIcon().weWantThisBindInstead("Q").confirm();
        inGame.whenWePressOnKeyboard("LEFT").nothingShouldHappen();
        inGame.whenWePressOnKeyboard("Q").weShouldTriggerTheButton("Alt_Button_Left");
        inGame.whenWePressOnKeyboard("B").nothingShouldHappen();
    });

    it("test keyboard listener", () => {
        const keyDown = Phaser.Input.Keyboard.KeyCodes.S;
        const key = getKeyWithKeycode(config, keyDown);
        const settingName = config.custom[key];
        const buttonDown = config.settings[settingName];
        expect(buttonDown).toEqual(Button.DOWN);
    });
});
