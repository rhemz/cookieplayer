class GardeningStrategy extends Strategy {

    constructor(state) {
        super(state);
        this.mission = 'Common gardening strategy functionality.  Does nothing.';

        this.g = this.state.garden;
        this.harvest_triggered = false;
        this.total_earned = 0;
        this.earned_last_harvest = 0;

        // consts
        this.soil_dirt = 0;
        this.soil_fertilizer = 1;
        this.soil_clay = 2;
        this.soil_pebbles = 3;
        this.soil_woodchips = 4;

    }

    plantAll(plant_id) {
        var max_axis_plots = this.g.plot.length;

        for (var y = 0; y < max_axis_plots; y++) {
            for (var x = 0; x < max_axis_plots; x++) {
                this.g.plot[y][x] = [plant_id + 1, 0];
                this.g.toRebuild = true;
                this.state.game.Spend(this.g.getCost(this.g.plantsById[plant_id]));
                this.state.game.SparkleAt(this.state.game.mouseX, this.state.game.mouseY);
                PlaySound('snd/tillb' + choose(['1','2','3']) + '.mp3', 1, 0.2);
            }
        }
        return true;
    }

    setSoil(soil_id) {
        if (this.g.soil != soil_id) {
            console.log('setting soil to: ' + soil_id);
            this.g.soil = soil_id;

            for (var i = 0; i < 5; i++) {
                document.getElementById('gardenSoil-' + i.toString()).className = 'gardenSeed gardenSoil';
            }
            document.getElementById('gardenSoil-' + soil_id.toString()).className = 'gardenSeed gardenSoil on';

        }
    }

    freezeGarden() {
        if (this.g.freeze != 1 && !this.harvest_triggered) {
            this.g.freeze = 1;
            document.getElementById('gardenTool-2').className = 'gardenSeed on';
        }
    }

    unfreezeGarden() {
        if (this.g.freeze != 0) {
            this.g.freeze = 0;
            document.getElementById('gardenTool-2').className = 'gardenSeed';
        }
    }
}


class BakeberryStrategy extends GardeningStrategy {

    constructor(state) {
        super(state);
        this.mission = 'Bakeberry gardener';
        this.bb_id = 8;
        this.m = this.state.grimoire;
    }

    actionPlan() {
        if (this.state.all_plants_mature) {
            // make sure we're clay
            this.setSoil(this.soil_clay);

            // freeze to make sure plants are not wasted
            this.freezeGarden();

            // trigger hand of fate
            if (
                (this.state.frenzy_regular && !this.state.frenzy_elder) || 
                (this.state.frenzy_elder && !this.state.frenzy_regular) || 
                (this.state.frenzy_regular && !this.state.building_buffed) || 
                (this.state.frenzy_elder && !this.state.building_buffed) || 
                (this.state.building_buffed && !this.state.frenzy_elder) || 
                (this.state.building_buffed && !this.state.frenzy_regular)) {

                // cast hof.  tests if mana is available
                this.tryCastHof();
            }
        }

        if (this.shouldHarvest()) {
            console.log('HARVEST!');
            this.harvestPlants(true); // replant after harvesting
        }
    }

    shouldHarvest() {
        if (!this.state.all_plants_mature || this.state.clotted || this.harvest_triggered) {
            return false;
        }

        // lenient
        if ( ( 
            (this.state.frenzy_elder && this.state.frenzy_regular) || 
            (this.state.frenzy_regular && this.state.building_buffed) ||
            (this.state.frenzy_elder && this.state.building_buffed) ) && !this.harvest_triggered) {

            return true;
        }

        // big money only
        if ( ( 
            (this.state.frenzy_elder && this.state.frenzy_regular) || 
            (this.state.frenzy_elder && this.state.building_buffed) ) && !this.harvest_triggered) {

            return true;
        }

        return false;
    }

    harvestPlants(replant) {
        this.harvest_triggered = true;

        // unfreeze garden if frozen
        this.unfreezeGarden();

        setTimeout(function() { 
            console.log('harvest triggering buying GS');
            // buy golden switch if not active
            if (!this.state.game.Upgrades['Golden switch [off]'].bought) {
                console.log('buying gs');
                this.state.game.Upgrades['Golden switch [off]'].buy();
            }

            setTimeout(function() { 
                // unfreeze garden if frozen
                this.unfreezeGarden();

                // harvest plants
                this.g.harvestAll();
                this.harvest_triggered = false;
                
                // disable gs and re-plant
                setTimeout(function() { 
                    
                    if (!this.state.game.Upgrades['Golden switch [on]'].bought) {
                        console.log('waited, unbuying gs');
                        this.state.game.Upgrades['Golden switch [on]'].buy();
                    }
                    
                    // set fertilizer
                    this.setSoil(this.soil_fertilizer);

                    // re-plant if true
                    if (replant) {
                        setTimeout(function() { 
                            this.plantAll(this.bb_id); 
                        }.bind(this), (3 * 1000));  // 3 seconds
                    }
                    
                }.bind(this), (3.3 * 60 * 1000));  // 3.3minutes
            }.bind(this), 1005); // 1 second

        console.log('done harvesting');
        }.bind(this), 1005); // 1 sec
    }

    tryCastHof() {
        var hof = this.m.spells['hand of fate'];

        if (this.haveEnoughMana(hof) && !this.harvest_triggered) {
            
            console.log('conditions met, casting HOF');
            this.m.castSpell(hof);

            //setTimeout(this.clickShimmers, 1000);
            return true;
        } 

        return false;
    }

    haveEnoughMana(spell) {
        let static_threshold = 7;  // have this much more so regen isnt _too_ slow

        if (this.m.magic >= (this.m.magicM * spell.costPercent + spell.costMin) + static_threshold) {
            return true;
        }
        return false;
    }

}