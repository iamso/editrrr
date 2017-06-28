/*!
 * editrrr - version 0.1.0
 *
 * Made with ❤ by Steve Ottoz so@dev.so
 *
 * Copyright (c) 2017 Steve Ottoz
 */

/**
 * Default settings
 * @type {Object}
 */
const defaults = {
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
  duplicateLine: true
};

/**
 * Keymap for autoOpen
 * @type {Array}
 */
const keyMap = [{
  open: '"',
  close: '"',
  canBreak: false
}, {
  open: '\'',
  close: '\'',
  canBreak: false
}, {
  open: '`',
  close: '`',
  canBreak: false
}, {
  open: '(',
  close: ')',
  canBreak: false
}, {
  open: '[',
  close: ']',
  canBreak: true
}, {
  open: '{',
  close: '}',
  canBreak: true
}, {
  open: '<',
  close: '>',
  canBreak: false
}];

/**
 * Object for storing hooks
 * @type {Object}
 */
const hooks = {};

/**
 * Editrrr class
 * @type {Class}
 */
export default class Editrrr {

  /**
   * Editrrr constructor
   * @param  {Object} options - options to override the defaults
   * @return {Object}         - Editrrr instance
   */
  constructor(options) {
    this.options = Object.assign({}, defaults, options);
    this.textarea = this.options.textarea;
    this.init();
  }

  /**
   * Static method for adding hooks
   * @param {Array|String} name - name or array of names
   * @param {Function}     fn   - hook function
   */
  static addHook(name, fn) {
    if (!Array.isArray(name)) {
      name = [name];
    }
    for (let i of name) {
      if (!hooks[i]) {
        hooks[i] = [];
      }
      hooks[i].push(fn);
    }
  }

  /**
   * Static method for getting hook functions
   * @param  {String} name - name
   * @return {Array}       - hooks
   */
  static getHook(name) {
    return hooks[name];
  }

  /**
   * Method to call hook functions
   * @param  {String} name  - name
   * @param  {Object} event - event data
   * @return {Object}       - Editrrr instance
   */
  callHook(name, event) {
    const hooks = Editrrr.getHook(name);
    if (hooks) {
      const text = this.textarea.value;
      const pos = this.getCursor();

      for (let hook of hooks) {
        hook.call(this, this, event);
      }
    }
    return this;
  }

  /**
   * Method to get line number
   * @param  {Number} [pos] - cursor position
   * @return {Number}       - line number
   */
  getLineNr(pos = this.getCursor()) {
    return this.value.substring(0, pos).split('\n').length;
  }

  /**
   * Method to a line
   * @param  {Number} [pos] - cursor position
   * @return {String}       - line text
   */
  getLine(pos = this.getCursor()) {
    return this.value.substring(0, pos).split('\n').pop();
  }

  /**
   * Method to get all lines
   * @return {Array} - lines
   */
  getLines() {
    return this.value.split(/\r?\n/);
  }

  /**
   * Method to get the cursor position
   * @return {Number} - cursor position
   */
  getCursor() {
    return this.textarea.selectionStart;
  }

  /**
   * Method to set the cursor position
   * @param {Number} start - start of the position
   * @param {Number} [end] - end of the position
   * @return {Object}      - Editrrr instance
   */
  setCursor(start, end = start) {
    this.textarea.focus();
    this.textarea.setSelectionRange(start, end);
    return this;
  }

  /**
   * Method to get the selection
   * @return {Object|Boolean} - selection range or false
   */
  getSelection() {
    const start = this.textarea.selectionStart;
    const end = this.textarea.selectionEnd;

    return start === end ? false : {
      start,
      end
    };
  }

  /**
   * Getter for the value
   * @return {String} - textarea value
   */
  get value() {
    return this.textarea.value.replace(/\r/g, '');
  }

  /**
   * Setter for the value
   * @param  {String} value - value to set
   * @return {String}       - value
   */
  set value(value) {
    this.textarea.value = value;
  }

