# Console Dialog
Create a message dialog in node

## Install

```bash
$ npm i console-dialog
```


## Usage

```js
const consoleDialog = require('console-dialog');
console.log(consoleDialog('Hello!').render());
/**
┌────────┐
│ Hello! │
└────────┘
*/

let dialog = consoleDialog().width(20);
let msg = [];
msg.push(`this is dialog with`);
msg.push(`multiple lines`);
dialog.append(msg);
console.log(dialog.render());
/**
┌─────────────────────┐
│ this is dialog with │
│ multiple lines      │
└─────────────────────┘
*/


let dialog = consoleDialog().width(20);
dialog.append(`this is dialog with`);
dialog.append(`multiple lines`);
console.log(dialog.render());
/**
┌─────────────────────┐
│ this is dialog with │
│ multiple lines      │
└─────────────────────┘
*/

let dialog = consoleDialog().width(40);
dialog.header(`how text can be align`, {align: `center`});
dialog.footer(`using align option`);
dialog.append(`left`);
dialog.append(`center`, {align: `center`});
dialog.append(`right`, {align: `right`});
console.log(dialog.render());
/*
╒═════════════════════════════════════════╕
│          how text can be align          │
╞═════════════════════════════════════════╡
│ left                                    │
│                  center                 │
│                                   right │
╞═════════════════════════════════════════╡
│ using align option                      │
╘═════════════════════════════════════════╛
*/

let dialog = consoleDialog();
dialog.append('dialog with border weight with options');
console.log(dialog.render({weight: 'bold'}));
console.log(dialog.render({weight: 'double'}));
console.log(dialog.render({corner: 'round'}));
/*
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ dialog with border weight with options ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
╔════════════════════════════════════════╗
║ dialog with border weight with options ║
╚════════════════════════════════════════╝
╭────────────────────────────────────────╮
│ dialog with border weight with options │
╰────────────────────────────────────────╯
*/

dialog = consoleDialog();
dialog.append(`the length of this message is greater than the width of the dialog.`);
dialog.append(`so it's got wrapped down to a new line.`);
console.log(dialog.render({width: 24}));
/**
 ┌─────────────────────────┐
 │ the length of this mess │
 │ age is greater than the │
 │  width of the dialog.   │
 │ so it's got wrapped dow │
 │ n to a new line.        │
 └─────────────────────────┘
 */

dialog.header(`but the dynamic-width option will make dialog more flexible up to the messages`)
console.log(dialog.render({width: `dynamic`}));
/**
 ╒════════════════════════════════════════════════════════════════════════════════╕
 │ but the dynamic-width option will make dialog more flexible up to the messages │
 ╞════════════════════════════════════════════════════════════════════════════════╡
 │ the length of this message is greater than the width of the dialog.            │
 │ so it's got wrapped down to a new line.                                        │
 └────────────────────────────────────────────────────────────────────────────────┘
 */

```

## Dialog Options
### Border style
###### `weight`  -  Changes Border line style.
- Default: `"single"`
- Values: `"single"` , `"double"` , `"bold"`
- Conditions: `"bold"` - Dialog must not have header or footer

###### `corner`  -  Changes border corner style.
- Default:
- values: `"round"`
- Conditions: `"round"` - Dialog must not have header or footer

### Dialog width
###### `width`  -  Enable flexible width based on maximum length of lines.
- Default: `dynamic`
- Values: `dynamic`
- Conditions: `dynamic` - The maximum length of lines must be greater than the declared dialog width.

### Text alignment
###### `align`  -  Align appended lines in the dialog.
- Default: `"left"`
- Values: `"left"` , `"center"`, `"right"`
- Conditions: `"center"`, `"right"` - The length of lines must be less than the declared dialog width.
