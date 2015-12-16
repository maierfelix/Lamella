# Lamella
Beautiful Visual Programming inside the Web.

**Information**:

The project itself is in a unfinished state.
It's pretty easy to add new models to the engine, checkout *./app/res/models/* to see how it's done.

The programming logic isn't much implemented yet.<br/>
If you want to test it, wire two DataType entities (numeric for example) with a operator entity.<br/>
Make sure the operator entity's output anchor (the bottom one) is connected with another entity.<br/>
Click on the *Play* button and open your console.

**Stress test**:

Lamella can render **many** entities!</br>

Open your console and type in:<br/>
```js
LAMELLA.Core.Grid.stressTest(2500, true, 1);
```

**Screenshots**:
![1](http://i.imgur.com/0qXGrxN.png)
![2](http://i.imgur.com/zr3GQzj.jpg)
