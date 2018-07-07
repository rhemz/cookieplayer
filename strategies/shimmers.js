class ShimmerClickStrategy extends Strategy {

    constructor(state) {
        super(state);
        this.mission = 'Click golden/wrath/reindeer cookies';
    }


    actionPlan() {
        this.clickShimmers();
    }

    clickShimmers() {
        var i = 0;
        while (i < this.state.game.shimmers.length) {
            var shimmer = this.state.game.shimmers[i];

            // always click reindeer
            if (shimmer.type == 'reindeer') {
                shimmer.pop();
                continue;
            }

            if (this.state.clotted && shimmer.life > this.state.tr_clot) {
                // shimmer will outlive clot, wait until clot finishes
                i++;
            } else {
                // click that shit
                if (shimmer.type == 'golden') {
                    if (shimmer.wrath) {
                        console.log('wrath cookie');
                    }
                    shimmer.pop();
                }
            }
        }
    }

}