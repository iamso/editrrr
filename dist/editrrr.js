/*!
 * editrrr - version 0.1.1
 *
 * Made with ❤ by Steve Ottoz so@dev.so
 *
 * Copyright (c) 2017 Steve Ottoz
 */
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.Editrrr = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  /**
   * Default settings
   * @type {Object}
   */
  var defaults = {
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
  var keyMap = [{
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
  var hooks = {};

  /**
   * Editrrr class
   * @type {Class}
   */

  var Editrrr = function () {

    /**
     * Editrrr constructor
     * @param  {Object} options - options to override the defaults
     * @return {Object}         - Editrrr instance
     */
    function Editrrr(options) {
      _classCallCheck(this, Editrrr);

      this.options = Object.assign({}, defaults, options);
      this.textarea = this.options.textarea;
      this.init();
    }

    /**
     * Static method for adding hooks
     * @param {Array|String} name - name or array of names
     * @param {Function}     fn   - hook function
     */


    _createClass(Editrrr, [{
      key: 'callHook',
      value: function callHook(name, event) {
        var hooks = Editrrr.getHook(name);
        if (hooks) {
          var text = this.textarea.value;
          var pos = this.getCursor();

          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = hooks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var hook = _step.value;

              hook.call(this, this, event);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }
        return this;
      }
    }, {
      key: 'getLineNr',
      value: function getLineNr() {
        var pos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getCursor();

        return this.value.substring(0, pos).split('\n').length;
      }
    }, {
      key: 'getLine',
      value: function getLine() {
        var pos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getCursor();

        return this.value.substring(0, pos).split('\n').pop();
      }
    }, {
      key: 'getLines',
      value: function getLines() {
        return this.value.split(/\r?\n/);
      }
    }, {
      key: 'getCursor',
      value: function getCursor() {
        return this.textarea.selectionStart;
      }
    }, {
      key: 'setCursor',
      value: function setCursor(start) {
        var end = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : start;

        this.textarea.focus();
        this.textarea.setSelectionRange(start, end);
        return this;
      }
    }, {
      key: 'getSelection',
      value: function getSelection() {
        var start = this.textarea.selectionStart;
        var end = this.textarea.selectionEnd;

        return start === end ? false : {
          start: start,
          end: end
        };
      }
    }, {
      key: 'focus',
      value: function focus() {
        this.textarea.focus();
        return this;
      }
    }, {
      key: 'blur',
      value: function blur() {
        this.textarea.blur();
        return this;
      }
    }, {
      key: 'levelsDeep',
      value: function levelsDeep() {
        var pos = this.getCursor();
        var left = this.value.substring(0, pos);
        var quoteMap = ['\'', '"'];
        var levels = 0;
        var decrement = 0;
        var final = void 0;

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = left[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var i = _step2.value;
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
              for (var _iterator4 = keyMap[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var key = _step4.value;

                if (key.canBreak) {
                  if (key.open === i) {
                    levels++;
                  }

                  if (key.close === i) {
                    levels--;
                  }
                }
              }
            } catch (err) {
              _didIteratorError4 = true;
              _iteratorError4 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                  _iterator4.return();
                }
              } finally {
                if (_didIteratorError4) {
                  throw _iteratorError4;
                }
              }
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = keyMap[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var _key = _step3.value;

            if (_key.canBreak) {
              var _iteratorNormalCompletion5 = true;
              var _didIteratorError5 = false;
              var _iteratorError5 = undefined;

              try {
                for (var _iterator5 = quoteMap[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                  var quote = _step5.value;

                  decrement += left.split(quote).filter(function (item, i) {
                    return i % 2;
                  }).join('').split(_key.open).length - 1;
                }
              } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion5 && _iterator5.return) {
                    _iterator5.return();
                  }
                } finally {
                  if (_didIteratorError5) {
                    throw _iteratorError5;
                  }
                }
              }
            }
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        final = levels - decrement;

        return Math.max(final, 0);
      }
    }, {
      key: 'tabKey',
      value: function tabKey(e) {
        var ret = void 0;
        if (e.keyCode === 9) {
          e.preventDefault();

          this.callHook('tab:before');

          var selection = this.getSelection();
          var pos = this.getCursor();

          ret = true;

          if (selection) {
            var tempStart = selection.start;
            while (tempStart--) {
              if (this.value.charAt(tempStart) === '\n') {
                selection.start = tempStart + 1;
                break;
              }
            }

            var indent = this.value.substring(selection.start, selection.end);
            var lines = indent.split('\n');

            if (e.shiftKey) {
              for (var i in lines) {
                var line = lines[i];
                if (line.substring(0, this.tab.length) === this.tab) {
                  lines[i] = line.substring(this.tab.length);
                }
              }
              indent = lines.join('\n');
              this.value = '' + this.value.substring(0, selection.start) + indent + this.value.substring(selection.end);
              this.setCursor(selection.start, selection.start + indent.length);
            } else {
              for (var _i in lines) {
                lines[_i] = this.tab + lines[_i];
              }
              indent = lines.join('\n');
              this.value = '' + this.value.substring(0, selection.start) + indent + this.value.substring(selection.end);
              this.setCursor(selection.start, selection.start + indent.length);
            }
          } else {
            var left = this.value.substring(0, pos);
            var right = this.value.substring(pos);
            var edited = '' + left + this.tab + right;

            if (e.shiftKey) {
              if (this.value.substring(pos - this.tab.length, pos) === this.tab) {
                this.value = '' + this.value.substring(0, pos - this.tab.length) + right;
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
    }, {
      key: 'enterKey',
      value: function enterKey(e) {
        if (e.keyCode === 13) {
          e.preventDefault();
          this.callHook('enter:before');

          var pos = this.getCursor();
          var left = this.value.substring(0, pos);
          var right = this.value.substring(pos);
          var leftChar = left.charAt(left.length - 1);
          var rightChar = right.charAt(0);
          var tabs = this.levelsDeep();
          var indent = '';
          var closing = '';
          var final = void 0;

          if (!tabs) {
            final = 1;
          } else {
            while (tabs--) {
              indent += this.tab;
            }
            final = indent.length + 1;

            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
              for (var _iterator6 = keyMap[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                var key = _step6.value;

                if (key.open === leftChar && key.close === rightChar) {
                  closing = this.newLine;
                }
              }
            } catch (err) {
              _didIteratorError6 = true;
              _iteratorError6 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                  _iterator6.return();
                }
              } finally {
                if (_didIteratorError6) {
                  throw _iteratorError6;
                }
              }
            }
          }

          this.value = '' + left + this.newLine + indent + closing + indent.substring(0, indent.length - this.tab.length) + right;
          this.setCursor(pos + final);
          this.callHook('enter:after');
        }
      }
    }, {
      key: 'enterKeyList',
      value: function enterKeyList(e) {
        if (e.keyCode === 13) {
          e.preventDefault();
          this.callHook('enter:before');

          var pos = this.getCursor();
          var left = this.value.substring(0, pos);
          var right = this.value.substring(pos);
          var nr = Math.max(0, left.split(/\r?\n/).length - 2);
          var lines = this.getLines();
          var line = lines[nr];
          var match = void 0;
          var edited = void 0;

          if (match = line.match(/^\s*([\-\–\—\+\*\•\·\»\>]|\d+\.)\s(\[[\sx]\]\s)?/)) {
            if (line === match[0]) {
              pos -= line.length;
              lines[nr] = '';
              edited = lines.join('\n');
            } else {
              edited = '' + left + match[0] + right;
              pos += match[0].length;
            }
            this.value = edited;
            this.setCursor(pos);
          }

          this.callHook('enter:after');
        }
      }
    }, {
      key: 'deleteKey',
      value: function deleteKey(e) {
        if (e.keyCode === 8 && !e.altKey) {
          e.preventDefault();
          this.callHook('delete:before');

          var pos = this.getCursor();
          var left = this.value.substring(0, pos);
          var right = this.value.substring(pos);
          var leftChar = left.charAt(left.length - 1);
          var rightChar = right.charAt(0);

          if (this.getSelection() === false) {
            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
              for (var _iterator7 = keyMap[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                var key = _step7.value;

                if (key.open === leftChar && key.close === rightChar) {
                  this.value = '' + this.value.substring(0, pos - 1) + this.value.substring(pos + 1);
                  this.setCursor(pos - 1);
                  return;
                }
              }
            } catch (err) {
              _didIteratorError7 = true;
              _iteratorError7 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion7 && _iterator7.return) {
                  _iterator7.return();
                }
              } finally {
                if (_didIteratorError7) {
                  throw _iteratorError7;
                }
              }
            }

            this.value = '' + this.value.substring(0, pos - 1) + this.value.substring(pos);
            this.setCursor(pos - 1);
          } else {
            var selection = this.getSelection();
            this.value = '' + this.value.substring(0, selection.start) + this.value.substring(selection.end);
            this.setCursor(pos);
          }

          this.callHook('delete:after');
        }
      }
    }, {
      key: 'moveLine',
      value: function moveLine(e) {
        if (e.ctrlKey && (this.isMac && e.metaKey || this.isWin && e.shiftKey) && [38, 40].indexOf(e.keyCode) >= 0) {
          e.preventDefault();

          var selection = this.getSelection();
          var lines = this.getLines();

          if (selection) {
            var start = this.getLineNr(selection.start) - 1;
            var end = this.getLineNr(selection.end) - 1;
            var selectionStart = void 0;
            var selectionEnd = void 0;

            if (e.keyCode === 38) {
              // up
              if (start > 0) {
                for (var i = start; i <= end; i++) {
                  lines = this.lineUp(lines, i);
                }
                start--;
                end--;
              }
            } else if (e.keyCode === 40) {
              // down
              if (end < lines.length - 1) {
                for (var _i2 = end; _i2 >= start; _i2--) {
                  lines = this.lineDown(lines, _i2);
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
            var line = this.getLineNr() - 1;
            var curPos = this.getCursor();
            var newPos = curPos;

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
    }, {
      key: 'duplicateLine',
      value: function duplicateLine(e) {
        if (e.shiftKey && (this.isMac && e.metaKey || this.isWin && e.ctrlKey) && e.keyCode === 68) {
          e.preventDefault();

          var selection = this.getSelection();
          var lines = this.getLines();

          if (selection) {
            var start = this.getLineNr(selection.start) - 1;
            var end = this.getLineNr(selection.end) - 1;
            var length = end - start + 1;
            var index = end;
            var selectionStart = void 0;
            var selectionEnd = void 0;

            for (var i = start; i <= end; i++) {
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
            var line = this.getLineNr() - 1;
            var curPos = this.getCursor();
            var newPos = curPos;

            lines.splice(line + 1, 0, lines[line]);

            newPos = curPos + lines[line].length + 1; // +1 for the missing newline

            this.value = lines.join('\n');
            this.setCursor(newPos);
          }
        }
      }
    }, {
      key: 'openedChar',
      value: function openedChar(char, e) {
        e.preventDefault();
        this.callHook('openChar:before');

        var pos = this.getCursor();
        var left = this.value.substring(0, pos);
        var right = this.value.substring(pos);

        this.value = '' + left + char.open + char.close + right;
        this.setCursor(pos + 1);

        this.callHook('openChar:after');
      }
    }, {
      key: 'closedChar',
      value: function closedChar(char, e) {
        var pos = this.getCursor();
        var overwrite = this.value.substring(pos, pos + 1);

        if (overwrite === char.close) {
          e.preventDefault();
          this.callHook('closeChar:before');
          this.setCursor(pos + 1);
          this.callHook('closeChar:after');
          return true;
        }
        return false;
      }
    }, {
      key: 'filter',
      value: function filter(e) {
        var _iteratorNormalCompletion8 = true;
        var _didIteratorError8 = false;
        var _iteratorError8 = undefined;

        try {
          for (var _iterator8 = keyMap[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            var key = _step8.value;

            if (key.close == e.key) {
              var closed = this.options.overwrite && this.closedChar(key, e);

              if (!closed && key.open === e.key && this.options.autoOpen) {
                this.openedChar(key, e);
              }
            } else if (key.open === e.key && this.options.autoOpen) {
              this.openedChar(key, e);
            }
          }
        } catch (err) {
          _didIteratorError8 = true;
          _iteratorError8 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion8 && _iterator8.return) {
              _iterator8.return();
            }
          } finally {
            if (_didIteratorError8) {
              throw _iteratorError8;
            }
          }
        }
      }
    }, {
      key: 'addEvent',
      value: function addEvent(event, fn) {
        this.textarea.addEventListener(event, fn, false);
        return this;
      }
    }, {
      key: 'removeEvent',
      value: function removeEvent(event, fn) {
        this.textarea.removeEventListener(event, fn, false);
        return this;
      }
    }, {
      key: 'listen',
      value: function listen() {
        var _this = this;

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

        this.listeners.keydown.push(function (e) {
          _this.callHook('keydown', e);
        });

        this.listeners.keyup.push(function (e) {
          _this.callHook('keyup', e);
        });
        this.listeners.input.push(function (e) {
          _this.callHook('input', e);
        });

        var _iteratorNormalCompletion9 = true;
        var _didIteratorError9 = false;
        var _iteratorError9 = undefined;

        try {
          for (var _iterator9 = Object.keys(this.listeners)[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
            var event = _step9.value;

            var listeners = this.listeners[event];
            var _iteratorNormalCompletion10 = true;
            var _didIteratorError10 = false;
            var _iteratorError10 = undefined;

            try {
              for (var _iterator10 = listeners[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                var listener = _step10.value;

                this.addEvent(event, listener);
              }
            } catch (err) {
              _didIteratorError10 = true;
              _iteratorError10 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion10 && _iterator10.return) {
                  _iterator10.return();
                }
              } finally {
                if (_didIteratorError10) {
                  throw _iteratorError10;
                }
              }
            }
          }
        } catch (err) {
          _didIteratorError9 = true;
          _iteratorError9 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion9 && _iterator9.return) {
              _iterator9.return();
            }
          } finally {
            if (_didIteratorError9) {
              throw _iteratorError9;
            }
          }
        }

        return this;
      }
    }, {
      key: 'defineTabSize',
      value: function defineTabSize(tabSize) {
        this.textarea.style[this.prefix('tab-size')] = tabSize;
        return this;
      }
    }, {
      key: 'defineNewLine',
      value: function defineNewLine() {
        var ta = document.createElement('textarea');
        ta.value = '\n';
        this.newLine = ta.value.length === 2 ? '\r\n' : '\n';
        return this;
      }
    }, {
      key: 'lineUp',
      value: function lineUp() {
        var lines = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getLines();
        var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        if (index > 0) {
          var curLine = lines[index];
          var newLine = lines[index - 1];
          lines[index] = newLine;
          lines[index - 1] = curLine;
        }
        return lines;
      }
    }, {
      key: 'lineDown',
      value: function lineDown() {
        var lines = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getLines();
        var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        if (index < lines.length - 1) {
          var curLine = lines[index];
          var newLine = lines[index + 1];
          lines[index] = newLine;
          lines[index + 1] = curLine;
        }
        return lines;
      }
    }, {
      key: 'prefix',
      value: function prefix(a, b, c, d) {
        for (d ? d = b.toUpperCase() : b = 4; !d && b--; d = (d = d.replace(/-(.)/g, this.prefix)) in new Image().style && d) {
          d = [['Moz-', 'Webkit-', 'Ms-', 'O-'][b]] + a;
        }
        return d || a;
      }
    }, {
      key: 'init',
      value: function init() {
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
    }, {
      key: 'destroy',
      value: function destroy() {
        this.callHook('destroy:before');
        var _iteratorNormalCompletion11 = true;
        var _didIteratorError11 = false;
        var _iteratorError11 = undefined;

        try {
          for (var _iterator11 = Object.keys(this.listeners)[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
            var event = _step11.value;

            var listeners = this.listeners[event];
            var _iteratorNormalCompletion12 = true;
            var _didIteratorError12 = false;
            var _iteratorError12 = undefined;

            try {
              for (var _iterator12 = listeners[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                var listener = _step12.value;

                this.removeEvent(event, listener);
              }
            } catch (err) {
              _didIteratorError12 = true;
              _iteratorError12 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion12 && _iterator12.return) {
                  _iterator12.return();
                }
              } finally {
                if (_didIteratorError12) {
                  throw _iteratorError12;
                }
              }
            }
          }
        } catch (err) {
          _didIteratorError11 = true;
          _iteratorError11 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion11 && _iterator11.return) {
              _iterator11.return();
            }
          } finally {
            if (_didIteratorError11) {
              throw _iteratorError11;
            }
          }
        }

        this.callHook('destroy:before');
        return this;
      }
    }, {
      key: 'value',
      get: function get() {
        return this.textarea.value.replace(/\r/g, '');
      },
      set: function set(value) {
        this.textarea.value = value;
      }
    }], [{
      key: 'addHook',
      value: function addHook(name, fn) {
        if (!Array.isArray(name)) {
          name = [name];
        }
        var _iteratorNormalCompletion13 = true;
        var _didIteratorError13 = false;
        var _iteratorError13 = undefined;

        try {
          for (var _iterator13 = name[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
            var i = _step13.value;

            if (!hooks[i]) {
              hooks[i] = [];
            }
            hooks[i].push(fn);
          }
        } catch (err) {
          _didIteratorError13 = true;
          _iteratorError13 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion13 && _iterator13.return) {
              _iterator13.return();
            }
          } finally {
            if (_didIteratorError13) {
              throw _iteratorError13;
            }
          }
        }
      }
    }, {
      key: 'getHook',
      value: function getHook(name) {
        return hooks[name];
      }
    }]);

    return Editrrr;
  }();

  exports.default = Editrrr;
  module.exports = exports['default'];
});