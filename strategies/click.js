class CookieClickStrategy extends Strategy {

    // example simple strategy

    constructor(state) {
        super(state);
        this.mission = 'Clicka de cookie';
        this.enabled = true;
    }

    actionPlan() {
        this.state.game.ClickCookie();

        if (this.state.frenzy_click) {
            // click frenzy, click once extra!
            this.state.game.ClickCookie();
        }
    }

}