  /**
   * Method to focus the textarea
   * @return {Object} - Editrrr instance
   */
  focus() {
    this.textarea.focus();
    return this;
  }

  /**
   * Method to blur the textarea
   * @return {Object} - Editrrr instance
   */
  blur() {
    this.textarea.blur();
    return this;
  }

  /**
   * Method to get the level of indetation
   * @return {Number} - level
   */
  levelsDeep() {
    const pos = this.getCursor();
    const left = this.value.substring(0, pos);
    const quoteMap = ['\'', '"'];
    let levels = 0;
    let decrement = 0;
    let final;

    for (let i of left) {
      for (let key of keyMap) {
        if (key.canBreak) {
          if (key.open === i) {
            levels++;
          }

          if (key.close === i) {
            levels--;
          }
        }
      }
    }

    for (let key of keyMap) {
      if (key.canBreak) {
        for (let quote of quoteMap) {
          decrement += left.split(quote).filter((item, i) => i % 2).join('').split(key.open).length - 1;
        }
      }
    }

    final = levels - decrement;

    return Math.max(final, 0);
  }

  /**
   * Method to handle the tab key
   * @param  {Object} e - event data
   * @return {Boolean}
   */
  tabKey(e) {
    let ret;
    if (e.keyCode === 9) {
      e.preventDefault();

      this.callHook('tab:before');

      const selection = this.getSelection();
      const pos = this.getCursor();

      ret = true;

      if (selection) {
        let tempStart = selection.start;
        while (tempStart--) {
          if (this.value.charAt(tempStart) === '\n') {
            selection.start = tempStart + 1;
            break;
          }
        }

        let indent = this.value.substring(selection.start, selection.end);
        let lines = indent.split('\n');

        if (e.shiftKey) {
          for (let i in lines) {
            let line = lines[i];
            if (line.substring(0, this.tab.length) === this.tab) {
              lines[i] = line.substring(this.tab.length);
            }
          }
          indent = lines.join('\n');
          this.value = `${ this.value.substring(0, selection.start) }${ indent }${ this.value.substring(selection.end) }`;
          this.setCursor(selection.start, selection.start + indent.length);
        } else {
          for (let i in lines) {
            lines[i] = this.tab + lines[i];
          }
          indent = lines.join('\n');
          this.value = `${ this.value.substring(0, selection.start) }${ indent }${ this.value.substring(selection.end) }`;
          this.setCursor(selection.start, selection.start + indent.length);
        }
      } else {
        const left = this.value.substring(0, pos);
        const right = this.value.substring(pos);
        let edited = `${ left }${ this.tab }${ right }`;

        if (e.shiftKey) {
          if (this.value.substring(pos - this.tab.length, pos) === this.tab) {
            this.value = `${ this.value.substring(0, pos - this.tab.length) }${ right }`;
            this.setCursor(pos - this.tab.length);
          }
        } else {
          this.value = edited;
          this.setCursor(pos + this.tab.length);
          ret = false;
        }
      }
      this.callHook('tab:after');
    }
    return ret;
  }

