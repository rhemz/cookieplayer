class Strategy{constructor(state){this.state=state;this.mission='Description of strategic implementation';}
actionPlan(){throw new Error('Strategies must implement an actionPlan!');}}
class CookieClickStrategy extends Strategy{constructor(state){super(state);this.mission='Clicka de cookie';}
actionPlan(){this.state.game.ClickCookie();if(this.state.frenzy_click){this.state.game.ClickCookie();}}}
class GardeningStrategy extends Strategy{constructor(state){super(state);this.mission='Common gardening strategy functionality.  Does nothing.';this.g=this.state.garden;this.harvest_triggered=false;this.total_earned=0;this.earned_last_harvest=0;this.soil_dirt=0;this.soil_fertilizer=1;this.soil_clay=2;this.soil_pebbles=3;this.soil_woodchips=4;}
plantAll(plant_id){var max_axis_plots=this.g.plot.length;for(var y=0;y<max_axis_plots;y++){for(var x=0;x<max_axis_plots;x++){this.g.plot[y][x]=[plant_id+1,0];this.g.toRebuild=true;this.state.game.Spend(this.g.getCost(this.g.plantsById[plant_id]));this.state.game.SparkleAt(this.state.game.mouseX,this.state.game.mouseY);PlaySound('snd/tillb'+choose(['1','2','3'])+'.mp3',1,0.2);}}
return true;}
setSoil(soil_id){if(this.g.soil!=soil_id){console.log('setting soil to: '+soil_id);this.g.soil=soil_id;for(var i=0;i<5;i++){document.getElementById('gardenSoil-'+i.toString()).className='gardenSeed gardenSoil';}
document.getElementById('gardenSoil-'+soil_id.toString()).className='gardenSeed gardenSoil on';}}
freezeGarden(){if(this.g.freeze!=1&&!this.harvest_triggered){this.g.freeze=1;document.getElementById('gardenTool-2').className='gardenSeed on';}}
unfreezeGarden(){if(this.g.freeze!=0){this.g.freeze=0;document.getElementById('gardenTool-2').className='gardenSeed';}}}
class BakeberryStrategy extends GardeningStrategy{constructor(state){super(state);this.mission='Bakeberry gardener';this.bb_id=8;this.m=this.state.grimoire;}
actionPlan(){if(this.state.all_plants_mature){this.setSoil(this.soil_clay);this.freezeGarden();if((this.state.frenzy_regular&&!this.state.frenzy_elder)||(this.state.frenzy_elder&&!this.state.frenzy_regular)||(this.state.frenzy_regular&&!this.state.building_buffed)||(this.state.frenzy_elder&&!this.state.building_buffed)||(this.state.building_buffed&&!this.state.frenzy_elder)||(this.state.building_buffed&&!this.state.frenzy_regular)){this.tryCastHof();}}
if(this.shouldHarvest()){console.log('HARVEST!');this.harvestPlants(true);}}
shouldHarvest(){if(!this.state.all_plants_mature||this.state.clotted||this.harvest_triggered){return false;}
if(((this.state.frenzy_elder&&this.state.frenzy_regular)||(this.state.frenzy_regular&&this.state.building_buffed)||(this.state.frenzy_elder&&this.state.building_buffed))&&!this.harvest_triggered){return true;}
if(((this.state.frenzy_elder&&this.state.frenzy_regular)||(this.state.frenzy_elder&&this.state.building_buffed))&&!this.harvest_triggered){return true;}
return false;}
harvestPlants(replant){this.harvest_triggered=true;this.unfreezeGarden();setTimeout(function(){console.log('harvest triggering buying GS');if(!this.state.game.Upgrades['Golden switch [off]'].bought){console.log('buying gs');this.state.game.Upgrades['Golden switch [off]'].buy();}
setTimeout(function(){this.unfreezeGarden();this.g.harvestAll();this.harvest_triggered=false;setTimeout(function(){if(!this.state.game.Upgrades['Golden switch [on]'].bought){console.log('waited, unbuying gs');this.state.game.Upgrades['Golden switch [on]'].buy();}
this.setSoil(this.soil_fertilizer);if(replant){setTimeout(function(){this.plantAll(this.bb_id);}.bind(this),(3*1000));}}.bind(this),(3.3*60*1000));}.bind(this),1005);console.log('done harvesting');}.bind(this),1005);}
tryCastHof(){var hof=this.m.spells['hand of fate'];if(this.haveEnoughMana(hof)&&!this.harvest_triggered){console.log('conditions met, casting HOF');this.m.castSpell(hof);return true;}
return false;}
haveEnoughMana(spell){let static_threshold=7;if(this.m.magic>=(this.m.magicM*spell.costPercent+spell.costMin)+static_threshold){return true;}
return false;}}
class ShimmerClickStrategy extends Strategy{constructor(state){super(state);this.mission='Click golden/wrath/reindeer cookies';}
actionPlan(){this.clickShimmers();}
clickShimmers(){var i=0;while(i<this.state.game.shimmers.length){var shimmer=this.state.game.shimmers[i];if(shimmer.type=='reindeer'){shimmer.pop();continue;}
if(this.state.clotted&&shimmer.life>this.state.tr_clot){i++;}else{if(shimmer.type=='golden'){if(shimmer.wrath){console.log('wrath cookie');}
shimmer.pop();}}}}}
class GameState{constructor(game){this.game=game;this.state_refreshes=0;this.garden=this.game.Objects['Farm'].minigame;this.grimoire=this.game.Objects['Wizard tower'].minigame;this.all_plants_mature=null;this.frenzy_elder=null;this.frenzy_regular=null;this.frenzy_click=null;this.clotted=null;this.num_total_buffs=null;this.buliding_buffed=null;this.num_building_buffs=null;this.active_buffs_str=null;this.tr_frenzy_elder=null;this.tr_frenzy_regular=null;this.tr_frenzy_click=null;this.tr_clot=null;this.tr_building_buffs=null;this.num_wrinklers=null;this.wrinkler_sum=null;}
refresh(){this.state_refreshes++;this.all_plants_mature=this.constructor.allPlantsMature(this.garden);this.frenzy_elder=Boolean(this.game.hasBuff('Elder frenzy'));this.frenzy_regular=Boolean(this.game.hasBuff('Frenzy'));this.frenzy_click=Boolean(this.game.hasBuff('Click frenzy'));this.num_total_buffs=0;this.num_building_buffs=0;this.buliding_buffed=false;this.tr_building_buffs=0;this.active_buffs_str='';for(var key in this.game.buffs){var buff=this.game.buffs[key];this.active_buffs_str+=buff.name+', ';this.num_total_buffs++;if(buff.type.id==9){this.buliding_buffed=true;this.num_building_buffs++;this.tr_building_buffs+=(buff.time+1000/1000*this.game.fps);}}
this.clotted=Boolean(this.game.hasBuff('Clot'));this.tr_frenzy_elder=this.frenzy_elder?(this.game.buffs['Elder frenzy'].time+1000/1000*this.game.fps):0;this.tr_frenzy_regular=this.frenzy_regular?(this.game.buffs['Frenzy'].time+1000/1000*this.game.fps):0;this.tr_frenzy_click=this.frenzy_click?(this.game.buffs['Click frenzy'].time+1000/1000*this.game.fps):0;this.tr_clot=this.clotted?(this.game.buffs['Clot'].time+1000/1000*this.game.fps):0;this.num_wrinklers=0;this.wrinkler_sum=0;for(var i=0;i<this.game.wrinklers.length;i++){let wrinkler=this.game.wrinklers[i];if(wrinkler.sucked>0){this.num_wrinklers++;this.wrinkler_sum+=wrinkler.sucked;}}}
static allPlantsMature(garden){var all_mature=true;var actual_plants=0;var max_axis_plots=garden.plot.length;for(var y=0;y<max_axis_plots;y++){for(var x=0;x<max_axis_plots;x++){var tile=garden.plot[y][x];var plant=garden.plantsById[tile[0]-1];if(plant!=undefined){actual_plants++;var plant_is_mature=tile[1]>=plant.mature;if(!plant_is_mature){all_mature=false;}}}}
if(actual_plants==0){all_mature=false;}
return all_mature;}}
var gs=new GameState(Game);clearInterval(cp);var strategies=[new CookieClickStrategy(gs),new BakeberryStrategy(gs),new ShimmerClickStrategy(gs)];var cp=setInterval(function(){gs.refresh();for(var i=0;i<strategies.length;i++){let strat=strategies[i];strat.actionPlan();}},500);