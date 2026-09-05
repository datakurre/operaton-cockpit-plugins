function ___$insertStylesToHeader(css) {
  if (!css) {
    return
  }
  if (typeof window === 'undefined') {
    return
  }

  const style = document.createElement('style');

  style.setAttribute('type', 'text/css');
  style.innerHTML = css;
  document.head.appendChild(style);
  return css
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

___$insertStylesToHeader(":root {\n  --separator-border: rgba(128, 128, 128, 0.35);\n  --sash-hover-transition-duration: 0.1s;\n}\n\n.allotment-module_splitView__L-yRc {\n  height: 100%;\n  overflow: hidden;\n  position: relative;\n  width: 100%;\n}\n\n.allotment-module_splitView__L-yRc > .allotment-module_sashContainer__fzwJF {\n  height: 100%;\n  pointer-events: none;\n  position: absolute;\n  width: 100%;\n}\n\n.allotment-module_splitView__L-yRc > .allotment-module_sashContainer__fzwJF > .allotment-module_sash__QA-2t {\n  pointer-events: auto;\n}\n\n.allotment-module_splitView__L-yRc > .allotment-module_splitViewContainer__rQnVa {\n  height: 100%;\n  position: relative;\n  white-space: nowrap;\n  width: 100%;\n}\n\n.allotment-module_splitView__L-yRc > .allotment-module_splitViewContainer__rQnVa > .allotment-module_splitViewView__MGZ6O {\n  overflow: hidden;\n  position: absolute;\n  white-space: initial;\n}\n\n.allotment-module_splitView__L-yRc.allotment-module_vertical__WSwwa > .allotment-module_splitViewContainer__rQnVa > .allotment-module_splitViewView__MGZ6O {\n  width: 100%;\n}\n\n.allotment-module_splitView__L-yRc.allotment-module_horizontal__7doS8 > .allotment-module_splitViewContainer__rQnVa > .allotment-module_splitViewView__MGZ6O {\n  height: 100%;\n}\n\n.allotment-module_splitView__L-yRc.allotment-module_separatorBorder__x-rDS > .allotment-module_splitViewContainer__rQnVa > .allotment-module_splitViewView__MGZ6O:not(:first-child)::before {\n  background-color: var(--separator-border);\n  content: \" \";\n  left: 0;\n  pointer-events: none;\n  position: absolute;\n  top: 0;\n  z-index: 5;\n}\n\n.allotment-module_splitView__L-yRc.allotment-module_separatorBorder__x-rDS.allotment-module_vertical__WSwwa > .allotment-module_splitViewContainer__rQnVa > .allotment-module_splitViewView__MGZ6O:not(:first-child)::before {\n  height: 1px;\n  width: 100%;\n}\n\n.allotment-module_splitView__L-yRc.allotment-module_separatorBorder__x-rDS.allotment-module_horizontal__7doS8 > .allotment-module_splitViewContainer__rQnVa > .allotment-module_splitViewView__MGZ6O:not(:first-child)::before {\n  height: 100%;\n  width: 1px;\n}\n\n:root {\n  --focus-border: #007fd4;\n  --sash-size: 8px;\n  --sash-hover-size: 4px;\n}\n\n.sash-module_sash__K-9lB {\n  position: absolute;\n  z-index: 35;\n  touch-action: none;\n  pointer-events: auto;\n  text-align: initial;\n}\n\n.sash-module_sash__K-9lB.sash-module_disabled__Hm-wx {\n  pointer-events: none;\n}\n\n.sash-module_sash__K-9lB.sash-module_mac__Jf6OJ.sash-module_vertical__pB-rs {\n  cursor: col-resize;\n}\n\n.sash-module_sash__K-9lB.sash-module_vertical__pB-rs.sash-module_minimum__-UKxp {\n  cursor: e-resize;\n}\n\n.sash-module_sash__K-9lB.sash-module_vertical__pB-rs.sash-module_maximum__TCWxD {\n  cursor: w-resize;\n}\n\n.sash-module_sash__K-9lB.sash-module_mac__Jf6OJ.sash-module_horizontal__kFbiw {\n  cursor: row-resize;\n}\n\n.sash-module_sash__K-9lB.sash-module_horizontal__kFbiw.sash-module_minimum__-UKxp {\n  cursor: s-resize;\n}\n\n.sash-module_sash__K-9lB.sash-module_horizontal__kFbiw.sash-module_maximum__TCWxD {\n  cursor: n-resize;\n}\n\n.sash-module_sash__K-9lB.sash-module_disabled__Hm-wx {\n  cursor: default !important;\n  pointer-events: none !important;\n}\n\n.sash-module_sash__K-9lB.sash-module_vertical__pB-rs {\n  cursor: ew-resize;\n  top: 0;\n  width: var(--sash-size);\n  height: 100%;\n}\n\n.sash-module_sash__K-9lB.sash-module_horizontal__kFbiw {\n  cursor: ns-resize;\n  left: 0;\n  width: 100%;\n  height: var(--sash-size);\n}\n\n.sash-module_sash__K-9lB:not(.sash-module_disabled__Hm-wx) > .sash-module_orthogonal-drag-handle__Yii2- {\n  content: \" \";\n  height: calc(var(--sash-size) * 2);\n  width: calc(var(--sash-size) * 2);\n  z-index: 100;\n  display: block;\n  cursor: all-scroll;\n  position: absolute;\n}\n\n.sash-module_sash__K-9lB.sash-module_horizontal__kFbiw.sash-module_orthogonal-edge-north__f7Noe:not(.sash-module_disabled__Hm-wx) > .sash-module_orthogonal-drag-handle__Yii2-.sash-module_start__uZEDk,\n.sash-module_sash__K-9lB.sash-module_horizontal__kFbiw.sash-module_orthogonal-edge-south__6ZrFC:not(.sash-module_disabled__Hm-wx) > .sash-module_orthogonal-drag-handle__Yii2-.sash-module_end__0TP-R {\n  cursor: nwse-resize;\n}\n\n.sash-module_sash__K-9lB.sash-module_horizontal__kFbiw.sash-module_orthogonal-edge-north__f7Noe:not(.sash-module_disabled__Hm-wx) > .sash-module_orthogonal-drag-handle__Yii2-.sash-module_end__0TP-R,\n.sash-module_sash__K-9lB.sash-module_horizontal__kFbiw.sash-module_orthogonal-edge-south__6ZrFC:not(.sash-module_disabled__Hm-wx) > .sash-module_orthogonal-drag-handle__Yii2-.sash-module_start__uZEDk {\n  cursor: nesw-resize;\n}\n\n.sash-module_sash__K-9lB.sash-module_vertical__pB-rs > .sash-module_orthogonal-drag-handle__Yii2-.sash-module_start__uZEDk {\n  left: calc(var(--sash-size) * -0.5);\n  top: calc(var(--sash-size) * -1);\n}\n\n.sash-module_sash__K-9lB.sash-module_vertical__pB-rs > .sash-module_orthogonal-drag-handle__Yii2-.sash-module_end__0TP-R {\n  left: calc(var(--sash-size) * -0.5);\n  bottom: calc(var(--sash-size) * -1);\n}\n\n.sash-module_sash__K-9lB.sash-module_horizontal__kFbiw > .sash-module_orthogonal-drag-handle__Yii2-.sash-module_start__uZEDk {\n  top: calc(var(--sash-size) * -0.5);\n  left: calc(var(--sash-size) * -1);\n}\n\n.sash-module_sash__K-9lB.sash-module_horizontal__kFbiw > .sash-module_orthogonal-drag-handle__Yii2-.sash-module_end__0TP-R {\n  top: calc(var(--sash-size) * -0.5);\n  right: calc(var(--sash-size) * -1);\n}\n\n.sash-module_sash__K-9lB:before {\n  content: \"\";\n  pointer-events: none;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  transition: background-color var(--sash-hover-transition-duration) ease-out;\n  background: transparent;\n}\n\n.sash-module_sash__K-9lB.sash-module_vertical__pB-rs:before {\n  width: var(--sash-hover-size);\n  left: calc(50% - var(--sash-hover-size) / 2);\n}\n\n.sash-module_sash__K-9lB.sash-module_horizontal__kFbiw:before {\n  height: var(--sash-hover-size);\n  top: calc(50% - var(--sash-hover-size) / 2);\n}\n\n.sash-module_sash__K-9lB.sash-module_hover__80W6I:before,\n.sash-module_sash__K-9lB.sash-module_active__bJspD:before {\n  background: var(--focus-border);\n}");

___$insertStylesToHeader("/**\n * Admin Route Authorization Styles\n *\n * Layout styles matching instance-route-history pattern:\n * - Uses Allotment for resizable two-panel layout\n * - Left pane: Resource type list\n * - Right pane: Authorization table\n */\n/**\n * Shared Resizable Layout Styles\n *\n * Common styles for Allotment-based resizable layouts used across plugins.\n * Used by: instance-route-history.scss, admin-route-authorization.scss\n */\n.Pane.vertical.Pane1 {\n  border-right: 1px solid #ddd;\n}\n\n.Resizer {\n  background: rgba(255, 255, 255, 0);\n  opacity: 0.2;\n  z-index: 1;\n  -moz-box-sizing: border-box;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  -moz-background-clip: padding;\n  -webkit-background-clip: padding;\n  background-clip: padding-box;\n}\n\n.Resizer:hover {\n  -webkit-transition: all 2s ease;\n  transition: all 2s ease;\n}\n\n.Resizer.horizontal {\n  height: 11px;\n  margin: -5px 0;\n  border-top: 5px solid rgba(255, 255, 255, 0);\n  border-bottom: 5px solid rgba(255, 255, 255, 0);\n  cursor: row-resize;\n  width: 100%;\n}\n\n.Resizer.horizontal:hover {\n  border-top: 5px solid rgba(0, 0, 0, 0.5);\n  border-bottom: 5px solid rgba(0, 0, 0, 0.5);\n}\n\n.Resizer.vertical {\n  width: 11px;\n  margin: 0 -5px;\n  border-left: 5px solid rgba(255, 255, 255, 0);\n  border-right: 5px solid rgba(255, 255, 255, 0);\n  cursor: col-resize;\n}\n\n.Resizer.vertical:hover {\n  border-left: 5px solid rgba(0, 0, 0, 0.5);\n  border-right: 5px solid rgba(0, 0, 0, 0.5);\n}\n\n.Resizer.disabled {\n  cursor: not-allowed;\n}\n\n.Resizer.disabled:hover {\n  border-color: transparent;\n}\n\n.ctn-main .breadcrumbs-panel {\n  margin-top: 0;\n}\n\n.ctn-content-container {\n  height: 100%;\n}\n\n.resource-type-list {\n  height: 100%;\n  overflow-y: auto;\n  background: #f8f8f8;\n}\n.resource-type-list ul {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n}\n.resource-type-list ul li {\n  border-bottom: 1px solid #eee;\n}\n.resource-type-list ul li a {\n  display: block;\n  padding: 10px 15px;\n  color: #333;\n  text-decoration: none;\n}\n.resource-type-list ul li a:hover {\n  background: #eee;\n}\n.resource-type-list ul li.active {\n  background: #fff;\n  border-left: 3px solid #b5152b;\n}\n.resource-type-list ul li.active a {\n  font-weight: bold;\n  color: #b5152b;\n}\n\n.authorization-content {\n  height: 100%;\n  overflow-y: auto;\n  padding: 15px;\n}\n.authorization-content header {\n  margin-bottom: 15px;\n}\n.authorization-content header h3 {\n  margin: 0 0 10px 0;\n}\n.authorization-content .cam-table {\n  width: 100%;\n}\n.authorization-content .cam-table th,\n.authorization-content .cam-table td {\n  padding: 8px 12px;\n  vertical-align: middle;\n}\n.authorization-content .cam-table .authorization-type {\n  width: 100px;\n}\n.authorization-content .cam-table .user.group {\n  width: 150px;\n}\n.authorization-content .cam-table .permissions {\n  max-width: 300px;\n}\n.authorization-content .cam-table .resource-id {\n  width: 150px;\n}\n.authorization-content .cam-table .action {\n  width: 120px;\n  white-space: nowrap;\n}\n.authorization-content .cam-table .action a {\n  cursor: pointer;\n}\n\n.identity-autocomplete-suggestions {\n  position: absolute;\n  top: 100%;\n  left: 0;\n  right: 0;\n  z-index: 1000;\n  background: #fff;\n  border: 1px solid #ccc;\n  border-top: none;\n  max-height: 200px;\n  overflow-y: auto;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n}\n.identity-autocomplete-suggestions .suggestion-item {\n  padding: 8px 12px;\n  cursor: pointer;\n}\n.identity-autocomplete-suggestions .suggestion-item:hover, .identity-autocomplete-suggestions .suggestion-item.selected {\n  background: #e8f4f8;\n}\n.identity-autocomplete-suggestions .suggestion-item:active {\n  background: #d0e9f2;\n}\n\n.resource-autocomplete-suggestions {\n  position: absolute;\n  top: 100%;\n  left: 0;\n  right: 0;\n  z-index: 1000;\n  background: #fff;\n  border: 1px solid #ccc;\n  border-top: none;\n  max-height: 200px;\n  overflow-y: auto;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n}\n.resource-autocomplete-suggestions .suggestion-item {\n  padding: 8px 12px;\n  cursor: pointer;\n}\n.resource-autocomplete-suggestions .suggestion-item:hover, .resource-autocomplete-suggestions .suggestion-item.selected {\n  background: #e8f4f8;\n}\n.resource-autocomplete-suggestions .suggestion-item:active {\n  background: #d0e9f2;\n}\n\n.permissions-grid {\n  max-height: 300px;\n  overflow-y: auto;\n  border: 1px solid #ddd;\n  padding: 10px;\n  border-radius: 4px;\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));\n  gap: 5px 10px;\n}\n.permissions-grid .permission-item {\n  margin: 0;\n}\n.permissions-grid .permission-item label {\n  display: block;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.authorization-content .cam-table .action-link {\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n}\n.authorization-content .cam-table .action-link.action-edit {\n  margin-right: 10px;\n}\n.authorization-content .cam-table .action-link.action-clone {\n  margin-right: 10px;\n}\n.authorization-content .cam-table .action-link.action-delete {\n  color: #c00;\n}\n.authorization-content .cam-table th {\n  position: relative;\n}\n.authorization-content .cam-table th.sortable {\n  cursor: pointer;\n}\n.authorization-content .cam-table th .sort-icon-wrapper {\n  position: absolute;\n  font-size: 125%;\n  margin-left: 4px;\n}\n.authorization-content .cam-table th .sort-icon {\n  color: #155cb5;\n}\n\n.filter-controls {\n  margin-bottom: 15px;\n}\n.filter-controls .page-size-label {\n  margin-right: 10px;\n  display: inline-block;\n}\n.filter-controls .page-size-label select {\n  width: auto;\n  display: inline-block;\n  margin-left: 5px;\n}\n\n.btn-group-flex {\n  display: flex;\n}\n\n.permission-actions {\n  margin-bottom: 5px;\n}\n.permission-actions .btn + .btn {\n  margin-left: 5px;\n}\n\n.create-btn-icon {\n  margin-left: 5px;\n}\n\n.ctn-main.authorization-view {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n}");

___$insertStylesToHeader(".toggle-auto-refresh-button,\n.toggle-history-view-button,\n.toggle-history-statistics-button,\n.toggle-sequence-flow-button,\n.zoom-in-button,\n.zoom-out-button,\n.reset-zoom-button {\n  background: #ffffff;\n  border-radius: 2px;\n  border: 1px solid #cccccc;\n  padding: 0;\n  width: 30px;\n  height: 30px;\n  display: flex;\n  margin-bottom: 15px;\n  align-items: center;\n  justify-content: center;\n}\n.toggle-auto-refresh-button:hover,\n.toggle-history-view-button:hover,\n.toggle-history-statistics-button:hover,\n.toggle-sequence-flow-button:hover,\n.zoom-in-button:hover,\n.zoom-out-button:hover,\n.reset-zoom-button:hover {\n  background: #e6e6e6;\n}\n\n/**\n * Container for positioning buttons inside BPMN viewer.\n * Used to group toggle buttons (sequence flow, history view, etc.) \n * in a consistent position on the diagram.\n */\n.viewer-button-container {\n  position: absolute;\n  right: 15px;\n  display: flex;\n  flex-direction: column;\n  z-index: 10;\n}\n.viewer-button-container--top {\n  top: 15px;\n}\n.viewer-button-container--top-60 {\n  top: 60px;\n}\n.viewer-button-container--bottom {\n  bottom: 15px;\n}\n.viewer-button-container--bottom-120 {\n  bottom: 120px;\n}");

___$insertStylesToHeader(".ReactModal__Html--open,\n.ReactModal__Body--open {\n  overflow: hidden; /* prevents background page from scrolling when the modal is open */\n}\n\n.ReactModal__Overlay {\n  position: fixed;\n  z-index: 999999;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.ReactModal__Content {\n  background: white;\n  width: 50rem;\n  max-width: calc(100vw - 2rem);\n  max-height: calc(100vh - 2rem);\n  box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.25);\n  overflow-y: auto;\n  position: relative;\n}\n\n.modal-close-btn {\n  cursor: pointer;\n  top: 1.5rem;\n  right: 1.5rem;\n  position: absolute;\n  width: 3rem;\n  height: 3rem;\n}\n\n/* Bootstrap-style modal backdrop for React components */\n.modal-backdrop {\n  position: fixed;\n  z-index: 999998;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  overflow: hidden;\n}\n\n.modal-dialog {\n  background: white;\n  width: 600px;\n  max-width: calc(100vw - 2rem);\n  max-height: calc(100vh - 4rem);\n  border-radius: 4px;\n  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n\n.modal-content {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  max-height: inherit;\n  overflow-y: scroll;\n}\n\n.modal-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 15px;\n  border-bottom: 1px solid #e5e5e5;\n  background: #f5f5f5;\n  flex-shrink: 0;\n}\n.modal-header .modal-title {\n  margin: 0;\n  font-size: 18px;\n  font-weight: 500;\n  flex: 1;\n  text-align: left;\n}\n.modal-header .close {\n  background: none;\n  border: none;\n  font-size: 24px;\n  line-height: 1;\n  cursor: pointer;\n  padding: 0;\n  margin-left: 15px;\n  opacity: 0.5;\n  flex-shrink: 0;\n}\n.modal-header .close:hover {\n  opacity: 1;\n}\n\n.modal-body {\n  padding: 15px;\n  overflow-y: auto;\n  flex: 1 1 auto;\n}\n.modal-body .form-group {\n  margin-bottom: 15px;\n}\n.modal-body .form-group label {\n  display: block;\n  margin-bottom: 5px;\n  font-weight: 500;\n}\n.modal-body .form-group .form-control {\n  width: 100%;\n  padding: 6px 12px;\n  font-size: 14px;\n  border: 1px solid #ccc;\n  border-radius: 4px;\n  box-sizing: border-box;\n}\n.modal-body .form-group .form-control:focus {\n  border-color: #66afe9;\n  outline: none;\n  box-shadow: 0 0 0 2px rgba(102, 175, 233, 0.25);\n}\n.modal-body .form-group .text-muted {\n  color: #777;\n  font-size: 12px;\n  margin-top: 5px;\n}\n.modal-body .checkbox label {\n  font-weight: normal;\n  cursor: pointer;\n}\n.modal-body .checkbox input[type=checkbox] {\n  margin-right: 5px;\n}\n.modal-body .dl-horizontal dt {\n  float: left;\n  width: 100px;\n  clear: left;\n  text-align: right;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-weight: 600;\n}\n.modal-body .dl-horizontal dd {\n  margin-left: 120px;\n  margin-bottom: 5px;\n}\n\n.modal-footer {\n  padding: 15px;\n  border-top: 1px solid #e5e5e5;\n  background: #f5f5f5;\n  text-align: right;\n  display: flex;\n  justify-content: flex-end;\n  gap: 10px;\n  flex-shrink: 0;\n}");

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var react = {exports: {}};

var react_production_min = {};

/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReact_production_min;

function requireReact_production_min () {
	if (hasRequiredReact_production_min) return react_production_min;
	hasRequiredReact_production_min = 1;
var l=Symbol.for("react.element"),n=Symbol.for("react.portal"),p=Symbol.for("react.fragment"),q=Symbol.for("react.strict_mode"),r=Symbol.for("react.profiler"),t=Symbol.for("react.provider"),u=Symbol.for("react.context"),v=Symbol.for("react.forward_ref"),w=Symbol.for("react.suspense"),x=Symbol.for("react.memo"),y=Symbol.for("react.lazy"),z=Symbol.iterator;function A(a){if(null===a||"object"!==typeof a)return null;a=z&&a[z]||a["@@iterator"];return "function"===typeof a?a:null}
	var B={isMounted:function(){return  false},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},C=Object.assign,D={};function E(a,b,e){this.props=a;this.context=b;this.refs=D;this.updater=e||B;}E.prototype.isReactComponent={};
	E.prototype.setState=function(a,b){if("object"!==typeof a&&"function"!==typeof a&&null!=a)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,a,b,"setState");};E.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,"forceUpdate");};function F(){}F.prototype=E.prototype;function G(a,b,e){this.props=a;this.context=b;this.refs=D;this.updater=e||B;}var H=G.prototype=new F;
	H.constructor=G;C(H,E.prototype);H.isPureReactComponent=true;var I=Array.isArray,J=Object.prototype.hasOwnProperty,K={current:null},L={key:true,ref:true,__self:true,__source:true};
	function M(a,b,e){var d,c={},k=null,h=null;if(null!=b)for(d in void 0!==b.ref&&(h=b.ref),void 0!==b.key&&(k=""+b.key),b)J.call(b,d)&&!L.hasOwnProperty(d)&&(c[d]=b[d]);var g=arguments.length-2;if(1===g)c.children=e;else if(1<g){for(var f=Array(g),m=0;m<g;m++)f[m]=arguments[m+2];c.children=f;}if(a&&a.defaultProps)for(d in g=a.defaultProps,g) void 0===c[d]&&(c[d]=g[d]);return {$$typeof:l,type:a,key:k,ref:h,props:c,_owner:K.current}}
	function N(a,b){return {$$typeof:l,type:a.type,key:b,ref:a.ref,props:a.props,_owner:a._owner}}function O(a){return "object"===typeof a&&null!==a&&a.$$typeof===l}function escape(a){var b={"=":"=0",":":"=2"};return "$"+a.replace(/[=:]/g,function(a){return b[a]})}var P=/\/+/g;function Q(a,b){return "object"===typeof a&&null!==a&&null!=a.key?escape(""+a.key):b.toString(36)}
	function R(a,b,e,d,c){var k=typeof a;if("undefined"===k||"boolean"===k)a=null;var h=false;if(null===a)h=true;else switch(k){case "string":case "number":h=true;break;case "object":switch(a.$$typeof){case l:case n:h=true;}}if(h)return h=a,c=c(h),a=""===d?"."+Q(h,0):d,I(c)?(e="",null!=a&&(e=a.replace(P,"$&/")+"/"),R(c,b,e,"",function(a){return a})):null!=c&&(O(c)&&(c=N(c,e+(!c.key||h&&h.key===c.key?"":(""+c.key).replace(P,"$&/")+"/")+a)),b.push(c)),1;h=0;d=""===d?".":d+":";if(I(a))for(var g=0;g<a.length;g++){k=
	a[g];var f=d+Q(k,g);h+=R(k,b,e,f,c);}else if(f=A(a),"function"===typeof f)for(a=f.call(a),g=0;!(k=a.next()).done;)k=k.value,f=d+Q(k,g++),h+=R(k,b,e,f,c);else if("object"===k)throw b=String(a),Error("Objects are not valid as a React child (found: "+("[object Object]"===b?"object with keys {"+Object.keys(a).join(", ")+"}":b)+"). If you meant to render a collection of children, use an array instead.");return h}
	function S(a,b,e){if(null==a)return a;var d=[],c=0;R(a,d,"","",function(a){return b.call(e,a,c++)});return d}function T(a){if(-1===a._status){var b=a._result;b=b();b.then(function(b){if(0===a._status||-1===a._status)a._status=1,a._result=b;},function(b){if(0===a._status||-1===a._status)a._status=2,a._result=b;});-1===a._status&&(a._status=0,a._result=b);}if(1===a._status)return a._result.default;throw a._result;}
	var U={current:null},V={transition:null},W={ReactCurrentDispatcher:U,ReactCurrentBatchConfig:V,ReactCurrentOwner:K};function X(){throw Error("act(...) is not supported in production builds of React.");}
	react_production_min.Children={map:S,forEach:function(a,b,e){S(a,function(){b.apply(this,arguments);},e);},count:function(a){var b=0;S(a,function(){b++;});return b},toArray:function(a){return S(a,function(a){return a})||[]},only:function(a){if(!O(a))throw Error("React.Children.only expected to receive a single React element child.");return a}};react_production_min.Component=E;react_production_min.Fragment=p;react_production_min.Profiler=r;react_production_min.PureComponent=G;react_production_min.StrictMode=q;react_production_min.Suspense=w;
	react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=W;react_production_min.act=X;
	react_production_min.cloneElement=function(a,b,e){if(null===a||void 0===a)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+a+".");var d=C({},a.props),c=a.key,k=a.ref,h=a._owner;if(null!=b){ void 0!==b.ref&&(k=b.ref,h=K.current);void 0!==b.key&&(c=""+b.key);if(a.type&&a.type.defaultProps)var g=a.type.defaultProps;for(f in b)J.call(b,f)&&!L.hasOwnProperty(f)&&(d[f]=void 0===b[f]&&void 0!==g?g[f]:b[f]);}var f=arguments.length-2;if(1===f)d.children=e;else if(1<f){g=Array(f);
	for(var m=0;m<f;m++)g[m]=arguments[m+2];d.children=g;}return {$$typeof:l,type:a.type,key:c,ref:k,props:d,_owner:h}};react_production_min.createContext=function(a){a={$$typeof:u,_currentValue:a,_currentValue2:a,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null};a.Provider={$$typeof:t,_context:a};return a.Consumer=a};react_production_min.createElement=M;react_production_min.createFactory=function(a){var b=M.bind(null,a);b.type=a;return b};react_production_min.createRef=function(){return {current:null}};
	react_production_min.forwardRef=function(a){return {$$typeof:v,render:a}};react_production_min.isValidElement=O;react_production_min.lazy=function(a){return {$$typeof:y,_payload:{_status:-1,_result:a},_init:T}};react_production_min.memo=function(a,b){return {$$typeof:x,type:a,compare:void 0===b?null:b}};react_production_min.startTransition=function(a){var b=V.transition;V.transition={};try{a();}finally{V.transition=b;}};react_production_min.unstable_act=X;react_production_min.useCallback=function(a,b){return U.current.useCallback(a,b)};react_production_min.useContext=function(a){return U.current.useContext(a)};
	react_production_min.useDebugValue=function(){};react_production_min.useDeferredValue=function(a){return U.current.useDeferredValue(a)};react_production_min.useEffect=function(a,b){return U.current.useEffect(a,b)};react_production_min.useId=function(){return U.current.useId()};react_production_min.useImperativeHandle=function(a,b,e){return U.current.useImperativeHandle(a,b,e)};react_production_min.useInsertionEffect=function(a,b){return U.current.useInsertionEffect(a,b)};react_production_min.useLayoutEffect=function(a,b){return U.current.useLayoutEffect(a,b)};
	react_production_min.useMemo=function(a,b){return U.current.useMemo(a,b)};react_production_min.useReducer=function(a,b,e){return U.current.useReducer(a,b,e)};react_production_min.useRef=function(a){return U.current.useRef(a)};react_production_min.useState=function(a){return U.current.useState(a)};react_production_min.useSyncExternalStore=function(a,b,e){return U.current.useSyncExternalStore(a,b,e)};react_production_min.useTransition=function(){return U.current.useTransition()};react_production_min.version="18.3.1";
	return react_production_min;
}

var hasRequiredReact;

function requireReact () {
	if (hasRequiredReact) return react.exports;
	hasRequiredReact = 1;

	{
	  react.exports = requireReact_production_min();
	}
	return react.exports;
}

var reactExports = requireReact();
var React = /*@__PURE__*/getDefaultExportFromCjs(reactExports);

function _extends$1() { return _extends$1 = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends$1.apply(null, arguments); }
var l = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};
function u(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var c,
  m = {
    exports: {}
  };
/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/
var d,
  f,
  p,
  v = (c || (c = 1, d = m, function () {
    var e = {}.hasOwnProperty;
    function t() {
      for (var e = "", t = 0; t < arguments.length; t++) {
        var n = arguments[t];
        n && (e = s(e, i(n)));
      }
      return e;
    }
    function i(i) {
      if ("string" == typeof i || "number" == typeof i) return i;
      if ("object" != typeof i) return "";
      if (Array.isArray(i)) return t.apply(null, i);
      if (i.toString !== Object.prototype.toString && !i.toString.toString().includes("[native code]")) return i.toString();
      var n = "";
      for (var r in i) e.call(i, r) && i[r] && (n = s(n, r));
      return n;
    }
    function s(e, t) {
      return t ? e ? e + " " + t : e + t : e;
    }
    d.exports ? (t.default = t, d.exports = t) : window.classNames = t;
  }()), m.exports),
  S = u(v);
var z,
  w,
  g = (p || (p = 1, f = function e(t, i) {
    if (t === i) return true;
    if (t && i && "object" == typeof t && "object" == typeof i) {
      if (t.constructor !== i.constructor) return false;
      var s, n, r;
      if (Array.isArray(t)) {
        if ((s = t.length) != i.length) return false;
        for (n = s; 0 !== n--;) if (!e(t[n], i[n])) return false;
        return true;
      }
      if (t instanceof Map && i instanceof Map) {
        if (t.size !== i.size) return false;
        for (n of t.entries()) if (!i.has(n[0])) return false;
        for (n of t.entries()) if (!e(n[1], i.get(n[0]))) return false;
        return true;
      }
      if (t instanceof Set && i instanceof Set) {
        if (t.size !== i.size) return false;
        for (n of t.entries()) if (!i.has(n[0])) return false;
        return true;
      }
      if (ArrayBuffer.isView(t) && ArrayBuffer.isView(i)) {
        if ((s = t.length) != i.length) return false;
        for (n = s; 0 !== n--;) if (t[n] !== i[n]) return false;
        return true;
      }
      if (t.constructor === RegExp) return t.source === i.source && t.flags === i.flags;
      if (t.valueOf !== Object.prototype.valueOf) return t.valueOf() === i.valueOf();
      if (t.toString !== Object.prototype.toString) return t.toString() === i.toString();
      if ((s = (r = Object.keys(t)).length) !== Object.keys(i).length) return false;
      for (n = s; 0 !== n--;) if (!Object.prototype.hasOwnProperty.call(i, r[n])) return false;
      for (n = s; 0 !== n--;) {
        var o = r[n];
        if (!e(t[o], i[o])) return false;
      }
      return true;
    }
    return t != t && i != i;
  }), f),
  y = u(g);
var b,
  I,
  x = u(function () {
    if (w) return z;
    w = 1;
    var e = /^\s+|\s+$/g,
      t = /^[-+]0x[0-9a-f]+$/i,
      i = /^0b[01]+$/i,
      s = /^0o[0-7]+$/i,
      n = parseInt,
      r = Object.prototype.toString;
    function o(e) {
      var t = typeof e;
      return !!e && ("object" == t || "function" == t);
    }
    function a(a) {
      if ("number" == typeof a) return a;
      if (function (e) {
        return "symbol" == typeof e || function (e) {
          return !!e && "object" == typeof e;
        }(e) && "[object Symbol]" == r.call(e);
      }(a)) return NaN;
      if (o(a)) {
        var h = "function" == typeof a.valueOf ? a.valueOf() : a;
        a = o(h) ? h + "" : h;
      }
      if ("string" != typeof a) return 0 === a ? a : +a;
      a = a.replace(e, "");
      var l = i.test(a);
      return l || s.test(a) ? n(a.slice(2), l ? 2 : 8) : t.test(a) ? NaN : +a;
    }
    return z = function (e, t, i) {
      return void 0 === i && (i = t, t = void 0), void 0 !== i && (i = (i = a(i)) == i ? i : 0), void 0 !== t && (t = (t = a(t)) == t ? t : 0), function (e, t, i) {
        return e == e && (void 0 !== i && (e = e <= i ? e : i), void 0 !== t && (e = e >= t ? e : t)), e;
      }(a(e), t, i);
    };
  }());
var _ = u(function () {
  if (I) return b;
  I = 1;
  var e = /^\s+|\s+$/g,
    t = /^[-+]0x[0-9a-f]+$/i,
    i = /^0b[01]+$/i,
    s = /^0o[0-7]+$/i,
    n = parseInt,
    r = "object" == typeof l && l && l.Object === Object && l,
    o = "object" == typeof self && self && self.Object === Object && self,
    a = r || o || Function("return this")(),
    h = Object.prototype.toString,
    u = Math.max,
    c = Math.min,
    m = function m() {
      return a.Date.now();
    };
  function d(e) {
    var t = typeof e;
    return !!e && ("object" == t || "function" == t);
  }
  function f(r) {
    if ("number" == typeof r) return r;
    if (function (e) {
      return "symbol" == typeof e || function (e) {
        return !!e && "object" == typeof e;
      }(e) && "[object Symbol]" == h.call(e);
    }(r)) return NaN;
    if (d(r)) {
      var o = "function" == typeof r.valueOf ? r.valueOf() : r;
      r = d(o) ? o + "" : o;
    }
    if ("string" != typeof r) return 0 === r ? r : +r;
    r = r.replace(e, "");
    var a = i.test(r);
    return a || s.test(r) ? n(r.slice(2), a ? 2 : 8) : t.test(r) ? NaN : +r;
  }
  return b = function (e, t, i) {
    var s,
      n,
      r,
      o,
      a,
      h,
      l = 0,
      p = false,
      v = false,
      S = true;
    if ("function" != typeof e) throw new TypeError("Expected a function");
    function z(t) {
      var i = s,
        r = n;
      return s = n = void 0, l = t, o = e.apply(r, i);
    }
    function w(e) {
      var i = e - h;
      return void 0 === h || i >= t || i < 0 || v && e - l >= r;
    }
    function g() {
      var e = m();
      if (w(e)) return y(e);
      a = setTimeout(g, function (e) {
        var i = t - (e - h);
        return v ? c(i, r - (e - l)) : i;
      }(e));
    }
    function y(e) {
      return a = void 0, S && s ? z(e) : (s = n = void 0, o);
    }
    function b() {
      var e = m(),
        i = w(e);
      if (s = arguments, n = this, h = e, i) {
        if (void 0 === a) return function (e) {
          return l = e, a = setTimeout(g, t), p ? z(e) : o;
        }(h);
        if (v) return a = setTimeout(g, t), z(h);
      }
      return void 0 === a && (a = setTimeout(g, t)), o;
    }
    return t = f(t) || 0, d(i) && (p = !!i.leading, r = (v = "maxWait" in i) ? u(f(i.maxWait) || 0, t) : r, S = "trailing" in i ? !!i.trailing : S), b.cancel = function () {
      void 0 !== a && clearTimeout(a), l = 0, s = h = n = a = void 0;
    }, b.flush = function () {
      return void 0 === a ? o : y(m());
    }, b;
  };
}());
var V = {
  width: void 0,
  height: void 0
};
function E(e) {
  const {
      ref: r,
      box: o = "content-box"
    } = e,
    [{
      width: a,
      height: h
    }, l] = reactExports.useState(V),
    u = function () {
      const e = reactExports.useRef(false);
      return reactExports.useEffect(() => (e.current = true, () => {
        e.current = false;
      }), []), reactExports.useCallback(() => e.current, []);
    }(),
    c = reactExports.useRef(_extends$1({}, V)),
    m = reactExports.useRef(void 0);
  return m.current = e.onResize, reactExports.useEffect(() => {
    if (!r.current) return;
    if ("undefined" == typeof window || !("ResizeObserver" in window)) return;
    const e = new ResizeObserver(([e]) => {
      const t = "border-box" === o ? "borderBoxSize" : "device-pixel-content-box" === o ? "devicePixelContentBoxSize" : "contentBoxSize",
        i = N(e, t, "inlineSize"),
        s = N(e, t, "blockSize");
      if (c.current.width !== i || c.current.height !== s) {
        const _e2 = {
          width: i,
          height: s
        };
        c.current.width = i, c.current.height = s, m.current ? m.current(_e2) : u() && l(_e2);
      }
    });
    return e.observe(r.current, {
      box: o
    }), () => {
      e.disconnect();
    };
  }, [o, r, u]), {
    width: a,
    height: h
  };
}
function N(e, t, i) {
  return e[t] ? Array.isArray(e[t]) ? e[t][0][i] : e[t][i] : "contentBoxSize" === t ? e.contentRect["inlineSize" === i ? "width" : "height"] : void 0;
}
var L = "allotment-module_splitView__L-yRc",
  D = "allotment-module_sashContainer__fzwJF",
  O = "allotment-module_splitViewContainer__rQnVa",
  M = "allotment-module_splitViewView__MGZ6O",
  P = "allotment-module_vertical__WSwwa",
  T = "allotment-module_horizontal__7doS8",
  C = "allotment-module_separatorBorder__x-rDS";
let A,
  j = false,
  F = false;
"object" == typeof navigator && (A = navigator.userAgent, F = A.indexOf("Macintosh") >= 0, j = (A.indexOf("Macintosh") >= 0 || A.indexOf("iPad") >= 0 || A.indexOf("iPhone") >= 0) && !!navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
const H = j,
  Y = F,
  k = "undefined" != typeof window && void 0 !== window.document && void 0 !== window.document.createElement ? reactExports.useLayoutEffect : reactExports.useEffect;
class $ {
  constructor() {
    this._size = void 0;
  }
  getSize() {
    return this._size;
  }
  setSize(e) {
    this._size = e;
  }
}
function B(e, t) {
  const i = e.length,
    s = i - t.length;
  return s >= 0 && e.slice(s, i) === t;
}
var R,
  W = {
    exports: {}
  };
var X$1 = (R || (R = 1, function (e) {
    var t = Object.prototype.hasOwnProperty,
      i = "~";
    function s() {}
    function n(e, t, i) {
      this.fn = e, this.context = t, this.once = i || false;
    }
    function r(e, t, s, r, o) {
      if ("function" != typeof s) throw new TypeError("The listener must be a function");
      var a = new n(s, r || e, o),
        h = i ? i + t : t;
      return e._events[h] ? e._events[h].fn ? e._events[h] = [e._events[h], a] : e._events[h].push(a) : (e._events[h] = a, e._eventsCount++), e;
    }
    function o(e, t) {
      0 === --e._eventsCount ? e._events = new s() : delete e._events[t];
    }
    function a() {
      this._events = new s(), this._eventsCount = 0;
    }
    Object.create && (s.prototype = Object.create(null), new s().__proto__ || (i = false)), a.prototype.eventNames = function () {
      var e,
        s,
        n = [];
      if (0 === this._eventsCount) return n;
      for (s in e = this._events) t.call(e, s) && n.push(i ? s.slice(1) : s);
      return Object.getOwnPropertySymbols ? n.concat(Object.getOwnPropertySymbols(e)) : n;
    }, a.prototype.listeners = function (e) {
      var t = i ? i + e : e,
        s = this._events[t];
      if (!s) return [];
      if (s.fn) return [s.fn];
      for (var n = 0, r = s.length, o = new Array(r); n < r; n++) o[n] = s[n].fn;
      return o;
    }, a.prototype.listenerCount = function (e) {
      var t = i ? i + e : e,
        s = this._events[t];
      return s ? s.fn ? 1 : s.length : 0;
    }, a.prototype.emit = function (e, t, s, n, r, o) {
      var a = i ? i + e : e;
      if (!this._events[a]) return false;
      var h,
        l,
        u = this._events[a],
        c = arguments.length;
      if (u.fn) {
        switch (u.once && this.removeListener(e, u.fn, void 0, true), c) {
          case 1:
            return u.fn.call(u.context), true;
          case 2:
            return u.fn.call(u.context, t), true;
          case 3:
            return u.fn.call(u.context, t, s), true;
          case 4:
            return u.fn.call(u.context, t, s, n), true;
          case 5:
            return u.fn.call(u.context, t, s, n, r), true;
          case 6:
            return u.fn.call(u.context, t, s, n, r, o), true;
        }
        for (l = 1, h = new Array(c - 1); l < c; l++) h[l - 1] = arguments[l];
        u.fn.apply(u.context, h);
      } else {
        var m,
          d = u.length;
        for (l = 0; l < d; l++) switch (u[l].once && this.removeListener(e, u[l].fn, void 0, true), c) {
          case 1:
            u[l].fn.call(u[l].context);
            break;
          case 2:
            u[l].fn.call(u[l].context, t);
            break;
          case 3:
            u[l].fn.call(u[l].context, t, s);
            break;
          case 4:
            u[l].fn.call(u[l].context, t, s, n);
            break;
          default:
            if (!h) for (m = 1, h = new Array(c - 1); m < c; m++) h[m - 1] = arguments[m];
            u[l].fn.apply(u[l].context, h);
        }
      }
      return true;
    }, a.prototype.on = function (e, t, i) {
      return r(this, e, t, i, false);
    }, a.prototype.once = function (e, t, i) {
      return r(this, e, t, i, true);
    }, a.prototype.removeListener = function (e, t, s, n) {
      var r = i ? i + e : e;
      if (!this._events[r]) return this;
      if (!t) return o(this, r), this;
      var a = this._events[r];
      if (a.fn) a.fn !== t || n && !a.once || s && a.context !== s || o(this, r);else {
        for (var h = 0, l = [], u = a.length; h < u; h++) (a[h].fn !== t || n && !a[h].once || s && a[h].context !== s) && l.push(a[h]);
        l.length ? this._events[r] = 1 === l.length ? l[0] : l : o(this, r);
      }
      return this;
    }, a.prototype.removeAllListeners = function (e) {
      var t;
      return e ? (t = i ? i + e : e, this._events[t] && o(this, t)) : (this._events = new s(), this._eventsCount = 0), this;
    }, a.prototype.off = a.prototype.removeListener, a.prototype.addListener = a.prototype.on, a.prefixed = i, a.EventEmitter = a, e.exports = a;
  }(W)), W.exports),
  G = u(X$1);
function J(e, t) {
  const i = e.indexOf(t);
  i > -1 && (e.splice(i, 1), e.unshift(t));
}
function U(e, t) {
  const i = e.indexOf(t);
  i > -1 && (e.splice(i, 1), e.push(t));
}
function K(e, t, i = 1) {
  const s = Math.max(0, Math.ceil((t - e) / i)),
    n = new Array(s);
  let r = -1;
  for (; ++r < s;) n[r] = e + r * i;
  return n;
}
var Z = "sash-module_sash__K-9lB",
  Q = "sash-module_disabled__Hm-wx",
  q = "sash-module_mac__Jf6OJ",
  ee = "sash-module_vertical__pB-rs",
  te = "sash-module_minimum__-UKxp",
  ie = "sash-module_maximum__TCWxD",
  se = "sash-module_horizontal__kFbiw",
  ne = "sash-module_hover__80W6I",
  re = "sash-module_active__bJspD";
let oe = function (e) {
    return e.Vertical = "VERTICAL", e.Horizontal = "HORIZONTAL", e;
  }({}),
  ae = function (e) {
    return e.Disabled = "DISABLED", e.Minimum = "MINIMUM", e.Maximum = "MAXIMUM", e.Enabled = "ENABLED", e;
  }({}),
  he = H ? 20 : 8;
const le = new G();
let ue$1 = class ue extends G {
  get state() {
    return this._state;
  }
  set state(e) {
    this._state !== e && (this.el.classList.toggle(Q, e === ae.Disabled), this.el.classList.toggle("sash-disabled", e === ae.Disabled), this.el.classList.toggle(te, e === ae.Minimum), this.el.classList.toggle("sash-minimum", e === ae.Minimum), this.el.classList.toggle(ie, e === ae.Maximum), this.el.classList.toggle("sash-maximum", e === ae.Maximum), this._state = e, this.emit("enablementChange", e));
  }
  constructor(e, t, i) {
    var _i$orientation;
    super(), this.el = void 0, this.layoutProvider = void 0, this.orientation = void 0, this.size = void 0, this.hoverDelay = 300, this.hoverDelayer = _(e => e.classList.add("sash-hover", ne), this.hoverDelay), this._state = ae.Enabled, this.onPointerStart = e => {
      const t = e.pageX,
        i = e.pageY,
        s = {
          startX: t,
          currentX: t,
          startY: i,
          currentY: i
        };
      this.el.classList.add("sash-active", re), this.emit("start", s), this.el.setPointerCapture(e.pointerId);
      const n = e => {
          e.preventDefault();
          const s = {
            startX: t,
            currentX: e.pageX,
            startY: i,
            currentY: e.pageY
          };
          this.emit("change", s);
        },
        r = e => {
          e.preventDefault(), this.el.classList.remove("sash-active", re), this.hoverDelayer.cancel(), this.emit("end"), this.el.releasePointerCapture(e.pointerId), window.removeEventListener("pointermove", n), window.removeEventListener("pointerup", r);
        };
      window.addEventListener("pointermove", n), window.addEventListener("pointerup", r);
    }, this.onPointerDoublePress = () => {
      this.emit("reset");
    }, this.onMouseEnter = () => {
      this.el.classList.contains(re) ? (this.hoverDelayer.cancel(), this.el.classList.add("sash-hover", ne)) : this.hoverDelayer(this.el);
    }, this.onMouseLeave = () => {
      this.hoverDelayer.cancel(), this.el.classList.remove("sash-hover", ne);
    }, this.el = document.createElement("div"), this.el.classList.add("sash", Z), this.el.dataset.testid = "sash", e.append(this.el), Y && this.el.classList.add("sash-mac", q), this.el.addEventListener("pointerdown", this.onPointerStart), this.el.addEventListener("dblclick", this.onPointerDoublePress), this.el.addEventListener("mouseenter", this.onMouseEnter), this.el.addEventListener("mouseleave", this.onMouseLeave), "number" == typeof i.size ? (this.size = i.size, i.orientation === oe.Vertical ? this.el.style.width = `${this.size}px` : this.el.style.height = `${this.size}px`) : (this.size = he, le.on("onDidChangeGlobalSize", e => {
      this.size = e, this.layout();
    })), this.layoutProvider = t, this.orientation = (_i$orientation = i.orientation) != null ? _i$orientation : oe.Vertical, this.orientation === oe.Horizontal ? (this.el.classList.add("sash-horizontal", se), this.el.classList.remove("sash-vertical", ee)) : (this.el.classList.remove("sash-horizontal", se), this.el.classList.add("sash-vertical", ee)), this.layout();
  }
  layout() {
    if (this.orientation === oe.Vertical) {
      const e = this.layoutProvider;
      this.el.style.left = e.getVerticalSashLeft(this) - this.size / 2 + "px", e.getVerticalSashTop && (this.el.style.top = e.getVerticalSashTop(this) + "px"), e.getVerticalSashHeight && (this.el.style.height = e.getVerticalSashHeight(this) + "px");
    } else {
      const e = this.layoutProvider;
      this.el.style.top = e.getHorizontalSashTop(this) - this.size / 2 + "px", e.getHorizontalSashLeft && (this.el.style.left = e.getHorizontalSashLeft(this) + "px"), e.getHorizontalSashWidth && (this.el.style.width = e.getHorizontalSashWidth(this) + "px");
    }
  }
  dispose() {
    this.el.removeEventListener("pointerdown", this.onPointerStart), this.el.removeEventListener("dblclick", this.onPointerDoublePress), this.el.removeEventListener("mouseenter", this.onMouseEnter), this.el.removeEventListener("mouseleave", () => this.onMouseLeave), this.el.remove();
  }
};
let ce;
var me;
(me = ce || (ce = {})).Distribute = {
  type: "distribute"
}, me.Split = function (e) {
  return {
    type: "split",
    index: e
  };
}, me.Invisible = function (e) {
  return {
    type: "invisible",
    cachedVisibleSize: e
  };
};
let de = function (e) {
  return e.Normal = "NORMAL", e.Low = "LOW", e.High = "HIGH", e;
}({});
class fe {
  constructor(e, t, i) {
    this.container = void 0, this.view = void 0, this._size = void 0, this._cachedVisibleSize = void 0, this.container = e, this.view = t, this.container.classList.add("split-view-view", M), this.container.dataset.testid = "split-view-view", "number" == typeof i ? (this._size = i, this._cachedVisibleSize = void 0, e.classList.add("split-view-view-visible")) : (this._size = 0, this._cachedVisibleSize = i.cachedVisibleSize);
  }
  set size(e) {
    this._size = e;
  }
  get size() {
    return this._size;
  }
  get priority() {
    return this.view.priority;
  }
  get snap() {
    return !!this.view.snap;
  }
  get cachedVisibleSize() {
    return this._cachedVisibleSize;
  }
  get visible() {
    return void 0 === this._cachedVisibleSize;
  }
  setVisible(e, t) {
    e !== this.visible && (e ? (this.size = x(this._cachedVisibleSize, this.viewMinimumSize, this.viewMaximumSize), this._cachedVisibleSize = void 0) : (this._cachedVisibleSize = "number" == typeof t ? t : this.size, this.size = 0), this.container.classList.toggle("split-view-view-visible", e), this.view.setVisible && this.view.setVisible(e));
  }
  get minimumSize() {
    return this.visible ? this.view.minimumSize : 0;
  }
  get viewMinimumSize() {
    return this.view.minimumSize;
  }
  get maximumSize() {
    return this.visible ? this.view.maximumSize : 0;
  }
  get viewMaximumSize() {
    return this.view.maximumSize;
  }
  set enabled(e) {
    this.container.style.pointerEvents = e ? "" : "none";
  }
  layout(e) {
    this.layoutContainer(e), this.view.layout(this.size, e);
  }
}
class pe extends fe {
  layoutContainer(e) {
    this.container.style.left = `${e}px`, this.container.style.width = `${this.size}px`;
  }
}
class ve extends fe {
  layoutContainer(e) {
    this.container.style.top = `${e}px`, this.container.style.height = `${this.size}px`;
  }
}
class Se extends G {
  get startSnappingEnabled() {
    return this._startSnappingEnabled;
  }
  set startSnappingEnabled(e) {
    this._startSnappingEnabled !== e && (this._startSnappingEnabled = e, this.updateSashEnablement());
  }
  get endSnappingEnabled() {
    return this._endSnappingEnabled;
  }
  set endSnappingEnabled(e) {
    this._endSnappingEnabled !== e && (this._endSnappingEnabled = e, this.updateSashEnablement());
  }
  constructor(e, t = {}, i, s, n) {
    var _t$orientation, _t$proportionalLayout;
    if (super(), this.onDidChange = void 0, this.onDidDragStart = void 0, this.onDidDragEnd = void 0, this.orientation = void 0, this.sashContainer = void 0, this.size = 0, this.contentSize = 0, this.proportions = void 0, this.viewItems = [], this.sashItems = [], this.sashDragState = void 0, this.proportionalLayout = void 0, this.getSashOrthogonalSize = void 0, this._startSnappingEnabled = true, this._endSnappingEnabled = true, this.onSashEnd = e => {
      this.emit("sashchange", e), this.saveProportions();
      for (const _e3 of this.viewItems) _e3.enabled = true;
    }, this.orientation = (_t$orientation = t.orientation) != null ? _t$orientation : oe.Vertical, this.proportionalLayout = (_t$proportionalLayout = t.proportionalLayout) != null ? _t$proportionalLayout : true, this.getSashOrthogonalSize = t.getSashOrthogonalSize, i && (this.onDidChange = i), s && (this.onDidDragStart = s), n && (this.onDidDragEnd = n), this.sashContainer = document.createElement("div"), this.sashContainer.classList.add("sash-container", D), e.prepend(this.sashContainer), t.descriptor) {
      this.size = t.descriptor.size;
      for (const [_e4, _i] of t.descriptor.views.entries()) {
        const _t = _i.size,
          _s = _i.container,
          _n = _i.view;
        this.addView(_s, _n, _t, _e4, true);
      }
      this.contentSize = this.viewItems.reduce((e, t) => e + t.size, 0), this.saveProportions();
    }
  }
  addView(e, t, i, s = this.viewItems.length, n) {
    let r;
    r = "number" == typeof i ? i : "split" === i.type ? this.getViewSize(i.index) / 2 : "invisible" === i.type ? {
      cachedVisibleSize: i.cachedVisibleSize
    } : t.minimumSize;
    const o = this.orientation === oe.Vertical ? new ve(e, t, r) : new pe(e, t, r);
    if (this.viewItems.splice(s, 0, o), this.viewItems.length > 1) {
      const _e5 = this.orientation === oe.Vertical ? new ue$1(this.sashContainer, {
          getHorizontalSashTop: e => this.getSashPosition(e),
          getHorizontalSashWidth: this.getSashOrthogonalSize
        }, {
          orientation: oe.Horizontal
        }) : new ue$1(this.sashContainer, {
          getVerticalSashLeft: e => this.getSashPosition(e),
          getVerticalSashHeight: this.getSashOrthogonalSize
        }, {
          orientation: oe.Vertical
        }),
        _t2 = this.orientation === oe.Vertical ? t => ({
          sash: _e5,
          start: t.startY,
          current: t.currentY
        }) : t => ({
          sash: _e5,
          start: t.startX,
          current: t.currentX
        });
      _e5.on("start", e => {
        var _this$onDidDragStart;
        this.emit("sashDragStart"), this.onSashStart(_t2(e));
        const i = this.viewItems.map(e => e.size);
        (_this$onDidDragStart = this.onDidDragStart) == null || _this$onDidDragStart.call(this, i);
      }), _e5.on("change", e => this.onSashChange(_t2(e))), _e5.on("end", () => {
        var _this$onDidDragEnd;
        this.emit("sashDragEnd"), this.onSashEnd(this.sashItems.findIndex(t => t.sash === _e5));
        const t = this.viewItems.map(e => e.size);
        (_this$onDidDragEnd = this.onDidDragEnd) == null || _this$onDidDragEnd.call(this, t);
      }), _e5.on("reset", () => {
        const t = this.sashItems.findIndex(t => t.sash === _e5),
          i = K(t, -1, -1),
          s = K(t + 1, this.viewItems.length),
          n = this.findFirstSnapIndex(i),
          r = this.findFirstSnapIndex(s);
        ("number" != typeof n || this.viewItems[n].visible) && ("number" != typeof r || this.viewItems[r].visible) && this.emit("sashreset", t);
      });
      const _i2 = {
        sash: _e5
      };
      this.sashItems.splice(s - 1, 0, _i2);
    }
    n || this.relayout(), n || "number" == typeof i || "distribute" !== i.type || this.distributeViewSizes();
  }
  removeView(e, t) {
    if (e < 0 || e >= this.viewItems.length) throw new Error("Index out of bounds");
    const i = this.viewItems.splice(e, 1)[0].view;
    if (this.viewItems.length >= 1) {
      const _t3 = Math.max(e - 1, 0);
      this.sashItems.splice(_t3, 1)[0].sash.dispose();
    }
    return this.relayout(), t && "distribute" === t.type && this.distributeViewSizes(), i;
  }
  moveView(e, t, i) {
    const s = this.getViewCachedVisibleSize(t),
      n = void 0 === s ? this.getViewSize(t) : ce.Invisible(s),
      r = this.removeView(t);
    this.addView(e, r, n, i);
  }
  getViewCachedVisibleSize(e) {
    if (e < 0 || e >= this.viewItems.length) throw new Error("Index out of bounds");
    return this.viewItems[e].cachedVisibleSize;
  }
  layout(e = this.size) {
    const t = Math.max(this.size, this.contentSize);
    if (this.size = e, this.proportions) for (let _t4 = 0; _t4 < this.viewItems.length; _t4++) {
      const i = this.viewItems[_t4];
      i.size = x(Math.round(this.proportions[_t4] * e), i.minimumSize, i.maximumSize);
    } else {
      const i = K(0, this.viewItems.length),
        s = i.filter(e => this.viewItems[e].priority === de.Low),
        n = i.filter(e => this.viewItems[e].priority === de.High);
      this.resize(this.viewItems.length - 1, e - t, void 0, s, n);
    }
    this.distributeEmptySpace(), this.layoutViews();
  }
  resizeView(e, t) {
    if (e < 0 || e >= this.viewItems.length) return;
    const i = K(0, this.viewItems.length).filter(t => t !== e),
      s = [...i.filter(e => this.viewItems[e].priority === de.Low), e],
      n = i.filter(e => this.viewItems[e].priority === de.High),
      r = this.viewItems[e];
    t = Math.round(t), t = x(t, r.minimumSize, Math.min(r.maximumSize, this.size)), r.size = t, this.relayout(s, n);
  }
  resizeViews(e) {
    for (let t = 0; t < e.length; t++) {
      const i = this.viewItems[t];
      let s = e[t];
      s = Math.round(s), s = x(s, i.minimumSize, Math.min(i.maximumSize, this.size)), i.size = s;
    }
    this.contentSize = this.viewItems.reduce((e, t) => e + t.size, 0), this.saveProportions(), this.layout(this.size);
  }
  getViewSize(e) {
    return e < 0 || e >= this.viewItems.length ? -1 : this.viewItems[e].size;
  }
  isViewVisible(e) {
    if (e < 0 || e >= this.viewItems.length) throw new Error("Index out of bounds");
    return this.viewItems[e].visible;
  }
  setViewVisible(e, t) {
    if (e < 0 || e >= this.viewItems.length) throw new Error("Index out of bounds");
    this.viewItems[e].setVisible(t), this.distributeEmptySpace(e), this.layoutViews(), this.saveProportions();
  }
  distributeViewSizes() {
    const e = [];
    let t = 0;
    for (const _i3 of this.viewItems) _i3.maximumSize - _i3.minimumSize > 0 && (e.push(_i3), t += _i3.size);
    const i = Math.floor(t / e.length);
    for (const _t5 of e) _t5.size = x(i, _t5.minimumSize, _t5.maximumSize);
    const s = K(0, this.viewItems.length),
      n = s.filter(e => this.viewItems[e].priority === de.Low),
      r = s.filter(e => this.viewItems[e].priority === de.High);
    this.relayout(n, r);
  }
  dispose() {
    this.sashItems.forEach(e => e.sash.dispose()), this.sashItems = [], this.sashContainer.remove();
  }
  relayout(e, t) {
    const i = this.viewItems.reduce((e, t) => e + t.size, 0);
    this.resize(this.viewItems.length - 1, this.size - i, void 0, e, t), this.distributeEmptySpace(), this.layoutViews(), this.saveProportions();
  }
  onSashStart({
    sash: e,
    start: t
  }) {
    const i = this.sashItems.findIndex(t => t.sash === e);
    (e => {
      const t = this.viewItems.map(e => e.size);
      let s,
        n,
        r = Number.NEGATIVE_INFINITY,
        o = Number.POSITIVE_INFINITY;
      const a = K(i, -1, -1),
        h = K(i + 1, this.viewItems.length),
        l = a.reduce((e, i) => e + (this.viewItems[i].minimumSize - t[i]), 0),
        u = a.reduce((e, i) => e + (this.viewItems[i].viewMaximumSize - t[i]), 0),
        c = 0 === h.length ? Number.POSITIVE_INFINITY : h.reduce((e, i) => e + (t[i] - this.viewItems[i].minimumSize), 0),
        m = 0 === h.length ? Number.NEGATIVE_INFINITY : h.reduce((e, i) => e + (t[i] - this.viewItems[i].viewMaximumSize), 0);
      r = Math.max(l, m), o = Math.min(c, u);
      const d = this.findFirstSnapIndex(a),
        f = this.findFirstSnapIndex(h);
      if ("number" == typeof d) {
        const _e6 = this.viewItems[d],
          _t6 = Math.floor(_e6.viewMinimumSize / 2);
        s = {
          index: d,
          limitDelta: _e6.visible ? r - _t6 : r + _t6,
          size: _e6.size
        };
      }
      if ("number" == typeof f) {
        const _e7 = this.viewItems[f],
          _t7 = Math.floor(_e7.viewMinimumSize / 2);
        n = {
          index: f,
          limitDelta: _e7.visible ? o + _t7 : o - _t7,
          size: _e7.size
        };
      }
      this.sashDragState = {
        start: e,
        current: e,
        index: i,
        sizes: t,
        minDelta: r,
        maxDelta: o,
        snapBefore: s,
        snapAfter: n
      };
    })(t);
  }
  onSashChange({
    current: e
  }) {
    const {
      index: t,
      start: i,
      sizes: s,
      minDelta: n,
      maxDelta: r,
      snapBefore: o,
      snapAfter: a
    } = this.sashDragState;
    this.sashDragState.current = e;
    const h = e - i;
    this.resize(t, h, s, void 0, void 0, n, r, o, a), this.distributeEmptySpace(), this.layoutViews();
  }
  getSashPosition(e) {
    let t = 0;
    for (let i = 0; i < this.sashItems.length; i++) if (t += this.viewItems[i].size, this.sashItems[i].sash === e) return t;
    return 0;
  }
  resize(e, t, i = this.viewItems.map(e => e.size), s, n, r = Number.NEGATIVE_INFINITY, o = Number.POSITIVE_INFINITY, a, h) {
    if (e < 0 || e >= this.viewItems.length) return 0;
    const l = K(e, -1, -1),
      u = K(e + 1, this.viewItems.length);
    if (n) for (const _e8 of n) J(l, _e8), J(u, _e8);
    if (s) for (const _e9 of s) U(l, _e9), U(u, _e9);
    const c = l.map(e => this.viewItems[e]),
      m = l.map(e => i[e]),
      d = u.map(e => this.viewItems[e]),
      f = u.map(e => i[e]),
      p = l.reduce((e, t) => e + (this.viewItems[t].minimumSize - i[t]), 0),
      v = l.reduce((e, t) => e + (this.viewItems[t].maximumSize - i[t]), 0),
      S = 0 === u.length ? Number.POSITIVE_INFINITY : u.reduce((e, t) => e + (i[t] - this.viewItems[t].minimumSize), 0),
      z = 0 === u.length ? Number.NEGATIVE_INFINITY : u.reduce((e, t) => e + (i[t] - this.viewItems[t].maximumSize), 0),
      w = Math.max(p, z, r),
      g = Math.min(S, v, o);
    let y = false;
    if (a) {
      const _e0 = this.viewItems[a.index],
        _i4 = t >= a.limitDelta;
      y = _i4 !== _e0.visible, _e0.setVisible(_i4, a.size);
    }
    if (!y && h) {
      const _e1 = this.viewItems[h.index],
        _i5 = t < h.limitDelta;
      y = _i5 !== _e1.visible, _e1.setVisible(_i5, h.size);
    }
    if (y) return this.resize(e, t, i, s, n, r, o);
    for (let _e10 = 0, _i6 = t = x(t, w, g); _e10 < c.length; _e10++) {
      const _t8 = c[_e10],
        _s2 = x(m[_e10] + _i6, _t8.minimumSize, _t8.maximumSize);
      _i6 -= _s2 - m[_e10], _t8.size = _s2;
    }
    for (let _e11 = 0, _i7 = t; _e11 < d.length; _e11++) {
      const _t9 = d[_e11],
        _s3 = x(f[_e11] - _i7, _t9.minimumSize, _t9.maximumSize);
      _i7 += _s3 - f[_e11], _t9.size = _s3;
    }
    return t;
  }
  distributeEmptySpace(e) {
    const t = this.viewItems.reduce((e, t) => e + t.size, 0);
    let i = this.size - t;
    const s = K(0, this.viewItems.length),
      n = [],
      r = s.filter(e => this.viewItems[e].priority === de.Low),
      o = s.filter(e => this.viewItems[e].priority === de.Normal),
      a = s.filter(e => this.viewItems[e].priority === de.High);
    n.push(...a, ...o, ...r), "number" == typeof e && U(n, e);
    for (let _e12 = 0; 0 !== i && _e12 < n.length; _e12++) {
      const _t0 = this.viewItems[n[_e12]],
        _s4 = x(_t0.size + i, _t0.minimumSize, _t0.maximumSize);
      i -= _s4 - _t0.size, _t0.size = _s4;
    }
  }
  layoutViews() {
    var _this$onDidChange;
    this.contentSize = this.viewItems.reduce((e, t) => e + t.size, 0);
    let e = 0;
    for (const t of this.viewItems) t.layout(e), e += t.size;
    (_this$onDidChange = this.onDidChange) != null && _this$onDidChange.call(this, this.viewItems.map(e => e.size)), this.sashItems.forEach(e => e.sash.layout()), this.updateSashEnablement();
  }
  saveProportions() {
    this.proportionalLayout && this.contentSize > 0 && (this.proportions = this.viewItems.map(e => e.size / this.contentSize));
  }
  updateSashEnablement() {
    let e = false;
    const t = this.viewItems.map(t => e = t.size - t.minimumSize > 0 || e);
    e = false;
    const i = this.viewItems.map(t => e = t.maximumSize - t.size > 0 || e),
      s = [...this.viewItems].reverse();
    e = false;
    const n = s.map(t => e = t.size - t.minimumSize > 0 || e).reverse();
    e = false;
    const r = s.map(t => e = t.maximumSize - t.size > 0 || e).reverse();
    let o = 0;
    for (let _e13 = 0; _e13 < this.sashItems.length; _e13++) {
      const {
        sash: _s5
      } = this.sashItems[_e13];
      o += this.viewItems[_e13].size;
      const a = !(t[_e13] && r[_e13 + 1]),
        h = !(i[_e13] && n[_e13 + 1]);
      if (a && h) {
        const _i8 = K(_e13, -1, -1),
          _r = K(_e13 + 1, this.viewItems.length),
          _a = this.findFirstSnapIndex(_i8),
          _h = this.findFirstSnapIndex(_r),
          l = "number" == typeof _a && !this.viewItems[_a].visible,
          u = "number" == typeof _h && !this.viewItems[_h].visible;
        l && n[_e13] && (o > 0 || this.startSnappingEnabled) ? _s5.state = ae.Minimum : u && t[_e13] && (o < this.contentSize || this.endSnappingEnabled) ? _s5.state = ae.Maximum : _s5.state = ae.Disabled;
      } else _s5.state = a && !h ? ae.Minimum : !a && h ? ae.Maximum : ae.Enabled;
    }
  }
  findFirstSnapIndex(e) {
    for (const t of e) {
      const _e14 = this.viewItems[t];
      if (_e14.visible && _e14.snap) return t;
    }
    for (const t of e) {
      const _e15 = this.viewItems[t];
      if (_e15.visible && _e15.maximumSize - _e15.minimumSize > 0) return;
      if (!_e15.visible && _e15.snap) return t;
    }
  }
}
class ze {
  constructor(e) {
    this.size = void 0, this.size = e;
  }
  getPreferredSize() {
    return this.size;
  }
}
class we {
  constructor(e, t) {
    this.proportion = void 0, this.layoutService = void 0, this.proportion = e, this.layoutService = t;
  }
  getPreferredSize() {
    return this.proportion * this.layoutService.getSize();
  }
}
class ge {
  getPreferredSize() {}
}
class ye {
  get preferredSize() {
    return this.layoutStrategy.getPreferredSize();
  }
  set preferredSize(e) {
    if ("number" == typeof e) this.layoutStrategy = new ze(e);else if ("string" == typeof e) {
      const t = e.trim();
      if (B(t, "%")) {
        const _e16 = Number(t.slice(0, -1)) / 100;
        this.layoutStrategy = new we(_e16, this.layoutService);
      } else if (B(t, "px")) {
        const _e17 = Number(t.slice(0, -2)) / 100;
        this.layoutStrategy = new ze(_e17);
      } else if ("number" == typeof Number.parseFloat(t)) {
        const _e18 = Number.parseFloat(t);
        this.layoutStrategy = new ze(_e18);
      } else this.layoutStrategy = new ge();
    } else this.layoutStrategy = new ge();
  }
  constructor(e, t) {
    var _t$priority;
    if (this.minimumSize = 0, this.maximumSize = Number.POSITIVE_INFINITY, this.element = void 0, this.priority = void 0, this.snap = void 0, this.layoutService = void 0, this.layoutStrategy = void 0, this.layoutService = e, this.element = t.element, this.minimumSize = "number" == typeof t.minimumSize ? t.minimumSize : 30, this.maximumSize = "number" == typeof t.maximumSize ? t.maximumSize : Number.POSITIVE_INFINITY, "number" == typeof t.preferredSize) this.layoutStrategy = new ze(t.preferredSize);else if ("string" == typeof t.preferredSize) {
      const _e19 = t.preferredSize.trim();
      if (B(_e19, "%")) {
        const _t1 = Number(_e19.slice(0, -1)) / 100;
        this.layoutStrategy = new we(_t1, this.layoutService);
      } else if (B(_e19, "px")) {
        const _t10 = Number(_e19.slice(0, -2));
        this.layoutStrategy = new ze(_t10);
      } else if ("number" == typeof Number.parseFloat(_e19)) {
        const _t11 = Number.parseFloat(_e19);
        this.layoutStrategy = new ze(_t11);
      } else this.layoutStrategy = new ge();
    } else this.layoutStrategy = new ge();
    this.priority = (_t$priority = t.priority) != null ? _t$priority : de.Normal, this.snap = "boolean" == typeof t.snap && t.snap;
  }
  layout(e) {}
}
function be(e) {
  return void 0 !== e.minSize || void 0 !== e.maxSize || void 0 !== e.preferredSize || void 0 !== e.priority || void 0 !== e.visible;
}
const Ie = reactExports.forwardRef(({
  className: t,
  children: i
}, s) => React.createElement("div", {
  ref: s,
  className: S("split-view-view", M, t)
}, i));
Ie.displayName = "Allotment.Pane";
const xe = reactExports.forwardRef(({
  children: r,
  className: o,
  id: l,
  maxSize: u = 1 / 0,
  minSize: c = 30,
  proportionalLayout: m = true,
  separator: d = true,
  sizes: f,
  defaultSizes: p = f,
  snap: v = false,
  vertical: z = false,
  onChange: w,
  onReset: g,
  onVisibleChange: b,
  onDragStart: I,
  onDragEnd: x
}, _) => {
  const V = reactExports.useRef(null),
    N = reactExports.useRef([]),
    D = reactExports.useRef(new Map()),
    M = reactExports.useRef(null),
    A = reactExports.useRef(new Map()),
    j = reactExports.useRef(new $()),
    F = reactExports.useRef([]),
    [Y, B] = reactExports.useState(false);
  const R = reactExports.useMemo(() => React.Children.toArray(r).filter(React.isValidElement), [r]),
    W = reactExports.useCallback(e => {
      var _F$current, _M$current;
      const t = (_F$current = F.current) == null ? void 0 : _F$current[e];
      return "number" == typeof (t == null ? void 0 : t.preferredSize) && ((_M$current = M.current) != null && _M$current.resizeView(e, Math.round(t.preferredSize)), true);
    }, []);
  return reactExports.useImperativeHandle(_, () => ({
    reset: () => {
      if (g) g();else {
        var _M$current2;
        (_M$current2 = M.current) == null || _M$current2.distributeViewSizes();
        for (let e = 0; e < F.current.length; e++) W(e);
      }
    },
    resize: e => {
      var _M$current3;
      (_M$current3 = M.current) == null || _M$current3.resizeViews(e);
    }
  })), k(() => {
    let e = true;
    p && A.current.size !== p.length && (e = false, console.warn(`Expected ${p.length} children based on defaultSizes but found ${A.current.size}`)), e && p && (N.current = R.map(e => e.key));
    const t = _extends$1({
      orientation: z ? oe.Vertical : oe.Horizontal,
      proportionalLayout: m
    }, e && p && {
      descriptor: {
        size: p.reduce((e, t) => e + t, 0),
        views: p.map((e, t) => {
          var _i$minSize, _i$maxSize, _i$priority, _i$snap;
          const i = D.current.get(N.current[t]),
            s = new ye(j.current, _extends$1({
              element: document.createElement("div"),
              minimumSize: (_i$minSize = i == null ? void 0 : i.minSize) != null ? _i$minSize : c,
              maximumSize: (_i$maxSize = i == null ? void 0 : i.maxSize) != null ? _i$maxSize : u,
              priority: (_i$priority = i == null ? void 0 : i.priority) != null ? _i$priority : de.Normal
            }, (i == null ? void 0 : i.preferredSize) && {
              preferredSize: i == null ? void 0 : i.preferredSize
            }, {
              snap: (_i$snap = i == null ? void 0 : i.snap) != null ? _i$snap : v
            }));
          return F.current.push(s), {
            container: [...A.current.values()][t],
            size: e,
            view: s
          };
        })
      }
    });
    M.current = new Se(V.current, t, w, I, x), M.current.on("sashDragStart", () => {
      var _V$current;
      (_V$current = V.current) == null || _V$current.classList.add("split-view-sash-dragging");
    }), M.current.on("sashDragEnd", () => {
      var _V$current2;
      (_V$current2 = V.current) == null || _V$current2.classList.remove("split-view-sash-dragging");
    }), M.current.on("sashchange", e => {
      if (b && M.current) {
        const _e20 = R.map(e => e.key);
        for (let t = 0; t < _e20.length; t++) {
          const i = D.current.get(_e20[t]);
          void 0 !== (i == null ? void 0 : i.visible) && i.visible !== M.current.isViewVisible(t) && b(t, M.current.isViewVisible(t));
        }
      }
    }), M.current.on("sashreset", e => {
      if (g) g();else {
        var _M$current4;
        if (W(e)) return;
        if (W(e + 1)) return;
        (_M$current4 = M.current) == null || _M$current4.distributeViewSizes();
      }
    });
    const i = M.current;
    return () => {
      i.dispose();
    };
  }, []), k(() => {
    if (Y) {
      const e = R.map(e => e.key),
        t = [...N.current],
        i = e.filter(e => !N.current.includes(e)),
        s = e.filter(e => N.current.includes(e)),
        n = N.current.map(t => !e.includes(t));
      for (let _e21 = n.length - 1; _e21 >= 0; _e21--) {
        var _M$current5;
        n[_e21] && ((_M$current5 = M.current) != null && _M$current5.removeView(_e21), t.splice(_e21, 1), F.current.splice(_e21, 1));
      }
      for (const _s6 of i) {
        var _i9$minSize, _i9$maxSize, _i9$priority, _i9$snap, _M$current6;
        const _i9 = D.current.get(_s6),
          _n2 = new ye(j.current, _extends$1({
            element: document.createElement("div"),
            minimumSize: (_i9$minSize = _i9 == null ? void 0 : _i9.minSize) != null ? _i9$minSize : c,
            maximumSize: (_i9$maxSize = _i9 == null ? void 0 : _i9.maxSize) != null ? _i9$maxSize : u,
            priority: (_i9$priority = _i9 == null ? void 0 : _i9.priority) != null ? _i9$priority : de.Normal
          }, (_i9 == null ? void 0 : _i9.preferredSize) && {
            preferredSize: _i9 == null ? void 0 : _i9.preferredSize
          }, {
            snap: (_i9$snap = _i9 == null ? void 0 : _i9.snap) != null ? _i9$snap : v
          }));
        (_M$current6 = M.current) != null && _M$current6.addView(A.current.get(_s6), _n2, ce.Distribute, e.findIndex(e => e === _s6)), t.splice(e.findIndex(e => e === _s6), 0, _s6), F.current.splice(e.findIndex(e => e === _s6), 0, _n2);
      }
      for (; !y(e, t);) for (const [_i0, _s7] of e.entries()) {
        const _e22 = t.findIndex(e => e === _s7);
        if (_e22 !== _i0) {
          var _M$current7;
          (_M$current7 = M.current) == null || _M$current7.moveView(A.current.get(_s7), _e22, _i0);
          const _n3 = t[_e22];
          t.splice(_e22, 1), t.splice(_i0, 0, _n3);
          break;
        }
      }
      for (const _t12 of i) {
        var _M$current8;
        const _i1 = e.findIndex(e => e === _t12),
          _s8 = F.current[_i1].preferredSize;
        void 0 !== _s8 && ((_M$current8 = M.current) == null ? void 0 : _M$current8.resizeView(_i1, _s8));
      }
      for (const _t13 of [...i, ...s]) {
        var _M$current9, _M$current0;
        const _i10 = D.current.get(_t13),
          _s9 = e.findIndex(e => e === _t13);
        _i10 && be(_i10) && void 0 !== _i10.visible && ((_M$current9 = M.current) == null ? void 0 : _M$current9.isViewVisible(_s9)) !== _i10.visible && ((_M$current0 = M.current) == null ? void 0 : _M$current0.setViewVisible(_s9, _i10.visible));
      }
      for (const _t14 of s) {
        const _i11 = D.current.get(_t14),
          _s0 = e.findIndex(e => e === _t14);
        if (_i11 && be(_i11)) {
          var _M$current1;
          void 0 !== _i11.preferredSize && F.current[_s0].preferredSize !== _i11.preferredSize && (F.current[_s0].preferredSize = _i11.preferredSize);
          let _e23 = false;
          void 0 !== _i11.minSize && F.current[_s0].minimumSize !== _i11.minSize && (F.current[_s0].minimumSize = _i11.minSize, _e23 = true), void 0 !== _i11.maxSize && F.current[_s0].maximumSize !== _i11.maxSize && (F.current[_s0].maximumSize = _i11.maxSize, _e23 = true), _e23 && ((_M$current1 = M.current) == null ? void 0 : _M$current1.layout());
        }
      }
      (i.length > 0 || n.length > 0) && (N.current = e);
    }
  }, [R, Y, u, c, v]), reactExports.useEffect(() => {
    M.current && (M.current.onDidChange = w);
  }, [w]), reactExports.useEffect(() => {
    M.current && (M.current.onDidDragStart = I);
  }, [I]), reactExports.useEffect(() => {
    M.current && (M.current.onDidDragEnd = x);
  }, [x]), E({
    ref: V,
    onResize: ({
      width: e,
      height: t
    }) => {
      var _M$current10;
      e && t && ((_M$current10 = M.current) != null && _M$current10.layout(z ? t : e), j.current.setSize(z ? t : e), B(true));
    }
  }), reactExports.useEffect(() => {
    H && _e(20);
  }, []), React.createElement("div", {
    ref: V,
    className: S("split-view", z ? "split-view-vertical" : "split-view-horizontal", {
      "split-view-separator-border": d
    }, L, z ? P : T, {
      [C]: d
    }, o),
    id: l
  }, React.createElement("div", {
    className: S("split-view-container", O)
  }, React.Children.toArray(r).map(t => {
    if (!React.isValidElement(t)) return null;
    const i = t.key;
    return "Allotment.Pane" === t.type.displayName ? (D.current.set(i, t.props), React.cloneElement(t, {
      key: i,
      ref: e => {
        const s = t.ref;
        s && (s.current = e), e ? A.current.set(i, e) : A.current.delete(i);
      }
    })) : React.createElement(Ie, {
      key: i,
      ref: e => {
        e ? A.current.set(i, e) : A.current.delete(i);
      }
    }, t);
  })));
});
function _e(e) {
  const t = x(e, 4, 20),
    i = x(e, 1, 8);
  document.documentElement.style.setProperty("--sash-size", t + "px"), document.documentElement.style.setProperty("--sash-hover-size", i + "px"), function (e) {
    he = e, le.emit("onDidChangeGlobalSize", e);
  }(t);
}
xe.displayName = "Allotment";
var Ve = Object.assign(xe, {
  Pane: Ie
});

var client = {};

var reactDom = {exports: {}};

var reactDom_production_min = {};

var scheduler = {exports: {}};

var scheduler_production_min = {};

/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredScheduler_production_min;

function requireScheduler_production_min () {
	if (hasRequiredScheduler_production_min) return scheduler_production_min;
	hasRequiredScheduler_production_min = 1;
	(function (exports) {
function f(a,b){var c=a.length;a.push(b);a:for(;0<c;){var d=c-1>>>1,e=a[d];if(0<g(e,b))a[d]=b,a[c]=e,c=d;else break a}}function h(a){return 0===a.length?null:a[0]}function k(a){if(0===a.length)return null;var b=a[0],c=a.pop();if(c!==b){a[0]=c;a:for(var d=0,e=a.length,w=e>>>1;d<w;){var m=2*(d+1)-1,C=a[m],n=m+1,x=a[n];if(0>g(C,c))n<e&&0>g(x,C)?(a[d]=x,a[n]=c,d=n):(a[d]=C,a[m]=c,d=m);else if(n<e&&0>g(x,c))a[d]=x,a[n]=c,d=n;else break a}}return b}
		function g(a,b){var c=a.sortIndex-b.sortIndex;return 0!==c?c:a.id-b.id}if("object"===typeof performance&&"function"===typeof performance.now){var l=performance;exports.unstable_now=function(){return l.now()};}else {var p=Date,q=p.now();exports.unstable_now=function(){return p.now()-q};}var r=[],t=[],u=1,v=null,y=3,z=false,A=false,B=false,D="function"===typeof setTimeout?setTimeout:null,E="function"===typeof clearTimeout?clearTimeout:null,F="undefined"!==typeof setImmediate?setImmediate:null;
		"undefined"!==typeof navigator&&void 0!==navigator.scheduling&&void 0!==navigator.scheduling.isInputPending&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function G(a){for(var b=h(t);null!==b;){if(null===b.callback)k(t);else if(b.startTime<=a)k(t),b.sortIndex=b.expirationTime,f(r,b);else break;b=h(t);}}function H(a){B=false;G(a);if(!A)if(null!==h(r))A=true,I(J);else {var b=h(t);null!==b&&K(H,b.startTime-a);}}
		function J(a,b){A=false;B&&(B=false,E(L),L=-1);z=true;var c=y;try{G(b);for(v=h(r);null!==v&&(!(v.expirationTime>b)||a&&!M());){var d=v.callback;if("function"===typeof d){v.callback=null;y=v.priorityLevel;var e=d(v.expirationTime<=b);b=exports.unstable_now();"function"===typeof e?v.callback=e:v===h(r)&&k(r);G(b);}else k(r);v=h(r);}if(null!==v)var w=!0;else {var m=h(t);null!==m&&K(H,m.startTime-b);w=!1;}return w}finally{v=null,y=c,z=false;}}var N=false,O=null,L=-1,P=5,Q=-1;
		function M(){return exports.unstable_now()-Q<P?false:true}function R(){if(null!==O){var a=exports.unstable_now();Q=a;var b=true;try{b=O(!0,a);}finally{b?S():(N=false,O=null);}}else N=false;}var S;if("function"===typeof F)S=function(){F(R);};else if("undefined"!==typeof MessageChannel){var T=new MessageChannel,U=T.port2;T.port1.onmessage=R;S=function(){U.postMessage(null);};}else S=function(){D(R,0);};function I(a){O=a;N||(N=true,S());}function K(a,b){L=D(function(){a(exports.unstable_now());},b);}
		exports.unstable_IdlePriority=5;exports.unstable_ImmediatePriority=1;exports.unstable_LowPriority=4;exports.unstable_NormalPriority=3;exports.unstable_Profiling=null;exports.unstable_UserBlockingPriority=2;exports.unstable_cancelCallback=function(a){a.callback=null;};exports.unstable_continueExecution=function(){A||z||(A=true,I(J));};
		exports.unstable_forceFrameRate=function(a){0>a||125<a?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):P=0<a?Math.floor(1E3/a):5;};exports.unstable_getCurrentPriorityLevel=function(){return y};exports.unstable_getFirstCallbackNode=function(){return h(r)};exports.unstable_next=function(a){switch(y){case 1:case 2:case 3:var b=3;break;default:b=y;}var c=y;y=b;try{return a()}finally{y=c;}};exports.unstable_pauseExecution=function(){};
		exports.unstable_requestPaint=function(){};exports.unstable_runWithPriority=function(a,b){switch(a){case 1:case 2:case 3:case 4:case 5:break;default:a=3;}var c=y;y=a;try{return b()}finally{y=c;}};
		exports.unstable_scheduleCallback=function(a,b,c){var d=exports.unstable_now();"object"===typeof c&&null!==c?(c=c.delay,c="number"===typeof c&&0<c?d+c:d):c=d;switch(a){case 1:var e=-1;break;case 2:e=250;break;case 5:e=1073741823;break;case 4:e=1E4;break;default:e=5E3;}e=c+e;a={id:u++,callback:b,priorityLevel:a,startTime:c,expirationTime:e,sortIndex:-1};c>d?(a.sortIndex=c,f(t,a),null===h(r)&&a===h(t)&&(B?(E(L),L=-1):B=true,K(H,c-d))):(a.sortIndex=e,f(r,a),A||z||(A=true,I(J)));return a};
		exports.unstable_shouldYield=M;exports.unstable_wrapCallback=function(a){var b=y;return function(){var c=y;y=b;try{return a.apply(this,arguments)}finally{y=c;}}}; 
	} (scheduler_production_min));
	return scheduler_production_min;
}

var hasRequiredScheduler;

function requireScheduler () {
	if (hasRequiredScheduler) return scheduler.exports;
	hasRequiredScheduler = 1;

	{
	  scheduler.exports = requireScheduler_production_min();
	}
	return scheduler.exports;
}

/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactDom_production_min;

function requireReactDom_production_min () {
	if (hasRequiredReactDom_production_min) return reactDom_production_min;
	hasRequiredReactDom_production_min = 1;
var aa=requireReact(),ca=requireScheduler();function p(a){for(var b="https://reactjs.org/docs/error-decoder.html?invariant="+a,c=1;c<arguments.length;c++)b+="&args[]="+encodeURIComponent(arguments[c]);return "Minified React error #"+a+"; visit "+b+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var da=new Set,ea={};function fa(a,b){ha(a,b);ha(a+"Capture",b);}
	function ha(a,b){ea[a]=b;for(a=0;a<b.length;a++)da.add(b[a]);}
	var ia=!("undefined"===typeof window||"undefined"===typeof window.document||"undefined"===typeof window.document.createElement),ja=Object.prototype.hasOwnProperty,ka=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,la=
	{},ma={};function oa(a){if(ja.call(ma,a))return  true;if(ja.call(la,a))return  false;if(ka.test(a))return ma[a]=true;la[a]=true;return  false}function pa(a,b,c,d){if(null!==c&&0===c.type)return  false;switch(typeof b){case "function":case "symbol":return  true;case "boolean":if(d)return  false;if(null!==c)return !c.acceptsBooleans;a=a.toLowerCase().slice(0,5);return "data-"!==a&&"aria-"!==a;default:return  false}}
	function qa(a,b,c,d){if(null===b||"undefined"===typeof b||pa(a,b,c,d))return  true;if(d)return  false;if(null!==c)switch(c.type){case 3:return !b;case 4:return  false===b;case 5:return isNaN(b);case 6:return isNaN(b)||1>b}return  false}function v(a,b,c,d,e,f,g){this.acceptsBooleans=2===b||3===b||4===b;this.attributeName=d;this.attributeNamespace=e;this.mustUseProperty=c;this.propertyName=a;this.type=b;this.sanitizeURL=f;this.removeEmptyString=g;}var z={};
	"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a){z[a]=new v(a,0,false,a,null,false,false);});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(a){var b=a[0];z[b]=new v(b,1,false,a[1],null,false,false);});["contentEditable","draggable","spellCheck","value"].forEach(function(a){z[a]=new v(a,2,false,a.toLowerCase(),null,false,false);});
	["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(a){z[a]=new v(a,2,false,a,null,false,false);});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a){z[a]=new v(a,3,false,a.toLowerCase(),null,false,false);});
	["checked","multiple","muted","selected"].forEach(function(a){z[a]=new v(a,3,true,a,null,false,false);});["capture","download"].forEach(function(a){z[a]=new v(a,4,false,a,null,false,false);});["cols","rows","size","span"].forEach(function(a){z[a]=new v(a,6,false,a,null,false,false);});["rowSpan","start"].forEach(function(a){z[a]=new v(a,5,false,a.toLowerCase(),null,false,false);});var ra=/[\-:]([a-z])/g;function sa(a){return a[1].toUpperCase()}
	"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a){var b=a.replace(ra,
	sa);z[b]=new v(b,1,false,a,null,false,false);});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a){var b=a.replace(ra,sa);z[b]=new v(b,1,false,a,"http://www.w3.org/1999/xlink",false,false);});["xml:base","xml:lang","xml:space"].forEach(function(a){var b=a.replace(ra,sa);z[b]=new v(b,1,false,a,"http://www.w3.org/XML/1998/namespace",false,false);});["tabIndex","crossOrigin"].forEach(function(a){z[a]=new v(a,1,false,a.toLowerCase(),null,false,false);});
	z.xlinkHref=new v("xlinkHref",1,false,"xlink:href","http://www.w3.org/1999/xlink",true,false);["src","href","action","formAction"].forEach(function(a){z[a]=new v(a,1,false,a.toLowerCase(),null,true,true);});
	function ta(a,b,c,d){var e=z.hasOwnProperty(b)?z[b]:null;if(null!==e?0!==e.type:d||!(2<b.length)||"o"!==b[0]&&"O"!==b[0]||"n"!==b[1]&&"N"!==b[1])qa(b,c,e,d)&&(c=null),d||null===e?oa(b)&&(null===c?a.removeAttribute(b):a.setAttribute(b,""+c)):e.mustUseProperty?a[e.propertyName]=null===c?3===e.type?false:"":c:(b=e.attributeName,d=e.attributeNamespace,null===c?a.removeAttribute(b):(e=e.type,c=3===e||4===e&&true===c?"":""+c,d?a.setAttributeNS(d,b,c):a.setAttribute(b,c)));}
	var ua=aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,va=Symbol.for("react.element"),wa=Symbol.for("react.portal"),ya=Symbol.for("react.fragment"),za=Symbol.for("react.strict_mode"),Aa=Symbol.for("react.profiler"),Ba=Symbol.for("react.provider"),Ca=Symbol.for("react.context"),Da=Symbol.for("react.forward_ref"),Ea=Symbol.for("react.suspense"),Fa=Symbol.for("react.suspense_list"),Ga=Symbol.for("react.memo"),Ha=Symbol.for("react.lazy");	var Ia=Symbol.for("react.offscreen");var Ja=Symbol.iterator;function Ka(a){if(null===a||"object"!==typeof a)return null;a=Ja&&a[Ja]||a["@@iterator"];return "function"===typeof a?a:null}var A=Object.assign,La;function Ma(a){if(void 0===La)try{throw Error();}catch(c){var b=c.stack.trim().match(/\n( *(at )?)/);La=b&&b[1]||"";}return "\n"+La+a}var Na=false;
	function Oa(a,b){if(!a||Na)return "";Na=true;var c=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(b)if(b=function(){throw Error();},Object.defineProperty(b.prototype,"props",{set:function(){throw Error();}}),"object"===typeof Reflect&&Reflect.construct){try{Reflect.construct(b,[]);}catch(l){var d=l;}Reflect.construct(a,[],b);}else {try{b.call();}catch(l){d=l;}a.call(b.prototype);}else {try{throw Error();}catch(l){d=l;}a();}}catch(l){if(l&&d&&"string"===typeof l.stack){for(var e=l.stack.split("\n"),
	f=d.stack.split("\n"),g=e.length-1,h=f.length-1;1<=g&&0<=h&&e[g]!==f[h];)h--;for(;1<=g&&0<=h;g--,h--)if(e[g]!==f[h]){if(1!==g||1!==h){do if(g--,h--,0>h||e[g]!==f[h]){var k="\n"+e[g].replace(" at new "," at ");a.displayName&&k.includes("<anonymous>")&&(k=k.replace("<anonymous>",a.displayName));return k}while(1<=g&&0<=h)}break}}}finally{Na=false,Error.prepareStackTrace=c;}return (a=a?a.displayName||a.name:"")?Ma(a):""}
	function Pa(a){switch(a.tag){case 5:return Ma(a.type);case 16:return Ma("Lazy");case 13:return Ma("Suspense");case 19:return Ma("SuspenseList");case 0:case 2:case 15:return a=Oa(a.type,false),a;case 11:return a=Oa(a.type.render,false),a;case 1:return a=Oa(a.type,true),a;default:return ""}}
	function Qa(a){if(null==a)return null;if("function"===typeof a)return a.displayName||a.name||null;if("string"===typeof a)return a;switch(a){case ya:return "Fragment";case wa:return "Portal";case Aa:return "Profiler";case za:return "StrictMode";case Ea:return "Suspense";case Fa:return "SuspenseList"}if("object"===typeof a)switch(a.$$typeof){case Ca:return (a.displayName||"Context")+".Consumer";case Ba:return (a._context.displayName||"Context")+".Provider";case Da:var b=a.render;a=a.displayName;a||(a=b.displayName||
	b.name||"",a=""!==a?"ForwardRef("+a+")":"ForwardRef");return a;case Ga:return b=a.displayName||null,null!==b?b:Qa(a.type)||"Memo";case Ha:b=a._payload;a=a._init;try{return Qa(a(b))}catch(c){}}return null}
	function Ra(a){var b=a.type;switch(a.tag){case 24:return "Cache";case 9:return (b.displayName||"Context")+".Consumer";case 10:return (b._context.displayName||"Context")+".Provider";case 18:return "DehydratedFragment";case 11:return a=b.render,a=a.displayName||a.name||"",b.displayName||(""!==a?"ForwardRef("+a+")":"ForwardRef");case 7:return "Fragment";case 5:return b;case 4:return "Portal";case 3:return "Root";case 6:return "Text";case 16:return Qa(b);case 8:return b===za?"StrictMode":"Mode";case 22:return "Offscreen";
	case 12:return "Profiler";case 21:return "Scope";case 13:return "Suspense";case 19:return "SuspenseList";case 25:return "TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if("function"===typeof b)return b.displayName||b.name||null;if("string"===typeof b)return b}return null}function Sa(a){switch(typeof a){case "boolean":case "number":case "string":case "undefined":return a;case "object":return a;default:return ""}}
	function Ta(a){var b=a.type;return (a=a.nodeName)&&"input"===a.toLowerCase()&&("checkbox"===b||"radio"===b)}
	function Ua(a){var b=Ta(a)?"checked":"value",c=Object.getOwnPropertyDescriptor(a.constructor.prototype,b),d=""+a[b];if(!a.hasOwnProperty(b)&&"undefined"!==typeof c&&"function"===typeof c.get&&"function"===typeof c.set){var e=c.get,f=c.set;Object.defineProperty(a,b,{configurable:true,get:function(){return e.call(this)},set:function(a){d=""+a;f.call(this,a);}});Object.defineProperty(a,b,{enumerable:c.enumerable});return {getValue:function(){return d},setValue:function(a){d=""+a;},stopTracking:function(){a._valueTracker=
	null;delete a[b];}}}}function Va(a){a._valueTracker||(a._valueTracker=Ua(a));}function Wa(a){if(!a)return  false;var b=a._valueTracker;if(!b)return  true;var c=b.getValue();var d="";a&&(d=Ta(a)?a.checked?"true":"false":a.value);a=d;return a!==c?(b.setValue(a),true):false}function Xa(a){a=a||("undefined"!==typeof document?document:void 0);if("undefined"===typeof a)return null;try{return a.activeElement||a.body}catch(b){return a.body}}
	function Ya(a,b){var c=b.checked;return A({},b,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:null!=c?c:a._wrapperState.initialChecked})}function Za(a,b){var c=null==b.defaultValue?"":b.defaultValue,d=null!=b.checked?b.checked:b.defaultChecked;c=Sa(null!=b.value?b.value:c);a._wrapperState={initialChecked:d,initialValue:c,controlled:"checkbox"===b.type||"radio"===b.type?null!=b.checked:null!=b.value};}function ab(a,b){b=b.checked;null!=b&&ta(a,"checked",b,false);}
	function bb(a,b){ab(a,b);var c=Sa(b.value),d=b.type;if(null!=c)if("number"===d){if(0===c&&""===a.value||a.value!=c)a.value=""+c;}else a.value!==""+c&&(a.value=""+c);else if("submit"===d||"reset"===d){a.removeAttribute("value");return}b.hasOwnProperty("value")?cb(a,b.type,c):b.hasOwnProperty("defaultValue")&&cb(a,b.type,Sa(b.defaultValue));null==b.checked&&null!=b.defaultChecked&&(a.defaultChecked=!!b.defaultChecked);}
	function db(a,b,c){if(b.hasOwnProperty("value")||b.hasOwnProperty("defaultValue")){var d=b.type;if(!("submit"!==d&&"reset"!==d||void 0!==b.value&&null!==b.value))return;b=""+a._wrapperState.initialValue;c||b===a.value||(a.value=b);a.defaultValue=b;}c=a.name;""!==c&&(a.name="");a.defaultChecked=!!a._wrapperState.initialChecked;""!==c&&(a.name=c);}
	function cb(a,b,c){if("number"!==b||Xa(a.ownerDocument)!==a)null==c?a.defaultValue=""+a._wrapperState.initialValue:a.defaultValue!==""+c&&(a.defaultValue=""+c);}var eb=Array.isArray;
	function fb(a,b,c,d){a=a.options;if(b){b={};for(var e=0;e<c.length;e++)b["$"+c[e]]=true;for(c=0;c<a.length;c++)e=b.hasOwnProperty("$"+a[c].value),a[c].selected!==e&&(a[c].selected=e),e&&d&&(a[c].defaultSelected=true);}else {c=""+Sa(c);b=null;for(e=0;e<a.length;e++){if(a[e].value===c){a[e].selected=true;d&&(a[e].defaultSelected=true);return}null!==b||a[e].disabled||(b=a[e]);}null!==b&&(b.selected=true);}}
	function gb(a,b){if(null!=b.dangerouslySetInnerHTML)throw Error(p(91));return A({},b,{value:void 0,defaultValue:void 0,children:""+a._wrapperState.initialValue})}function hb(a,b){var c=b.value;if(null==c){c=b.children;b=b.defaultValue;if(null!=c){if(null!=b)throw Error(p(92));if(eb(c)){if(1<c.length)throw Error(p(93));c=c[0];}b=c;}null==b&&(b="");c=b;}a._wrapperState={initialValue:Sa(c)};}
	function ib(a,b){var c=Sa(b.value),d=Sa(b.defaultValue);null!=c&&(c=""+c,c!==a.value&&(a.value=c),null==b.defaultValue&&a.defaultValue!==c&&(a.defaultValue=c));null!=d&&(a.defaultValue=""+d);}function jb(a){var b=a.textContent;b===a._wrapperState.initialValue&&""!==b&&null!==b&&(a.value=b);}function kb(a){switch(a){case "svg":return "http://www.w3.org/2000/svg";case "math":return "http://www.w3.org/1998/Math/MathML";default:return "http://www.w3.org/1999/xhtml"}}
	function lb(a,b){return null==a||"http://www.w3.org/1999/xhtml"===a?kb(b):"http://www.w3.org/2000/svg"===a&&"foreignObject"===b?"http://www.w3.org/1999/xhtml":a}
	var mb,nb=function(a){return "undefined"!==typeof MSApp&&MSApp.execUnsafeLocalFunction?function(b,c,d,e){MSApp.execUnsafeLocalFunction(function(){return a(b,c,d,e)});}:a}(function(a,b){if("http://www.w3.org/2000/svg"!==a.namespaceURI||"innerHTML"in a)a.innerHTML=b;else {mb=mb||document.createElement("div");mb.innerHTML="<svg>"+b.valueOf().toString()+"</svg>";for(b=mb.firstChild;a.firstChild;)a.removeChild(a.firstChild);for(;b.firstChild;)a.appendChild(b.firstChild);}});
	function ob(a,b){if(b){var c=a.firstChild;if(c&&c===a.lastChild&&3===c.nodeType){c.nodeValue=b;return}}a.textContent=b;}
	var pb={animationIterationCount:true,aspectRatio:true,borderImageOutset:true,borderImageSlice:true,borderImageWidth:true,boxFlex:true,boxFlexGroup:true,boxOrdinalGroup:true,columnCount:true,columns:true,flex:true,flexGrow:true,flexPositive:true,flexShrink:true,flexNegative:true,flexOrder:true,gridArea:true,gridRow:true,gridRowEnd:true,gridRowSpan:true,gridRowStart:true,gridColumn:true,gridColumnEnd:true,gridColumnSpan:true,gridColumnStart:true,fontWeight:true,lineClamp:true,lineHeight:true,opacity:true,order:true,orphans:true,tabSize:true,widows:true,zIndex:true,
	zoom:true,fillOpacity:true,floodOpacity:true,stopOpacity:true,strokeDasharray:true,strokeDashoffset:true,strokeMiterlimit:true,strokeOpacity:true,strokeWidth:true},qb=["Webkit","ms","Moz","O"];Object.keys(pb).forEach(function(a){qb.forEach(function(b){b=b+a.charAt(0).toUpperCase()+a.substring(1);pb[b]=pb[a];});});function rb(a,b,c){return null==b||"boolean"===typeof b||""===b?"":c||"number"!==typeof b||0===b||pb.hasOwnProperty(a)&&pb[a]?(""+b).trim():b+"px"}
	function sb(a,b){a=a.style;for(var c in b)if(b.hasOwnProperty(c)){var d=0===c.indexOf("--"),e=rb(c,b[c],d);"float"===c&&(c="cssFloat");d?a.setProperty(c,e):a[c]=e;}}var tb=A({menuitem:true},{area:true,base:true,br:true,col:true,embed:true,hr:true,img:true,input:true,keygen:true,link:true,meta:true,param:true,source:true,track:true,wbr:true});
	function ub(a,b){if(b){if(tb[a]&&(null!=b.children||null!=b.dangerouslySetInnerHTML))throw Error(p(137,a));if(null!=b.dangerouslySetInnerHTML){if(null!=b.children)throw Error(p(60));if("object"!==typeof b.dangerouslySetInnerHTML||!("__html"in b.dangerouslySetInnerHTML))throw Error(p(61));}if(null!=b.style&&"object"!==typeof b.style)throw Error(p(62));}}
	function vb(a,b){if(-1===a.indexOf("-"))return "string"===typeof b.is;switch(a){case "annotation-xml":case "color-profile":case "font-face":case "font-face-src":case "font-face-uri":case "font-face-format":case "font-face-name":case "missing-glyph":return  false;default:return  true}}var wb=null;function xb(a){a=a.target||a.srcElement||window;a.correspondingUseElement&&(a=a.correspondingUseElement);return 3===a.nodeType?a.parentNode:a}var yb=null,zb=null,Ab=null;
	function Bb(a){if(a=Cb(a)){if("function"!==typeof yb)throw Error(p(280));var b=a.stateNode;b&&(b=Db(b),yb(a.stateNode,a.type,b));}}function Eb(a){zb?Ab?Ab.push(a):Ab=[a]:zb=a;}function Fb(){if(zb){var a=zb,b=Ab;Ab=zb=null;Bb(a);if(b)for(a=0;a<b.length;a++)Bb(b[a]);}}function Gb(a,b){return a(b)}function Hb(){}var Ib=false;function Jb(a,b,c){if(Ib)return a(b,c);Ib=true;try{return Gb(a,b,c)}finally{if(Ib=false,null!==zb||null!==Ab)Hb(),Fb();}}
	function Kb(a,b){var c=a.stateNode;if(null===c)return null;var d=Db(c);if(null===d)return null;c=d[b];a:switch(b){case "onClick":case "onClickCapture":case "onDoubleClick":case "onDoubleClickCapture":case "onMouseDown":case "onMouseDownCapture":case "onMouseMove":case "onMouseMoveCapture":case "onMouseUp":case "onMouseUpCapture":case "onMouseEnter":(d=!d.disabled)||(a=a.type,d=!("button"===a||"input"===a||"select"===a||"textarea"===a));a=!d;break a;default:a=false;}if(a)return null;if(c&&"function"!==
	typeof c)throw Error(p(231,b,typeof c));return c}var Lb=false;if(ia)try{var Mb={};Object.defineProperty(Mb,"passive",{get:function(){Lb=!0;}});window.addEventListener("test",Mb,Mb);window.removeEventListener("test",Mb,Mb);}catch(a){Lb=false;}function Nb(a,b,c,d,e,f,g,h,k){var l=Array.prototype.slice.call(arguments,3);try{b.apply(c,l);}catch(m){this.onError(m);}}var Ob=false,Pb=null,Qb=false,Rb=null,Sb={onError:function(a){Ob=true;Pb=a;}};function Tb(a,b,c,d,e,f,g,h,k){Ob=false;Pb=null;Nb.apply(Sb,arguments);}
	function Ub(a,b,c,d,e,f,g,h,k){Tb.apply(this,arguments);if(Ob){if(Ob){var l=Pb;Ob=false;Pb=null;}else throw Error(p(198));Qb||(Qb=true,Rb=l);}}function Vb(a){var b=a,c=a;if(a.alternate)for(;b.return;)b=b.return;else {a=b;do b=a,0!==(b.flags&4098)&&(c=b.return),a=b.return;while(a)}return 3===b.tag?c:null}function Wb(a){if(13===a.tag){var b=a.memoizedState;null===b&&(a=a.alternate,null!==a&&(b=a.memoizedState));if(null!==b)return b.dehydrated}return null}function Xb(a){if(Vb(a)!==a)throw Error(p(188));}
	function Yb(a){var b=a.alternate;if(!b){b=Vb(a);if(null===b)throw Error(p(188));return b!==a?null:a}for(var c=a,d=b;;){var e=c.return;if(null===e)break;var f=e.alternate;if(null===f){d=e.return;if(null!==d){c=d;continue}break}if(e.child===f.child){for(f=e.child;f;){if(f===c)return Xb(e),a;if(f===d)return Xb(e),b;f=f.sibling;}throw Error(p(188));}if(c.return!==d.return)c=e,d=f;else {for(var g=false,h=e.child;h;){if(h===c){g=true;c=e;d=f;break}if(h===d){g=true;d=e;c=f;break}h=h.sibling;}if(!g){for(h=f.child;h;){if(h===
	c){g=true;c=f;d=e;break}if(h===d){g=true;d=f;c=e;break}h=h.sibling;}if(!g)throw Error(p(189));}}if(c.alternate!==d)throw Error(p(190));}if(3!==c.tag)throw Error(p(188));return c.stateNode.current===c?a:b}function Zb(a){a=Yb(a);return null!==a?$b(a):null}function $b(a){if(5===a.tag||6===a.tag)return a;for(a=a.child;null!==a;){var b=$b(a);if(null!==b)return b;a=a.sibling;}return null}
	var ac=ca.unstable_scheduleCallback,bc=ca.unstable_cancelCallback,cc=ca.unstable_shouldYield,dc=ca.unstable_requestPaint,B=ca.unstable_now,ec=ca.unstable_getCurrentPriorityLevel,fc=ca.unstable_ImmediatePriority,gc=ca.unstable_UserBlockingPriority,hc=ca.unstable_NormalPriority,ic=ca.unstable_LowPriority,jc=ca.unstable_IdlePriority,kc=null,lc=null;function mc(a){if(lc&&"function"===typeof lc.onCommitFiberRoot)try{lc.onCommitFiberRoot(kc,a,void 0,128===(a.current.flags&128));}catch(b){}}
	var oc=Math.clz32?Math.clz32:nc,pc=Math.log,qc=Math.LN2;function nc(a){a>>>=0;return 0===a?32:31-(pc(a)/qc|0)|0}var rc=64,sc=4194304;
	function tc(a){switch(a&-a){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return a&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return a&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;
	default:return a}}function uc(a,b){var c=a.pendingLanes;if(0===c)return 0;var d=0,e=a.suspendedLanes,f=a.pingedLanes,g=c&268435455;if(0!==g){var h=g&~e;0!==h?d=tc(h):(f&=g,0!==f&&(d=tc(f)));}else g=c&~e,0!==g?d=tc(g):0!==f&&(d=tc(f));if(0===d)return 0;if(0!==b&&b!==d&&0===(b&e)&&(e=d&-d,f=b&-b,e>=f||16===e&&0!==(f&4194240)))return b;0!==(d&4)&&(d|=c&16);b=a.entangledLanes;if(0!==b)for(a=a.entanglements,b&=d;0<b;)c=31-oc(b),e=1<<c,d|=a[c],b&=~e;return d}
	function vc(a,b){switch(a){case 1:case 2:case 4:return b+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return b+5E3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return  -1;case 134217728:case 268435456:case 536870912:case 1073741824:return  -1;default:return  -1}}
	function wc(a,b){for(var c=a.suspendedLanes,d=a.pingedLanes,e=a.expirationTimes,f=a.pendingLanes;0<f;){var g=31-oc(f),h=1<<g,k=e[g];if(-1===k){if(0===(h&c)||0!==(h&d))e[g]=vc(h,b);}else k<=b&&(a.expiredLanes|=h);f&=~h;}}function xc(a){a=a.pendingLanes&-1073741825;return 0!==a?a:a&1073741824?1073741824:0}function yc(){var a=rc;rc<<=1;0===(rc&4194240)&&(rc=64);return a}function zc(a){for(var b=[],c=0;31>c;c++)b.push(a);return b}
	function Ac(a,b,c){a.pendingLanes|=b;536870912!==b&&(a.suspendedLanes=0,a.pingedLanes=0);a=a.eventTimes;b=31-oc(b);a[b]=c;}function Bc(a,b){var c=a.pendingLanes&~b;a.pendingLanes=b;a.suspendedLanes=0;a.pingedLanes=0;a.expiredLanes&=b;a.mutableReadLanes&=b;a.entangledLanes&=b;b=a.entanglements;var d=a.eventTimes;for(a=a.expirationTimes;0<c;){var e=31-oc(c),f=1<<e;b[e]=0;d[e]=-1;a[e]=-1;c&=~f;}}
	function Cc(a,b){var c=a.entangledLanes|=b;for(a=a.entanglements;c;){var d=31-oc(c),e=1<<d;e&b|a[d]&b&&(a[d]|=b);c&=~e;}}var C=0;function Dc(a){a&=-a;return 1<a?4<a?0!==(a&268435455)?16:536870912:4:1}var Ec,Fc,Gc,Hc,Ic,Jc=false,Kc=[],Lc=null,Mc=null,Nc=null,Oc=new Map,Pc=new Map,Qc=[],Rc="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
	function Sc(a,b){switch(a){case "focusin":case "focusout":Lc=null;break;case "dragenter":case "dragleave":Mc=null;break;case "mouseover":case "mouseout":Nc=null;break;case "pointerover":case "pointerout":Oc.delete(b.pointerId);break;case "gotpointercapture":case "lostpointercapture":Pc.delete(b.pointerId);}}
	function Tc(a,b,c,d,e,f){if(null===a||a.nativeEvent!==f)return a={blockedOn:b,domEventName:c,eventSystemFlags:d,nativeEvent:f,targetContainers:[e]},null!==b&&(b=Cb(b),null!==b&&Fc(b)),a;a.eventSystemFlags|=d;b=a.targetContainers;null!==e&&-1===b.indexOf(e)&&b.push(e);return a}
	function Uc(a,b,c,d,e){switch(b){case "focusin":return Lc=Tc(Lc,a,b,c,d,e),true;case "dragenter":return Mc=Tc(Mc,a,b,c,d,e),true;case "mouseover":return Nc=Tc(Nc,a,b,c,d,e),true;case "pointerover":var f=e.pointerId;Oc.set(f,Tc(Oc.get(f)||null,a,b,c,d,e));return  true;case "gotpointercapture":return f=e.pointerId,Pc.set(f,Tc(Pc.get(f)||null,a,b,c,d,e)),true}return  false}
	function Vc(a){var b=Wc(a.target);if(null!==b){var c=Vb(b);if(null!==c)if(b=c.tag,13===b){if(b=Wb(c),null!==b){a.blockedOn=b;Ic(a.priority,function(){Gc(c);});return}}else if(3===b&&c.stateNode.current.memoizedState.isDehydrated){a.blockedOn=3===c.tag?c.stateNode.containerInfo:null;return}}a.blockedOn=null;}
	function Xc(a){if(null!==a.blockedOn)return  false;for(var b=a.targetContainers;0<b.length;){var c=Yc(a.domEventName,a.eventSystemFlags,b[0],a.nativeEvent);if(null===c){c=a.nativeEvent;var d=new c.constructor(c.type,c);wb=d;c.target.dispatchEvent(d);wb=null;}else return b=Cb(c),null!==b&&Fc(b),a.blockedOn=c,false;b.shift();}return  true}function Zc(a,b,c){Xc(a)&&c.delete(b);}function $c(){Jc=false;null!==Lc&&Xc(Lc)&&(Lc=null);null!==Mc&&Xc(Mc)&&(Mc=null);null!==Nc&&Xc(Nc)&&(Nc=null);Oc.forEach(Zc);Pc.forEach(Zc);}
	function ad(a,b){a.blockedOn===b&&(a.blockedOn=null,Jc||(Jc=true,ca.unstable_scheduleCallback(ca.unstable_NormalPriority,$c)));}
	function bd(a){function b(b){return ad(b,a)}if(0<Kc.length){ad(Kc[0],a);for(var c=1;c<Kc.length;c++){var d=Kc[c];d.blockedOn===a&&(d.blockedOn=null);}}null!==Lc&&ad(Lc,a);null!==Mc&&ad(Mc,a);null!==Nc&&ad(Nc,a);Oc.forEach(b);Pc.forEach(b);for(c=0;c<Qc.length;c++)d=Qc[c],d.blockedOn===a&&(d.blockedOn=null);for(;0<Qc.length&&(c=Qc[0],null===c.blockedOn);)Vc(c),null===c.blockedOn&&Qc.shift();}var cd=ua.ReactCurrentBatchConfig,dd=true;
	function ed(a,b,c,d){var e=C,f=cd.transition;cd.transition=null;try{C=1,fd(a,b,c,d);}finally{C=e,cd.transition=f;}}function gd(a,b,c,d){var e=C,f=cd.transition;cd.transition=null;try{C=4,fd(a,b,c,d);}finally{C=e,cd.transition=f;}}
	function fd(a,b,c,d){if(dd){var e=Yc(a,b,c,d);if(null===e)hd(a,b,d,id,c),Sc(a,d);else if(Uc(e,a,b,c,d))d.stopPropagation();else if(Sc(a,d),b&4&&-1<Rc.indexOf(a)){for(;null!==e;){var f=Cb(e);null!==f&&Ec(f);f=Yc(a,b,c,d);null===f&&hd(a,b,d,id,c);if(f===e)break;e=f;}null!==e&&d.stopPropagation();}else hd(a,b,d,null,c);}}var id=null;
	function Yc(a,b,c,d){id=null;a=xb(d);a=Wc(a);if(null!==a)if(b=Vb(a),null===b)a=null;else if(c=b.tag,13===c){a=Wb(b);if(null!==a)return a;a=null;}else if(3===c){if(b.stateNode.current.memoizedState.isDehydrated)return 3===b.tag?b.stateNode.containerInfo:null;a=null;}else b!==a&&(a=null);id=a;return null}
	function jd(a){switch(a){case "cancel":case "click":case "close":case "contextmenu":case "copy":case "cut":case "auxclick":case "dblclick":case "dragend":case "dragstart":case "drop":case "focusin":case "focusout":case "input":case "invalid":case "keydown":case "keypress":case "keyup":case "mousedown":case "mouseup":case "paste":case "pause":case "play":case "pointercancel":case "pointerdown":case "pointerup":case "ratechange":case "reset":case "resize":case "seeked":case "submit":case "touchcancel":case "touchend":case "touchstart":case "volumechange":case "change":case "selectionchange":case "textInput":case "compositionstart":case "compositionend":case "compositionupdate":case "beforeblur":case "afterblur":case "beforeinput":case "blur":case "fullscreenchange":case "focus":case "hashchange":case "popstate":case "select":case "selectstart":return 1;case "drag":case "dragenter":case "dragexit":case "dragleave":case "dragover":case "mousemove":case "mouseout":case "mouseover":case "pointermove":case "pointerout":case "pointerover":case "scroll":case "toggle":case "touchmove":case "wheel":case "mouseenter":case "mouseleave":case "pointerenter":case "pointerleave":return 4;
	case "message":switch(ec()){case fc:return 1;case gc:return 4;case hc:case ic:return 16;case jc:return 536870912;default:return 16}default:return 16}}var kd=null,ld=null,md=null;function nd(){if(md)return md;var a,b=ld,c=b.length,d,e="value"in kd?kd.value:kd.textContent,f=e.length;for(a=0;a<c&&b[a]===e[a];a++);var g=c-a;for(d=1;d<=g&&b[c-d]===e[f-d];d++);return md=e.slice(a,1<d?1-d:void 0)}
	function od(a){var b=a.keyCode;"charCode"in a?(a=a.charCode,0===a&&13===b&&(a=13)):a=b;10===a&&(a=13);return 32<=a||13===a?a:0}function pd(){return  true}function qd(){return  false}
	function rd(a){function b(b,d,e,f,g){this._reactName=b;this._targetInst=e;this.type=d;this.nativeEvent=f;this.target=g;this.currentTarget=null;for(var c in a)a.hasOwnProperty(c)&&(b=a[c],this[c]=b?b(f):f[c]);this.isDefaultPrevented=(null!=f.defaultPrevented?f.defaultPrevented:false===f.returnValue)?pd:qd;this.isPropagationStopped=qd;return this}A(b.prototype,{preventDefault:function(){this.defaultPrevented=true;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():"unknown"!==typeof a.returnValue&&
	(a.returnValue=false),this.isDefaultPrevented=pd);},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():"unknown"!==typeof a.cancelBubble&&(a.cancelBubble=true),this.isPropagationStopped=pd);},persist:function(){},isPersistent:pd});return b}
	var sd={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(a){return a.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},td=rd(sd),ud=A({},sd,{view:0,detail:0}),vd=rd(ud),wd,xd,yd,Ad=A({},ud,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:zd,button:0,buttons:0,relatedTarget:function(a){return void 0===a.relatedTarget?a.fromElement===a.srcElement?a.toElement:a.fromElement:a.relatedTarget},movementX:function(a){if("movementX"in
	a)return a.movementX;a!==yd&&(yd&&"mousemove"===a.type?(wd=a.screenX-yd.screenX,xd=a.screenY-yd.screenY):xd=wd=0,yd=a);return wd},movementY:function(a){return "movementY"in a?a.movementY:xd}}),Bd=rd(Ad),Cd=A({},Ad,{dataTransfer:0}),Dd=rd(Cd),Ed=A({},ud,{relatedTarget:0}),Fd=rd(Ed),Gd=A({},sd,{animationName:0,elapsedTime:0,pseudoElement:0}),Hd=rd(Gd),Id=A({},sd,{clipboardData:function(a){return "clipboardData"in a?a.clipboardData:window.clipboardData}}),Jd=rd(Id),Kd=A({},sd,{data:0}),Ld=rd(Kd),Md={Esc:"Escape",
	Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Nd={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",
	119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Od={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Pd(a){var b=this.nativeEvent;return b.getModifierState?b.getModifierState(a):(a=Od[a])?!!b[a]:false}function zd(){return Pd}
	var Qd=A({},ud,{key:function(a){if(a.key){var b=Md[a.key]||a.key;if("Unidentified"!==b)return b}return "keypress"===a.type?(a=od(a),13===a?"Enter":String.fromCharCode(a)):"keydown"===a.type||"keyup"===a.type?Nd[a.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:zd,charCode:function(a){return "keypress"===a.type?od(a):0},keyCode:function(a){return "keydown"===a.type||"keyup"===a.type?a.keyCode:0},which:function(a){return "keypress"===
	a.type?od(a):"keydown"===a.type||"keyup"===a.type?a.keyCode:0}}),Rd=rd(Qd),Sd=A({},Ad,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Td=rd(Sd),Ud=A({},ud,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:zd}),Vd=rd(Ud),Wd=A({},sd,{propertyName:0,elapsedTime:0,pseudoElement:0}),Xd=rd(Wd),Yd=A({},Ad,{deltaX:function(a){return "deltaX"in a?a.deltaX:"wheelDeltaX"in a?-a.wheelDeltaX:0},
	deltaY:function(a){return "deltaY"in a?a.deltaY:"wheelDeltaY"in a?-a.wheelDeltaY:"wheelDelta"in a?-a.wheelDelta:0},deltaZ:0,deltaMode:0}),Zd=rd(Yd),$d=[9,13,27,32],ae=ia&&"CompositionEvent"in window,be=null;ia&&"documentMode"in document&&(be=document.documentMode);var ce=ia&&"TextEvent"in window&&!be,de=ia&&(!ae||be&&8<be&&11>=be),ee=String.fromCharCode(32),fe=false;
	function ge(a,b){switch(a){case "keyup":return  -1!==$d.indexOf(b.keyCode);case "keydown":return 229!==b.keyCode;case "keypress":case "mousedown":case "focusout":return  true;default:return  false}}function he(a){a=a.detail;return "object"===typeof a&&"data"in a?a.data:null}var ie=false;function je(a,b){switch(a){case "compositionend":return he(b);case "keypress":if(32!==b.which)return null;fe=true;return ee;case "textInput":return a=b.data,a===ee&&fe?null:a;default:return null}}
	function ke(a,b){if(ie)return "compositionend"===a||!ae&&ge(a,b)?(a=nd(),md=ld=kd=null,ie=false,a):null;switch(a){case "paste":return null;case "keypress":if(!(b.ctrlKey||b.altKey||b.metaKey)||b.ctrlKey&&b.altKey){if(b.char&&1<b.char.length)return b.char;if(b.which)return String.fromCharCode(b.which)}return null;case "compositionend":return de&&"ko"!==b.locale?null:b.data;default:return null}}
	var le={color:true,date:true,datetime:true,"datetime-local":true,email:true,month:true,number:true,password:true,range:true,search:true,tel:true,text:true,time:true,url:true,week:true};function me(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return "input"===b?!!le[a.type]:"textarea"===b?true:false}function ne(a,b,c,d){Eb(d);b=oe(b,"onChange");0<b.length&&(c=new td("onChange","change",null,c,d),a.push({event:c,listeners:b}));}var pe=null,qe=null;function re(a){se(a,0);}function te(a){var b=ue(a);if(Wa(b))return a}
	function ve(a,b){if("change"===a)return b}var we=false;if(ia){var xe;if(ia){var ye="oninput"in document;if(!ye){var ze=document.createElement("div");ze.setAttribute("oninput","return;");ye="function"===typeof ze.oninput;}xe=ye;}else xe=false;we=xe&&(!document.documentMode||9<document.documentMode);}function Ae(){pe&&(pe.detachEvent("onpropertychange",Be),qe=pe=null);}function Be(a){if("value"===a.propertyName&&te(qe)){var b=[];ne(b,qe,a,xb(a));Jb(re,b);}}
	function Ce(a,b,c){"focusin"===a?(Ae(),pe=b,qe=c,pe.attachEvent("onpropertychange",Be)):"focusout"===a&&Ae();}function De(a){if("selectionchange"===a||"keyup"===a||"keydown"===a)return te(qe)}function Ee(a,b){if("click"===a)return te(b)}function Fe(a,b){if("input"===a||"change"===a)return te(b)}function Ge(a,b){return a===b&&(0!==a||1/a===1/b)||a!==a&&b!==b}var He="function"===typeof Object.is?Object.is:Ge;
	function Ie(a,b){if(He(a,b))return  true;if("object"!==typeof a||null===a||"object"!==typeof b||null===b)return  false;var c=Object.keys(a),d=Object.keys(b);if(c.length!==d.length)return  false;for(d=0;d<c.length;d++){var e=c[d];if(!ja.call(b,e)||!He(a[e],b[e]))return  false}return  true}function Je(a){for(;a&&a.firstChild;)a=a.firstChild;return a}
	function Ke(a,b){var c=Je(a);a=0;for(var d;c;){if(3===c.nodeType){d=a+c.textContent.length;if(a<=b&&d>=b)return {node:c,offset:b-a};a=d;}a:{for(;c;){if(c.nextSibling){c=c.nextSibling;break a}c=c.parentNode;}c=void 0;}c=Je(c);}}function Le(a,b){return a&&b?a===b?true:a&&3===a.nodeType?false:b&&3===b.nodeType?Le(a,b.parentNode):"contains"in a?a.contains(b):a.compareDocumentPosition?!!(a.compareDocumentPosition(b)&16):false:false}
	function Me(){for(var a=window,b=Xa();b instanceof a.HTMLIFrameElement;){try{var c="string"===typeof b.contentWindow.location.href;}catch(d){c=false;}if(c)a=b.contentWindow;else break;b=Xa(a.document);}return b}function Ne(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return b&&("input"===b&&("text"===a.type||"search"===a.type||"tel"===a.type||"url"===a.type||"password"===a.type)||"textarea"===b||"true"===a.contentEditable)}
	function Oe(a){var b=Me(),c=a.focusedElem,d=a.selectionRange;if(b!==c&&c&&c.ownerDocument&&Le(c.ownerDocument.documentElement,c)){if(null!==d&&Ne(c))if(b=d.start,a=d.end,void 0===a&&(a=b),"selectionStart"in c)c.selectionStart=b,c.selectionEnd=Math.min(a,c.value.length);else if(a=(b=c.ownerDocument||document)&&b.defaultView||window,a.getSelection){a=a.getSelection();var e=c.textContent.length,f=Math.min(d.start,e);d=void 0===d.end?f:Math.min(d.end,e);!a.extend&&f>d&&(e=d,d=f,f=e);e=Ke(c,f);var g=Ke(c,
	d);e&&g&&(1!==a.rangeCount||a.anchorNode!==e.node||a.anchorOffset!==e.offset||a.focusNode!==g.node||a.focusOffset!==g.offset)&&(b=b.createRange(),b.setStart(e.node,e.offset),a.removeAllRanges(),f>d?(a.addRange(b),a.extend(g.node,g.offset)):(b.setEnd(g.node,g.offset),a.addRange(b)));}b=[];for(a=c;a=a.parentNode;)1===a.nodeType&&b.push({element:a,left:a.scrollLeft,top:a.scrollTop});"function"===typeof c.focus&&c.focus();for(c=0;c<b.length;c++)a=b[c],a.element.scrollLeft=a.left,a.element.scrollTop=a.top;}}
	var Pe=ia&&"documentMode"in document&&11>=document.documentMode,Qe=null,Re=null,Se=null,Te=false;
	function Ue(a,b,c){var d=c.window===c?c.document:9===c.nodeType?c:c.ownerDocument;Te||null==Qe||Qe!==Xa(d)||(d=Qe,"selectionStart"in d&&Ne(d)?d={start:d.selectionStart,end:d.selectionEnd}:(d=(d.ownerDocument&&d.ownerDocument.defaultView||window).getSelection(),d={anchorNode:d.anchorNode,anchorOffset:d.anchorOffset,focusNode:d.focusNode,focusOffset:d.focusOffset}),Se&&Ie(Se,d)||(Se=d,d=oe(Re,"onSelect"),0<d.length&&(b=new td("onSelect","select",null,b,c),a.push({event:b,listeners:d}),b.target=Qe)));}
	function Ve(a,b){var c={};c[a.toLowerCase()]=b.toLowerCase();c["Webkit"+a]="webkit"+b;c["Moz"+a]="moz"+b;return c}var We={animationend:Ve("Animation","AnimationEnd"),animationiteration:Ve("Animation","AnimationIteration"),animationstart:Ve("Animation","AnimationStart"),transitionend:Ve("Transition","TransitionEnd")},Xe={},Ye={};
	ia&&(Ye=document.createElement("div").style,"AnimationEvent"in window||(delete We.animationend.animation,delete We.animationiteration.animation,delete We.animationstart.animation),"TransitionEvent"in window||delete We.transitionend.transition);function Ze(a){if(Xe[a])return Xe[a];if(!We[a])return a;var b=We[a],c;for(c in b)if(b.hasOwnProperty(c)&&c in Ye)return Xe[a]=b[c];return a}var $e=Ze("animationend"),af=Ze("animationiteration"),bf=Ze("animationstart"),cf=Ze("transitionend"),df=new Map,ef="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	function ff(a,b){df.set(a,b);fa(b,[a]);}for(var gf=0;gf<ef.length;gf++){var hf=ef[gf],jf=hf.toLowerCase(),kf=hf[0].toUpperCase()+hf.slice(1);ff(jf,"on"+kf);}ff($e,"onAnimationEnd");ff(af,"onAnimationIteration");ff(bf,"onAnimationStart");ff("dblclick","onDoubleClick");ff("focusin","onFocus");ff("focusout","onBlur");ff(cf,"onTransitionEnd");ha("onMouseEnter",["mouseout","mouseover"]);ha("onMouseLeave",["mouseout","mouseover"]);ha("onPointerEnter",["pointerout","pointerover"]);
	ha("onPointerLeave",["pointerout","pointerover"]);fa("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));fa("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));fa("onBeforeInput",["compositionend","keypress","textInput","paste"]);fa("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));fa("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));
	fa("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var lf="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),mf=new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
	function nf(a,b,c){var d=a.type||"unknown-event";a.currentTarget=c;Ub(d,b,void 0,a);a.currentTarget=null;}
	function se(a,b){b=0!==(b&4);for(var c=0;c<a.length;c++){var d=a[c],e=d.event;d=d.listeners;a:{var f=void 0;if(b)for(var g=d.length-1;0<=g;g--){var h=d[g],k=h.instance,l=h.currentTarget;h=h.listener;if(k!==f&&e.isPropagationStopped())break a;nf(e,h,l);f=k;}else for(g=0;g<d.length;g++){h=d[g];k=h.instance;l=h.currentTarget;h=h.listener;if(k!==f&&e.isPropagationStopped())break a;nf(e,h,l);f=k;}}}if(Qb)throw a=Rb,Qb=false,Rb=null,a;}
	function D(a,b){var c=b[of];void 0===c&&(c=b[of]=new Set);var d=a+"__bubble";c.has(d)||(pf(b,a,2,false),c.add(d));}function qf(a,b,c){var d=0;b&&(d|=4);pf(c,a,d,b);}var rf="_reactListening"+Math.random().toString(36).slice(2);function sf(a){if(!a[rf]){a[rf]=true;da.forEach(function(b){"selectionchange"!==b&&(mf.has(b)||qf(b,false,a),qf(b,true,a));});var b=9===a.nodeType?a:a.ownerDocument;null===b||b[rf]||(b[rf]=true,qf("selectionchange",false,b));}}
	function pf(a,b,c,d){switch(jd(b)){case 1:var e=ed;break;case 4:e=gd;break;default:e=fd;}c=e.bind(null,b,c,a);e=void 0;!Lb||"touchstart"!==b&&"touchmove"!==b&&"wheel"!==b||(e=true);d?void 0!==e?a.addEventListener(b,c,{capture:true,passive:e}):a.addEventListener(b,c,true):void 0!==e?a.addEventListener(b,c,{passive:e}):a.addEventListener(b,c,false);}
	function hd(a,b,c,d,e){var f=d;if(0===(b&1)&&0===(b&2)&&null!==d)a:for(;;){if(null===d)return;var g=d.tag;if(3===g||4===g){var h=d.stateNode.containerInfo;if(h===e||8===h.nodeType&&h.parentNode===e)break;if(4===g)for(g=d.return;null!==g;){var k=g.tag;if(3===k||4===k)if(k=g.stateNode.containerInfo,k===e||8===k.nodeType&&k.parentNode===e)return;g=g.return;}for(;null!==h;){g=Wc(h);if(null===g)return;k=g.tag;if(5===k||6===k){d=f=g;continue a}h=h.parentNode;}}d=d.return;}Jb(function(){var d=f,e=xb(c),g=[];
	a:{var h=df.get(a);if(void 0!==h){var k=td,n=a;switch(a){case "keypress":if(0===od(c))break a;case "keydown":case "keyup":k=Rd;break;case "focusin":n="focus";k=Fd;break;case "focusout":n="blur";k=Fd;break;case "beforeblur":case "afterblur":k=Fd;break;case "click":if(2===c.button)break a;case "auxclick":case "dblclick":case "mousedown":case "mousemove":case "mouseup":case "mouseout":case "mouseover":case "contextmenu":k=Bd;break;case "drag":case "dragend":case "dragenter":case "dragexit":case "dragleave":case "dragover":case "dragstart":case "drop":k=
	Dd;break;case "touchcancel":case "touchend":case "touchmove":case "touchstart":k=Vd;break;case $e:case af:case bf:k=Hd;break;case cf:k=Xd;break;case "scroll":k=vd;break;case "wheel":k=Zd;break;case "copy":case "cut":case "paste":k=Jd;break;case "gotpointercapture":case "lostpointercapture":case "pointercancel":case "pointerdown":case "pointermove":case "pointerout":case "pointerover":case "pointerup":k=Td;}var t=0!==(b&4),J=!t&&"scroll"===a,x=t?null!==h?h+"Capture":null:h;t=[];for(var w=d,u;null!==
	w;){u=w;var F=u.stateNode;5===u.tag&&null!==F&&(u=F,null!==x&&(F=Kb(w,x),null!=F&&t.push(tf(w,F,u))));if(J)break;w=w.return;}0<t.length&&(h=new k(h,n,null,c,e),g.push({event:h,listeners:t}));}}if(0===(b&7)){a:{h="mouseover"===a||"pointerover"===a;k="mouseout"===a||"pointerout"===a;if(h&&c!==wb&&(n=c.relatedTarget||c.fromElement)&&(Wc(n)||n[uf]))break a;if(k||h){h=e.window===e?e:(h=e.ownerDocument)?h.defaultView||h.parentWindow:window;if(k){if(n=c.relatedTarget||c.toElement,k=d,n=n?Wc(n):null,null!==
	n&&(J=Vb(n),n!==J||5!==n.tag&&6!==n.tag))n=null;}else k=null,n=d;if(k!==n){t=Bd;F="onMouseLeave";x="onMouseEnter";w="mouse";if("pointerout"===a||"pointerover"===a)t=Td,F="onPointerLeave",x="onPointerEnter",w="pointer";J=null==k?h:ue(k);u=null==n?h:ue(n);h=new t(F,w+"leave",k,c,e);h.target=J;h.relatedTarget=u;F=null;Wc(e)===d&&(t=new t(x,w+"enter",n,c,e),t.target=u,t.relatedTarget=J,F=t);J=F;if(k&&n)b:{t=k;x=n;w=0;for(u=t;u;u=vf(u))w++;u=0;for(F=x;F;F=vf(F))u++;for(;0<w-u;)t=vf(t),w--;for(;0<u-w;)x=
	vf(x),u--;for(;w--;){if(t===x||null!==x&&t===x.alternate)break b;t=vf(t);x=vf(x);}t=null;}else t=null;null!==k&&wf(g,h,k,t,false);null!==n&&null!==J&&wf(g,J,n,t,true);}}}a:{h=d?ue(d):window;k=h.nodeName&&h.nodeName.toLowerCase();if("select"===k||"input"===k&&"file"===h.type)var na=ve;else if(me(h))if(we)na=Fe;else {na=De;var xa=Ce;}else (k=h.nodeName)&&"input"===k.toLowerCase()&&("checkbox"===h.type||"radio"===h.type)&&(na=Ee);if(na&&(na=na(a,d))){ne(g,na,c,e);break a}xa&&xa(a,h,d);"focusout"===a&&(xa=h._wrapperState)&&
	xa.controlled&&"number"===h.type&&cb(h,"number",h.value);}xa=d?ue(d):window;switch(a){case "focusin":if(me(xa)||"true"===xa.contentEditable)Qe=xa,Re=d,Se=null;break;case "focusout":Se=Re=Qe=null;break;case "mousedown":Te=true;break;case "contextmenu":case "mouseup":case "dragend":Te=false;Ue(g,c,e);break;case "selectionchange":if(Pe)break;case "keydown":case "keyup":Ue(g,c,e);}var $a;if(ae)b:{switch(a){case "compositionstart":var ba="onCompositionStart";break b;case "compositionend":ba="onCompositionEnd";
	break b;case "compositionupdate":ba="onCompositionUpdate";break b}ba=void 0;}else ie?ge(a,c)&&(ba="onCompositionEnd"):"keydown"===a&&229===c.keyCode&&(ba="onCompositionStart");ba&&(de&&"ko"!==c.locale&&(ie||"onCompositionStart"!==ba?"onCompositionEnd"===ba&&ie&&($a=nd()):(kd=e,ld="value"in kd?kd.value:kd.textContent,ie=true)),xa=oe(d,ba),0<xa.length&&(ba=new Ld(ba,a,null,c,e),g.push({event:ba,listeners:xa}),$a?ba.data=$a:($a=he(c),null!==$a&&(ba.data=$a))));if($a=ce?je(a,c):ke(a,c))d=oe(d,"onBeforeInput"),
	0<d.length&&(e=new Ld("onBeforeInput","beforeinput",null,c,e),g.push({event:e,listeners:d}),e.data=$a);}se(g,b);});}function tf(a,b,c){return {instance:a,listener:b,currentTarget:c}}function oe(a,b){for(var c=b+"Capture",d=[];null!==a;){var e=a,f=e.stateNode;5===e.tag&&null!==f&&(e=f,f=Kb(a,c),null!=f&&d.unshift(tf(a,f,e)),f=Kb(a,b),null!=f&&d.push(tf(a,f,e)));a=a.return;}return d}function vf(a){if(null===a)return null;do a=a.return;while(a&&5!==a.tag);return a?a:null}
	function wf(a,b,c,d,e){for(var f=b._reactName,g=[];null!==c&&c!==d;){var h=c,k=h.alternate,l=h.stateNode;if(null!==k&&k===d)break;5===h.tag&&null!==l&&(h=l,e?(k=Kb(c,f),null!=k&&g.unshift(tf(c,k,h))):e||(k=Kb(c,f),null!=k&&g.push(tf(c,k,h))));c=c.return;}0!==g.length&&a.push({event:b,listeners:g});}var xf=/\r\n?/g,yf=/\u0000|\uFFFD/g;function zf(a){return ("string"===typeof a?a:""+a).replace(xf,"\n").replace(yf,"")}function Af(a,b,c){b=zf(b);if(zf(a)!==b&&c)throw Error(p(425));}function Bf(){}
	var Cf=null,Df=null;function Ef(a,b){return "textarea"===a||"noscript"===a||"string"===typeof b.children||"number"===typeof b.children||"object"===typeof b.dangerouslySetInnerHTML&&null!==b.dangerouslySetInnerHTML&&null!=b.dangerouslySetInnerHTML.__html}
	var Ff="function"===typeof setTimeout?setTimeout:void 0,Gf="function"===typeof clearTimeout?clearTimeout:void 0,Hf="function"===typeof Promise?Promise:void 0,Jf="function"===typeof queueMicrotask?queueMicrotask:"undefined"!==typeof Hf?function(a){return Hf.resolve(null).then(a).catch(If)}:Ff;function If(a){setTimeout(function(){throw a;});}
	function Kf(a,b){var c=b,d=0;do{var e=c.nextSibling;a.removeChild(c);if(e&&8===e.nodeType)if(c=e.data,"/$"===c){if(0===d){a.removeChild(e);bd(b);return}d--;}else "$"!==c&&"$?"!==c&&"$!"!==c||d++;c=e;}while(c);bd(b);}function Lf(a){for(;null!=a;a=a.nextSibling){var b=a.nodeType;if(1===b||3===b)break;if(8===b){b=a.data;if("$"===b||"$!"===b||"$?"===b)break;if("/$"===b)return null}}return a}
	function Mf(a){a=a.previousSibling;for(var b=0;a;){if(8===a.nodeType){var c=a.data;if("$"===c||"$!"===c||"$?"===c){if(0===b)return a;b--;}else "/$"===c&&b++;}a=a.previousSibling;}return null}var Nf=Math.random().toString(36).slice(2),Of="__reactFiber$"+Nf,Pf="__reactProps$"+Nf,uf="__reactContainer$"+Nf,of="__reactEvents$"+Nf,Qf="__reactListeners$"+Nf,Rf="__reactHandles$"+Nf;
	function Wc(a){var b=a[Of];if(b)return b;for(var c=a.parentNode;c;){if(b=c[uf]||c[Of]){c=b.alternate;if(null!==b.child||null!==c&&null!==c.child)for(a=Mf(a);null!==a;){if(c=a[Of])return c;a=Mf(a);}return b}a=c;c=a.parentNode;}return null}function Cb(a){a=a[Of]||a[uf];return !a||5!==a.tag&&6!==a.tag&&13!==a.tag&&3!==a.tag?null:a}function ue(a){if(5===a.tag||6===a.tag)return a.stateNode;throw Error(p(33));}function Db(a){return a[Pf]||null}var Sf=[],Tf=-1;function Uf(a){return {current:a}}
	function E(a){0>Tf||(a.current=Sf[Tf],Sf[Tf]=null,Tf--);}function G(a,b){Tf++;Sf[Tf]=a.current;a.current=b;}var Vf={},H=Uf(Vf),Wf=Uf(false),Xf=Vf;function Yf(a,b){var c=a.type.contextTypes;if(!c)return Vf;var d=a.stateNode;if(d&&d.__reactInternalMemoizedUnmaskedChildContext===b)return d.__reactInternalMemoizedMaskedChildContext;var e={},f;for(f in c)e[f]=b[f];d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=b,a.__reactInternalMemoizedMaskedChildContext=e);return e}
	function Zf(a){a=a.childContextTypes;return null!==a&&void 0!==a}function $f(){E(Wf);E(H);}function ag(a,b,c){if(H.current!==Vf)throw Error(p(168));G(H,b);G(Wf,c);}function bg(a,b,c){var d=a.stateNode;b=b.childContextTypes;if("function"!==typeof d.getChildContext)return c;d=d.getChildContext();for(var e in d)if(!(e in b))throw Error(p(108,Ra(a)||"Unknown",e));return A({},c,d)}
	function cg(a){a=(a=a.stateNode)&&a.__reactInternalMemoizedMergedChildContext||Vf;Xf=H.current;G(H,a);G(Wf,Wf.current);return  true}function dg(a,b,c){var d=a.stateNode;if(!d)throw Error(p(169));c?(a=bg(a,b,Xf),d.__reactInternalMemoizedMergedChildContext=a,E(Wf),E(H),G(H,a)):E(Wf);G(Wf,c);}var eg=null,fg=false,gg=false;function hg(a){null===eg?eg=[a]:eg.push(a);}function ig(a){fg=true;hg(a);}
	function jg(){if(!gg&&null!==eg){gg=true;var a=0,b=C;try{var c=eg;for(C=1;a<c.length;a++){var d=c[a];do d=d(!0);while(null!==d)}eg=null;fg=!1;}catch(e){throw null!==eg&&(eg=eg.slice(a+1)),ac(fc,jg),e;}finally{C=b,gg=false;}}return null}var kg=[],lg=0,mg=null,ng=0,og=[],pg=0,qg=null,rg=1,sg="";function tg(a,b){kg[lg++]=ng;kg[lg++]=mg;mg=a;ng=b;}
	function ug(a,b,c){og[pg++]=rg;og[pg++]=sg;og[pg++]=qg;qg=a;var d=rg;a=sg;var e=32-oc(d)-1;d&=~(1<<e);c+=1;var f=32-oc(b)+e;if(30<f){var g=e-e%5;f=(d&(1<<g)-1).toString(32);d>>=g;e-=g;rg=1<<32-oc(b)+e|c<<e|d;sg=f+a;}else rg=1<<f|c<<e|d,sg=a;}function vg(a){null!==a.return&&(tg(a,1),ug(a,1,0));}function wg(a){for(;a===mg;)mg=kg[--lg],kg[lg]=null,ng=kg[--lg],kg[lg]=null;for(;a===qg;)qg=og[--pg],og[pg]=null,sg=og[--pg],og[pg]=null,rg=og[--pg],og[pg]=null;}var xg=null,yg=null,I=false,zg=null;
	function Ag(a,b){var c=Bg(5,null,null,0);c.elementType="DELETED";c.stateNode=b;c.return=a;b=a.deletions;null===b?(a.deletions=[c],a.flags|=16):b.push(c);}
	function Cg(a,b){switch(a.tag){case 5:var c=a.type;b=1!==b.nodeType||c.toLowerCase()!==b.nodeName.toLowerCase()?null:b;return null!==b?(a.stateNode=b,xg=a,yg=Lf(b.firstChild),true):false;case 6:return b=""===a.pendingProps||3!==b.nodeType?null:b,null!==b?(a.stateNode=b,xg=a,yg=null,true):false;case 13:return b=8!==b.nodeType?null:b,null!==b?(c=null!==qg?{id:rg,overflow:sg}:null,a.memoizedState={dehydrated:b,treeContext:c,retryLane:1073741824},c=Bg(18,null,null,0),c.stateNode=b,c.return=a,a.child=c,xg=a,yg=
	null,true):false;default:return  false}}function Dg(a){return 0!==(a.mode&1)&&0===(a.flags&128)}function Eg(a){if(I){var b=yg;if(b){var c=b;if(!Cg(a,b)){if(Dg(a))throw Error(p(418));b=Lf(c.nextSibling);var d=xg;b&&Cg(a,b)?Ag(d,c):(a.flags=a.flags&-4097|2,I=false,xg=a);}}else {if(Dg(a))throw Error(p(418));a.flags=a.flags&-4097|2;I=false;xg=a;}}}function Fg(a){for(a=a.return;null!==a&&5!==a.tag&&3!==a.tag&&13!==a.tag;)a=a.return;xg=a;}
	function Gg(a){if(a!==xg)return  false;if(!I)return Fg(a),I=true,false;var b;(b=3!==a.tag)&&!(b=5!==a.tag)&&(b=a.type,b="head"!==b&&"body"!==b&&!Ef(a.type,a.memoizedProps));if(b&&(b=yg)){if(Dg(a))throw Hg(),Error(p(418));for(;b;)Ag(a,b),b=Lf(b.nextSibling);}Fg(a);if(13===a.tag){a=a.memoizedState;a=null!==a?a.dehydrated:null;if(!a)throw Error(p(317));a:{a=a.nextSibling;for(b=0;a;){if(8===a.nodeType){var c=a.data;if("/$"===c){if(0===b){yg=Lf(a.nextSibling);break a}b--;}else "$"!==c&&"$!"!==c&&"$?"!==c||b++;}a=a.nextSibling;}yg=
	null;}}else yg=xg?Lf(a.stateNode.nextSibling):null;return  true}function Hg(){for(var a=yg;a;)a=Lf(a.nextSibling);}function Ig(){yg=xg=null;I=false;}function Jg(a){null===zg?zg=[a]:zg.push(a);}var Kg=ua.ReactCurrentBatchConfig;
	function Lg(a,b,c){a=c.ref;if(null!==a&&"function"!==typeof a&&"object"!==typeof a){if(c._owner){c=c._owner;if(c){if(1!==c.tag)throw Error(p(309));var d=c.stateNode;}if(!d)throw Error(p(147,a));var e=d,f=""+a;if(null!==b&&null!==b.ref&&"function"===typeof b.ref&&b.ref._stringRef===f)return b.ref;b=function(a){var b=e.refs;null===a?delete b[f]:b[f]=a;};b._stringRef=f;return b}if("string"!==typeof a)throw Error(p(284));if(!c._owner)throw Error(p(290,a));}return a}
	function Mg(a,b){a=Object.prototype.toString.call(b);throw Error(p(31,"[object Object]"===a?"object with keys {"+Object.keys(b).join(", ")+"}":a));}function Ng(a){var b=a._init;return b(a._payload)}
	function Og(a){function b(b,c){if(a){var d=b.deletions;null===d?(b.deletions=[c],b.flags|=16):d.push(c);}}function c(c,d){if(!a)return null;for(;null!==d;)b(c,d),d=d.sibling;return null}function d(a,b){for(a=new Map;null!==b;)null!==b.key?a.set(b.key,b):a.set(b.index,b),b=b.sibling;return a}function e(a,b){a=Pg(a,b);a.index=0;a.sibling=null;return a}function f(b,c,d){b.index=d;if(!a)return b.flags|=1048576,c;d=b.alternate;if(null!==d)return d=d.index,d<c?(b.flags|=2,c):d;b.flags|=2;return c}function g(b){a&&
	null===b.alternate&&(b.flags|=2);return b}function h(a,b,c,d){if(null===b||6!==b.tag)return b=Qg(c,a.mode,d),b.return=a,b;b=e(b,c);b.return=a;return b}function k(a,b,c,d){var f=c.type;if(f===ya)return m(a,b,c.props.children,d,c.key);if(null!==b&&(b.elementType===f||"object"===typeof f&&null!==f&&f.$$typeof===Ha&&Ng(f)===b.type))return d=e(b,c.props),d.ref=Lg(a,b,c),d.return=a,d;d=Rg(c.type,c.key,c.props,null,a.mode,d);d.ref=Lg(a,b,c);d.return=a;return d}function l(a,b,c,d){if(null===b||4!==b.tag||
	b.stateNode.containerInfo!==c.containerInfo||b.stateNode.implementation!==c.implementation)return b=Sg(c,a.mode,d),b.return=a,b;b=e(b,c.children||[]);b.return=a;return b}function m(a,b,c,d,f){if(null===b||7!==b.tag)return b=Tg(c,a.mode,d,f),b.return=a,b;b=e(b,c);b.return=a;return b}function q(a,b,c){if("string"===typeof b&&""!==b||"number"===typeof b)return b=Qg(""+b,a.mode,c),b.return=a,b;if("object"===typeof b&&null!==b){switch(b.$$typeof){case va:return c=Rg(b.type,b.key,b.props,null,a.mode,c),
	c.ref=Lg(a,null,b),c.return=a,c;case wa:return b=Sg(b,a.mode,c),b.return=a,b;case Ha:var d=b._init;return q(a,d(b._payload),c)}if(eb(b)||Ka(b))return b=Tg(b,a.mode,c,null),b.return=a,b;Mg(a,b);}return null}function r(a,b,c,d){var e=null!==b?b.key:null;if("string"===typeof c&&""!==c||"number"===typeof c)return null!==e?null:h(a,b,""+c,d);if("object"===typeof c&&null!==c){switch(c.$$typeof){case va:return c.key===e?k(a,b,c,d):null;case wa:return c.key===e?l(a,b,c,d):null;case Ha:return e=c._init,r(a,
	b,e(c._payload),d)}if(eb(c)||Ka(c))return null!==e?null:m(a,b,c,d,null);Mg(a,c);}return null}function y(a,b,c,d,e){if("string"===typeof d&&""!==d||"number"===typeof d)return a=a.get(c)||null,h(b,a,""+d,e);if("object"===typeof d&&null!==d){switch(d.$$typeof){case va:return a=a.get(null===d.key?c:d.key)||null,k(b,a,d,e);case wa:return a=a.get(null===d.key?c:d.key)||null,l(b,a,d,e);case Ha:var f=d._init;return y(a,b,c,f(d._payload),e)}if(eb(d)||Ka(d))return a=a.get(c)||null,m(b,a,d,e,null);Mg(b,d);}return null}
	function n(e,g,h,k){for(var l=null,m=null,u=g,w=g=0,x=null;null!==u&&w<h.length;w++){u.index>w?(x=u,u=null):x=u.sibling;var n=r(e,u,h[w],k);if(null===n){null===u&&(u=x);break}a&&u&&null===n.alternate&&b(e,u);g=f(n,g,w);null===m?l=n:m.sibling=n;m=n;u=x;}if(w===h.length)return c(e,u),I&&tg(e,w),l;if(null===u){for(;w<h.length;w++)u=q(e,h[w],k),null!==u&&(g=f(u,g,w),null===m?l=u:m.sibling=u,m=u);I&&tg(e,w);return l}for(u=d(e,u);w<h.length;w++)x=y(u,e,w,h[w],k),null!==x&&(a&&null!==x.alternate&&u.delete(null===
	x.key?w:x.key),g=f(x,g,w),null===m?l=x:m.sibling=x,m=x);a&&u.forEach(function(a){return b(e,a)});I&&tg(e,w);return l}function t(e,g,h,k){var l=Ka(h);if("function"!==typeof l)throw Error(p(150));h=l.call(h);if(null==h)throw Error(p(151));for(var u=l=null,m=g,w=g=0,x=null,n=h.next();null!==m&&!n.done;w++,n=h.next()){m.index>w?(x=m,m=null):x=m.sibling;var t=r(e,m,n.value,k);if(null===t){null===m&&(m=x);break}a&&m&&null===t.alternate&&b(e,m);g=f(t,g,w);null===u?l=t:u.sibling=t;u=t;m=x;}if(n.done)return c(e,
	m),I&&tg(e,w),l;if(null===m){for(;!n.done;w++,n=h.next())n=q(e,n.value,k),null!==n&&(g=f(n,g,w),null===u?l=n:u.sibling=n,u=n);I&&tg(e,w);return l}for(m=d(e,m);!n.done;w++,n=h.next())n=y(m,e,w,n.value,k),null!==n&&(a&&null!==n.alternate&&m.delete(null===n.key?w:n.key),g=f(n,g,w),null===u?l=n:u.sibling=n,u=n);a&&m.forEach(function(a){return b(e,a)});I&&tg(e,w);return l}function J(a,d,f,h){"object"===typeof f&&null!==f&&f.type===ya&&null===f.key&&(f=f.props.children);if("object"===typeof f&&null!==f){switch(f.$$typeof){case va:a:{for(var k=
	f.key,l=d;null!==l;){if(l.key===k){k=f.type;if(k===ya){if(7===l.tag){c(a,l.sibling);d=e(l,f.props.children);d.return=a;a=d;break a}}else if(l.elementType===k||"object"===typeof k&&null!==k&&k.$$typeof===Ha&&Ng(k)===l.type){c(a,l.sibling);d=e(l,f.props);d.ref=Lg(a,l,f);d.return=a;a=d;break a}c(a,l);break}else b(a,l);l=l.sibling;}f.type===ya?(d=Tg(f.props.children,a.mode,h,f.key),d.return=a,a=d):(h=Rg(f.type,f.key,f.props,null,a.mode,h),h.ref=Lg(a,d,f),h.return=a,a=h);}return g(a);case wa:a:{for(l=f.key;null!==
	d;){if(d.key===l)if(4===d.tag&&d.stateNode.containerInfo===f.containerInfo&&d.stateNode.implementation===f.implementation){c(a,d.sibling);d=e(d,f.children||[]);d.return=a;a=d;break a}else {c(a,d);break}else b(a,d);d=d.sibling;}d=Sg(f,a.mode,h);d.return=a;a=d;}return g(a);case Ha:return l=f._init,J(a,d,l(f._payload),h)}if(eb(f))return n(a,d,f,h);if(Ka(f))return t(a,d,f,h);Mg(a,f);}return "string"===typeof f&&""!==f||"number"===typeof f?(f=""+f,null!==d&&6===d.tag?(c(a,d.sibling),d=e(d,f),d.return=a,a=d):
	(c(a,d),d=Qg(f,a.mode,h),d.return=a,a=d),g(a)):c(a,d)}return J}var Ug=Og(true),Vg=Og(false),Wg=Uf(null),Xg=null,Yg=null,Zg=null;function $g(){Zg=Yg=Xg=null;}function ah(a){var b=Wg.current;E(Wg);a._currentValue=b;}function bh(a,b,c){for(;null!==a;){var d=a.alternate;(a.childLanes&b)!==b?(a.childLanes|=b,null!==d&&(d.childLanes|=b)):null!==d&&(d.childLanes&b)!==b&&(d.childLanes|=b);if(a===c)break;a=a.return;}}
	function ch(a,b){Xg=a;Zg=Yg=null;a=a.dependencies;null!==a&&null!==a.firstContext&&(0!==(a.lanes&b)&&(dh=true),a.firstContext=null);}function eh(a){var b=a._currentValue;if(Zg!==a)if(a={context:a,memoizedValue:b,next:null},null===Yg){if(null===Xg)throw Error(p(308));Yg=a;Xg.dependencies={lanes:0,firstContext:a};}else Yg=Yg.next=a;return b}var fh=null;function gh(a){null===fh?fh=[a]:fh.push(a);}
	function hh(a,b,c,d){var e=b.interleaved;null===e?(c.next=c,gh(b)):(c.next=e.next,e.next=c);b.interleaved=c;return ih(a,d)}function ih(a,b){a.lanes|=b;var c=a.alternate;null!==c&&(c.lanes|=b);c=a;for(a=a.return;null!==a;)a.childLanes|=b,c=a.alternate,null!==c&&(c.childLanes|=b),c=a,a=a.return;return 3===c.tag?c.stateNode:null}var jh=false;function kh(a){a.updateQueue={baseState:a.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null};}
	function lh(a,b){a=a.updateQueue;b.updateQueue===a&&(b.updateQueue={baseState:a.baseState,firstBaseUpdate:a.firstBaseUpdate,lastBaseUpdate:a.lastBaseUpdate,shared:a.shared,effects:a.effects});}function mh(a,b){return {eventTime:a,lane:b,tag:0,payload:null,callback:null,next:null}}
	function nh(a,b,c){var d=a.updateQueue;if(null===d)return null;d=d.shared;if(0!==(K&2)){var e=d.pending;null===e?b.next=b:(b.next=e.next,e.next=b);d.pending=b;return ih(a,c)}e=d.interleaved;null===e?(b.next=b,gh(d)):(b.next=e.next,e.next=b);d.interleaved=b;return ih(a,c)}function oh(a,b,c){b=b.updateQueue;if(null!==b&&(b=b.shared,0!==(c&4194240))){var d=b.lanes;d&=a.pendingLanes;c|=d;b.lanes=c;Cc(a,c);}}
	function ph(a,b){var c=a.updateQueue,d=a.alternate;if(null!==d&&(d=d.updateQueue,c===d)){var e=null,f=null;c=c.firstBaseUpdate;if(null!==c){do{var g={eventTime:c.eventTime,lane:c.lane,tag:c.tag,payload:c.payload,callback:c.callback,next:null};null===f?e=f=g:f=f.next=g;c=c.next;}while(null!==c);null===f?e=f=b:f=f.next=b;}else e=f=b;c={baseState:d.baseState,firstBaseUpdate:e,lastBaseUpdate:f,shared:d.shared,effects:d.effects};a.updateQueue=c;return}a=c.lastBaseUpdate;null===a?c.firstBaseUpdate=b:a.next=
	b;c.lastBaseUpdate=b;}
	function qh(a,b,c,d){var e=a.updateQueue;jh=false;var f=e.firstBaseUpdate,g=e.lastBaseUpdate,h=e.shared.pending;if(null!==h){e.shared.pending=null;var k=h,l=k.next;k.next=null;null===g?f=l:g.next=l;g=k;var m=a.alternate;null!==m&&(m=m.updateQueue,h=m.lastBaseUpdate,h!==g&&(null===h?m.firstBaseUpdate=l:h.next=l,m.lastBaseUpdate=k));}if(null!==f){var q=e.baseState;g=0;m=l=k=null;h=f;do{var r=h.lane,y=h.eventTime;if((d&r)===r){null!==m&&(m=m.next={eventTime:y,lane:0,tag:h.tag,payload:h.payload,callback:h.callback,
	next:null});a:{var n=a,t=h;r=b;y=c;switch(t.tag){case 1:n=t.payload;if("function"===typeof n){q=n.call(y,q,r);break a}q=n;break a;case 3:n.flags=n.flags&-65537|128;case 0:n=t.payload;r="function"===typeof n?n.call(y,q,r):n;if(null===r||void 0===r)break a;q=A({},q,r);break a;case 2:jh=true;}}null!==h.callback&&0!==h.lane&&(a.flags|=64,r=e.effects,null===r?e.effects=[h]:r.push(h));}else y={eventTime:y,lane:r,tag:h.tag,payload:h.payload,callback:h.callback,next:null},null===m?(l=m=y,k=q):m=m.next=y,g|=r;
	h=h.next;if(null===h)if(h=e.shared.pending,null===h)break;else r=h,h=r.next,r.next=null,e.lastBaseUpdate=r,e.shared.pending=null;}while(1);null===m&&(k=q);e.baseState=k;e.firstBaseUpdate=l;e.lastBaseUpdate=m;b=e.shared.interleaved;if(null!==b){e=b;do g|=e.lane,e=e.next;while(e!==b)}else null===f&&(e.shared.lanes=0);rh|=g;a.lanes=g;a.memoizedState=q;}}
	function sh(a,b,c){a=b.effects;b.effects=null;if(null!==a)for(b=0;b<a.length;b++){var d=a[b],e=d.callback;if(null!==e){d.callback=null;d=c;if("function"!==typeof e)throw Error(p(191,e));e.call(d);}}}var th={},uh=Uf(th),vh=Uf(th),wh=Uf(th);function xh(a){if(a===th)throw Error(p(174));return a}
	function yh(a,b){G(wh,b);G(vh,a);G(uh,th);a=b.nodeType;switch(a){case 9:case 11:b=(b=b.documentElement)?b.namespaceURI:lb(null,"");break;default:a=8===a?b.parentNode:b,b=a.namespaceURI||null,a=a.tagName,b=lb(b,a);}E(uh);G(uh,b);}function zh(){E(uh);E(vh);E(wh);}function Ah(a){xh(wh.current);var b=xh(uh.current);var c=lb(b,a.type);b!==c&&(G(vh,a),G(uh,c));}function Bh(a){vh.current===a&&(E(uh),E(vh));}var L=Uf(0);
	function Ch(a){for(var b=a;null!==b;){if(13===b.tag){var c=b.memoizedState;if(null!==c&&(c=c.dehydrated,null===c||"$?"===c.data||"$!"===c.data))return b}else if(19===b.tag&&void 0!==b.memoizedProps.revealOrder){if(0!==(b.flags&128))return b}else if(null!==b.child){b.child.return=b;b=b.child;continue}if(b===a)break;for(;null===b.sibling;){if(null===b.return||b.return===a)return null;b=b.return;}b.sibling.return=b.return;b=b.sibling;}return null}var Dh=[];
	function Eh(){for(var a=0;a<Dh.length;a++)Dh[a]._workInProgressVersionPrimary=null;Dh.length=0;}var Fh=ua.ReactCurrentDispatcher,Gh=ua.ReactCurrentBatchConfig,Hh=0,M=null,N=null,O=null,Ih=false,Jh=false,Kh=0,Lh=0;function P(){throw Error(p(321));}function Mh(a,b){if(null===b)return  false;for(var c=0;c<b.length&&c<a.length;c++)if(!He(a[c],b[c]))return  false;return  true}
	function Nh(a,b,c,d,e,f){Hh=f;M=b;b.memoizedState=null;b.updateQueue=null;b.lanes=0;Fh.current=null===a||null===a.memoizedState?Oh:Ph;a=c(d,e);if(Jh){f=0;do{Jh=false;Kh=0;if(25<=f)throw Error(p(301));f+=1;O=N=null;b.updateQueue=null;Fh.current=Qh;a=c(d,e);}while(Jh)}Fh.current=Rh;b=null!==N&&null!==N.next;Hh=0;O=N=M=null;Ih=false;if(b)throw Error(p(300));return a}function Sh(){var a=0!==Kh;Kh=0;return a}
	function Th(){var a={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};null===O?M.memoizedState=O=a:O=O.next=a;return O}function Uh(){if(null===N){var a=M.alternate;a=null!==a?a.memoizedState:null;}else a=N.next;var b=null===O?M.memoizedState:O.next;if(null!==b)O=b,N=a;else {if(null===a)throw Error(p(310));N=a;a={memoizedState:N.memoizedState,baseState:N.baseState,baseQueue:N.baseQueue,queue:N.queue,next:null};null===O?M.memoizedState=O=a:O=O.next=a;}return O}
	function Vh(a,b){return "function"===typeof b?b(a):b}
	function Wh(a){var b=Uh(),c=b.queue;if(null===c)throw Error(p(311));c.lastRenderedReducer=a;var d=N,e=d.baseQueue,f=c.pending;if(null!==f){if(null!==e){var g=e.next;e.next=f.next;f.next=g;}d.baseQueue=e=f;c.pending=null;}if(null!==e){f=e.next;d=d.baseState;var h=g=null,k=null,l=f;do{var m=l.lane;if((Hh&m)===m)null!==k&&(k=k.next={lane:0,action:l.action,hasEagerState:l.hasEagerState,eagerState:l.eagerState,next:null}),d=l.hasEagerState?l.eagerState:a(d,l.action);else {var q={lane:m,action:l.action,hasEagerState:l.hasEagerState,
	eagerState:l.eagerState,next:null};null===k?(h=k=q,g=d):k=k.next=q;M.lanes|=m;rh|=m;}l=l.next;}while(null!==l&&l!==f);null===k?g=d:k.next=h;He(d,b.memoizedState)||(dh=true);b.memoizedState=d;b.baseState=g;b.baseQueue=k;c.lastRenderedState=d;}a=c.interleaved;if(null!==a){e=a;do f=e.lane,M.lanes|=f,rh|=f,e=e.next;while(e!==a)}else null===e&&(c.lanes=0);return [b.memoizedState,c.dispatch]}
	function Xh(a){var b=Uh(),c=b.queue;if(null===c)throw Error(p(311));c.lastRenderedReducer=a;var d=c.dispatch,e=c.pending,f=b.memoizedState;if(null!==e){c.pending=null;var g=e=e.next;do f=a(f,g.action),g=g.next;while(g!==e);He(f,b.memoizedState)||(dh=true);b.memoizedState=f;null===b.baseQueue&&(b.baseState=f);c.lastRenderedState=f;}return [f,d]}function Yh(){}
	function Zh(a,b){var c=M,d=Uh(),e=b(),f=!He(d.memoizedState,e);f&&(d.memoizedState=e,dh=true);d=d.queue;$h(ai.bind(null,c,d,a),[a]);if(d.getSnapshot!==b||f||null!==O&&O.memoizedState.tag&1){c.flags|=2048;bi(9,ci.bind(null,c,d,e,b),void 0,null);if(null===Q)throw Error(p(349));0!==(Hh&30)||di(c,b,e);}return e}function di(a,b,c){a.flags|=16384;a={getSnapshot:b,value:c};b=M.updateQueue;null===b?(b={lastEffect:null,stores:null},M.updateQueue=b,b.stores=[a]):(c=b.stores,null===c?b.stores=[a]:c.push(a));}
	function ci(a,b,c,d){b.value=c;b.getSnapshot=d;ei(b)&&fi(a);}function ai(a,b,c){return c(function(){ei(b)&&fi(a);})}function ei(a){var b=a.getSnapshot;a=a.value;try{var c=b();return !He(a,c)}catch(d){return  true}}function fi(a){var b=ih(a,1);null!==b&&gi(b,a,1,-1);}
	function hi(a){var b=Th();"function"===typeof a&&(a=a());b.memoizedState=b.baseState=a;a={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Vh,lastRenderedState:a};b.queue=a;a=a.dispatch=ii.bind(null,M,a);return [b.memoizedState,a]}
	function bi(a,b,c,d){a={tag:a,create:b,destroy:c,deps:d,next:null};b=M.updateQueue;null===b?(b={lastEffect:null,stores:null},M.updateQueue=b,b.lastEffect=a.next=a):(c=b.lastEffect,null===c?b.lastEffect=a.next=a:(d=c.next,c.next=a,a.next=d,b.lastEffect=a));return a}function ji(){return Uh().memoizedState}function ki(a,b,c,d){var e=Th();M.flags|=a;e.memoizedState=bi(1|b,c,void 0,void 0===d?null:d);}
	function li(a,b,c,d){var e=Uh();d=void 0===d?null:d;var f=void 0;if(null!==N){var g=N.memoizedState;f=g.destroy;if(null!==d&&Mh(d,g.deps)){e.memoizedState=bi(b,c,f,d);return}}M.flags|=a;e.memoizedState=bi(1|b,c,f,d);}function mi(a,b){return ki(8390656,8,a,b)}function $h(a,b){return li(2048,8,a,b)}function ni(a,b){return li(4,2,a,b)}function oi(a,b){return li(4,4,a,b)}
	function pi(a,b){if("function"===typeof b)return a=a(),b(a),function(){b(null);};if(null!==b&&void 0!==b)return a=a(),b.current=a,function(){b.current=null;}}function qi(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return li(4,4,pi.bind(null,b,a),c)}function ri(){}function si(a,b){var c=Uh();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&Mh(b,d[1]))return d[0];c.memoizedState=[a,b];return a}
	function ti(a,b){var c=Uh();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&Mh(b,d[1]))return d[0];a=a();c.memoizedState=[a,b];return a}function ui(a,b,c){if(0===(Hh&21))return a.baseState&&(a.baseState=false,dh=true),a.memoizedState=c;He(c,b)||(c=yc(),M.lanes|=c,rh|=c,a.baseState=true);return b}function vi(a,b){var c=C;C=0!==c&&4>c?c:4;a(true);var d=Gh.transition;Gh.transition={};try{a(!1),b();}finally{C=c,Gh.transition=d;}}function wi(){return Uh().memoizedState}
	function xi(a,b,c){var d=yi(a);c={lane:d,action:c,hasEagerState:false,eagerState:null,next:null};if(zi(a))Ai(b,c);else if(c=hh(a,b,c,d),null!==c){var e=R();gi(c,a,d,e);Bi(c,b,d);}}
	function ii(a,b,c){var d=yi(a),e={lane:d,action:c,hasEagerState:false,eagerState:null,next:null};if(zi(a))Ai(b,e);else {var f=a.alternate;if(0===a.lanes&&(null===f||0===f.lanes)&&(f=b.lastRenderedReducer,null!==f))try{var g=b.lastRenderedState,h=f(g,c);e.hasEagerState=!0;e.eagerState=h;if(He(h,g)){var k=b.interleaved;null===k?(e.next=e,gh(b)):(e.next=k.next,k.next=e);b.interleaved=e;return}}catch(l){}finally{}c=hh(a,b,e,d);null!==c&&(e=R(),gi(c,a,d,e),Bi(c,b,d));}}
	function zi(a){var b=a.alternate;return a===M||null!==b&&b===M}function Ai(a,b){Jh=Ih=true;var c=a.pending;null===c?b.next=b:(b.next=c.next,c.next=b);a.pending=b;}function Bi(a,b,c){if(0!==(c&4194240)){var d=b.lanes;d&=a.pendingLanes;c|=d;b.lanes=c;Cc(a,c);}}
	var Rh={readContext:eh,useCallback:P,useContext:P,useEffect:P,useImperativeHandle:P,useInsertionEffect:P,useLayoutEffect:P,useMemo:P,useReducer:P,useRef:P,useState:P,useDebugValue:P,useDeferredValue:P,useTransition:P,useMutableSource:P,useSyncExternalStore:P,useId:P,unstable_isNewReconciler:false},Oh={readContext:eh,useCallback:function(a,b){Th().memoizedState=[a,void 0===b?null:b];return a},useContext:eh,useEffect:mi,useImperativeHandle:function(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return ki(4194308,
	4,pi.bind(null,b,a),c)},useLayoutEffect:function(a,b){return ki(4194308,4,a,b)},useInsertionEffect:function(a,b){return ki(4,2,a,b)},useMemo:function(a,b){var c=Th();b=void 0===b?null:b;a=a();c.memoizedState=[a,b];return a},useReducer:function(a,b,c){var d=Th();b=void 0!==c?c(b):b;d.memoizedState=d.baseState=b;a={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:a,lastRenderedState:b};d.queue=a;a=a.dispatch=xi.bind(null,M,a);return [d.memoizedState,a]},useRef:function(a){var b=
	Th();a={current:a};return b.memoizedState=a},useState:hi,useDebugValue:ri,useDeferredValue:function(a){return Th().memoizedState=a},useTransition:function(){var a=hi(false),b=a[0];a=vi.bind(null,a[1]);Th().memoizedState=a;return [b,a]},useMutableSource:function(){},useSyncExternalStore:function(a,b,c){var d=M,e=Th();if(I){if(void 0===c)throw Error(p(407));c=c();}else {c=b();if(null===Q)throw Error(p(349));0!==(Hh&30)||di(d,b,c);}e.memoizedState=c;var f={value:c,getSnapshot:b};e.queue=f;mi(ai.bind(null,d,
	f,a),[a]);d.flags|=2048;bi(9,ci.bind(null,d,f,c,b),void 0,null);return c},useId:function(){var a=Th(),b=Q.identifierPrefix;if(I){var c=sg;var d=rg;c=(d&~(1<<32-oc(d)-1)).toString(32)+c;b=":"+b+"R"+c;c=Kh++;0<c&&(b+="H"+c.toString(32));b+=":";}else c=Lh++,b=":"+b+"r"+c.toString(32)+":";return a.memoizedState=b},unstable_isNewReconciler:false},Ph={readContext:eh,useCallback:si,useContext:eh,useEffect:$h,useImperativeHandle:qi,useInsertionEffect:ni,useLayoutEffect:oi,useMemo:ti,useReducer:Wh,useRef:ji,useState:function(){return Wh(Vh)},
	useDebugValue:ri,useDeferredValue:function(a){var b=Uh();return ui(b,N.memoizedState,a)},useTransition:function(){var a=Wh(Vh)[0],b=Uh().memoizedState;return [a,b]},useMutableSource:Yh,useSyncExternalStore:Zh,useId:wi,unstable_isNewReconciler:false},Qh={readContext:eh,useCallback:si,useContext:eh,useEffect:$h,useImperativeHandle:qi,useInsertionEffect:ni,useLayoutEffect:oi,useMemo:ti,useReducer:Xh,useRef:ji,useState:function(){return Xh(Vh)},useDebugValue:ri,useDeferredValue:function(a){var b=Uh();return null===
	N?b.memoizedState=a:ui(b,N.memoizedState,a)},useTransition:function(){var a=Xh(Vh)[0],b=Uh().memoizedState;return [a,b]},useMutableSource:Yh,useSyncExternalStore:Zh,useId:wi,unstable_isNewReconciler:false};function Ci(a,b){if(a&&a.defaultProps){b=A({},b);a=a.defaultProps;for(var c in a) void 0===b[c]&&(b[c]=a[c]);return b}return b}function Di(a,b,c,d){b=a.memoizedState;c=c(d,b);c=null===c||void 0===c?b:A({},b,c);a.memoizedState=c;0===a.lanes&&(a.updateQueue.baseState=c);}
	var Ei={isMounted:function(a){return (a=a._reactInternals)?Vb(a)===a:false},enqueueSetState:function(a,b,c){a=a._reactInternals;var d=R(),e=yi(a),f=mh(d,e);f.payload=b;void 0!==c&&null!==c&&(f.callback=c);b=nh(a,f,e);null!==b&&(gi(b,a,e,d),oh(b,a,e));},enqueueReplaceState:function(a,b,c){a=a._reactInternals;var d=R(),e=yi(a),f=mh(d,e);f.tag=1;f.payload=b;void 0!==c&&null!==c&&(f.callback=c);b=nh(a,f,e);null!==b&&(gi(b,a,e,d),oh(b,a,e));},enqueueForceUpdate:function(a,b){a=a._reactInternals;var c=R(),d=
	yi(a),e=mh(c,d);e.tag=2;void 0!==b&&null!==b&&(e.callback=b);b=nh(a,e,d);null!==b&&(gi(b,a,d,c),oh(b,a,d));}};function Fi(a,b,c,d,e,f,g){a=a.stateNode;return "function"===typeof a.shouldComponentUpdate?a.shouldComponentUpdate(d,f,g):b.prototype&&b.prototype.isPureReactComponent?!Ie(c,d)||!Ie(e,f):true}
	function Gi(a,b,c){var d=false,e=Vf;var f=b.contextType;"object"===typeof f&&null!==f?f=eh(f):(e=Zf(b)?Xf:H.current,d=b.contextTypes,f=(d=null!==d&&void 0!==d)?Yf(a,e):Vf);b=new b(c,f);a.memoizedState=null!==b.state&&void 0!==b.state?b.state:null;b.updater=Ei;a.stateNode=b;b._reactInternals=a;d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=e,a.__reactInternalMemoizedMaskedChildContext=f);return b}
	function Hi(a,b,c,d){a=b.state;"function"===typeof b.componentWillReceiveProps&&b.componentWillReceiveProps(c,d);"function"===typeof b.UNSAFE_componentWillReceiveProps&&b.UNSAFE_componentWillReceiveProps(c,d);b.state!==a&&Ei.enqueueReplaceState(b,b.state,null);}
	function Ii(a,b,c,d){var e=a.stateNode;e.props=c;e.state=a.memoizedState;e.refs={};kh(a);var f=b.contextType;"object"===typeof f&&null!==f?e.context=eh(f):(f=Zf(b)?Xf:H.current,e.context=Yf(a,f));e.state=a.memoizedState;f=b.getDerivedStateFromProps;"function"===typeof f&&(Di(a,b,f,c),e.state=a.memoizedState);"function"===typeof b.getDerivedStateFromProps||"function"===typeof e.getSnapshotBeforeUpdate||"function"!==typeof e.UNSAFE_componentWillMount&&"function"!==typeof e.componentWillMount||(b=e.state,
	"function"===typeof e.componentWillMount&&e.componentWillMount(),"function"===typeof e.UNSAFE_componentWillMount&&e.UNSAFE_componentWillMount(),b!==e.state&&Ei.enqueueReplaceState(e,e.state,null),qh(a,c,e,d),e.state=a.memoizedState);"function"===typeof e.componentDidMount&&(a.flags|=4194308);}function Ji(a,b){try{var c="",d=b;do c+=Pa(d),d=d.return;while(d);var e=c;}catch(f){e="\nError generating stack: "+f.message+"\n"+f.stack;}return {value:a,source:b,stack:e,digest:null}}
	function Ki(a,b,c){return {value:a,source:null,stack:null!=c?c:null,digest:null!=b?b:null}}function Li(a,b){try{console.error(b.value);}catch(c){setTimeout(function(){throw c;});}}var Mi="function"===typeof WeakMap?WeakMap:Map;function Ni(a,b,c){c=mh(-1,c);c.tag=3;c.payload={element:null};var d=b.value;c.callback=function(){Oi||(Oi=true,Pi=d);Li(a,b);};return c}
	function Qi(a,b,c){c=mh(-1,c);c.tag=3;var d=a.type.getDerivedStateFromError;if("function"===typeof d){var e=b.value;c.payload=function(){return d(e)};c.callback=function(){Li(a,b);};}var f=a.stateNode;null!==f&&"function"===typeof f.componentDidCatch&&(c.callback=function(){Li(a,b);"function"!==typeof d&&(null===Ri?Ri=new Set([this]):Ri.add(this));var c=b.stack;this.componentDidCatch(b.value,{componentStack:null!==c?c:""});});return c}
	function Si(a,b,c){var d=a.pingCache;if(null===d){d=a.pingCache=new Mi;var e=new Set;d.set(b,e);}else e=d.get(b),void 0===e&&(e=new Set,d.set(b,e));e.has(c)||(e.add(c),a=Ti.bind(null,a,b,c),b.then(a,a));}function Ui(a){do{var b;if(b=13===a.tag)b=a.memoizedState,b=null!==b?null!==b.dehydrated?true:false:true;if(b)return a;a=a.return;}while(null!==a);return null}
	function Vi(a,b,c,d,e){if(0===(a.mode&1))return a===b?a.flags|=65536:(a.flags|=128,c.flags|=131072,c.flags&=-52805,1===c.tag&&(null===c.alternate?c.tag=17:(b=mh(-1,1),b.tag=2,nh(c,b,1))),c.lanes|=1),a;a.flags|=65536;a.lanes=e;return a}var Wi=ua.ReactCurrentOwner,dh=false;function Xi(a,b,c,d){b.child=null===a?Vg(b,null,c,d):Ug(b,a.child,c,d);}
	function Yi(a,b,c,d,e){c=c.render;var f=b.ref;ch(b,e);d=Nh(a,b,c,d,f,e);c=Sh();if(null!==a&&!dh)return b.updateQueue=a.updateQueue,b.flags&=-2053,a.lanes&=~e,Zi(a,b,e);I&&c&&vg(b);b.flags|=1;Xi(a,b,d,e);return b.child}
	function $i(a,b,c,d,e){if(null===a){var f=c.type;if("function"===typeof f&&!aj(f)&&void 0===f.defaultProps&&null===c.compare&&void 0===c.defaultProps)return b.tag=15,b.type=f,bj(a,b,f,d,e);a=Rg(c.type,null,d,b,b.mode,e);a.ref=b.ref;a.return=b;return b.child=a}f=a.child;if(0===(a.lanes&e)){var g=f.memoizedProps;c=c.compare;c=null!==c?c:Ie;if(c(g,d)&&a.ref===b.ref)return Zi(a,b,e)}b.flags|=1;a=Pg(f,d);a.ref=b.ref;a.return=b;return b.child=a}
	function bj(a,b,c,d,e){if(null!==a){var f=a.memoizedProps;if(Ie(f,d)&&a.ref===b.ref)if(dh=false,b.pendingProps=d=f,0!==(a.lanes&e))0!==(a.flags&131072)&&(dh=true);else return b.lanes=a.lanes,Zi(a,b,e)}return cj(a,b,c,d,e)}
	function dj(a,b,c){var d=b.pendingProps,e=d.children,f=null!==a?a.memoizedState:null;if("hidden"===d.mode)if(0===(b.mode&1))b.memoizedState={baseLanes:0,cachePool:null,transitions:null},G(ej,fj),fj|=c;else {if(0===(c&1073741824))return a=null!==f?f.baseLanes|c:c,b.lanes=b.childLanes=1073741824,b.memoizedState={baseLanes:a,cachePool:null,transitions:null},b.updateQueue=null,G(ej,fj),fj|=a,null;b.memoizedState={baseLanes:0,cachePool:null,transitions:null};d=null!==f?f.baseLanes:c;G(ej,fj);fj|=d;}else null!==
	f?(d=f.baseLanes|c,b.memoizedState=null):d=c,G(ej,fj),fj|=d;Xi(a,b,e,c);return b.child}function gj(a,b){var c=b.ref;if(null===a&&null!==c||null!==a&&a.ref!==c)b.flags|=512,b.flags|=2097152;}function cj(a,b,c,d,e){var f=Zf(c)?Xf:H.current;f=Yf(b,f);ch(b,e);c=Nh(a,b,c,d,f,e);d=Sh();if(null!==a&&!dh)return b.updateQueue=a.updateQueue,b.flags&=-2053,a.lanes&=~e,Zi(a,b,e);I&&d&&vg(b);b.flags|=1;Xi(a,b,c,e);return b.child}
	function hj(a,b,c,d,e){if(Zf(c)){var f=true;cg(b);}else f=false;ch(b,e);if(null===b.stateNode)ij(a,b),Gi(b,c,d),Ii(b,c,d,e),d=true;else if(null===a){var g=b.stateNode,h=b.memoizedProps;g.props=h;var k=g.context,l=c.contextType;"object"===typeof l&&null!==l?l=eh(l):(l=Zf(c)?Xf:H.current,l=Yf(b,l));var m=c.getDerivedStateFromProps,q="function"===typeof m||"function"===typeof g.getSnapshotBeforeUpdate;q||"function"!==typeof g.UNSAFE_componentWillReceiveProps&&"function"!==typeof g.componentWillReceiveProps||
	(h!==d||k!==l)&&Hi(b,g,d,l);jh=false;var r=b.memoizedState;g.state=r;qh(b,d,g,e);k=b.memoizedState;h!==d||r!==k||Wf.current||jh?("function"===typeof m&&(Di(b,c,m,d),k=b.memoizedState),(h=jh||Fi(b,c,h,d,r,k,l))?(q||"function"!==typeof g.UNSAFE_componentWillMount&&"function"!==typeof g.componentWillMount||("function"===typeof g.componentWillMount&&g.componentWillMount(),"function"===typeof g.UNSAFE_componentWillMount&&g.UNSAFE_componentWillMount()),"function"===typeof g.componentDidMount&&(b.flags|=4194308)):
	("function"===typeof g.componentDidMount&&(b.flags|=4194308),b.memoizedProps=d,b.memoizedState=k),g.props=d,g.state=k,g.context=l,d=h):("function"===typeof g.componentDidMount&&(b.flags|=4194308),d=false);}else {g=b.stateNode;lh(a,b);h=b.memoizedProps;l=b.type===b.elementType?h:Ci(b.type,h);g.props=l;q=b.pendingProps;r=g.context;k=c.contextType;"object"===typeof k&&null!==k?k=eh(k):(k=Zf(c)?Xf:H.current,k=Yf(b,k));var y=c.getDerivedStateFromProps;(m="function"===typeof y||"function"===typeof g.getSnapshotBeforeUpdate)||
	"function"!==typeof g.UNSAFE_componentWillReceiveProps&&"function"!==typeof g.componentWillReceiveProps||(h!==q||r!==k)&&Hi(b,g,d,k);jh=false;r=b.memoizedState;g.state=r;qh(b,d,g,e);var n=b.memoizedState;h!==q||r!==n||Wf.current||jh?("function"===typeof y&&(Di(b,c,y,d),n=b.memoizedState),(l=jh||Fi(b,c,l,d,r,n,k)||false)?(m||"function"!==typeof g.UNSAFE_componentWillUpdate&&"function"!==typeof g.componentWillUpdate||("function"===typeof g.componentWillUpdate&&g.componentWillUpdate(d,n,k),"function"===typeof g.UNSAFE_componentWillUpdate&&
	g.UNSAFE_componentWillUpdate(d,n,k)),"function"===typeof g.componentDidUpdate&&(b.flags|=4),"function"===typeof g.getSnapshotBeforeUpdate&&(b.flags|=1024)):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&r===a.memoizedState||(b.flags|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&r===a.memoizedState||(b.flags|=1024),b.memoizedProps=d,b.memoizedState=n),g.props=d,g.state=n,g.context=k,d=l):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&r===
	a.memoizedState||(b.flags|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&r===a.memoizedState||(b.flags|=1024),d=false);}return jj(a,b,c,d,f,e)}
	function jj(a,b,c,d,e,f){gj(a,b);var g=0!==(b.flags&128);if(!d&&!g)return e&&dg(b,c,false),Zi(a,b,f);d=b.stateNode;Wi.current=b;var h=g&&"function"!==typeof c.getDerivedStateFromError?null:d.render();b.flags|=1;null!==a&&g?(b.child=Ug(b,a.child,null,f),b.child=Ug(b,null,h,f)):Xi(a,b,h,f);b.memoizedState=d.state;e&&dg(b,c,true);return b.child}function kj(a){var b=a.stateNode;b.pendingContext?ag(a,b.pendingContext,b.pendingContext!==b.context):b.context&&ag(a,b.context,false);yh(a,b.containerInfo);}
	function lj(a,b,c,d,e){Ig();Jg(e);b.flags|=256;Xi(a,b,c,d);return b.child}var mj={dehydrated:null,treeContext:null,retryLane:0};function nj(a){return {baseLanes:a,cachePool:null,transitions:null}}
	function oj(a,b,c){var d=b.pendingProps,e=L.current,f=false,g=0!==(b.flags&128),h;(h=g)||(h=null!==a&&null===a.memoizedState?false:0!==(e&2));if(h)f=true,b.flags&=-129;else if(null===a||null!==a.memoizedState)e|=1;G(L,e&1);if(null===a){Eg(b);a=b.memoizedState;if(null!==a&&(a=a.dehydrated,null!==a))return 0===(b.mode&1)?b.lanes=1:"$!"===a.data?b.lanes=8:b.lanes=1073741824,null;g=d.children;a=d.fallback;return f?(d=b.mode,f=b.child,g={mode:"hidden",children:g},0===(d&1)&&null!==f?(f.childLanes=0,f.pendingProps=
	g):f=pj(g,d,0,null),a=Tg(a,d,c,null),f.return=b,a.return=b,f.sibling=a,b.child=f,b.child.memoizedState=nj(c),b.memoizedState=mj,a):qj(b,g)}e=a.memoizedState;if(null!==e&&(h=e.dehydrated,null!==h))return rj(a,b,g,d,h,e,c);if(f){f=d.fallback;g=b.mode;e=a.child;h=e.sibling;var k={mode:"hidden",children:d.children};0===(g&1)&&b.child!==e?(d=b.child,d.childLanes=0,d.pendingProps=k,b.deletions=null):(d=Pg(e,k),d.subtreeFlags=e.subtreeFlags&14680064);null!==h?f=Pg(h,f):(f=Tg(f,g,c,null),f.flags|=2);f.return=
	b;d.return=b;d.sibling=f;b.child=d;d=f;f=b.child;g=a.child.memoizedState;g=null===g?nj(c):{baseLanes:g.baseLanes|c,cachePool:null,transitions:g.transitions};f.memoizedState=g;f.childLanes=a.childLanes&~c;b.memoizedState=mj;return d}f=a.child;a=f.sibling;d=Pg(f,{mode:"visible",children:d.children});0===(b.mode&1)&&(d.lanes=c);d.return=b;d.sibling=null;null!==a&&(c=b.deletions,null===c?(b.deletions=[a],b.flags|=16):c.push(a));b.child=d;b.memoizedState=null;return d}
	function qj(a,b){b=pj({mode:"visible",children:b},a.mode,0,null);b.return=a;return a.child=b}function sj(a,b,c,d){null!==d&&Jg(d);Ug(b,a.child,null,c);a=qj(b,b.pendingProps.children);a.flags|=2;b.memoizedState=null;return a}
	function rj(a,b,c,d,e,f,g){if(c){if(b.flags&256)return b.flags&=-257,d=Ki(Error(p(422))),sj(a,b,g,d);if(null!==b.memoizedState)return b.child=a.child,b.flags|=128,null;f=d.fallback;e=b.mode;d=pj({mode:"visible",children:d.children},e,0,null);f=Tg(f,e,g,null);f.flags|=2;d.return=b;f.return=b;d.sibling=f;b.child=d;0!==(b.mode&1)&&Ug(b,a.child,null,g);b.child.memoizedState=nj(g);b.memoizedState=mj;return f}if(0===(b.mode&1))return sj(a,b,g,null);if("$!"===e.data){d=e.nextSibling&&e.nextSibling.dataset;
	if(d)var h=d.dgst;d=h;f=Error(p(419));d=Ki(f,d,void 0);return sj(a,b,g,d)}h=0!==(g&a.childLanes);if(dh||h){d=Q;if(null!==d){switch(g&-g){case 4:e=2;break;case 16:e=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:e=32;break;case 536870912:e=268435456;break;default:e=0;}e=0!==(e&(d.suspendedLanes|g))?0:e;
	0!==e&&e!==f.retryLane&&(f.retryLane=e,ih(a,e),gi(d,a,e,-1));}tj();d=Ki(Error(p(421)));return sj(a,b,g,d)}if("$?"===e.data)return b.flags|=128,b.child=a.child,b=uj.bind(null,a),e._reactRetry=b,null;a=f.treeContext;yg=Lf(e.nextSibling);xg=b;I=true;zg=null;null!==a&&(og[pg++]=rg,og[pg++]=sg,og[pg++]=qg,rg=a.id,sg=a.overflow,qg=b);b=qj(b,d.children);b.flags|=4096;return b}function vj(a,b,c){a.lanes|=b;var d=a.alternate;null!==d&&(d.lanes|=b);bh(a.return,b,c);}
	function wj(a,b,c,d,e){var f=a.memoizedState;null===f?a.memoizedState={isBackwards:b,rendering:null,renderingStartTime:0,last:d,tail:c,tailMode:e}:(f.isBackwards=b,f.rendering=null,f.renderingStartTime=0,f.last=d,f.tail=c,f.tailMode=e);}
	function xj(a,b,c){var d=b.pendingProps,e=d.revealOrder,f=d.tail;Xi(a,b,d.children,c);d=L.current;if(0!==(d&2))d=d&1|2,b.flags|=128;else {if(null!==a&&0!==(a.flags&128))a:for(a=b.child;null!==a;){if(13===a.tag)null!==a.memoizedState&&vj(a,c,b);else if(19===a.tag)vj(a,c,b);else if(null!==a.child){a.child.return=a;a=a.child;continue}if(a===b)break a;for(;null===a.sibling;){if(null===a.return||a.return===b)break a;a=a.return;}a.sibling.return=a.return;a=a.sibling;}d&=1;}G(L,d);if(0===(b.mode&1))b.memoizedState=
	null;else switch(e){case "forwards":c=b.child;for(e=null;null!==c;)a=c.alternate,null!==a&&null===Ch(a)&&(e=c),c=c.sibling;c=e;null===c?(e=b.child,b.child=null):(e=c.sibling,c.sibling=null);wj(b,false,e,c,f);break;case "backwards":c=null;e=b.child;for(b.child=null;null!==e;){a=e.alternate;if(null!==a&&null===Ch(a)){b.child=e;break}a=e.sibling;e.sibling=c;c=e;e=a;}wj(b,true,c,null,f);break;case "together":wj(b,false,null,null,void 0);break;default:b.memoizedState=null;}return b.child}
	function ij(a,b){0===(b.mode&1)&&null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2);}function Zi(a,b,c){null!==a&&(b.dependencies=a.dependencies);rh|=b.lanes;if(0===(c&b.childLanes))return null;if(null!==a&&b.child!==a.child)throw Error(p(153));if(null!==b.child){a=b.child;c=Pg(a,a.pendingProps);b.child=c;for(c.return=b;null!==a.sibling;)a=a.sibling,c=c.sibling=Pg(a,a.pendingProps),c.return=b;c.sibling=null;}return b.child}
	function yj(a,b,c){switch(b.tag){case 3:kj(b);Ig();break;case 5:Ah(b);break;case 1:Zf(b.type)&&cg(b);break;case 4:yh(b,b.stateNode.containerInfo);break;case 10:var d=b.type._context,e=b.memoizedProps.value;G(Wg,d._currentValue);d._currentValue=e;break;case 13:d=b.memoizedState;if(null!==d){if(null!==d.dehydrated)return G(L,L.current&1),b.flags|=128,null;if(0!==(c&b.child.childLanes))return oj(a,b,c);G(L,L.current&1);a=Zi(a,b,c);return null!==a?a.sibling:null}G(L,L.current&1);break;case 19:d=0!==(c&
	b.childLanes);if(0!==(a.flags&128)){if(d)return xj(a,b,c);b.flags|=128;}e=b.memoizedState;null!==e&&(e.rendering=null,e.tail=null,e.lastEffect=null);G(L,L.current);if(d)break;else return null;case 22:case 23:return b.lanes=0,dj(a,b,c)}return Zi(a,b,c)}var zj,Aj,Bj,Cj;
	zj=function(a,b){for(var c=b.child;null!==c;){if(5===c.tag||6===c.tag)a.appendChild(c.stateNode);else if(4!==c.tag&&null!==c.child){c.child.return=c;c=c.child;continue}if(c===b)break;for(;null===c.sibling;){if(null===c.return||c.return===b)return;c=c.return;}c.sibling.return=c.return;c=c.sibling;}};Aj=function(){};
	Bj=function(a,b,c,d){var e=a.memoizedProps;if(e!==d){a=b.stateNode;xh(uh.current);var f=null;switch(c){case "input":e=Ya(a,e);d=Ya(a,d);f=[];break;case "select":e=A({},e,{value:void 0});d=A({},d,{value:void 0});f=[];break;case "textarea":e=gb(a,e);d=gb(a,d);f=[];break;default:"function"!==typeof e.onClick&&"function"===typeof d.onClick&&(a.onclick=Bf);}ub(c,d);var g;c=null;for(l in e)if(!d.hasOwnProperty(l)&&e.hasOwnProperty(l)&&null!=e[l])if("style"===l){var h=e[l];for(g in h)h.hasOwnProperty(g)&&
	(c||(c={}),c[g]="");}else "dangerouslySetInnerHTML"!==l&&"children"!==l&&"suppressContentEditableWarning"!==l&&"suppressHydrationWarning"!==l&&"autoFocus"!==l&&(ea.hasOwnProperty(l)?f||(f=[]):(f=f||[]).push(l,null));for(l in d){var k=d[l];h=null!=e?e[l]:void 0;if(d.hasOwnProperty(l)&&k!==h&&(null!=k||null!=h))if("style"===l)if(h){for(g in h)!h.hasOwnProperty(g)||k&&k.hasOwnProperty(g)||(c||(c={}),c[g]="");for(g in k)k.hasOwnProperty(g)&&h[g]!==k[g]&&(c||(c={}),c[g]=k[g]);}else c||(f||(f=[]),f.push(l,
	c)),c=k;else "dangerouslySetInnerHTML"===l?(k=k?k.__html:void 0,h=h?h.__html:void 0,null!=k&&h!==k&&(f=f||[]).push(l,k)):"children"===l?"string"!==typeof k&&"number"!==typeof k||(f=f||[]).push(l,""+k):"suppressContentEditableWarning"!==l&&"suppressHydrationWarning"!==l&&(ea.hasOwnProperty(l)?(null!=k&&"onScroll"===l&&D("scroll",a),f||h===k||(f=[])):(f=f||[]).push(l,k));}c&&(f=f||[]).push("style",c);var l=f;if(b.updateQueue=l)b.flags|=4;}};Cj=function(a,b,c,d){c!==d&&(b.flags|=4);};
	function Dj(a,b){if(!I)switch(a.tailMode){case "hidden":b=a.tail;for(var c=null;null!==b;)null!==b.alternate&&(c=b),b=b.sibling;null===c?a.tail=null:c.sibling=null;break;case "collapsed":c=a.tail;for(var d=null;null!==c;)null!==c.alternate&&(d=c),c=c.sibling;null===d?b||null===a.tail?a.tail=null:a.tail.sibling=null:d.sibling=null;}}
	function S(a){var b=null!==a.alternate&&a.alternate.child===a.child,c=0,d=0;if(b)for(var e=a.child;null!==e;)c|=e.lanes|e.childLanes,d|=e.subtreeFlags&14680064,d|=e.flags&14680064,e.return=a,e=e.sibling;else for(e=a.child;null!==e;)c|=e.lanes|e.childLanes,d|=e.subtreeFlags,d|=e.flags,e.return=a,e=e.sibling;a.subtreeFlags|=d;a.childLanes=c;return b}
	function Ej(a,b,c){var d=b.pendingProps;wg(b);switch(b.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return S(b),null;case 1:return Zf(b.type)&&$f(),S(b),null;case 3:d=b.stateNode;zh();E(Wf);E(H);Eh();d.pendingContext&&(d.context=d.pendingContext,d.pendingContext=null);if(null===a||null===a.child)Gg(b)?b.flags|=4:null===a||a.memoizedState.isDehydrated&&0===(b.flags&256)||(b.flags|=1024,null!==zg&&(Fj(zg),zg=null));Aj(a,b);S(b);return null;case 5:Bh(b);var e=xh(wh.current);
	c=b.type;if(null!==a&&null!=b.stateNode)Bj(a,b,c,d,e),a.ref!==b.ref&&(b.flags|=512,b.flags|=2097152);else {if(!d){if(null===b.stateNode)throw Error(p(166));S(b);return null}a=xh(uh.current);if(Gg(b)){d=b.stateNode;c=b.type;var f=b.memoizedProps;d[Of]=b;d[Pf]=f;a=0!==(b.mode&1);switch(c){case "dialog":D("cancel",d);D("close",d);break;case "iframe":case "object":case "embed":D("load",d);break;case "video":case "audio":for(e=0;e<lf.length;e++)D(lf[e],d);break;case "source":D("error",d);break;case "img":case "image":case "link":D("error",
	d);D("load",d);break;case "details":D("toggle",d);break;case "input":Za(d,f);D("invalid",d);break;case "select":d._wrapperState={wasMultiple:!!f.multiple};D("invalid",d);break;case "textarea":hb(d,f),D("invalid",d);}ub(c,f);e=null;for(var g in f)if(f.hasOwnProperty(g)){var h=f[g];"children"===g?"string"===typeof h?d.textContent!==h&&(true!==f.suppressHydrationWarning&&Af(d.textContent,h,a),e=["children",h]):"number"===typeof h&&d.textContent!==""+h&&(true!==f.suppressHydrationWarning&&Af(d.textContent,
	h,a),e=["children",""+h]):ea.hasOwnProperty(g)&&null!=h&&"onScroll"===g&&D("scroll",d);}switch(c){case "input":Va(d);db(d,f,true);break;case "textarea":Va(d);jb(d);break;case "select":case "option":break;default:"function"===typeof f.onClick&&(d.onclick=Bf);}d=e;b.updateQueue=d;null!==d&&(b.flags|=4);}else {g=9===e.nodeType?e:e.ownerDocument;"http://www.w3.org/1999/xhtml"===a&&(a=kb(c));"http://www.w3.org/1999/xhtml"===a?"script"===c?(a=g.createElement("div"),a.innerHTML="<script>\x3c/script>",a=a.removeChild(a.firstChild)):
	"string"===typeof d.is?a=g.createElement(c,{is:d.is}):(a=g.createElement(c),"select"===c&&(g=a,d.multiple?g.multiple=true:d.size&&(g.size=d.size))):a=g.createElementNS(a,c);a[Of]=b;a[Pf]=d;zj(a,b,false,false);b.stateNode=a;a:{g=vb(c,d);switch(c){case "dialog":D("cancel",a);D("close",a);e=d;break;case "iframe":case "object":case "embed":D("load",a);e=d;break;case "video":case "audio":for(e=0;e<lf.length;e++)D(lf[e],a);e=d;break;case "source":D("error",a);e=d;break;case "img":case "image":case "link":D("error",
	a);D("load",a);e=d;break;case "details":D("toggle",a);e=d;break;case "input":Za(a,d);e=Ya(a,d);D("invalid",a);break;case "option":e=d;break;case "select":a._wrapperState={wasMultiple:!!d.multiple};e=A({},d,{value:void 0});D("invalid",a);break;case "textarea":hb(a,d);e=gb(a,d);D("invalid",a);break;default:e=d;}ub(c,e);h=e;for(f in h)if(h.hasOwnProperty(f)){var k=h[f];"style"===f?sb(a,k):"dangerouslySetInnerHTML"===f?(k=k?k.__html:void 0,null!=k&&nb(a,k)):"children"===f?"string"===typeof k?("textarea"!==
	c||""!==k)&&ob(a,k):"number"===typeof k&&ob(a,""+k):"suppressContentEditableWarning"!==f&&"suppressHydrationWarning"!==f&&"autoFocus"!==f&&(ea.hasOwnProperty(f)?null!=k&&"onScroll"===f&&D("scroll",a):null!=k&&ta(a,f,k,g));}switch(c){case "input":Va(a);db(a,d,false);break;case "textarea":Va(a);jb(a);break;case "option":null!=d.value&&a.setAttribute("value",""+Sa(d.value));break;case "select":a.multiple=!!d.multiple;f=d.value;null!=f?fb(a,!!d.multiple,f,false):null!=d.defaultValue&&fb(a,!!d.multiple,d.defaultValue,
	true);break;default:"function"===typeof e.onClick&&(a.onclick=Bf);}switch(c){case "button":case "input":case "select":case "textarea":d=!!d.autoFocus;break a;case "img":d=true;break a;default:d=false;}}d&&(b.flags|=4);}null!==b.ref&&(b.flags|=512,b.flags|=2097152);}S(b);return null;case 6:if(a&&null!=b.stateNode)Cj(a,b,a.memoizedProps,d);else {if("string"!==typeof d&&null===b.stateNode)throw Error(p(166));c=xh(wh.current);xh(uh.current);if(Gg(b)){d=b.stateNode;c=b.memoizedProps;d[Of]=b;if(f=d.nodeValue!==c)if(a=
	xg,null!==a)switch(a.tag){case 3:Af(d.nodeValue,c,0!==(a.mode&1));break;case 5:true!==a.memoizedProps.suppressHydrationWarning&&Af(d.nodeValue,c,0!==(a.mode&1));}f&&(b.flags|=4);}else d=(9===c.nodeType?c:c.ownerDocument).createTextNode(d),d[Of]=b,b.stateNode=d;}S(b);return null;case 13:E(L);d=b.memoizedState;if(null===a||null!==a.memoizedState&&null!==a.memoizedState.dehydrated){if(I&&null!==yg&&0!==(b.mode&1)&&0===(b.flags&128))Hg(),Ig(),b.flags|=98560,f=false;else if(f=Gg(b),null!==d&&null!==d.dehydrated){if(null===
	a){if(!f)throw Error(p(318));f=b.memoizedState;f=null!==f?f.dehydrated:null;if(!f)throw Error(p(317));f[Of]=b;}else Ig(),0===(b.flags&128)&&(b.memoizedState=null),b.flags|=4;S(b);f=false;}else null!==zg&&(Fj(zg),zg=null),f=true;if(!f)return b.flags&65536?b:null}if(0!==(b.flags&128))return b.lanes=c,b;d=null!==d;d!==(null!==a&&null!==a.memoizedState)&&d&&(b.child.flags|=8192,0!==(b.mode&1)&&(null===a||0!==(L.current&1)?0===T&&(T=3):tj()));null!==b.updateQueue&&(b.flags|=4);S(b);return null;case 4:return zh(),
	Aj(a,b),null===a&&sf(b.stateNode.containerInfo),S(b),null;case 10:return ah(b.type._context),S(b),null;case 17:return Zf(b.type)&&$f(),S(b),null;case 19:E(L);f=b.memoizedState;if(null===f)return S(b),null;d=0!==(b.flags&128);g=f.rendering;if(null===g)if(d)Dj(f,false);else {if(0!==T||null!==a&&0!==(a.flags&128))for(a=b.child;null!==a;){g=Ch(a);if(null!==g){b.flags|=128;Dj(f,false);d=g.updateQueue;null!==d&&(b.updateQueue=d,b.flags|=4);b.subtreeFlags=0;d=c;for(c=b.child;null!==c;)f=c,a=d,f.flags&=14680066,
	g=f.alternate,null===g?(f.childLanes=0,f.lanes=a,f.child=null,f.subtreeFlags=0,f.memoizedProps=null,f.memoizedState=null,f.updateQueue=null,f.dependencies=null,f.stateNode=null):(f.childLanes=g.childLanes,f.lanes=g.lanes,f.child=g.child,f.subtreeFlags=0,f.deletions=null,f.memoizedProps=g.memoizedProps,f.memoizedState=g.memoizedState,f.updateQueue=g.updateQueue,f.type=g.type,a=g.dependencies,f.dependencies=null===a?null:{lanes:a.lanes,firstContext:a.firstContext}),c=c.sibling;G(L,L.current&1|2);return b.child}a=
	a.sibling;}null!==f.tail&&B()>Gj&&(b.flags|=128,d=true,Dj(f,false),b.lanes=4194304);}else {if(!d)if(a=Ch(g),null!==a){if(b.flags|=128,d=true,c=a.updateQueue,null!==c&&(b.updateQueue=c,b.flags|=4),Dj(f,true),null===f.tail&&"hidden"===f.tailMode&&!g.alternate&&!I)return S(b),null}else 2*B()-f.renderingStartTime>Gj&&1073741824!==c&&(b.flags|=128,d=true,Dj(f,false),b.lanes=4194304);f.isBackwards?(g.sibling=b.child,b.child=g):(c=f.last,null!==c?c.sibling=g:b.child=g,f.last=g);}if(null!==f.tail)return b=f.tail,f.rendering=
	b,f.tail=b.sibling,f.renderingStartTime=B(),b.sibling=null,c=L.current,G(L,d?c&1|2:c&1),b;S(b);return null;case 22:case 23:return Hj(),d=null!==b.memoizedState,null!==a&&null!==a.memoizedState!==d&&(b.flags|=8192),d&&0!==(b.mode&1)?0!==(fj&1073741824)&&(S(b),b.subtreeFlags&6&&(b.flags|=8192)):S(b),null;case 24:return null;case 25:return null}throw Error(p(156,b.tag));}
	function Ij(a,b){wg(b);switch(b.tag){case 1:return Zf(b.type)&&$f(),a=b.flags,a&65536?(b.flags=a&-65537|128,b):null;case 3:return zh(),E(Wf),E(H),Eh(),a=b.flags,0!==(a&65536)&&0===(a&128)?(b.flags=a&-65537|128,b):null;case 5:return Bh(b),null;case 13:E(L);a=b.memoizedState;if(null!==a&&null!==a.dehydrated){if(null===b.alternate)throw Error(p(340));Ig();}a=b.flags;return a&65536?(b.flags=a&-65537|128,b):null;case 19:return E(L),null;case 4:return zh(),null;case 10:return ah(b.type._context),null;case 22:case 23:return Hj(),
	null;case 24:return null;default:return null}}var Jj=false,U=false,Kj="function"===typeof WeakSet?WeakSet:Set,V=null;function Lj(a,b){var c=a.ref;if(null!==c)if("function"===typeof c)try{c(null);}catch(d){W(a,b,d);}else c.current=null;}function Mj(a,b,c){try{c();}catch(d){W(a,b,d);}}var Nj=false;
	function Oj(a,b){Cf=dd;a=Me();if(Ne(a)){if("selectionStart"in a)var c={start:a.selectionStart,end:a.selectionEnd};else a:{c=(c=a.ownerDocument)&&c.defaultView||window;var d=c.getSelection&&c.getSelection();if(d&&0!==d.rangeCount){c=d.anchorNode;var e=d.anchorOffset,f=d.focusNode;d=d.focusOffset;try{c.nodeType,f.nodeType;}catch(F){c=null;break a}var g=0,h=-1,k=-1,l=0,m=0,q=a,r=null;b:for(;;){for(var y;;){q!==c||0!==e&&3!==q.nodeType||(h=g+e);q!==f||0!==d&&3!==q.nodeType||(k=g+d);3===q.nodeType&&(g+=
	q.nodeValue.length);if(null===(y=q.firstChild))break;r=q;q=y;}for(;;){if(q===a)break b;r===c&&++l===e&&(h=g);r===f&&++m===d&&(k=g);if(null!==(y=q.nextSibling))break;q=r;r=q.parentNode;}q=y;}c=-1===h||-1===k?null:{start:h,end:k};}else c=null;}c=c||{start:0,end:0};}else c=null;Df={focusedElem:a,selectionRange:c};dd=false;for(V=b;null!==V;)if(b=V,a=b.child,0!==(b.subtreeFlags&1028)&&null!==a)a.return=b,V=a;else for(;null!==V;){b=V;try{var n=b.alternate;if(0!==(b.flags&1024))switch(b.tag){case 0:case 11:case 15:break;
	case 1:if(null!==n){var t=n.memoizedProps,J=n.memoizedState,x=b.stateNode,w=x.getSnapshotBeforeUpdate(b.elementType===b.type?t:Ci(b.type,t),J);x.__reactInternalSnapshotBeforeUpdate=w;}break;case 3:var u=b.stateNode.containerInfo;1===u.nodeType?u.textContent="":9===u.nodeType&&u.documentElement&&u.removeChild(u.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(p(163));}}catch(F){W(b,b.return,F);}a=b.sibling;if(null!==a){a.return=b.return;V=a;break}V=b.return;}n=Nj;Nj=false;return n}
	function Pj(a,b,c){var d=b.updateQueue;d=null!==d?d.lastEffect:null;if(null!==d){var e=d=d.next;do{if((e.tag&a)===a){var f=e.destroy;e.destroy=void 0;void 0!==f&&Mj(b,c,f);}e=e.next;}while(e!==d)}}function Qj(a,b){b=b.updateQueue;b=null!==b?b.lastEffect:null;if(null!==b){var c=b=b.next;do{if((c.tag&a)===a){var d=c.create;c.destroy=d();}c=c.next;}while(c!==b)}}function Rj(a){var b=a.ref;if(null!==b){var c=a.stateNode;switch(a.tag){case 5:a=c;break;default:a=c;}"function"===typeof b?b(a):b.current=a;}}
	function Sj(a){var b=a.alternate;null!==b&&(a.alternate=null,Sj(b));a.child=null;a.deletions=null;a.sibling=null;5===a.tag&&(b=a.stateNode,null!==b&&(delete b[Of],delete b[Pf],delete b[of],delete b[Qf],delete b[Rf]));a.stateNode=null;a.return=null;a.dependencies=null;a.memoizedProps=null;a.memoizedState=null;a.pendingProps=null;a.stateNode=null;a.updateQueue=null;}function Tj(a){return 5===a.tag||3===a.tag||4===a.tag}
	function Uj(a){a:for(;;){for(;null===a.sibling;){if(null===a.return||Tj(a.return))return null;a=a.return;}a.sibling.return=a.return;for(a=a.sibling;5!==a.tag&&6!==a.tag&&18!==a.tag;){if(a.flags&2)continue a;if(null===a.child||4===a.tag)continue a;else a.child.return=a,a=a.child;}if(!(a.flags&2))return a.stateNode}}
	function Vj(a,b,c){var d=a.tag;if(5===d||6===d)a=a.stateNode,b?8===c.nodeType?c.parentNode.insertBefore(a,b):c.insertBefore(a,b):(8===c.nodeType?(b=c.parentNode,b.insertBefore(a,c)):(b=c,b.appendChild(a)),c=c._reactRootContainer,null!==c&&void 0!==c||null!==b.onclick||(b.onclick=Bf));else if(4!==d&&(a=a.child,null!==a))for(Vj(a,b,c),a=a.sibling;null!==a;)Vj(a,b,c),a=a.sibling;}
	function Wj(a,b,c){var d=a.tag;if(5===d||6===d)a=a.stateNode,b?c.insertBefore(a,b):c.appendChild(a);else if(4!==d&&(a=a.child,null!==a))for(Wj(a,b,c),a=a.sibling;null!==a;)Wj(a,b,c),a=a.sibling;}var X=null,Xj=false;function Yj(a,b,c){for(c=c.child;null!==c;)Zj(a,b,c),c=c.sibling;}
	function Zj(a,b,c){if(lc&&"function"===typeof lc.onCommitFiberUnmount)try{lc.onCommitFiberUnmount(kc,c);}catch(h){}switch(c.tag){case 5:U||Lj(c,b);case 6:var d=X,e=Xj;X=null;Yj(a,b,c);X=d;Xj=e;null!==X&&(Xj?(a=X,c=c.stateNode,8===a.nodeType?a.parentNode.removeChild(c):a.removeChild(c)):X.removeChild(c.stateNode));break;case 18:null!==X&&(Xj?(a=X,c=c.stateNode,8===a.nodeType?Kf(a.parentNode,c):1===a.nodeType&&Kf(a,c),bd(a)):Kf(X,c.stateNode));break;case 4:d=X;e=Xj;X=c.stateNode.containerInfo;Xj=true;
	Yj(a,b,c);X=d;Xj=e;break;case 0:case 11:case 14:case 15:if(!U&&(d=c.updateQueue,null!==d&&(d=d.lastEffect,null!==d))){e=d=d.next;do{var f=e,g=f.destroy;f=f.tag;void 0!==g&&(0!==(f&2)?Mj(c,b,g):0!==(f&4)&&Mj(c,b,g));e=e.next;}while(e!==d)}Yj(a,b,c);break;case 1:if(!U&&(Lj(c,b),d=c.stateNode,"function"===typeof d.componentWillUnmount))try{d.props=c.memoizedProps,d.state=c.memoizedState,d.componentWillUnmount();}catch(h){W(c,b,h);}Yj(a,b,c);break;case 21:Yj(a,b,c);break;case 22:c.mode&1?(U=(d=U)||null!==
	c.memoizedState,Yj(a,b,c),U=d):Yj(a,b,c);break;default:Yj(a,b,c);}}function ak(a){var b=a.updateQueue;if(null!==b){a.updateQueue=null;var c=a.stateNode;null===c&&(c=a.stateNode=new Kj);b.forEach(function(b){var d=bk.bind(null,a,b);c.has(b)||(c.add(b),b.then(d,d));});}}
	function ck(a,b){var c=b.deletions;if(null!==c)for(var d=0;d<c.length;d++){var e=c[d];try{var f=a,g=b,h=g;a:for(;null!==h;){switch(h.tag){case 5:X=h.stateNode;Xj=!1;break a;case 3:X=h.stateNode.containerInfo;Xj=!0;break a;case 4:X=h.stateNode.containerInfo;Xj=!0;break a}h=h.return;}if(null===X)throw Error(p(160));Zj(f,g,e);X=null;Xj=!1;var k=e.alternate;null!==k&&(k.return=null);e.return=null;}catch(l){W(e,b,l);}}if(b.subtreeFlags&12854)for(b=b.child;null!==b;)dk(b,a),b=b.sibling;}
	function dk(a,b){var c=a.alternate,d=a.flags;switch(a.tag){case 0:case 11:case 14:case 15:ck(b,a);ek(a);if(d&4){try{Pj(3,a,a.return),Qj(3,a);}catch(t){W(a,a.return,t);}try{Pj(5,a,a.return);}catch(t){W(a,a.return,t);}}break;case 1:ck(b,a);ek(a);d&512&&null!==c&&Lj(c,c.return);break;case 5:ck(b,a);ek(a);d&512&&null!==c&&Lj(c,c.return);if(a.flags&32){var e=a.stateNode;try{ob(e,"");}catch(t){W(a,a.return,t);}}if(d&4&&(e=a.stateNode,null!=e)){var f=a.memoizedProps,g=null!==c?c.memoizedProps:f,h=a.type,k=a.updateQueue;
	a.updateQueue=null;if(null!==k)try{"input"===h&&"radio"===f.type&&null!=f.name&&ab(e,f);vb(h,g);var l=vb(h,f);for(g=0;g<k.length;g+=2){var m=k[g],q=k[g+1];"style"===m?sb(e,q):"dangerouslySetInnerHTML"===m?nb(e,q):"children"===m?ob(e,q):ta(e,m,q,l);}switch(h){case "input":bb(e,f);break;case "textarea":ib(e,f);break;case "select":var r=e._wrapperState.wasMultiple;e._wrapperState.wasMultiple=!!f.multiple;var y=f.value;null!=y?fb(e,!!f.multiple,y,!1):r!==!!f.multiple&&(null!=f.defaultValue?fb(e,!!f.multiple,
	f.defaultValue,!0):fb(e,!!f.multiple,f.multiple?[]:"",!1));}e[Pf]=f;}catch(t){W(a,a.return,t);}}break;case 6:ck(b,a);ek(a);if(d&4){if(null===a.stateNode)throw Error(p(162));e=a.stateNode;f=a.memoizedProps;try{e.nodeValue=f;}catch(t){W(a,a.return,t);}}break;case 3:ck(b,a);ek(a);if(d&4&&null!==c&&c.memoizedState.isDehydrated)try{bd(b.containerInfo);}catch(t){W(a,a.return,t);}break;case 4:ck(b,a);ek(a);break;case 13:ck(b,a);ek(a);e=a.child;e.flags&8192&&(f=null!==e.memoizedState,e.stateNode.isHidden=f,!f||
	null!==e.alternate&&null!==e.alternate.memoizedState||(fk=B()));d&4&&ak(a);break;case 22:m=null!==c&&null!==c.memoizedState;a.mode&1?(U=(l=U)||m,ck(b,a),U=l):ck(b,a);ek(a);if(d&8192){l=null!==a.memoizedState;if((a.stateNode.isHidden=l)&&!m&&0!==(a.mode&1))for(V=a,m=a.child;null!==m;){for(q=V=m;null!==V;){r=V;y=r.child;switch(r.tag){case 0:case 11:case 14:case 15:Pj(4,r,r.return);break;case 1:Lj(r,r.return);var n=r.stateNode;if("function"===typeof n.componentWillUnmount){d=r;c=r.return;try{b=d,n.props=
	b.memoizedProps,n.state=b.memoizedState,n.componentWillUnmount();}catch(t){W(d,c,t);}}break;case 5:Lj(r,r.return);break;case 22:if(null!==r.memoizedState){gk(q);continue}}null!==y?(y.return=r,V=y):gk(q);}m=m.sibling;}a:for(m=null,q=a;;){if(5===q.tag){if(null===m){m=q;try{e=q.stateNode,l?(f=e.style,"function"===typeof f.setProperty?f.setProperty("display","none","important"):f.display="none"):(h=q.stateNode,k=q.memoizedProps.style,g=void 0!==k&&null!==k&&k.hasOwnProperty("display")?k.display:null,h.style.display=
	rb("display",g));}catch(t){W(a,a.return,t);}}}else if(6===q.tag){if(null===m)try{q.stateNode.nodeValue=l?"":q.memoizedProps;}catch(t){W(a,a.return,t);}}else if((22!==q.tag&&23!==q.tag||null===q.memoizedState||q===a)&&null!==q.child){q.child.return=q;q=q.child;continue}if(q===a)break a;for(;null===q.sibling;){if(null===q.return||q.return===a)break a;m===q&&(m=null);q=q.return;}m===q&&(m=null);q.sibling.return=q.return;q=q.sibling;}}break;case 19:ck(b,a);ek(a);d&4&&ak(a);break;case 21:break;default:ck(b,
	a),ek(a);}}function ek(a){var b=a.flags;if(b&2){try{a:{for(var c=a.return;null!==c;){if(Tj(c)){var d=c;break a}c=c.return;}throw Error(p(160));}switch(d.tag){case 5:var e=d.stateNode;d.flags&32&&(ob(e,""),d.flags&=-33);var f=Uj(a);Wj(a,f,e);break;case 3:case 4:var g=d.stateNode.containerInfo,h=Uj(a);Vj(a,h,g);break;default:throw Error(p(161));}}catch(k){W(a,a.return,k);}a.flags&=-3;}b&4096&&(a.flags&=-4097);}function hk(a,b,c){V=a;ik(a);}
	function ik(a,b,c){for(var d=0!==(a.mode&1);null!==V;){var e=V,f=e.child;if(22===e.tag&&d){var g=null!==e.memoizedState||Jj;if(!g){var h=e.alternate,k=null!==h&&null!==h.memoizedState||U;h=Jj;var l=U;Jj=g;if((U=k)&&!l)for(V=e;null!==V;)g=V,k=g.child,22===g.tag&&null!==g.memoizedState?jk(e):null!==k?(k.return=g,V=k):jk(e);for(;null!==f;)V=f,ik(f),f=f.sibling;V=e;Jj=h;U=l;}kk(a);}else 0!==(e.subtreeFlags&8772)&&null!==f?(f.return=e,V=f):kk(a);}}
	function kk(a){for(;null!==V;){var b=V;if(0!==(b.flags&8772)){var c=b.alternate;try{if(0!==(b.flags&8772))switch(b.tag){case 0:case 11:case 15:U||Qj(5,b);break;case 1:var d=b.stateNode;if(b.flags&4&&!U)if(null===c)d.componentDidMount();else {var e=b.elementType===b.type?c.memoizedProps:Ci(b.type,c.memoizedProps);d.componentDidUpdate(e,c.memoizedState,d.__reactInternalSnapshotBeforeUpdate);}var f=b.updateQueue;null!==f&&sh(b,f,d);break;case 3:var g=b.updateQueue;if(null!==g){c=null;if(null!==b.child)switch(b.child.tag){case 5:c=
	b.child.stateNode;break;case 1:c=b.child.stateNode;}sh(b,g,c);}break;case 5:var h=b.stateNode;if(null===c&&b.flags&4){c=h;var k=b.memoizedProps;switch(b.type){case "button":case "input":case "select":case "textarea":k.autoFocus&&c.focus();break;case "img":k.src&&(c.src=k.src);}}break;case 6:break;case 4:break;case 12:break;case 13:if(null===b.memoizedState){var l=b.alternate;if(null!==l){var m=l.memoizedState;if(null!==m){var q=m.dehydrated;null!==q&&bd(q);}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;
	default:throw Error(p(163));}U||b.flags&512&&Rj(b);}catch(r){W(b,b.return,r);}}if(b===a){V=null;break}c=b.sibling;if(null!==c){c.return=b.return;V=c;break}V=b.return;}}function gk(a){for(;null!==V;){var b=V;if(b===a){V=null;break}var c=b.sibling;if(null!==c){c.return=b.return;V=c;break}V=b.return;}}
	function jk(a){for(;null!==V;){var b=V;try{switch(b.tag){case 0:case 11:case 15:var c=b.return;try{Qj(4,b);}catch(k){W(b,c,k);}break;case 1:var d=b.stateNode;if("function"===typeof d.componentDidMount){var e=b.return;try{d.componentDidMount();}catch(k){W(b,e,k);}}var f=b.return;try{Rj(b);}catch(k){W(b,f,k);}break;case 5:var g=b.return;try{Rj(b);}catch(k){W(b,g,k);}}}catch(k){W(b,b.return,k);}if(b===a){V=null;break}var h=b.sibling;if(null!==h){h.return=b.return;V=h;break}V=b.return;}}
	var lk=Math.ceil,mk=ua.ReactCurrentDispatcher,nk=ua.ReactCurrentOwner,ok=ua.ReactCurrentBatchConfig,K=0,Q=null,Y=null,Z=0,fj=0,ej=Uf(0),T=0,pk=null,rh=0,qk=0,rk=0,sk=null,tk=null,fk=0,Gj=Infinity,uk=null,Oi=false,Pi=null,Ri=null,vk=false,wk=null,xk=0,yk=0,zk=null,Ak=-1,Bk=0;function R(){return 0!==(K&6)?B():-1!==Ak?Ak:Ak=B()}
	function yi(a){if(0===(a.mode&1))return 1;if(0!==(K&2)&&0!==Z)return Z&-Z;if(null!==Kg.transition)return 0===Bk&&(Bk=yc()),Bk;a=C;if(0!==a)return a;a=window.event;a=void 0===a?16:jd(a.type);return a}function gi(a,b,c,d){if(50<yk)throw yk=0,zk=null,Error(p(185));Ac(a,c,d);if(0===(K&2)||a!==Q)a===Q&&(0===(K&2)&&(qk|=c),4===T&&Ck(a,Z)),Dk(a,d),1===c&&0===K&&0===(b.mode&1)&&(Gj=B()+500,fg&&jg());}
	function Dk(a,b){var c=a.callbackNode;wc(a,b);var d=uc(a,a===Q?Z:0);if(0===d)null!==c&&bc(c),a.callbackNode=null,a.callbackPriority=0;else if(b=d&-d,a.callbackPriority!==b){null!=c&&bc(c);if(1===b)0===a.tag?ig(Ek.bind(null,a)):hg(Ek.bind(null,a)),Jf(function(){0===(K&6)&&jg();}),c=null;else {switch(Dc(d)){case 1:c=fc;break;case 4:c=gc;break;case 16:c=hc;break;case 536870912:c=jc;break;default:c=hc;}c=Fk(c,Gk.bind(null,a));}a.callbackPriority=b;a.callbackNode=c;}}
	function Gk(a,b){Ak=-1;Bk=0;if(0!==(K&6))throw Error(p(327));var c=a.callbackNode;if(Hk()&&a.callbackNode!==c)return null;var d=uc(a,a===Q?Z:0);if(0===d)return null;if(0!==(d&30)||0!==(d&a.expiredLanes)||b)b=Ik(a,d);else {b=d;var e=K;K|=2;var f=Jk();if(Q!==a||Z!==b)uk=null,Gj=B()+500,Kk(a,b);do try{Lk();break}catch(h){Mk(a,h);}while(1);$g();mk.current=f;K=e;null!==Y?b=0:(Q=null,Z=0,b=T);}if(0!==b){2===b&&(e=xc(a),0!==e&&(d=e,b=Nk(a,e)));if(1===b)throw c=pk,Kk(a,0),Ck(a,d),Dk(a,B()),c;if(6===b)Ck(a,d);
	else {e=a.current.alternate;if(0===(d&30)&&!Ok(e)&&(b=Ik(a,d),2===b&&(f=xc(a),0!==f&&(d=f,b=Nk(a,f))),1===b))throw c=pk,Kk(a,0),Ck(a,d),Dk(a,B()),c;a.finishedWork=e;a.finishedLanes=d;switch(b){case 0:case 1:throw Error(p(345));case 2:Pk(a,tk,uk);break;case 3:Ck(a,d);if((d&130023424)===d&&(b=fk+500-B(),10<b)){if(0!==uc(a,0))break;e=a.suspendedLanes;if((e&d)!==d){R();a.pingedLanes|=a.suspendedLanes&e;break}a.timeoutHandle=Ff(Pk.bind(null,a,tk,uk),b);break}Pk(a,tk,uk);break;case 4:Ck(a,d);if((d&4194240)===
	d)break;b=a.eventTimes;for(e=-1;0<d;){var g=31-oc(d);f=1<<g;g=b[g];g>e&&(e=g);d&=~f;}d=e;d=B()-d;d=(120>d?120:480>d?480:1080>d?1080:1920>d?1920:3E3>d?3E3:4320>d?4320:1960*lk(d/1960))-d;if(10<d){a.timeoutHandle=Ff(Pk.bind(null,a,tk,uk),d);break}Pk(a,tk,uk);break;case 5:Pk(a,tk,uk);break;default:throw Error(p(329));}}}Dk(a,B());return a.callbackNode===c?Gk.bind(null,a):null}
	function Nk(a,b){var c=sk;a.current.memoizedState.isDehydrated&&(Kk(a,b).flags|=256);a=Ik(a,b);2!==a&&(b=tk,tk=c,null!==b&&Fj(b));return a}function Fj(a){null===tk?tk=a:tk.push.apply(tk,a);}
	function Ok(a){for(var b=a;;){if(b.flags&16384){var c=b.updateQueue;if(null!==c&&(c=c.stores,null!==c))for(var d=0;d<c.length;d++){var e=c[d],f=e.getSnapshot;e=e.value;try{if(!He(f(),e))return !1}catch(g){return  false}}}c=b.child;if(b.subtreeFlags&16384&&null!==c)c.return=b,b=c;else {if(b===a)break;for(;null===b.sibling;){if(null===b.return||b.return===a)return  true;b=b.return;}b.sibling.return=b.return;b=b.sibling;}}return  true}
	function Ck(a,b){b&=~rk;b&=~qk;a.suspendedLanes|=b;a.pingedLanes&=~b;for(a=a.expirationTimes;0<b;){var c=31-oc(b),d=1<<c;a[c]=-1;b&=~d;}}function Ek(a){if(0!==(K&6))throw Error(p(327));Hk();var b=uc(a,0);if(0===(b&1))return Dk(a,B()),null;var c=Ik(a,b);if(0!==a.tag&&2===c){var d=xc(a);0!==d&&(b=d,c=Nk(a,d));}if(1===c)throw c=pk,Kk(a,0),Ck(a,b),Dk(a,B()),c;if(6===c)throw Error(p(345));a.finishedWork=a.current.alternate;a.finishedLanes=b;Pk(a,tk,uk);Dk(a,B());return null}
	function Qk(a,b){var c=K;K|=1;try{return a(b)}finally{K=c,0===K&&(Gj=B()+500,fg&&jg());}}function Rk(a){null!==wk&&0===wk.tag&&0===(K&6)&&Hk();var b=K;K|=1;var c=ok.transition,d=C;try{if(ok.transition=null,C=1,a)return a()}finally{C=d,ok.transition=c,K=b,0===(K&6)&&jg();}}function Hj(){fj=ej.current;E(ej);}
	function Kk(a,b){a.finishedWork=null;a.finishedLanes=0;var c=a.timeoutHandle;-1!==c&&(a.timeoutHandle=-1,Gf(c));if(null!==Y)for(c=Y.return;null!==c;){var d=c;wg(d);switch(d.tag){case 1:d=d.type.childContextTypes;null!==d&&void 0!==d&&$f();break;case 3:zh();E(Wf);E(H);Eh();break;case 5:Bh(d);break;case 4:zh();break;case 13:E(L);break;case 19:E(L);break;case 10:ah(d.type._context);break;case 22:case 23:Hj();}c=c.return;}Q=a;Y=a=Pg(a.current,null);Z=fj=b;T=0;pk=null;rk=qk=rh=0;tk=sk=null;if(null!==fh){for(b=
	0;b<fh.length;b++)if(c=fh[b],d=c.interleaved,null!==d){c.interleaved=null;var e=d.next,f=c.pending;if(null!==f){var g=f.next;f.next=e;d.next=g;}c.pending=d;}fh=null;}return a}
	function Mk(a,b){do{var c=Y;try{$g();Fh.current=Rh;if(Ih){for(var d=M.memoizedState;null!==d;){var e=d.queue;null!==e&&(e.pending=null);d=d.next;}Ih=!1;}Hh=0;O=N=M=null;Jh=!1;Kh=0;nk.current=null;if(null===c||null===c.return){T=1;pk=b;Y=null;break}a:{var f=a,g=c.return,h=c,k=b;b=Z;h.flags|=32768;if(null!==k&&"object"===typeof k&&"function"===typeof k.then){var l=k,m=h,q=m.tag;if(0===(m.mode&1)&&(0===q||11===q||15===q)){var r=m.alternate;r?(m.updateQueue=r.updateQueue,m.memoizedState=r.memoizedState,
	m.lanes=r.lanes):(m.updateQueue=null,m.memoizedState=null);}var y=Ui(g);if(null!==y){y.flags&=-257;Vi(y,g,h,f,b);y.mode&1&&Si(f,l,b);b=y;k=l;var n=b.updateQueue;if(null===n){var t=new Set;t.add(k);b.updateQueue=t;}else n.add(k);break a}else {if(0===(b&1)){Si(f,l,b);tj();break a}k=Error(p(426));}}else if(I&&h.mode&1){var J=Ui(g);if(null!==J){0===(J.flags&65536)&&(J.flags|=256);Vi(J,g,h,f,b);Jg(Ji(k,h));break a}}f=k=Ji(k,h);4!==T&&(T=2);null===sk?sk=[f]:sk.push(f);f=g;do{switch(f.tag){case 3:f.flags|=65536;
	b&=-b;f.lanes|=b;var x=Ni(f,k,b);ph(f,x);break a;case 1:h=k;var w=f.type,u=f.stateNode;if(0===(f.flags&128)&&("function"===typeof w.getDerivedStateFromError||null!==u&&"function"===typeof u.componentDidCatch&&(null===Ri||!Ri.has(u)))){f.flags|=65536;b&=-b;f.lanes|=b;var F=Qi(f,h,b);ph(f,F);break a}}f=f.return;}while(null!==f)}Sk(c);}catch(na){b=na;Y===c&&null!==c&&(Y=c=c.return);continue}break}while(1)}function Jk(){var a=mk.current;mk.current=Rh;return null===a?Rh:a}
	function tj(){if(0===T||3===T||2===T)T=4;null===Q||0===(rh&268435455)&&0===(qk&268435455)||Ck(Q,Z);}function Ik(a,b){var c=K;K|=2;var d=Jk();if(Q!==a||Z!==b)uk=null,Kk(a,b);do try{Tk();break}catch(e){Mk(a,e);}while(1);$g();K=c;mk.current=d;if(null!==Y)throw Error(p(261));Q=null;Z=0;return T}function Tk(){for(;null!==Y;)Uk(Y);}function Lk(){for(;null!==Y&&!cc();)Uk(Y);}function Uk(a){var b=Vk(a.alternate,a,fj);a.memoizedProps=a.pendingProps;null===b?Sk(a):Y=b;nk.current=null;}
	function Sk(a){var b=a;do{var c=b.alternate;a=b.return;if(0===(b.flags&32768)){if(c=Ej(c,b,fj),null!==c){Y=c;return}}else {c=Ij(c,b);if(null!==c){c.flags&=32767;Y=c;return}if(null!==a)a.flags|=32768,a.subtreeFlags=0,a.deletions=null;else {T=6;Y=null;return}}b=b.sibling;if(null!==b){Y=b;return}Y=b=a;}while(null!==b);0===T&&(T=5);}function Pk(a,b,c){var d=C,e=ok.transition;try{ok.transition=null,C=1,Wk(a,b,c,d);}finally{ok.transition=e,C=d;}return null}
	function Wk(a,b,c,d){do Hk();while(null!==wk);if(0!==(K&6))throw Error(p(327));c=a.finishedWork;var e=a.finishedLanes;if(null===c)return null;a.finishedWork=null;a.finishedLanes=0;if(c===a.current)throw Error(p(177));a.callbackNode=null;a.callbackPriority=0;var f=c.lanes|c.childLanes;Bc(a,f);a===Q&&(Y=Q=null,Z=0);0===(c.subtreeFlags&2064)&&0===(c.flags&2064)||vk||(vk=true,Fk(hc,function(){Hk();return null}));f=0!==(c.flags&15990);if(0!==(c.subtreeFlags&15990)||f){f=ok.transition;ok.transition=null;
	var g=C;C=1;var h=K;K|=4;nk.current=null;Oj(a,c);dk(c,a);Oe(Df);dd=!!Cf;Df=Cf=null;a.current=c;hk(c);dc();K=h;C=g;ok.transition=f;}else a.current=c;vk&&(vk=false,wk=a,xk=e);f=a.pendingLanes;0===f&&(Ri=null);mc(c.stateNode);Dk(a,B());if(null!==b)for(d=a.onRecoverableError,c=0;c<b.length;c++)e=b[c],d(e.value,{componentStack:e.stack,digest:e.digest});if(Oi)throw Oi=false,a=Pi,Pi=null,a;0!==(xk&1)&&0!==a.tag&&Hk();f=a.pendingLanes;0!==(f&1)?a===zk?yk++:(yk=0,zk=a):yk=0;jg();return null}
	function Hk(){if(null!==wk){var a=Dc(xk),b=ok.transition,c=C;try{ok.transition=null;C=16>a?16:a;if(null===wk)var d=!1;else {a=wk;wk=null;xk=0;if(0!==(K&6))throw Error(p(331));var e=K;K|=4;for(V=a.current;null!==V;){var f=V,g=f.child;if(0!==(V.flags&16)){var h=f.deletions;if(null!==h){for(var k=0;k<h.length;k++){var l=h[k];for(V=l;null!==V;){var m=V;switch(m.tag){case 0:case 11:case 15:Pj(8,m,f);}var q=m.child;if(null!==q)q.return=m,V=q;else for(;null!==V;){m=V;var r=m.sibling,y=m.return;Sj(m);if(m===
	l){V=null;break}if(null!==r){r.return=y;V=r;break}V=y;}}}var n=f.alternate;if(null!==n){var t=n.child;if(null!==t){n.child=null;do{var J=t.sibling;t.sibling=null;t=J;}while(null!==t)}}V=f;}}if(0!==(f.subtreeFlags&2064)&&null!==g)g.return=f,V=g;else b:for(;null!==V;){f=V;if(0!==(f.flags&2048))switch(f.tag){case 0:case 11:case 15:Pj(9,f,f.return);}var x=f.sibling;if(null!==x){x.return=f.return;V=x;break b}V=f.return;}}var w=a.current;for(V=w;null!==V;){g=V;var u=g.child;if(0!==(g.subtreeFlags&2064)&&null!==
	u)u.return=g,V=u;else b:for(g=w;null!==V;){h=V;if(0!==(h.flags&2048))try{switch(h.tag){case 0:case 11:case 15:Qj(9,h);}}catch(na){W(h,h.return,na);}if(h===g){V=null;break b}var F=h.sibling;if(null!==F){F.return=h.return;V=F;break b}V=h.return;}}K=e;jg();if(lc&&"function"===typeof lc.onPostCommitFiberRoot)try{lc.onPostCommitFiberRoot(kc,a);}catch(na){}d=!0;}return d}finally{C=c,ok.transition=b;}}return  false}function Xk(a,b,c){b=Ji(c,b);b=Ni(a,b,1);a=nh(a,b,1);b=R();null!==a&&(Ac(a,1,b),Dk(a,b));}
	function W(a,b,c){if(3===a.tag)Xk(a,a,c);else for(;null!==b;){if(3===b.tag){Xk(b,a,c);break}else if(1===b.tag){var d=b.stateNode;if("function"===typeof b.type.getDerivedStateFromError||"function"===typeof d.componentDidCatch&&(null===Ri||!Ri.has(d))){a=Ji(c,a);a=Qi(b,a,1);b=nh(b,a,1);a=R();null!==b&&(Ac(b,1,a),Dk(b,a));break}}b=b.return;}}
	function Ti(a,b,c){var d=a.pingCache;null!==d&&d.delete(b);b=R();a.pingedLanes|=a.suspendedLanes&c;Q===a&&(Z&c)===c&&(4===T||3===T&&(Z&130023424)===Z&&500>B()-fk?Kk(a,0):rk|=c);Dk(a,b);}function Yk(a,b){0===b&&(0===(a.mode&1)?b=1:(b=sc,sc<<=1,0===(sc&130023424)&&(sc=4194304)));var c=R();a=ih(a,b);null!==a&&(Ac(a,b,c),Dk(a,c));}function uj(a){var b=a.memoizedState,c=0;null!==b&&(c=b.retryLane);Yk(a,c);}
	function bk(a,b){var c=0;switch(a.tag){case 13:var d=a.stateNode;var e=a.memoizedState;null!==e&&(c=e.retryLane);break;case 19:d=a.stateNode;break;default:throw Error(p(314));}null!==d&&d.delete(b);Yk(a,c);}var Vk;
	Vk=function(a,b,c){if(null!==a)if(a.memoizedProps!==b.pendingProps||Wf.current)dh=true;else {if(0===(a.lanes&c)&&0===(b.flags&128))return dh=false,yj(a,b,c);dh=0!==(a.flags&131072)?true:false;}else dh=false,I&&0!==(b.flags&1048576)&&ug(b,ng,b.index);b.lanes=0;switch(b.tag){case 2:var d=b.type;ij(a,b);a=b.pendingProps;var e=Yf(b,H.current);ch(b,c);e=Nh(null,b,d,a,e,c);var f=Sh();b.flags|=1;"object"===typeof e&&null!==e&&"function"===typeof e.render&&void 0===e.$$typeof?(b.tag=1,b.memoizedState=null,b.updateQueue=
	null,Zf(d)?(f=true,cg(b)):f=false,b.memoizedState=null!==e.state&&void 0!==e.state?e.state:null,kh(b),e.updater=Ei,b.stateNode=e,e._reactInternals=b,Ii(b,d,a,c),b=jj(null,b,d,true,f,c)):(b.tag=0,I&&f&&vg(b),Xi(null,b,e,c),b=b.child);return b;case 16:d=b.elementType;a:{ij(a,b);a=b.pendingProps;e=d._init;d=e(d._payload);b.type=d;e=b.tag=Zk(d);a=Ci(d,a);switch(e){case 0:b=cj(null,b,d,a,c);break a;case 1:b=hj(null,b,d,a,c);break a;case 11:b=Yi(null,b,d,a,c);break a;case 14:b=$i(null,b,d,Ci(d.type,a),c);break a}throw Error(p(306,
	d,""));}return b;case 0:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Ci(d,e),cj(a,b,d,e,c);case 1:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Ci(d,e),hj(a,b,d,e,c);case 3:a:{kj(b);if(null===a)throw Error(p(387));d=b.pendingProps;f=b.memoizedState;e=f.element;lh(a,b);qh(b,d,null,c);var g=b.memoizedState;d=g.element;if(f.isDehydrated)if(f={element:d,isDehydrated:false,cache:g.cache,pendingSuspenseBoundaries:g.pendingSuspenseBoundaries,transitions:g.transitions},b.updateQueue.baseState=
	f,b.memoizedState=f,b.flags&256){e=Ji(Error(p(423)),b);b=lj(a,b,d,c,e);break a}else if(d!==e){e=Ji(Error(p(424)),b);b=lj(a,b,d,c,e);break a}else for(yg=Lf(b.stateNode.containerInfo.firstChild),xg=b,I=true,zg=null,c=Vg(b,null,d,c),b.child=c;c;)c.flags=c.flags&-3|4096,c=c.sibling;else {Ig();if(d===e){b=Zi(a,b,c);break a}Xi(a,b,d,c);}b=b.child;}return b;case 5:return Ah(b),null===a&&Eg(b),d=b.type,e=b.pendingProps,f=null!==a?a.memoizedProps:null,g=e.children,Ef(d,e)?g=null:null!==f&&Ef(d,f)&&(b.flags|=32),
	gj(a,b),Xi(a,b,g,c),b.child;case 6:return null===a&&Eg(b),null;case 13:return oj(a,b,c);case 4:return yh(b,b.stateNode.containerInfo),d=b.pendingProps,null===a?b.child=Ug(b,null,d,c):Xi(a,b,d,c),b.child;case 11:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Ci(d,e),Yi(a,b,d,e,c);case 7:return Xi(a,b,b.pendingProps,c),b.child;case 8:return Xi(a,b,b.pendingProps.children,c),b.child;case 12:return Xi(a,b,b.pendingProps.children,c),b.child;case 10:a:{d=b.type._context;e=b.pendingProps;f=b.memoizedProps;
	g=e.value;G(Wg,d._currentValue);d._currentValue=g;if(null!==f)if(He(f.value,g)){if(f.children===e.children&&!Wf.current){b=Zi(a,b,c);break a}}else for(f=b.child,null!==f&&(f.return=b);null!==f;){var h=f.dependencies;if(null!==h){g=f.child;for(var k=h.firstContext;null!==k;){if(k.context===d){if(1===f.tag){k=mh(-1,c&-c);k.tag=2;var l=f.updateQueue;if(null!==l){l=l.shared;var m=l.pending;null===m?k.next=k:(k.next=m.next,m.next=k);l.pending=k;}}f.lanes|=c;k=f.alternate;null!==k&&(k.lanes|=c);bh(f.return,
	c,b);h.lanes|=c;break}k=k.next;}}else if(10===f.tag)g=f.type===b.type?null:f.child;else if(18===f.tag){g=f.return;if(null===g)throw Error(p(341));g.lanes|=c;h=g.alternate;null!==h&&(h.lanes|=c);bh(g,c,b);g=f.sibling;}else g=f.child;if(null!==g)g.return=f;else for(g=f;null!==g;){if(g===b){g=null;break}f=g.sibling;if(null!==f){f.return=g.return;g=f;break}g=g.return;}f=g;}Xi(a,b,e.children,c);b=b.child;}return b;case 9:return e=b.type,d=b.pendingProps.children,ch(b,c),e=eh(e),d=d(e),b.flags|=1,Xi(a,b,d,c),
	b.child;case 14:return d=b.type,e=Ci(d,b.pendingProps),e=Ci(d.type,e),$i(a,b,d,e,c);case 15:return bj(a,b,b.type,b.pendingProps,c);case 17:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Ci(d,e),ij(a,b),b.tag=1,Zf(d)?(a=true,cg(b)):a=false,ch(b,c),Gi(b,d,e),Ii(b,d,e,c),jj(null,b,d,true,a,c);case 19:return xj(a,b,c);case 22:return dj(a,b,c)}throw Error(p(156,b.tag));};function Fk(a,b){return ac(a,b)}
	function $k(a,b,c,d){this.tag=a;this.key=c;this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null;this.index=0;this.ref=null;this.pendingProps=b;this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null;this.mode=d;this.subtreeFlags=this.flags=0;this.deletions=null;this.childLanes=this.lanes=0;this.alternate=null;}function Bg(a,b,c,d){return new $k(a,b,c,d)}function aj(a){a=a.prototype;return !(!a||!a.isReactComponent)}
	function Zk(a){if("function"===typeof a)return aj(a)?1:0;if(void 0!==a&&null!==a){a=a.$$typeof;if(a===Da)return 11;if(a===Ga)return 14}return 2}
	function Pg(a,b){var c=a.alternate;null===c?(c=Bg(a.tag,b,a.key,a.mode),c.elementType=a.elementType,c.type=a.type,c.stateNode=a.stateNode,c.alternate=a,a.alternate=c):(c.pendingProps=b,c.type=a.type,c.flags=0,c.subtreeFlags=0,c.deletions=null);c.flags=a.flags&14680064;c.childLanes=a.childLanes;c.lanes=a.lanes;c.child=a.child;c.memoizedProps=a.memoizedProps;c.memoizedState=a.memoizedState;c.updateQueue=a.updateQueue;b=a.dependencies;c.dependencies=null===b?null:{lanes:b.lanes,firstContext:b.firstContext};
	c.sibling=a.sibling;c.index=a.index;c.ref=a.ref;return c}
	function Rg(a,b,c,d,e,f){var g=2;d=a;if("function"===typeof a)aj(a)&&(g=1);else if("string"===typeof a)g=5;else a:switch(a){case ya:return Tg(c.children,e,f,b);case za:g=8;e|=8;break;case Aa:return a=Bg(12,c,b,e|2),a.elementType=Aa,a.lanes=f,a;case Ea:return a=Bg(13,c,b,e),a.elementType=Ea,a.lanes=f,a;case Fa:return a=Bg(19,c,b,e),a.elementType=Fa,a.lanes=f,a;case Ia:return pj(c,e,f,b);default:if("object"===typeof a&&null!==a)switch(a.$$typeof){case Ba:g=10;break a;case Ca:g=9;break a;case Da:g=11;
	break a;case Ga:g=14;break a;case Ha:g=16;d=null;break a}throw Error(p(130,null==a?a:typeof a,""));}b=Bg(g,c,b,e);b.elementType=a;b.type=d;b.lanes=f;return b}function Tg(a,b,c,d){a=Bg(7,a,d,b);a.lanes=c;return a}function pj(a,b,c,d){a=Bg(22,a,d,b);a.elementType=Ia;a.lanes=c;a.stateNode={isHidden:false};return a}function Qg(a,b,c){a=Bg(6,a,null,b);a.lanes=c;return a}
	function Sg(a,b,c){b=Bg(4,null!==a.children?a.children:[],a.key,b);b.lanes=c;b.stateNode={containerInfo:a.containerInfo,pendingChildren:null,implementation:a.implementation};return b}
	function al(a,b,c,d,e){this.tag=b;this.containerInfo=a;this.finishedWork=this.pingCache=this.current=this.pendingChildren=null;this.timeoutHandle=-1;this.callbackNode=this.pendingContext=this.context=null;this.callbackPriority=0;this.eventTimes=zc(0);this.expirationTimes=zc(-1);this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0;this.entanglements=zc(0);this.identifierPrefix=d;this.onRecoverableError=e;this.mutableSourceEagerHydrationData=
	null;}function bl(a,b,c,d,e,f,g,h,k){a=new al(a,b,c,h,k);1===b?(b=1,true===f&&(b|=8)):b=0;f=Bg(3,null,null,b);a.current=f;f.stateNode=a;f.memoizedState={element:d,isDehydrated:c,cache:null,transitions:null,pendingSuspenseBoundaries:null};kh(f);return a}function cl(a,b,c){var d=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return {$$typeof:wa,key:null==d?null:""+d,children:a,containerInfo:b,implementation:c}}
	function dl(a){if(!a)return Vf;a=a._reactInternals;a:{if(Vb(a)!==a||1!==a.tag)throw Error(p(170));var b=a;do{switch(b.tag){case 3:b=b.stateNode.context;break a;case 1:if(Zf(b.type)){b=b.stateNode.__reactInternalMemoizedMergedChildContext;break a}}b=b.return;}while(null!==b);throw Error(p(171));}if(1===a.tag){var c=a.type;if(Zf(c))return bg(a,c,b)}return b}
	function el(a,b,c,d,e,f,g,h,k){a=bl(c,d,true,a,e,f,g,h,k);a.context=dl(null);c=a.current;d=R();e=yi(c);f=mh(d,e);f.callback=void 0!==b&&null!==b?b:null;nh(c,f,e);a.current.lanes=e;Ac(a,e,d);Dk(a,d);return a}function fl(a,b,c,d){var e=b.current,f=R(),g=yi(e);c=dl(c);null===b.context?b.context=c:b.pendingContext=c;b=mh(f,g);b.payload={element:a};d=void 0===d?null:d;null!==d&&(b.callback=d);a=nh(e,b,g);null!==a&&(gi(a,e,g,f),oh(a,e,g));return g}
	function gl(a){a=a.current;if(!a.child)return null;switch(a.child.tag){case 5:return a.child.stateNode;default:return a.child.stateNode}}function hl(a,b){a=a.memoizedState;if(null!==a&&null!==a.dehydrated){var c=a.retryLane;a.retryLane=0!==c&&c<b?c:b;}}function il(a,b){hl(a,b);(a=a.alternate)&&hl(a,b);}function jl(){return null}var kl="function"===typeof reportError?reportError:function(a){console.error(a);};function ll(a){this._internalRoot=a;}
	ml.prototype.render=ll.prototype.render=function(a){var b=this._internalRoot;if(null===b)throw Error(p(409));fl(a,b,null,null);};ml.prototype.unmount=ll.prototype.unmount=function(){var a=this._internalRoot;if(null!==a){this._internalRoot=null;var b=a.containerInfo;Rk(function(){fl(null,a,null,null);});b[uf]=null;}};function ml(a){this._internalRoot=a;}
	ml.prototype.unstable_scheduleHydration=function(a){if(a){var b=Hc();a={blockedOn:null,target:a,priority:b};for(var c=0;c<Qc.length&&0!==b&&b<Qc[c].priority;c++);Qc.splice(c,0,a);0===c&&Vc(a);}};function nl(a){return !(!a||1!==a.nodeType&&9!==a.nodeType&&11!==a.nodeType)}function ol(a){return !(!a||1!==a.nodeType&&9!==a.nodeType&&11!==a.nodeType&&(8!==a.nodeType||" react-mount-point-unstable "!==a.nodeValue))}function pl(){}
	function ql(a,b,c,d,e){if(e){if("function"===typeof d){var f=d;d=function(){var a=gl(g);f.call(a);};}var g=el(b,d,a,0,null,false,false,"",pl);a._reactRootContainer=g;a[uf]=g.current;sf(8===a.nodeType?a.parentNode:a);Rk();return g}for(;e=a.lastChild;)a.removeChild(e);if("function"===typeof d){var h=d;d=function(){var a=gl(k);h.call(a);};}var k=bl(a,0,false,null,null,false,false,"",pl);a._reactRootContainer=k;a[uf]=k.current;sf(8===a.nodeType?a.parentNode:a);Rk(function(){fl(b,k,c,d);});return k}
	function rl(a,b,c,d,e){var f=c._reactRootContainer;if(f){var g=f;if("function"===typeof e){var h=e;e=function(){var a=gl(g);h.call(a);};}fl(b,g,a,e);}else g=ql(c,b,a,e,d);return gl(g)}Ec=function(a){switch(a.tag){case 3:var b=a.stateNode;if(b.current.memoizedState.isDehydrated){var c=tc(b.pendingLanes);0!==c&&(Cc(b,c|1),Dk(b,B()),0===(K&6)&&(Gj=B()+500,jg()));}break;case 13:Rk(function(){var b=ih(a,1);if(null!==b){var c=R();gi(b,a,1,c);}}),il(a,1);}};
	Fc=function(a){if(13===a.tag){var b=ih(a,134217728);if(null!==b){var c=R();gi(b,a,134217728,c);}il(a,134217728);}};Gc=function(a){if(13===a.tag){var b=yi(a),c=ih(a,b);if(null!==c){var d=R();gi(c,a,b,d);}il(a,b);}};Hc=function(){return C};Ic=function(a,b){var c=C;try{return C=a,b()}finally{C=c;}};
	yb=function(a,b,c){switch(b){case "input":bb(a,c);b=c.name;if("radio"===c.type&&null!=b){for(c=a;c.parentNode;)c=c.parentNode;c=c.querySelectorAll("input[name="+JSON.stringify(""+b)+'][type="radio"]');for(b=0;b<c.length;b++){var d=c[b];if(d!==a&&d.form===a.form){var e=Db(d);if(!e)throw Error(p(90));Wa(d);bb(d,e);}}}break;case "textarea":ib(a,c);break;case "select":b=c.value,null!=b&&fb(a,!!c.multiple,b,false);}};Gb=Qk;Hb=Rk;
	var sl={usingClientEntryPoint:false,Events:[Cb,ue,Db,Eb,Fb,Qk]},tl={findFiberByHostInstance:Wc,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"};
	var ul={bundleType:tl.bundleType,version:tl.version,rendererPackageName:tl.rendererPackageName,rendererConfig:tl.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:ua.ReactCurrentDispatcher,findHostInstanceByFiber:function(a){a=Zb(a);return null===a?null:a.stateNode},findFiberByHostInstance:tl.findFiberByHostInstance||
	jl,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if("undefined"!==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__){var vl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!vl.isDisabled&&vl.supportsFiber)try{kc=vl.inject(ul),lc=vl;}catch(a){}}reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=sl;
	reactDom_production_min.createPortal=function(a,b){var c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;if(!nl(b))throw Error(p(200));return cl(a,b,null,c)};reactDom_production_min.createRoot=function(a,b){if(!nl(a))throw Error(p(299));var c=false,d="",e=kl;null!==b&&void 0!==b&&(true===b.unstable_strictMode&&(c=true),void 0!==b.identifierPrefix&&(d=b.identifierPrefix),void 0!==b.onRecoverableError&&(e=b.onRecoverableError));b=bl(a,1,false,null,null,c,false,d,e);a[uf]=b.current;sf(8===a.nodeType?a.parentNode:a);return new ll(b)};
	reactDom_production_min.findDOMNode=function(a){if(null==a)return null;if(1===a.nodeType)return a;var b=a._reactInternals;if(void 0===b){if("function"===typeof a.render)throw Error(p(188));a=Object.keys(a).join(",");throw Error(p(268,a));}a=Zb(b);a=null===a?null:a.stateNode;return a};reactDom_production_min.flushSync=function(a){return Rk(a)};reactDom_production_min.hydrate=function(a,b,c){if(!ol(b))throw Error(p(200));return rl(null,a,b,true,c)};
	reactDom_production_min.hydrateRoot=function(a,b,c){if(!nl(a))throw Error(p(405));var d=null!=c&&c.hydratedSources||null,e=false,f="",g=kl;null!==c&&void 0!==c&&(true===c.unstable_strictMode&&(e=true),void 0!==c.identifierPrefix&&(f=c.identifierPrefix),void 0!==c.onRecoverableError&&(g=c.onRecoverableError));b=el(b,null,a,1,null!=c?c:null,e,false,f,g);a[uf]=b.current;sf(a);if(d)for(a=0;a<d.length;a++)c=d[a],e=c._getVersion,e=e(c._source),null==b.mutableSourceEagerHydrationData?b.mutableSourceEagerHydrationData=[c,e]:b.mutableSourceEagerHydrationData.push(c,
	e);return new ml(b)};reactDom_production_min.render=function(a,b,c){if(!ol(b))throw Error(p(200));return rl(null,a,b,false,c)};reactDom_production_min.unmountComponentAtNode=function(a){if(!ol(a))throw Error(p(40));return a._reactRootContainer?(Rk(function(){rl(null,null,a,!1,function(){a._reactRootContainer=null;a[uf]=null;});}),true):false};reactDom_production_min.unstable_batchedUpdates=Qk;
	reactDom_production_min.unstable_renderSubtreeIntoContainer=function(a,b,c,d){if(!ol(c))throw Error(p(200));if(null==a||void 0===a._reactInternals)throw Error(p(38));return rl(a,b,c,false,d)};reactDom_production_min.version="18.3.1-next-f1338f8080-20240426";
	return reactDom_production_min;
}

var hasRequiredReactDom;

function requireReactDom () {
	if (hasRequiredReactDom) return reactDom.exports;
	hasRequiredReactDom = 1;

	function checkDCE() {
	  /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
	  if (
	    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined' ||
	    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== 'function'
	  ) {
	    return;
	  }
	  try {
	    // Verify that the code above has been dead code eliminated (DCE'd).
	    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
	  } catch (err) {
	    // DevTools shouldn't crash React, no matter what.
	    // We should still report in case we break this code.
	    console.error(err);
	  }
	}

	{
	  // DCE check should happen before ReactDOM bundle executes so that
	  // DevTools can report bad minification during injection.
	  checkDCE();
	  reactDom.exports = requireReactDom_production_min();
	}
	return reactDom.exports;
}

var hasRequiredClient;

function requireClient () {
	if (hasRequiredClient) return client;
	hasRequiredClient = 1;

	var m = requireReactDom();
	{
	  client.createRoot = m.createRoot;
	  client.hydrateRoot = m.hydrateRoot;
	}
	return client;
}

var clientExports = requireClient();

var DefaultContext = {
  color: undefined,
  size: undefined,
  className: undefined,
  style: undefined,
  attr: undefined
};
var IconContext = React.createContext && /*#__PURE__*/React.createContext(DefaultContext);

var _excluded = ["attr", "size", "title"];
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), true).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function Tree2Element(tree) {
  return tree && tree.map((node, i) => /*#__PURE__*/React.createElement(node.tag, _objectSpread({
    key: i
  }, node.attr), Tree2Element(node.child)));
}
function GenIcon(data) {
  return props => /*#__PURE__*/React.createElement(IconBase, _extends({
    attr: _objectSpread({}, data.attr)
  }, props), Tree2Element(data.child));
}
function IconBase(props) {
  var elem = conf => {
    var {
        attr,
        size,
        title
      } = props,
      svgProps = _objectWithoutProperties(props, _excluded);
    var computedSize = size || conf.size || "1em";
    var className;
    if (conf.className) className = conf.className;
    if (props.className) className = (className ? className + " " : "") + props.className;
    return /*#__PURE__*/React.createElement("svg", _extends({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, conf.attr, attr, svgProps, {
      className: className,
      style: _objectSpread(_objectSpread({
        color: props.color || conf.color
      }, conf.style), props.style),
      height: computedSize,
      width: computedSize,
      xmlns: "http://www.w3.org/2000/svg"
    }), title && /*#__PURE__*/React.createElement("title", null, title), props.children);
  };
  return IconContext !== undefined ? /*#__PURE__*/React.createElement(IconContext.Consumer, null, conf => elem(conf)) : elem(DefaultContext);
}

// THIS FILE IS AUTO GENERATED
function FaCheckCircle (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"},"child":[]}]})(props);
}function FaCopy (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"},"child":[]}]})(props);
}function FaEdit (props) {
  return GenIcon({"attr":{"viewBox":"0 0 576 512"},"child":[{"tag":"path","attr":{"d":"M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"},"child":[]}]})(props);
}function FaPlusCircle (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z"},"child":[]}]})(props);
}function FaTh (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M149.333 56v80c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V56c0-13.255 10.745-24 24-24h101.333c13.255 0 24 10.745 24 24zm181.334 240v-80c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24h101.333c13.256 0 24.001-10.745 24.001-24zm32-240v80c0 13.255 10.745 24 24 24H488c13.255 0 24-10.745 24-24V56c0-13.255-10.745-24-24-24H386.667c-13.255 0-24 10.745-24 24zm-32 80V56c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24h101.333c13.256 0 24.001-10.745 24.001-24zm-205.334 56H24c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24h101.333c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24zM0 376v80c0 13.255 10.745 24 24 24h101.333c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H24c-13.255 0-24 10.745-24 24zm386.667-56H488c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H386.667c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24zm0 160H488c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H386.667c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24zM181.333 376v80c0 13.255 10.745 24 24 24h101.333c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24z"},"child":[]}]})(props);
}function FaTrash (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"},"child":[]}]})(props);
}function FaUser (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"},"child":[]}]})(props);
}

const token = '%[a-f0-9]{2}';
const singleMatcher = new RegExp('(' + token + ')|([^%]+?)', 'gi');
const multiMatcher = new RegExp('(' + token + ')+', 'gi');

function decodeComponents(components, split) {
	try {
		// Try to decode the entire string first
		return [decodeURIComponent(components.join(''))];
	} catch {
		// Do nothing
	}

	if (components.length === 1) {
		return components;
	}

	split = split || 1;

	// Split the array in 2 parts
	const left = components.slice(0, split);
	const right = components.slice(split);

	return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
}

function decode$1(input) {
	try {
		return decodeURIComponent(input);
	} catch {
		let tokens = input.match(singleMatcher) || [];

		for (let i = 1; i < tokens.length; i++) {
			input = decodeComponents(tokens, i).join('');

			tokens = input.match(singleMatcher) || [];
		}

		return input;
	}
}

function customDecodeURIComponent(input) {
	// Keep track of all the replacements and prefill the map with the `BOM`
	const replaceMap = {
		'%FE%FF': '\uFFFD\uFFFD',
		'%FF%FE': '\uFFFD\uFFFD',
	};

	let match = multiMatcher.exec(input);
	while (match) {
		try {
			// Decode as big chunks as possible
			replaceMap[match[0]] = decodeURIComponent(match[0]);
		} catch {
			const result = decode$1(match[0]);

			if (result !== match[0]) {
				replaceMap[match[0]] = result;
			}
		}

		match = multiMatcher.exec(input);
	}

	// Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
	replaceMap['%C2'] = '\uFFFD';

	const entries = Object.keys(replaceMap);

	for (const key of entries) {
		// Replace all decoded components
		input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
	}

	return input;
}

function decodeUriComponent(encodedURI) {
	if (typeof encodedURI !== 'string') {
		throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');
	}

	try {
		// Try the built in decoder first
		return decodeURIComponent(encodedURI);
	} catch {
		// Fallback to a more advanced decoder
		return customDecodeURIComponent(encodedURI);
	}
}

function includeKeys(object, predicate) {
	const result = {};

	if (Array.isArray(predicate)) {
		for (const key of predicate) {
			const descriptor = Object.getOwnPropertyDescriptor(object, key);
			if (descriptor?.enumerable) {
				Object.defineProperty(result, key, descriptor);
			}
		}
	} else {
		// `Reflect.ownKeys()` is required to retrieve symbol properties
		for (const key of Reflect.ownKeys(object)) {
			const descriptor = Object.getOwnPropertyDescriptor(object, key);
			if (descriptor.enumerable) {
				const value = object[key];
				if (predicate(key, value, object)) {
					Object.defineProperty(result, key, descriptor);
				}
			}
		}
	}

	return result;
}

function splitOnFirst(string, separator) {
	if (!(typeof string === 'string' && typeof separator === 'string')) {
		throw new TypeError('Expected the arguments to be of type `string`');
	}

	if (string === '' || separator === '') {
		return [];
	}

	const separatorIndex = string.indexOf(separator);

	if (separatorIndex === -1) {
		return [];
	}

	return [
		string.slice(0, separatorIndex),
		string.slice(separatorIndex + separator.length)
	];
}

const isNullOrUndefined = value => value === null || value === undefined;

// eslint-disable-next-line unicorn/prefer-code-point
const strictUriEncode = string => encodeURIComponent(string).replaceAll(/[!'()*]/g, x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);

const encodeFragmentIdentifier = Symbol('encodeFragmentIdentifier');

function encoderForArrayFormat(options) {
	switch (options.arrayFormat) {
		case 'index': {
			return key => (result, value) => {
				const index = result.length;

				if (
					value === undefined
					|| (options.skipNull && value === null)
					|| (options.skipEmptyString && value === '')
				) {
					return result;
				}

				if (value === null) {
					return [
						...result, [encode(key, options), '[', index, ']'].join(''),
					];
				}

				return [
					...result,
					[encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join(''),
				];
			};
		}

		case 'bracket': {
			return key => (result, value) => {
				if (
					value === undefined
					|| (options.skipNull && value === null)
					|| (options.skipEmptyString && value === '')
				) {
					return result;
				}

				if (value === null) {
					return [
						...result,
						[encode(key, options), '[]'].join(''),
					];
				}

				return [
					...result,
					[encode(key, options), '[]=', encode(value, options)].join(''),
				];
			};
		}

		case 'colon-list-separator': {
			return key => (result, value) => {
				if (
					value === undefined
					|| (options.skipNull && value === null)
					|| (options.skipEmptyString && value === '')
				) {
					return result;
				}

				if (value === null) {
					return [
						...result,
						[encode(key, options), ':list='].join(''),
					];
				}

				return [
					...result,
					[encode(key, options), ':list=', encode(value, options)].join(''),
				];
			};
		}

		case 'comma':
		case 'separator':
		case 'bracket-separator': {
			const keyValueSeparator = options.arrayFormat === 'bracket-separator'
				? '[]='
				: '=';

			return key => (result, value) => {
				if (
					value === undefined
					|| (options.skipNull && value === null)
					|| (options.skipEmptyString && value === '')
				) {
					return result;
				}

				// Translate null to an empty string so that it doesn't serialize as 'null'
				value = value === null ? '' : value;

				if (result.length === 0) {
					return [[encode(key, options), keyValueSeparator, encode(value, options)].join('')];
				}

				return [[result, encode(value, options)].join(options.arrayFormatSeparator)];
			};
		}

		default: {
			return key => (result, value) => {
				if (
					value === undefined
					|| (options.skipNull && value === null)
					|| (options.skipEmptyString && value === '')
				) {
					return result;
				}

				if (value === null) {
					return [
						...result,
						encode(key, options),
					];
				}

				return [
					...result,
					[encode(key, options), '=', encode(value, options)].join(''),
				];
			};
		}
	}
}

function parserForArrayFormat(options) {
	let result;

	switch (options.arrayFormat) {
		case 'index': {
			return (key, value, accumulator) => {
				result = /\[(\d*)]$/.exec(key);

				key = key.replace(/\[\d*]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = {};
				}

				accumulator[key][result[1]] = value;
			};
		}

		case 'bracket': {
			return (key, value, accumulator) => {
				result = /(\[])$/.exec(key);
				key = key.replace(/\[]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = [value];
					return;
				}

				accumulator[key] = [...accumulator[key], value];
			};
		}

		case 'colon-list-separator': {
			return (key, value, accumulator) => {
				result = /(:list)$/.exec(key);
				key = key.replace(/:list$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = [value];
					return;
				}

				accumulator[key] = [...accumulator[key], value];
			};
		}

		case 'comma':
		case 'separator': {
			return (key, value, accumulator) => {
				const isArray = typeof value === 'string' && value.includes(options.arrayFormatSeparator);
				const newValue = isArray ? value.split(options.arrayFormatSeparator).map(item => decode(item, options)) : (value === null ? value : decode(value, options));
				accumulator[key] = newValue;
			};
		}

		case 'bracket-separator': {
			return (key, value, accumulator) => {
				const isArray = /(\[])$/.test(key);
				key = key.replace(/\[]$/, '');

				if (!isArray) {
					accumulator[key] = value ? decode(value, options) : value;
					return;
				}

				const arrayValue = value === null
					? []
					: decode(value, options).split(options.arrayFormatSeparator);

				if (accumulator[key] === undefined) {
					accumulator[key] = arrayValue;
					return;
				}

				accumulator[key] = [...accumulator[key], ...arrayValue];
			};
		}

		default: {
			return (key, value, accumulator) => {
				if (accumulator[key] === undefined) {
					accumulator[key] = value;
					return;
				}

				accumulator[key] = [...[accumulator[key]].flat(), value];
			};
		}
	}
}

function validateArrayFormatSeparator(value) {
	if (typeof value !== 'string' || value.length !== 1) {
		throw new TypeError('arrayFormatSeparator must be single character string');
	}
}

function encode(value, options) {
	if (options.encode) {
		return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
	}

	return value;
}

function decode(value, options) {
	if (options.decode) {
		return decodeUriComponent(value);
	}

	return value;
}

function keysSorter(input) {
	if (Array.isArray(input)) {
		return input.sort();
	}

	if (typeof input === 'object') {
		return keysSorter(Object.keys(input))
			.sort((a, b) => Number(a) - Number(b))
			.map(key => input[key]);
	}

	return input;
}

function removeHash(input) {
	const hashStart = input.indexOf('#');
	if (hashStart !== -1) {
		input = input.slice(0, hashStart);
	}

	return input;
}

function getHash(url) {
	let hash = '';
	const hashStart = url.indexOf('#');
	if (hashStart !== -1) {
		hash = url.slice(hashStart);
	}

	return hash;
}

function parseValue(value, options, type) {
	if (type === 'string' && typeof value === 'string') {
		return value;
	}

	if (typeof type === 'function' && typeof value === 'string') {
		return type(value);
	}

	if (type === 'boolean' && value === null) {
		return true;
	}

	if (type === 'boolean' && value !== null && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
		return value.toLowerCase() === 'true';
	}

	if (type === 'boolean' && value !== null && (value.toLowerCase() === '1' || value.toLowerCase() === '0')) {
		return value.toLowerCase() === '1';
	}

	if (type === 'string[]' && options.arrayFormat !== 'none' && typeof value === 'string') {
		return [value];
	}

	if (type === 'number[]' && options.arrayFormat !== 'none' && !Number.isNaN(Number(value)) && (typeof value === 'string' && value.trim() !== '')) {
		return [Number(value)];
	}

	if (type === 'number' && !Number.isNaN(Number(value)) && (typeof value === 'string' && value.trim() !== '')) {
		return Number(value);
	}

	if (options.parseBooleans && value !== null && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
		return value.toLowerCase() === 'true';
	}

	if (options.parseNumbers && !Number.isNaN(Number(value)) && (typeof value === 'string' && value.trim() !== '')) {
		return Number(value);
	}

	return value;
}

function extract(input) {
	input = removeHash(input);
	const queryStart = input.indexOf('?');
	if (queryStart === -1) {
		return '';
	}

	return input.slice(queryStart + 1);
}

function parse(query, options) {
	options = {
		decode: true,
		sort: true,
		arrayFormat: 'none',
		arrayFormatSeparator: ',',
		parseNumbers: false,
		parseBooleans: false,
		types: Object.create(null),
		...options,
	};

	validateArrayFormatSeparator(options.arrayFormatSeparator);

	const formatter = parserForArrayFormat(options);

	// Create an object with no prototype
	const returnValue = Object.create(null);

	if (typeof query !== 'string') {
		return returnValue;
	}

	query = query.trim().replace(/^[?#&]/, '');

	if (!query) {
		return returnValue;
	}

	for (const parameter of query.split('&')) {
		if (parameter === '') {
			continue;
		}

		const parameter_ = options.decode ? parameter.replaceAll('+', ' ') : parameter;

		let [key, value] = splitOnFirst(parameter_, '=');

		if (key === undefined) {
			key = parameter_;
		}

		// Missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		value = value === undefined ? null : (['comma', 'separator', 'bracket-separator'].includes(options.arrayFormat) ? value : decode(value, options));
		formatter(decode(key, options), value, returnValue);
	}

	for (const [key, value] of Object.entries(returnValue)) {
		if (typeof value === 'object' && value !== null && options.types[key] !== 'string') {
			for (const [key2, value2] of Object.entries(value)) {
				const typeOption = options.types[key];
				const type = typeof typeOption === 'function' ? typeOption : (typeOption ? typeOption.replace('[]', '') : undefined);
				value[key2] = parseValue(value2, options, type);
			}
		} else if (typeof value === 'object' && value !== null && options.types[key] === 'string') {
			returnValue[key] = Object.values(value).join(options.arrayFormatSeparator);
		} else {
			returnValue[key] = parseValue(value, options, options.types[key]);
		}
	}

	if (options.sort === false) {
		return returnValue;
	}

	// TODO: Remove the use of `reduce`.
	// eslint-disable-next-line unicorn/no-array-reduce
	return (options.sort === true ? Object.keys(returnValue).sort() : Object.keys(returnValue).sort(options.sort)).reduce((result, key) => {
		const value = returnValue[key];
		result[key] = Boolean(value) && typeof value === 'object' && !Array.isArray(value) ? keysSorter(value) : value;
		return result;
	}, Object.create(null));
}

function stringify(object, options) {
	if (!object) {
		return '';
	}

	options = {
		encode: true,
		strict: true,
		arrayFormat: 'none',
		arrayFormatSeparator: ',',
		...options,
	};

	validateArrayFormatSeparator(options.arrayFormatSeparator);

	const shouldFilter = key => (
		(options.skipNull && isNullOrUndefined(object[key]))
		|| (options.skipEmptyString && object[key] === '')
	);

	const formatter = encoderForArrayFormat(options);

	const objectCopy = {};

	for (const [key, value] of Object.entries(object)) {
		if (!shouldFilter(key)) {
			objectCopy[key] = value;
		}
	}

	const keys = Object.keys(objectCopy);

	if (options.sort !== false) {
		keys.sort(options.sort);
	}

	return keys.map(key => {
		let value = object[key];

		// Apply replacer function if provided
		if (options.replacer) {
			value = options.replacer(key, value);

			// If replacer returns undefined, skip this key
			if (value === undefined) {
				return '';
			}
		}

		if (value === undefined) {
			return '';
		}

		if (value === null) {
			return encode(key, options);
		}

		if (Array.isArray(value)) {
			if (value.length === 0 && options.arrayFormat === 'bracket-separator') {
				return encode(key, options) + '[]';
			}

			// Apply replacer to array elements if provided
			// Note: We don't re-apply replacer to the array itself, only to elements
			let processedArray = value;
			if (options.replacer) {
				processedArray = value.map((item, index) =>
					options.replacer(`${key}[${index}]`, item),
				).filter(item => item !== undefined);
			}

			return processedArray
				.reduce(formatter(key), [])
				.join('&');
		}

		return encode(key, options) + '=' + encode(value, options);
	}).filter(x => x.length > 0).join('&');
}

function parseUrl(url, options) {
	options = {
		decode: true,
		...options,
	};

	let [url_, hash] = splitOnFirst(url, '#');

	if (url_ === undefined) {
		url_ = url;
	}

	return {
		url: url_?.split('?')?.[0] ?? '',
		query: parse(extract(url), options),
		...(options && options.parseFragmentIdentifier && hash ? {fragmentIdentifier: decode(hash, options)} : {}),
	};
}

function stringifyUrl(object, options) {
	options = {
		encode: true,
		strict: true,
		[encodeFragmentIdentifier]: true,
		...options,
	};

	const url = removeHash(object.url).split('?')[0] || '';
	const queryFromUrl = extract(object.url);

	const query = {
		...parse(queryFromUrl, {sort: false, ...options}),
		...object.query,
	};

	let queryString = stringify(query, options);
	queryString &&= `?${queryString}`;

	let hash = getHash(object.url);
	if (typeof object.fragmentIdentifier === 'string') {
		const urlObjectForFragmentEncode = new URL(url);
		urlObjectForFragmentEncode.hash = object.fragmentIdentifier;
		hash = options[encodeFragmentIdentifier] ? urlObjectForFragmentEncode.hash : `#${object.fragmentIdentifier}`;
	}

	return `${url}${queryString}${hash}`;
}

function pick(input, filter, options) {
	options = {
		parseFragmentIdentifier: true,
		[encodeFragmentIdentifier]: false,
		...options,
	};

	const {url, query, fragmentIdentifier} = parseUrl(input, options);

	return stringifyUrl({
		url,
		query: includeKeys(query, filter),
		fragmentIdentifier,
	}, options);
}

function exclude(input, filter, options) {
	const exclusionFilter = Array.isArray(filter) ? key => !filter.includes(key) : (key, value) => !filter(key, value);

	return pick(input, exclusionFilter, options);
}

var queryString = /*#__PURE__*/Object.freeze({
    __proto__: null,
    exclude: exclude,
    extract: extract,
    parse: parse,
    parseUrl: parseUrl,
    pick: pick,
    stringify: stringify,
    stringifyUrl: stringifyUrl
});

/**
 * Storage abstraction for testable localStorage access
 *
 * @module utils/storage
 */
/**
 * Default localStorage implementation
 */
var LocalStorageAdapter = /** @class */ (function () {
    function LocalStorageAdapter() {
    }
    /** Get a value from localStorage */
    LocalStorageAdapter.prototype.get = function (key) {
        try {
            return localStorage.getItem(key);
        }
        catch (_a) {
            return null;
        }
    };
    /** Set a value in localStorage */
    LocalStorageAdapter.prototype.set = function (key, value) {
        try {
            localStorage.setItem(key, value);
        }
        catch (_a) {
            // Storage may be unavailable or full
            console.warn("Failed to save to localStorage: ".concat(key));
        }
    };
    /** Remove a value from localStorage */
    LocalStorageAdapter.prototype.remove = function (key) {
        try {
            localStorage.removeItem(key);
        }
        catch (_a) {
            // Storage may be unavailable
        }
    };
    return LocalStorageAdapter;
}());
/** Default storage instance using localStorage */
var currentStorage = new LocalStorageAdapter();
/**
 * Get the current storage instance
 * @returns The active storage implementation
 */
function getStorage() {
    return currentStorage;
}

var SETTINGS_KEY = 'minimal-history-plugin';
/** Default maximum results for API queries */
var DEFAULT_MAX_RESULTS = 1000;
/** Default settings when none are stored */
var DEFAULT_SETTINGS = {
    leftPaneSize: null,
    topPaneSize: null,
    maxResults: DEFAULT_MAX_RESULTS,
};
/**
 * Parse stored settings JSON safely
 * @param jsonString - JSON string from localStorage
 * @returns Parsed settings or empty object
 */
function parseStoredSettings(jsonString) {
    if (jsonString === null) {
        return {};
    }
    try {
        return JSON.parse(jsonString);
    }
    catch (_a) {
        return {};
    }
}
/**
 * Load plugin settings from localStorage and URL hash
 * @returns Merged plugin settings
 */
var loadSettings = function () {
    var _a, _b, _c;
    var storage = getStorage();
    var hashSplit = location.hash.split('?', 1)[0];
    var parsed = queryString.parse(location.hash.substring((hashSplit !== null && hashSplit !== void 0 ? hashSplit : '').length + 1));
    var raw = parseStoredSettings(storage.get(SETTINGS_KEY));
    var autoRefreshParam = parsed['autoRefresh'];
    var showHistoricBadgesParam = parsed['showHistoricBadges'];
    var showSequenceFlowParam = parsed['showSequenceFlow'];
    var showHeatmapParam = parsed['showHeatmap'];
    var maxResultsParam = parsed['maxResults'];
    var maxResultsValue = typeof maxResultsParam === 'string' ? parseInt(maxResultsParam, 10) : undefined;
    return {
        autoRefresh: raw.autoRefresh === true || autoRefreshParam !== undefined,
        showHistoricBadges: raw.showHistoricBadges === true || showHistoricBadgesParam !== undefined,
        showSequenceFlow: raw.showSequenceFlow === true || showSequenceFlowParam !== undefined,
        showHeatmap: raw.showHeatmap === true || showHeatmapParam !== undefined,
        leftPaneSize: (_a = raw.leftPaneSize) !== null && _a !== void 0 ? _a : DEFAULT_SETTINGS.leftPaneSize,
        topPaneSize: (_b = raw.topPaneSize) !== null && _b !== void 0 ? _b : DEFAULT_SETTINGS.topPaneSize,
        maxResults: (_c = maxResultsValue !== null && maxResultsValue !== void 0 ? maxResultsValue : raw.maxResults) !== null && _c !== void 0 ? _c : DEFAULT_SETTINGS.maxResults,
    };
};
/**
 * Save plugin settings to storage
 * @param settings - The settings to save
 */
var saveSettings = function (settings) {
    var storage = getStorage();
    storage.set(SETTINGS_KEY, JSON.stringify(settings));
};

/**
 * Gets the configured max results setting as a string for API params.
 * @returns The max results value from settings as a string
 */
function getMaxResultsParam() {
    return String(loadSettings().maxResults);
}
/** Cache TTL duration in minutes */
var CACHE_TTL_MINUTES = 5;
/** Seconds per minute */
var SECONDS_PER_MINUTE = 60;
/** Default cache TTL in milliseconds (5 minutes) */
var CACHE_TTL_MS = CACHE_TTL_MINUTES * SECONDS_PER_MINUTE * 1000;
/** HTTP status code for No Content response */
var HTTP_STATUS_NO_CONTENT = 204;
/** In-memory cache for process definition XML */
var processDefinitionXmlCache = new Map();
/** In-memory cache for process definitions */
var processDefinitionCache = new Map();
/**
 * Checks if a cache entry is still valid.
 * @param entry - The cache entry to check
 * @returns True if the entry is valid and not expired
 */
function isCacheValid(entry) {
    if (!entry) {
        return false;
    }
    return Date.now() - entry.timestamp < CACHE_TTL_MS;
}
/**
 * Clears all API caches.
 * Useful for testing or when data may have changed.
 */
function clearApiCache() {
    processDefinitionXmlCache.clear();
    processDefinitionCache.clear();
}
/**
 * Custom error class for API errors with status code and response body.
 */
var ApiError = /** @class */ (function (_super) {
    __extends(ApiError, _super);
    /**
     * @param message - Human readable error message, from the engine where it sends one
     * @param status - HTTP status code of the response
     * @param body - Parsed response body
     * @param path - API endpoint path that produced the error
     */
    function ApiError(message, status, body, path) {
        var _this = _super.call(this, message) || this;
        // Required while the build targets ES5: the downlevel of `extends Error` loses the
        // prototype link, which silently makes every `err instanceof ApiError` false. Without
        // this line the status checks throughout the plugins never match. Safe to keep at any
        // target, and harmless once the target is raised.
        Object.setPrototypeOf(_this, ApiError.prototype);
        _this.name = 'ApiError';
        _this.status = status;
        _this.body = body;
        _this.path = path;
        return _this;
    }
    return ApiError;
}(Error));
/**
 * Injectable fetch function for testing purposes.
 * Defaults to the global fetch.
 */
var fetchFn = fetch;
/**
 * Sets a custom fetch function for testing purposes.
 * @param fn - The fetch function to use
 */
function setFetchFunction(fn) {
    fetchFn = fn;
}
/**
 * Resets the fetch function to the global fetch.
 */
function resetFetchFunction() {
    fetchFn = fetch;
}
/**
 * Gets the current fetch function.
 * @returns The current fetch function
 */
function getFetchFunction() {
    return fetchFn;
}
/**
 * Builds headers for API requests with CSRF token.
 * @param api - The API configuration object
 * @returns Headers object for fetch requests
 */
var headers = function (api) {
    return {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': api.CSRFToken,
    };
};
/**
 * Parses response body based on content type.
 * @param res - The fetch Response object
 * @returns Parsed JSON or text content
 */
function parseResponseBody(res) {
    return __awaiter(this, void 0, void 0, function () {
        var contentType;
        var _a;
        return __generator(this, function (_b) {
            contentType = (_a = res.headers.get('Content-Type')) !== null && _a !== void 0 ? _a : '';
            if (contentType.startsWith('application/json')) {
                return [2 /*return*/, res.json()];
            }
            return [2 /*return*/, res.text()];
        });
    });
}
/**
 * Makes a GET request to the engine API.
 * @param api - The API configuration object
 * @param path - The API endpoint path
 * @param params - Optional query parameters
 * @param options - Optional per-request options, such as an abort signal
 * @returns Promise resolving to the response data
 * @throws {ApiError} When the response status is not 2xx
 */
var get = function (api, path, params, options) { return __awaiter(void 0, void 0, void 0, function () {
    var splitResult, query, url, res, body, message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // XXX: Workaround a possible bug where engine api has been parsed wrong
                if (/\/#\//.exec(api.engine)) {
                    splitResult = api.engine.split('/#/')[0];
                    api.engine = (splitResult !== null && splitResult !== void 0 ? splitResult : '').replace(/.*\//g, '');
                    api.engineApi = "".concat(api.baseApi, "/engine/").concat(api.engine);
                }
                params = params !== null && params !== void 0 ? params : {};
                if (['/history/activity-instance', '/history/variable-instance', '/history/decision-instance'].includes(path) &&
                    !params['maxResults']) {
                    params['maxResults'] = getMaxResultsParam();
                }
                query = new URLSearchParams(params).toString();
                url = query ? "".concat(api.engineApi).concat(path, "?").concat(query) : "".concat(api.engineApi).concat(path);
                return [4 /*yield*/, fetchFn(url, __assign({ method: 'get', headers: headers(api) }, ((options === null || options === void 0 ? void 0 : options.signal) ? { signal: options.signal } : {})))];
            case 1:
                res = _a.sent();
                return [4 /*yield*/, parseResponseBody(res)];
            case 2:
                body = _a.sent();
                if (res.ok) {
                    return [2 /*return*/, body];
                }
                else {
                    message = typeof body === 'object' && body !== null && 'message' in body
                        ? String(body.message)
                        : "API error: ".concat(res.status);
                    throw new ApiError(message, res.status, body, path);
                }
        }
    });
}); };
/**
 * Makes a POST request to the engine API.
 * @param api - The API configuration object
 * @param path - The API endpoint path
 * @param params - Optional query parameters
 * @param payload - Optional request body
 * @returns Promise resolving to the response data
 * @throws {ApiError} When the response status is not 2xx
 */
var post = function (api, path, params, payload) { return __awaiter(void 0, void 0, void 0, function () {
    var query, body, url, res, responseBody, message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                params = params !== null && params !== void 0 ? params : {};
                if (['/history/activity-instance', '/history/variable-instance', '/history/decision-instance'].includes(path) &&
                    !params['maxResults']) {
                    params['maxResults'] = getMaxResultsParam();
                }
                query = new URLSearchParams(params).toString();
                body = payload !== null && payload !== void 0 ? payload : null;
                url = query ? "".concat(api.engineApi).concat(path, "?").concat(query) : "".concat(api.engineApi).concat(path);
                return [4 /*yield*/, fetchFn(url, {
                        method: 'post',
                        headers: headers(api),
                        body: body,
                    })];
            case 1:
                res = _a.sent();
                return [4 /*yield*/, parseResponseBody(res)];
            case 2:
                responseBody = _a.sent();
                if (res.ok) {
                    return [2 /*return*/, responseBody];
                }
                else {
                    message = typeof responseBody === 'object' && responseBody !== null && 'message' in responseBody
                        ? String(responseBody.message)
                        : "API error: ".concat(res.status);
                    throw new ApiError(message, res.status, responseBody, path);
                }
        }
    });
}); };
/**
 * Makes a PUT request to the engine API.
 * @param api - The API configuration object
 * @param path - The API endpoint path
 * @param payload - Optional request body
 * @returns Promise resolving to the response data (or null for 204)
 * @throws {ApiError} When the response status is not 2xx
 */
var put = function (api, path, payload) { return __awaiter(void 0, void 0, void 0, function () {
    var body, url, res, responseBody, message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = payload !== null && payload !== void 0 ? payload : null;
                url = "".concat(api.engineApi).concat(path);
                return [4 /*yield*/, fetchFn(url, {
                        method: 'PUT',
                        headers: headers(api),
                        body: body,
                    })];
            case 1:
                res = _a.sent();
                // 204 No Content is a valid success response for PUT
                if (res.status === HTTP_STATUS_NO_CONTENT) {
                    return [2 /*return*/, null];
                }
                return [4 /*yield*/, parseResponseBody(res)];
            case 2:
                responseBody = _a.sent();
                if (res.ok) {
                    return [2 /*return*/, responseBody];
                }
                else {
                    message = typeof responseBody === 'object' && responseBody !== null && 'message' in responseBody
                        ? String(responseBody.message)
                        : "API error: ".concat(res.status);
                    throw new ApiError(message, res.status, responseBody, path);
                }
        }
    });
}); };
/**
 * Makes a DELETE request to the engine API.
 * @param api - The API configuration object
 * @param path - The API endpoint path
 * @returns Promise resolving to null on success
 * @throws {ApiError} When the response status is not 2xx
 */
var del = function (api, path) { return __awaiter(void 0, void 0, void 0, function () {
    var url, res, responseBody, message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(api.engineApi).concat(path);
                return [4 /*yield*/, fetchFn(url, {
                        method: 'DELETE',
                        headers: headers(api),
                    })];
            case 1:
                res = _a.sent();
                // 204 No Content is a valid success response for DELETE
                if (res.status === HTTP_STATUS_NO_CONTENT || res.ok) {
                    return [2 /*return*/, null];
                }
                return [4 /*yield*/, parseResponseBody(res)];
            case 2:
                responseBody = _a.sent();
                message = typeof responseBody === 'object' && responseBody !== null && 'message' in responseBody
                    ? String(responseBody.message)
                    : "API error: ".concat(res.status);
                throw new ApiError(message, res.status, responseBody, path);
        }
    });
}); };
// =============================================================================
// Typed API Client Functions
// =============================================================================
/**
 * Fetches historic activity instances for a process instance.
 * @param api - The API configuration object
 * @param processInstanceId - The process instance ID
 * @param params - Optional additional query parameters
 * @returns Promise resolving to array of historic activity instances
 */
function getActivities(api, processInstanceId, params) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, get(api, '/history/activity-instance', __assign({ processInstanceId: processInstanceId }, params))];
                case 1: return [2 /*return*/, (_a.sent())];
            }
        });
    });
}
/**
 * Fetches a bounded page of historic activity instances, oldest first, reporting
 * whether the instance had more than fit.
 *
 * Ordering matters here, not just the bound: an unordered truncated response leaves
 * the executed path with holes scattered through it, while a chronological prefix
 * leaves a path that is simply complete up to a point.
 *
 * @param api - The API configuration object
 * @param processInstanceId - The process instance ID
 * @param maxResults - Maximum records to keep
 * @returns The records and whether the history was truncated
 */
function getActivityHistoryPage(api, processInstanceId, maxResults) {
    return __awaiter(this, void 0, void 0, function () {
        var records;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getActivities(api, processInstanceId, {
                        sortBy: 'startTime',
                        sortOrder: 'asc',
                        maxResults: String(maxResults + 1),
                    })];
                case 1:
                    records = _a.sent();
                    return [2 /*return*/, {
                            activities: records.slice(0, maxResults),
                            truncated: records.length > maxResults,
                        }];
            }
        });
    });
}
/**
 * Fetches historic variable instances for a process instance.
 * @param api - The API configuration object
 * @param processInstanceId - The process instance ID
 * @param params - Optional additional query parameters
 * @returns Promise resolving to array of historic variable instances
 */
function getVariables(api, processInstanceId, params) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, get(api, '/history/variable-instance', __assign({ processInstanceId: processInstanceId }, params))];
                case 1: return [2 /*return*/, (_a.sent())];
            }
        });
    });
}
/**
 * Fetches historic decision instances for a process instance.
 * @param api - The API configuration object
 * @param processInstanceId - The process instance ID
 * @param params - Optional additional query parameters
 * @returns Promise resolving to array of historic decision instances
 */
function getDecisions(api, processInstanceId, params) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, get(api, '/history/decision-instance', __assign({ processInstanceId: processInstanceId }, params))];
                case 1: return [2 /*return*/, (_a.sent())];
            }
        });
    });
}
/**
 * Fetches a process definition by ID.
 * Results are cached for 5 minutes since process definitions rarely change.
 * @param api - The API configuration object
 * @param processDefinitionId - The process definition ID
 * @returns Promise resolving to the process definition
 */
function getProcessDefinition(api, processDefinitionId) {
    return __awaiter(this, void 0, void 0, function () {
        var cached, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cached = processDefinitionCache.get(processDefinitionId);
                    if (isCacheValid(cached)) {
                        return [2 /*return*/, cached.data];
                    }
                    return [4 /*yield*/, get(api, "/process-definition/".concat(processDefinitionId))];
                case 1:
                    data = (_a.sent());
                    // Store in cache
                    processDefinitionCache.set(processDefinitionId, {
                        data: data,
                        timestamp: Date.now(),
                    });
                    return [2 /*return*/, data];
            }
        });
    });
}
/**
 * Fetches the BPMN XML for a process definition.
 * Results are cached for 5 minutes since BPMN XML doesn't change for a given definition ID.
 * @param api - The API configuration object
 * @param processDefinitionId - The process definition ID
 * @returns Promise resolving to the BPMN XML object with id and bpmn20Xml properties
 */
function getProcessDefinitionXml(api, processDefinitionId) {
    return __awaiter(this, void 0, void 0, function () {
        var cached, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cached = processDefinitionXmlCache.get(processDefinitionId);
                    if (isCacheValid(cached)) {
                        return [2 /*return*/, cached.data];
                    }
                    return [4 /*yield*/, get(api, "/process-definition/".concat(processDefinitionId, "/xml"))];
                case 1:
                    data = (_a.sent());
                    // Store in cache
                    processDefinitionXmlCache.set(processDefinitionId, {
                        data: data,
                        timestamp: Date.now(),
                    });
                    return [2 /*return*/, data];
            }
        });
    });
}
/**
 * Fetches a running process instance by ID.
 * @param api - The API configuration object
 * @param processInstanceId - The process instance ID
 * @returns Promise resolving to the process instance
 */
function getProcessInstance(api, processInstanceId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, get(api, "/process-instance/".concat(processInstanceId))];
                case 1: return [2 /*return*/, (_a.sent())];
            }
        });
    });
}
/**
 * Fetches a historic process instance by ID.
 * @param api - The API configuration object
 * @param processInstanceId - The process instance ID
 * @returns Promise resolving to the historic process instance
 */
function getHistoricProcessInstance(api, processInstanceId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, get(api, "/history/process-instance/".concat(processInstanceId))];
                case 1: return [2 /*return*/, (_a.sent())];
            }
        });
    });
}
/**
 * Fetches the count of historic process instances for a process definition.
 * @param api - The API configuration object
 * @param processDefinitionId - The process definition ID
 * @returns Promise resolving to the count
 */
function getHistoricProcessInstanceCount(api, processDefinitionId) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, get(api, '/history/process-instance/count', { processDefinitionId: processDefinitionId })];
                case 1:
                    result = (_a.sent());
                    return [2 /*return*/, result.count];
            }
        });
    });
}
/**
 * Fetches external tasks for a process instance.
 * @param api - The API configuration object
 * @param processInstanceId - The process instance ID
 * @param params - Optional additional query parameters
 * @returns Promise resolving to array of external tasks
 */
function getExternalTasks(api, processInstanceId, params) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, get(api, '/external-task', __assign({ processInstanceId: processInstanceId }, params))];
                case 1: return [2 /*return*/, (_a.sent())];
            }
        });
    });
}
/**
 * Unlocks an external task.
 * @param api - The API configuration object
 * @param externalTaskId - The external task ID
 * @returns Promise resolving when the task is unlocked
 */
function unlockExternalTask(api, externalTaskId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, post(api, "/external-task/".concat(externalTaskId, "/unlock"))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Fetches a task by ID.
 * @param api - The API configuration object
 * @param taskId - The task ID
 * @returns Promise resolving to the task with processInstanceId
 */
function getTask(api, taskId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, get(api, "/task/".concat(taskId))];
                case 1: return [2 /*return*/, (_a.sent())];
            }
        });
    });
}
/**
 * Fetches the engine version.
 * @param api - The API configuration object
 * @returns Promise resolving to the version object
 */
function getVersion(api) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, get(api, '/version')];
                case 1: return [2 /*return*/, (_a.sent())];
            }
        });
    });
}
/**
 * Submits a process instance modification.
 * @param api - The API configuration object
 * @param processInstanceId - The process instance ID
 * @param payload - The modification payload
 * @returns Promise resolving when modification is complete
 */
function modifyProcessInstance(api, processInstanceId, payload) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, post(api, "/process-instance/".concat(processInstanceId, "/modification"), {}, JSON.stringify(payload))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// =============================================================================
// Decision Definition API Functions
// =============================================================================
/**
 * Fetches all decision definitions.
 * @param api - The API configuration object
 * @param params - Optional query parameters for filtering
 * @returns Promise resolving to array of decision definitions
 */
function getDecisionDefinitions(api, params) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, get(api, '/decision-definition', __assign({ sortBy: 'name', sortOrder: 'asc', latestVersion: 'true' }, params))];
                case 1: return [2 /*return*/, (_a.sent())];
            }
        });
    });
}
/**
 * Fetches a decision definition by ID.
 * @param api - The API configuration object
 * @param decisionDefinitionId - The decision definition ID
 * @returns Promise resolving to the decision definition
 */
function getDecisionDefinition(api, decisionDefinitionId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, get(api, "/decision-definition/".concat(decisionDefinitionId))];
                case 1: return [2 /*return*/, (_a.sent())];
            }
        });
    });
}
/**
 * Fetches the DMN XML for a decision definition.
 * @param api - The API configuration object
 * @param decisionDefinitionId - The decision definition ID
 * @returns Promise resolving to the DMN XML object
 */
function getDecisionDefinitionXml(api, decisionDefinitionId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, get(api, "/decision-definition/".concat(decisionDefinitionId, "/xml"))];
                case 1: return [2 /*return*/, (_a.sent())];
            }
        });
    });
}
/**
 * Gets the most recent historic decision instance for a decision definition.
 * Includes outputs with ruleId information for highlighting matched rules.
 * @param api - The API configuration object
 * @param decisionDefinitionId - The decision definition ID
 * @returns Promise resolving to the historic decision instance with outputs, or null if not found
 */
function getLatestDecisionInstance(api, decisionDefinitionId) {
    return __awaiter(this, void 0, void 0, function () {
        var result, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, get(api, '/history/decision-instance', {
                            decisionDefinitionId: decisionDefinitionId,
                            includeOutputs: 'true',
                            sortBy: 'evaluationTime',
                            sortOrder: 'desc',
                            maxResults: '1',
                        })];
                case 1:
                    result = (_b.sent());
                    return [2 /*return*/, result.length > 0 ? ((_a = result[0]) !== null && _a !== void 0 ? _a : null) : null];
                case 2:
                    error_1 = _b.sent();
                    console.error('Failed to get latest decision instance:', error_1);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Evaluates a decision definition with the given variables.
 * @param api - The API configuration object
 * @param decisionDefinitionId - The decision definition ID
 * @param variables - The input variables for evaluation
 * @returns Promise resolving to array of result records
 */
function evaluateDecision(api, decisionDefinitionId, variables) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, post(api, "/decision-definition/".concat(decisionDefinitionId, "/evaluate"), {}, JSON.stringify({ variables: variables }))];
                case 1: return [2 /*return*/, (_a.sent())];
            }
        });
    });
}

var api = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ApiError: ApiError,
    clearApiCache: clearApiCache,
    del: del,
    evaluateDecision: evaluateDecision,
    get: get,
    getActivities: getActivities,
    getActivityHistoryPage: getActivityHistoryPage,
    getDecisionDefinition: getDecisionDefinition,
    getDecisionDefinitionXml: getDecisionDefinitionXml,
    getDecisionDefinitions: getDecisionDefinitions,
    getDecisions: getDecisions,
    getExternalTasks: getExternalTasks,
    getFetchFunction: getFetchFunction,
    getHistoricProcessInstance: getHistoricProcessInstance,
    getHistoricProcessInstanceCount: getHistoricProcessInstanceCount,
    getLatestDecisionInstance: getLatestDecisionInstance,
    getProcessDefinition: getProcessDefinition,
    getProcessDefinitionXml: getProcessDefinitionXml,
    getProcessInstance: getProcessInstance,
    getTask: getTask,
    getVariables: getVariables,
    getVersion: getVersion,
    headers: headers,
    modifyProcessInstance: modifyProcessInstance,
    post: post,
    put: put,
    resetFetchFunction: resetFetchFunction,
    setFetchFunction: setFetchFunction,
    unlockExternalTask: unlockExternalTask
});

/**
 * Authorization utilities and constants for the admin authorization plugin.
 * Shared types, constants, and helper functions for authorization management.
 */
// =============================================================================
// Constants
// =============================================================================
/** Authorization types - 0=global, 1=grant, 2=revoke */
var AUTH_TYPES = [
    { id: 0, name: 'Global', label: 'GLOBAL' },
    { id: 1, name: 'Grant', label: 'ALLOW' },
    { id: 2, name: 'Revoke', label: 'DENY' },
];
/** Resource types as defined in Camunda/Operaton - sorted by name */
var RESOURCE_TYPES = [
    { id: 0, name: 'Application' },
    { id: 4, name: 'Authorization' },
    { id: 13, name: 'Batch' },
    { id: 10, name: 'Decision Definition' },
    { id: 14, name: 'Decision Requirements Definition' },
    { id: 9, name: 'Deployment' },
    { id: 5, name: 'Filter' },
    { id: 2, name: 'Group' },
    { id: 3, name: 'Group Membership' },
    { id: 20, name: 'Historic Process Instance' },
    { id: 19, name: 'Historic Task' },
    { id: 17, name: 'User Operation Log Category' },
    { id: 6, name: 'Process Definition' },
    { id: 8, name: 'Process Instance' },
    { id: 15, name: 'Report' },
    { id: 16, name: 'Dashboard' },
    { id: 21, name: 'System' },
    { id: 7, name: 'Task' },
    { id: 11, name: 'Tenant' },
    { id: 12, name: 'Tenant Membership' },
    { id: 1, name: 'User' },
];
/**
 * Permissions available for each resource type.
 * Based on Operaton / Camunda 7 authorization service documentation.
 * Each resource type includes 'ALL' plus its specific permissions.
 */
var PERMISSIONS_BY_RESOURCE = {
    // Application (0)
    0: ['ALL', 'ACCESS'],
    // User (1)
    1: ['ALL', 'READ', 'UPDATE', 'CREATE', 'DELETE'],
    // Group (2)
    2: ['ALL', 'READ', 'UPDATE', 'CREATE', 'DELETE'],
    // Group Membership (3)
    3: ['ALL', 'CREATE', 'DELETE'],
    // Authorization (4)
    4: ['ALL', 'READ', 'UPDATE', 'CREATE', 'DELETE'],
    // Filter (5)
    5: ['ALL', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
    // Process Definition (6)
    6: [
        'ALL',
        'READ',
        'UPDATE',
        'DELETE',
        'SUSPEND',
        'CREATE_INSTANCE',
        'READ_INSTANCE',
        'UPDATE_INSTANCE',
        'RETRY_JOB',
        'SUSPEND_INSTANCE',
        'DELETE_INSTANCE',
        'MIGRATE_INSTANCE',
        'READ_TASK',
        'UPDATE_TASK',
        'TASK_ASSIGN',
        'TASK_WORK',
        'READ_TASK_VARIABLE',
        'READ_HISTORY',
        'READ_HISTORY_VARIABLE',
        'DELETE_HISTORY',
        'READ_INSTANCE_VARIABLE',
        'UPDATE_INSTANCE_VARIABLE',
        'UPDATE_TASK_VARIABLE',
        'UPDATE_HISTORY',
    ],
    // Task (7)
    7: ['ALL', 'CREATE', 'READ', 'UPDATE', 'DELETE', 'TASK_ASSIGN', 'TASK_WORK', 'UPDATE_VARIABLE', 'READ_VARIABLE'],
    // Process Instance (8)
    8: ['ALL', 'CREATE', 'READ', 'UPDATE', 'DELETE', 'RETRY_JOB', 'SUSPEND', 'UPDATE_VARIABLE'],
    // Deployment (9)
    9: ['ALL', 'CREATE', 'READ', 'DELETE'],
    // Decision Definition (10)
    10: ['ALL', 'READ', 'UPDATE', 'CREATE_INSTANCE', 'READ_HISTORY', 'DELETE_HISTORY'],
    // Tenant (11)
    11: ['ALL', 'READ', 'UPDATE', 'CREATE', 'DELETE'],
    // Tenant Membership (12)
    12: ['ALL', 'CREATE', 'DELETE'],
    // Batch (13)
    13: [
        'ALL',
        'READ',
        'UPDATE',
        'CREATE',
        'DELETE',
        'READ_HISTORY',
        'DELETE_HISTORY',
        'CREATE_BATCH_MIGRATE_PROCESS_INSTANCES',
        'CREATE_BATCH_MODIFY_PROCESS_INSTANCES',
        'CREATE_BATCH_RESTART_PROCESS_INSTANCES',
        'CREATE_BATCH_DELETE_RUNNING_PROCESS_INSTANCES',
        'CREATE_BATCH_DELETE_FINISHED_PROCESS_INSTANCES',
        'CREATE_BATCH_DELETE_DECISION_INSTANCES',
        'CREATE_BATCH_SET_JOB_RETRIES',
        'CREATE_BATCH_SET_REMOVAL_TIME',
        'CREATE_BATCH_SET_EXTERNAL_TASK_RETRIES',
        'CREATE_BATCH_UPDATE_PROCESS_INSTANCES_SUSPEND',
        'CREATE_BATCH_SET_VARIABLES',
    ],
    // Decision Requirements Definition (14)
    14: ['ALL', 'READ'],
    // Report (15)
    15: ['ALL', 'READ', 'UPDATE', 'CREATE', 'DELETE'],
    // Dashboard (16)
    16: ['ALL', 'READ', 'UPDATE', 'CREATE', 'DELETE'],
    // User Operation Log Category (17)
    17: ['ALL', 'READ', 'DELETE', 'UPDATE'],
    // Historic Task (19)
    19: ['ALL', 'READ', 'READ_VARIABLE'],
    // Historic Process Instance (20)
    20: ['ALL', 'READ'],
    // System (21)
    21: ['ALL', 'READ', 'SET', 'DELETE'],
};
/** Default permissions for resources not in the mapping */
var DEFAULT_PERMISSIONS = ['ALL', 'READ', 'UPDATE', 'CREATE', 'DELETE'];
// =============================================================================
// Cross-App Navigation
// =============================================================================
/**
 * Derive the cockpit app URL from the admin API URL.
 * Converts /operaton/api/admin to /operaton/app/cockpit/{engine}/
 * @param adminApiUrl - The admin API URL (e.g., /operaton/api/admin)
 * @param engineName - The engine name (e.g., 'default')
 * @returns Cockpit app base URL or null if conversion fails
 */
function deriveCockpitAppUrl(adminApiUrl, engineName) {
    var _a;
    if (!adminApiUrl || !engineName) {
        return null;
    }
    try {
        // Remove hash and query if present
        var cleanUrl = (_a = adminApiUrl.split('#')[0]) === null || _a === void 0 ? void 0 : _a.split('?')[0];
        if (!cleanUrl) {
            return null;
        }
        // Convert /api/admin to /app/cockpit/{engine}/
        if (cleanUrl.includes('/api/admin')) {
            var cockpitUrl = cleanUrl.replace('/api/admin', "/app/cockpit/".concat(engineName));
            return cockpitUrl.endsWith('/') ? cockpitUrl : "".concat(cockpitUrl, "/");
        }
        return null;
    }
    catch (_b) {
        return null;
    }
}
/**
 * Derive the tasklist app URL from the admin API URL.
 * Converts /operaton/api/admin to /operaton/app/tasklist/{engine}/
 * @param adminApiUrl - The admin API URL (e.g., /operaton/api/admin)
 * @param engineName - The engine name (e.g., 'default')
 * @returns Tasklist app base URL or null if conversion fails
 */
function deriveTasklistAppUrl(adminApiUrl, engineName) {
    var _a;
    if (!adminApiUrl || !engineName) {
        return null;
    }
    try {
        // Remove hash and query if present
        var cleanUrl = (_a = adminApiUrl.split('#')[0]) === null || _a === void 0 ? void 0 : _a.split('?')[0];
        if (!cleanUrl) {
            return null;
        }
        // Convert /api/admin to /app/tasklist/{engine}/
        if (cleanUrl.includes('/api/admin')) {
            var tasklistUrl = cleanUrl.replace('/api/admin', "/app/tasklist/".concat(engineName));
            return tasklistUrl.endsWith('/') ? tasklistUrl : "".concat(tasklistUrl, "/");
        }
        return null;
    }
    catch (_b) {
        return null;
    }
}
/**
 * Determine which app a resource type belongs to.
 * @param resourceType - The resource type ID
 * @returns 'cockpit', 'tasklist', or 'admin'
 */
function getResourceApp(resourceType) {
    if (resourceType === null) {
        return 'admin';
    }
    // Task resources belong to tasklist
    if (resourceType === 7) {
        return 'tasklist';
    }
    // Resource types that have views in cockpit
    var cockpitResources = [
        6, // Process Definition
        8, // Process Instance
        9, // Deployment
        10, // Decision Definition
        13, // Batch
        14, // Decision Requirements Definition
        20, // Historic Process Instance
    ];
    return cockpitResources.includes(resourceType) ? 'cockpit' : 'admin';
}
// =============================================================================
// Process Definition Key Resolution
// =============================================================================
/**
 * UUID pattern for detecting definition IDs.
 * Matches UUID v1, v4, and other standard formats (8-4-4-4-12 hex digits).
 */
var UUID_PATTERN = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
/**
 * Check if a resource ID contains a UUID, indicating it's a definition ID.
 * @param resourceId - The resource ID to check
 * @returns True if it contains a UUID
 */
function containsUUID(resourceId) {
    if (!resourceId || resourceId === '*' || resourceId === '') {
        return false;
    }
    return UUID_PATTERN.test(resourceId);
}
/**
 * Check if a resource ID is a process definition key (not a full ID).
 * Process definition IDs typically have format: key:version:deploymentId
 * Keys don't contain colons or UUIDs.
 * @param resourceId - The resource ID to check
 * @returns True if it looks like a key
 */
function isProcessDefinitionKey(resourceId) {
    if (!resourceId || resourceId === '*' || resourceId === '') {
        return false;
    }
    // If it contains a UUID, it's a definition ID
    if (containsUUID(resourceId)) {
        return false;
    }
    // IDs contain colons (e.g., "my-process:1:abc123"), keys don't
    return !resourceId.includes(':');
}
/** Cache for resolved process definition keys -> IDs */
var processDefinitionKeyCache = new Map();
/**
 * Clear the process definition key cache.
 * Call this when navigating away or refreshing data.
 */
function clearProcessDefinitionKeyCache() {
    processDefinitionKeyCache.clear();
}
// =============================================================================
// Helper Functions
// =============================================================================
/**
 * Get permissions for a resource type.
 * @param resourceType - The resource type ID
 * @returns Array of permission strings
 */
function getPermissionsForResource(resourceType) {
    var _a;
    if (resourceType === null) {
        return DEFAULT_PERMISSIONS;
    }
    return (_a = PERMISSIONS_BY_RESOURCE[resourceType]) !== null && _a !== void 0 ? _a : DEFAULT_PERMISSIONS;
}
/**
 * Get resource type name from ID.
 * @param resourceType - The resource type ID
 * @returns Resource type name or placeholder
 */
function getResourceTypeName(resourceType) {
    var _a;
    if (resourceType === null) {
        return '-';
    }
    var found = RESOURCE_TYPES.find(function (rt) { return rt.id === resourceType; });
    return (_a = found === null || found === void 0 ? void 0 : found.name) !== null && _a !== void 0 ? _a : "Type ".concat(resourceType);
}
/**
 * Get authorization type display label.
 * @param type - The authorization type ID
 * @returns Authorization type label
 */
function getAuthTypeLabel(type) {
    var _a;
    if (type === null) {
        return '-';
    }
    var found = AUTH_TYPES.find(function (t) { return t.id === type; });
    return (_a = found === null || found === void 0 ? void 0 : found.label) !== null && _a !== void 0 ? _a : "Type ".concat(type);
}
/**
 * Render identity display element for user/group.
 * Links user IDs to /users/[userid] and group IDs to /groups/[groupId].
 * @param userId - The user ID or null
 * @param groupId - The group ID or null
 * @returns JSX element displaying the identity with link
 */
function renderIdentityDisplay(userId, groupId) {
    if (userId) {
        return React.createElement('span', { title: 'User' }, React.createElement(FaUser, { 'aria-label': 'User icon' }), ' ', React.createElement('a', { href: "#/users/".concat(encodeURIComponent(userId)) }, userId));
    }
    if (groupId) {
        return React.createElement('span', { title: 'Group' }, React.createElement(FaTh, { 'aria-label': 'Group icon' }), ' ', React.createElement('a', { href: "#/groups/".concat(encodeURIComponent(groupId)) }, groupId));
    }
    return React.createElement('span', null, '-');
}
/**
 * Generate URL for a resource based on its type and ID.
 * Supports cross-app navigation when cockpitBaseUrl is provided.
 * @param resourceType - The resource type ID
 * @param resourceId - The resource ID (original, for display purposes)
 * @param options - Optional URL generation options
 * @returns Full URL or hash-only URL, or null if no link available
 */
function getResourceUrl(resourceType, resourceId, options) {
    var _a;
    // Wildcard resources don't link anywhere
    if (!resourceId || resourceId === '*') {
        return null;
    }
    if (resourceType === null) {
        return null;
    }
    // Use resolved ID if available, otherwise use original
    var idForLink = (_a = options === null || options === void 0 ? void 0 : options.resolvedId) !== null && _a !== void 0 ? _a : resourceId;
    var encodedId = encodeURIComponent(idForLink);
    // Determine which app the resource belongs to and get the appropriate base URL
    var app = getResourceApp(resourceType);
    var baseUrl = '';
    if (app === 'cockpit' && (options === null || options === void 0 ? void 0 : options.cockpitBaseUrl)) {
        baseUrl = options.cockpitBaseUrl;
    }
    else if (app === 'tasklist' && (options === null || options === void 0 ? void 0 : options.tasklistBaseUrl)) {
        baseUrl = options.tasklistBaseUrl;
    }
    // Map resource types to their URLs
    switch (resourceType) {
        case 0: // Application - no specific link
            return null;
        case 1: // User
            return "#/users/".concat(encodedId);
        case 2: // Group
            return "#/groups/".concat(encodedId);
        case 3: // Group Membership - no specific link
            return null;
        case 4: // Authorization - link to authorization page filtered by ID
            return "#/authorization/?resource=4&authorizationId=".concat(encodedId);
        case 5: // Filter - no direct link in admin cockpit
            return null;
        case 6: // Process Definition
            // If it's a key (no UUID, no colons), link to processes dashboard with filter
            if (isProcessDefinitionKey(idForLink)) {
                var filterQuery = encodeURIComponent(JSON.stringify([{ type: 'key', operator: 'eq', value: idForLink }]));
                return "".concat(baseUrl, "#/processes?pdSearchQuery=").concat(filterQuery);
            }
            // Otherwise it's a definition ID, link directly
            return "".concat(baseUrl, "#/process-definition/").concat(encodedId);
        case 7: // Task - link to tasklist
            return baseUrl ? "".concat(baseUrl, "#/?task=").concat(encodedId) : null;
        case 8: // Process Instance
            return "".concat(baseUrl, "#/process-instance/").concat(encodedId);
        case 9: // Deployment
            return "".concat(baseUrl, "#/repository?page=1&deploymentsQuery=%5B%5D&deployment=").concat(encodedId);
        case 10: // Decision Definition
            return "".concat(baseUrl, "#/decision-definition/").concat(encodedId);
        case 11: // Tenant
            return "#/tenants/".concat(encodedId);
        case 12: // Tenant Membership - no specific link
            return null;
        case 13: // Batch
            return "".concat(baseUrl, "#/batch/").concat(encodedId);
        case 14: // Decision Requirements Definition
            return "".concat(baseUrl, "#/decision-definition/").concat(encodedId);
        case 17: // Operation Log - no specific link
            return null;
        case 19: // Historic Task Instance - no specific link in standard cockpit
            return null;
        case 20: // Historic Process Instance
            return "".concat(baseUrl, "#/history/process-instance/").concat(encodedId);
        case 21: // System - no specific link
            return null;
        default:
            return null;
    }
}
/**
 * Get the API endpoint to check if a resource exists.
 * Returns null if the resource type cannot be validated via API.
 * For process definitions, handles both keys and full IDs.
 * @param resourceType - The resource type ID
 * @param resourceId - The resource ID (may be a key for process definitions)
 * @returns API endpoint path or null
 */
function getResourceValidationEndpoint(resourceType, resourceId) {
    // Wildcard resources cannot be validated
    if (!resourceId || resourceId === '*') {
        return null;
    }
    if (resourceType === null) {
        return null;
    }
    var encodedId = encodeURIComponent(resourceId);
    // Map resource types to their validation API endpoints
    switch (resourceType) {
        case 1: // User
            return "/user/".concat(encodedId, "/profile");
        case 2: // Group
            return "/group/".concat(encodedId);
        case 4: // Authorization
            return "/authorization/".concat(encodedId);
        case 5: // Filter
            return "/filter/".concat(encodedId);
        case 6: // Process Definition - handle both key and ID
            // If it's a key (no colons), use the key endpoint
            if (isProcessDefinitionKey(resourceId)) {
                return "/process-definition/key/".concat(encodedId);
            }
            return "/process-definition/".concat(encodedId);
        case 8: // Process Instance
            return "/process-instance/".concat(encodedId);
        case 9: // Deployment
            return "/deployment/".concat(encodedId);
        case 10: // Decision Definition
            return "/decision-definition/".concat(encodedId);
        case 11: // Tenant
            return "/tenant/".concat(encodedId);
        case 13: // Batch
            return "/batch/".concat(encodedId);
        case 14: // Decision Requirements Definition
            return "/decision-requirements-definition/".concat(encodedId);
        case 20: // Historic Process Instance
            return "/history/process-instance/".concat(encodedId);
        // Resource types that cannot be validated:
        // 0: Application, 3: Group Membership, 7: Task, 12: Tenant Membership,
        // 17: Operation Log, 19: Historic Task Instance, 21: System
        default:
            return null;
    }
}
/** Resource type id for Process Definition, whose keys resolve to a latest version id */
var RESOURCE_TYPE_PROCESS_DEFINITION$1 = 6;
/**
 * Build the key under which a resource's validation result is stored.
 *
 * A resource id is only unique within its resource type - the same id can name both a
 * process definition and a decision definition - so both parts belong in the key.
 * Keying on the id alone made two such authorizations share one validation result.
 * @param resourceType - The resource type ID
 * @param resourceId - The resource ID
 * @returns Key combining the resource type and id
 */
function resourceValidationKey(resourceType, resourceId) {
    return "".concat(resourceType !== null && resourceType !== void 0 ? resourceType : 'null', ":").concat(resourceId);
}
/**
 * Render resource ID display element with optional link and validation status.
 * Links resource IDs to their corresponding Cockpit pages when applicable.
 * Colors missing resources red when validation indicates they don't exist.
 * Supports cross-app navigation and resolved IDs for process definition keys.
 * @param resourceType - The resource type ID
 * @param resourceId - The resource ID (original, displayed to user)
 * @param isValidationStatus - Optional validation status ('valid', 'invalid', 'unknown')
 * @param urlOptions - Optional URL generation options (cockpitBaseUrl, resolvedId)
 * @returns JSX element displaying the resource ID with optional link and validation styling
 */
function renderResourceIdDisplay(resourceType, resourceId, isValidationStatus, urlOptions) {
    var displayId = resourceId !== null && resourceId !== void 0 ? resourceId : '-';
    var url = getResourceUrl(resourceType, resourceId, urlOptions);
    // Build style based on validation status
    var style = {};
    var title;
    if (isValidationStatus === 'invalid') {
        style.color = '#d9534f'; // Bootstrap danger color
        style.fontWeight = 'bold';
        title = 'Resource not found';
    }
    else if (isValidationStatus === 'valid') {
        title = 'Resource exists';
    }
    if (url) {
        return React.createElement('a', { href: url, style: style, title: title }, displayId);
    }
    return React.createElement('span', { style: style, title: title }, displayId);
}

/**
 * Authorization Delete Confirm Modal Component
 *
 * Modal dialog for confirming deletion of an authorization record.
 * Displays authorization details for user confirmation.
 */
/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- Modal backdrop with programmatic dismiss */
/**
 * Confirmation modal for deleting an authorization.
 */
var AuthorizationDeleteModal = function (_a) {
    var _b, _c, _d;
    var authorization = _a.authorization, onConfirm = _a.onConfirm, onCancel = _a.onCancel, isDeleting = _a.isDeleting;
    /**
     * Handle Esc key to close modal
     */
    reactExports.useEffect(function () {
        var handleEscape = function (e) {
            if (e.key === 'Escape' && !isDeleting) {
                onCancel();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return function () {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onCancel, isDeleting]);
    return (React.createElement("div", { className: "modal-backdrop", onClick: onCancel },
        React.createElement("div", { className: "modal-dialog", onClick: function (e) {
                e.stopPropagation();
            } },
            React.createElement("div", { className: "modal-content" },
                React.createElement("div", { className: "modal-header" },
                    React.createElement("h4", { className: "modal-title" }, "Delete Authorization"),
                    React.createElement("button", { type: "button", className: "close", onClick: onCancel, "aria-label": "Close" },
                        React.createElement("span", { "aria-hidden": "true" }, "\u00D7"))),
                React.createElement("div", { className: "modal-body" },
                    React.createElement("p", null, "Are you sure you want to delete this authorization?"),
                    React.createElement("dl", { className: "dl-horizontal" },
                        React.createElement("dt", null, "Type:"),
                        React.createElement("dd", null, getAuthTypeLabel(authorization.type)),
                        React.createElement("dt", null, "Identity:"),
                        React.createElement("dd", null, renderIdentityDisplay(authorization.userId, authorization.groupId)),
                        React.createElement("dt", null, "Resource:"),
                        React.createElement("dd", null, getResourceTypeName(authorization.resourceType)),
                        React.createElement("dt", null, "Resource ID:"),
                        React.createElement("dd", null, (_b = authorization.resourceId) !== null && _b !== void 0 ? _b : '*'),
                        React.createElement("dt", null, "Permissions:"),
                        React.createElement("dd", null, (_d = (_c = authorization.permissions) === null || _c === void 0 ? void 0 : _c.join(', ')) !== null && _d !== void 0 ? _d : '-'))),
                React.createElement("div", { className: "modal-footer" },
                    React.createElement("button", { type: "button", className: "btn btn-default", onClick: onCancel, disabled: isDeleting }, "Cancel"),
                    React.createElement("button", { type: "button", className: "btn btn-danger", onClick: onConfirm, disabled: isDeleting }, isDeleting ? 'Deleting...' : 'Delete'))))));
};

/**
 * Simple error message component for consistent error display.
 * Uses role="alert" with aria-live="assertive" for immediate screen reader announcement.
 */
var ErrorMessage = function (_a) {
    var message = _a.message, _b = _a.className, className = _b === void 0 ? 'alert alert-danger' : _b;
    return (React.createElement("div", { className: className, role: "alert", "aria-live": "assertive" }, message));
};

// THIS FILE IS AUTO GENERATED
function TbRefresh (props) {
  return GenIcon({"attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"},"child":[]},{"tag":"path","attr":{"d":"M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"},"child":[]}]})(props);
}

___$insertStylesToHeader("@keyframes plugin-spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n.plugin-spin {\n  animation: plugin-spin 1s linear infinite;\n  display: inline-block;\n}");

/**
 * Identity Autocomplete Component
 *
 * Provides autocomplete for user IDs and group IDs from the Operaton/Camunda API.
 * Also allows typing non-existing IDs including wildcard "*".
 */
/** Debounce delay in milliseconds */
var DEBOUNCE_DELAY$1 = 300;
/** Maximum suggestions to show */
var MAX_SUGGESTIONS$1 = 10;
/**
 * Identity autocomplete input with API-based suggestions.
 * Fetches user or group IDs from the REST API while allowing manual entry.
 *
 * @example
 * ```tsx
 * <IdentityAutocomplete
 *   api={api}
 *   identityType="user"
 *   value={userId}
 *   onChange={setUserId}
 *   placeholder="Enter user ID or select from suggestions"
 * />
 * ```
 */
// eslint-disable-next-line max-lines-per-function -- Autocomplete with debouncing, API integration, and keyboard navigation
var IdentityAutocomplete = function (_a) {
    var api = _a.api, identityType = _a.identityType, value = _a.value, onChange = _a.onChange, placeholder = _a.placeholder, _b = _a.required, required = _b === void 0 ? false : _b;
    var _c = reactExports.useState([]), suggestions = _c[0], setSuggestions = _c[1];
    var _d = reactExports.useState(false), showSuggestions = _d[0], setShowSuggestions = _d[1];
    var _e = reactExports.useState(false), isLoading = _e[0], setIsLoading = _e[1];
    var _f = reactExports.useState(-1), selectedIndex = _f[0], setSelectedIndex = _f[1];
    var inputRef = reactExports.useRef(null);
    var suggestionsRef = reactExports.useRef(null);
    var debounceTimerRef = reactExports.useRef(null);
    /**
     * Fetch suggestions from API
     */
    var fetchSuggestions = reactExports.useCallback(function (query) { return __awaiter(void 0, void 0, void 0, function () {
        var params, searches, results, userMap, _i, results_1, userList, _a, userList_1, user, uniqueUsers, formatted, params, result, formatted, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!query || query === '*') {
                        setSuggestions([]);
                        return [2 /*return*/];
                    }
                    setIsLoading(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 8]);
                    if (!(identityType === 'user')) return [3 /*break*/, 3];
                    params = { maxResults: String(MAX_SUGGESTIONS$1) };
                    searches = [
                        get(api, '/user', __assign(__assign({}, params), { firstNameLike: "%".concat(query, "%") })),
                        get(api, '/user', __assign(__assign({}, params), { lastNameLike: "%".concat(query, "%") })),
                        get(api, '/user', __assign(__assign({}, params), { emailLike: "%".concat(query, "%") })),
                    ];
                    return [4 /*yield*/, Promise.all(searches.map(function (search) { return __awaiter(void 0, void 0, void 0, function () {
                            var err_2;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _b.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, search];
                                    case 1: return [2 /*return*/, (_a = (_b.sent())) !== null && _a !== void 0 ? _a : []];
                                    case 2:
                                        err_2 = _b.sent();
                                        console.warn('User search request failed:', err_2);
                                        return [2 /*return*/, []];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 2:
                    results = _b.sent();
                    userMap = new Map();
                    for (_i = 0, results_1 = results; _i < results_1.length; _i++) {
                        userList = results_1[_i];
                        for (_a = 0, userList_1 = userList; _a < userList_1.length; _a++) {
                            user = userList_1[_a];
                            if (user.id && !userMap.has(user.id)) {
                                userMap.set(user.id, user);
                            }
                        }
                    }
                    uniqueUsers = Array.from(userMap.values());
                    if (uniqueUsers.length > 0) {
                        formatted = uniqueUsers.map(function (user) {
                            var _a, _b;
                            var parts = [];
                            if (user.firstName || user.lastName) {
                                parts.push("".concat((_a = user.firstName) !== null && _a !== void 0 ? _a : '', " ").concat((_b = user.lastName) !== null && _b !== void 0 ? _b : '').trim());
                            }
                            if (user.email) {
                                parts.push("<".concat(user.email, ">"));
                            }
                            return {
                                id: user.id,
                                label: parts.length > 0 ? "".concat(user.id, " (").concat(parts.join(' '), ")") : user.id,
                            };
                        });
                        setSuggestions(formatted.slice(0, MAX_SUGGESTIONS$1));
                    }
                    else {
                        setSuggestions([]);
                    }
                    return [3 /*break*/, 5];
                case 3:
                    params = {
                        maxResults: String(MAX_SUGGESTIONS$1),
                        nameLike: "%".concat(query, "%"),
                    };
                    return [4 /*yield*/, get(api, '/group', params)];
                case 4:
                    result = (_b.sent());
                    if (result && result.length > 0) {
                        formatted = result.map(function (group) { return ({
                            id: group.id,
                            label: group.name ? "".concat(group.id, " (").concat(group.name, ")") : group.id,
                        }); });
                        setSuggestions(formatted);
                    }
                    else {
                        setSuggestions([]);
                    }
                    _b.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    err_1 = _b.sent();
                    if (err_1 instanceof ApiError) {
                        console.error("Error fetching ".concat(identityType, "s:"), err_1.message);
                    }
                    setSuggestions([]);
                    return [3 /*break*/, 8];
                case 7:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); }, [api, identityType]);
    /**
     * Handle input change with debouncing
     */
    var handleInputChange = function (e) {
        var newValue = e.target.value;
        onChange(newValue);
        // Clear existing debounce timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        // Set new debounce timer
        debounceTimerRef.current = setTimeout(function () {
            if (newValue.length > 0) {
                void fetchSuggestions(newValue);
                setShowSuggestions(true);
            }
            else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, DEBOUNCE_DELAY$1);
    };
    /**
     * Handle suggestion selection
     */
    var handleSelectSuggestion = function (id) {
        onChange(id);
        setShowSuggestions(false);
        setSuggestions([]);
        setSelectedIndex(-1);
    };
    /**
     * Handle keyboard navigation
     */
    var handleKeyDown = function (e) {
        if (!showSuggestions || suggestions.length === 0) {
            return;
        }
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(function (prev) { return (prev < suggestions.length - 1 ? prev + 1 : prev); });
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(function (prev) { return (prev > 0 ? prev - 1 : -1); });
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
                    var selected = suggestions[selectedIndex];
                    if (selected) {
                        handleSelectSuggestion(selected.id);
                    }
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                setSelectedIndex(-1);
                break;
        }
    };
    /**
     * Handle click outside to close suggestions
     */
    reactExports.useEffect(function () {
        var handleClickOutside = function (event) {
            if (inputRef.current &&
                !inputRef.current.contains(event.target) &&
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target)) {
                setShowSuggestions(false);
                setSelectedIndex(-1);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return function () {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    /**
     * Cleanup debounce timer on unmount
     */
    reactExports.useEffect(function () {
        return function () {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);
    var inputId = "identity-autocomplete-".concat(identityType);
    return (React.createElement("div", { style: { position: 'relative' } },
        React.createElement("input", { ref: inputRef, id: inputId, type: "text", className: "form-control", value: value, onChange: handleInputChange, onKeyDown: handleKeyDown, onFocus: function () {
                if (suggestions.length > 0) {
                    setShowSuggestions(true);
                }
            }, placeholder: placeholder, required: required, "aria-autocomplete": "list", "aria-controls": "".concat(inputId, "-suggestions"), "aria-expanded": showSuggestions }),
        showSuggestions && suggestions.length > 0 && (React.createElement("div", { ref: suggestionsRef, id: "".concat(inputId, "-suggestions"), className: "identity-autocomplete-suggestions", role: "listbox" }, suggestions.map(function (suggestion, index) { return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- Keyboard navigation handled by parent input
        React.createElement("div", { key: suggestion.id, className: "suggestion-item ".concat(index === selectedIndex ? 'selected' : ''), role: "option", "aria-selected": index === selectedIndex, onClick: function () {
                handleSelectSuggestion(suggestion.id);
            }, onMouseEnter: function () {
                setSelectedIndex(index);
            } }, suggestion.label)); }))),
        isLoading && (React.createElement("div", { style: {
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
            } },
            React.createElement(TbRefresh, { className: "plugin-spin", "aria-label": "Loading" })))));
};

/**
 * UI and timing constants used across the application.
 * Centralizes magic numbers for easier maintenance and configuration.
 */
// =============================================================================
// UI Constants
// =============================================================================
/** Modal overlay z-index to ensure modals appear above other content */
/** Width of admin panel in pixels */
var ADMIN_PANEL_WIDTH_PX = 220;
// =============================================================================
// Pagination Constants
// =============================================================================
/** Default page size for paginated lists */
var DEFAULT_PAGE_SIZE = 50;
// =============================================================================
// Resource Type Constants (for authorization management)
// =============================================================================
/** Resource type ID for Process Definition */
var RESOURCE_TYPE_PROCESS_DEFINITION = 6;
/** Resource type ID for Task */
var RESOURCE_TYPE_TASK = 7;
/** Resource type ID for Deployment */
var RESOURCE_TYPE_DEPLOYMENT = 9;
/** Resource type ID for Decision Definition */
var RESOURCE_TYPE_DECISION_DEFINITION = 10;
/** Resource type ID for Tenant */
var RESOURCE_TYPE_TENANT = 14;

/**
 * Resource Autocomplete Component
 *
 * Provides autocomplete for resource IDs based on the resource type.
 * Fetches appropriate resources from the Operaton/Camunda API.
 * Also allows typing "*" for all resources.
 */
/** Debounce delay in milliseconds */
var DEBOUNCE_DELAY = 300;
/** Maximum suggestions to show */
var MAX_SUGGESTIONS = 10;
/**
 * Get the appropriate API endpoint and parameters for a resource type.
 * @param resourceType - The resource type ID
 * @returns Endpoint information or null if no autocomplete available
 */
function getResourceEndpoint(resourceType) {
    switch (resourceType) {
        case 0: // Application
            return {
                endpoint: '',
                idField: '',
                searchParam: '',
                enumValues: ['cockpit', 'tasklist', 'admin', '*'],
            };
        case 1: // User
            return { endpoint: '/user', idField: 'id', nameField: 'firstName', searchParam: 'idLike' };
        case 2: // Group
            return { endpoint: '/group', idField: 'id', nameField: 'name', searchParam: 'idLike' };
        case RESOURCE_TYPE_PROCESS_DEFINITION:
            return { endpoint: '/process-definition', idField: 'key', nameField: 'name', searchParam: 'keyLike' };
        case RESOURCE_TYPE_TASK:
            return { endpoint: '/task', idField: 'id', nameField: 'name', searchParam: 'taskDefinitionKey' };
        case RESOURCE_TYPE_DEPLOYMENT:
            return { endpoint: '/deployment', idField: 'id', nameField: 'name', searchParam: 'nameLike' };
        case RESOURCE_TYPE_DECISION_DEFINITION:
            return { endpoint: '/decision-definition', idField: 'key', nameField: 'name', searchParam: 'keyLike' };
        case RESOURCE_TYPE_TENANT:
            return {
                endpoint: '/decision-requirements-definition',
                idField: 'key',
                nameField: 'name',
                searchParam: 'keyLike',
            };
        default:
            return null; // No autocomplete for this resource type
    }
}
/**
 * Resource autocomplete input with API-based suggestions.
 * Fetches resource IDs from the REST API based on resource type.
 * Falls back to plain text input if resource type doesn't support autocomplete.
 *
 * @example
 * ```tsx
 * <ResourceAutocomplete
 *   api={api}
 *   resourceType={6} // Process Definition
 *   value={resourceId}
 *   onChange={setResourceId}
 *   placeholder="Enter resource ID or *"
 * />
 * ```
 */
// eslint-disable-next-line max-lines-per-function -- Autocomplete with debouncing, API integration, and keyboard navigation
var ResourceAutocomplete = function (_a) {
    var api = _a.api, resourceType = _a.resourceType, value = _a.value, onChange = _a.onChange, placeholder = _a.placeholder;
    var _b = reactExports.useState([]), suggestions = _b[0], setSuggestions = _b[1];
    var _c = reactExports.useState(false), showSuggestions = _c[0], setShowSuggestions = _c[1];
    var _d = reactExports.useState(false), isLoading = _d[0], setIsLoading = _d[1];
    var _e = reactExports.useState(-1), selectedIndex = _e[0], setSelectedIndex = _e[1];
    var inputRef = reactExports.useRef(null);
    var suggestionsRef = reactExports.useRef(null);
    var debounceTimerRef = reactExports.useRef(null);
    var endpointConfig = getResourceEndpoint(resourceType);
    var hasAutocomplete = endpointConfig !== null;
    /**
     * Fetch suggestions from API or enum values
     */
    var fetchSuggestions = reactExports.useCallback(function (query) { return __awaiter(void 0, void 0, void 0, function () {
        var filtered, params, result, formatted, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!hasAutocomplete || !query) {
                        setSuggestions([]);
                        return [2 /*return*/];
                    }
                    // Type guard: hasAutocomplete ensures endpointConfig is non-null
                    // Handle enum values (e.g., Application resource type)
                    if (endpointConfig.enumValues) {
                        filtered = endpointConfig.enumValues
                            .filter(function (val) { return val.toLowerCase().includes(query.toLowerCase()); })
                            .map(function (val) { return ({ id: val, label: val }); });
                        setSuggestions(filtered);
                        return [2 /*return*/];
                    }
                    if (query === '*') {
                        setSuggestions([]);
                        return [2 /*return*/];
                    }
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    params = {
                        maxResults: String(MAX_SUGGESTIONS),
                    };
                    // Add search parameter
                    if (endpointConfig.searchParam.endsWith('Like')) {
                        params[endpointConfig.searchParam] = "%".concat(query, "%");
                    }
                    else {
                        params[endpointConfig.searchParam] = query;
                    }
                    return [4 /*yield*/, get(api, endpointConfig.endpoint, params)];
                case 2:
                    result = (_a.sent());
                    if (result && result.length > 0) {
                        formatted = result.map(function (item) {
                            var idValue = item[endpointConfig.idField];
                            var id = typeof idValue === 'string' ? idValue : '';
                            var nameValue = endpointConfig.nameField
                                ? item[endpointConfig.nameField]
                                : undefined;
                            var name = typeof nameValue === 'string' ? nameValue : undefined;
                            return {
                                id: id,
                                label: name ? "".concat(id, " (").concat(name, ")") : id,
                            };
                        });
                        setSuggestions(formatted);
                    }
                    else {
                        setSuggestions([]);
                    }
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    if (err_1 instanceof ApiError) {
                        console.error("Error fetching resources:", err_1.message);
                    }
                    setSuggestions([]);
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [api, endpointConfig, hasAutocomplete]);
    /**
     * Handle input change with debouncing
     */
    var handleInputChange = function (e) {
        var newValue = e.target.value;
        onChange(newValue);
        if (!hasAutocomplete) {
            return;
        }
        // Clear existing debounce timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        // Set new debounce timer
        debounceTimerRef.current = setTimeout(function () {
            if (newValue.length > 0) {
                void fetchSuggestions(newValue);
                setShowSuggestions(true);
            }
            else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, DEBOUNCE_DELAY);
    };
    /**
     * Handle suggestion selection
     */
    var handleSelectSuggestion = function (id) {
        onChange(id);
        setShowSuggestions(false);
        setSuggestions([]);
        setSelectedIndex(-1);
    };
    /**
     * Handle keyboard navigation
     */
    var handleKeyDown = function (e) {
        if (!showSuggestions || suggestions.length === 0) {
            return;
        }
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(function (prev) { return (prev < suggestions.length - 1 ? prev + 1 : prev); });
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(function (prev) { return (prev > 0 ? prev - 1 : -1); });
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
                    var selected = suggestions[selectedIndex];
                    if (selected) {
                        handleSelectSuggestion(selected.id);
                    }
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                setSelectedIndex(-1);
                break;
        }
    };
    /**
     * Handle click outside to close suggestions
     */
    reactExports.useEffect(function () {
        var handleClickOutside = function (event) {
            if (inputRef.current &&
                !inputRef.current.contains(event.target) &&
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target)) {
                setShowSuggestions(false);
                setSelectedIndex(-1);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return function () {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    /**
     * Cleanup debounce timer on unmount
     */
    reactExports.useEffect(function () {
        return function () {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);
    /**
     * Reset suggestions when resource type changes
     */
    reactExports.useEffect(function () {
        setSuggestions([]);
        setShowSuggestions(false);
        setSelectedIndex(-1);
    }, [resourceType]);
    var inputId = "resource-autocomplete-".concat(resourceType);
    return (React.createElement("div", { style: { position: 'relative' } },
        React.createElement("input", { ref: inputRef, id: inputId, type: "text", className: "form-control", value: value, onChange: handleInputChange, onKeyDown: handleKeyDown, onFocus: function () {
                if (suggestions.length > 0) {
                    setShowSuggestions(true);
                }
            }, placeholder: placeholder, "aria-autocomplete": hasAutocomplete ? 'list' : 'none', "aria-controls": hasAutocomplete ? "".concat(inputId, "-suggestions") : undefined, "aria-expanded": hasAutocomplete ? showSuggestions : undefined }),
        hasAutocomplete && showSuggestions && suggestions.length > 0 && (React.createElement("div", { ref: suggestionsRef, id: "".concat(inputId, "-suggestions"), className: "resource-autocomplete-suggestions", role: "listbox" }, suggestions.map(function (suggestion, index) { return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- Keyboard navigation handled by parent input
        React.createElement("div", { key: suggestion.id, className: "suggestion-item ".concat(index === selectedIndex ? 'selected' : ''), role: "option", "aria-selected": index === selectedIndex, onClick: function () {
                handleSelectSuggestion(suggestion.id);
            }, onMouseEnter: function () {
                setSelectedIndex(index);
            } }, suggestion.label)); }))),
        hasAutocomplete && isLoading && (React.createElement("div", { style: {
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
            } },
            React.createElement(TbRefresh, { className: "plugin-spin", "aria-label": "Loading" })))));
};

/** Warning box styling constants */
var WARNING_STYLES = {
    padding: '10px',
    backgroundColor: '#fff3cd',
    border: '1px solid #ffc107',
    borderRadius: '2px',
    marginBottom: '15px',
};
/**
 * Reusable warning box component for displaying cautionary messages.
 * Uses Bootstrap-like warning colors (yellow/amber).
 *
 * @example
 * ```tsx
 * <WarningBox>
 *   Process instance modification is a powerful operation that can lead to
 *   inconsistent process states. Use with extreme care.
 * </WarningBox>
 *
 * <WarningBox title="Danger Zone">
 *   This action cannot be undone.
 * </WarningBox>
 * ```
 */
var WarningBox = function (_a) {
    var children = _a.children, _b = _a.title, title = _b === void 0 ? 'Warning' : _b, className = _a.className;
    return (React.createElement("div", { role: "alert", "aria-live": "polite", style: WARNING_STYLES, className: className },
        React.createElement("strong", null,
            "\u26A0\uFE0F ",
            title,
            ":"),
        " ",
        children));
};

/**
 * Authorization Form Modal Component
 *
 * Modal dialog for creating and editing authorization records.
 * Includes type selection, identity input, resource ID, and permission checkboxes.
 */
/**
 * Get submit button label based on editing state.
 * @param isEditing - Whether the form is in edit mode
 * @returns Button label string
 */
function getSubmitButtonLabel(isEditing) {
    return isEditing ? 'Update' : 'Create';
}
/**
 * Modal form for creating/editing authorizations.
 */
var AuthorizationFormModal = function (_a) {
    var api$1 = _a.api, resourceType = _a.resourceType, authorization = _a.authorization, onSave = _a.onSave, onCancel = _a.onCancel;
    var isEditing = authorization !== null && authorization.id !== null;
    var availablePermissions = getPermissionsForResource(resourceType);
    var _b = reactExports.useState(function () {
        var _a, _b, _c, _d, _e;
        return ({
            type: (_a = authorization === null || authorization === void 0 ? void 0 : authorization.type) !== null && _a !== void 0 ? _a : 1,
            identityType: (authorization === null || authorization === void 0 ? void 0 : authorization.groupId) ? 'group' : 'user',
            identityId: (_c = (_b = authorization === null || authorization === void 0 ? void 0 : authorization.userId) !== null && _b !== void 0 ? _b : authorization === null || authorization === void 0 ? void 0 : authorization.groupId) !== null && _c !== void 0 ? _c : '',
            permissions: (_d = authorization === null || authorization === void 0 ? void 0 : authorization.permissions) !== null && _d !== void 0 ? _d : ['ALL'],
            resourceId: (_e = authorization === null || authorization === void 0 ? void 0 : authorization.resourceId) !== null && _e !== void 0 ? _e : '*',
        });
    }), form = _b[0], setForm = _b[1];
    var _c = reactExports.useState(false), isSaving = _c[0], setIsSaving = _c[1];
    var _d = reactExports.useState(null), error = _d[0], setError = _d[1];
    /**
     * Handle Esc key to close modal
     */
    reactExports.useEffect(function () {
        var handleEscape = function (e) {
            if (e.key === 'Escape') {
                onCancel();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return function () {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onCancel]);
    /**
     * Handle form submission
     */
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var payload, put, authId, err_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    e.preventDefault();
                    setError(null);
                    setIsSaving(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 7, 8, 9]);
                    payload = {
                        type: form.type,
                        permissions: form.permissions,
                        userId: form.identityType === 'user' ? form.identityId : null,
                        groupId: form.identityType === 'group' ? form.identityId : null,
                        resourceType: resourceType,
                        resourceId: form.resourceId || '*',
                    };
                    if (!isEditing) return [3 /*break*/, 4];
                    return [4 /*yield*/, Promise.resolve().then(function () { return api; })];
                case 2:
                    put = (_b.sent()).put;
                    authId = (_a = authorization.id) !== null && _a !== void 0 ? _a : '';
                    return [4 /*yield*/, put(api$1, "/authorization/".concat(authId), JSON.stringify(payload))];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 4: 
                // Create new authorization
                return [4 /*yield*/, post(api$1, '/authorization/create', {}, JSON.stringify(payload))];
                case 5:
                    // Create new authorization
                    _b.sent();
                    _b.label = 6;
                case 6:
                    onSave();
                    return [3 /*break*/, 9];
                case 7:
                    err_1 = _b.sent();
                    if (err_1 instanceof ApiError) {
                        setError(err_1.message);
                    }
                    else {
                        setError('Failed to save authorization');
                    }
                    console.error('Error saving authorization:', err_1);
                    return [3 /*break*/, 9];
                case 8:
                    setIsSaving(false);
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Get specific permissions (excluding ALL) for display
     */
    var getSpecificPermissions = function () {
        return availablePermissions.filter(function (p) { return p !== 'ALL'; });
    };
    /**
     * Check if all specific permissions are selected
     */
    var areAllPermissionsSelected = function () {
        var specific = getSpecificPermissions();
        return specific.every(function (p) { return form.permissions.includes(p); }) || form.permissions.includes('ALL');
    };
    /**
     * Toggle a permission
     */
    var togglePermission = function (perm) {
        setForm(function (prev) {
            var specific = getSpecificPermissions();
            var currentlySelected = prev.permissions.includes('ALL') ? specific : prev.permissions.filter(function (p) { return p !== 'ALL'; });
            var newPerms = currentlySelected.includes(perm)
                ? currentlySelected.filter(function (p) { return p !== perm; })
                : __spreadArray(__spreadArray([], currentlySelected, true), [perm], false);
            // If all specific permissions are now selected, save as ["ALL"]
            if (newPerms.length === specific.length && specific.length > 0) {
                return __assign(__assign({}, prev), { permissions: ['ALL'] });
            }
            // Otherwise save the specific permissions (can be empty)
            return __assign(__assign({}, prev), { permissions: newPerms });
        });
    };
    /**
     * Toggle all permissions
     */
    var toggleAllPermissions = function () {
        var allSelected = areAllPermissionsSelected();
        if (allSelected) {
            // Deselect all
            setForm(function (prev) { return (__assign(__assign({}, prev), { permissions: [] })); });
        }
        else {
            // Select all
            setForm(function (prev) { return (__assign(__assign({}, prev), { permissions: ['ALL'] })); });
        }
    };
    return (React.createElement("div", { className: "modal-backdrop", onClick: onCancel },
        React.createElement("div", { className: "modal-dialog", onClick: function (e) {
                e.stopPropagation();
            } },
            React.createElement("div", { className: "modal-content" },
                React.createElement("div", { className: "modal-header" },
                    React.createElement("h4", { className: "modal-title" }, isEditing ? 'Edit Authorization' : 'Create New Authorization'),
                    React.createElement("button", { type: "button", className: "close", onClick: onCancel, "aria-label": "Close" },
                        React.createElement("span", { "aria-hidden": "true" }, "\u00D7"))),
                React.createElement("form", { onSubmit: function (e) { return void handleSubmit(e); } },
                    React.createElement("div", { className: "modal-body" },
                        error && React.createElement(ErrorMessage, { message: error }),
                        React.createElement("div", { className: "form-group" },
                            React.createElement("label", null, "Authorization Type"),
                            React.createElement("div", { className: "btn-group btn-group-sm btn-group-flex" }, AUTH_TYPES.map(function (t) { return (React.createElement("button", { key: t.id, type: "button", className: "btn ".concat(form.type === t.id ? 'btn-primary' : 'btn-default'), onClick: function () {
                                    setForm(function (prev) { return (__assign(__assign({}, prev), { type: t.id })); });
                                }, disabled: isEditing },
                                t.name,
                                " (",
                                t.label,
                                ")")); }))),
                        React.createElement("div", { className: "form-group" },
                            React.createElement("label", null, "Identity Type"),
                            React.createElement("div", { className: "btn-group btn-group-sm btn-group-flex" },
                                React.createElement("button", { type: "button", className: "btn ".concat(form.identityType === 'user' ? 'btn-primary' : 'btn-default'), onClick: function () {
                                        setForm(function (prev) { return (__assign(__assign({}, prev), { identityType: 'user' })); });
                                    } },
                                    React.createElement(FaUser, { "aria-hidden": "true" }),
                                    " User"),
                                React.createElement("button", { type: "button", className: "btn ".concat(form.identityType === 'group' ? 'btn-primary' : 'btn-default'), onClick: function () {
                                        setForm(function (prev) { return (__assign(__assign({}, prev), { identityType: 'group' })); });
                                    } },
                                    React.createElement(FaTh, { "aria-hidden": "true" }),
                                    " Group"))),
                        React.createElement("div", { className: "form-group" },
                            React.createElement("label", null, form.identityType === 'user' ? 'User ID' : 'Group ID'),
                            React.createElement(IdentityAutocomplete, { api: api$1, identityType: form.identityType, value: form.identityId, onChange: function (id) {
                                    setForm(function (prev) { return (__assign(__assign({}, prev), { identityId: id })); });
                                }, placeholder: form.identityType === 'user' ? 'e.g., demo or *' : 'e.g., camunda-admin or *', required: true }),
                            React.createElement("small", { className: "text-muted" },
                                "Use * for all ",
                                form.identityType,
                                "s")),
                        React.createElement("div", { className: "form-group" },
                            React.createElement("label", null, "Resource ID"),
                            React.createElement(ResourceAutocomplete, { api: api$1, resourceType: resourceType, value: form.resourceId, onChange: function (id) {
                                    setForm(function (prev) { return (__assign(__assign({}, prev), { resourceId: id })); });
                                }, placeholder: "e.g., * for all resources" }),
                            React.createElement("small", { className: "text-muted" },
                                "Use * for all ",
                                getResourceTypeName(resourceType) || 'resources'),
                            (form.resourceId === '*' || form.resourceId === '') && (React.createElement(WarningBox, null,
                                "Resource ID * grants this permission on ALL ",
                                getResourceTypeName(resourceType) || 'resources',
                                "."))),
                        React.createElement("div", { className: "form-group" },
                            React.createElement("label", null,
                                "Permissions",
                                React.createElement("button", { type: "button", className: "btn btn-xs btn-link", onClick: toggleAllPermissions, style: { marginLeft: '10px' } }, areAllPermissionsSelected() ? 'Deselect All' : 'Select All')),
                            React.createElement("div", { className: "permissions-grid" }, getSpecificPermissions().map(function (perm) {
                                var isChecked = form.permissions.includes('ALL') || form.permissions.includes(perm);
                                return (React.createElement("div", { key: perm, className: "checkbox permission-item" },
                                    React.createElement("label", null,
                                        React.createElement("input", { type: "checkbox", checked: isChecked, onChange: function () {
                                                togglePermission(perm);
                                            } }),
                                        ' ',
                                        perm)));
                            })))),
                    React.createElement("div", { className: "modal-footer" },
                        React.createElement("button", { type: "button", className: "btn btn-default", onClick: onCancel }, "Cancel"),
                        React.createElement("button", { type: "submit", className: "btn btn-primary", disabled: isSaving || !form.identityId || form.permissions.length === 0 }, isSaving ? 'Saving...' : getSubmitButtonLabel(isEditing))))))));
};

/**
 * Type guard to check if props are legacy format.
 * @param props - The props to check
 * @returns True if props use the legacy format
 */
function isLegacyProps(props) {
    return 'processDefinitionId' in props;
}
/**
 * Converts legacy props to breadcrumb items array.
 * @param props - Legacy props with process definition/instance info
 * @returns Array of breadcrumb items
 */
function convertLegacyProps(props) {
    var _a;
    return [
        { label: 'Dashboard', href: '#/' },
        { label: 'Processes', href: '#/processes/' },
        {
            label: (_a = props.processDefinitionName) !== null && _a !== void 0 ? _a : props.processDefinitionId,
            href: "#/process-definition/".concat(props.processDefinitionId, "/runtime"),
        },
        {
            label: props.processInstanceId,
            suffix: 'History',
        },
    ];
}
/**
 * Breadcrumbs navigation panel component.
 *
 * Supports two usage patterns:
 *
 * 1. **Flexible items array** (recommended for new code):
 * ```tsx
 * <BreadcrumbsPanel items={[
 *   { label: 'Dashboard', href: '#/' },
 *   { label: 'Authorizations' },
 * ]} />
 * ```
 *
 * 2. **Legacy props** (for backwards compatibility with instance-route-history):
 * ```tsx
 * <BreadcrumbsPanel
 *   processDefinitionId="my-process:1"
 *   processDefinitionName="My Process"
 *   processInstanceId="instance-123"
 * />
 * ```
 */
var BreadcrumbsPanel = function (props) {
    // eslint-disable-next-line react/destructuring-assignment -- Type guard requires direct props access
    var items = isLegacyProps(props) ? convertLegacyProps(props) : props.items;
    return (React.createElement("div", { className: "breadcrumbs-panel", "cam-breadcrumbs-panel": "" },
        React.createElement("ul", { className: "cam-breadcrumb" }, items.map(function (item, index) {
            var isLast = index === items.length - 1;
            var hasHref = Boolean(item.href);
            var shouldRenderAsLink = hasHref && !isLast;
            return (
            // eslint-disable-next-line react/no-array-index-key -- Breadcrumb items are stable and have no unique ID
            React.createElement("li", { key: index, className: isLast ? 'active' : undefined },
                index > 0 && (React.createElement(React.Fragment, null,
                    React.createElement("span", { className: "divider" }, "\u00BB"),
                    '\u00A0')),
                shouldRenderAsLink ? (React.createElement("a", { className: "text", href: item.href }, item.label)) : (React.createElement("span", { className: "text" }, item.label)),
                index === 0 && '\u00A0',
                item.suffix && (React.createElement(React.Fragment, null,
                    '\u00A0',
                    React.createElement("span", { className: "divider" }, ":"),
                    '\u00A0',
                    item.suffix))));
        }))));
};

var Container = function (_a) {
    var children = _a.children;
    return (React.createElement("div", { className: "ctn-fixed-view", style: { position: 'absolute', top: '36px', bottom: 0, left: 0, right: 0 } },
        React.createElement("div", { className: "ctn-content-container" }, children)));
};

___$insertStylesToHeader("@charset \"UTF-8\";\n@keyframes token-fade-in {\n  0% {\n    opacity: 0;\n    transform: scale(0.9) translateY(-2px);\n  }\n  to {\n    opacity: 1;\n    transform: scale(1) translateY(0);\n  }\n}\n.token {\n  display: inline-flex;\n  align-items: center;\n  flex-shrink: 0;\n  padding: var(--filter-token-padding, 4px 8px);\n  border-radius: var(--filter-token-radius, 4px);\n  font-family: var(--filter-font-family, system-ui, -apple-system, sans-serif);\n  font-size: var(--filter-font-size, 14px);\n  font-weight: var(--filter-token-font-weight, 500);\n  line-height: 1.4;\n  white-space: nowrap;\n  cursor: default;\n  -webkit-user-select: none;\n  user-select: none;\n  transition: background-color 0.15s ease, border-color 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease, filter 0.15s ease;\n  animation: token-fade-in 0.2s ease-out;\n}\n\n.token--editable, .token--selectable {\n  cursor: pointer;\n}\n\n.token--editable:hover, .token--selectable:hover {\n  filter: brightness(0.95);\n  transform: scale(1.02);\n}\n\n.token--editable:active, .token--selectable:active {\n  transform: scale(0.98);\n}\n\n.token--field {\n  background-color: var(--filter-token-field-bg, #e3f2fd);\n  border: 1px solid var(--filter-token-field-border, #2196f3);\n  color: var(--filter-token-field-text, #1565c0);\n}\n\n.token--operator {\n  background-color: var(--filter-token-operator-bg, #fce4ec);\n  border: 1px solid var(--filter-token-operator-border, #e91e63);\n  color: var(--filter-token-operator-text, #c2185b);\n}\n\n.token--value {\n  background-color: var(--filter-token-value-bg, #e8f5e9);\n  border: 1px solid var(--filter-token-value-border, #4caf50);\n  color: var(--filter-token-value-text, #2e7d32);\n}\n\n.token--connector {\n  background-color: var(--filter-token-connector-bg, #fff3e0);\n  border: 1px solid var(--filter-token-connector-border, #ff9800);\n  color: var(--filter-token-connector-text, #e65100);\n}\n\n.token--selected {\n  box-shadow: 0 0 0 2px var(--filter-token-selected-ring, #1976d2);\n  outline: none;\n}\n\n.token:focus-visible {\n  box-shadow: 0 0 0 2px var(--filter-token-focus-ring, #1976d2);\n  outline: none;\n}\n\n.token--field:hover {\n  border-color: var(--filter-token-field-border-hover, #1976d2);\n}\n\n.token--operator:hover {\n  border-color: var(--filter-token-operator-border-hover, #c2185b);\n}\n\n.token--value:hover {\n  border-color: var(--filter-token-value-border-hover, #388e3c);\n}\n\n.token--connector:hover {\n  border-color: var(--filter-token-connector-border-hover, #ef6c00);\n}\n\n.token--editing {\n  padding: 0;\n  animation: none;\n}\n\n.token__edit-input {\n  font-family: var(--filter-font-family, system-ui, -apple-system, sans-serif);\n  font-size: var(--filter-font-size, 14px);\n  font-weight: var(--filter-token-font-weight, 500);\n  padding: var(--filter-token-padding, 4px 8px);\n  border: none;\n  background: transparent;\n  color: inherit;\n  outline: none;\n  width: auto;\n  min-width: 50px;\n}\n\n.token--deletable {\n  padding-right: 24px;\n  position: relative;\n}\n\n.token__delete-button {\n  position: absolute;\n  right: 2px;\n  top: 50%;\n  transform: translateY(-50%);\n  width: 18px;\n  height: 18px;\n  padding: 0;\n  border: none;\n  background: transparent;\n  color: inherit;\n  font-size: 16px;\n  font-weight: 700;\n  cursor: pointer;\n  border-radius: 3px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  opacity: 0;\n  transition: opacity 0.2s ease, background-color 0.15s ease;\n}\n\n.token--deletable:hover .token__delete-button, .token--selected .token__delete-button {\n  opacity: 0.6;\n}\n\n.token__delete-button:hover {\n  opacity: 1 !important;\n  background-color: rgba(0, 0, 0, 0.1490196078);\n}\n\n.token__delete-button:focus-visible {\n  outline: 2px solid currentColor;\n  outline-offset: 1px;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .token {\n    animation: none;\n    transition: none;\n  }\n  .token--editable:hover, .token--editable:active {\n    transform: none;\n  }\n}\n.token--error {\n  background-color: var(--filter-token-error-bg, #fef2f2);\n  border-color: var(--filter-token-error-border, #ef4444);\n  color: var(--filter-token-error-text, #dc2626);\n  position: relative;\n}\n\n.token--error:after {\n  content: \"⚠\";\n  position: absolute;\n  top: -6px;\n  right: -6px;\n  font-size: 10px;\n  line-height: 1;\n  background: var(--filter-token-error-indicator-bg, #ef4444);\n  color: var(--filter-token-error-indicator-text, #fff);\n  border-radius: 50%;\n  width: 14px;\n  height: 14px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.token--error:hover {\n  border-color: var(--filter-token-error-border-hover, #dc2626);\n}\n\n.token--error:focus-visible {\n  box-shadow: 0 0 0 2px var(--filter-token-error-ring, #f87171);\n}\n\n.token--error[data-error-message]:hover:before {\n  content: attr(data-error-message);\n  position: absolute;\n  bottom: calc(100% + 8px);\n  left: 50%;\n  transform: translate(-50%);\n  padding: 6px 10px;\n  background-color: var(--filter-tooltip-bg, #1f2937);\n  color: var(--filter-tooltip-text, #ffffff);\n  font-size: 12px;\n  font-weight: 400;\n  white-space: nowrap;\n  border-radius: 4px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1490196078);\n  z-index: 10000;\n  pointer-events: none;\n  animation: tooltip-fade-in 0.15s ease-out;\n}\n\n.token--error[data-error-message]:hover .token__error-tooltip-arrow, .token--error[data-error-message]:after + :before {\n  content: \"\";\n  position: absolute;\n  bottom: calc(100% + 4px);\n  left: 50%;\n  transform: translate(-50%);\n  border: 4px solid transparent;\n  border-top-color: var(--filter-tooltip-bg, #1f2937);\n}\n\n@keyframes tooltip-fade-in {\n  0% {\n    opacity: 0;\n    transform: translate(-50%) translateY(4px);\n  }\n  to {\n    opacity: 1;\n    transform: translate(-50%) translateY(0);\n  }\n}\n.token--pending {\n  opacity: var(--filter-token-pending-opacity, 0.7);\n  border-style: dashed;\n  animation: token-pending-pulse 1.5s ease-in-out infinite;\n}\n\n.token--pending.token--field {\n  background-color: var(--filter-token-field-pending-bg, rgba(227, 242, 253, 0.5019607843));\n}\n\n.token--pending.token--operator {\n  background-color: var(--filter-token-operator-pending-bg, rgba(252, 228, 236, 0.5019607843));\n}\n\n@keyframes token-pending-pulse {\n  0%, to {\n    opacity: var(--filter-token-pending-opacity, 0.7);\n  }\n  50% {\n    opacity: var(--filter-token-pending-opacity-pulse, 0.9);\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .token--pending {\n    animation: none;\n    opacity: var(--filter-token-pending-opacity, 0.7);\n  }\n}\n.token-input-wrapper {\n  position: relative;\n  display: inline-flex;\n  flex: 0 0 auto;\n  min-width: 50px;\n}\n\n.token-input-sizer {\n  position: absolute;\n  visibility: hidden;\n  white-space: pre;\n  font-family: var(--filter-font-family, system-ui, -apple-system, sans-serif);\n  font-size: var(--filter-font-size, 14px);\n  line-height: 1.4;\n  padding: var(--filter-token-padding, 4px 8px);\n}\n\n.token-input {\n  flex: 1 1 auto;\n  min-width: 50px;\n  max-width: 100%;\n  padding: var(--filter-token-padding, 4px 8px);\n  border: none;\n  outline: none;\n  background: transparent;\n  font-family: var(--filter-font-family, system-ui, -apple-system, sans-serif);\n  font-size: var(--filter-font-size, 14px);\n  line-height: 1.4;\n  color: inherit;\n}\n\n.token-input::placeholder {\n  color: var(--filter-input-placeholder, #9e9e9e);\n}\n\n.token-input:disabled {\n  cursor: not-allowed;\n  opacity: 0.6;\n}\n\n.token-container {\n  display: flex;\n  flex-wrap: nowrap;\n  align-items: center;\n  gap: var(--filter-token-gap, 4px);\n  padding: var(--filter-container-padding, 8px);\n  min-height: 42px;\n  background-color: var(--filter-container-bg, #ffffff);\n  border: 1px solid var(--filter-container-border, #e0e0e0);\n  border-radius: 6px;\n  cursor: text;\n  transition: border-color 0.15s ease, box-shadow 0.15s ease;\n  overflow-x: auto;\n  overflow-y: hidden;\n  scrollbar-width: thin;\n  scrollbar-color: var(--filter-container-border, #e0e0e0) transparent;\n}\n\n.token-container--full-width {\n  flex: 1 1 auto;\n}\n\n.token-container::-webkit-scrollbar {\n  height: 4px;\n}\n\n.token-container::-webkit-scrollbar-track {\n  background: transparent;\n}\n\n.token-container::-webkit-scrollbar-thumb {\n  background-color: var(--filter-container-border, #e0e0e0);\n  border-radius: 2px;\n}\n\n.token-container::-webkit-scrollbar-thumb:hover {\n  background-color: var(--filter-container-border-focus, #2196f3);\n}\n\n.token-container:focus-within {\n  border-color: var(--filter-container-border-focus, #2196f3);\n  box-shadow: var(--filter-container-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));\n}\n\n.token-container--disabled {\n  background-color: #f5f5f5;\n  cursor: not-allowed;\n  opacity: 0.7;\n}\n\n.dropdown-portal {\n  position: absolute;\n  z-index: 9999;\n  top: 0;\n  left: 0;\n  pointer-events: none;\n}\n\n.dropdown-portal > * {\n  pointer-events: auto;\n}\n\n.autocomplete-dropdown {\n  margin: 0;\n  padding: 4px 0;\n  list-style: none;\n  background-color: var(--filter-dropdown-bg, #ffffff);\n  border: 1px solid var(--filter-dropdown-border, #e0e0e0);\n  border-radius: 6px;\n  box-shadow: var(--filter-dropdown-shadow, 0 4px 12px rgba(0, 0, 0, 0.15));\n  overflow-y: auto;\n  z-index: 1000;\n}\n\n.autocomplete-dropdown__message {\n  padding: 8px 12px;\n  color: var(--filter-input-placeholder, #9e9e9e);\n  font-size: var(--filter-font-size, 14px);\n  text-align: center;\n}\n\n.autocomplete-item {\n  padding: 0;\n  cursor: pointer;\n}\n\n.autocomplete-item--disabled {\n  cursor: not-allowed;\n}\n\n.autocomplete-item__content {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 8px 12px;\n  transition: background-color 0.1s ease;\n}\n\n.autocomplete-item--highlighted .autocomplete-item__content, .autocomplete-item__content:hover {\n  background-color: var(--filter-dropdown-item-hover, #f5f5f5);\n}\n\n.autocomplete-item--highlighted .autocomplete-item__content {\n  background-color: var(--filter-dropdown-item-selected, #e3f2fd);\n}\n\n.autocomplete-item--disabled .autocomplete-item__content {\n  opacity: 0.5;\n}\n\n.autocomplete-item--disabled .autocomplete-item__content:hover {\n  background-color: transparent;\n}\n\n.autocomplete-item__icon {\n  flex-shrink: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 20px;\n  height: 20px;\n}\n\n.autocomplete-item__text {\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n}\n\n.autocomplete-item__label {\n  font-size: var(--filter-font-size, 14px);\n  font-weight: 500;\n  color: inherit;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.autocomplete-item__description {\n  font-size: 12px;\n  color: var(--filter-input-placeholder, #9e9e9e);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.autocomplete-group {\n  list-style: none;\n}\n\n.autocomplete-group__header {\n  padding: 8px 12px 4px;\n  font-size: 11px;\n  font-weight: 600;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n  color: var(--filter-input-placeholder, #9e9e9e);\n  background-color: var(--filter-dropdown-bg, #ffffff);\n}\n\n.autocomplete-group__items {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n\n.autocomplete-dropdown--virtual {\n  overflow-y: auto;\n  padding: 0;\n}\n\n.autocomplete-dropdown__virtual-spacer, .autocomplete-dropdown__virtual-items {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n\n.autocomplete-dropdown--virtual .autocomplete-item {\n  display: flex;\n  align-items: center;\n  box-sizing: border-box;\n}\n\n.autocomplete-dropdown--virtual .autocomplete-item__content {\n  width: 100%;\n}\n\n.sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border: 0;\n}\n\n.filter-box {\n  position: relative;\n  display: inline-block;\n  width: 100%;\n  font-family: var(--filter-font-family, system-ui, -apple-system, sans-serif);\n  font-size: var(--filter-font-size, 14px);\n  line-height: var(--filter-line-height, 1.5);\n}\n\n.filter-box[data-disabled] {\n  opacity: var(--filter-disabled-opacity, 0.6);\n  pointer-events: none;\n}\n\n.filter-box__skip-link {\n  position: absolute;\n  top: -40px;\n  left: 0;\n  z-index: 10000;\n  padding: 8px 16px;\n  background: var(--filter-skip-link-bg, #1976d2);\n  color: var(--filter-skip-link-color, #fff);\n  text-decoration: none;\n  font-weight: 500;\n  border-radius: 4px;\n  opacity: 0;\n  pointer-events: none;\n  transition: opacity 0.15s ease, top 0.15s ease;\n}\n\n.filter-box__skip-link:focus {\n  top: 0;\n  opacity: 1;\n  pointer-events: auto;\n  outline: 2px solid var(--filter-focus-color, #1976d2);\n  outline-offset: 2px;\n}\n\n.filter-box .sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border: 0;\n}\n\n.filter-box__content {\n  position: relative;\n  display: flex;\n  align-items: center;\n  gap: 4px;\n}\n\n.filter-box__clear-button {\n  flex-shrink: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 24px;\n  height: 24px;\n  padding: 0;\n  border: none;\n  background: transparent;\n  color: var(--filter-clear-button-color, #666);\n  font-size: 18px;\n  cursor: pointer;\n  border-radius: 4px;\n  transition: background-color 0.15s ease, color 0.15s ease;\n}\n\n.filter-box__clear-button:hover {\n  background-color: var(--filter-clear-button-hover-bg, #f0f0f0);\n  color: var(--filter-clear-button-hover-color, #333);\n}\n\n.filter-box__clear-button:focus-visible {\n  outline: 2px solid var(--filter-focus-ring-color, #1976d2);\n  outline-offset: 1px;\n}\n\n.filter-box__custom-widget {\n  background: var(--filter-dropdown-bg, #fff);\n  border: 1px solid var(--filter-dropdown-border, #ddd);\n  border-radius: var(--filter-dropdown-radius, 4px);\n  box-shadow: var(--filter-dropdown-shadow, 0 4px 12px rgba(0, 0, 0, 0.15));\n  overflow: hidden;\n}\n\n.custom-widget {\n  display: flex;\n  flex-direction: column;\n  padding: 12px;\n  background-color: var(--filter-dropdown-bg, #ffffff);\n  border-radius: 6px;\n  min-width: 280px;\n  max-width: 360px;\n}\n\n.custom-widget__header {\n  margin-bottom: 12px;\n  padding-bottom: 8px;\n  border-bottom: 1px solid var(--filter-container-border, #e0e0e0);\n}\n\n.custom-widget__title {\n  font-size: 13px;\n  font-weight: 600;\n  color: var(--filter-token-field-text, #1565c0);\n}\n\n.custom-widget__content {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  margin-bottom: 16px;\n}\n\n.custom-widget__date-input {\n  width: 100%;\n  padding: 8px 12px;\n  font-size: var(--filter-font-size, 14px);\n  border: 1px solid var(--filter-container-border, #e0e0e0);\n  border-radius: 4px;\n  background-color: var(--filter-container-bg, #ffffff);\n  color: inherit;\n  font-family: inherit;\n}\n\n.custom-widget__date-input:focus {\n  outline: none;\n  border-color: var(--filter-container-border-focus, #2196f3);\n  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);\n}\n\n.custom-widget__date-range-fields {\n  display: flex;\n  gap: 12px;\n}\n\n.custom-widget__field {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n\n.custom-widget__label {\n  font-size: 12px;\n  font-weight: 500;\n  color: var(--filter-input-placeholder, #9e9e9e);\n}\n\n.custom-widget__number-group {\n  display: flex;\n  align-items: stretch;\n}\n\n.custom-widget__number-input {\n  flex: 1;\n  padding: 8px 12px;\n  font-size: var(--filter-font-size, 14px);\n  border: 1px solid var(--filter-container-border, #e0e0e0);\n  border-radius: 4px;\n  background-color: var(--filter-container-bg, #ffffff);\n  color: inherit;\n  font-family: inherit;\n  text-align: center;\n}\n\n.custom-widget__number-input:focus {\n  outline: none;\n  border-color: var(--filter-container-border-focus, #2196f3);\n  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);\n}\n\n.custom-widget__number-input[aria-invalid=true] {\n  border-color: #e53935;\n}\n\n.custom-widget__number-btn {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 36px;\n  padding: 0;\n  font-size: 18px;\n  font-weight: 500;\n  border: 1px solid var(--filter-container-border, #e0e0e0);\n  background-color: var(--filter-dropdown-item-hover, #f5f5f5);\n  color: inherit;\n  cursor: pointer;\n  transition: background-color 0.15s;\n}\n\n.custom-widget__number-btn:first-child {\n  border-radius: 4px 0 0 4px;\n  border-right: none;\n}\n\n.custom-widget__number-btn:last-child {\n  border-radius: 0 4px 4px 0;\n  border-left: none;\n}\n\n.custom-widget__number-btn:hover {\n  background-color: var(--filter-dropdown-item-selected, #e3f2fd);\n}\n\n.custom-widget__number-btn:active {\n  background-color: var(--filter-container-border-focus, #2196f3);\n  color: #fff;\n}\n\n.custom-widget__number-group .custom-widget__number-input {\n  border-radius: 0;\n}\n\n.custom-widget__error {\n  font-size: 12px;\n  color: #e53935;\n  padding: 4px 0;\n}\n\n.custom-widget__hint {\n  font-size: 11px;\n  color: var(--filter-input-placeholder, #9e9e9e);\n}\n\n.custom-widget__presets {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n  padding-top: 8px;\n  border-top: 1px solid var(--filter-container-border, #e0e0e0);\n}\n\n.custom-widget__presets--range {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 6px;\n}\n\n.custom-widget__preset-btn {\n  padding: 6px 10px;\n  font-size: 12px;\n  border: 1px solid var(--filter-container-border, #e0e0e0);\n  border-radius: 4px;\n  background-color: var(--filter-dropdown-bg, #ffffff);\n  color: inherit;\n  cursor: pointer;\n  transition: all 0.15s;\n}\n\n.custom-widget__preset-btn:hover {\n  background-color: var(--filter-dropdown-item-hover, #f5f5f5);\n  border-color: var(--filter-container-border-focus, #2196f3);\n}\n\n.custom-widget__preset-btn:active {\n  background-color: var(--filter-dropdown-item-selected, #e3f2fd);\n}\n\n.custom-widget__footer {\n  display: flex;\n  justify-content: flex-end;\n  gap: 8px;\n  padding-top: 12px;\n  border-top: 1px solid var(--filter-container-border, #e0e0e0);\n}\n\n.custom-widget__btn {\n  padding: 8px 16px;\n  font-size: 13px;\n  font-weight: 500;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n  transition: all 0.15s;\n}\n\n.custom-widget__btn--cancel {\n  background-color: transparent;\n  color: var(--filter-input-placeholder, #9e9e9e);\n}\n\n.custom-widget__btn--cancel:hover {\n  background-color: var(--filter-dropdown-item-hover, #f5f5f5);\n  color: inherit;\n}\n\n.custom-widget__btn--confirm {\n  background-color: var(--filter-container-border-focus, #2196f3);\n  color: #fff;\n}\n\n.custom-widget__btn--confirm:hover {\n  background-color: #1976d2;\n}\n\n.custom-widget__btn--confirm:disabled {\n  background-color: var(--filter-container-border, #e0e0e0);\n  color: var(--filter-input-placeholder, #9e9e9e);\n  cursor: not-allowed;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .custom-widget__btn, .custom-widget__preset-btn, .custom-widget__number-btn, .custom-widget__date-input {\n    transition: none;\n  }\n}");

___$insertStylesToHeader("/**\n * FilterBox component styles\n */\n.filter-box-container {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  width: 100%;\n}\n\n.filter-box-wrapper {\n  flex: 1 1 auto;\n  min-width: 0;\n  width: 100%;\n  position: relative;\n}\n.filter-box-wrapper .filter-box {\n  display: block;\n  width: 100%;\n}\n.filter-box-wrapper .autocomplete-dropdown {\n  position: absolute;\n  top: 100%;\n  left: 0;\n  right: 0;\n  margin-top: 4px;\n  z-index: 1000;\n}\n\n.filter-box-saved-searches {\n  position: relative;\n  display: inline-block;\n}\n.filter-box-saved-searches__toggle {\n  background: none;\n  border: none;\n  cursor: pointer;\n  padding: 4px 8px;\n  display: flex;\n  align-items: center;\n  gap: 2px;\n  color: #555;\n}\n.filter-box-saved-searches__toggle:hover {\n  color: #333;\n}\n.filter-box-saved-searches__toggle:focus {\n  outline: 2px solid #66afe9;\n  outline-offset: 2px;\n}\n.filter-box-saved-searches__dropdown {\n  position: absolute;\n  right: 0;\n  top: 100%;\n  z-index: 1000;\n  background: white;\n  border: 1px solid #ccc;\n  border-radius: 4px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);\n  min-width: 200px;\n  max-height: 300px;\n  overflow-y: auto;\n}\n.filter-box-saved-searches__save-section {\n  padding: 8px;\n  border-bottom: 1px solid #eee;\n}\n.filter-box-saved-searches__save-row {\n  display: flex;\n  gap: 4px;\n}\n.filter-box-saved-searches__input {\n  flex: 1;\n  padding: 4px 8px;\n  border: 1px solid #ccc;\n  border-radius: 3px;\n  font-size: 12px;\n}\n.filter-box-saved-searches__input:focus {\n  outline: none;\n  border-color: #66afe9;\n  box-shadow: 0 0 4px rgba(102, 175, 233, 0.4);\n}\n.filter-box-saved-searches__save-button {\n  padding: 4px 8px;\n  border: 1px solid #ccc;\n  border-radius: 3px;\n  background: #f0f0f0;\n  cursor: pointer;\n  font-size: 12px;\n}\n.filter-box-saved-searches__save-button:hover:not(:disabled) {\n  background: #e0e0e0;\n}\n.filter-box-saved-searches__save-button:disabled {\n  cursor: not-allowed;\n  opacity: 0.6;\n}\n.filter-box-saved-searches__list {\n  max-height: 200px;\n  overflow-y: auto;\n}\n.filter-box-saved-searches__item {\n  padding: 8px 12px;\n  cursor: pointer;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  border-bottom: 1px solid #f0f0f0;\n}\n.filter-box-saved-searches__item:hover {\n  background: #f5f5f5;\n}\n.filter-box-saved-searches__item:focus {\n  outline: none;\n  background: #e8f0fe;\n}\n.filter-box-saved-searches__item:last-child {\n  border-bottom: none;\n}\n.filter-box-saved-searches__item-name {\n  font-size: 13px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.filter-box-saved-searches__delete-button {\n  background: none;\n  border: none;\n  color: #999;\n  cursor: pointer;\n  padding: 2px 4px;\n  font-size: 14px;\n  line-height: 1;\n}\n.filter-box-saved-searches__delete-button:hover {\n  color: #d9534f;\n}\n.filter-box-saved-searches__empty {\n  padding: 12px;\n  color: #999;\n  font-size: 12px;\n  text-align: center;\n}\n\n:root {\n  --rsfb-token-field-bg: #dbeafe;\n  --rsfb-token-field-color: #1e40af;\n  --rsfb-token-operator-bg: #f0f0f0;\n  --rsfb-token-operator-color: #9e9e9e;\n  --rsfb-token-value-bg: #fce7f3;\n  --rsfb-token-value-color: #e91e63;\n  --rsfb-token-connector-bg: #e5e7eb;\n  --rsfb-token-connector-color: #374151;\n  --rsfb-border-color: #ccc;\n  --rsfb-focus-border-color: #66afe9;\n  --rsfb-focus-shadow: 0 0 8px rgba(102, 175, 233, 0.6);\n  --rsfb-error-border-color: #a94442;\n}\n\n.filter-box-conflicts {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  margin-top: 8px;\n  padding: 8px 12px;\n  background-color: #fff3cd;\n  border: 1px solid #ffc107;\n  border-radius: 4px;\n  color: #856404;\n  font-size: 13px;\n  line-height: 1.4;\n}\n.filter-box-conflicts__icon {\n  flex-shrink: 0;\n}\n.filter-box-conflicts__message {\n  flex: 1;\n}");

var jsxRuntime = {exports: {}};

var reactJsxRuntime_production_min = {};

/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactJsxRuntime_production_min;

function requireReactJsxRuntime_production_min () {
	if (hasRequiredReactJsxRuntime_production_min) return reactJsxRuntime_production_min;
	hasRequiredReactJsxRuntime_production_min = 1;
var f=requireReact(),k=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:true,ref:true,__self:true,__source:true};
	function q(c,a,g){var b,d={},e=null,h=null;void 0!==g&&(e=""+g);void 0!==a.key&&(e=""+a.key);void 0!==a.ref&&(h=a.ref);for(b in a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a) void 0===d[b]&&(d[b]=a[b]);return {$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}reactJsxRuntime_production_min.Fragment=l;reactJsxRuntime_production_min.jsx=q;reactJsxRuntime_production_min.jsxs=q;
	return reactJsxRuntime_production_min;
}

var hasRequiredJsxRuntime;

function requireJsxRuntime () {
	if (hasRequiredJsxRuntime) return jsxRuntime.exports;
	hasRequiredJsxRuntime = 1;

	{
	  jsxRuntime.exports = requireReactJsxRuntime_production_min();
	}
	return jsxRuntime.exports;
}

var jsxRuntimeExports = requireJsxRuntime();

var reactDomExports = requireReactDom();

function Ze(n) {
  var e, t, o = "";
  if (typeof n == "string" || typeof n == "number") o += n;
  else if (typeof n == "object") if (Array.isArray(n)) {
    var i = n.length;
    for (e = 0; e < i; e++) n[e] && (t = Ze(n[e])) && (o && (o += " "), o += t);
  } else for (t in n) n[t] && (o && (o += " "), o += t);
  return o;
}
function X() {
  for (var n, e, t = 0, o = "", i = arguments.length; t < i; t++) (n = arguments[t]) && (e = Ze(n)) && (o && (o += " "), o += e);
  return o;
}
function et(n) {
  switch (n.type) {
    case "field":
      return n.value.label;
    case "operator": {
      const e = n.value;
      return e.symbol ?? e.label;
    }
    case "value":
      return n.value.display;
    case "connector":
      return n.value.label;
    default:
      return "";
  }
}
function lt(n) {
  const e = et(n);
  return `${n.type}: ${e}`;
}
const at = reactExports.memo(function({
  data: e,
  isEditable: t,
  isSelectable: o = false,
  isEditing: i,
  isSelected: r,
  isDeletable: l,
  hasError: s = false,
  errorMessage: u,
  onEdit: d,
  onSelect: b,
  onDelete: f,
  onEditComplete: m,
  onEditCancel: p,
  className: v
}) {
  const D = et(e), N = lt(e), E = reactExports.useRef(null), [C, _] = reactExports.useState(D);
  reactExports.useEffect(() => {
    i && E.current && (E.current.focus(), E.current.select());
  }, [i]), reactExports.useEffect(() => {
    i && _(D);
  }, [i, D]);
  const V = (g) => {
    g.stopPropagation(), g.preventDefault(), o && b ? b() : t && !i && d();
  }, F = (g) => {
    g.stopPropagation(), t && !i && d();
  }, R = (g) => {
    g.stopPropagation(), f();
  }, x = (g) => {
    g.key === "Enter" ? (g.preventDefault(), m({
      raw: C,
      display: C,
      serialized: C
    })) : g.key === "Escape" && (g.preventDefault(), p());
  }, P = (g) => {
    _(g.target.value);
  };
  return i ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: X("token", `token--${e.type}`, "token--editing", v), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "input",
    {
      ref: E,
      type: "text",
      className: "token__edit-input",
      value: C,
      onChange: P,
      onKeyDown: x,
      "aria-label": `Edit ${e.type}`
    }
  ) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      role: "option",
      "aria-selected": r,
      "aria-label": N,
      "aria-invalid": s ? "true" : void 0,
      title: s && u ? u : void 0,
      "data-error-message": s && u ? u : void 0,
      tabIndex: -1,
      className: X(
        "token",
        `token--${e.type}`,
        {
          "token--editable": t,
          "token--selectable": o,
          "token--selected": r,
          "token--error": s,
          "token--pending": e.isPending,
          "token--deletable": l
        },
        v
      ),
      onClick: V,
      onDoubleClick: F,
      children: [
        D,
        l && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "token__delete-button",
            onClick: R,
            "aria-label": `Delete ${e.type}`,
            children: "×"
          }
        )
      ]
    }
  );
});
function ct({
  value: n,
  onChange: e,
  onKeyDown: t,
  onFocus: o,
  onBlur: i,
  placeholder: r,
  autoFocus: l,
  inputRef: s,
  className: u,
  disabled: d,
  minWidth: b = 50,
  ...f
}) {
  const m = reactExports.useRef(null), [p, v] = reactExports.useState(b);
  return reactExports.useLayoutEffect(() => {
    if (m.current) {
      const N = m.current.scrollWidth;
      v(Math.max(N + 2, b));
    }
  }, [n, r, b]), /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "token-input-wrapper", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { ref: m, className: "token-input-sizer", "aria-hidden": "true", children: n || r || "" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref: s,
        type: "text",
        role: "combobox",
        "aria-autocomplete": "list",
        "aria-expanded": false,
        value: n,
        onChange: (N) => e(N.target.value),
        onKeyDown: t,
        onFocus: o,
        onBlur: i,
        placeholder: r,
        autoFocus: l,
        disabled: d,
        className: X("token-input", u),
        style: { width: `${p}px` },
        ...f
      }
    )
  ] });
}
function ut({
  tokens: n,
  inputValue: e,
  onInputChange: t,
  onInputKeyDown: o,
  onTokenClick: i,
  onTokenSelect: r,
  onFieldClick: l,
  onOperatorClick: s,
  onConnectorClick: u,
  onInputFocus: d,
  onInputBlur: b,
  onFocus: f,
  onBlur: m,
  inputRef: p,
  placeholder: v,
  disabled: D,
  className: N,
  inputProps: E,
  editingTokenIndex: C = -1,
  selectedTokenIndex: _ = -1,
  allTokensSelected: V = false,
  onTokenEditComplete: F,
  onTokenEditCancel: R,
  onExpressionDelete: x,
  fullWidth: P = true
}) {
  const g = d ?? f, w = b ?? m, O = () => {
    g?.(), p.current?.focus();
  }, M = ($, U) => {
    $.type === "field" && !$.isPending && $.expressionIndex >= 0 && l ? l($.expressionIndex) : $.type === "operator" && !$.isPending && $.expressionIndex >= 0 && s ? s($.expressionIndex) : $.type === "connector" && !$.isPending && $.expressionIndex >= 0 && u ? u($.expressionIndex) : ($.type, r?.(U));
  }, K = ($, U) => {
    ($.type === "value" || $.type === "operator") && i?.(U);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: X(
        "token-container",
        { "token-container--disabled": D, "token-container--full-width": P },
        N
      ),
      onClick: O,
      children: [
        n.map(($, U) => {
          const J = V || U === _, ae = J && !$.isPending && $.expressionIndex >= 0;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            at,
            {
              data: $,
              isEditable: ($.type === "value" || $.type === "operator" || $.type === "connector") && !$.isPending,
              isSelectable: !$.isPending && $.expressionIndex >= 0,
              isEditing: U === C,
              isSelected: J,
              isDeletable: ae,
              onEdit: () => K($, U),
              onSelect: () => M($, U),
              onDelete: () => {
                $.expressionIndex >= 0 && x && x($.expressionIndex);
              },
              onEditComplete: (j) => F?.(j),
              onEditCancel: () => R?.()
            },
            $.id
          );
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ct,
          {
            ...E,
            value: e,
            onChange: t,
            onKeyDown: o,
            onFocus: g,
            onBlur: w,
            inputRef: p,
            placeholder: v,
            disabled: D
          }
        )
      ]
    }
  );
}
class dt {
  state = "idle";
  context = {
    completedExpressions: [],
    currentField: void 0,
    currentOperator: void 0,
    pendingConnector: void 0
  };
  /**
   * Get the current state
   */
  getState() {
    return this.state;
  }
  /**
   * Get the current context
   */
  getContext() {
    return { ...this.context };
  }
  /**
   * Check if a transition is allowed from the current state
   */
  canTransition(e) {
    return this.getAvailableActions().includes(e.type);
  }
  /**
   * Get available action types for the current state
   *
   * Note: For 'editing-token' state, this method returns the expected actions,
   * but the actual state transitions are managed by React (useFilterState hook),
   * not by this state machine. This is part of the dual state management system
   * documented in TODO-state-machine-review.md
   */
  getAvailableActions() {
    switch (this.state) {
      case "idle":
        return ["FOCUS"];
      case "selecting-field":
        return ["SELECT_FIELD", "BLUR", "DELETE_LAST"];
      case "selecting-operator":
        return ["SELECT_OPERATOR", "BLUR", "DELETE_LAST"];
      case "entering-value":
        return ["CONFIRM_VALUE", "BLUR", "DELETE_LAST"];
      case "selecting-connector":
        return ["SELECT_CONNECTOR", "COMPLETE", "BLUR", "DELETE_LAST"];
      case "editing-token":
        return ["CONFIRM_VALUE", "BLUR"];
      default:
        return [];
    }
  }
  /**
   * Transition to a new state based on the action
   */
  transition(e) {
    switch (e.type) {
      case "FOCUS":
        this.handleFocus();
        break;
      case "BLUR":
        this.handleBlur();
        break;
      case "SELECT_FIELD":
        this.handleSelectField(e.payload);
        break;
      case "SELECT_OPERATOR":
        this.handleSelectOperator(e.payload);
        break;
      case "CONFIRM_VALUE":
        this.handleConfirmValue(e.payload);
        break;
      case "SELECT_CONNECTOR":
        this.handleSelectConnector(e.payload);
        break;
      case "COMPLETE":
        this.handleComplete();
        break;
      case "DELETE_LAST":
        this.handleDeleteLast();
        break;
      case "CLEAR":
        this.clear();
        break;
      case "RESET":
        this.reset();
        break;
    }
  }
  /**
   * Reset the state machine to initial state
   */
  reset() {
    this.state = "idle", this.context = {
      completedExpressions: [],
      currentField: void 0,
      currentOperator: void 0,
      pendingConnector: void 0
    };
  }
  /**
   * Clear all expressions but maintain current state
   */
  clear() {
    this.state = "idle", this.context = {
      ...this.context,
      completedExpressions: [],
      currentField: void 0,
      currentOperator: void 0,
      pendingConnector: void 0
    };
  }
  /**
   * Load expressions from external source
   */
  loadExpressions(e) {
    this.context = {
      ...this.context,
      completedExpressions: [...e]
    };
  }
  // ===========================================================================
  // Private Handlers
  // ===========================================================================
  handleFocus() {
    this.state === "idle" && (this.state = "selecting-field");
  }
  handleBlur() {
    this.context = {
      ...this.context,
      currentField: void 0,
      currentOperator: void 0,
      pendingConnector: void 0
    }, this.state = "idle";
  }
  handleSelectField(e) {
    this.state === "selecting-field" && (this.context = {
      ...this.context,
      currentField: e
    }, this.state = "selecting-operator");
  }
  handleSelectOperator(e) {
    this.state === "selecting-operator" && (this.context = {
      ...this.context,
      currentOperator: e
    }, this.state = "entering-value");
  }
  handleConfirmValue(e) {
    if (this.state === "entering-value" && this.context.currentField && this.context.currentOperator) {
      const o = {
        condition: {
          field: this.context.currentField,
          operator: this.context.currentOperator,
          value: e
        },
        connector: void 0
      };
      this.context = {
        ...this.context,
        completedExpressions: [...this.context.completedExpressions, o],
        currentField: void 0,
        currentOperator: void 0
      }, this.state = "selecting-connector";
    }
  }
  handleSelectConnector(e) {
    if (this.state === "selecting-connector") {
      const t = [...this.context.completedExpressions], o = t.length - 1, i = t[o];
      i && (t[o] = {
        ...i,
        connector: e
      }), this.context = {
        ...this.context,
        completedExpressions: t,
        pendingConnector: e
      }, this.state = "selecting-field";
    }
  }
  handleComplete() {
    this.state === "selecting-connector" && (this.context = {
      ...this.context,
      pendingConnector: void 0
    }, this.state = "idle");
  }
  handleDeleteLast() {
    switch (this.state) {
      case "selecting-connector": {
        const e = this.context.completedExpressions.slice(0, -1), t = this.context.completedExpressions[this.context.completedExpressions.length - 1];
        t && (this.context = {
          ...this.context,
          completedExpressions: e,
          currentField: t.condition.field,
          currentOperator: t.condition.operator
        }), this.state = "entering-value";
        break;
      }
      case "entering-value": {
        this.context = {
          ...this.context,
          currentOperator: void 0
        }, this.state = "selecting-operator";
        break;
      }
      case "selecting-operator": {
        this.context = {
          ...this.context,
          currentField: void 0
        }, this.state = "selecting-field";
        break;
      }
      case "selecting-field": {
        if (this.context.completedExpressions.length > 0) {
          const e = [...this.context.completedExpressions], t = e.length - 1, o = e[t];
          o && (e[t] = {
            ...o,
            connector: void 0
          }), this.context = {
            ...this.context,
            completedExpressions: e
          }, this.state = "selecting-connector";
        }
        break;
      }
    }
  }
}
function ft(n, e, t = {}) {
  const { useFieldSerializers: o = true, useSchemaSerializer: i = true } = t;
  if (i && e?.serialize) {
    const r = e.serialize(n);
    if (Array.isArray(r))
      return r;
  }
  return n.map((r) => {
    let l = r.condition.value.serialized;
    if (o && e) {
      const u = e.fields.find((d) => d.key === r.condition.field.key);
      u?.serialize && (l = u.serialize(r.condition.value));
    }
    const s = {
      field: r.condition.field.key,
      operator: r.condition.operator.key,
      value: l
    };
    return r.connector && (s.connector = r.connector), s;
  });
}
function We(n, e, t = true) {
  if (t && e.deserialize)
    return e.deserialize(n);
  const o = String(n);
  return {
    raw: n,
    display: o,
    serialized: o
  };
}
function pt(n, e, t = {}) {
  const { useFieldDeserializers: o = true, useSchemaDeserializer: i = true } = t;
  return i && e.deserialize ? e.deserialize(n) : n.map((r) => {
    let l = e.fields.find((f) => f.key === r.field), s = false;
    if (!l && e.allowFreeformFields) {
      const f = e.freeformFieldConfig ?? {};
      s = true, l = {
        key: r.field,
        label: r.field,
        type: f.type ?? "string",
        operators: f.operators ?? [
          { key: "eq", label: "equals", symbol: "=" },
          { key: "neq", label: "not equals", symbol: "≠" },
          { key: "contains", label: "contains" },
          { key: "startsWith", label: "starts with" },
          { key: "endsWith", label: "ends with" }
        ]
      };
    }
    if (!l)
      throw new Error(`Unknown field: ${r.field}`);
    const u = l.operators.find((f) => f.key === r.operator);
    if (!u) {
      if (s && e.freeformFieldConfig?.operators) {
        const f = e.freeformFieldConfig.operators.find(
          (m) => m.key === r.operator
        );
        if (f) {
          const m = We(r.value, l), p = {
            condition: {
              field: {
                key: l.key,
                label: l.label,
                type: l.type
              },
              operator: {
                key: f.key,
                label: f.label,
                symbol: f.symbol
              },
              value: m
            }
          };
          return r.connector && (p.connector = r.connector), p;
        }
      }
      throw new Error(`Unknown operator: ${r.operator} for field ${r.field}`);
    }
    const d = We(r.value, l, o), b = {
      condition: {
        field: {
          key: l.key,
          label: l.label,
          type: l.type
        },
        operator: {
          key: u.key,
          label: u.label,
          symbol: u.symbol
        },
        value: d
      }
    };
    return r.connector && (b.connector = r.connector), b;
  });
}
function gt(n) {
  const e = [];
  let t = 0;
  return n.forEach((o, i) => {
    e.push({
      id: `${i}-field`,
      type: "field",
      value: o.condition.field,
      position: t++,
      expressionIndex: i,
      isPending: false
    }), e.push({
      id: `${i}-operator`,
      type: "operator",
      value: o.condition.operator,
      position: t++,
      expressionIndex: i,
      isPending: false
    }), e.push({
      id: `${i}-value`,
      type: "value",
      value: o.condition.value,
      position: t++,
      expressionIndex: i,
      isPending: false
    }), o.connector && e.push({
      id: `${i}-connector`,
      type: "connector",
      value: { key: o.connector, label: o.connector },
      position: t++,
      expressionIndex: i,
      isPending: false
    });
  }), e;
}
function mt(n, e, t = 0) {
  const o = [], i = t * 4;
  return n && o.push({
    id: "pending-field",
    type: "field",
    value: n,
    position: i,
    expressionIndex: -1,
    // -1 indicates pending
    isPending: true
  }), e && o.push({
    id: "pending-operator",
    type: "operator",
    value: e,
    position: i + 1,
    expressionIndex: -1,
    isPending: true
  }), o;
}
function De(n, e) {
  return n.allowFreeformFields ? !n.fields.some((t) => t.key === e) : false;
}
function Pe(n, e, t) {
  const o = n.freeformFieldConfig ?? {}, i = o.type ?? "string", r = [
    { key: "eq", label: "equals", symbol: "=" },
    { key: "neq", label: "not equals", symbol: "≠" },
    { key: "contains", label: "contains" },
    { key: "startsWith", label: "starts with" },
    { key: "endsWith", label: "ends with" }
  ];
  return {
    key: e,
    label: t,
    type: i,
    operators: o.operators ?? r,
    valueAutocompleter: o.valueAutocompleter,
    color: o.color,
    group: o.group ?? "Custom"
  };
}
function yt(n, e, t, o = "") {
  const i = (r) => {
    if (!o) return r;
    const l = o.toLowerCase();
    return r.filter(
      (s) => s.label.toLowerCase().includes(l) || (s.description?.toLowerCase().includes(l) ?? false)
    );
  };
  switch (n) {
    case "selecting-field": {
      const r = i(
        e.fields.map((l) => ({
          type: "field",
          key: l.key,
          label: l.label,
          description: l.description,
          icon: l.icon,
          group: l.group
        }))
      );
      if (e.allowFreeformFields && o.trim()) {
        const l = o.trim(), s = e.freeformFieldConfig ?? {}, u = s.createLabel ?? "Create field: ";
        if (!e.fields.some(
          (b) => b.key === l || b.label.toLowerCase() === l.toLowerCase()
        ))
          if (s.validateFieldName) {
            const b = s.validateFieldName(l);
            b !== true && b !== false || b === false || r.push({
              type: "field",
              key: `__freeform__:${l}`,
              label: `${u}"${l}"`,
              description: "Create a custom field",
              group: s.group ?? "Custom"
            });
          } else
            r.push({
              type: "field",
              key: `__freeform__:${l}`,
              label: `${u}"${l}"`,
              description: "Create a custom field",
              group: s.group ?? "Custom"
            });
      }
      return r;
    }
    case "selecting-operator": {
      if (!t) return [];
      if (De(e, t.key)) {
        const l = e.freeformFieldConfig ?? {};
        l.type;
        const s = l.operators ?? [
          { key: "eq", label: "equals", symbol: "=" },
          { key: "neq", label: "not equals", symbol: "≠" },
          { key: "contains", label: "contains" },
          { key: "startsWith", label: "starts with" },
          { key: "endsWith", label: "ends with" }
        ];
        return i(
          s.map((u) => ({
            type: "operator",
            key: u.key,
            label: u.label,
            description: u.symbol ? `Symbol: ${u.symbol}` : void 0
          }))
        );
      }
      const r = e.fields.find((l) => l.key === t.key);
      return r ? i(
        r.operators.map((l) => ({
          type: "operator",
          key: l.key,
          label: l.label,
          description: l.symbol ? `Symbol: ${l.symbol}` : void 0
        }))
      ) : [];
    }
    case "selecting-connector": {
      const r = e.connectors ?? [
        { key: "AND", label: "AND" },
        { key: "OR", label: "OR" }
      ];
      return i(
        r.map((l) => ({
          type: "connector",
          key: l.key,
          label: l.label
        }))
      );
    }
    default:
      return [];
  }
}
function ht(n, e) {
  return e?.valueAutocompleter ? e.valueAutocompleter : n?.valueAutocompleter;
}
function bt(n, e) {
  switch (n) {
    case "selecting-field":
      return e?.allowFreeformFields ? e.freeformFieldConfig?.placeholder ?? "Type or select field..." : "Select field...";
    case "selecting-operator":
      return "Select operator...";
    case "entering-value":
      return "Enter value...";
    case "selecting-connector":
      return "Add filter... (↓ for AND/OR)";
    default:
      return "Add filter...";
  }
}
function kt({
  schema: n,
  value: e,
  onChange: t
}) {
  const [o] = reactExports.useState(() => new dt()), [i, r] = reactExports.useState("idle"), [l, s] = reactExports.useState(false), [u, d] = reactExports.useState(""), [b, f] = reactExports.useState(0), [m, p] = reactExports.useState(-1), [v, D] = reactExports.useState(-1), [N, E] = reactExports.useState(false), [C, _] = reactExports.useState(), [V, F] = reactExports.useState(), [R, x] = reactExports.useState(""), [P, g] = reactExports.useState(-1), [w, O] = reactExports.useState(-1), [M, K] = reactExports.useState(-1), [$, U] = reactExports.useState([]), J = reactExports.useRef(null), ae = reactExports.useRef(false), j = reactExports.useRef([]), oe = reactExports.useRef([]), ce = reactExports.useRef(false), de = reactExports.useRef([]);
  reactExports.useEffect(() => {
    if (ce.current) {
      ce.current = false, de.current = e;
      return;
    }
    JSON.stringify(de.current) !== JSON.stringify(e) && (j.current.push(JSON.parse(JSON.stringify(de.current))), j.current.length > 50 && j.current.shift(), oe.current = [], de.current = JSON.parse(JSON.stringify(e)));
  }, [e]), reactExports.useEffect(() => {
    o.loadExpressions(e);
  }, [o, e]);
  const z = reactExports.useMemo(() => {
    const a = gt(e);
    if (i === "editing-token")
      return a;
    const c = mt(C, V, e.length);
    return [...a, ...c];
  }, [e, C, V, i]), q = reactExports.useMemo(() => {
    if (M >= 0 && e[M])
      return n.fields.map((a) => ({
        type: "field",
        key: a.key,
        label: a.label,
        description: `Type: ${a.type}`
      }));
    if (w >= 0 && e[w])
      return (n.connectors ?? [
        { key: "AND", label: "AND" },
        { key: "OR", label: "OR" }
      ]).map((c) => ({
        type: "connector",
        key: c.key,
        label: c.label
      }));
    if (P >= 0 && e[P]) {
      const a = e[P], c = a.condition.field.key, y = a.condition.field.label;
      let k = n.fields.find((h) => h.key === c);
      return !k && De(n, c) && (k = Pe(n, c, y)), k ? k.operators.map((h) => ({
        type: "operator",
        key: h.key,
        label: h.label,
        description: h.symbol ? `Symbol: ${h.symbol}` : void 0
      })) : [];
    }
    return i === "entering-value" ? $ : yt(i, n, C, u);
  }, [
    i,
    n,
    C,
    u,
    M,
    P,
    w,
    e,
    $
  ]), Ce = reactExports.useMemo(() => bt(i, n), [i, n]), ne = reactExports.useMemo(() => {
    if (!C) return;
    const a = n.fields.find((c) => c.key === C.key);
    if (a) return a;
    if (n.allowFreeformFields)
      return Pe(n, C.key, C.label);
  }, [C, n]), re = reactExports.useMemo(() => {
    if (!(!ne || !V))
      return ne.operators.find((a) => a.key === V.key);
  }, [ne, V]), te = reactExports.useMemo(() => {
    if (!(i !== "entering-value" && i !== "editing-token"))
      return re?.customInput;
  }, [i, re]), ye = reactExports.useMemo(() => {
    if (i !== "editing-token" || m < 0) return;
    const a = z[m];
    if (!a || a.type !== "value") return;
    const c = a.expressionIndex;
    if (c < 0 || c >= e.length) return;
    const y = e[c]?.condition.value;
    if (y)
      return te?.parse ? te.parse(y.serialized) : y.raw;
  }, [i, m, z, e, te]);
  reactExports.useEffect(() => {
    if (i !== "entering-value") {
      U([]);
      return;
    }
    const a = ht(ne, re);
    if (!a) {
      U([]);
      return;
    }
    const c = {
      inputValue: u,
      field: ne,
      operator: re,
      existingExpressions: e,
      schema: n
    }, y = a.getSuggestions(c);
    if (y instanceof Promise) {
      let k = false;
      return y.then((h) => {
        k || U(h);
      }).catch(() => {
        k || U([]);
      }), () => {
        k = true;
      };
    } else
      U(y);
  }, [i, u, ne, re]), reactExports.useEffect(() => {
    f(-1);
  }, [i]), reactExports.useEffect(() => {
    if (l && q.length > 0) {
      const a = q.length, c = q[0]?.type === "field" ? "field" : q[0]?.type === "operator" ? "operator" : q[0]?.type === "connector" ? "connector" : "suggestion";
      x(
        `${a} ${c}${a !== 1 ? "s" : ""} available. Use arrow keys to navigate.`
      );
    } else l && q.length === 0 && x("No suggestions available.");
  }, [l, q]);
  const _e = reactExports.useCallback(() => {
    if (ae.current) {
      ae.current = false;
      return;
    }
    o.transition({ type: "FOCUS" });
    let a = o.getState();
    e.length > 0 && !C && !V && (a = "selecting-connector"), r(a), s(a !== "selecting-connector"), f(a === "selecting-connector" ? 0 : -1), D(-1), E(false);
  }, [o, e.length, C, V]), Te = reactExports.useCallback(() => {
    o.transition({ type: "BLUR" }), r(o.getState()), s(false), d(""), _(void 0), F(void 0), D(-1), E(false), p(-1), g(-1), O(-1), K(-1);
  }, [o]), Ne = reactExports.useCallback(
    (a) => {
      if (d(a), D(-1), E(false), i === "selecting-connector" && a.length > 0) {
        const c = n.connectors?.[0]?.key ?? "AND";
        o.transition({ type: "SELECT_CONNECTOR", payload: c }), r("selecting-field"), s(true);
      } else !l && a.length > 0 && s(true);
    },
    [i, o, l, n.connectors]
  ), Fe = reactExports.useCallback((a) => {
    f(a);
  }, []), fe = reactExports.useCallback(
    (a) => {
      if (M >= 0 && a.type === "field") {
        const y = e[M], k = n.fields.find((h) => h.key === a.key);
        if (k) {
          const h = {
            key: k.key,
            label: k.label,
            type: k.type
          }, T = k.operators[0], L = {
            key: T.key,
            label: T.label,
            symbol: T.symbol
          }, I = [...e];
          I[M] = {
            ...y,
            condition: {
              field: h,
              operator: L,
              value: y.condition.value
              // Keep existing value
            }
          }, t(I), K(-1), s(false), x(`Field changed to ${h.label}`);
        }
        return;
      }
      if (w >= 0 && a.type === "connector") {
        const y = e[w], k = a.key, h = [...e];
        h[w] = {
          ...y,
          connector: k
        }, t(h), O(-1), s(false), x(`Connector changed to ${k}`);
        return;
      }
      if (P >= 0 && a.type === "operator") {
        const y = e[P], k = y.condition.field.key, h = y.condition.field.label;
        let T = n.fields.find((I) => I.key === k);
        !T && De(n, k) && (T = Pe(n, k, h));
        const L = T?.operators.find((I) => I.key === a.key);
        if (L) {
          const I = {
            key: L.key,
            label: L.label,
            symbol: L.symbol
          }, Q = [...e];
          Q[P] = {
            ...y,
            condition: {
              ...y.condition,
              operator: I
            }
          }, t(Q), g(-1), s(false), x(`Operator changed to ${I.label}`);
        }
        return;
      }
      const c = o.getState();
      if (c === "selecting-field") {
        if (a.key.startsWith("__freeform__:")) {
          const k = a.key.replace("__freeform__:", ""), h = n.freeformFieldConfig ?? {}, T = h.type ?? "string", L = {
            key: k,
            label: k,
            type: T
          };
          _(L), o.transition({ type: "SELECT_FIELD", payload: L }), r(o.getState()), d("");
          const I = h.operators ?? [
            { key: "eq", label: "equals", symbol: "=" },
            { key: "neq", label: "not equals", symbol: "≠" },
            { key: "contains", label: "contains" },
            { key: "startsWith", label: "starts with" },
            { key: "endsWith", label: "ends with" }
          ];
          if (I.length === 1) {
            const Q = I[0], ke = {
              key: Q.key,
              label: Q.label,
              symbol: Q.symbol
            };
            F(ke), o.transition({ type: "SELECT_OPERATOR", payload: ke }), r(o.getState());
            const Ve = h.valueAutocompleter !== void 0;
            s(Ve), x(
              `Created field "${k}" with ${ke.label}. Now enter a value.`
            );
          } else
            x(`Created field "${k}". Now select an operator.`);
          return;
        }
        const y = n.fields.find((k) => k.key === a.key);
        if (y) {
          const k = {
            key: y.key,
            label: y.label,
            type: y.type
          };
          if (_(k), o.transition({ type: "SELECT_FIELD", payload: k }), r(o.getState()), d(""), y.operators.length === 1) {
            const h = y.operators[0], T = {
              key: h.key,
              label: h.label,
              symbol: h.symbol
            };
            F(T), o.transition({ type: "SELECT_OPERATOR", payload: T }), r(o.getState());
            const L = h.customInput !== void 0, I = h.valueAutocompleter !== void 0 || y.valueAutocompleter !== void 0;
            s(L || I), x(
              `Selected ${k.label} with ${T.label}. Now enter a value.`
            );
          } else
            x(`Selected ${k.label}. Now select an operator.`);
        }
      } else if (c === "selecting-operator")
        if (De(n, C?.key ?? "")) {
          const k = n.freeformFieldConfig ?? {}, T = (k.operators ?? [
            { key: "eq", label: "equals", symbol: "=" },
            { key: "neq", label: "not equals", symbol: "≠" },
            { key: "contains", label: "contains" },
            { key: "startsWith", label: "starts with" },
            { key: "endsWith", label: "ends with" }
          ]).find((L) => L.key === a.key);
          if (T) {
            const L = {
              key: T.key,
              label: T.label,
              symbol: T.symbol
            };
            F(L), o.transition({ type: "SELECT_OPERATOR", payload: L }), r(o.getState()), d("");
            const I = k.valueAutocompleter !== void 0;
            s(I), x(`Selected ${L.label}. Now enter a value.`);
          }
        } else {
          const k = n.fields.find((T) => T.key === C?.key), h = k?.operators.find((T) => T.key === a.key);
          if (h) {
            const T = {
              key: h.key,
              label: h.label,
              symbol: h.symbol
            };
            F(T), o.transition({ type: "SELECT_OPERATOR", payload: T }), r(o.getState()), d("");
            const L = h.valueAutocompleter !== void 0 || k?.valueAutocompleter !== void 0;
            s(L), x(`Selected ${T.label}. Now enter a value.`);
          }
        }
      else if (c === "selecting-connector") {
        o.transition({ type: "SELECT_CONNECTOR", payload: a.key });
        const y = o.getContext().completedExpressions;
        t([...y]), r(o.getState()), d(""), x(`Added ${a.key} connector. Now select a field.`);
      } else if (c === "entering-value" && a.type === "value") {
        const y = {
          raw: a.key,
          display: a.label,
          serialized: String(a.key)
        };
        o.transition({ type: "CONFIRM_VALUE", payload: y });
        const k = o.getContext().completedExpressions;
        t([...k]), r(o.getState()), d(""), _(void 0), F(void 0), s(false), f(0), x(
          `Filter added: value "${a.label}". Press Down Arrow to add more conditions.`
        );
      }
    },
    [
      o,
      n,
      C,
      t,
      M,
      P,
      w,
      e
    ]
  ), he = reactExports.useCallback(() => {
    if (o.getState() === "entering-value" && u.trim()) {
      const a = {
        raw: u.trim(),
        display: u.trim(),
        serialized: u.trim()
      };
      o.transition({ type: "CONFIRM_VALUE", payload: a });
      const c = o.getContext().completedExpressions;
      t([...c]), r(o.getState()), d(""), _(void 0), F(void 0), s(false), f(0), x(
        `Filter added: value "${u.trim()}". Press Down Arrow to add more conditions.`
      );
    }
  }, [o, u, t]), Ae = reactExports.useCallback(
    (a, c) => {
      if (i === "editing-token" && m >= 0) {
        const L = z[m];
        if (!L || L.type !== "value") return;
        const I = L.expressionIndex;
        if (I < 0 || I >= e.length) return;
        const Q = te?.serialize ? te.serialize(a) : String(a), ke = {
          raw: a,
          display: c,
          serialized: Q
        }, Ve = e.map((Be, tt) => tt === I ? {
          ...Be,
          condition: {
            ...Be.condition,
            value: ke
          }
        } : Be);
        p(-1), s(false), f(0), r("selecting-connector"), _(void 0), F(void 0), J.current = null, t(Ve), x(`Value updated to "${c}". Press Down Arrow to add more conditions.`);
        return;
      }
      if (o.getState() !== "entering-value") return;
      const k = te?.serialize ? te.serialize(a) : String(a), h = {
        raw: a,
        display: c,
        serialized: k
      };
      o.transition({ type: "CONFIRM_VALUE", payload: h });
      const T = o.getContext().completedExpressions;
      t([...T]), r(o.getState()), d(""), _(void 0), F(void 0), s(false), f(0), x(`Filter added: value "${c}". Press Down Arrow to add more conditions.`);
    },
    [o, t, te, m, z, e, i]
  ), Oe = reactExports.useCallback(() => {
    if (i === "editing-token") {
      p(-1), _(void 0), F(void 0), s(false), J.current !== null && (r(J.current), J.current = null), x("Edit cancelled.");
      return;
    }
    o.transition({ type: "DELETE_LAST" }), r(o.getState()), F(void 0), s(true), x("Value input cancelled. Select an operator.");
  }, [o, i]), $e = reactExports.useCallback(
    (a) => {
      switch (a.key) {
        case "ArrowDown":
        case "ArrowUp":
          if (v >= 0 && !l) {
            a.preventDefault();
            const c = z[v];
            if (c?.type === "field" && !c.isPending && c.expressionIndex >= 0) {
              be(c.expressionIndex);
              return;
            }
            if (c?.type === "operator" && !c.isPending && c.expressionIndex >= 0) {
              ge(c.expressionIndex);
              return;
            }
            if (c?.type === "connector" && !c.isPending && c.expressionIndex >= 0) {
              Z(c.expressionIndex);
              return;
            }
            if (c?.type === "value" && !c.isPending && c.expressionIndex >= 0) {
              const y = e[c.expressionIndex];
              if (y) {
                const k = y.condition.field.key, h = y.condition.operator.key;
                if (n.fields.find((I) => I.key === k)?.operators.find((I) => I.key === h)?.customInput) {
                  _(y.condition.field), F(y.condition.operator), J.current = i, r("editing-token"), p(v), D(-1), s(true), d("");
                  return;
                }
              }
            }
          }
          if (i === "selecting-connector" && !l && v === -1) {
            a.preventDefault(), s(true), f(0);
            return;
          }
          a.key === "ArrowDown" ? (a.preventDefault(), f((c) => c === -1 ? q.length > 0 ? 0 : -1 : Math.min(c + 1, q.length - 1))) : (a.preventDefault(), f((c) => c === 0 || c === -1 ? -1 : Math.max(c - 1, 0)));
          break;
        case "ArrowLeft":
          u === "" && z.length > 0 && (a.preventDefault(), v === -1 ? D(z.length - 1) : v > 0 && D(v - 1), s(false));
          break;
        case "ArrowRight":
          v >= 0 && (a.preventDefault(), v < z.length - 1 ? D(v + 1) : D(-1));
          break;
        case "Enter":
          if (l && b >= 0 && q[b])
            a.preventDefault(), fe(q[b]);
          else if (v >= 0) {
            a.preventDefault();
            const c = z[v];
            if (c?.type === "value" && !c.isPending && c.expressionIndex >= 0) {
              const y = e[c.expressionIndex];
              if (y) {
                const k = y.condition.field.key, h = y.condition.operator.key;
                n.fields.find((I) => I.key === k)?.operators.find((I) => I.key === h)?.customInput ? (_(y.condition.field), F(y.condition.operator), J.current = i, r("editing-token"), p(v), D(-1), s(true), d("")) : (J.current = i, p(v), D(-1), s(false));
              }
            }
          } else i === "entering-value" ? (a.preventDefault(), he()) : i === "selecting-connector" && l && (a.preventDefault(), s(false));
          break;
        case "Escape":
          s(false);
          break;
        case "Tab":
          l && q.length > 0 && (b === -1 ? (a.preventDefault(), f(0)) : q[b] && (a.preventDefault(), fe(q[b])));
          break;
        case "Backspace":
          if (a.ctrlKey && z.length > 0)
            a.preventDefault(), o.clear(), r("idle"), d(""), _(void 0), F(void 0), D(-1), E(false), t([]), x("All filters cleared.");
          else if (v >= 0) {
            a.preventDefault();
            const c = z[v];
            if (c && c.expressionIndex >= 0) {
              const y = c.expressionIndex;
              if (c.type === "connector") {
                const k = e.map((h, T) => {
                  if (T === y && h.connector) {
                    const { connector: L, ...I } = h;
                    return I;
                  }
                  return h;
                });
                t(k), D(-1), x(`Connector removed from expression ${y + 1}.`);
              } else {
                const k = e.filter((h, T) => T !== y).map((h, T, L) => {
                  if (T === L.length - 1 && h.connector) {
                    const { connector: I, ...Q } = h;
                    return Q;
                  }
                  return h;
                });
                t(k), D(-1), x(`Filter expression ${y + 1} deleted.`), k.length === 0 ? (o.clear(), o.transition({ type: "FOCUS" }), r(o.getState()), d(""), _(void 0), F(void 0), s(true)) : (o.loadExpressions(k), r("selecting-connector"));
              }
            }
          } else u === "" && i === "entering-value" ? (o.transition({ type: "DELETE_LAST" }), r(o.getState()), F(void 0), s(true), x("Operator removed. Select operator.")) : u === "" && (i === "idle" || i === "selecting-field" || i === "selecting-connector") && e.length > 0 && (a.preventDefault(), D(z.length - 1), s(false), x("Selected last filter expression. Press Backspace or Delete to remove."));
          break;
        case "Delete":
          if (v >= 0) {
            a.preventDefault();
            const c = z[v];
            if (c && c.expressionIndex >= 0) {
              const y = c.expressionIndex;
              if (c.type === "connector") {
                const k = e.map((h, T) => {
                  if (T === y && h.connector) {
                    const { connector: L, ...I } = h;
                    return I;
                  }
                  return h;
                });
                t(k), D(-1), x(`Connector removed from expression ${y + 1}.`);
              } else {
                const k = e.filter((h, T) => T !== y).map((h, T, L) => {
                  if (T === L.length - 1 && h.connector) {
                    const { connector: I, ...Q } = h;
                    return Q;
                  }
                  return h;
                });
                t(k), D(-1), x(`Filter expression ${y + 1} deleted.`), k.length === 0 ? (o.clear(), o.transition({ type: "FOCUS" }), r(o.getState()), d(""), _(void 0), F(void 0), s(true)) : (o.loadExpressions(k), r("selecting-connector"));
              }
            }
          }
          break;
        case "a":
          a.ctrlKey && z.length > 0 && (a.preventDefault(), E(true));
          break;
        case "z":
          if (a.ctrlKey && !a.shiftKey)
            if (a.preventDefault(), j.current.length > 0) {
              oe.current.push(JSON.parse(JSON.stringify(e)));
              const c = j.current.pop();
              ce.current = true, t(c), d(""), _(void 0), F(void 0), D(-1), E(false), s(false), c.length === 0 ? (o.clear(), r("idle")) : (o.loadExpressions(c), r("selecting-connector")), x(
                c.length === 0 ? "Undone. All filters cleared." : `Undone. ${c.length} filter${c.length !== 1 ? "s" : ""} remaining.`
              );
            } else
              x("Nothing to undo.");
          else if (a.ctrlKey && a.shiftKey)
            if (a.preventDefault(), oe.current.length > 0) {
              j.current.push(e);
              const c = oe.current.pop();
              ce.current = true, t(c), d(""), _(void 0), F(void 0), D(-1), E(false), s(false), c.length === 0 ? (o.clear(), r("idle")) : (o.loadExpressions(c), r("selecting-connector")), x(
                c.length === 0 ? "Redone. All filters cleared." : `Redone. ${c.length} filter${c.length !== 1 ? "s" : ""} restored.`
              );
            } else
              x("Nothing to redo.");
          break;
        case "c":
          if (a.ctrlKey && (a.preventDefault(), v >= 0 || N)) {
            let c;
            if (N)
              c = e;
            else {
              const y = z[v];
              y && y.expressionIndex >= 0 ? c = [e[y.expressionIndex]] : c = [];
            }
            if (c.length > 0) {
              const y = ft(c, n), k = JSON.stringify(y, null, 2);
              navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(k).then(
                () => {
                  x(
                    `Copied ${c.length} expression${c.length !== 1 ? "s" : ""} to clipboard.`
                  );
                },
                () => {
                  x("Failed to copy to clipboard.");
                }
              ) : x("Clipboard not supported.");
            }
          }
          break;
        case "v":
          a.ctrlKey && (a.preventDefault(), navigator.clipboard && navigator.clipboard.readText ? navigator.clipboard.readText().then(
            (c) => {
              try {
                const y = JSON.parse(c);
                if (!Array.isArray(y)) {
                  x("Invalid clipboard data.");
                  return;
                }
                const k = pt(y, n);
                if (k.length === 0) {
                  x("No valid expressions to paste.");
                  return;
                }
                const h = [...e];
                if (h.length > 0) {
                  const T = h[h.length - 1];
                  T.connector || (h[h.length - 1] = {
                    ...T,
                    connector: "AND"
                  });
                }
                k.forEach((T, L) => {
                  if (L === k.length - 1 && T.connector) {
                    const { connector: I, ...Q } = T;
                    h.push(Q);
                  } else
                    h.push(T);
                }), t(h), d(""), _(void 0), F(void 0), D(-1), E(!1), o.loadExpressions(h), r("selecting-connector"), x(
                  `Pasted ${k.length} expression${k.length !== 1 ? "s" : ""}.`
                );
              } catch {
                x("Invalid clipboard data format.");
              }
            },
            () => {
              x("Failed to read from clipboard.");
            }
          ) : x("Clipboard not supported."));
          break;
        case "y":
          if (a.ctrlKey)
            if (a.preventDefault(), oe.current.length > 0) {
              j.current.push(e);
              const c = oe.current.pop();
              ce.current = true, t(c), d(""), _(void 0), F(void 0), D(-1), E(false), s(false), c.length === 0 ? (o.clear(), r("idle")) : (o.loadExpressions(c), r("selecting-connector")), x(
                c.length === 0 ? "Redone. All filters cleared." : `Redone. ${c.length} filter${c.length !== 1 ? "s" : ""} restored.`
              );
            } else
              x("Nothing to redo.");
          break;
      }
    },
    // Note: handleConnectorEdit, handleFieldEdit, and handleOperatorEdit are intentionally
    // omitted to avoid circular dependencies since they're defined later
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      q,
      b,
      l,
      i,
      u,
      z,
      v,
      N,
      e,
      t,
      fe,
      he,
      o,
      n
    ]
  ), ve = reactExports.useCallback(() => {
    o.clear(), r("idle"), d(""), _(void 0), F(void 0), p(-1), t([]), x("All filters cleared.");
  }, [o, t]), pe = reactExports.useCallback(
    (a) => {
      const c = z[a];
      if (c?.type === "value" && c.expressionIndex >= 0) {
        const y = e[c.expressionIndex];
        if (!y) return;
        const k = y.condition.field.key, h = y.condition.operator.key;
        n.fields.find((I) => I.key === k)?.operators.find((I) => I.key === h)?.customInput ? (_(y.condition.field), F(y.condition.operator), J.current = i, r("editing-token"), p(a), s(true), d("")) : (J.current = i, p(a), s(false));
      }
    },
    [z, e, n, i]
  ), Ie = reactExports.useCallback(
    (a) => {
      const c = z[a];
      c && !c.isPending && c.expressionIndex >= 0 && (ae.current = true, D(a), s(false), E(false));
    },
    [z]
  ), Le = reactExports.useCallback(
    (a) => {
      if (m < 0) return;
      const c = z[m];
      if (!c || c.type !== "value") return;
      const y = c.expressionIndex;
      if (y < 0 || y >= e.length) return;
      const k = e.map((h, T) => T === y ? {
        ...h,
        condition: {
          ...h.condition,
          value: a
        }
      } : h);
      p(-1), r("selecting-connector"), s(true), J.current = null, t(k);
    },
    [m, z, e, t]
  ), we = reactExports.useCallback(() => {
    p(-1), J.current !== null && (r(J.current), J.current = null);
  }, []), ge = reactExports.useCallback(
    (a) => {
      a < 0 || a >= e.length || (g(a), s(true), f(-1), D(-1), x("Select a new operator"));
    },
    [e.length]
  ), Re = reactExports.useCallback(() => {
    g(-1), s(false);
  }, []), be = reactExports.useCallback(
    (a) => {
      a < 0 || a >= e.length || (K(a), s(true), f(-1), D(-1), x("Select a new field"));
    },
    [e.length]
  ), xe = reactExports.useCallback(() => {
    K(-1), s(false);
  }, []), Z = reactExports.useCallback(
    (a) => {
      a < 0 || a >= e.length || e[a]?.connector && (O(a), s(true), f(-1), D(-1), x("Select a new connector"));
    },
    [e]
  ), G = reactExports.useCallback(() => {
    O(-1), s(false);
  }, []), ie = reactExports.useCallback(
    (a) => {
      if (a < 0 || a >= e.length) return;
      const c = e.filter((y, k) => k !== a).map((y, k, h) => {
        if (k === h.length - 1 && y.connector) {
          const { connector: T, ...L } = y;
          return L;
        }
        return y;
      });
      t(c), D(-1), x(`Filter expression ${a + 1} deleted.`), c.length === 0 ? (o.clear(), o.transition({ type: "FOCUS" }), r(o.getState()), d(""), _(void 0), F(void 0), s(true)) : (o.loadExpressions(c), r("selecting-connector"));
    },
    [e, t, o]
  );
  return {
    state: i,
    tokens: z,
    isDropdownOpen: l,
    suggestions: q,
    highlightedIndex: b,
    inputValue: u,
    placeholder: Ce,
    announcement: R,
    editingTokenIndex: m,
    selectedTokenIndex: v,
    allTokensSelected: N,
    editingOperatorIndex: P,
    editingConnectorIndex: w,
    editingFieldIndex: M,
    activeCustomWidget: te,
    customWidgetInitialValue: ye,
    currentFieldConfig: ne,
    currentOperatorConfig: re,
    handleFocus: _e,
    handleBlur: Te,
    handleInputChange: Ne,
    handleKeyDown: $e,
    handleSelect: fe,
    handleHighlight: Fe,
    handleConfirmValue: he,
    handleClear: ve,
    handleTokenEdit: pe,
    handleTokenSelect: Ie,
    handleTokenEditComplete: Le,
    handleTokenEditCancel: we,
    handleOperatorEdit: ge,
    handleOperatorEditCancel: Re,
    handleFieldEdit: be,
    handleFieldEditCancel: xe,
    handleConnectorEdit: Z,
    handleConnectorEditCancel: G,
    handleCustomWidgetConfirm: Ae,
    handleCustomWidgetCancel: Oe,
    handleExpressionDelete: ie
  };
}
const vt = 0, wt = 8;
function xt({
  anchorRef: n,
  isOpen: e,
  dropdownHeight: t = 300,
  offset: o = vt,
  minWidth: i = 0,
  viewportPadding: r = wt
}) {
  const [l, s] = reactExports.useState({
    top: 0,
    left: 0,
    width: 0
  }), [u, d] = reactExports.useState("bottom"), [b, f] = reactExports.useState(300), m = reactExports.useCallback(() => {
    const p = n.current;
    if (!p)
      return;
    const v = p.getBoundingClientRect(), D = window.innerHeight, N = window.innerWidth, E = D - v.bottom - r, C = v.top - r;
    let _ = "bottom", V;
    E >= t ? (_ = "bottom", V = v.bottom + o) : C >= t || C > E ? (_ = "top", V = v.top - t - o) : (_ = "bottom", V = v.bottom + o);
    let F = Math.max(v.width, i), R = v.left;
    R < r && (R = r), R + F > N - r && (R = N - r - F, R < r && (R = r, F = N - 2 * r));
    const x = _ === "bottom" ? D - v.bottom - r - o : v.top - r - o;
    s({ top: V, left: R, width: F }), d(_), f(Math.max(0, x));
  }, [n, t, o, i, r]);
  return reactExports.useEffect(() => {
    if (!e)
      return;
    m();
    const p = () => {
      m();
    };
    return window.addEventListener("scroll", p, true), window.addEventListener("resize", p), () => {
      window.removeEventListener("scroll", p, true), window.removeEventListener("resize", p);
    };
  }, [e, m]), {
    position: l,
    placement: u,
    maxHeight: b,
    updatePosition: m
  };
}
const ue = "data-filter-box-portal";
function Et({ children: n, container: e, portalId: t }) {
  const [o, i] = reactExports.useState(null);
  return reactExports.useLayoutEffect(() => {
    const r = document.createElement("div");
    r.className = "dropdown-portal", r.setAttribute(ue, t ?? "true");
    const l = e ?? document.body;
    return l.appendChild(r), i(r), () => {
      l.removeChild(r);
    };
  }, [e, t]), o ? reactDomExports.createPortal(n, o) : null;
}
function St({
  isDropdownOpen: n,
  isEditing: e,
  inputRef: t,
  containerRef: o,
  portalId: i,
  hasActiveCustomWidget: r = false
}) {
  const l = reactExports.useRef(null), s = reactExports.useRef(null), u = reactExports.useCallback(
    (p) => {
      if (!p || !(p instanceof HTMLElement)) return false;
      const v = p.closest(`[${ue}]`);
      return v ? i ? v.getAttribute(ue) === i : true : false;
    },
    [i]
  ), d = reactExports.useCallback(() => {
    const p = document.activeElement;
    p instanceof HTMLElement && !o.current?.contains(p) && (l.current = p);
  }, [o]), b = reactExports.useCallback(() => {
    l.current && typeof l.current.focus == "function" && requestAnimationFrame(() => {
      l.current?.focus(), l.current = null;
    });
  }, []), f = reactExports.useCallback(() => {
    t.current && t.current.focus();
  }, [t]), m = reactExports.useCallback(() => {
    const p = document.activeElement, v = o.current;
    return v ? v.contains(p) || u(p) : false;
  }, [o, u]);
  return reactExports.useEffect(() => {
    if (!n && !e)
      return;
    const p = o.current;
    if (!p) return;
    const v = (D) => {
      const N = D.relatedTarget;
      if (N && !p.contains(N)) {
        if (u(N))
          return;
        D.target instanceof HTMLElement && (s.current = D.target), n && !r && t.current && requestAnimationFrame(() => {
          const E = document.activeElement;
          !p.contains(E) && !u(E) && t.current?.focus();
        });
      }
    };
    return p.addEventListener("focusout", v), () => {
      p.removeEventListener("focusout", v);
    };
  }, [
    n,
    e,
    o,
    t,
    u,
    r
  ]), reactExports.useEffect(() => {
    !n && !e && t.current && o.current?.contains(document.activeElement) && t.current.focus();
  }, [n, e, t, o]), {
    storeFocusOrigin: d,
    restoreFocus: b,
    focusInput: f,
    isFocusWithin: m
  };
}
function Dt({
  itemCount: n,
  itemHeight: e,
  containerHeight: t,
  overscan: o = 3,
  highlightedIndex: i
}) {
  const [r, l] = reactExports.useState(0), s = reactExports.useRef(null), u = n * e, { startIndex: d, endIndex: b, offsetTop: f } = reactExports.useMemo(() => {
    const N = Math.floor(r / e), E = Math.ceil(t / e), C = N + E, _ = Math.max(0, N - o), V = Math.min(n, C + o);
    return {
      startIndex: _,
      endIndex: V,
      offsetTop: _ * e
    };
  }, [r, e, t, n, o]), m = reactExports.useMemo(() => {
    const N = [];
    for (let E = d; E < b; E++)
      N.push({
        index: E,
        start: E * e,
        size: e
      });
    return N;
  }, [d, b, e]), p = reactExports.useCallback((N) => {
    l(N);
  }, []), v = reactExports.useCallback((N) => {
    s.current = N;
  }, []), D = reactExports.useCallback(
    (N, E = "auto") => {
      const C = s.current;
      if (!C) return;
      const _ = N * e, V = _ + e, F = C.scrollTop, R = F + t;
      if (_ >= F && V <= R)
        return;
      let x;
      _ < F ? x = _ : x = V - t, C.scrollTo({
        top: x,
        behavior: E
      });
    },
    [e, t]
  );
  return reactExports.useEffect(() => {
    i !== void 0 && i >= 0 && D(i, "smooth");
  }, [i, D]), {
    totalHeight: u,
    startIndex: d,
    endIndex: b,
    offsetTop: f,
    virtualItems: m,
    onScroll: p,
    scrollTop: r,
    scrollContainerRef: v,
    scrollToIndex: D
  };
}
const Ke = reactExports.memo(function({
  item: e,
  isHighlighted: t,
  isDisabled: o
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: X("autocomplete-item__content", {
        "autocomplete-item__content--highlighted": t,
        "autocomplete-item__content--disabled": o
      }),
      children: [
        e.icon && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "autocomplete-item__icon", children: e.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "autocomplete-item__text", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "autocomplete-item__label", children: e.label }),
          e.description && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "autocomplete-item__description", children: e.description })
        ] })
      ]
    }
  );
});
function Ct({
  id: n,
  isOpen: e,
  items: t,
  highlightedIndex: o,
  onSelect: i,
  onHighlight: r,
  position: l,
  maxHeight: s = 300,
  renderItem: u,
  emptyMessage: d = "No results found",
  loadingMessage: b = "Loading...",
  isLoading: f = false,
  className: m,
  virtualScrolling: p = "auto",
  itemHeight: v = 40
}) {
  const D = reactExports.useRef(null), N = p === true || p === "auto" && t.length > 100, E = t.some((g) => g.group !== void 0), C = N && !E, _ = Dt({
    itemCount: t.length,
    itemHeight: v,
    containerHeight: s,
    overscan: 3,
    highlightedIndex: o
  }), V = reactExports.useCallback(
    (g) => {
      C && _.onScroll(g.currentTarget.scrollTop);
    },
    [C, _]
  );
  if (!e)
    return null;
  const F = l ? {
    position: "absolute",
    top: l.top,
    left: l.left,
    width: l.width,
    maxHeight: s
  } : { maxHeight: s }, R = (g, w) => {
    w.stopPropagation(), w.preventDefault(), g.disabled || i(g);
  }, x = (g) => {
    g.preventDefault();
  };
  if (f)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "ul",
      {
        id: n,
        role: "listbox",
        "aria-label": "Suggestions",
        className: X("autocomplete-dropdown", m),
        style: F,
        onMouseDown: x,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "autocomplete-dropdown__message", children: b })
      }
    );
  if (t.length === 0)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "ul",
      {
        id: n,
        role: "listbox",
        "aria-label": "Suggestions",
        className: X("autocomplete-dropdown", m),
        style: F,
        onMouseDown: x,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "autocomplete-dropdown__message", children: d })
      }
    );
  if (C)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "ul",
      {
        id: n,
        ref: (g) => {
          _.scrollContainerRef(g), D.current !== g && (D.current = g);
        },
        role: "listbox",
        "aria-label": "Suggestions",
        className: X("autocomplete-dropdown", "autocomplete-dropdown--virtual", m),
        style: F,
        onMouseDown: x,
        onScroll: V,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "li",
          {
            className: "autocomplete-dropdown__virtual-spacer",
            style: { height: _.totalHeight, position: "relative" },
            "aria-hidden": "true",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "ul",
              {
                className: "autocomplete-dropdown__virtual-items",
                style: {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  transform: `translateY(${_.offsetTop}px)`
                },
                children: _.virtualItems.map(({ index: g }) => {
                  const w = t[g], O = g === o, M = w.disabled ?? false;
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "li",
                    {
                      role: "option",
                      "aria-selected": O,
                      "aria-disabled": M,
                      className: X("autocomplete-item", {
                        "autocomplete-item--highlighted": O,
                        "autocomplete-item--disabled": M
                      }),
                      style: { height: v },
                      onClick: (K) => R(w, K),
                      onMouseEnter: () => r(g),
                      children: u ? u(w, O) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Ke,
                        {
                          item: w,
                          isHighlighted: O,
                          isDisabled: M
                        }
                      )
                    },
                    w.key
                  );
                })
              }
            )
          }
        )
      }
    );
  const P = t.reduce((g, w, O) => {
    const M = w.group, K = g.find(($) => $.group === M);
    return K ? K.items.push({ item: w, originalIndex: O }) : g.push({ group: M, items: [{ item: w, originalIndex: O }] }), g;
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "ul",
    {
      id: n,
      role: "listbox",
      "aria-label": "Suggestions",
      className: X("autocomplete-dropdown", m),
      style: F,
      onMouseDown: x,
      children: P.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "autocomplete-group", children: [
        g.group && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "autocomplete-group__header", role: "presentation", children: g.group }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "autocomplete-group__items", role: "group", children: g.items.map(({ item: w, originalIndex: O }) => {
          const M = O === o, K = w.disabled ?? false;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "li",
            {
              role: "option",
              "aria-selected": M,
              "aria-disabled": K,
              className: X("autocomplete-item", {
                "autocomplete-item--highlighted": M,
                "autocomplete-item--disabled": K
              }),
              onClick: ($) => R(w, $),
              onMouseEnter: () => r(O),
              children: u ? u(w, M) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                Ke,
                {
                  item: w,
                  isHighlighted: M,
                  isDisabled: K
                }
              )
            },
            w.key
          );
        }) })
      ] }, g.group ?? "__ungrouped"))
    }
  );
}
function Je({
  children: n,
  politeness: e = "polite",
  className: t,
  ...o
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      role: e === "assertive" ? "alert" : "status",
      "aria-live": e,
      "aria-atomic": "true",
      className: X("sr-only", t),
      ...o,
      children: n
    }
  );
}
function _t(n, e, t) {
  const o = [], { condition: i } = n, { field: r, operator: l, value: s } = i, u = e.fields.find((f) => f.key === r.key);
  if (!u)
    return o.push({
      type: "field",
      message: `Field "${r.key}" not found in schema`,
      expressionIndex: t,
      field: r.key
    }), { valid: false, errors: o };
  const d = u.operators.find((f) => f.key === l.key);
  if (d || o.push({
    type: "operator",
    message: `Operator "${l.key}" is not valid for field "${r.key}"`,
    expressionIndex: t,
    field: r.key
  }), d?.multiValue) {
    const f = Ft(
      s.raw,
      d.multiValue.count,
      r.key,
      l.key,
      t
    );
    o.push(...f.errors);
  }
  if (u.validate) {
    const f = {
      field: u,
      operator: d ?? { key: l.key, label: l.label },
      expressions: [],
      // Single expression context
      schema: e
    }, m = u.validate(s, f);
    if (!m.valid && m.errors) {
      const p = m.errors.map((v) => ({
        ...v,
        expressionIndex: t,
        field: r.key
      }));
      o.push(...p);
    }
  }
  return u.valueRequired !== false && Nt(s.raw) && !d?.multiValue && o.push({
    type: "value",
    message: `Value is required for field "${r.key}"`,
    expressionIndex: t,
    field: r.key
  }), {
    valid: o.length === 0,
    errors: o
  };
}
function Tt(n, e) {
  const t = [];
  e.maxExpressions !== void 0 && n.length > e.maxExpressions && t.push({
    type: "schema",
    message: `Maximum of ${e.maxExpressions} expressions allowed, but ${n.length} provided`
  });
  const o = /* @__PURE__ */ new Map();
  for (let i = 0; i < n.length; i++) {
    const r = n[i];
    if (!r) continue;
    const l = _t(r, e, i);
    t.push(...l.errors);
    const s = r.condition.field.key;
    o.has(s) || o.set(s, []), o.get(s)?.push(i);
  }
  for (const i of e.fields)
    if (i.allowMultiple === false) {
      const r = o.get(i.key);
      r && r.length > 1 && t.push({
        type: "field",
        message: `Field "${i.label}" can only be used once, but appears ${r.length} times`,
        field: i.key,
        expressionIndex: r[1]
        // Mark the second occurrence
      });
    }
  if (e.validate) {
    const i = e.validate(n);
    !i.valid && i.errors && t.push(...i.errors);
  }
  return {
    valid: t.length === 0,
    errors: t
  };
}
function Nt(n) {
  return n == null ? true : typeof n == "string" ? n.trim() === "" : Array.isArray(n) ? n.length === 0 : false;
}
function Ft(n, e, t, o, i) {
  const r = [];
  return Array.isArray(n) ? (e === -1 ? n.length === 0 && r.push({
    type: "value",
    message: `Operator "${o}" on field "${t}" requires at least one value`,
    expressionIndex: i,
    field: t
  }) : n.length !== e && r.push({
    type: "value",
    message: `Operator "${o}" on field "${t}" requires exactly ${e} values, but got ${n.length}`,
    expressionIndex: i,
    field: t
  }), {
    valid: r.length === 0,
    errors: r
  }) : (r.push({
    type: "value",
    message: `Value for "${o}" operator on field "${t}" must be an array`,
    expressionIndex: i,
    field: t
  }), { valid: false, errors: r });
}
const mn = reactExports.forwardRef(function({
  schema: e,
  value: t = [],
  onChange: o,
  className: i,
  id: r,
  disabled: l = false,
  "aria-label": s,
  usePortal: u = true,
  autoFocus: d = false,
  showClearButton: b = true,
  onError: f,
  skipToId: m,
  skipLinkText: p = "Skip to content",
  fullWidth: v = true
}, D) {
  const N = reactExports.useRef(null), E = reactExports.useRef(null), C = reactExports.useId(), _ = r ? `${r}-dropdown` : `${C}-dropdown`, [V, F] = reactExports.useState(""), R = reactExports.useMemo(() => t.length === 0 ? { valid: true, errors: [] } : Tt(t, e), [t, e]);
  reactExports.useEffect(() => {
    f && !R.valid && R.errors.length > 0 && f(R.errors);
  }, [R, f]), reactExports.useEffect(() => {
    if (!R.valid && R.errors.length > 0) {
      const Z = R.errors.length, G = R.errors.map((a) => a.message).slice(0, 3).join(". "), ie = Z === 1 ? `Validation error: ${G}` : `${Z} validation errors. ${G}${Z > 3 ? "..." : ""}`;
      F(ie);
    } else
      F("");
  }, [R]);
  const {
    state: x,
    tokens: P,
    isDropdownOpen: g,
    suggestions: w,
    highlightedIndex: O,
    inputValue: M,
    placeholder: K,
    announcement: $,
    editingTokenIndex: U,
    selectedTokenIndex: J,
    allTokensSelected: ae,
    activeCustomWidget: j,
    customWidgetInitialValue: oe,
    currentFieldConfig: ce,
    currentOperatorConfig: de,
    handleFocus: z,
    handleBlur: q,
    handleInputChange: Ce,
    handleKeyDown: ne,
    handleSelect: re,
    handleHighlight: te,
    handleClear: ye,
    handleTokenEdit: _e,
    handleTokenSelect: Te,
    handleTokenEditComplete: Ne,
    handleTokenEditCancel: Fe,
    handleOperatorEdit: fe,
    handleConnectorEdit: he,
    handleCustomWidgetConfirm: Ae,
    handleCustomWidgetCancel: Oe,
    handleExpressionDelete: $e
  } = kt({ schema: e, value: t, onChange: o }), ve = `${C}-portal`, { focusInput: pe } = St({
    isDropdownOpen: g,
    isEditing: U >= 0,
    inputRef: E,
    containerRef: N,
    portalId: ve,
    hasActiveCustomWidget: !!j
  }), Ie = reactExports.useCallback(
    (Z) => {
      const G = Z?.relatedTarget;
      if (G) {
        if (G.closest(`[${ue}]`) || N.current?.contains(G))
          return;
      } else {
        setTimeout(() => {
          const ie = document.activeElement;
          N.current?.contains(ie) || ie?.closest(`[${ue}]`) || q();
        }, 0);
        return;
      }
      q();
    },
    [q]
  ), Le = reactExports.useCallback(
    (Z) => {
      const G = Z.relatedTarget;
      if (!G) {
        setTimeout(() => {
          const a = document.activeElement;
          N.current?.contains(a) || a?.closest(`[${ue}]`) || q();
        }, 0);
        return;
      }
      G.closest(`[${ue}]`) || N.current?.contains(G) || q();
    },
    [q]
  );
  reactExports.useImperativeHandle(
    D,
    () => ({
      focus: () => {
        pe();
      },
      blur: () => {
        E.current?.blur();
      },
      clear: () => {
        ye();
      }
    }),
    [ye, pe]
  ), reactExports.useEffect(() => {
    d && !l && E.current?.focus();
  }, [d, l]);
  const we = reactExports.useRef(U);
  reactExports.useEffect(() => {
    const Z = we.current;
    if (we.current = U, Z >= 0 && U === -1 && x === "selecting-connector") {
      const G = setTimeout(() => {
        pe();
      }, 0);
      return () => clearTimeout(G);
    }
  }, [U, x, pe]);
  const { position: ge, maxHeight: Re } = xt({
    anchorRef: N,
    isOpen: (g || !!j) && !l,
    dropdownHeight: 300,
    offset: 4
  }), be = j ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "filter-box__custom-widget", children: j.render({
    onConfirm: Ae,
    onCancel: Oe,
    initialValue: oe,
    fieldConfig: ce,
    operatorConfig: de
  }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
    Ct,
    {
      id: _,
      items: w,
      isOpen: g && !l,
      highlightedIndex: O,
      onSelect: re,
      onHighlight: te,
      maxHeight: Re
    }
  ), xe = (g || !!j) && !l;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref: N,
      className: X("filter-box", i),
      "data-disabled": l || void 0,
      role: "group",
      "aria-label": s ?? "Filter expression builder",
      "aria-describedby": P.length > 0 ? `${C}-status` : void 0,
      onBlur: Le,
      children: [
        m && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `#${m}`, className: "filter-box__skip-link", children: p }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Je, { children: $ }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Je, { politeness: "assertive", children: V }),
        P.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: `${C}-status`, className: "sr-only", children: `${Math.ceil(P.length / 4)} filter expression${Math.ceil(P.length / 4) !== 1 ? "s" : ""} applied` }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "filter-box__content", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ut,
            {
              tokens: P,
              inputRef: E,
              inputValue: M,
              placeholder: K,
              onInputChange: Ce,
              onInputFocus: z,
              onInputBlur: Ie,
              onInputKeyDown: ne,
              onTokenClick: _e,
              onTokenSelect: Te,
              onOperatorClick: fe,
              onConnectorClick: he,
              editingTokenIndex: U,
              selectedTokenIndex: J,
              allTokensSelected: ae,
              onTokenEditComplete: Ne,
              onTokenEditCancel: Fe,
              onExpressionDelete: $e,
              disabled: l,
              fullWidth: v,
              inputProps: {
                "aria-autocomplete": "list",
                "aria-controls": g ? _ : void 0,
                "aria-expanded": g,
                "aria-label": s,
                "aria-activedescendant": g && w[O] ? `${_}-item-${O}` : void 0
              }
            }
          ),
          b && P.length > 0 && !l && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "filter-box__clear-button",
              onClick: ye,
              "aria-label": "Clear all filters",
              children: "×"
            }
          )
        ] }),
        u ? /* @__PURE__ */ jsxRuntimeExports.jsx(Et, { portalId: ve, children: xe && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "filter-box-dropdown-portal",
            style: {
              position: "fixed",
              top: ge.top,
              left: ge.left,
              width: ge.width,
              zIndex: 9999
            },
            children: be
          }
        ) }) : (xe || g) && be
      ]
    }
  );
});
function vn(n, e = {}) {
  const { searchable: t = true } = e, o = n.map((i) => ({
    type: "value",
    key: i.key,
    label: i.label,
    description: i.description
  }));
  return {
    getSuggestions: (i) => {
      const { inputValue: r } = i;
      if (!t || !r)
        return o;
      const l = r.toLowerCase();
      return o.filter(
        (s) => s.label.toLowerCase().includes(l) || (s.description?.toLowerCase().includes(l) ?? false)
      );
    }
  };
}
function wn(n, e = {}) {
  const { debounceMs: t = 300, minChars: o = 1, cacheResults: i = true } = e, r = /* @__PURE__ */ new Map();
  let l = null, s = null, u = "";
  return {
    getSuggestions: async (d) => {
      const { inputValue: b } = d;
      if (l && (clearTimeout(l), l = null), s && (s.abort(), s = null), b.length < o)
        return [];
      if (i && r.has(b))
        return r.get(b);
      const f = new AbortController();
      if (s = f, t > 0 && b !== u)
        return new Promise((m, p) => {
          l = setTimeout(async () => {
            u = b;
            try {
              const v = await n(b, d, f.signal);
              i && r.set(b, v), m(v);
            } catch (v) {
              v instanceof DOMException && v.name === "AbortError" ? m([]) : p(v);
            }
          }, t);
        });
      u = b;
      try {
        const m = await n(b, d, f.signal);
        return i && r.set(b, m), m;
      } catch (m) {
        if (m instanceof DOMException && m.name === "AbortError")
          return [];
        throw m;
      }
    }
  };
}
reactExports.createContext(void 0);

___$insertStylesToHeader("@charset \"UTF-8\";\n.react-datepicker__navigation-icon::before, .react-datepicker__year-read-view--down-arrow,\n.react-datepicker__month-read-view--down-arrow,\n.react-datepicker__month-year-read-view--down-arrow {\n  border-color: #ccc;\n  border-style: solid;\n  border-width: 3px 3px 0 0;\n  content: \"\";\n  display: block;\n  height: 9px;\n  position: absolute;\n  top: 6px;\n  width: 9px;\n}\n\n.react-datepicker__sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip-path: inset(50%);\n  white-space: nowrap;\n  border: 0;\n}\n\n.react-datepicker-wrapper {\n  display: inline-block;\n  padding: 0;\n  border: 0;\n}\n\n.react-datepicker {\n  font-family: \"Helvetica Neue\", helvetica, arial, sans-serif;\n  font-size: 0.8rem;\n  background-color: #fff;\n  color: #000;\n  border: 1px solid #aeaeae;\n  border-radius: 0.3rem;\n  display: inline-block;\n  position: relative;\n  line-height: initial;\n}\n\n.react-datepicker--time-only .react-datepicker__time-container {\n  border-left: 0;\n}\n\n.react-datepicker--time-only .react-datepicker__time,\n.react-datepicker--time-only .react-datepicker__time-box {\n  border-bottom-left-radius: 0.375em;\n  border-bottom-right-radius: 0.375em;\n}\n\n.react-datepicker-popper {\n  z-index: 1;\n  line-height: 0;\n}\n\n.react-datepicker-popper .react-datepicker__triangle {\n  stroke: #aeaeae;\n}\n\n.react-datepicker-popper[data-placement^=bottom] .react-datepicker__triangle {\n  fill: #f0f0f0;\n  color: #f0f0f0;\n}\n\n.react-datepicker-popper[data-placement^=top] .react-datepicker__triangle {\n  fill: #fff;\n  color: #fff;\n}\n\n.react-datepicker-popper--header-middle[data-placement^=bottom] .react-datepicker__triangle, .react-datepicker-popper--header-bottom[data-placement^=bottom] .react-datepicker__triangle {\n  fill: #fff;\n  color: #fff;\n}\n\n.react-datepicker-popper--header-bottom[data-placement^=top] .react-datepicker__triangle {\n  fill: #f0f0f0;\n  color: #f0f0f0;\n}\n\n.react-datepicker__header {\n  text-align: center;\n  background-color: #f0f0f0;\n  border-bottom: 1px solid #aeaeae;\n  border-top-left-radius: 0.3rem;\n  padding: 8px 0;\n  position: relative;\n}\n\n.react-datepicker__header--time {\n  padding-bottom: 8px;\n  padding-left: 5px;\n  padding-right: 5px;\n}\n\n.react-datepicker__header--time:not(.react-datepicker__header--time--only) {\n  border-top-left-radius: 0;\n}\n\n.react-datepicker__header:not(.react-datepicker__header--has-time-select, .react-datepicker__header--middle, .react-datepicker__header--bottom) {\n  border-top-right-radius: 0.3rem;\n}\n\n.react-datepicker__header--middle {\n  border-top: 1px solid #aeaeae;\n  border-radius: 0;\n  margin-top: 4px;\n}\n\n.react-datepicker__header--bottom {\n  border-bottom: none;\n  border-top: 1px solid #aeaeae;\n  border-radius: 0 0 0.3rem 0.3rem;\n}\n\n.react-datepicker__header-wrapper {\n  position: relative;\n}\n\n.react-datepicker__header-wrapper .react-datepicker__navigation--next--with-time:not(.react-datepicker__navigation--next--with-today-button) {\n  right: 2px;\n}\n\n.react-datepicker__year-dropdown-container--select,\n.react-datepicker__month-dropdown-container--select,\n.react-datepicker__month-year-dropdown-container--select,\n.react-datepicker__year-dropdown-container--scroll,\n.react-datepicker__month-dropdown-container--scroll,\n.react-datepicker__month-year-dropdown-container--scroll {\n  display: inline-block;\n  margin: 0 15px;\n}\n\n.react-datepicker__month-select,\n.react-datepicker__year-select,\n.react-datepicker__month-year-select {\n  background-color: transparent;\n  border: 1px solid #aeaeae;\n  border-radius: 0.3rem;\n  color: inherit;\n  cursor: pointer;\n  font-family: inherit;\n  font-size: inherit;\n  margin-top: 5px;\n  padding: 2px 5px;\n}\n\n.react-datepicker__month-select:focus-visible,\n.react-datepicker__year-select:focus-visible,\n.react-datepicker__month-year-select:focus-visible {\n  outline: auto 1px;\n}\n\n.react-datepicker__current-month,\n.react-datepicker-time__header,\n.react-datepicker-year-header {\n  margin-top: 0;\n  color: #000;\n  font-weight: bold;\n  font-size: 0.944rem;\n}\n\nh2.react-datepicker__current-month {\n  padding: 0;\n  margin: 0;\n}\n\n.react-datepicker-time__header {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n}\n\n.react-datepicker__navigation {\n  align-items: center;\n  background: none;\n  display: flex;\n  justify-content: center;\n  text-align: center;\n  cursor: pointer;\n  position: absolute;\n  top: 2px;\n  padding: 0;\n  border: none;\n  z-index: 1;\n  height: 32px;\n  width: 32px;\n  text-indent: -999em;\n  overflow: hidden;\n}\n\n.react-datepicker__navigation--previous {\n  left: 2px;\n}\n\n.react-datepicker__navigation--next {\n  right: 2px;\n}\n\n.react-datepicker__navigation--next--with-time:not(.react-datepicker__navigation--next--with-today-button) {\n  right: 85px;\n}\n\n.react-datepicker__navigation--years {\n  position: relative;\n  top: 0;\n  display: block;\n  margin-left: auto;\n  margin-right: auto;\n}\n\n.react-datepicker__navigation--years-previous {\n  top: 4px;\n}\n\n.react-datepicker__navigation--years-upcoming {\n  top: -4px;\n}\n\n.react-datepicker__navigation:hover *::before {\n  border-color: rgb(165.75, 165.75, 165.75);\n}\n\n.react-datepicker__navigation-icon {\n  position: relative;\n  top: -1px;\n  font-size: 20px;\n  width: 0;\n}\n\n.react-datepicker__navigation-icon--next {\n  left: -2px;\n}\n\n.react-datepicker__navigation-icon--next::before {\n  transform: rotate(45deg);\n  left: -7px;\n}\n\n.react-datepicker__navigation-icon--previous {\n  right: -2px;\n}\n\n.react-datepicker__navigation-icon--previous::before {\n  transform: rotate(225deg);\n  right: -7px;\n}\n\n.react-datepicker__month-container {\n  float: left;\n}\n\n.react-datepicker__year {\n  margin: 0.5em;\n  text-align: center;\n}\n\n.react-datepicker__year-wrapper {\n  display: flex;\n  flex-wrap: wrap;\n  max-width: 180px;\n}\n\n.react-datepicker__year .react-datepicker__year-text {\n  display: inline-block;\n  width: 5em;\n  margin: 2px;\n}\n\n.react-datepicker__month {\n  margin: 0.5em;\n  text-align: center;\n}\n\n.react-datepicker__month .react-datepicker__month-text,\n.react-datepicker__month .react-datepicker__quarter-text {\n  display: inline-block;\n  width: 5em;\n  margin: 2px;\n}\n\n.react-datepicker__input-time-container {\n  clear: both;\n  width: 100%;\n  float: left;\n  margin: 5px 0 10px 15px;\n  text-align: left;\n}\n\n.react-datepicker__input-time-container .react-datepicker-time__caption {\n  display: inline-block;\n}\n\n.react-datepicker__input-time-container .react-datepicker-time__input-container {\n  display: inline-block;\n}\n\n.react-datepicker__input-time-container .react-datepicker-time__input-container .react-datepicker-time__input {\n  display: inline-block;\n  margin-left: 10px;\n}\n\n.react-datepicker__input-time-container .react-datepicker-time__input-container .react-datepicker-time__input input {\n  width: auto;\n}\n\n.react-datepicker__input-time-container .react-datepicker-time__input-container .react-datepicker-time__input input[type=time]::-webkit-inner-spin-button,\n.react-datepicker__input-time-container .react-datepicker-time__input-container .react-datepicker-time__input input[type=time]::-webkit-outer-spin-button {\n  -webkit-appearance: none;\n  margin: 0;\n}\n\n.react-datepicker__input-time-container .react-datepicker-time__input-container .react-datepicker-time__input input[type=time] {\n  -moz-appearance: textfield;\n}\n\n.react-datepicker__input-time-container .react-datepicker-time__input-container .react-datepicker-time__delimiter {\n  margin-left: 5px;\n  display: inline-block;\n}\n\n.react-datepicker__time-container {\n  float: right;\n  border-left: 1px solid #aeaeae;\n  width: 85px;\n}\n\n.react-datepicker__time-container--with-today-button {\n  display: inline;\n  border: 1px solid #aeaeae;\n  border-radius: 0.375em;\n  position: absolute;\n  right: -87px;\n  top: 0;\n}\n\n.react-datepicker__time-container .react-datepicker__time {\n  position: relative;\n  background: white;\n  border-bottom-right-radius: 0.375em;\n}\n\n.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box {\n  width: 85px;\n  overflow-x: hidden;\n  margin: 0 auto;\n  text-align: center;\n  border-bottom-right-radius: 0.375em;\n}\n\n.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list {\n  list-style: none;\n  margin: 0;\n  height: calc(195px + 1.0625em);\n  overflow-y: scroll;\n  padding-right: 0;\n  padding-left: 0;\n  width: 100%;\n  box-sizing: content-box;\n}\n\n.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item {\n  height: 30px;\n  padding: 5px 10px;\n  white-space: nowrap;\n}\n\n.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item:hover {\n  cursor: pointer;\n  background-color: #f0f0f0;\n}\n\n.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected {\n  background-color: #216ba5;\n  color: white;\n  font-weight: bold;\n}\n\n.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected:hover {\n  background-color: #216ba5;\n}\n\n.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--disabled {\n  color: #ccc;\n}\n\n.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--disabled:hover {\n  cursor: default;\n  background-color: transparent;\n}\n\n.react-datepicker__week-number {\n  color: #ccc;\n  display: inline-block;\n  width: 2.125em;\n  line-height: 2.125em;\n  text-align: center;\n  margin: 0.208em;\n}\n\n.react-datepicker__week-number.react-datepicker__week-number--clickable {\n  cursor: pointer;\n}\n\n.react-datepicker__week-number.react-datepicker__week-number--clickable:not(.react-datepicker__week-number--selected):hover {\n  border-radius: 0.3rem;\n  background-color: #f0f0f0;\n}\n\n.react-datepicker__week-number--selected {\n  border-radius: 0.3rem;\n  background-color: #216ba5;\n  color: #fff;\n}\n\n.react-datepicker__week-number--selected:hover {\n  background-color: rgb(28.75, 93.2196969697, 143.75);\n}\n\n.react-datepicker__day-names {\n  text-align: center;\n  white-space: nowrap;\n  margin-bottom: -8px;\n}\n\n.react-datepicker__week {\n  white-space: nowrap;\n}\n\n.react-datepicker__day-name,\n.react-datepicker__day,\n.react-datepicker__time-name {\n  color: #000;\n  display: inline-block;\n  width: 2.125em;\n  line-height: 2.125em;\n  text-align: center;\n  margin: 0.208em;\n}\n\n.react-datepicker__day-name--disabled,\n.react-datepicker__day--disabled,\n.react-datepicker__time-name--disabled {\n  cursor: default;\n  color: #ccc;\n}\n\n.react-datepicker__day,\n.react-datepicker__month-text,\n.react-datepicker__quarter-text,\n.react-datepicker__year-text {\n  cursor: pointer;\n}\n\n.react-datepicker__day:not([aria-disabled=true]):hover,\n.react-datepicker__month-text:not([aria-disabled=true]):hover,\n.react-datepicker__quarter-text:not([aria-disabled=true]):hover,\n.react-datepicker__year-text:not([aria-disabled=true]):hover {\n  border-radius: 0.3rem;\n  background-color: #f0f0f0;\n}\n\n.react-datepicker__day--today,\n.react-datepicker__month-text--today,\n.react-datepicker__quarter-text--today,\n.react-datepicker__year-text--today {\n  font-weight: bold;\n}\n\n.react-datepicker__day--highlighted,\n.react-datepicker__month-text--highlighted,\n.react-datepicker__quarter-text--highlighted,\n.react-datepicker__year-text--highlighted {\n  border-radius: 0.3rem;\n  background-color: #3dcc4a;\n  color: #fff;\n}\n\n.react-datepicker__day--highlighted:not([aria-disabled=true]):hover,\n.react-datepicker__month-text--highlighted:not([aria-disabled=true]):hover,\n.react-datepicker__quarter-text--highlighted:not([aria-disabled=true]):hover,\n.react-datepicker__year-text--highlighted:not([aria-disabled=true]):hover {\n  background-color: rgb(49.8551020408, 189.6448979592, 62.5632653061);\n}\n\n.react-datepicker__day--highlighted-custom-1,\n.react-datepicker__month-text--highlighted-custom-1,\n.react-datepicker__quarter-text--highlighted-custom-1,\n.react-datepicker__year-text--highlighted-custom-1 {\n  color: magenta;\n}\n\n.react-datepicker__day--highlighted-custom-2,\n.react-datepicker__month-text--highlighted-custom-2,\n.react-datepicker__quarter-text--highlighted-custom-2,\n.react-datepicker__year-text--highlighted-custom-2 {\n  color: green;\n}\n\n.react-datepicker__day--holidays,\n.react-datepicker__month-text--holidays,\n.react-datepicker__quarter-text--holidays,\n.react-datepicker__year-text--holidays {\n  position: relative;\n  border-radius: 0.3rem;\n  background-color: #ff6803;\n  color: #fff;\n}\n\n.react-datepicker__day--holidays .overlay,\n.react-datepicker__month-text--holidays .overlay,\n.react-datepicker__quarter-text--holidays .overlay,\n.react-datepicker__year-text--holidays .overlay {\n  position: absolute;\n  bottom: 100%;\n  left: 50%;\n  transform: translateX(-50%);\n  background-color: #333;\n  color: #fff;\n  padding: 4px;\n  border-radius: 4px;\n  white-space: nowrap;\n  visibility: hidden;\n  opacity: 0;\n  transition: visibility 0s, opacity 0.3s ease-in-out;\n}\n\n.react-datepicker__day--holidays:not([aria-disabled=true]):hover,\n.react-datepicker__month-text--holidays:not([aria-disabled=true]):hover,\n.react-datepicker__quarter-text--holidays:not([aria-disabled=true]):hover,\n.react-datepicker__year-text--holidays:not([aria-disabled=true]):hover {\n  background-color: rgb(207, 82.9642857143, 0);\n}\n\n.react-datepicker__day--holidays:hover .overlay,\n.react-datepicker__month-text--holidays:hover .overlay,\n.react-datepicker__quarter-text--holidays:hover .overlay,\n.react-datepicker__year-text--holidays:hover .overlay {\n  visibility: visible;\n  opacity: 1;\n}\n\n.react-datepicker__day--selected, .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range,\n.react-datepicker__month-text--selected,\n.react-datepicker__month-text--in-selecting-range,\n.react-datepicker__month-text--in-range,\n.react-datepicker__quarter-text--selected,\n.react-datepicker__quarter-text--in-selecting-range,\n.react-datepicker__quarter-text--in-range,\n.react-datepicker__year-text--selected,\n.react-datepicker__year-text--in-selecting-range,\n.react-datepicker__year-text--in-range {\n  border-radius: 0.3rem;\n  background-color: #216ba5;\n  color: #fff;\n}\n\n.react-datepicker__day--selected:not([aria-disabled=true]):hover, .react-datepicker__day--in-selecting-range:not([aria-disabled=true]):hover, .react-datepicker__day--in-range:not([aria-disabled=true]):hover,\n.react-datepicker__month-text--selected:not([aria-disabled=true]):hover,\n.react-datepicker__month-text--in-selecting-range:not([aria-disabled=true]):hover,\n.react-datepicker__month-text--in-range:not([aria-disabled=true]):hover,\n.react-datepicker__quarter-text--selected:not([aria-disabled=true]):hover,\n.react-datepicker__quarter-text--in-selecting-range:not([aria-disabled=true]):hover,\n.react-datepicker__quarter-text--in-range:not([aria-disabled=true]):hover,\n.react-datepicker__year-text--selected:not([aria-disabled=true]):hover,\n.react-datepicker__year-text--in-selecting-range:not([aria-disabled=true]):hover,\n.react-datepicker__year-text--in-range:not([aria-disabled=true]):hover {\n  background-color: rgb(28.75, 93.2196969697, 143.75);\n}\n\n.react-datepicker__day--keyboard-selected,\n.react-datepicker__month-text--keyboard-selected,\n.react-datepicker__quarter-text--keyboard-selected,\n.react-datepicker__year-text--keyboard-selected {\n  border-radius: 0.3rem;\n  background-color: rgb(186.25, 217.0833333333, 241.25);\n  color: rgb(0, 0, 0);\n}\n\n.react-datepicker__day--keyboard-selected:not([aria-disabled=true]):hover,\n.react-datepicker__month-text--keyboard-selected:not([aria-disabled=true]):hover,\n.react-datepicker__quarter-text--keyboard-selected:not([aria-disabled=true]):hover,\n.react-datepicker__year-text--keyboard-selected:not([aria-disabled=true]):hover {\n  background-color: rgb(28.75, 93.2196969697, 143.75);\n  color: #fff;\n}\n\n.react-datepicker__day--in-selecting-range:not(.react-datepicker__day--in-range,\n.react-datepicker__month-text--in-range,\n.react-datepicker__quarter-text--in-range,\n.react-datepicker__year-text--in-range),\n.react-datepicker__month-text--in-selecting-range:not(.react-datepicker__day--in-range,\n.react-datepicker__month-text--in-range,\n.react-datepicker__quarter-text--in-range,\n.react-datepicker__year-text--in-range),\n.react-datepicker__quarter-text--in-selecting-range:not(.react-datepicker__day--in-range,\n.react-datepicker__month-text--in-range,\n.react-datepicker__quarter-text--in-range,\n.react-datepicker__year-text--in-range),\n.react-datepicker__year-text--in-selecting-range:not(.react-datepicker__day--in-range,\n.react-datepicker__month-text--in-range,\n.react-datepicker__quarter-text--in-range,\n.react-datepicker__year-text--in-range) {\n  background-color: rgba(33, 107, 165, 0.5);\n}\n\n.react-datepicker__month--selecting-range .react-datepicker__day--in-range:not(.react-datepicker__day--in-selecting-range,\n.react-datepicker__month-text--in-selecting-range,\n.react-datepicker__quarter-text--in-selecting-range,\n.react-datepicker__year-text--in-selecting-range),\n.react-datepicker__year--selecting-range .react-datepicker__day--in-range:not(.react-datepicker__day--in-selecting-range,\n.react-datepicker__month-text--in-selecting-range,\n.react-datepicker__quarter-text--in-selecting-range,\n.react-datepicker__year-text--in-selecting-range),\n.react-datepicker__month--selecting-range .react-datepicker__month-text--in-range:not(.react-datepicker__day--in-selecting-range,\n.react-datepicker__month-text--in-selecting-range,\n.react-datepicker__quarter-text--in-selecting-range,\n.react-datepicker__year-text--in-selecting-range),\n.react-datepicker__year--selecting-range .react-datepicker__month-text--in-range:not(.react-datepicker__day--in-selecting-range,\n.react-datepicker__month-text--in-selecting-range,\n.react-datepicker__quarter-text--in-selecting-range,\n.react-datepicker__year-text--in-selecting-range),\n.react-datepicker__month--selecting-range .react-datepicker__quarter-text--in-range:not(.react-datepicker__day--in-selecting-range,\n.react-datepicker__month-text--in-selecting-range,\n.react-datepicker__quarter-text--in-selecting-range,\n.react-datepicker__year-text--in-selecting-range),\n.react-datepicker__year--selecting-range .react-datepicker__quarter-text--in-range:not(.react-datepicker__day--in-selecting-range,\n.react-datepicker__month-text--in-selecting-range,\n.react-datepicker__quarter-text--in-selecting-range,\n.react-datepicker__year-text--in-selecting-range),\n.react-datepicker__month--selecting-range .react-datepicker__year-text--in-range:not(.react-datepicker__day--in-selecting-range,\n.react-datepicker__month-text--in-selecting-range,\n.react-datepicker__quarter-text--in-selecting-range,\n.react-datepicker__year-text--in-selecting-range),\n.react-datepicker__year--selecting-range .react-datepicker__year-text--in-range:not(.react-datepicker__day--in-selecting-range,\n.react-datepicker__month-text--in-selecting-range,\n.react-datepicker__quarter-text--in-selecting-range,\n.react-datepicker__year-text--in-selecting-range) {\n  background-color: #f0f0f0;\n  color: #000;\n}\n\n.react-datepicker__day--disabled,\n.react-datepicker__month-text--disabled,\n.react-datepicker__quarter-text--disabled,\n.react-datepicker__year-text--disabled {\n  cursor: default;\n  color: #ccc;\n}\n\n.react-datepicker__day--disabled .overlay,\n.react-datepicker__month-text--disabled .overlay,\n.react-datepicker__quarter-text--disabled .overlay,\n.react-datepicker__year-text--disabled .overlay {\n  position: absolute;\n  bottom: 70%;\n  left: 50%;\n  transform: translateX(-50%);\n  background-color: #333;\n  color: #fff;\n  padding: 4px;\n  border-radius: 4px;\n  white-space: nowrap;\n  visibility: hidden;\n  opacity: 0;\n  transition: visibility 0s, opacity 0.3s ease-in-out;\n}\n\n.react-datepicker__input-container {\n  position: relative;\n  display: inline-block;\n  width: 100%;\n}\n\n.react-datepicker__input-container .react-datepicker__calendar-icon {\n  position: absolute;\n  padding: 0.625em;\n  box-sizing: content-box;\n}\n\n.react-datepicker__view-calendar-icon input {\n  padding: 6px 10px 5px 25px;\n}\n\n.react-datepicker__year-read-view,\n.react-datepicker__month-read-view,\n.react-datepicker__month-year-read-view {\n  border: 1px solid transparent;\n  border-radius: 0.3rem;\n  position: relative;\n}\n\n.react-datepicker__year-read-view:hover,\n.react-datepicker__month-read-view:hover,\n.react-datepicker__month-year-read-view:hover {\n  cursor: pointer;\n}\n\n.react-datepicker__year-read-view:hover .react-datepicker__year-read-view--down-arrow,\n.react-datepicker__year-read-view:hover .react-datepicker__month-read-view--down-arrow,\n.react-datepicker__month-read-view:hover .react-datepicker__year-read-view--down-arrow,\n.react-datepicker__month-read-view:hover .react-datepicker__month-read-view--down-arrow,\n.react-datepicker__month-year-read-view:hover .react-datepicker__year-read-view--down-arrow,\n.react-datepicker__month-year-read-view:hover .react-datepicker__month-read-view--down-arrow {\n  border-top-color: rgb(178.5, 178.5, 178.5);\n}\n\n.react-datepicker__year-read-view--down-arrow,\n.react-datepicker__month-read-view--down-arrow,\n.react-datepicker__month-year-read-view--down-arrow {\n  transform: rotate(135deg);\n  right: -16px;\n  top: 0;\n}\n\n.react-datepicker__year-dropdown,\n.react-datepicker__month-dropdown,\n.react-datepicker__month-year-dropdown {\n  background-color: #f0f0f0;\n  position: absolute;\n  width: 50%;\n  left: 25%;\n  top: 30px;\n  z-index: 1;\n  text-align: center;\n  border-radius: 0.3rem;\n  border: 1px solid #aeaeae;\n}\n\n.react-datepicker__year-dropdown:hover,\n.react-datepicker__month-dropdown:hover,\n.react-datepicker__month-year-dropdown:hover {\n  cursor: pointer;\n}\n\n.react-datepicker__year-dropdown--scrollable,\n.react-datepicker__month-dropdown--scrollable,\n.react-datepicker__month-year-dropdown--scrollable {\n  height: 150px;\n  overflow-y: scroll;\n}\n\n.react-datepicker__year-option,\n.react-datepicker__month-option,\n.react-datepicker__month-year-option {\n  line-height: 20px;\n  width: 100%;\n  display: block;\n  margin-left: auto;\n  margin-right: auto;\n}\n\n.react-datepicker__year-option:first-of-type,\n.react-datepicker__month-option:first-of-type,\n.react-datepicker__month-year-option:first-of-type {\n  border-top-left-radius: 0.3rem;\n  border-top-right-radius: 0.3rem;\n}\n\n.react-datepicker__year-option:last-of-type,\n.react-datepicker__month-option:last-of-type,\n.react-datepicker__month-year-option:last-of-type {\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  border-bottom-left-radius: 0.3rem;\n  border-bottom-right-radius: 0.3rem;\n}\n\n.react-datepicker__year-option:hover,\n.react-datepicker__month-option:hover,\n.react-datepicker__month-year-option:hover {\n  background-color: #ccc;\n}\n\n.react-datepicker__year-option:hover .react-datepicker__navigation--years-upcoming,\n.react-datepicker__month-option:hover .react-datepicker__navigation--years-upcoming,\n.react-datepicker__month-year-option:hover .react-datepicker__navigation--years-upcoming {\n  border-bottom-color: rgb(178.5, 178.5, 178.5);\n}\n\n.react-datepicker__year-option:hover .react-datepicker__navigation--years-previous,\n.react-datepicker__month-option:hover .react-datepicker__navigation--years-previous,\n.react-datepicker__month-year-option:hover .react-datepicker__navigation--years-previous {\n  border-top-color: rgb(178.5, 178.5, 178.5);\n}\n\n.react-datepicker__year-option--selected,\n.react-datepicker__month-option--selected,\n.react-datepicker__month-year-option--selected {\n  position: absolute;\n  left: 15px;\n}\n\n.react-datepicker__close-icon {\n  cursor: pointer;\n  background-color: transparent;\n  border: 0;\n  outline: 0;\n  padding: 0 6px 0 0;\n  position: absolute;\n  top: 0;\n  right: 0;\n  height: 100%;\n  display: table-cell;\n  vertical-align: middle;\n}\n\n.react-datepicker__close-icon::after {\n  cursor: pointer;\n  background-color: #216ba5;\n  color: #fff;\n  border-radius: 50%;\n  height: 16px;\n  width: 16px;\n  padding: 2px;\n  font-size: 12px;\n  line-height: 1;\n  text-align: center;\n  display: table-cell;\n  vertical-align: middle;\n  content: \"×\";\n}\n\n.react-datepicker__close-icon--disabled {\n  cursor: default;\n}\n\n.react-datepicker__close-icon--disabled::after {\n  cursor: default;\n  background-color: #ccc;\n}\n\n.react-datepicker__today-button {\n  background: #f0f0f0;\n  border-top: 1px solid #aeaeae;\n  cursor: pointer;\n  text-align: center;\n  font-weight: bold;\n  padding: 5px 0;\n  clear: left;\n}\n\n.react-datepicker__portal {\n  position: fixed;\n  width: 100vw;\n  height: 100vh;\n  background-color: rgba(0, 0, 0, 0.8);\n  left: 0;\n  top: 0;\n  justify-content: center;\n  align-items: center;\n  display: flex;\n  z-index: 2147483647;\n}\n\n.react-datepicker__children-container {\n  width: 17.25em;\n  margin: 0.5em;\n  padding-right: 0.25em;\n  padding-left: 0.25em;\n  height: auto;\n}\n\n.react-datepicker__aria-live {\n  position: absolute;\n  clip-path: circle(0);\n  border: 0;\n  height: 1px;\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  width: 1px;\n  white-space: nowrap;\n}\n\n.react-datepicker__calendar-icon {\n  width: 1em;\n  height: 1em;\n  vertical-align: -0.125em;\n}\n\n.react-datepicker-popper-offset {\n  margin-top: -0.7em;\n}");

___$insertStylesToHeader("/**\n * Date picker widget styles\n *\n * Styles for the custom date picker widget used in FilterBox.\n */\n.date-picker-widget {\n  padding: 16px;\n  background: #ffffff;\n  border-radius: 4px;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n  min-width: 300px;\n}\n\n.date-picker-widget .react-datepicker {\n  border: none;\n  font-family: inherit;\n}\n\n.date-picker-widget .react-datepicker__header {\n  background-color: #f5f5f5;\n  border-bottom: 1px solid #e0e0e0;\n}\n\n.date-picker-widget .react-datepicker__current-month,\n.date-picker-widget .react-datepicker__day-name {\n  color: #333;\n}\n\n.date-picker-widget .react-datepicker__day--selected,\n.date-picker-widget .react-datepicker__day--keyboard-selected {\n  background-color: #b5152b;\n  color: white;\n}\n\n.date-picker-widget .react-datepicker__day--selected:hover,\n.date-picker-widget .react-datepicker__day--keyboard-selected:hover {\n  background-color: #8a1021;\n}\n\n.date-picker-widget .react-datepicker__day:hover {\n  background-color: #f0f0f0;\n}\n\n.date-picker-widget .react-datepicker__today-button {\n  background: #f5f5f5;\n  border-top: 1px solid #e0e0e0;\n  color: #333;\n  padding: 8px;\n  text-align: center;\n  cursor: pointer;\n}\n\n.date-picker-widget .react-datepicker__today-button:hover {\n  background: #eeeeee;\n}\n\n.date-picker-widget__summary {\n  margin-top: 16px;\n  padding: 8px 12px;\n  background: #e8f5e9;\n  border-radius: 4px;\n  text-align: center;\n  color: #2e7d32;\n  font-size: 14px;\n}\n\n.date-picker-widget__actions {\n  display: flex;\n  gap: 8px;\n  justify-content: flex-end;\n  margin-top: 16px;\n  padding-top: 16px;\n  border-top: 1px solid #e0e0e0;\n}\n\n.date-picker-widget__actions button {\n  padding: 6px 12px;\n  border-radius: 3px;\n  font-size: 13px;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n\n.date-picker-widget__actions button:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n\n.date-picker-widget__actions .btn-primary {\n  background-color: #b5152b;\n  border-color: #b5152b;\n  color: white;\n}\n\n.date-picker-widget__actions .btn-primary:hover:not(:disabled) {\n  background-color: #8a1021;\n  border-color: #8a1021;\n}\n\n.date-picker-widget__actions .btn-default {\n  background-color: #f5f5f5;\n  border-color: #ddd;\n  color: #333;\n}\n\n.date-picker-widget__actions .btn-default:hover {\n  background-color: #eeeeee;\n}");

/** HTTP status code for Forbidden */
var HTTP_FORBIDDEN = 403;
/**
 * Run an autocomplete lookup, treating a denied permission as "no suggestions".
 *
 * Autocompletion is an optional convenience: a user who may not list groups should still
 * be able to type a group id by hand rather than see an error.
 * @param api - The API configuration object
 * @param path - Engine API path to query
 * @param params - Query parameters
 * @param signal - Optional signal aborting a superseded lookup
 * @param deniedMessage - Logged when the engine denies the lookup
 * @returns The rows, or an empty array when the lookup is not permitted
 */
function lookup(api, path, params, signal, deniedMessage) {
    return __awaiter(this, void 0, void 0, function () {
        var rows, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, get(api, path, params, { signal: signal })];
                case 1:
                    rows = _a.sent();
                    return [2 /*return*/, Array.isArray(rows) ? rows : []];
                case 2:
                    error_1 = _a.sent();
                    if (error_1 instanceof ApiError && error_1.status === HTTP_FORBIDDEN) {
                        console.warn(deniedMessage);
                        return [2 /*return*/, []];
                    }
                    throw error_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
/** Default debounce delay in milliseconds for autocomplete searches */
var DEFAULT_DEBOUNCE_MS = 300;
/**
 * Standard operators used across filter configurations
 */
var OPERATORS = {
    /** Equals operator */
    eq: { key: 'eq', label: 'equals', symbol: '=' }};
/**
 * Create a string field configuration.
 * @param key - Field key
 * @param label - Display label
 * @param operators - Operators for this field
 * @returns Field configuration
 */
function createStringField(key, label, operators) {
    return {
        key: key,
        label: label,
        type: 'string',
        operators: operators,
        allowMultiple: true,
    };
}
/**
 * Create an enum field configuration with static values.
 * @param key - Field key
 * @param label - Display label
 * @param operators - Operators for this field
 * @param values - Static enum values
 * @returns Field configuration
 */
function createEnumField(key, label, operators, values) {
    return {
        key: key,
        label: label,
        type: 'enum',
        operators: operators,
        allowMultiple: true,
        valueAutocompleter: vn(values),
    };
}
/**
 * Create an async autocompleter that fetches suggestions from an API endpoint.
 *
 * This utility wraps react-select-filter-box's createAsyncAutocompleter with
 * built-in debouncing, caching, and error handling optimized for Operaton REST API.
 *
 * @param fetchFn - Async function that fetches autocomplete items from API
 * @param options - Configuration options
 * @returns Autocompleter instance
 *
 * @example
 * ```typescript
 * const userAutocompleter = createApiAutocompleter(
 *   async (query, api, signal) => {
 *     const users = await lookup<UserProfileDto>(
 *       api,
 *       '/user',
 *       { nameLike: `${query}%` },
 *       signal,
 *       'User search permission denied'
 *     );
 *     return users.map(u => ({ key: u.id, label: u.id }));
 *   },
 *   { api, minChars: 2, maxResults: 10 }
 * );
 * ```
 */
function createApiAutocompleter(fetchFn, options) {
    var _this = this;
    var api = options.api, _a = options.minChars, minChars = _a === void 0 ? 1 : _a, _b = options.debounceMs, debounceMs = _b === void 0 ? 300 : _b, _c = options.shouldCacheResults, shouldCacheResults = _c === void 0 ? true : _c; options.loadingMessage;
    return wn(function (query, _context, signal) { return __awaiter(_this, void 0, void 0, function () {
        var unknownError_1, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fetchFn(query, api, signal)];
                case 1: 
                // Delegate to the provided fetch function
                return [2 /*return*/, _a.sent()];
                case 2:
                    unknownError_1 = _a.sent();
                    error = unknownError_1;
                    // Handle abort gracefully
                    if (error.name === 'AbortError') {
                        return [2 /*return*/, []];
                    }
                    // Handle API errors
                    console.error('Autocomplete fetch error:', error);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    }); }, {
        debounceMs: debounceMs,
        minChars: minChars,
        cacheResults: shouldCacheResults});
}
/**
 * Create a string field with async API-based autocomplete.
 * @param key - Field key
 * @param label - Display label
 * @param operators - Operators for this field
 * @param autocompleter - Async autocompleter instance
 * @returns Field configuration
 */
function createAsyncStringField(key, label, operators, autocompleter) {
    return {
        key: key,
        label: label,
        type: 'string',
        operators: operators,
        allowMultiple: true,
        valueAutocompleter: autocompleter,
    };
}
/**
 * Create an autocompleter for user search via /user API endpoint.
 *
 * Searches users by first name, last name, and email with substring matching.
 * Performs three separate API calls and combines results, removing duplicates.
 * This is necessary because the REST API uses AND logic for multiple parameters.
 * Returns user IDs as suggestions. Handles permission errors gracefully.
 *
 * @param api - API configuration
 * @param options - Optional autocompleter configuration
 * @returns Autocompleter instance for user search
 *
 * @example
 * ```typescript
 * const userAutocompleter = createUserAutocompleter(api, { minChars: 2 });
 * const field = createAsyncStringField('startedBy', 'Started By', [OPERATORS.eq], userAutocompleter);
 * ```
 */
function createUserAutocompleter(api, options) {
    var _this = this;
    var _a, _b, _c, _d;
    return createApiAutocompleter(function (query, apiConfig, signal) { return __awaiter(_this, void 0, void 0, function () {
        var encodedQuery, searches, results, userMap, _i, results_1, userList, _a, userList_1, user;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    encodedQuery = encodeURIComponent(query);
                    searches = [
                        { firstNameLike: "%".concat(encodedQuery, "%") },
                        { lastNameLike: "%".concat(encodedQuery, "%") },
                        { emailLike: "%".concat(encodedQuery, "%") },
                    ];
                    return [4 /*yield*/, Promise.all(searches.map(function (params) { return __awaiter(_this, void 0, void 0, function () {
                            var error_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, lookup(apiConfig, '/user', params, signal, 'User search permission denied')];
                                    case 1: return [2 /*return*/, _a.sent()];
                                    case 2:
                                        error_2 = _a.sent();
                                        // If one search fails, continue with others
                                        console.warn('User search request failed:', error_2);
                                        return [2 /*return*/, []];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 1:
                    results = _b.sent();
                    userMap = new Map();
                    for (_i = 0, results_1 = results; _i < results_1.length; _i++) {
                        userList = results_1[_i];
                        for (_a = 0, userList_1 = userList; _a < userList_1.length; _a++) {
                            user = userList_1[_a];
                            if (user.id && !userMap.has(user.id)) {
                                userMap.set(user.id, user);
                            }
                        }
                    }
                    return [2 /*return*/, Array.from(userMap.values()).map(function (u) {
                            var _a, _b, _c, _d, _e;
                            var parts = [];
                            if (u.firstName || u.lastName) {
                                parts.push("".concat((_a = u.firstName) !== null && _a !== void 0 ? _a : '', " ").concat((_b = u.lastName) !== null && _b !== void 0 ? _b : '').trim());
                            }
                            if (u.email) {
                                parts.push("<".concat(u.email, ">"));
                            }
                            return {
                                type: 'value',
                                key: (_c = u.id) !== null && _c !== void 0 ? _c : '',
                                label: parts.length > 0 ? "".concat((_d = u.id) !== null && _d !== void 0 ? _d : '', " (").concat(parts.join(' '), ")") : ((_e = u.id) !== null && _e !== void 0 ? _e : ''),
                            };
                        })];
            }
        });
    }); }, __assign(__assign({ api: api, minChars: (_a = void 0 ) !== null && _a !== void 0 ? _a : 2, debounceMs: (_b = void 0 ) !== null && _b !== void 0 ? _b : DEFAULT_DEBOUNCE_MS, shouldCacheResults: (_c = void 0 ) !== null && _c !== void 0 ? _c : true }, ((void 0 ) !== undefined)), { loadingMessage: (_d = void 0 ) !== null && _d !== void 0 ? _d : 'Searching users...' }));
}
/**
 * Create an autocompleter for group search via /group API endpoint.
 *
 * Searches groups by name with substring matching. Returns group IDs with names as suggestions.
 * Handles permission errors gracefully.
 *
 * @param api - API configuration
 * @param options - Optional autocompleter configuration
 * @returns Autocompleter instance for group search
 *
 * @example
 * ```typescript
 * const groupAutocompleter = createGroupAutocompleter(api, { minChars: 2 });
 * const field = createAsyncStringField('groupIdIn', 'Group', [OPERATORS.eq], groupAutocompleter);
 * ```
 */
function createGroupAutocompleter(api, options) {
    var _this = this;
    var _a, _b, _c, _d;
    return createApiAutocompleter(function (query, apiConfig, signal) { return __awaiter(_this, void 0, void 0, function () {
        var groups;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, lookup(apiConfig, '/group', { nameLike: "%".concat(query, "%") }, signal, 'Group search permission denied')];
                case 1:
                    groups = _a.sent();
                    return [2 /*return*/, groups
                            .filter(function (g) { return g.id; })
                            .map(function (g) {
                            var _a, _b, _c;
                            return ({
                                type: 'value',
                                key: (_a = g.id) !== null && _a !== void 0 ? _a : '',
                                label: g.name ? "".concat((_b = g.id) !== null && _b !== void 0 ? _b : '', " (").concat(g.name, ")") : ((_c = g.id) !== null && _c !== void 0 ? _c : ''),
                            });
                        })];
            }
        });
    }); }, __assign(__assign({ api: api, minChars: (_a = void 0 ) !== null && _a !== void 0 ? _a : 2, debounceMs: (_b = void 0 ) !== null && _b !== void 0 ? _b : DEFAULT_DEBOUNCE_MS, shouldCacheResults: (_c = void 0 ) !== null && _c !== void 0 ? _c : true }, ((void 0 ) !== undefined)), { loadingMessage: (_d = void 0 ) !== null && _d !== void 0 ? _d : 'Searching groups...' }));
}
/** Resource types for authorization filtering (sorted by name) */
var RESOURCE_TYPE_VALUES = [
    { key: '0', label: 'Application' },
    { key: '4', label: 'Authorization' },
    { key: '13', label: 'Batch' },
    { key: '10', label: 'Decision Definition' },
    { key: '14', label: 'Decision Requirements Definition' },
    { key: '9', label: 'Deployment' },
    { key: '5', label: 'Filter' },
    { key: '2', label: 'Group' },
    { key: '3', label: 'Group Membership' },
    { key: '20', label: 'Historic Process Instance' },
    { key: '19', label: 'Historic Task Instance' },
    { key: '17', label: 'Operation Log' },
    { key: '6', label: 'Process Definition' },
    { key: '8', label: 'Process Instance' },
    { key: '21', label: 'System' },
    { key: '7', label: 'Task' },
    { key: '11', label: 'Tenant' },
    { key: '12', label: 'Tenant Membership' },
    { key: '1', label: 'User' },
];
/**
 * Create a filter schema for authorization filters.
 * Field names match Operaton REST API query parameters directly.
 * @param api - Optional API configuration for enabling autocomplete on user/group fields
 * @param options - Optional configuration for field inclusion
 * @param options.includeId - Whether to include the authorization ID field
 * @param options.includeResourceType - Whether to include the resource type field
 * @returns Filter schema for authorization filters
 */
function createAuthorizationFilterSchema(api, options) {
    var userIdInField = api
        ? createAsyncStringField('userIdIn', 'User ID', [OPERATORS.eq], createUserAutocompleter(api))
        : createStringField('userIdIn', 'User ID', [OPERATORS.eq]);
    var groupIdInField = api
        ? createAsyncStringField('groupIdIn', 'Group ID', [OPERATORS.eq], createGroupAutocompleter(api))
        : createStringField('groupIdIn', 'Group ID', [OPERATORS.eq]);
    var fields = [];
    // Only include ID field if explicitly requested (defaults to false)
    if (options === null || options === void 0 ? void 0 : options.includeId) {
        fields.push(createStringField('id', 'ID', [OPERATORS.eq]));
    }
    // Add user and group ID fields with autocomplete
    fields.push(userIdInField, groupIdInField);
    // Add resource ID field
    fields.push(createStringField('resourceId', 'Resource ID', [OPERATORS.eq]));
    // Only include Resource Type field if explicitly requested (defaults to false)
    if (options === null || options === void 0 ? void 0 : options.includeResourceType) {
        fields.push(createEnumField('resourceType', 'Resource Type', [OPERATORS.eq], RESOURCE_TYPE_VALUES));
    }
    // Add authorization type field
    fields.push(createEnumField('type', 'Type', [OPERATORS.eq], [
        { key: '0', label: 'Global' },
        { key: '1', label: 'Grant' },
        { key: '2', label: 'Revoke' },
    ]));
    return {
        fields: fields,
        connectors: [{ key: 'AND', label: 'AND' }],
    };
}
/**
 * Convert new FilterExpression array to legacy Expression array.
 * This provides backward compatibility for existing code that expects the old format.
 * @param expressions - New format expressions
 * @returns Legacy format expressions
 */
function toLegacyExpressions(expressions) {
    return expressions.map(function (expr, index) {
        var _a;
        var base = {
            category: expr.condition.field.key,
            operator: mapOperatorKeyToLegacy(expr.condition.operator.key),
            value: expr.condition.value.serialized,
        };
        // Only add conditionType for non-last expressions
        if (index < expressions.length - 1) {
            return __assign(__assign({}, base), { conditionType: (_a = expr.connector) !== null && _a !== void 0 ? _a : 'AND' });
        }
        return base;
    });
}
/**
 * Map new operator keys to legacy operator strings.
 * @param key - New operator key
 * @returns Legacy operator string
 */
function mapOperatorKeyToLegacy(key) {
    var _a;
    var mapping = {
        eq: '==',
        neq: '!=',
        like: 'like',
        ilike: 'ilike',
        after: 'after',
        before: 'before',
        gt: '>',
        lt: '<',
        gte: '>=',
        lte: '<=',
        is: '==',
        any: 'any',
    };
    return (_a = mapping[key]) !== null && _a !== void 0 ? _a : key;
}

/**
 * Filter expression parsers for converting filter box expressions to API query parameters.
 *
 * These pure functions extract the filter parsing logic from plugin components
 * to enable unit testing and reuse.
 *
 * ## Filter Schema to API Parameter Mapping
 *
 * The FilterBox component uses `react-select-filter-box` which produces "legacy expressions"
 * in the format `{ category, operator, value }`. These parsers convert those expressions
 * to API query parameters.
 *
 * ### Activity Instance Query Mapping (definition-historic-activities)
 *
 * | Schema Field       | Operator | API Parameter              | Notes                              |
 * |--------------------|----------|----------------------------|------------------------------------|
 * | started            | after    | startedAfter               | Date with T00:00:00.000+0000 suffix|
 * | started            | before   | startedBefore              | Date with T00:00:00.000+0000 suffix|
 * | finished           | after    | finishedAfter              | Date with T00:00:00.000+0000 suffix|
 * | finished           | before   | finishedBefore             | Date with T00:00:00.000+0000 suffix|
 * | maxResults         | is/==    | maxResults                 | Integer                            |
 * | version            | ==       | processDefinitionVersion   | Process definition version number  |
 * | activityInstanceId | ==       | activityInstanceId         | Activity instance ID               |
 * | processInstanceId  | ==       | processInstanceId          | Process instance ID                |
 * | executionId        | ==       | executionId                | Execution ID                       |
 * | activityId         | ==       | activityId                 | BPMN element ID                    |
 * | activityName       | ==       | activityName               | Exact match                        |
 * | activityName       | like     | activityNameLike           | Pattern with % wildcards           |
 * | activityType       | ==       | activityType               | e.g., userTask, serviceTask        |
 * | taskAssignee       | ==       | taskAssignee               | Exact match                        |
 * | taskAssignee       | like     | taskAssigneeLike           | Pattern with % wildcards           |
 * | finishedOnly       | ==       | finished                   | Boolean (value=true)               |
 * | unfinishedOnly     | ==       | unfinished                 | Boolean (value=true)               |
 * | canceled           | ==       | canceled                   | Boolean (value=true)               |
 * | completeScope      | ==       | completeScope              | Boolean (value=true)               |
 * | tenantIdIn         | ==       | tenantIdIn                 | Comma-separated tenant IDs         |
 * | withoutTenantId    | ==       | withoutTenantId            | Boolean (value=true)               |
 *
 * ### Process Instance Query Mapping (instance-route-history)
 *
 * | Schema Field                  | Operator | API Parameter                  | Notes                    |
 * |-------------------------------|----------|--------------------------------|--------------------------|
 * | started                       | after    | startedAfter                   | Date with timezone       |
 * | started                       | before   | startedBefore                  | Date with timezone       |
 * | finished                      | after    | finishedAfter                  | Date with timezone       |
 * | finished                      | before   | finishedBefore                 | Date with timezone       |
 * | executedActivity              | after    | executedActivityAfter          | Date with timezone       |
 * | executedActivity              | before   | executedActivityBefore         | Date with timezone       |
 * | executedJob                   | after    | executedJobAfter               | Date with timezone       |
 * | executedJob                   | before   | executedJobBefore              | Date with timezone       |
 * | key                           | ==       | processInstanceBusinessKey     | Exact match              |
 * | key                           | like     | processInstanceBusinessKeyLike | Pattern                  |
 * | processInstanceBusinessKeyIn  | ==       | processInstanceBusinessKeyIn   | Comma-separated keys     |
 * | processDefinitionName         | ==       | processDefinitionName          | Exact match              |
 * | processDefinitionName         | like     | processDefinitionNameLike      | Pattern with % wildcards |
 * | variable                      | ==/like  | variables[]                    | name:value format        |
 * | version                       | any      | useAllVersions=true            | Client-side flag         |
 * | version                       | ==/</>   | versionFilter                  | Client-side filtering    |
 * | processInstanceId             | ==       | processInstanceId              | Exact match              |
 * | processInstanceIds            | ==       | processInstanceIds             | Comma-separated IDs      |
 * | rootProcessInstances          | ==       | rootProcessInstances           | Boolean (value=true)     |
 * | superProcessInstanceId        | ==       | superProcessInstanceId         | Parent instance ID       |
 * | subProcessInstanceId          | ==       | subProcessInstanceId           | Sub-process instance ID  |
 * | finishedOnly                  | ==       | finished                       | Boolean                  |
 * | unfinishedOnly                | ==       | unfinished                     | Boolean                  |
 * | active                        | ==       | active                         | Boolean                  |
 * | suspended                     | ==       | suspended                      | Boolean                  |
 * | completed                     | ==       | completed                      | Boolean                  |
 * | withIncidents                 | ==       | withIncidents                  | Boolean                  |
 * | withRootIncidents             | ==       | withRootIncidents              | Boolean                  |
 * | incidentType                  | ==       | incidentType                   | e.g., failedJob          |
 * | incidentStatus                | ==       | incidentStatus                 | e.g., open               |
 * | incidentMessage               | ==       | incidentMessage                | Exact match              |
 * | incidentMessage               | like     | incidentMessageLike            | Pattern with % wildcards |
 * | startedBy                     | ==       | startedBy                      | User ID                  |
 * | tenantIdIn                    | ==       | tenantIdIn                     | Comma-separated IDs      |
 * | withoutTenantId               | ==       | withoutTenantId                | Boolean (value=true)     |
 * | state                         | ==       | state                          | e.g., ACTIVE, COMPLETED  |
 * | executedActivityIdIn          | ==       | executedActivityIdIn           | Comma-separated IDs      |
 * | activeActivityIdIn            | ==       | activeActivityIdIn             | Comma-separated IDs      |
 *
 * ### Authorization Query Mapping (admin-route-authorization)
 *
 * | Schema Field   | Operator | API Parameter | Notes                     |
 * |----------------|----------|---------------|---------------------------|
 * | id             | ==       | id            | Authorization ID          |
 * | userIdIn       | ==       | userIdIn      | User ID                   |
 * | groupIdIn      | ==       | groupIdIn     | Group ID                  |
 * | resourceId     | ==       | resourceId    | Resource identifier       |
 * | resourceType   | ==       | resourceType  | Integer (0-21)            |
 * | type           | ==       | type          | 0=Global, 1=Grant, 2=Rev  |
 *
 * @module
 */
/** Valid API parameters for authorization endpoint */
var VALID_AUTHORIZATION_PARAMS = ['id', 'userIdIn', 'groupIdIn', 'resourceId', 'resourceType', 'type'];
/**
 * Parse filter expressions for authorization queries.
 * Converts FilterBox expressions to API query parameters for `/authorization`.
 *
 * @param expressions - Array of filter expressions from FilterBox
 * @returns Query parameters for the authorization API as a string record
 */
function parseAuthorizationExpressions(expressions) {
    var params = {};
    for (var _i = 0, expressions_3 = expressions; _i < expressions_3.length; _i++) {
        var expr = expressions_3[_i];
        var category = expr.category;
        var value = expr.value;
        if (!value || !category || !VALID_AUTHORIZATION_PARAMS.includes(category)) {
            continue;
        }
        // Category names match API params directly
        params[category] = value;
    }
    return params;
}
/**
 * Validate filter expressions for conflicts.
 * Returns an array of conflicts found in the given expressions.
 *
 * @param expressions - Array of legacy filter expressions to validate
 * @param conflicts - Array of conflict definitions to check against
 * @returns Array of detected conflicts (empty if no conflicts)
 */
function validateFilterConflicts(expressions, conflicts) {
    // Only count filters that are actively enabled (value='true' for booleans or any value for other fields)
    var activeFields = new Set(expressions
        .filter(function (e) {
        // Boolean fields are only active when value is 'true'
        if (e.value === 'false') {
            return false;
        }
        // Other fields are active when they have any filter applied
        return e.operator === '==' || e.operator === 'is' || e.operator === 'eq';
    })
        .map(function (e) { return e.category; }));
    var detected = [];
    for (var _i = 0, conflicts_1 = conflicts; _i < conflicts_1.length; _i++) {
        var conflict = conflicts_1[_i];
        if (activeFields.has(conflict.field1) && activeFields.has(conflict.field2)) {
            detected.push(conflict);
        }
    }
    return detected;
}

// Cast the component to avoid React version type conflicts
// The library bundles its own @types/react which conflicts with ours
var ReactSelectFilterBox = mn;
/** Default storage key prefix for saved searches */
var SAVED_SEARCHES_KEY_PREFIX = 'minimal-history-plugin-saved-searches';
/**
 * Load saved searches from localStorage.
 * @param storageKey - Storage key for this specific filter context
 * @returns Array of saved searches
 */
function loadSavedSearches(storageKey) {
    try {
        var stored = localStorage.getItem(storageKey);
        if (stored) {
            return JSON.parse(stored);
        }
    }
    catch (_a) {
        // Ignore parse errors
    }
    return [];
}
/**
 * Save searches to localStorage.
 * @param storageKey - Storage key for this specific filter context
 * @param searches - Array of saved searches to persist
 */
function saveSavedSearches(storageKey, searches) {
    try {
        localStorage.setItem(storageKey, JSON.stringify(searches));
    }
    catch (_a) {
        console.warn('Failed to save searches to localStorage');
    }
}
/**
 * SavedSearchesDropdown component.
 * Provides a dropdown UI for saving and loading filter queries.
 */
var SavedSearchesDropdown = function (_a) {
    var currentExpressions = _a.currentExpressions, onLoadExpressions = _a.onLoadExpressions, storageKey = _a.storageKey;
    var _b = reactExports.useState(false), isOpen = _b[0], setIsOpen = _b[1];
    var _c = reactExports.useState([]), savedSearches = _c[0], setSavedSearches = _c[1];
    var _d = reactExports.useState(''), newSearchName = _d[0], setNewSearchName = _d[1];
    var dropdownRef = reactExports.useRef(null);
    // Load saved searches on mount
    reactExports.useEffect(function () {
        setSavedSearches(loadSavedSearches(storageKey));
    }, [storageKey]);
    // Close dropdown when clicking outside
    reactExports.useEffect(function () {
        if (!isOpen) {
            return;
        }
        var handleClickOutside = function (e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return function () {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);
    var handleSave = reactExports.useCallback(function () {
        if (!newSearchName.trim() || currentExpressions.length === 0) {
            return;
        }
        var newSearches = __spreadArray(__spreadArray([], savedSearches.filter(function (s) { return s.name !== newSearchName.trim(); }), true), [
            { name: newSearchName.trim(), expressions: currentExpressions },
        ], false);
        setSavedSearches(newSearches);
        saveSavedSearches(storageKey, newSearches);
        setNewSearchName('');
        setIsOpen(false);
    }, [currentExpressions, newSearchName, savedSearches, storageKey]);
    var handleLoad = reactExports.useCallback(function (search) {
        onLoadExpressions(search.expressions);
        setIsOpen(false);
    }, [onLoadExpressions]);
    var handleDelete = reactExports.useCallback(function (name, e) {
        e.stopPropagation();
        var newSearches = savedSearches.filter(function (s) { return s.name !== name; });
        setSavedSearches(newSearches);
        saveSavedSearches(storageKey, newSearches);
    }, [savedSearches, storageKey]);
    var canSave = newSearchName.trim() && currentExpressions.length > 0;
    return (React.createElement("div", { ref: dropdownRef, className: "filter-box-saved-searches" },
        React.createElement("button", { type: "button", onClick: function () {
                setIsOpen(!isOpen);
            }, className: "filter-box-saved-searches__toggle", title: "Saved searches", "aria-label": "Saved searches", "aria-expanded": isOpen },
            React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor" },
                React.createElement("path", { d: "M2 2h10l2 2v10H2V2zm1 1v10h10V4.414L11.586 3H3zm1 5h8v5H4V8zm1 1v3h6V9H5z" })),
            React.createElement("svg", { width: "10", height: "10", viewBox: "0 0 10 10", fill: "currentColor" },
                React.createElement("path", { d: "M2 3l3 4 3-4H2z" }))),
        isOpen && (React.createElement("div", { className: "filter-box-saved-searches__dropdown" },
            React.createElement("div", { className: "filter-box-saved-searches__save-section" },
                React.createElement("div", { className: "filter-box-saved-searches__save-row" },
                    React.createElement("input", { type: "text", placeholder: "Save search as...", value: newSearchName, onChange: function (e) {
                            setNewSearchName(e.target.value);
                        }, onKeyDown: function (e) {
                            if (e.key === 'Enter') {
                                handleSave();
                            }
                        }, className: "filter-box-saved-searches__input" }),
                    React.createElement("button", { type: "button", onClick: handleSave, disabled: !canSave, className: "filter-box-saved-searches__save-button" }, "Save"))),
            savedSearches.length > 0 ? (React.createElement("div", { className: "filter-box-saved-searches__list" }, savedSearches.map(function (search) { return (React.createElement("div", { key: search.name, onClick: function () {
                    handleLoad(search);
                }, onKeyDown: function (e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        handleLoad(search);
                    }
                }, role: "button", tabIndex: 0, className: "filter-box-saved-searches__item" },
                React.createElement("span", { className: "filter-box-saved-searches__item-name" }, search.name),
                React.createElement("button", { type: "button", onClick: function (e) {
                        handleDelete(search.name, e);
                    }, className: "filter-box-saved-searches__delete-button", title: "Delete search" }, "\u00D7"))); }))) : (React.createElement("div", { className: "filter-box-saved-searches__empty" }, "No saved searches"))))));
};
/**
 * FilterBox component.
 * A token-based filter builder with autocomplete support.
 */
var FilterBox = function (_a) {
    var _b;
    var schema = _a.schema, _c = _a.initialExpressions, initialExpressions = _c === void 0 ? [] : _c, onFilterChange = _a.onFilterChange, onLegacyFilterChange = _a.onLegacyFilterChange, _d = _a.placeholder, placeholder = _d === void 0 ? 'Add a filter...' : _d, _e = _a.disabled, disabled = _e === void 0 ? false : _e, _f = _a.storageKey, storageKey = _f === void 0 ? SAVED_SEARCHES_KEY_PREFIX : _f, conflictRules = _a.conflictRules;
    var _g = reactExports.useState(initialExpressions), expressions = _g[0], setExpressions = _g[1];
    var _h = reactExports.useState(0), key = _h[0], setKey = _h[1];
    var _j = reactExports.useState([]), conflicts = _j[0], setConflicts = _j[1];
    var previousInitialExpressionsRef = reactExports.useRef(JSON.stringify(initialExpressions));
    // Serialize expressions for saved searches
    var serializedExpressions = ft(expressions);
    // Validate for conflicts whenever expressions change
    reactExports.useEffect(function () {
        if (conflictRules && conflictRules.length > 0) {
            var legacyExprs = toLegacyExpressions(expressions);
            var detected = validateFilterConflicts(legacyExprs, conflictRules);
            setConflicts(detected);
        }
        else {
            setConflicts([]);
        }
    }, [expressions, conflictRules]);
    // Update expressions when initialExpressions prop changes
    reactExports.useEffect(function () {
        var currentSerialized = JSON.stringify(initialExpressions);
        if (currentSerialized !== previousInitialExpressionsRef.current) {
            previousInitialExpressionsRef.current = currentSerialized;
            setExpressions(initialExpressions);
            // Force re-render of ReactSelectFilterBox to show new expressions
            setKey(function (prev) { return prev + 1; });
            // Trigger callbacks with new expressions
            if (initialExpressions.length > 0) {
                onFilterChange(initialExpressions);
                if (onLegacyFilterChange) {
                    try {
                        onLegacyFilterChange(toLegacyExpressions(initialExpressions));
                    }
                    catch (_a) {
                        // Skip legacy callback if conversion fails
                    }
                }
            }
        }
    }, [initialExpressions, onFilterChange, onLegacyFilterChange]);
    // Handle expression changes
    var handleChange = reactExports.useCallback(function (newExpressions) {
        setExpressions(newExpressions);
        onFilterChange(newExpressions);
        // Also emit legacy format if callback provided
        if (onLegacyFilterChange) {
            onLegacyFilterChange(toLegacyExpressions(newExpressions));
        }
    }, [onFilterChange, onLegacyFilterChange]);
    // Handle loading saved expressions
    var handleLoadExpressions = reactExports.useCallback(function (serialized) {
        try {
            var loadedExpressions = pt(serialized, schema);
            // Update expressions first, then force re-render on next tick
            setExpressions(loadedExpressions);
            // Use setTimeout to ensure state update completes before forcing re-render
            setTimeout(function () {
                setKey(function (prev) { return prev + 1; });
            }, 0);
            onFilterChange(loadedExpressions);
            if (onLegacyFilterChange) {
                onLegacyFilterChange(toLegacyExpressions(loadedExpressions));
            }
        }
        catch (error) {
            console.error('Failed to deserialize saved expressions:', error);
            console.error('Serialized expressions:', serialized);
            console.warn('Failed to deserialize saved expressions');
        }
    }, [schema, onFilterChange, onLegacyFilterChange]);
    return (React.createElement("div", { className: "filter-box-container" },
        React.createElement("div", { className: "filter-box-wrapper" },
            React.createElement(ReactSelectFilterBox, { key: key, schema: schema, value: expressions, onChange: handleChange, placeholder: placeholder, disabled: disabled, usePortal: false })),
        React.createElement(SavedSearchesDropdown, { currentExpressions: serializedExpressions, onLoadExpressions: handleLoadExpressions, storageKey: storageKey }),
        conflicts.length > 0 ? (React.createElement("div", { className: "filter-box-conflicts", role: "alert" },
            React.createElement("span", { className: "filter-box-conflicts__icon", "aria-hidden": "true" }, "\u26A0\uFE0F"),
            React.createElement("span", { className: "filter-box-conflicts__message" }, conflicts.length === 1
                ? (_b = conflicts[0]) === null || _b === void 0 ? void 0 : _b.reason
                : "".concat(conflicts.length, " filter conflicts: ").concat(conflicts.map(function (c) { return c.reason; }).join('; '))))) : null));
};

/**
 * Simple loading spinner component for consistent loading states.
 * Includes ARIA attributes for screen reader announcements.
 */
var LoadingSpinner = function (_a) {
    var _b = _a.message, message = _b === void 0 ? 'Loading...' : _b, _c = _a.className, className = _c === void 0 ? 'loading' : _c;
    return (React.createElement("div", { className: className, role: "status", "aria-live": "polite", "aria-busy": "true" },
        React.createElement("span", { className: "visually-hidden" }, message),
        message));
};

/**
 * Single page link component for pagination controls.
 * Memoized to prevent unnecessary re-renders when pagination state changes.
 *
 * @param props - Component props
 * @returns Pagination link element
 */
var PageLink = reactExports.memo(function (_a) {
    var label = _a.label, page = _a.page, isDisabled = _a.isDisabled, isActive = _a.isActive, onPage = _a.onPage;
    var pageClicked = reactExports.useCallback(function (e) {
        e.preventDefault();
        if (!isDisabled) {
            onPage(page);
        }
    }, [isDisabled, onPage, page]);
    return (React.createElement("li", { role: "menuitem", className: "page-item ".concat(isActive ? 'active' : '', " ").concat(isDisabled ? 'disabled' : ''), key: label },
        React.createElement("button", { type: "button", className: "page-link ".concat(isDisabled ? 'disabled' : ''), onClick: pageClicked, disabled: isDisabled, style: { border: 'none', padding: '4px 8px', cursor: isDisabled ? 'default' : 'pointer' } }, label)));
});
PageLink.displayName = 'PageLink';

/**
 * Pagination component for navigating through paged data.
 * Renders first/previous/next/last links and page numbers.
 */
var Pagination = function (_a) {
    var currentPage = _a.currentPage, total = _a.total, perPage = _a.perPage, onPage = _a.onPage, _b = _a.showPages, showPages = _b === void 0 ? 7 : _b;
    var range = function (start, end) {
        var length = end - start + 1;
        return Array.from({ length: length }, function (_, idx) { return idx + start; });
    };
    var pageCount = React.useMemo(function () {
        return Math.ceil(total / perPage);
    }, [total, perPage]);
    var paginationRange = React.useMemo(function () {
        if (pageCount < showPages) {
            return range(1, pageCount);
        }
        if (currentPage > pageCount - Math.floor(showPages / 2)) {
            return range(pageCount - showPages + 1, pageCount);
        }
        if (currentPage > Math.floor(showPages / 2)) {
            return range(currentPage - Math.floor(showPages / 2), currentPage + Math.floor(showPages / 2));
        }
        return range(1, showPages);
        // pageCount is derived from total/perPage, so we don't need them as deps
    }, [showPages, currentPage, pageCount]);
    var pageClicked = reactExports.useCallback(function (page) {
        onPage((page - 1) * perPage, page);
    }, [onPage, perPage]);
    return (React.createElement("nav", null, pageCount > 1 && (React.createElement("ul", { className: "pagination-sm pagination", role: "menu" },
        React.createElement(PageLink, { label: "First", page: 1, isActive: false, isDisabled: currentPage === 1, onPage: pageClicked }),
        React.createElement(PageLink, { label: "Previous", page: currentPage - 1, isActive: false, isDisabled: currentPage === 1, onPage: pageClicked }),
        paginationRange.map(function (page) { return (React.createElement(PageLink, { key: page, label: String(page), page: page, isActive: currentPage === page, isDisabled: false, onPage: pageClicked })); }),
        React.createElement(PageLink, { label: "Next", page: currentPage + 1, isActive: false, isDisabled: currentPage === pageCount, onPage: pageClicked }),
        React.createElement(PageLink, { label: "Last", page: pageCount, isActive: false, isDisabled: currentPage === pageCount, onPage: pageClicked })))));
};

// THIS FILE IS AUTO GENERATED
function GoChevronDown (props) {
  return GenIcon({"attr":{"viewBox":"0 0 24 24"},"child":[{"tag":"path","attr":{"d":"M5.22 8.22a.749.749 0 0 0 0 1.06l6.25 6.25a.749.749 0 0 0 1.06 0l6.25-6.25a.749.749 0 1 0-1.06-1.06L12 13.939 6.28 8.22a.749.749 0 0 0-1.06 0Z"},"child":[]}]})(props);
}function GoChevronUp (props) {
  return GenIcon({"attr":{"viewBox":"0 0 24 24"},"child":[{"tag":"path","attr":{"d":"M18.78 15.78a.749.749 0 0 1-1.06 0L12 10.061 6.28 15.78a.749.749 0 1 1-1.06-1.06l6.25-6.25a.749.749 0 0 1 1.06 0l6.25 6.25a.749.749 0 0 1 0 1.06Z"},"child":[]}]})(props);
}

// THIS FILE IS AUTO GENERATED
function TiMinus (props) {
  return GenIcon({"attr":{"version":"1.2","baseProfile":"tiny","viewBox":"0 0 24 24"},"child":[{"tag":"path","attr":{"d":"M18 11h-12c-1.104 0-2 .896-2 2s.896 2 2 2h12c1.104 0 2-.896 2-2s-.896-2-2-2z"},"child":[]}]})(props);
}

var reactTable = {exports: {}};

var reactTable_production_min$1 = {exports: {}};

var reactTable_production_min = reactTable_production_min$1.exports;

var hasRequiredReactTable_production_min;

function requireReactTable_production_min () {
	if (hasRequiredReactTable_production_min) return reactTable_production_min$1.exports;
	hasRequiredReactTable_production_min = 1;
	(function (module, exports) {
		!function(e,t){t(exports,requireReact());}(reactTable_production_min,(function(e,t){function n(e,t,n,o,r,i,u){try{var l=e[i](u),s=l.value;}catch(e){return void n(e)}l.done?t(s):Promise.resolve(s).then(o,r);}function o(e){return function(){var t=this,o=arguments;return new Promise((function(r,i){var u=e.apply(t,o);function l(e){n(u,r,i,l,s,"next",e);}function s(e){n(u,r,i,l,s,"throw",e);}l(void 0);}))}}function r(){return (r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o]);}return e}).apply(this,arguments)}function i(e,t){if(null==e)return {};var n,o,r={},i=Object.keys(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}function u(e){var t=function(e,t){if("object"!=typeof e||null===e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var o=n.call(e,t);if("object"!=typeof o)return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return (String)(e)}(e,"string");return "symbol"==typeof t?t:String(t)}t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;var l={init:"init"},s=function(e){var t=e.value;return void 0===t?"":t},a=function(){return t.createElement(t.Fragment,null," ")},c={Cell:s,width:150,minWidth:0,maxWidth:Number.MAX_SAFE_INTEGER};function d(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return t.reduce((function(e,t){var n=t.style,o=t.className;return e=r({},e,{},i(t,["style","className"])),n&&(e.style=e.style?r({},e.style||{},{},n||{}):n),o&&(e.className=e.className?e.className+" "+o:o),""===e.className&&delete e.className,e}),{})}var f=function(e,t){return void 0===t&&(t={}),function(n){return void 0===n&&(n={}),[].concat(e,[n]).reduce((function(e,o){return function e(t,n,o){return "function"==typeof n?e({},n(t,o)):Array.isArray(n)?d.apply(void 0,[t].concat(n)):d(t,n)}(e,o,r({},t,{userProps:n}))}),{})}},p=function(e,t,n,o){return void 0===n&&(n={}),e.reduce((function(e,t){return t(e,n)}),t)},g=function(e,t,n){return void 0===n&&(n={}),e.forEach((function(e){e(t,n);}))};function v(e,t,n,o){e.findIndex((function(e){return e.pluginName===n}));t.forEach((function(t){e.findIndex((function(e){return e.pluginName===t}));}));}function m(e,t){return "function"==typeof e?e(t):e}function h(e){var n=t.useRef();return n.current=e,t.useCallback((function(){return n.current}),[])}var y="undefined"!=typeof document?t.useLayoutEffect:t.useEffect;function w(e,n){var o=t.useRef(false);y((function(){o.current&&e(),o.current=true;}),n);}function R(e,t,n){return void 0===n&&(n={}),function(o,i){ void 0===i&&(i={});var u="string"==typeof o?t[o]:o;if(void 0===u)throw console.info(t),new Error("Renderer Error ☝️");return b(u,r({},e,{column:t},n,{},i))}}function b(e,n){return function(e){return "function"==typeof e&&((t=Object.getPrototypeOf(e)).prototype&&t.prototype.isReactComponent);var t;}(o=e)||"function"==typeof o||function(e){return "object"==typeof e&&"symbol"==typeof e.$$typeof&&["react.memo","react.forward_ref"].includes(e.$$typeof.description)}(o)?t.createElement(e,n):e;var o;}function S(e,t,n){return void 0===n&&(n=0),e.map((function(e){return x(e=r({},e,{parent:t,depth:n})),e.columns&&(e.columns=S(e.columns,e,n+1)),e}))}function C(e){return G(e,"columns")}function x(e){var t=e.id,n=e.accessor,o=e.Header;if("string"==typeof n){t=t||n;var r=n.split(".");n=function(e){return function(e,t,n){if(!t)return e;var o,r="function"==typeof t?t:JSON.stringify(t),i=E.get(r)||function(){var e=function(e){return function e(t,n){ void 0===n&&(n=[]);if(Array.isArray(t))for(var o=0;o<t.length;o+=1)e(t[o],n);else n.push(t);return n}(e).map((function(e){return String(e).replace(".","_")})).join(".").replace(T,".").replace(O,"").split(".")}(t);return E.set(r,e),e}();try{o=i.reduce((function(e,t){return e[t]}),e);}catch(e){}return void 0!==o?o:n}(e,r)};}if(!t&&"string"==typeof o&&o&&(t=o),!t&&e.columns)throw console.error(e),new Error('A column ID (or unique "Header" value) is required!');if(!t)throw console.error(e),new Error("A column ID (or string accessor) is required!");return Object.assign(e,{id:t,accessor:n}),e}function P(e,t){if(!t)throw new Error;return Object.assign(e,r({Header:a,Footer:a},c,{},t,{},e)),Object.assign(e,{originalWidth:e.width}),e}function B(e,t,n){ void 0===n&&(n=function(){return {}});for(var o=[],i=e,u=0,l=function(){return u++},s=function(){var e={headers:[]},u=[],s=i.some((function(e){return e.parent}));i.forEach((function(o){var i,a=[].concat(u).reverse()[0];if(s){if(o.parent)i=r({},o.parent,{originalId:o.parent.id,id:o.parent.id+"_"+l(),headers:[o]},n(o));else i=P(r({originalId:o.id+"_placeholder",id:o.id+"_placeholder_"+l(),placeholderOf:o,headers:[o]},n(o)),t);a&&a.originalId===i.originalId?a.headers.push(o):u.push(i);}e.headers.push(o);})),o.push(e),i=u;};i.length;)s();return o.reverse()}var E=new Map;function I(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];for(var o=0;o<t.length;o+=1)if(void 0!==t[o])return t[o]}function F(e){if("function"==typeof e)return e}function G(e,t){var n=[];return function e(o){o.forEach((function(o){o[t]?e(o[t]):n.push(o);}));}(e),n}function A(e,t){var n=t.manualExpandedKey,o=t.expanded,r=t.expandSubRows,i=void 0===r||r,u=[];return e.forEach((function(e){return function e(t,r){ void 0===r&&(r=true),t.isExpanded=t.original&&t.original[n]||o[t.id],t.canExpand=t.subRows&&!!t.subRows.length,r&&u.push(t),t.subRows&&t.subRows.length&&t.isExpanded&&t.subRows.forEach((function(t){return e(t,i)}));}(e)})),u}function k(e,t,n){return F(e)||t[e]||n[e]||n.text}function H(e,t,n){return e?e(t,n):void 0===t}function W(){throw new Error("React-Table: You have not called prepareRow(row) one or more rows you are attempting to render.")}var z=null;var T=/\[/g,O=/\]/g;var M=function(e){return r({role:"table"},e)},j=function(e){return r({role:"rowgroup"},e)},L=function(e,t){var n=t.column;return r({key:"header_"+n.id,colSpan:n.totalVisibleHeaderCount,role:"columnheader"},e)},N=function(e,t){var n=t.column;return r({key:"footer_"+n.id,colSpan:n.totalVisibleHeaderCount},e)},D=function(e,t){return r({key:"headerGroup_"+t.index,role:"row"},e)},V=function(e,t){return r({key:"footerGroup_"+t.index},e)},_=function(e,t){return r({key:"row_"+t.row.id,role:"row"},e)},X=function(e,t){var n=t.cell;return r({key:"cell_"+n.row.id+"_"+n.column.id,role:"cell"},e)};function q(){return {useOptions:[],stateReducers:[],useControlledState:[],columns:[],columnsDeps:[],allColumns:[],allColumnsDeps:[],accessValue:[],materializedColumns:[],materializedColumnsDeps:[],useInstanceAfterData:[],visibleColumns:[],visibleColumnsDeps:[],headerGroups:[],headerGroupsDeps:[],useInstanceBeforeDimensions:[],useInstance:[],prepareRow:[],getTableProps:[M],getTableBodyProps:[j],getHeaderGroupProps:[D],getFooterGroupProps:[V],getHeaderProps:[L],getFooterProps:[N],getRowProps:[_],getCellProps:[X],useFinalInstance:[]}}l.resetHiddenColumns="resetHiddenColumns",l.toggleHideColumn="toggleHideColumn",l.setHiddenColumns="setHiddenColumns",l.toggleHideAllColumns="toggleHideAllColumns";var K=function(e){e.getToggleHiddenProps=[U],e.getToggleHideAllColumnsProps=[$],e.stateReducers.push(J),e.useInstanceBeforeDimensions.push(Y),e.headerGroupsDeps.push((function(e,t){var n=t.instance;return [].concat(e,[n.state.hiddenColumns])})),e.useInstance.push(Q);};K.pluginName="useColumnVisibility";var U=function(e,t){var n=t.column;return [e,{onChange:function(e){n.toggleHidden(!e.target.checked);},style:{cursor:"pointer"},checked:n.isVisible,title:"Toggle Column Visible"}]},$=function(e,t){var n=t.instance;return [e,{onChange:function(e){n.toggleHideAllColumns(!e.target.checked);},style:{cursor:"pointer"},checked:!n.allColumnsHidden&&!n.state.hiddenColumns.length,title:"Toggle All Columns Hidden",indeterminate:!n.allColumnsHidden&&n.state.hiddenColumns.length}]};function J(e,t,n,o){if(t.type===l.init)return r({hiddenColumns:[]},e);if(t.type===l.resetHiddenColumns)return r({},e,{hiddenColumns:o.initialState.hiddenColumns||[]});if(t.type===l.toggleHideColumn){var i=(void 0!==t.value?t.value:!e.hiddenColumns.includes(t.columnId))?[].concat(e.hiddenColumns,[t.columnId]):e.hiddenColumns.filter((function(e){return e!==t.columnId}));return r({},e,{hiddenColumns:i})}return t.type===l.setHiddenColumns?r({},e,{hiddenColumns:m(t.value,e.hiddenColumns)}):t.type===l.toggleHideAllColumns?r({},e,{hiddenColumns:(void 0!==t.value?t.value:!e.hiddenColumns.length)?o.allColumns.map((function(e){return e.id})):[]}):void 0}function Y(e){var n=e.headers,o=e.state.hiddenColumns;t.useRef(false).current;var r=0;n.forEach((function(e){return r+=function e(t,n){t.isVisible=n&&!o.includes(t.id);var r=0;return t.headers&&t.headers.length?t.headers.forEach((function(n){return r+=e(n,t.isVisible)})):r=t.isVisible?1:0,t.totalVisibleHeaderCount=r,r}(e,true)}));}function Q(e){var n=e.columns,o=e.flatHeaders,r=e.dispatch,i=e.allColumns,u=e.getHooks,s=e.state.hiddenColumns,a=e.autoResetHiddenColumns,c=void 0===a||a,d=h(e),p=i.length===s.length,g=t.useCallback((function(e,t){return r({type:l.toggleHideColumn,columnId:e,value:t})}),[r]),v=t.useCallback((function(e){return r({type:l.setHiddenColumns,value:e})}),[r]),m=t.useCallback((function(e){return r({type:l.toggleHideAllColumns,value:e})}),[r]),y=f(u().getToggleHideAllColumnsProps,{instance:d()});o.forEach((function(e){e.toggleHidden=function(t){r({type:l.toggleHideColumn,columnId:e.id,value:t});},e.getToggleHiddenProps=f(u().getToggleHiddenProps,{instance:d(),column:e});}));var R=h(c);w((function(){R()&&r({type:l.resetHiddenColumns});}),[r,n]),Object.assign(e,{allColumnsHidden:p,toggleHideColumn:g,setHiddenColumns:v,toggleHideAllColumns:m,getToggleHideAllColumnsProps:y});}var Z={},ee={},te=function(e,t,n){return e},ne=function(e,t){return e.subRows||[]},oe=function(e,t,n){return ""+(n?[n.id,t].join("."):t)},re=function(e){return e};function ie(e){var t=e.initialState,n=void 0===t?Z:t,o=e.defaultColumn,u=void 0===o?ee:o,l=e.getSubRows,s=void 0===l?ne:l,a=e.getRowId,c=void 0===a?oe:a,d=e.stateReducer,f=void 0===d?te:d,p=e.useControlledState,g=void 0===p?re:p;return r({},i(e,["initialState","defaultColumn","getSubRows","getRowId","stateReducer","useControlledState"]),{initialState:n,defaultColumn:u,getSubRows:s,getRowId:c,stateReducer:f,useControlledState:g})}function ue(e,t){ void 0===t&&(t=0);var n=0,o=0,r=0,i=0;return e.forEach((function(e){var u=e.headers;if(e.totalLeft=t,u&&u.length){var l=ue(u,t),s=l[0],a=l[1],c=l[2],d=l[3];e.totalMinWidth=s,e.totalWidth=a,e.totalMaxWidth=c,e.totalFlexWidth=d;}else e.totalMinWidth=e.minWidth,e.totalWidth=Math.min(Math.max(e.minWidth,e.width),e.maxWidth),e.totalMaxWidth=e.maxWidth,e.totalFlexWidth=e.canResize?e.totalWidth:0;e.isVisible&&(t+=e.totalWidth,n+=e.totalMinWidth,o+=e.totalWidth,r+=e.totalMaxWidth,i+=e.totalFlexWidth);})),[n,o,r,i]}function le(e){var t=e.data,n=e.rows,o=e.flatRows,r=e.rowsById,i=e.column,u=e.getRowId,l=e.getSubRows,s=e.accessValueHooks,a=e.getInstance;t.forEach((function(e,c){return function e(n,c,d,f,g){ void 0===d&&(d=0);var v=n,m=u(n,c,f),h=r[m];if(h)h.subRows&&h.originalSubRows.forEach((function(t,n){return e(t,n,d+1,h)}));else if((h={id:m,original:v,index:c,depth:d,cells:[{}]}).cells.map=W,h.cells.filter=W,h.cells.forEach=W,h.cells[0].getCellProps=W,h.values={},g.push(h),o.push(h),r[m]=h,h.originalSubRows=l(n,c),h.originalSubRows){var y=[];h.originalSubRows.forEach((function(t,n){return e(t,n,d+1,h,y)})),h.subRows=y;}i.accessor&&(h.values[i.id]=i.accessor(n,c,h,g,t)),h.values[i.id]=p(s,h.values[i.id],{row:h,column:i,instance:a()});}(e,c,0,void 0,n)}));}l.resetExpanded="resetExpanded",l.toggleRowExpanded="toggleRowExpanded",l.toggleAllRowsExpanded="toggleAllRowsExpanded";var se=function(e){e.getToggleAllRowsExpandedProps=[ae],e.getToggleRowExpandedProps=[ce],e.stateReducers.push(de),e.useInstance.push(fe),e.prepareRow.push(pe);};se.pluginName="useExpanded";var ae=function(e,t){var n=t.instance;return [e,{onClick:function(e){n.toggleAllRowsExpanded();},style:{cursor:"pointer"},title:"Toggle All Rows Expanded"}]},ce=function(e,t){var n=t.row;return [e,{onClick:function(){n.toggleRowExpanded();},style:{cursor:"pointer"},title:"Toggle Row Expanded"}]};function de(e,t,n,o){if(t.type===l.init)return r({expanded:{}},e);if(t.type===l.resetExpanded)return r({},e,{expanded:o.initialState.expanded||{}});if(t.type===l.toggleAllRowsExpanded){var s=t.value,a=o.rowsById,c=Object.keys(a).length===Object.keys(e.expanded).length;if(void 0!==s?s:!c){var d={};return Object.keys(a).forEach((function(e){d[e]=true;})),r({},e,{expanded:d})}return r({},e,{expanded:{}})}if(t.type===l.toggleRowExpanded){var f,p=t.id,g=t.value,v=e.expanded[p],m=void 0!==g?g:!v;if(!v&&m)return r({},e,{expanded:r({},e.expanded,(f={},f[p]=true,f))});if(v&&!m){var h=e.expanded;h[p];return r({},e,{expanded:i(h,[p].map(u))})}return e}}function fe(e){var n=e.data,o=e.rows,r=e.rowsById,i=e.manualExpandedKey,u=void 0===i?"expanded":i,s=e.paginateExpandedRows,a=void 0===s||s,c=e.expandSubRows,d=void 0===c||c,p=e.autoResetExpanded,g=void 0===p||p,m=e.getHooks,y=e.plugins,R=e.state.expanded,b=e.dispatch;v(y,["useSortBy","useGroupBy","usePivotColumns","useGlobalFilter"],"useExpanded");var S=h(g),C=Boolean(Object.keys(r).length&&Object.keys(R).length);C&&Object.keys(r).some((function(e){return !R[e]}))&&(C=false),w((function(){S()&&b({type:l.resetExpanded});}),[b,n]);var x=t.useCallback((function(e,t){b({type:l.toggleRowExpanded,id:e,value:t});}),[b]),P=t.useCallback((function(e){return b({type:l.toggleAllRowsExpanded,value:e})}),[b]),B=t.useMemo((function(){return a?A(o,{manualExpandedKey:u,expanded:R,expandSubRows:d}):o}),[a,o,u,R,d]),E=t.useMemo((function(){return function(e){var t=0;return Object.keys(e).forEach((function(e){var n=e.split(".");t=Math.max(t,n.length);})),t}(R)}),[R]),I=h(e),F=f(m().getToggleAllRowsExpandedProps,{instance:I()});Object.assign(e,{preExpandedRows:o,expandedRows:B,rows:B,expandedDepth:E,isAllRowsExpanded:C,toggleRowExpanded:x,toggleAllRowsExpanded:P,getToggleAllRowsExpandedProps:F});}function pe(e,t){var n=t.instance.getHooks,o=t.instance;e.toggleRowExpanded=function(t){return o.toggleRowExpanded(e.id,t)},e.getToggleRowExpandedProps=f(n().getToggleRowExpandedProps,{instance:o,row:e});}var ge=function(e,t,n){return e=e.filter((function(e){return t.some((function(t){var o=e.values[t];return String(o).toLowerCase().includes(String(n).toLowerCase())}))}))};ge.autoRemove=function(e){return !e};var ve=function(e,t,n){return e.filter((function(e){return t.some((function(t){var o=e.values[t];return void 0===o||String(o).toLowerCase()===String(n).toLowerCase()}))}))};ve.autoRemove=function(e){return !e};var me=function(e,t,n){return e.filter((function(e){return t.some((function(t){var o=e.values[t];return void 0===o||String(o)===String(n)}))}))};me.autoRemove=function(e){return !e};var he=function(e,t,n){return e.filter((function(e){return t.some((function(t){return e.values[t].includes(n)}))}))};he.autoRemove=function(e){return !e||!e.length};var ye=function(e,t,n){return e.filter((function(e){return t.some((function(t){var o=e.values[t];return o&&o.length&&n.every((function(e){return o.includes(e)}))}))}))};ye.autoRemove=function(e){return !e||!e.length};var we=function(e,t,n){return e.filter((function(e){return t.some((function(t){var o=e.values[t];return o&&o.length&&n.some((function(e){return o.includes(e)}))}))}))};we.autoRemove=function(e){return !e||!e.length};var Re=function(e,t,n){return e.filter((function(e){return t.some((function(t){var o=e.values[t];return n.includes(o)}))}))};Re.autoRemove=function(e){return !e||!e.length};var be=function(e,t,n){return e.filter((function(e){return t.some((function(t){return e.values[t]===n}))}))};be.autoRemove=function(e){return void 0===e};var Se=function(e,t,n){return e.filter((function(e){return t.some((function(t){return e.values[t]==n}))}))};Se.autoRemove=function(e){return null==e};var Ce=function(e,t,n){var o=n||[],r=o[0],i=o[1];if((r="number"==typeof r?r:-1/0)>(i="number"==typeof i?i:1/0)){var u=r;r=i,i=u;}return e.filter((function(e){return t.some((function(t){var n=e.values[t];return n>=r&&n<=i}))}))};Ce.autoRemove=function(e){return !e||"number"!=typeof e[0]&&"number"!=typeof e[1]};var xe=Object.freeze({__proto__:null,text:ge,exactText:ve,exactTextCase:me,includes:he,includesAll:ye,includesSome:we,includesValue:Re,exact:be,equals:Se,between:Ce});l.resetFilters="resetFilters",l.setFilter="setFilter",l.setAllFilters="setAllFilters";var Pe=function(e){e.stateReducers.push(Be),e.useInstance.push(Ee);};function Be(e,t,n,o){if(t.type===l.init)return r({filters:[]},e);if(t.type===l.resetFilters)return r({},e,{filters:o.initialState.filters||[]});if(t.type===l.setFilter){var i=t.columnId,u=t.filterValue,s=o.allColumns,a=o.filterTypes,c=s.find((function(e){return e.id===i}));if(!c)throw new Error("React-Table: Could not find a column with id: "+i);var d=k(c.filter,a||{},xe),f=e.filters.find((function(e){return e.id===i})),p=m(u,f&&f.value);return H(d.autoRemove,p,c)?r({},e,{filters:e.filters.filter((function(e){return e.id!==i}))}):r({},e,f?{filters:e.filters.map((function(e){return e.id===i?{id:i,value:p}:e}))}:{filters:[].concat(e.filters,[{id:i,value:p}])})}if(t.type===l.setAllFilters){var g=t.filters,v=o.allColumns,h=o.filterTypes;return r({},e,{filters:m(g,e.filters).filter((function(e){var t=v.find((function(t){return t.id===e.id}));return !H(k(t.filter,h||{},xe).autoRemove,e.value,t)}))})}}function Ee(e){var n=e.data,o=e.rows,r=e.flatRows,i=e.rowsById,u=e.allColumns,s=e.filterTypes,a=e.manualFilters,c=e.defaultCanFilter,d=void 0!==c&&c,f=e.disableFilters,p=e.state.filters,g=e.dispatch,v=e.autoResetFilters,m=void 0===v||v,y=t.useCallback((function(e,t){g({type:l.setFilter,columnId:e,filterValue:t});}),[g]),R=t.useCallback((function(e){g({type:l.setAllFilters,filters:e});}),[g]);u.forEach((function(e){var t=e.id,n=e.accessor,o=e.defaultCanFilter,r=e.disableFilters;e.canFilter=n?I(true!==r&&void 0,true!==f&&void 0,true):I(o,d,false),e.setFilter=function(t){return y(e.id,t)};var i=p.find((function(e){return e.id===t}));e.filterValue=i&&i.value;}));var b=t.useMemo((function(){if(a||!p.length)return [o,r,i];var e=[],t={};return [function n(o,r){ void 0===r&&(r=0);var i=o;return (i=p.reduce((function(e,t){var n=t.id,o=t.value,i=u.find((function(e){return e.id===n}));if(!i)return e;0===r&&(i.preFilteredRows=e);var l=k(i.filter,s||{},xe);return l?(i.filteredRows=l(e,[n],o),i.filteredRows):(console.warn("Could not find a valid 'column.filter' for column with the ID: "+i.id+"."),e)}),o)).forEach((function(o){e.push(o),t[o.id]=o,o.subRows&&(o.subRows=o.subRows&&o.subRows.length>0?n(o.subRows,r+1):o.subRows);})),i}(o),e,t]}),[a,p,o,r,i,u,s]),S=b[0],C=b[1],x=b[2];t.useMemo((function(){u.filter((function(e){return !p.find((function(t){return t.id===e.id}))})).forEach((function(e){e.preFilteredRows=S,e.filteredRows=S;}));}),[S,p,u]);var P=h(m);w((function(){P()&&g({type:l.resetFilters});}),[g,a?null:n]),Object.assign(e,{preFilteredRows:o,preFilteredFlatRows:r,preFilteredRowsById:i,filteredRows:S,filteredFlatRows:C,filteredRowsById:x,rows:S,flatRows:C,rowsById:x,setFilter:y,setAllFilters:R});}Pe.pluginName="useFilters",l.resetGlobalFilter="resetGlobalFilter",l.setGlobalFilter="setGlobalFilter";var Ie=function(e){e.stateReducers.push(Fe),e.useInstance.push(Ge);};function Fe(e,t,n,o){if(t.type===l.resetGlobalFilter)return r({},e,{globalFilter:o.initialState.globalFilter||void 0});if(t.type===l.setGlobalFilter){var u=t.filterValue,s=o.userFilterTypes,a=k(o.globalFilter,s||{},xe),c=m(u,e.globalFilter);if(H(a.autoRemove,c)){e.globalFilter;return i(e,["globalFilter"])}return r({},e,{globalFilter:c})}}function Ge(e){var n=e.data,o=e.rows,r=e.flatRows,i=e.rowsById,u=e.allColumns,s=e.filterTypes,a=e.globalFilter,c=e.manualGlobalFilter,d=e.state.globalFilter,f=e.dispatch,p=e.autoResetGlobalFilter,g=void 0===p||p,v=e.disableGlobalFilter,m=t.useCallback((function(e){f({type:l.setGlobalFilter,filterValue:e});}),[f]),y=t.useMemo((function(){if(c||void 0===d)return [o,r,i];var e=[],t={},n=k(a,s||{},xe);if(!n)return console.warn("Could not find a valid 'globalFilter' option."),o;u.forEach((function(e){var t=e.disableGlobalFilter;e.canFilter=I(true!==t&&void 0,true!==v&&void 0,true);}));var l=u.filter((function(e){return  true===e.canFilter}));return [function o(r){return (r=n(r,l.map((function(e){return e.id})),d)).forEach((function(n){e.push(n),t[n.id]=n,n.subRows=n.subRows&&n.subRows.length?o(n.subRows):n.subRows;})),r}(o),e,t]}),[c,d,a,s,u,o,r,i,v]),R=y[0],b=y[1],S=y[2],C=h(g);w((function(){C()&&f({type:l.resetGlobalFilter});}),[f,c?null:n]),Object.assign(e,{preGlobalFilteredRows:o,preGlobalFilteredFlatRows:r,preGlobalFilteredRowsById:i,globalFilteredRows:R,globalFilteredFlatRows:b,globalFilteredRowsById:S,rows:R,flatRows:b,rowsById:S,setGlobalFilter:m,disableGlobalFilter:v});}function Ae(e,t){return t.reduce((function(e,t){return e+("number"==typeof t?t:0)}),0)}Ie.pluginName="useGlobalFilter";var ke=Object.freeze({__proto__:null,sum:Ae,min:function(e){var t=e[0]||0;return e.forEach((function(e){"number"==typeof e&&(t=Math.min(t,e));})),t},max:function(e){var t=e[0]||0;return e.forEach((function(e){"number"==typeof e&&(t=Math.max(t,e));})),t},minMax:function(e){var t=e[0]||0,n=e[0]||0;return e.forEach((function(e){"number"==typeof e&&(t=Math.min(t,e),n=Math.max(n,e));})),t+".."+n},average:function(e){return Ae(0,e)/e.length},median:function(e){if(!e.length)return null;var t=Math.floor(e.length/2),n=[].concat(e).sort((function(e,t){return e-t}));return e.length%2!=0?n[t]:(n[t-1]+n[t])/2},unique:function(e){return Array.from(new Set(e).values())},uniqueCount:function(e){return new Set(e).size},count:function(e){return e.length}}),He=[],We={};l.resetGroupBy="resetGroupBy",l.setGroupBy="setGroupBy",l.toggleGroupBy="toggleGroupBy";var ze=function(e){e.getGroupByToggleProps=[Te],e.stateReducers.push(Oe),e.visibleColumnsDeps.push((function(e,t){var n=t.instance;return [].concat(e,[n.state.groupBy])})),e.visibleColumns.push(Me),e.useInstance.push(Le),e.prepareRow.push(Ne);};ze.pluginName="useGroupBy";var Te=function(e,t){var n=t.header;return [e,{onClick:n.canGroupBy?function(e){e.persist(),n.toggleGroupBy();}:void 0,style:{cursor:n.canGroupBy?"pointer":void 0},title:"Toggle GroupBy"}]};function Oe(e,t,n,o){if(t.type===l.init)return r({groupBy:[]},e);if(t.type===l.resetGroupBy)return r({},e,{groupBy:o.initialState.groupBy||[]});if(t.type===l.setGroupBy)return r({},e,{groupBy:t.value});if(t.type===l.toggleGroupBy){var i=t.columnId,u=t.value,s=void 0!==u?u:!e.groupBy.includes(i);return r({},e,s?{groupBy:[].concat(e.groupBy,[i])}:{groupBy:e.groupBy.filter((function(e){return e!==i}))})}}function Me(e,t){var n=t.instance.state.groupBy,o=n.map((function(t){return e.find((function(e){return e.id===t}))})).filter(Boolean),r=e.filter((function(e){return !n.includes(e.id)}));return (e=[].concat(o,r)).forEach((function(e){e.isGrouped=n.includes(e.id),e.groupedIndex=n.indexOf(e.id);})),e}var je={};function Le(e){var n=e.data,o=e.rows,i=e.flatRows,u=e.rowsById,s=e.allColumns,a=e.flatHeaders,c=e.groupByFn,d=void 0===c?De:c,p=e.manualGroupBy,g=e.aggregations,m=void 0===g?je:g,y=e.plugins,R=e.state.groupBy,b=e.dispatch,S=e.autoResetGroupBy,C=void 0===S||S,x=e.disableGroupBy,P=e.defaultCanGroupBy,B=e.getHooks;v(y,["useColumnOrder","useFilters"],"useGroupBy");var E=h(e);s.forEach((function(t){var n=t.accessor,o=t.defaultGroupBy,r=t.disableGroupBy;t.canGroupBy=n?I(t.canGroupBy,true!==r&&void 0,true!==x&&void 0,true):I(t.canGroupBy,o,P,false),t.canGroupBy&&(t.toggleGroupBy=function(){return e.toggleGroupBy(t.id)}),t.Aggregated=t.Aggregated||t.Cell;}));var F=t.useCallback((function(e,t){b({type:l.toggleGroupBy,columnId:e,value:t});}),[b]),A=t.useCallback((function(e){b({type:l.setGroupBy,value:e});}),[b]);a.forEach((function(e){e.getGroupByToggleProps=f(B().getGroupByToggleProps,{instance:E(),header:e});}));var k=t.useMemo((function(){if(p||!R.length)return [o,i,u,He,We,i,u];var e=R.filter((function(e){return s.find((function(t){return t.id===e}))})),t=[],n={},l=[],a={},c=[],f={},g=function o(i,u,p){if(void 0===u&&(u=0),u===e.length)return i.map((function(e){return r({},e,{depth:u})}));var g=e[u],v=d(i,g);return Object.entries(v).map((function(r,i){var d=r[0],v=r[1],h=g+":"+d,y=o(v,u+1,h=p?p+">"+h:h),w=u?G(v,"leafRows"):v,R=function(t,n,o){var r={};return s.forEach((function(i){if(e.includes(i.id))r[i.id]=n[0]?n[0].values[i.id]:null;else {var u="function"==typeof i.aggregate?i.aggregate:m[i.aggregate]||ke[i.aggregate];if(u){var l=n.map((function(e){return e.values[i.id]})),s=t.map((function(e){var t=e.values[i.id];if(!o&&i.aggregateValue){var n="function"==typeof i.aggregateValue?i.aggregateValue:m[i.aggregateValue]||ke[i.aggregateValue];if(!n)throw console.info({column:i}),new Error("React Table: Invalid column.aggregateValue option for column listed above");t=n(t,e,i);}return t}));r[i.id]=u(s,l);}else {if(i.aggregate)throw console.info({column:i}),new Error("React Table: Invalid column.aggregate option for column listed above");r[i.id]=null;}}})),r}(w,v,u),b={id:h,isGrouped:true,groupByID:g,groupByVal:d,values:R,subRows:y,leafRows:w,depth:u,index:i};return y.forEach((function(e){t.push(e),n[e.id]=e,e.isGrouped?(l.push(e),a[e.id]=e):(c.push(e),f[e.id]=e);})),b}))}(o);return g.forEach((function(e){t.push(e),n[e.id]=e,e.isGrouped?(l.push(e),a[e.id]=e):(c.push(e),f[e.id]=e);})),[g,t,n,l,a,c,f]}),[p,R,o,i,u,s,m,d]),H=k[0],W=k[1],z=k[2],T=k[3],O=k[4],M=k[5],j=k[6],L=h(C);w((function(){L()&&b({type:l.resetGroupBy});}),[b,p?null:n]),Object.assign(e,{preGroupedRows:o,preGroupedFlatRow:i,preGroupedRowsById:u,groupedRows:H,groupedFlatRows:W,groupedRowsById:z,onlyGroupedFlatRows:T,onlyGroupedRowsById:O,nonGroupedFlatRows:M,nonGroupedRowsById:j,rows:H,flatRows:W,rowsById:z,toggleGroupBy:F,setGroupBy:A});}function Ne(e){e.allCells.forEach((function(t){var n;t.isGrouped=t.column.isGrouped&&t.column.id===e.groupByID,t.isPlaceholder=!t.isGrouped&&t.column.isGrouped,t.isAggregated=!t.isGrouped&&!t.isPlaceholder&&(null==(n=e.subRows)?void 0:n.length);}));}function De(e,t){return e.reduce((function(e,n,o){var r=""+n.values[t];return e[r]=Array.isArray(e[r])?e[r]:[],e[r].push(n),e}),{})}var Ve=/([0-9]+)/gm;function _e(e,t){return e===t?0:e>t?1:-1}function Xe(e,t,n){return [e.values[n],t.values[n]]}function qe(e){return "number"==typeof e?isNaN(e)||e===1/0||e===-1/0?"":String(e):"string"==typeof e?e:""}var Ke=Object.freeze({__proto__:null,alphanumeric:function(e,t,n){var o=Xe(e,t,n),r=o[0],i=o[1];for(r=qe(r),i=qe(i),r=r.split(Ve).filter(Boolean),i=i.split(Ve).filter(Boolean);r.length&&i.length;){var u=r.shift(),l=i.shift(),s=parseInt(u,10),a=parseInt(l,10),c=[s,a].sort();if(isNaN(c[0])){if(u>l)return 1;if(l>u)return  -1}else {if(isNaN(c[1]))return isNaN(s)?-1:1;if(s>a)return 1;if(a>s)return  -1}}return r.length-i.length},datetime:function(e,t,n){var o=Xe(e,t,n),r=o[0],i=o[1];return _e(r=r.getTime(),i=i.getTime())},basic:function(e,t,n){var o=Xe(e,t,n);return _e(o[0],o[1])},string:function(e,t,n){var o=Xe(e,t,n),r=o[0],i=o[1];for(r=r.split("").filter(Boolean),i=i.split("").filter(Boolean);r.length&&i.length;){var u=r.shift(),l=i.shift(),s=u.toLowerCase(),a=l.toLowerCase();if(s>a)return 1;if(a>s)return  -1;if(u>l)return 1;if(l>u)return  -1}return r.length-i.length},number:function(e,t,n){var o=Xe(e,t,n),r=o[0],i=o[1],u=/[^0-9.]/gi;return _e(r=Number(String(r).replace(u,"")),i=Number(String(i).replace(u,"")))}});l.resetSortBy="resetSortBy",l.setSortBy="setSortBy",l.toggleSortBy="toggleSortBy",l.clearSortBy="clearSortBy",c.sortType="alphanumeric",c.sortDescFirst=false;var Ue=function(e){e.getSortByToggleProps=[$e],e.stateReducers.push(Je),e.useInstance.push(Ye);};Ue.pluginName="useSortBy";var $e=function(e,t){var n=t.instance,o=t.column,r=n.isMultiSortEvent,i=void 0===r?function(e){return e.shiftKey}:r;return [e,{onClick:o.canSort?function(e){e.persist(),o.toggleSortBy(void 0,!n.disableMultiSort&&i(e));}:void 0,style:{cursor:o.canSort?"pointer":void 0},title:o.canSort?"Toggle SortBy":void 0}]};function Je(e,t,n,o){if(t.type===l.init)return r({sortBy:[]},e);if(t.type===l.resetSortBy)return r({},e,{sortBy:o.initialState.sortBy||[]});if(t.type===l.clearSortBy)return r({},e,{sortBy:e.sortBy.filter((function(e){return e.id!==t.columnId}))});if(t.type===l.setSortBy)return r({},e,{sortBy:t.sortBy});if(t.type===l.toggleSortBy){var i,u=t.columnId,s=t.desc,a=t.multi,c=o.allColumns,d=o.disableMultiSort,f=o.disableSortRemove,p=o.disableMultiRemove,g=o.maxMultiSortColCount,v=void 0===g?Number.MAX_SAFE_INTEGER:g,m=e.sortBy,h=c.find((function(e){return e.id===u})).sortDescFirst,y=m.find((function(e){return e.id===u})),w=m.findIndex((function(e){return e.id===u})),R=null!=s,b=[];return "toggle"!==(i=!d&&a?y?"toggle":"add":w!==m.length-1||1!==m.length?"replace":y?"toggle":"replace")||f||R||a&&p||!(y&&y.desc&&!h||!y.desc&&h)||(i="remove"),"replace"===i?b=[{id:u,desc:R?s:h}]:"add"===i?(b=[].concat(m,[{id:u,desc:R?s:h}])).splice(0,b.length-v):"toggle"===i?b=m.map((function(e){return e.id===u?r({},e,{desc:R?s:!y.desc}):e})):"remove"===i&&(b=m.filter((function(e){return e.id!==u}))),r({},e,{sortBy:b})}}function Ye(e){var n=e.data,o=e.rows,r=e.flatRows,i=e.allColumns,u=e.orderByFn,s=void 0===u?Qe:u,a=e.sortTypes,c=e.manualSortBy,d=e.defaultCanSort,p=e.disableSortBy,g=e.flatHeaders,m=e.state.sortBy,y=e.dispatch,R=e.plugins,b=e.getHooks,S=e.autoResetSortBy,C=void 0===S||S;v(R,["useFilters","useGlobalFilter","useGroupBy","usePivotColumns"],"useSortBy");var x=t.useCallback((function(e){y({type:l.setSortBy,sortBy:e});}),[y]),P=t.useCallback((function(e,t,n){y({type:l.toggleSortBy,columnId:e,desc:t,multi:n});}),[y]),B=h(e);g.forEach((function(e){var t=e.accessor,n=e.canSort,o=e.disableSortBy,r=e.id,i=t?I(true!==o&&void 0,true!==p&&void 0,true):I(d,n,false);e.canSort=i,e.canSort&&(e.toggleSortBy=function(t,n){return P(e.id,t,n)},e.clearSortBy=function(){y({type:l.clearSortBy,columnId:e.id});}),e.getSortByToggleProps=f(b().getSortByToggleProps,{instance:B(),column:e});var u=m.find((function(e){return e.id===r}));e.isSorted=!!u,e.sortedIndex=m.findIndex((function(e){return e.id===r})),e.isSortedDesc=e.isSorted?u.desc:void 0;}));var E=t.useMemo((function(){if(c||!m.length)return [o,r];var e=[],t=m.filter((function(e){return i.find((function(t){return t.id===e.id}))}));return [function n(o){var r=s(o,t.map((function(e){var t=i.find((function(t){return t.id===e.id}));if(!t)throw new Error("React-Table: Could not find a column with id: "+e.id+" while sorting");var n=t.sortType,o=F(n)||(a||{})[n]||Ke[n];if(!o)throw new Error("React-Table: Could not find a valid sortType of '"+n+"' for column '"+e.id+"'.");return function(t,n){return o(t,n,e.id,e.desc)}})),t.map((function(e){var t=i.find((function(t){return t.id===e.id}));return t&&t.sortInverted?e.desc:!e.desc})));return r.forEach((function(t){e.push(t),t.subRows&&0!==t.subRows.length&&(t.subRows=n(t.subRows));})),r}(o),e]}),[c,m,o,r,i,s,a]),G=E[0],A=E[1],k=h(C);w((function(){k()&&y({type:l.resetSortBy});}),[c?null:n]),Object.assign(e,{preSortedRows:o,preSortedFlatRows:r,sortedRows:G,sortedFlatRows:A,rows:G,flatRows:A,setSortBy:x,toggleSortBy:P});}function Qe(e,t,n){return [].concat(e).sort((function(e,o){for(var r=0;r<t.length;r+=1){var i=t[r],u=false===n[r]||"desc"===n[r],l=i(e,o);if(0!==l)return u?-l:l}return n[0]?e.index-o.index:o.index-e.index}))}l.resetPage="resetPage",l.gotoPage="gotoPage",l.setPageSize="setPageSize";var Ze=function(e){e.stateReducers.push(et),e.useInstance.push(tt);};function et(e,t,n,o){if(t.type===l.init)return r({pageSize:10,pageIndex:0},e);if(t.type===l.resetPage)return r({},e,{pageIndex:o.initialState.pageIndex||0});if(t.type===l.gotoPage){var i=o.pageCount,u=o.page,s=m(t.pageIndex,e.pageIndex),a=false;return s>e.pageIndex?a=-1===i?u.length>=e.pageSize:s<i:s<e.pageIndex&&(a=s>-1),a?r({},e,{pageIndex:s}):e}if(t.type===l.setPageSize){var c=t.pageSize,d=e.pageSize*e.pageIndex;return r({},e,{pageIndex:Math.floor(d/c),pageSize:c})}}function tt(e){var n=e.rows,o=e.autoResetPage,r=void 0===o||o,i=e.manualExpandedKey,u=void 0===i?"expanded":i,s=e.plugins,a=e.pageCount,c=e.paginateExpandedRows,d=void 0===c||c,f=e.expandSubRows,p=void 0===f||f,g=e.state,m=g.pageSize,y=g.pageIndex,R=g.expanded,b=g.globalFilter,S=g.filters,C=g.groupBy,x=g.sortBy,P=e.dispatch,B=e.data,E=e.manualPagination;v(s,["useGlobalFilter","useFilters","useGroupBy","useSortBy","useExpanded"],"usePagination");var I=h(r);w((function(){I()&&P({type:l.resetPage});}),[P,E?null:B,b,S,C,x]);var F=E?a:Math.ceil(n.length/m),G=t.useMemo((function(){return F>0?[].concat(new Array(F)).fill(null).map((function(e,t){return t})):[]}),[F]),k=t.useMemo((function(){var e;if(E)e=n;else {var t=m*y,o=t+m;e=n.slice(t,o);}return d?e:A(e,{manualExpandedKey:u,expanded:R,expandSubRows:p})}),[p,R,u,E,y,m,d,n]),H=y>0,W=-1===F?k.length>=m:y<F-1,z=t.useCallback((function(e){P({type:l.gotoPage,pageIndex:e});}),[P]),T=t.useCallback((function(){return z((function(e){return e-1}))}),[z]),O=t.useCallback((function(){return z((function(e){return e+1}))}),[z]),M=t.useCallback((function(e){P({type:l.setPageSize,pageSize:e});}),[P]);Object.assign(e,{pageOptions:G,pageCount:F,page:k,canPreviousPage:H,canNextPage:W,gotoPage:z,previousPage:T,nextPage:O,setPageSize:M});}Ze.pluginName="usePagination",l.resetPivot="resetPivot",l.togglePivot="togglePivot";var nt=function(e){e.getPivotToggleProps=[rt],e.stateReducers.push(it),e.useInstanceAfterData.push(ut),e.allColumns.push(lt),e.accessValue.push(st),e.materializedColumns.push(at),e.materializedColumnsDeps.push(ct),e.visibleColumns.push(dt),e.visibleColumnsDeps.push(ft),e.useInstance.push(pt),e.prepareRow.push(gt);};nt.pluginName="usePivotColumns";var ot=[],rt=function(e,t){var n=t.header;return [e,{onClick:n.canPivot?function(e){e.persist(),n.togglePivot();}:void 0,style:{cursor:n.canPivot?"pointer":void 0},title:"Toggle Pivot"}]};function it(e,t,n,o){if(t.type===l.init)return r({pivotColumns:ot},e);if(t.type===l.resetPivot)return r({},e,{pivotColumns:o.initialState.pivotColumns||ot});if(t.type===l.togglePivot){var i=t.columnId,u=t.value,s=void 0!==u?u:!e.pivotColumns.includes(i);return r({},e,s?{pivotColumns:[].concat(e.pivotColumns,[i])}:{pivotColumns:e.pivotColumns.filter((function(e){return e!==i}))})}}function ut(e){e.allColumns.forEach((function(t){t.isPivotSource=e.state.pivotColumns.includes(t.id);}));}function lt(e,t){var n=t.instance;return e.forEach((function(e){e.isPivotSource=n.state.pivotColumns.includes(e.id),e.uniqueValues=new Set;})),e}function st(e,t){var n=t.column;return n.uniqueValues&&void 0!==e&&n.uniqueValues.add(e),e}function at(e,t){var n=t.instance,o=n.allColumns,i=n.state;if(!i.pivotColumns.length||!i.groupBy||!i.groupBy.length)return e;var u=i.pivotColumns.map((function(e){return o.find((function(t){return t.id===e}))})).filter(Boolean),l=o.filter((function(e){return !e.isPivotSource&&!i.groupBy.includes(e.id)&&!i.pivotColumns.includes(e.id)})),s=C(function e(t,n,o){ void 0===t&&(t=0),void 0===o&&(o=[]);var i=u[t];return i?Array.from(i.uniqueValues).sort().map((function(u){var l=r({},i,{Header:i.PivotHeader||"string"==typeof i.header?i.Header+": "+u:u,isPivotGroup:true,parent:n,depth:t,id:n?n.id+"."+i.id+"."+u:i.id+"."+u,pivotValue:u});return l.columns=e(t+1,l,[].concat(o,[function(e){return e.values[i.id]===u}])),l})):l.map((function(e){return r({},e,{canPivot:false,isPivoted:true,parent:n,depth:t,id:""+(n?n.id+"."+e.id:e.id),accessor:function(t,n,r){if(o.every((function(e){return e(r)})))return r.values[e.id]}})}))}());return [].concat(e,s)}function ct(e,t){var n=t.instance.state,o=n.pivotColumns,r=n.groupBy;return [].concat(e,[o,r])}function dt(e,t){var n=t.instance.state;return e=e.filter((function(e){return !e.isPivotSource})),n.pivotColumns.length&&n.groupBy&&n.groupBy.length&&(e=e.filter((function(e){return e.isGrouped||e.isPivoted}))),e}function ft(e,t){var n=t.instance;return [].concat(e,[n.state.pivotColumns,n.state.groupBy])}function pt(e){var t=e.columns,n=e.allColumns,o=e.flatHeaders,r=e.getHooks,i=e.plugins,u=e.dispatch,s=e.autoResetPivot,a=void 0===s||s,c=e.manaulPivot,d=e.disablePivot,p=e.defaultCanPivot;v(i,["useGroupBy"],"usePivotColumns");var g=h(e);n.forEach((function(t){var n=t.accessor,o=t.defaultPivot,r=t.disablePivot;t.canPivot=n?I(t.canPivot,true!==r&&void 0,true!==d&&void 0,true):I(t.canPivot,o,p,false),t.canPivot&&(t.togglePivot=function(){return e.togglePivot(t.id)}),t.Aggregated=t.Aggregated||t.Cell;}));o.forEach((function(e){e.getPivotToggleProps=f(r().getPivotToggleProps,{instance:g(),header:e});}));var m=h(a);w((function(){m()&&u({type:l.resetPivot});}),[u,c?null:t]),Object.assign(e,{togglePivot:function(e,t){u({type:l.togglePivot,columnId:e,value:t});}});}function gt(e){e.allCells.forEach((function(e){e.isPivoted=e.column.isPivoted;}));}l.resetSelectedRows="resetSelectedRows",l.toggleAllRowsSelected="toggleAllRowsSelected",l.toggleRowSelected="toggleRowSelected",l.toggleAllPageRowsSelected="toggleAllPageRowsSelected";var vt=function(e){e.getToggleRowSelectedProps=[mt],e.getToggleAllRowsSelectedProps=[ht],e.getToggleAllPageRowsSelectedProps=[yt],e.stateReducers.push(wt),e.useInstance.push(Rt),e.prepareRow.push(bt);};vt.pluginName="useRowSelect";var mt=function(e,t){var n=t.instance,o=t.row,r=n.manualRowSelectedKey,i=void 0===r?"isSelected":r;return [e,{onChange:function(e){o.toggleRowSelected(e.target.checked);},style:{cursor:"pointer"},checked:!(!o.original||!o.original[i])||o.isSelected,title:"Toggle Row Selected",indeterminate:o.isSomeSelected}]},ht=function(e,t){var n=t.instance;return [e,{onChange:function(e){n.toggleAllRowsSelected(e.target.checked);},style:{cursor:"pointer"},checked:n.isAllRowsSelected,title:"Toggle All Rows Selected",indeterminate:Boolean(!n.isAllRowsSelected&&Object.keys(n.state.selectedRowIds).length)}]},yt=function(e,t){var n=t.instance;return [e,{onChange:function(e){n.toggleAllPageRowsSelected(e.target.checked);},style:{cursor:"pointer"},checked:n.isAllPageRowsSelected,title:"Toggle All Current Page Rows Selected",indeterminate:Boolean(!n.isAllPageRowsSelected&&n.page.some((function(e){var t=e.id;return n.state.selectedRowIds[t]})))}]};function wt(e,t,n,o){if(t.type===l.init)return r({selectedRowIds:{}},e);if(t.type===l.resetSelectedRows)return r({},e,{selectedRowIds:o.initialState.selectedRowIds||{}});if(t.type===l.toggleAllRowsSelected){var i=t.value,u=o.isAllRowsSelected,s=o.rowsById,a=o.nonGroupedRowsById,c=void 0===a?s:a,d=void 0!==i?i:!u,f=Object.assign({},e.selectedRowIds);return d?Object.keys(c).forEach((function(e){f[e]=true;})):Object.keys(c).forEach((function(e){delete f[e];})),r({},e,{selectedRowIds:f})}if(t.type===l.toggleRowSelected){var p=t.id,g=t.value,v=o.rowsById,m=o.selectSubRows,h=void 0===m||m,y=o.getSubRows,w=e.selectedRowIds[p],R=void 0!==g?g:!w;if(w===R)return e;var b=r({},e.selectedRowIds);return function e(t){var n=v[t];if(n&&(n.isGrouped||(R?b[t]=true:delete b[t]),h&&y(n)))return y(n).forEach((function(t){return e(t.id)}))}(p),r({},e,{selectedRowIds:b})}if(t.type===l.toggleAllPageRowsSelected){var S=t.value,C=o.page,x=o.rowsById,P=o.selectSubRows,B=void 0===P||P,E=o.isAllPageRowsSelected,I=o.getSubRows,F=void 0!==S?S:!E,G=r({},e.selectedRowIds);return C.forEach((function(e){return function e(t){var n=x[t];if(n.isGrouped||(F?G[t]=true:delete G[t]),B&&I(n))return I(n).forEach((function(t){return e(t.id)}))}(e.id)})),r({},e,{selectedRowIds:G})}return e}function Rt(e){var n=e.data,o=e.rows,r=e.getHooks,i=e.plugins,u=e.rowsById,s=e.nonGroupedRowsById,a=void 0===s?u:s,c=e.autoResetSelectedRows,d=void 0===c||c,p=e.state.selectedRowIds,g=e.selectSubRows,m=void 0===g||g,y=e.dispatch,R=e.page,b=e.getSubRows;v(i,["useFilters","useGroupBy","useSortBy","useExpanded","usePagination"],"useRowSelect");var S=t.useMemo((function(){var e=[];return o.forEach((function(t){var n=m?function e(t,n,o){if(n[t.id])return  true;var r=o(t);if(r&&r.length){var i=true,u=false;return r.forEach((function(t){u&&!i||(e(t,n,o)?u=true:i=false);})),!!i||!!u&&null}return  false}(t,p,b):!!p[t.id];t.isSelected=!!n,t.isSomeSelected=null===n,n&&e.push(t);})),e}),[o,m,p,b]),C=Boolean(Object.keys(a).length&&Object.keys(p).length),x=C;C&&Object.keys(a).some((function(e){return !p[e]}))&&(C=false),C||R&&R.length&&R.some((function(e){var t=e.id;return !p[t]}))&&(x=false);var P=h(d);w((function(){P()&&y({type:l.resetSelectedRows});}),[y,n]);var B=t.useCallback((function(e){return y({type:l.toggleAllRowsSelected,value:e})}),[y]),E=t.useCallback((function(e){return y({type:l.toggleAllPageRowsSelected,value:e})}),[y]),I=t.useCallback((function(e,t){return y({type:l.toggleRowSelected,id:e,value:t})}),[y]),F=h(e),G=f(r().getToggleAllRowsSelectedProps,{instance:F()}),A=f(r().getToggleAllPageRowsSelectedProps,{instance:F()});Object.assign(e,{selectedFlatRows:S,isAllRowsSelected:C,isAllPageRowsSelected:x,toggleRowSelected:I,toggleAllRowsSelected:B,getToggleAllRowsSelectedProps:G,getToggleAllPageRowsSelectedProps:A,toggleAllPageRowsSelected:E});}function bt(e,t){var n=t.instance;e.toggleRowSelected=function(t){return n.toggleRowSelected(e.id,t)},e.getToggleRowSelectedProps=f(n.getHooks().getToggleRowSelectedProps,{instance:n,row:e});}var St=function(e){return {}},Ct=function(e){return {}};l.setRowState="setRowState",l.setCellState="setCellState",l.resetRowState="resetRowState";var xt=function(e){e.stateReducers.push(Pt),e.useInstance.push(Bt),e.prepareRow.push(Et);};function Pt(e,t,n,o){var i=o.initialRowStateAccessor,u=void 0===i?St:i,s=o.initialCellStateAccessor,a=void 0===s?Ct:s,c=o.rowsById;if(t.type===l.init)return r({rowState:{}},e);if(t.type===l.resetRowState)return r({},e,{rowState:o.initialState.rowState||{}});if(t.type===l.setRowState){var d,f=t.rowId,p=t.value,g=void 0!==e.rowState[f]?e.rowState[f]:u(c[f]);return r({},e,{rowState:r({},e.rowState,(d={},d[f]=m(p,g),d))})}if(t.type===l.setCellState){var v,h,y,w,R,b=t.rowId,S=t.columnId,C=t.value,x=void 0!==e.rowState[b]?e.rowState[b]:u(c[b]),P=void 0!==(null==x?void 0:null==(v=x.cellState)?void 0:v[S])?x.cellState[S]:a(null==(h=c[b])?void 0:null==(y=h.cells)?void 0:y.find((function(e){return e.column.id===S})));return r({},e,{rowState:r({},e.rowState,(R={},R[b]=r({},x,{cellState:r({},x.cellState||{},(w={},w[S]=m(C,P),w))}),R))})}}function Bt(e){var n=e.autoResetRowState,o=void 0===n||n,r=e.data,i=e.dispatch,u=t.useCallback((function(e,t){return i({type:l.setRowState,rowId:e,value:t})}),[i]),s=t.useCallback((function(e,t,n){return i({type:l.setCellState,rowId:e,columnId:t,value:n})}),[i]),a=h(o);w((function(){a()&&i({type:l.resetRowState});}),[r]),Object.assign(e,{setRowState:u,setCellState:s});}function Et(e,t){var n=t.instance,o=n.initialRowStateAccessor,r=void 0===o?St:o,i=n.initialCellStateAccessor,u=void 0===i?Ct:i,l=n.state.rowState;e&&(e.state=void 0!==l[e.id]?l[e.id]:r(e),e.setState=function(t){return n.setRowState(e.id,t)},e.cells.forEach((function(t){e.state.cellState||(e.state.cellState={}),t.state=void 0!==e.state.cellState[t.column.id]?e.state.cellState[t.column.id]:u(t),t.setState=function(o){return n.setCellState(e.id,t.column.id,o)};})));}xt.pluginName="useRowState",l.resetColumnOrder="resetColumnOrder",l.setColumnOrder="setColumnOrder";var It=function(e){e.stateReducers.push(Ft),e.visibleColumnsDeps.push((function(e,t){var n=t.instance;return [].concat(e,[n.state.columnOrder])})),e.visibleColumns.push(Gt),e.useInstance.push(At);};function Ft(e,t,n,o){return t.type===l.init?r({columnOrder:[]},e):t.type===l.resetColumnOrder?r({},e,{columnOrder:o.initialState.columnOrder||[]}):t.type===l.setColumnOrder?r({},e,{columnOrder:m(t.columnOrder,e.columnOrder)}):void 0}function Gt(e,t){var n=t.instance.state.columnOrder;if(!n||!n.length)return e;for(var o=[].concat(n),r=[].concat(e),i=[],u=function(){var e=o.shift(),t=r.findIndex((function(t){return t.id===e}));t>-1&&i.push(r.splice(t,1)[0]);};r.length&&o.length;)u();return [].concat(i,r)}function At(e){var n=e.dispatch;e.setColumnOrder=t.useCallback((function(e){return n({type:l.setColumnOrder,columnOrder:e})}),[n]);}It.pluginName="useColumnOrder",c.canResize=true,l.columnStartResizing="columnStartResizing",l.columnResizing="columnResizing",l.columnDoneResizing="columnDoneResizing",l.resetResize="resetResize";var kt=function(e){e.getResizerProps=[Ht],e.getHeaderProps.push({style:{position:"relative"}}),e.stateReducers.push(Wt),e.useInstance.push(Tt),e.useInstanceBeforeDimensions.push(zt);},Ht=function(e,t){var n=t.instance,o=t.header,r=n.dispatch,i=function(e,t){var n=false;if("touchstart"===e.type){if(e.touches&&e.touches.length>1)return;n=true;}var o,i,u=function(e){var t=[];return function e(n){n.columns&&n.columns.length&&n.columns.map(e);t.push(n);}(e),t}(t).map((function(e){return [e.id,e.totalWidth]})),s=n?Math.round(e.touches[0].clientX):e.clientX,a=function(){window.cancelAnimationFrame(o),o=null,r({type:l.columnDoneResizing});},c=function(){window.cancelAnimationFrame(o),o=null,r({type:l.columnResizing,clientX:i});},d=function(e){i=e,o||(o=window.requestAnimationFrame(c));},f={mouse:{moveEvent:"mousemove",moveHandler:function(e){return d(e.clientX)},upEvent:"mouseup",upHandler:function(e){document.removeEventListener("mousemove",f.mouse.moveHandler),document.removeEventListener("mouseup",f.mouse.upHandler),a();}},touch:{moveEvent:"touchmove",moveHandler:function(e){return e.cancelable&&(e.preventDefault(),e.stopPropagation()),d(e.touches[0].clientX),false},upEvent:"touchend",upHandler:function(e){document.removeEventListener(f.touch.moveEvent,f.touch.moveHandler),document.removeEventListener(f.touch.upEvent,f.touch.moveHandler),a();}}},p=n?f.touch:f.mouse,g=!!function(){if("boolean"==typeof z)return z;var e=false;try{var t={get passive(){return e=!0,!1}};window.addEventListener("test",null,t),window.removeEventListener("test",null,t);}catch(t){e=false;}return z=e}()&&{passive:false};document.addEventListener(p.moveEvent,p.moveHandler,g),document.addEventListener(p.upEvent,p.upHandler,g),r({type:l.columnStartResizing,columnId:t.id,columnWidth:t.totalWidth,headerIdWidths:u,clientX:s});};return [e,{onMouseDown:function(e){return e.persist()||i(e,o)},onTouchStart:function(e){return e.persist()||i(e,o)},style:{cursor:"col-resize"},draggable:false,role:"separator"}]};function Wt(e,t){if(t.type===l.init)return r({columnResizing:{columnWidths:{}}},e);if(t.type===l.resetResize)return r({},e,{columnResizing:{columnWidths:{}}});if(t.type===l.columnStartResizing){var n=t.clientX,o=t.columnId,i=t.columnWidth,u=t.headerIdWidths;return r({},e,{columnResizing:r({},e.columnResizing,{startX:n,headerIdWidths:u,columnWidth:i,isResizingColumn:o})})}if(t.type===l.columnResizing){var s=t.clientX,a=e.columnResizing,c=a.startX,d=a.columnWidth,f=a.headerIdWidths,p=(s-c)/d,g={};return (void 0===f?[]:f).forEach((function(e){var t=e[0],n=e[1];g[t]=Math.max(n+n*p,0);})),r({},e,{columnResizing:r({},e.columnResizing,{columnWidths:r({},e.columnResizing.columnWidths,{},g)})})}return t.type===l.columnDoneResizing?r({},e,{columnResizing:r({},e.columnResizing,{startX:null,isResizingColumn:null})}):void 0}kt.pluginName="useResizeColumns";var zt=function(e){var t=e.flatHeaders,n=e.disableResizing,o=e.getHooks,r=e.state.columnResizing,i=h(e);t.forEach((function(e){var t=I(true!==e.disableResizing&&void 0,true!==n&&void 0,true);e.canResize=t,e.width=r.columnWidths[e.id]||e.originalWidth||e.width,e.isResizing=r.isResizingColumn===e.id,t&&(e.getResizerProps=f(o().getResizerProps,{instance:i(),header:e}));}));};function Tt(e){var n=e.plugins,o=e.dispatch,r=e.autoResetResize,i=void 0===r||r,u=e.columns;v(n,["useAbsoluteLayout"],"useResizeColumns");var s=h(i);w((function(){s()&&o({type:l.resetResize});}),[u]);var a=t.useCallback((function(){return o({type:l.resetResize})}),[o]);Object.assign(e,{resetResizing:a});}var Ot={position:"absolute",top:0},Mt=function(e){e.getTableBodyProps.push(jt),e.getRowProps.push(jt),e.getHeaderGroupProps.push(jt),e.getFooterGroupProps.push(jt),e.getHeaderProps.push((function(e,t){var n=t.column;return [e,{style:r({},Ot,{left:n.totalLeft+"px",width:n.totalWidth+"px"})}]})),e.getCellProps.push((function(e,t){var n=t.cell;return [e,{style:r({},Ot,{left:n.column.totalLeft+"px",width:n.column.totalWidth+"px"})}]})),e.getFooterProps.push((function(e,t){var n=t.column;return [e,{style:r({},Ot,{left:n.totalLeft+"px",width:n.totalWidth+"px"})}]}));};Mt.pluginName="useAbsoluteLayout";var jt=function(e,t){return [e,{style:{position:"relative",width:t.instance.totalColumnsWidth+"px"}}]},Lt={display:"inline-block",boxSizing:"border-box"},Nt=function(e,t){return [e,{style:{display:"flex",width:t.instance.totalColumnsWidth+"px"}}]},Dt=function(e){e.getRowProps.push(Nt),e.getHeaderGroupProps.push(Nt),e.getFooterGroupProps.push(Nt),e.getHeaderProps.push((function(e,t){var n=t.column;return [e,{style:r({},Lt,{width:n.totalWidth+"px"})}]})),e.getCellProps.push((function(e,t){var n=t.cell;return [e,{style:r({},Lt,{width:n.column.totalWidth+"px"})}]})),e.getFooterProps.push((function(e,t){var n=t.column;return [e,{style:r({},Lt,{width:n.totalWidth+"px"})}]}));};function Vt(e){e.getTableProps.push(_t),e.getRowProps.push(Xt),e.getHeaderGroupProps.push(Xt),e.getFooterGroupProps.push(Xt),e.getHeaderProps.push(qt),e.getCellProps.push(Kt),e.getFooterProps.push(Ut);}Dt.pluginName="useBlockLayout",Vt.pluginName="useFlexLayout";var _t=function(e,t){return [e,{style:{minWidth:t.instance.totalColumnsMinWidth+"px"}}]},Xt=function(e,t){return [e,{style:{display:"flex",flex:"1 0 auto",minWidth:t.instance.totalColumnsMinWidth+"px"}}]},qt=function(e,t){var n=t.column;return [e,{style:{boxSizing:"border-box",flex:n.totalFlexWidth?n.totalFlexWidth+" 0 auto":void 0,minWidth:n.totalMinWidth+"px",width:n.totalWidth+"px"}}]},Kt=function(e,t){var n=t.cell;return [e,{style:{boxSizing:"border-box",flex:n.column.totalFlexWidth+" 0 auto",minWidth:n.column.totalMinWidth+"px",width:n.column.totalWidth+"px"}}]},Ut=function(e,t){var n=t.column;return [e,{style:{boxSizing:"border-box",flex:n.totalFlexWidth?n.totalFlexWidth+" 0 auto":void 0,minWidth:n.totalMinWidth+"px",width:n.totalWidth+"px"}}]};function $t(e){e.stateReducers.push(Zt),e.getTableProps.push(Jt),e.getHeaderProps.push(Yt),e.getRowProps.push(Qt);}l.columnStartResizing="columnStartResizing",l.columnResizing="columnResizing",l.columnDoneResizing="columnDoneResizing",l.resetResize="resetResize",$t.pluginName="useGridLayout";var Jt=function(e,t){var n=t.instance;return [e,{style:{display:"grid",gridTemplateColumns:n.visibleColumns.map((function(e){var t;return n.state.gridLayout.columnWidths[e.id]?n.state.gridLayout.columnWidths[e.id]+"px":(null==(t=n.state.columnResizing)?void 0:t.isResizingColumn)?n.state.gridLayout.startWidths[e.id]+"px":"number"==typeof e.width?e.width+"px":e.width})).join(" ")}}]},Yt=function(e,t){var n=t.column;return [e,{id:"header-cell-"+n.id,style:{position:"sticky",gridColumn:"span "+n.totalVisibleHeaderCount}}]},Qt=function(e,t){var n=t.row;return n.isExpanded?[e,{style:{gridColumn:"1 / "+(n.cells.length+1)}}]:[e,{}]};function Zt(e,t,n,o){if(t.type===l.init)return r({gridLayout:{columnWidths:{}}},e);if(t.type===l.resetResize)return r({},e,{gridLayout:{columnWidths:{}}});if(t.type===l.columnStartResizing){var i=t.columnId,u=t.headerIdWidths,s=en(i);if(void 0!==s){var a=o.visibleColumns.reduce((function(e,t){var n;return r({},e,((n={})[t.id]=en(t.id),n))}),{}),c=o.visibleColumns.reduce((function(e,t){var n;return r({},e,((n={})[t.id]=t.minWidth,n))}),{}),d=o.visibleColumns.reduce((function(e,t){var n;return r({},e,((n={})[t.id]=t.maxWidth,n))}),{}),f=u.map((function(e){var t=e[0];return [t,en(t)]}));return r({},e,{gridLayout:r({},e.gridLayout,{startWidths:a,minWidths:c,maxWidths:d,headerIdGridWidths:f,columnWidth:s})})}return e}if(t.type===l.columnResizing){var p=t.clientX,g=e.columnResizing.startX,v=e.gridLayout,m=v.columnWidth,h=v.minWidths,y=v.maxWidths,w=v.headerIdGridWidths,R=(p-g)/m,b={};return (void 0===w?[]:w).forEach((function(e){var t=e[0],n=e[1];b[t]=Math.min(Math.max(h[t],n+n*R),y[t]);})),r({},e,{gridLayout:r({},e.gridLayout,{columnWidths:r({},e.gridLayout.columnWidths,{},b)})})}return t.type===l.columnDoneResizing?r({},e,{gridLayout:r({},e.gridLayout,{startWidths:{},minWidths:{},maxWidths:{}})}):void 0}function en(e){var t,n=null==(t=document.getElementById("header-cell-"+e))?void 0:t.offsetWidth;if(void 0!==n)return n}e._UNSTABLE_usePivotColumns=nt,e.actions=l,e.defaultColumn=c,e.defaultGroupByFn=De,e.defaultOrderByFn=Qe,e.defaultRenderer=s,e.emptyRenderer=a,e.ensurePluginOrder=v,e.flexRender=b,e.functionalUpdate=m,e.loopHooks=g,e.makePropGetter=f,e.makeRenderer=R,e.reduceHooks=p,e.safeUseLayoutEffect=y,e.useAbsoluteLayout=Mt,e.useAsyncDebounce=function(e,n){ void 0===n&&(n=0);var r=t.useRef({}),i=h(e),u=h(n);return t.useCallback(function(){var e=o(regeneratorRuntime.mark((function e(){var t,n,l,s=arguments;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:for(t=s.length,n=new Array(t),l=0;l<t;l++)n[l]=s[l];return r.current.promise||(r.current.promise=new Promise((function(e,t){r.current.resolve=e,r.current.reject=t;}))),r.current.timeout&&clearTimeout(r.current.timeout),r.current.timeout=setTimeout(o(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return delete r.current.timeout,e.prev=1,e.t0=r.current,e.next=5,i().apply(void 0,n);case 5:e.t1=e.sent,e.t0.resolve.call(e.t0,e.t1),e.next=12;break;case 9:e.prev=9,e.t2=e.catch(1),r.current.reject(e.t2);case 12:return e.prev=12,delete r.current.promise,e.finish(12);case 15:case "end":return e.stop()}}),e,null,[[1,9,12,15]])}))),u()),e.abrupt("return",r.current.promise);case 5:case "end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),[i,u])},e.useBlockLayout=Dt,e.useColumnOrder=It,e.useExpanded=se,e.useFilters=Pe,e.useFlexLayout=Vt,e.useGetLatest=h,e.useGlobalFilter=Ie,e.useGridLayout=$t,e.useGroupBy=ze,e.useMountedLayoutEffect=w,e.usePagination=Ze,e.useResizeColumns=kt,e.useRowSelect=vt,e.useRowState=xt,e.useSortBy=Ue,e.useTable=function(e){for(var n=arguments.length,o=new Array(n>1?n-1:0),i=1;i<n;i++)o[i-1]=arguments[i];e=ie(e),o=[K].concat(o);var u=t.useRef({}),s=h(u.current);Object.assign(s(),r({},e,{plugins:o,hooks:q()})),o.filter(Boolean).forEach((function(e){e(s().hooks);}));var a=h(s().hooks);s().getHooks=a,delete s().hooks,Object.assign(s(),p(a().useOptions,ie(e)));var c=s(),d=c.data,v=c.columns,m=c.initialState,y=c.defaultColumn,w=c.getSubRows,b=c.getRowId,E=c.stateReducer,I=c.useControlledState,F=h(E),G=t.useCallback((function(e,t){if(!t.type)throw console.info({action:t}),new Error("Unknown Action 👆");return [].concat(a().stateReducers,Array.isArray(F())?F():[F()]).reduce((function(n,o){return o(n,t,e,s())||n}),e)}),[a,F,s]),A=t.useReducer(G,void 0,(function(){return G(m,{type:l.init})})),k=A[0],H=A[1],W=p([].concat(a().useControlledState,[I]),k,{instance:s()});Object.assign(s(),{state:W,dispatch:H});var z=t.useMemo((function(){return S(p(a().columns,v,{instance:s()}))}),[a,s,v].concat(p(a().columnsDeps,[],{instance:s()})));s().columns=z;var T=t.useMemo((function(){return p(a().allColumns,C(z),{instance:s()}).map(x)}),[z,a,s].concat(p(a().allColumnsDeps,[],{instance:s()})));s().allColumns=T;var O=t.useMemo((function(){for(var e=[],t=[],n={},o=[].concat(T);o.length;){var r=o.shift();le({data:d,rows:e,flatRows:t,rowsById:n,column:r,getRowId:b,getSubRows:w,accessValueHooks:a().accessValue,getInstance:s});}return [e,t,n]}),[T,d,b,w,a,s]),M=O[0],j=O[1],L=O[2];Object.assign(s(),{rows:M,initialRows:[].concat(M),flatRows:j,rowsById:L}),g(a().useInstanceAfterData,s());var N=t.useMemo((function(){return p(a().visibleColumns,T,{instance:s()}).map((function(e){return P(e,y)}))}),[a,T,s,y].concat(p(a().visibleColumnsDeps,[],{instance:s()})));T=t.useMemo((function(){var e=[].concat(N);return T.forEach((function(t){e.find((function(e){return e.id===t.id}))||e.push(t);})),e}),[T,N]),s().allColumns=T;var D=t.useMemo((function(){return p(a().headerGroups,B(N,y),s())}),[a,N,y,s].concat(p(a().headerGroupsDeps,[],{instance:s()})));s().headerGroups=D;var V=t.useMemo((function(){return D.length?D[0].headers:[]}),[D]);s().headers=V,s().flatHeaders=D.reduce((function(e,t){return [].concat(e,t.headers)}),[]),g(a().useInstanceBeforeDimensions,s());var _=N.filter((function(e){return e.isVisible})).map((function(e){return e.id})).sort().join("_");N=t.useMemo((function(){return N.filter((function(e){return e.isVisible}))}),[N,_]),s().visibleColumns=N;var X=ue(V),U=X[0],$=X[1],J=X[2];return s().totalColumnsMinWidth=U,s().totalColumnsWidth=$,s().totalColumnsMaxWidth=J,g(a().useInstance,s()),[].concat(s().flatHeaders,s().allColumns).forEach((function(e){e.render=R(s(),e),e.getHeaderProps=f(a().getHeaderProps,{instance:s(),column:e}),e.getFooterProps=f(a().getFooterProps,{instance:s(),column:e});})),s().headerGroups=t.useMemo((function(){return D.filter((function(e,t){return e.headers=e.headers.filter((function(e){return e.headers?function e(t){return t.filter((function(t){return t.headers?e(t.headers):t.isVisible})).length}(e.headers):e.isVisible})),!!e.headers.length&&(e.getHeaderGroupProps=f(a().getHeaderGroupProps,{instance:s(),headerGroup:e,index:t}),e.getFooterGroupProps=f(a().getFooterGroupProps,{instance:s(),headerGroup:e,index:t}),true)}))}),[D,s,a]),s().footerGroups=[].concat(s().headerGroups).reverse(),s().prepareRow=t.useCallback((function(e){e.getRowProps=f(a().getRowProps,{instance:s(),row:e}),e.allCells=T.map((function(t){var n=e.values[t.id],o={column:t,row:e,value:n};return o.getCellProps=f(a().getCellProps,{instance:s(),cell:o}),o.render=R(s(),t,{row:e,cell:o,value:n}),o})),e.cells=N.map((function(t){return e.allCells.find((function(e){return e.column.id===t.id}))})),g(a().prepareRow,e,{instance:s()});}),[a,s,T,N]),s().getTableProps=f(a().getTableProps,{instance:s()}),s().getTableBodyProps=f(a().getTableBodyProps,{instance:s()}),g(a().useFinalInstance,s()),s()},Object.defineProperty(e,"__esModule",{value:true});}));
		
	} (reactTable_production_min$1, reactTable_production_min$1.exports));
	return reactTable_production_min$1.exports;
}

var hasRequiredReactTable;

function requireReactTable () {
	if (hasRequiredReactTable) return reactTable.exports;
	hasRequiredReactTable = 1;
	{
	  reactTable.exports = requireReactTable_production_min();
	}
	return reactTable.exports;
}

var reactTableExports = requireReactTable();

/**
 * Sortable Authorization Table Component
 *
 * A sortable table for displaying authorization records with react-table.
 * Includes click-to-sort headers with ARIA accessibility support.
 */
/**
 * Sortable authorization table using react-table with click-to-sort headers.
 * Displays type, identity, permissions, resource ID with action buttons.
 */
var SortableAuthorizationsTable = function (_a) {
    var authorizations = _a.authorizations, onEdit = _a.onEdit, onClone = _a.onClone, onDelete = _a.onDelete, validationState = _a.validationState, resolvedIds = _a.resolvedIds, cockpitBaseUrl = _a.cockpitBaseUrl, tasklistBaseUrl = _a.tasklistBaseUrl, _b = _a.showActions, showActions = _b === void 0 ? true : _b, _c = _a.showResourceType, showResourceType = _c === void 0 ? false : _c;
    // Convert authorizations to row data
    var data = reactExports.useMemo(function () {
        return authorizations.map(function (auth) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            return ({
                original: auth,
                type: (_a = auth.type) !== null && _a !== void 0 ? _a : -1,
                typeLabel: getAuthTypeLabel(auth.type),
                userId: (_b = auth.userId) !== null && _b !== void 0 ? _b : '',
                groupId: (_c = auth.groupId) !== null && _c !== void 0 ? _c : '',
                identity: (_e = (_d = auth.userId) !== null && _d !== void 0 ? _d : auth.groupId) !== null && _e !== void 0 ? _e : '-',
                permissions: (_g = (_f = auth.permissions) === null || _f === void 0 ? void 0 : _f.join(', ')) !== null && _g !== void 0 ? _g : '-',
                resourceId: (_h = auth.resourceId) !== null && _h !== void 0 ? _h : '*',
                resourceType: (_j = auth.resourceType) !== null && _j !== void 0 ? _j : null,
                resourceTypeName: getResourceTypeName((_k = auth.resourceType) !== null && _k !== void 0 ? _k : null),
            });
        });
    }, [authorizations]);
    // Define columns for the table
    var columns = reactExports.useMemo(function () {
        var baseColumns = [];
        // Conditionally add Resource Type column first
        if (showResourceType) {
            baseColumns.push({
                Header: 'Resource Type',
                accessor: 'resourceTypeName',
                Cell: function (_a) {
                    var value = _a.value;
                    return React.createElement("span", null, value);
                },
            });
        }
        // Add remaining columns
        baseColumns.push({
            Header: 'Type',
            accessor: 'typeLabel',
            Cell: function (_a) {
                var value = _a.value;
                return React.createElement("span", null, value);
            },
        }, {
            Header: 'User / Group',
            accessor: 'identity',
            Cell: function (_a) {
                var row = _a.row;
                return renderIdentityDisplay(row.original.original.userId, row.original.original.groupId);
            },
        }, {
            Header: 'Permissions',
            accessor: 'permissions',
            Cell: function (_a) {
                var value = _a.value;
                return React.createElement("span", { title: value }, value);
            },
        }, {
            Header: 'Resource ID',
            accessor: 'resourceId',
            Cell: function (_a) {
                var row = _a.row;
                var resourceId = row.original.original.resourceId;
                // Validation results are keyed by resource type and id together, since the same
                // id can name resources of different types.
                var validationKey = resourceId
                    ? resourceValidationKey(row.original.original.resourceType, resourceId)
                    : null;
                var status = validationKey && validationState ? validationState[validationKey] : undefined;
                var urlOptions = {
                    cockpitBaseUrl: cockpitBaseUrl,
                    tasklistBaseUrl: tasklistBaseUrl,
                    resolvedId: validationKey && resolvedIds ? resolvedIds[validationKey] : undefined,
                };
                return renderResourceIdDisplay(row.original.original.resourceType, resourceId, status, urlOptions);
            },
        });
        // Only add Action column if showActions is true
        if (showActions) {
            baseColumns.push({
                Header: 'Action',
                id: 'action',
                // @ts-expect-error - disableSortBy exists in useSortBy plugin but not in base Column type
                disableSortBy: true,
                Cell: function (_a) {
                    var row = _a.row;
                    return (React.createElement(React.Fragment, null,
                        React.createElement("a", { onClick: function () {
                                onEdit(row.original.original);
                            }, className: "action-link action-edit", title: "Edit authorization" },
                            React.createElement(FaEdit, { className: "action-icon", "aria-hidden": "true" }),
                            " Edit"),
                        React.createElement("a", { onClick: function () {
                                onClone(row.original.original);
                            }, className: "action-link action-clone", title: "Clone authorization" },
                            React.createElement(FaCopy, { className: "action-icon", "aria-hidden": "true" }),
                            " Clone"),
                        React.createElement("a", { onClick: function () {
                                onDelete(row.original.original);
                            }, className: "action-link action-delete", title: "Delete authorization" },
                            React.createElement(FaTrash, { className: "action-icon", "aria-hidden": "true" }),
                            " Delete")));
                },
            });
        }
        return baseColumns;
    }, [
        onEdit,
        onClone,
        onDelete,
        validationState,
        resolvedIds,
        cockpitBaseUrl,
        tasklistBaseUrl,
        showActions,
        showResourceType,
    ]);
    // Use react-table with sorting
    var tableInstance = reactTableExports.useTable({ columns: columns, data: data }, reactTableExports.useSortBy);
    var getTableProps = tableInstance.getTableProps, getTableBodyProps = tableInstance.getTableBodyProps, headerGroups = tableInstance.headerGroups, rows = tableInstance.rows, prepareRow = tableInstance.prepareRow;
    /**
     * Render sort icon based on column sort state
     */
    var renderSortIcon = function (isSorted, isSortedDesc) {
        if (!isSorted) {
            return React.createElement(TiMinus, { className: "sort-icon", "aria-hidden": "true" });
        }
        if (isSortedDesc) {
            return React.createElement(GoChevronDown, { className: "sort-icon", "aria-hidden": "true" });
        }
        return React.createElement(GoChevronUp, { className: "sort-icon", "aria-hidden": "true" });
    };
    return (React.createElement("table", __assign({ className: "cam-table" }, getTableProps(), { "aria-label": "Authorizations table" }),
        React.createElement("thead", null, headerGroups.map(function (headerGroup) {
            var _a = headerGroup.getHeaderGroupProps(), headerGroupKey = _a.key, headerGroupProps = __rest(_a, ["key"]);
            return (React.createElement("tr", __assign({ key: headerGroupKey }, headerGroupProps), headerGroup.headers.map(function (column) {
                var sortableColumn = column;
                var _a = column.getHeaderProps(sortableColumn.disableSortBy !== true ? sortableColumn.getSortByToggleProps() : undefined), columnKey = _a.key, columnProps = __rest(_a, ["key"]);
                // Determine ARIA sort attribute for accessibility
                var ariaSort = 'none';
                if (sortableColumn.isSorted) {
                    ariaSort = sortableColumn.isSortedDesc ? 'descending' : 'ascending';
                }
                return (React.createElement("th", __assign({ key: columnKey }, columnProps, { "aria-sort": sortableColumn.disableSortBy !== true ? ariaSort : undefined, className: sortableColumn.disableSortBy !== true ? 'sortable' : '' }),
                    column.render('Header'),
                    sortableColumn.disableSortBy !== true && (React.createElement("span", { className: "sort-icon-wrapper" }, renderSortIcon(sortableColumn.isSorted, sortableColumn.isSortedDesc)))));
            })));
        })),
        React.createElement("tbody", __assign({}, getTableBodyProps()), rows.map(function (row) {
            prepareRow(row);
            var _a = row.getRowProps(), rowKey = _a.key, rowProps = __rest(_a, ["key"]);
            var authRow = row.original;
            return (React.createElement("tr", __assign({ key: rowKey }, rowProps, { className: authRow.original.inUpdate === true ? 'editing' : '' }), row.cells.map(function (cell) {
                var _a = cell.getCellProps(), cellKey = _a.key, cellProps = __rest(_a, ["key"]);
                return (React.createElement("td", __assign({ key: cellKey }, cellProps), cell.render('Cell')));
            })));
        }))));
};

/**
 * Admin Authorizations Plugin
 *
 * This plugin provides a full route view for authorization management.
 * Layout follows instance-route-history pattern:
 * - Page wrapper with ctn-main
 * - BreadcrumbsPanel at top
 * - Container with Allotment for two-panel layout
 * - Left pane: Resource type list
 * - Right pane: Authorization table with CRUD operations
 *
 * Features:
 * - View authorizations by resource type
 * - Create new authorizations with type, user/group, permissions, and resource ID
 * - Edit existing authorizations (permissions, user/group, resource ID)
 * - Delete authorizations with confirmation
 * - Permission selection based on resource type
 */
// =============================================================================
// Constants
// =============================================================================
/** Page size option constants */
var PAGE_SIZE_25 = 25;
var PAGE_SIZE_50 = 50;
var PAGE_SIZE_100 = 100;
var PAGE_SIZE_200 = 200;
var PAGE_SIZE_500 = 500;
var PAGE_SIZE_1000 = 1000;
/** Page size options */
var PAGE_SIZE_OPTIONS = [PAGE_SIZE_25, PAGE_SIZE_50, PAGE_SIZE_100, PAGE_SIZE_200, PAGE_SIZE_500, PAGE_SIZE_1000];
/** Special value for "All authorizations" view (shows all resource types) */
var ALL_RESOURCE_TYPES = -1;
/**
 * Main authorizations view with two-panel layout matching Angular app.
 * Left panel (aside): Resource type list
 * Right panel (section-content): Authorization table with CRUD operations
 */
var AuthorizationsView = function (_a) {
    var _b;
    var api$1 = _a.api;
    // Default to "All" view to show all authorizations
    var _c = reactExports.useState(ALL_RESOURCE_TYPES), selectedResourceType = _c[0], setSelectedResourceType = _c[1];
    var _d = reactExports.useState([]), authorizations = _d[0], setAuthorizations = _d[1];
    var _e = reactExports.useState(0), totalCount = _e[0], setTotalCount = _e[1];
    var _f = reactExports.useState(1), currentPage = _f[0], setCurrentPage = _f[1];
    var _g = reactExports.useState(DEFAULT_PAGE_SIZE), perPage = _g[0], setPerPage = _g[1];
    var _h = reactExports.useState(0), firstResult = _h[0], setFirstResult = _h[1];
    var _j = reactExports.useState(false), isLoading = _j[0], setIsLoading = _j[1];
    var _k = reactExports.useState(null), error = _k[0], setError = _k[1];
    var _l = reactExports.useState({}), filterParams = _l[0], setFilterParams = _l[1];
    var _m = reactExports.useState(0), filterKey = _m[0], setFilterKey = _m[1];
    // Create filter schema with API for autocomplete (memoized to avoid recreation)
    // For "All" view, include ID and Resource Type fields; otherwise exclude them
    var authorizationFilterSchema = reactExports.useMemo(function () {
        return createAuthorizationFilterSchema(api$1, {
            includeId: selectedResourceType === ALL_RESOURCE_TYPES,
            includeResourceType: selectedResourceType === ALL_RESOURCE_TYPES,
        });
    }, [api$1, selectedResourceType]);
    // Modal states
    var _o = reactExports.useState(false), showCreateModal = _o[0], setShowCreateModal = _o[1];
    var _p = reactExports.useState(null), editingAuth = _p[0], setEditingAuth = _p[1];
    var _q = reactExports.useState(null), cloningAuth = _q[0], setCloningAuth = _q[1];
    var _r = reactExports.useState(null), deletingAuth = _r[0], setDeletingAuth = _r[1];
    var _s = reactExports.useState(false), isDeleting = _s[0], setIsDeleting = _s[1];
    // Resource validation states
    var _t = reactExports.useState({}), validationState = _t[0], setValidationState = _t[1];
    var _u = reactExports.useState({}), resolvedIds = _u[0], setResolvedIds = _u[1];
    var _v = reactExports.useState(false), isValidating = _v[0], setIsValidating = _v[1];
    var _w = reactExports.useState(null), validationProgress = _w[0], setValidationProgress = _w[1];
    // Calculate app base URLs for cross-app navigation
    var cockpitBaseUrl = reactExports.useMemo(function () { var _a; return (_a = deriveCockpitAppUrl(api$1.adminApi, api$1.engine)) !== null && _a !== void 0 ? _a : undefined; }, [api$1.adminApi, api$1.engine]);
    var tasklistBaseUrl = reactExports.useMemo(function () { var _a; return (_a = deriveTasklistAppUrl(api$1.adminApi, api$1.engine)) !== null && _a !== void 0 ? _a : undefined; }, [api$1.adminApi, api$1.engine]);
    /** True when the All-types view has no active filters — querying without a filter would return every record. */
    var requiresFilter = selectedResourceType === ALL_RESOURCE_TYPES && Object.keys(filterParams).length === 0;
    /**
     * Fetch authorizations from the API
     */
    var fetchAuthorizations = reactExports.useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var params, countParams, countResult, result, err_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (selectedResourceType === ALL_RESOURCE_TYPES && Object.keys(filterParams).length === 0) {
                        setAuthorizations([]);
                        setTotalCount(0);
                        setIsLoading(false);
                        return [2 /*return*/];
                    }
                    setIsLoading(true);
                    setError(null);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, 5, 6]);
                    params = __assign({ maxResults: String(perPage), firstResult: String(firstResult) }, filterParams);
                    // Only add resourceType filter if not viewing all
                    if (selectedResourceType !== ALL_RESOURCE_TYPES) {
                        params['resourceType'] = String(selectedResourceType);
                    }
                    countParams = __assign({}, filterParams);
                    if (selectedResourceType !== ALL_RESOURCE_TYPES) {
                        countParams['resourceType'] = String(selectedResourceType);
                    }
                    return [4 /*yield*/, get(api$1, '/authorization/count', countParams)];
                case 2:
                    countResult = (_b.sent());
                    setTotalCount((_a = countResult === null || countResult === void 0 ? void 0 : countResult.count) !== null && _a !== void 0 ? _a : 0);
                    return [4 /*yield*/, get(api$1, '/authorization', params)];
                case 3:
                    result = (_b.sent());
                    setAuthorizations(result !== null && result !== void 0 ? result : []);
                    return [3 /*break*/, 6];
                case 4:
                    err_1 = _b.sent();
                    if (err_1 instanceof ApiError) {
                        setError(err_1.message);
                    }
                    else {
                        setError('Failed to fetch authorizations');
                    }
                    console.error('Error fetching authorizations:', err_1);
                    return [3 /*break*/, 6];
                case 5:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); }, [api$1, selectedResourceType, perPage, firstResult, filterParams]);
    reactExports.useEffect(function () {
        void fetchAuthorizations();
    }, [fetchAuthorizations]);
    /**
     * Handle resource type selection
     */
    var handleSelectResourceType = function (resourceType) {
        setSelectedResourceType(resourceType);
        setCurrentPage(1);
        setFirstResult(0);
        setFilterParams({});
        // Clear validation and resolved IDs state when changing resource type
        setValidationState({});
        setResolvedIds({});
        clearProcessDefinitionKeyCache();
        // Increment filterKey to force FilterBox remount with new options
        setFilterKey(function (prev) { return prev + 1; });
    };
    /**
     * Handle page change
     */
    var handlePageChange = function (newFirstResult, page) {
        setCurrentPage(page);
        setFirstResult(newFirstResult);
        // Clear validation and resolved IDs state when changing page
        setValidationState({});
        setResolvedIds({});
    };
    /**
     * Handle page size change
     */
    var handlePageSizeChange = function (newSize) {
        setPerPage(newSize);
        setCurrentPage(1);
        setFirstResult(0);
        // Clear validation and resolved IDs state when changing page size
        setValidationState({});
        setResolvedIds({});
    };
    /**
     * Handle filter query submission.
     * Note: Schema restricts connectors to AND only, matching authorization API behavior.
     */
    var handleFilterSubmit = reactExports.useCallback(function (expressions) {
        var params = parseAuthorizationExpressions(expressions);
        setFilterParams(params);
        setCurrentPage(1);
        setFirstResult(0);
        // Clear validation and resolved IDs state when changing filter
        setValidationState({});
        setResolvedIds({});
    }, []);
    /**
     * Check if resources referenced by authorizations exist in the system.
     * Validates only the resources currently visible in the table.
     * Also resolves process definition keys to their latest version IDs.
     */
    var handleCheckResources = reactExports.useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var resourcesToCheck, uniqueResources, total, newValidationState, newResolvedIds, current, _i, uniqueResources_1, resource, key, result, pdResult, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (authorizations.length === 0) {
                        return [2 /*return*/];
                    }
                    setIsValidating(true);
                    setValidationState({});
                    setResolvedIds({});
                    resourcesToCheck = authorizations
                        .filter(function (auth) { return auth.resourceId && auth.resourceId !== '*'; })
                        .map(function (auth) { return ({
                        resourceId: auth.resourceId,
                        resourceType: auth.resourceType,
                        endpoint: getResourceValidationEndpoint(auth.resourceType, auth.resourceId),
                    }); })
                        .filter(function (item) { return item.endpoint !== null; });
                    uniqueResources = Array.from(new Map(resourcesToCheck.map(function (item) { return [resourceValidationKey(item.resourceType, item.resourceId), item]; })).values());
                    total = uniqueResources.length;
                    setValidationProgress({ current: 0, total: total });
                    newValidationState = {};
                    newResolvedIds = {};
                    current = 0;
                    _i = 0, uniqueResources_1 = uniqueResources;
                    _a.label = 1;
                case 1:
                    if (!(_i < uniqueResources_1.length)) return [3 /*break*/, 7];
                    resource = uniqueResources_1[_i];
                    key = resourceValidationKey(resource.resourceType, resource.resourceId);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, get(api$1, resource.endpoint)];
                case 3:
                    result = _a.sent();
                    newValidationState[key] = 'valid';
                    // For process definitions with keys, extract the resolved ID
                    if (resource.resourceType === RESOURCE_TYPE_PROCESS_DEFINITION$1 && isProcessDefinitionKey(resource.resourceId)) {
                        pdResult = result;
                        if (pdResult.id) {
                            newResolvedIds[key] = pdResult.id;
                        }
                    }
                    return [3 /*break*/, 5];
                case 4:
                    err_2 = _a.sent();
                    // 404 means resource doesn't exist, other errors are unknown
                    if (err_2 instanceof ApiError && err_2.status === 404) {
                        newValidationState[key] = 'invalid';
                    }
                    else {
                        newValidationState[key] = 'unknown';
                    }
                    return [3 /*break*/, 5];
                case 5:
                    current++;
                    setValidationProgress({ current: current, total: total });
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7:
                    setValidationState(newValidationState);
                    setResolvedIds(newResolvedIds);
                    setIsValidating(false);
                    setValidationProgress(null);
                    return [2 /*return*/];
            }
        });
    }); }, [api$1, authorizations]);
    /**
     * Handle delete authorization
     */
    var handleDeleteAuthorization = function () { return __awaiter(void 0, void 0, void 0, function () {
        var del, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(deletingAuth === null || deletingAuth === void 0 ? void 0 : deletingAuth.id)) {
                        return [2 /*return*/];
                    }
                    setIsDeleting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return api; })];
                case 2:
                    del = (_a.sent()).del;
                    return [4 /*yield*/, del(api$1, "/authorization/".concat(deletingAuth.id))];
                case 3:
                    _a.sent();
                    setDeletingAuth(null);
                    void fetchAuthorizations();
                    return [3 /*break*/, 6];
                case 4:
                    err_3 = _a.sent();
                    console.error('Error deleting authorization:', err_3);
                    if (err_3 instanceof ApiError) {
                        setError(err_3.message);
                    }
                    else {
                        setError('Failed to delete authorization');
                    }
                    return [3 /*break*/, 6];
                case 5:
                    setIsDeleting(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Handle save from modal (create or edit)
     */
    var handleSaveAuthorization = function () {
        setShowCreateModal(false);
        setEditingAuth(null);
        setCloningAuth(null);
        void fetchAuthorizations();
    };
    var currentResourceName = selectedResourceType === ALL_RESOURCE_TYPES ? 'All' : getResourceTypeName(selectedResourceType);
    var settings = loadSettings();
    // Build breadcrumb items for admin authorizations view
    var breadcrumbItems = reactExports.useMemo(function () { return [{ label: 'Dashboard', href: '#/' }, { label: "".concat(currentResourceName, " Authorizations") }]; }, [currentResourceName]);
    return (React.createElement("div", { className: "ctn-main authorization-view" },
        React.createElement(BreadcrumbsPanel, { items: breadcrumbItems }),
        React.createElement(Container, null,
            React.createElement(Ve, { vertical: false, onChange: function (numbers) {
                    var _a;
                    saveSettings(__assign(__assign({}, loadSettings()), { leftPaneSize: (_a = numbers[0]) !== null && _a !== void 0 ? _a : null }));
                } },
                React.createElement(Ve.Pane, { preferredSize: (_b = settings.leftPaneSize) !== null && _b !== void 0 ? _b : ADMIN_PANEL_WIDTH_PX, minSize: 150, maxSize: 350 },
                    React.createElement("div", { className: "resource-type-list" },
                        React.createElement("ul", null,
                            React.createElement("li", { className: selectedResourceType === ALL_RESOURCE_TYPES ? 'active' : '' },
                                React.createElement("a", { href: "#/authorization/?resource=all", onClick: function (e) {
                                        e.preventDefault();
                                        handleSelectResourceType(ALL_RESOURCE_TYPES);
                                    } },
                                    React.createElement("strong", null, "All Authorizations"))),
                            RESOURCE_TYPES.map(function (rt) { return (React.createElement("li", { key: rt.id, className: selectedResourceType === rt.id ? 'active' : '' },
                                React.createElement("a", { href: "#/authorization/?resource=".concat(rt.id), onClick: function (e) {
                                        e.preventDefault();
                                        handleSelectResourceType(rt.id);
                                    } }, rt.name))); })))),
                React.createElement(Ve.Pane, null,
                    React.createElement("div", { className: "authorization-content" },
                        error && (React.createElement("div", { className: "page-notifications" },
                            React.createElement(ErrorMessage, { message: error }))),
                        React.createElement("header", { className: "row" },
                            React.createElement("div", { className: "col-sm-6" },
                                React.createElement("h3", null,
                                    currentResourceName,
                                    " Authorizations")),
                            React.createElement("div", { className: "col-sm-6 text-right" },
                                React.createElement("button", { className: "btn btn-default", onClick: function () { return void handleCheckResources(); }, disabled: isLoading || isValidating || authorizations.length === 0, title: "Check if referenced resources exist in the system", style: { marginRight: '8px' } },
                                    isValidating && validationProgress
                                        ? "Checking ".concat(validationProgress.current, "/").concat(validationProgress.total, "...")
                                        : 'Check resources',
                                    React.createElement(FaCheckCircle, { className: "create-btn-icon", "aria-hidden": "true" })),
                                selectedResourceType !== ALL_RESOURCE_TYPES && (React.createElement("button", { className: "btn btn-default", onClick: function () {
                                        setShowCreateModal(true);
                                    }, disabled: isLoading },
                                    "Create new authorization",
                                    React.createElement(FaPlusCircle, { className: "create-btn-icon", "aria-hidden": "true" }))))),
                        React.createElement("div", { className: "filter-controls" },
                            React.createElement("div", { className: "row" },
                                React.createElement("div", { className: "col-sm-9" },
                                    React.createElement(FilterBox, { key: filterKey, schema: authorizationFilterSchema, onFilterChange: function () {
                                            // New format handled by onLegacyFilterChange
                                        }, onLegacyFilterChange: handleFilterSubmit, placeholder: "Add filter...", storageKey: "minimal-history-plugin-saved-searches-authorizations" })),
                                React.createElement("div", { className: "col-sm-3 text-right" },
                                    React.createElement("label", { className: "page-size-label" },
                                        "Page size:",
                                        React.createElement("select", { className: "form-control", value: perPage, onChange: function (e) {
                                                handlePageSizeChange(Number(e.target.value));
                                            } }, PAGE_SIZE_OPTIONS.map(function (size) { return (React.createElement("option", { key: size, value: size }, size)); })))))),
                        isLoading && React.createElement(LoadingSpinner, null),
                        !isLoading && requiresFilter && (React.createElement("div", { className: "alert alert-info" }, "Add at least one filter to search across all authorization types.")),
                        !isLoading && !requiresFilter && authorizations.length === 0 && (React.createElement("div", { className: "alert alert-info" },
                            "No authorizations found for ",
                            currentResourceName,
                            ".")),
                        !isLoading && authorizations.length > 0 && (React.createElement(React.Fragment, null,
                            React.createElement(SortableAuthorizationsTable, { authorizations: authorizations, onEdit: setEditingAuth, onClone: setCloningAuth, onDelete: setDeletingAuth, validationState: validationState, resolvedIds: resolvedIds, cockpitBaseUrl: cockpitBaseUrl, tasklistBaseUrl: tasklistBaseUrl, showActions: selectedResourceType !== ALL_RESOURCE_TYPES, showResourceType: selectedResourceType === ALL_RESOURCE_TYPES }),
                            totalCount > perPage && (React.createElement(Pagination, { currentPage: currentPage, perPage: perPage, total: totalCount, onPage: handlePageChange })))))))),
        (showCreateModal || Boolean(editingAuth) || Boolean(cloningAuth)) && (React.createElement(AuthorizationFormModal, { api: api$1, resourceType: selectedResourceType, authorization: editingAuth !== null && editingAuth !== void 0 ? editingAuth : (cloningAuth ? __assign(__assign({}, cloningAuth), { id: null }) : null), onSave: handleSaveAuthorization, onCancel: function () {
                setShowCreateModal(false);
                setEditingAuth(null);
                setCloningAuth(null);
            } })),
        deletingAuth && (React.createElement(AuthorizationDeleteModal, { authorization: deletingAuth, onConfirm: function () { return void handleDeleteAuthorization(); }, onCancel: function () {
                setDeletingAuth(null);
            }, isDeleting: isDeleting }))));
};
var adminRouteAuthorization = [
    {
        id: 'adminRouteAuthorization',
        pluginPoint: 'admin.route',
        properties: {
            path: '/authorization',
            label: 'Authorizations',
        },
        priority: 10,
        render: function (node, _a) {
            var api = _a.api;
            clientExports.createRoot(node).render(React.createElement(AuthorizationsView, { api: api }));
        },
    },
];

export { adminRouteAuthorization as default };
