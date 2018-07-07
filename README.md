# cookieplayer
Extensible idler for CookieClicker

Fair warning: I don't know JS

## How to use
Create Strategy classes.  Strategies receive a gamestate object to write logic against.  State object should not be modified, but provides access to the CC game object via the `.game` attribute.
