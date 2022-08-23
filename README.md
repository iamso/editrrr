Editrrr
=======

Pimping textareas with editor features.

Editrrr was heavily inspired by [Behave.js](https://github.com/iamso/Behave.js), so parts of this readme will be similar as well.


What?
-----

Editrrr is a lightweight library for adding IDE style behaviors to plain text areas, making it much more enjoyable to write code in.

<img src="http://i.imgur.com/cAwUx9v.gif">

* Supports IE10+, Edge, Firefox, Safari, Chrome, Opera
* No Dependencies
* Hard and Soft Tabs
* Auto Open/Close Paranthesis, Brackets, Braces, Double and Single Quotes
* Auto delete a paired character
* Overwrite a paired character
* Multi-line Indentation/Unindentation
* Automatic Indentation
* Move lines up/down
* Duplicate lines


Install
-------

```bash
npm install editrrr
```

Example Setup
-------------

### Javascript

```javascript
import Editrrr from 'editrrr';

// create an instance (with the defaults)
const editrrr = new Editrrr({
  textarea: null,
  replaceTab: true,
  softTabs: true,
  tabSize: 2,
  autoOpen: true,
  overwrite: true,
  autoStrip: true,
  autoIndent: true,
  continueList: true,
  moveLine: true,
  duplicateLine: true,
});
```

- `textarea`: Textarea element to apply the behaviors to
- `replaceTab`: If set to true, `replaceTab` does three different things:
  - Pressing the tab key will insert a tab instead of cycle input focus.
  - If you are holding shift, and there is a full tab before your cursor (whatever your tab may be), it will unindent.
  - If you have a range selected, both of the above rules will apply to all lines selected (multi-line indent/unindent)
- `softTabs`: If set to true, spaces will be used instead of a tab character
- `tabSize`: If `softTabs` is set to true, the number of spaces used is defined here. If set to false, the CSS property tab-size will be used to define hard tab sizes.
- `autoOpen`: If any of the following characters are typed, their counterparts are automatically added:
  - `(` adds `)`
  - `{` adds `}`
  - `[` adds `]`
  - `"` adds `"`
  - `'` adds `'`
- `overwrite`: If you type a closing character directly before an identical character, it will overwrite it instead of adding it. Best used with `autoOpen` set to true
- `autoStrip`: If set to true, and your cursor is between two paired characters, pressing backspace will delete both instead of just the first
- `autoIndent`: If set to true, automatic indentation of your code will be attempted. Best used with `autoOpen` set to true
- `continueList`: If set to true, Markdown lists (and GFM style task lists) are continued when pressing enter
- `moveLine`: If set to true, lines can be moved up and down using `alt+up/down`
- `duplicateLine`: If set to true, lines can be duplicated using `shift+alt+up/down`

#### Methods

```javascript
editrrr.getLineNr(pos); // get the line number (0 based)
editrrr.getLine(pos); // get the line
editrrr.getLineCursor(pos); // get the cursor position on the line
editrrr.getLines(); // get all lines
editrrr.getCursor(); // get the cursor position
editrrr.setCursor(start, end); // set the cursor position
editrrr.getSelection(); // get the selection
editrrr.levelsDeep(pos); // get the levels of indetation
editrrr.addEvent(name, fn); // add event listener
editrrr.removeEvent(name, fn); // remove event listener
editrrr.focus(); // focus the textarea
editrrr.blur(); // blur the textarea
editrrr.value; // get the value
editrrr.value = 'add some text'; // set the value
editrrr.init(); // init function
editrrr.destroy(); // remove all behaviors
```

#### Static methods

```javascript
Editrrr.addHook(['name'], (editrrr, e) => {});
Editrrr.getHook('name');
```

#### Hooks

Every hook function will receive 2 arguments:
- `editrrr`: the Editrrr instance
- `e`: the event data

###### init:before

Called before initializing Behave

###### init:after

Called after initializing Behave

###### enter:before

Called before inserting the text triggered by the enter key

###### enter:after

Called after inserting the text triggered by the enter key

###### delete:before

Called before deleting the text triggered by the delete key

###### delete:after

Called after deleting the text triggered by the delete key

###### tab:before

Called before inserting the text triggered by the tab key

###### tab:after

Called after inserting the text triggered by the tab key

###### keyup

Called before modifying the text triggered by the keyup event

###### keydown

Called after modifying the text triggered by the keydown event

###### input

Called after modifying the text triggered by the input event

###### openChar:before

Called before modifying the text triggered by an opening character

###### openChar:after

Called after modifying the text triggered by an opening character

###### closeChar:before

Called before modifying the text triggered by an closing character

###### closeChar:after

Called after modifying the text triggered by an closing character

###### destroy:before

Called before removing all the behavoirs

###### destroy:after

Called after removing all the behaviors


License
-------

[MIT License](LICENSE)
