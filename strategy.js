class Strategy {

    // self-contained classes responsible for doing *something*.
    // strategies should NOT modify game state, but MAY keep their own state

    constructor(state) {
        this.state = state;
        this.mission = 'Description of strategic implementation';
        this.enabled = false;
    }

    actionPlan() {
        throw new Error('Strategies must implement an actionPlan!');
    }

}
