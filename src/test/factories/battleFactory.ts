

export class BattleFactory {
    private player;
    private opponent;
    private events;

    constructor(data) {
        this.player = data.player;
        this.opponent = data.opponent;
        this.events = [
            12,
        ];
    }

    newTurn() {
        return this;
    }

    noPokemonSwap() {
        return this;
    }

    doMove(move) {
        return this;
    }

    playerPokemon(pokemon) {
        return this;
    }

    target(pokemon) {
        return this;
    }

    confirm() {

    }

    damageReceived(pokemon) {
        return [
            12,
        ]
    }

    playMove(index) {
        return this;
    }

    computeDamageReceived(pokemon) {
        return this;
    }

    get damageReceived() {
        return [
            12,
        ]
    }
}