# cookieplayer
Extensible idler for CookieClicker

Fair warning: I don't know JS.  At all.  Or how to structure JS projects.  And i'm writing this on windows.

## How to use
* Create Strategy classes under `strategies/`.  Right now enabling them involves adding them to the strategies array in `main.js`.  Strategies receive a gamestate object to write logic against.  State object should not be modified, but provides access to manipulate the CC game object via the `.game` attribute.  Right now i've implemented a pretty rudimentary BakeBerry gardener.
* minify the JS
* paste into console.  Gamestate object exposed as `gs`.


## TODO
* figure out how to implement cross-strategy compatibility (e.g. multiple enabled strategies that click GCs under certain conditions)
* maybe i'll add a UI for selecting strategies?
* grunt?

