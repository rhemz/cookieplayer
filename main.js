class GameState {

    constructor(game) {
        this.game = game;
        this.state_refreshes = 0;
        this.garden = this.game.Objects['Farm'].minigame;
        this.grimoire = this.game.Objects['Wizard tower'].minigame;

        // everything below this point is populated on refresh()

        // garden
        this.all_plants_mature = null;
        
        // frenzies
        this.frenzy_elder = null;
        this.frenzy_regular = null;
        this.frenzy_click = null;

        // buffs
        this.clotted = null;
        this.num_total_buffs = null;
        this.building_buffed = null;
        this.num_building_buffs = null;
        this.active_buffs_str = null;

        // time remainings
        this.tr_frenzy_elder = null;
        this.tr_frenzy_regular = null;
        this.tr_frenzy_click = null;
        this.tr_clot = null;
        this.tr_building_buffs = null;

        // other
        this.num_wrinklers = null;
        this.wrinkler_sum = null;
    }

    refresh() {
        this.state_refreshes++;

        this.all_plants_mature = this.constructor.allPlantsMature(this.garden);

        // check frenzies & their TR
        this.frenzy_elder = Boolean(this.game.hasBuff('Elder frenzy'));
        this.frenzy_regular = Boolean(this.game.hasBuff('Frenzy'));
        this.frenzy_click = Boolean(this.game.hasBuff('Click frenzy'));

        // buffs
        this.num_total_buffs = 0;
        this.num_building_buffs = 0;
        this.building_buffed = false;
        this.tr_building_buffs = 0;
        this.active_buffs_str = '';
        for (var key in this.game.buffs) {
            var buff = this.game.buffs[key];
            this.active_buffs_str += buff.name + ', ';
            this.num_total_buffs++;

            if (buff.type.id == 9) {
                this.building_buffed = true;
                this.num_building_buffs++;
                this.tr_building_buffs += (buff.time + 1000 / 1000 * this.game.fps);
            }
        }

        // de-buffs
        this.clotted = Boolean(this.game.hasBuff('Clot'));

        // time remainings
        this.tr_frenzy_elder = this.frenzy_elder ? (this.game.buffs['Elder frenzy'].time + 1000 / 1000 * this.game.fps) : 0;
        this.tr_frenzy_regular = this.frenzy_regular ? (this.game.buffs['Frenzy'].time + 1000 / 1000 * this.game.fps) : 0;
        this.tr_frenzy_click = this.frenzy_click ? (this.game.buffs['Click frenzy'].time + 1000 / 1000 * this.game.fps) : 0;
        this.tr_clot = this.clotted ? (this.game.buffs['Clot'].time + 1000 / 1000 * this.game.fps) : 0;

        // wrinklers
        this.num_wrinklers = 0;
        this.wrinkler_sum = 0;
        for(var i = 0; i < this.game.wrinklers.length; i++) {
            let wrinkler = this.game.wrinklers[i];
            if (wrinkler.sucked > 0) {
                this.num_wrinklers++;
                this.wrinkler_sum += wrinkler.sucked;
            }
        }
    }

    static allPlantsMature(garden) {
        var all_mature = true;
        var actual_plants = 0;
        var max_axis_plots = garden.plot.length;

        for (var y = 0; y < max_axis_plots; y++) {
            for (var x = 0; x < max_axis_plots; x++) {
                var tile = garden.plot[y][x];
                var plant = garden.plantsById[tile[0] - 1];

                if (plant != undefined) {
                    actual_plants++;
                    var plant_is_mature = tile[1] >= plant.mature;
                    if (!plant_is_mature) {
                        // console.log('plant is not mature');
                        all_mature = false;
                    }
                }
            }
        }
        // console.log('tested ' + all_mature.toString() + ' actual plants');

        if (actual_plants == 0) {
            all_mature = false;
        }

        return all_mature;
    }
}


var gs = new GameState(Game); // pass in CC Game object
clearInterval(cp);

// load strategies
var strategies = [
    new CookieClickStrategy(gs),
    new BakeberryStrategy(gs),
    new ShimmerClickStrategy(gs)
];

var cp = setInterval(function() { 
    // refresh the gamestate every tick
    gs.refresh();

    for (var i = 0; i < strategies.length; i++) {
        let strat = strategies[i];

        // invoke strategy actionPlan if the strategy is enabled
        if (strat.enabled) {
            strat.actionPlan();
        }
    }
}, 500);  // every half-second