  /**
   * Method to handle the enter key
   * @param  {Object} e - event data
   * @return {undefined}
   */
  enterKey(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.callHook('enter:before');

      const pos = this.getCursor();
      const left = this.value.substring(0, pos);
      const right = this.value.substring(pos);
      const leftChar = left.charAt(left.length - 1);
      const rightChar = right.charAt(0);
      let tabs = this.levelsDeep();
      let indent = '';
      let closing = '';
      let final;

      if (!tabs) {
        final = 1;
      } else {
        while (tabs--) {
          indent += this.tab;
        }
        final = indent.length + 1;

        for (let key of keyMap) {
          if (key.open === leftChar && key.close === rightChar) {
            closing = this.newLine;
          }
        }
      }

      this.value = `${ left }${ this.newLine }${ indent }${ closing }${ indent.substring(0, indent.length - this.tab.length) }${ right }`;
      this.setCursor(pos + final);
      this.callHook('enter:after');
    }
  }

  /**
   * Method to handle the list continuation
   * @param  {Object} e - event data
   * @return {undefined}
   */
  enterKeyList(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.callHook('enter:before');

      let pos = this.getCursor();
      const left = this.value.substring(0, pos);
      const right = this.value.substring(pos);
      const nr = Math.max(0, left.split(/\r?\n/).length - 2);
      const lines = this.getLines();
      const line = lines[nr];
      let match;
      let edited;

      if (match = line.match(/^\s*([\-\–\—\+\*\•\·\»\>]|\d+\.)\s(\[[\sx]\]\s)?/)) {
        if (line === match[0]) {
          pos -= line.length;
          lines[nr] = '';
          edited = lines.join('\n');
        } else {
          edited = `${ left }${ match[0] }${ right }`;
          pos += match[0].length;
        }
        this.value = edited;
        this.setCursor(pos);
      }

      this.callHook('enter:after');
    }
  }

  /**
   * Method to handle the delete key
   * @param  {Object} e - event data
   * @return {undefined}
   */
  deleteKey(e) {
    if (e.keyCode === 8 && !e.altKey) {
      e.preventDefault();
      this.callHook('delete:before');

      const pos = this.getCursor();
      const left = this.value.substring(0, pos);
      const right = this.value.substring(pos);
      const leftChar = left.charAt(left.length - 1);
      const rightChar = right.charAt(0);

      if (this.getSelection() === false) {
        for (let key of keyMap) {
          if (key.open === leftChar && key.close === rightChar) {
            this.value = `${ this.value.substring(0, pos - 1) }${ this.value.substring(pos + 1) }`;
            this.setCursor(pos - 1);
            return;
          }
        }
        this.value = `${ this.value.substring(0, pos - 1) }${ this.value.substring(pos) }`;
        this.setCursor(pos - 1);
      } else {
        const selection = this.getSelection();
        this.value = `${ this.value.substring(0, selection.start) }${ this.value.substring(selection.end) }`;
        this.setCursor(pos);
      }

      this.callHook('delete:after');
    }
  }

  /**
   * Method to handle line moving
   * @param  {Object} e - event data
   * @return {undefined}
   */
  moveLine(e) {
    if (e.ctrlKey && (this.isMac && e.metaKey || this.isWin && e.shiftKey) && [38, 40].indexOf(e.keyCode) >= 0) {
      e.preventDefault();

      const selection = this.getSelection();
      let lines = this.getLines();

      if (selection) {
        let start = this.getLineNr(selection.start) - 1;
        let end = this.getLineNr(selection.end) - 1;
        let selectionStart;
        let selectionEnd;

        if (e.keyCode === 38) {
          // up
          if (start > 0) {
            for (let i = start; i <= end; i++) {
              lines = this.lineUp(lines, i);
            }
            start--;
            end--;
          }
        } else if (e.keyCode === 40) {
          // down
          if (end < lines.length - 1) {
            for (let i = end; i >= start; i--) {
              lines = this.lineDown(lines, i);
            }
            start++;
            end++;
          }
        }

        selectionStart = lines.slice(0, start).join('\n').length;
        selectionEnd = lines.slice(0, end + 1).join('\n').length;

        if (selectionStart > 0) {
          selectionStart++;
        }

        this.value = lines.join('\n');
        this.setCursor(selectionStart, selectionEnd);
      } else {
        const line = this.getLineNr() - 1;
        const curPos = this.getCursor();
        let newPos = curPos;

        if (e.keyCode === 38) {
          // up
          if (line > 0) {
            lines = this.lineUp(lines, line);
            newPos = curPos - lines[line].length - 1; // -1 for the missing newline
          }
        } else if (e.keyCode === 40) {
          // down
          if (line < lines.length - 1) {
            lines = this.lineDown(lines, line);
            newPos = curPos + lines[line].length + 1; // +1 for the missing newline
          }
        }
        this.value = lines.join('\n');
        this.setCursor(newPos);
      }
    }
  }

  /**
   * Method to handle line duplication
   * @param  {Object} e - event data
   * @return {undefined}
   */
  duplicateLine(e) {
    if (e.shiftKey && (this.isMac && e.metaKey || this.isWin && e.ctrlKey) && e.keyCode === 68) {
      e.preventDefault();

      const selection = this.getSelection();
      let lines = this.getLines();

      if (selection) {
        let start = this.getLineNr(selection.start) - 1;
        let end = this.getLineNr(selection.end) - 1;
        let length = end - start + 1;
        let index = end;
        let selectionStart;
        let selectionEnd;

        for (let i = start; i <= end; i++) {
          index++;
          lines.splice(index, 0, lines[i]);
        }

        selectionStart = lines.slice(0, start + length).join('\n').length;
        selectionEnd = lines.slice(0, end + length + 1).join('\n').length;

        if (selectionStart > 0) {
          selectionStart++;
        }

        this.value = lines.join('\n');
        this.setCursor(selectionStart, selectionEnd);
      } else {
        const line = this.getLineNr() - 1;
        const curPos = this.getCursor();
        let newPos = curPos;

        lines.splice(line + 1, 0, lines[line]);

        newPos = curPos + lines[line].length + 1; // +1 for the missing newline

        this.value = lines.join('\n');
        this.setCursor(newPos);
      }
    }
  }

  /**
   * Method to handle open character from keymap
   * @param  {String} char - character
   * @param  {Object} e    - event data
   * @return {undefined}
   */
  openedChar(char, e) {
    e.preventDefault();
    this.callHook('openChar:before');

    const pos = this.getCursor();
    const left = this.value.substring(0, pos);
    const right = this.value.substring(pos);

    this.value = `${ left }${ char.open }${ char.close }${ right }`;
    this.setCursor(pos + 1);

    this.callHook('openChar:after');
  }

  /**
   * Method to handle close character from keymap
   * @param  {String} char - character
   * @param  {Object} e    - event data
   * @return {Boolean}     - character matched
   */
  closedChar(char, e) {
    const pos = this.getCursor();
    const overwrite = this.value.substring(pos, pos + 1);

    if (overwrite === char.close) {
      e.preventDefault();
      this.callHook('closeChar:before');
      this.setCursor(pos + 1);
      this.callHook('closeChar:after');
      return true;
    }
    return false;
  }

  /**
   * Method to handle the character matching
   * @param  {Object} e - event data
   * @return {undefined}
   */
  filter(e) {
    for (let key of keyMap) {
      if (key.close == e.key) {
        const closed = this.options.overwrite && this.closedChar(key, e);

        if (!closed && key.open === e.key && this.options.autoOpen) {
          this.openedChar(key, e);
        }
      } else if (key.open === e.key && this.options.autoOpen) {
        this.openedChar(key, e);
      }
    }
  }

  /**
   * Method to add event listeners
   * @param {String}   event - event name
   * @param {Function} fn    - event handler
   * @return {Object}        - Editrrr instance
   */
  addEvent(event, fn) {
    this.textarea.addEventListener(event, fn, false);
    return this;
  }

  /**
   * Method to remove event listeners
   * @param {String}   event - event name
   * @param {Function} fn    - event handler
   * @return {Object}        - Editrrr instance
   */
  removeEvent(event, fn) {
    this.textarea.removeEventListener(event, fn, false);
    return this;
  }

  /**
   * Method to setup event listeners
   * @return {Object} - Editrrr instance
   */
  listen() {
    this.listeners = {
      'keydown': [],
      'keypress': [],
      'keyup': [],
      'input': []
    };

    if (this.options.replaceTab) {
      this.listeners.keydown.push(this.tabKey.bind(this));
    }
    if (this.options.autoIndent) {
      this.listeners.keydown.push(this.enterKey.bind(this));
    }
    if (this.options.autoStrip) {
      this.listeners.keydown.push(this.deleteKey.bind(this));
    }
    if (this.options.continueList) {
      this.listeners.keydown.push(this.enterKeyList.bind(this));
    }
    if (this.options.moveLine) {
      this.listeners.keydown.push(this.moveLine.bind(this));
    }
    if (this.options.duplicateLine) {
      this.listeners.keydown.push(this.duplicateLine.bind(this));
    }

    this.listeners.keypress.push(this.filter.bind(this));

    this.listeners.keydown.push(e => {
      this.callHook('keydown', e);
    });

    this.listeners.keyup.push(e => {
      this.callHook('keyup', e);
    });
    this.listeners.input.push(e => {
      this.callHook('input', e);
    });

    for (let event of Object.keys(this.listeners)) {
      const listeners = this.listeners[event];
      for (let listener of listeners) {
        this.addEvent(event, listener);
      }
    }
    return this;
  }

  /**
   * Method to define the tabsize
   * @param  {String|Number} tabSize - tab size
   * @return {Object}                - Editrrr instance
   */
  defineTabSize(tabSize) {
    this.textarea.style[this.prefix('tab-size')] = tabSize;
    return this;
  }

  /**
   * Method to define the new line character
   * @return {Object} - Editrrr instance
   */
  defineNewLine() {
    const ta = document.createElement('textarea');
    ta.value = '\n';
    this.newLine = ta.value.length === 2 ? '\r\n' : '\n';
    return this;
  }

  /**
   * Method to move a line up
   * @param  {Array}  [lines] - lines array
   * @param  {Number} [index] - index of line to move
   * @return {Array}          - updated lines array
   */
  lineUp(lines = this.getLines(), index = 0) {
    if (index > 0) {
      const curLine = lines[index];
      const newLine = lines[index - 1];
      lines[index] = newLine;
      lines[index - 1] = curLine;
    }
    return lines;
  }

  /**
   * Method to move a line down
   * @param  {Array}  [lines] - lines array
   * @param  {Number} [index] - index of line to move
   * @return {Array}          - updated lines array
   */
  lineDown(lines = this.getLines(), index = 0) {
    if (index < lines.length - 1) {
      const curLine = lines[index];
      const newLine = lines[index + 1];
      lines[index] = newLine;
      lines[index + 1] = curLine;
    }
    return lines;
  }

  /**
   * Method to prefix css properties
   * @param  {String}    a     - css property
   * @param  {undefined} b,c,d - placeholder variables
   * @return {String}            prefixed css property
   */
  prefix(a, b, c, d) {
    for (d ? d = b.toUpperCase() : b = 4; !d && b--; d = (d = d.replace(/-(.)/g, prefix)) in new Image().style && d) {
      d = [['Moz-', 'Webkit-', 'Ms-', 'O-'][b]] + a;
    }
    return d || a;
  }

  /**
   * Init method
   * @return {Object} - Editrrr instance
   */
  init() {
    this.isMac = /(Mac)/gi.test(navigator.platform);
    this.isWin = /(Win)/gi.test(navigator.platform);

    if (this.textarea) {
      this.callHook('init:before');
      this.defineNewLine();

      if (this.options.softTabs) {
        this.tab = " ".repeat(this.options.tabSize);
      } else {
        this.tab = "\t";
        this.defineTabSize(this.options.tabSize);
      }

      this.listen();
      this.callHook('init:after');
    }
    return this;
  }

  /**
   * Method to remove all event listeners
   * @return {Object} - Editrrr instance
   */
  destroy() {
    this.callHook('destroy:before');
    for (let event of Object.keys(this.listeners)) {
      const listeners = this.listeners[event];
      for (let listener of listeners) {
        this.removeEvent(event, listener);
      }
    }
    this.callHook('destroy:before');
    return this;
  }
}