import {beforeAll, describe, expect, it} from "vitest";
import {initStatsKeys} from "#app/ui/game-stats-ui-handler";
import {MoneyAchv} from "#app/system/achv";

describe("big tests", () => {
    beforeAll(async () => {
        initStatsKeys();
    })

    it ('should check achv', () => {
        const ach = new MoneyAchv("Achivement", 1000, null, 100);
        expect(ach.name).toBe("Achivement");
    });
});