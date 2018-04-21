const consoleDialog = require(`../index`)

console.log(consoleDialog('Hello!').render());
/**
 ┌────────┐
 │ Hello! │
 └────────┘
 */

dialog = consoleDialog().width(20);
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


dialog = consoleDialog().width(20);
dialog.append(`this is dialog with`);
dialog.append(`multiple lines`);
console.log(dialog.render());
/**
 ┌─────────────────────┐
 │ this is dialog with │
 │ multiple lines      │
 └─────────────────────┘
 */

dialog = consoleDialog().width(40);
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

dialog = consoleDialog();
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




