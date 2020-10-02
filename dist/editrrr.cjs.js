/*!
 * editrrr - version 0.3.0
 *
 * Made with ❤ by Steve Ottoz so@dev.so
 *
 * Copyright (c) 2020 Steve Ottoz
 */
"use strict";const t={textarea:null,replaceTab:!0,softTabs:!0,tabSize:2,autoOpen:!0,overwrite:!0,autoStrip:!0,autoIndent:!0,continueList:!0,moveLine:!0,duplicateLine:!0},e=[{open:'"',close:'"',canBreak:!1},{open:"'",close:"'",canBreak:!1},{open:"`",close:"`",canBreak:!1},{open:"(",close:")",canBreak:!1},{open:"[",close:"]",canBreak:!0},{open:"{",close:"}",canBreak:!0},{open:"<",close:">",canBreak:!1}],s={};class i{constructor(e){this.options=Object.assign({},t,e),this.textarea=this.options.textarea,this.init()}static addHook(t,e){Array.isArray(t)||(t=[t]);for(let i of t)s[i]||(s[i]=[]),s[i].push(e)}static getHook(t){return s[t]}callHook(t,e){const s=i.getHook(t);if(s){this.textarea.value,this.getCursor();for(let t of s)t.call(this,this,e)}return this}getLineNr(t=this.getCursor()){return this.value.substring(0,t).split("\n").length}getLine(t=this.getCursor()){return this.value.substring(0,t).split("\n").pop()}getLines(){return this.value.split(/\r?\n/)}getCursor(){return this.textarea.selectionStart}setCursor(t,e=t){return this.textarea.focus(),this.textarea.setSelectionRange(t,e),this}getSelection(){const t=this.textarea.selectionStart,e=this.textarea.selectionEnd;return t!==e&&{start:t,end:e}}get value(){return this.textarea.value.replace(/\r/g,"")}set value(t){this.textarea.value=t}focus(){return this.textarea.focus(),this}blur(){return this.textarea.blur(),this}levelsDeep(){const t=this.getCursor(),s=this.value.substring(0,t),i=["'",'"'];let n,r=0,o=0;for(let t of s)for(let s of e)s.canBreak&&(s.open===t&&r++,s.close===t&&r--);for(let t of e)if(t.canBreak)for(let e of i)o+=s.split(e).filter(((t,e)=>e%2)).join("").split(t.open).length-1;return n=r-o,Math.max(n,0)}tabKey(t){let e;if(9===t.keyCode){t.preventDefault(),this.callHook("tab:before");const s=this.getSelection(),i=this.getCursor();if(e=!0,s){let e=s.start;for(;e--;)if("\n"===this.value.charAt(e)){s.start=e+1;break}let i=this.value.substring(s.start,s.end),n=i.split("\n");if(t.shiftKey){for(let t in n){let e=n[t];e.substring(0,this.tab.length)===this.tab&&(n[t]=e.substring(this.tab.length))}i=n.join("\n"),this.value=`${this.value.substring(0,s.start)}${i}${this.value.substring(s.end)}`,this.setCursor(s.start,s.start+i.length)}else{for(let t in n)n[t]=this.tab+n[t];i=n.join("\n"),this.value=`${this.value.substring(0,s.start)}${i}${this.value.substring(s.end)}`,this.setCursor(s.start,s.start+i.length)}}else{const s=this.value.substring(0,i),n=this.value.substring(i);let r=`${s}${this.tab}${n}`;t.shiftKey?this.value.substring(i-this.tab.length,i)===this.tab&&(this.value=`${this.value.substring(0,i-this.tab.length)}${n}`,this.setCursor(i-this.tab.length)):(this.value=r,this.setCursor(i+this.tab.length),e=!1)}this.callHook("tab:after")}return e}enterKey(t){if(13===t.keyCode){t.preventDefault(),this.callHook("enter:before");const s=this.getCursor(),i=this.value.substring(0,s),n=this.value.substring(s),r=i.charAt(i.length-1),o=n.charAt(0);let h,l=this.levelsDeep(),a="",u="";if(l){for(;l--;)a+=this.tab;h=a.length+1;for(let t of e)t.open===r&&t.close===o&&(u=this.newLine)}else h=1;this.value=`${i}${this.newLine}${a}${u}${a.substring(0,a.length-this.tab.length)}${n}`,this.setCursor(s+h),this.callHook("enter:after")}}enterKeyList(t){if(13===t.keyCode){t.preventDefault(),this.callHook("enter:before");let e=this.getCursor();const s=this.value.substring(0,e),i=this.value.substring(e),n=Math.max(0,s.split(/\r?\n/).length-2),r=this.getLines(),o=r[n];let h,l;(h=o.match(/^\s*([\-\–\—\+\*\•\·\»\>]|\d+\.)\s(\[[\sx]\]\s)?/))&&(o===h[0]?(e-=o.length,r[n]="",l=r.join("\n")):(l=`${s}${h[0]}${i}`,e+=h[0].length),this.value=l,this.setCursor(e)),this.callHook("enter:after")}}deleteKey(t){if(8===t.keyCode&&!t.altKey){t.preventDefault(),this.callHook("delete:before");const s=this.getCursor(),i=this.value.substring(0,s),n=this.value.substring(s),r=i.charAt(i.length-1),o=n.charAt(0);if(!1===this.getSelection()){for(let t of e)if(t.open===r&&t.close===o)return this.value=`${this.value.substring(0,s-1)}${this.value.substring(s+1)}`,void this.setCursor(s-1);this.value=`${this.value.substring(0,s-1)}${this.value.substring(s)}`,this.setCursor(s-1)}else{const t=this.getSelection();this.value=`${this.value.substring(0,t.start)}${this.value.substring(t.end)}`,this.setCursor(s)}this.callHook("delete:after")}}moveLine(t){if(t.ctrlKey&&(this.isMac&&t.metaKey||this.isWin&&t.shiftKey)&&[38,40].indexOf(t.keyCode)>=0){t.preventDefault();const e=this.getSelection();let s=this.getLines();if(e){let i,n,r=this.getLineNr(e.start)-1,o=this.getLineNr(e.end)-1;if(38===t.keyCode){if(r>0){for(let t=r;t<=o;t++)s=this.lineUp(s,t);r--,o--}}else if(40===t.keyCode&&o<s.length-1){for(let t=o;t>=r;t--)s=this.lineDown(s,t);r++,o++}i=s.slice(0,r).join("\n").length,n=s.slice(0,o+1).join("\n").length,i>0&&i++,this.value=s.join("\n"),this.setCursor(i,n)}else{const e=this.getLineNr()-1,i=this.getCursor();let n=i;38===t.keyCode?e>0&&(s=this.lineUp(s,e),n=i-s[e].length-1):40===t.keyCode&&e<s.length-1&&(s=this.lineDown(s,e),n=i+s[e].length+1),this.value=s.join("\n"),this.setCursor(n)}}}duplicateLine(t){if(t.shiftKey&&(this.isMac&&t.metaKey||this.isWin&&t.ctrlKey)&&68===t.keyCode){t.preventDefault();const e=this.getSelection();let s=this.getLines();if(e){let t,i,n=this.getLineNr(e.start)-1,r=this.getLineNr(e.end)-1,o=r-n+1,h=r;for(let t=n;t<=r;t++)h++,s.splice(h,0,s[t]);t=s.slice(0,n+o).join("\n").length,i=s.slice(0,r+o+1).join("\n").length,t>0&&t++,this.value=s.join("\n"),this.setCursor(t,i)}else{const t=this.getLineNr()-1,e=this.getCursor();let i=e;s.splice(t+1,0,s[t]),i=e+s[t].length+1,this.value=s.join("\n"),this.setCursor(i)}}}openedChar(t,e){e.preventDefault(),this.callHook("openChar:before");const s=this.getCursor(),i=this.value.substring(0,s),n=this.value.substring(s);this.value=`${i}${t.open}${t.close}${n}`,this.setCursor(s+1),this.callHook("openChar:after")}closedChar(t,e){const s=this.getCursor();return this.value.substring(s,s+1)===t.close&&(e.preventDefault(),this.callHook("closeChar:before"),this.setCursor(s+1),this.callHook("closeChar:after"),!0)}filter(t){for(let s of e)if(s.close==t.key){!(this.options.overwrite&&this.closedChar(s,t))&&s.open===t.key&&this.options.autoOpen&&this.openedChar(s,t)}else s.open===t.key&&this.options.autoOpen&&this.openedChar(s,t)}addEvent(t,e){return this.textarea.addEventListener(t,e,!1),this}removeEvent(t,e){return this.textarea.removeEventListener(t,e,!1),this}listen(){this.listeners={keydown:[],keypress:[],keyup:[],input:[]},this.options.replaceTab&&this.listeners.keydown.push(this.tabKey.bind(this)),this.options.autoIndent&&this.listeners.keydown.push(this.enterKey.bind(this)),this.options.autoStrip&&this.listeners.keydown.push(this.deleteKey.bind(this)),this.options.continueList&&this.listeners.keydown.push(this.enterKeyList.bind(this)),this.options.moveLine&&this.listeners.keydown.push(this.moveLine.bind(this)),this.options.duplicateLine&&this.listeners.keydown.push(this.duplicateLine.bind(this)),this.listeners.keypress.push(this.filter.bind(this)),this.listeners.keydown.push((t=>{this.callHook("keydown",t)})),this.listeners.keyup.push((t=>{this.callHook("keyup",t)})),this.listeners.input.push((t=>{this.callHook("input",t)}));for(let t of Object.keys(this.listeners)){const e=this.listeners[t];for(let s of e)this.addEvent(t,s)}return this}defineTabSize(t){return this.textarea.style[this.prefix("tab-size")]=t,this}defineNewLine(){const t=document.createElement("textarea");return t.value="\n",this.newLine=2===t.value.length?"\r\n":"\n",this}lineUp(t=this.getLines(),e=0){if(e>0){const s=t[e],i=t[e-1];t[e]=i,t[e-1]=s}return t}lineDown(t=this.getLines(),e=0){if(e<t.length-1){const s=t[e],i=t[e+1];t[e]=i,t[e+1]=s}return t}prefix(t,e,s,i){for(i?i=e.toUpperCase():e=4;!i&&e--;i=(i=i.replace(/-(.)/g,this.prefix))in(new Image).style&&i)i=[["Moz-","Webkit-","Ms-","O-"][e]]+t;return i||t}init(){return this.isMac=/(Mac)/gi.test(navigator.platform),this.isWin=/(Win)/gi.test(navigator.platform),this.textarea&&(this.callHook("init:before"),this.defineNewLine(),this.options.softTabs?this.tab=" ".repeat(this.options.tabSize):(this.tab="\t",this.defineTabSize(this.options.tabSize)),this.listen(),this.callHook("init:after")),this}destroy(){this.callHook("destroy:before");for(let t of Object.keys(this.listeners)){const e=this.listeners[t];for(let s of e)this.removeEvent(t,s)}return this.callHook("destroy:before"),this}}module.exports=i;
