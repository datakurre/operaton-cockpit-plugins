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

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * Flatten array, one level deep.
 *
 * @template T
 *
 * @param {T[][] | T[] | null} [arr]
 *
 * @return {T[]}
 */

/**
 * Convenience wrapper for `Object.assign`.
 *
 * @param {Object} target
 * @param {...Object} others
 *
 * @return {Object} the target
 */
function assign$1(target, ...others) {
  return Object.assign(target, ...others);
}

/**
 * Flatten array, one level deep.
 *
 * @template T
 *
 * @param {T[][] | T[] | null} [arr]
 *
 * @return {T[]}
 */

const nativeToString = Object.prototype.toString;
const nativeHasOwnProperty = Object.prototype.hasOwnProperty;

function isUndefined(obj) {
  return obj === undefined;
}

function isNil(obj) {
  return obj == null;
}

function isArray(obj) {
  return nativeToString.call(obj) === '[object Array]';
}

function isObject(obj) {
  return nativeToString.call(obj) === '[object Object]';
}

/**
 * Return true, if target owns a property with the given key.
 *
 * @param {Object} target
 * @param {String} key
 *
 * @return {Boolean}
 */
function has(target, key) {
  return !isNil(target) && nativeHasOwnProperty.call(target, key);
}


/**
 * Iterate over collection; returning something
 * (non-undefined) will stop iteration.
 *
 * @template T
 * @param {Collection<T>} collection
 * @param { ((item: T, idx: number) => (boolean|void)) | ((item: T, key: string) => (boolean|void)) } iterator
 *
 * @return {T} return result that stopped the iteration
 */
function forEach(collection, iterator) {

  let val,
      result;

  if (isUndefined(collection)) {
    return;
  }

  const convertKey = isArray(collection) ? toNum : identity;

  for (let key in collection) {

    if (has(collection, key)) {
      val = collection[key];

      result = iterator(val, convertKey(key));

      if (result === false) {
        return val;
      }
    }
  }
}


/**
 * Reduce collection, returning a single result.
 *
 * @template T
 * @template V
 *
 * @param {Collection<T>} collection
 * @param {(result: V, entry: T, index: any) => V} iterator
 * @param {V} result
 *
 * @return {V} result returned from last iterator
 */
function reduce(collection, iterator, result) {

  forEach(collection, function(value, idx) {
    result = iterator(result, value, idx);
  });

  return result;
}


function identity(arg) {
  return arg;
}

function toNum(arg) {
  return Number(arg);
}

/**
 * Convenience wrapper for `Object.assign`.
 *
 * @param {Object} target
 * @param {...Object} others
 *
 * @return {Object} the target
 */
function assign(target, ...others) {
  return Object.assign(target, ...others);
}

function ensureImported(element, target) {

  if (element.ownerDocument !== target.ownerDocument) {
    try {

      // may fail on webkit
      return target.ownerDocument.importNode(element, true);
    } catch (e) {

      // ignore
    }
  }

  return element;
}

/**
 * appendTo utility
 */


/**
 * Append a node to a target element and return the appended node.
 *
 * @param  {SVGElement} element
 * @param  {SVGElement} target
 *
 * @return {SVGElement} the appended node
 */
function appendTo(element, target) {
  return target.appendChild(ensureImported(element, target));
}

/**
 * append utility
 */


/**
 * Append a node to an element
 *
 * @param  {SVGElement} element
 * @param  {SVGElement} node
 *
 * @return {SVGElement} the element
 */
function append(target, node) {
  appendTo(node, target);
  return target;
}

/**
 * attribute accessor utility
 */

var LENGTH_ATTR = 2;

var CSS_PROPERTIES = {
  'alignment-baseline': 1,
  'baseline-shift': 1,
  'clip': 1,
  'clip-path': 1,
  'clip-rule': 1,
  'color': 1,
  'color-interpolation': 1,
  'color-interpolation-filters': 1,
  'color-profile': 1,
  'color-rendering': 1,
  'cursor': 1,
  'direction': 1,
  'display': 1,
  'dominant-baseline': 1,
  'enable-background': 1,
  'fill': 1,
  'fill-opacity': 1,
  'fill-rule': 1,
  'filter': 1,
  'flood-color': 1,
  'flood-opacity': 1,
  'font': 1,
  'font-family': 1,
  'font-size': LENGTH_ATTR,
  'font-size-adjust': 1,
  'font-stretch': 1,
  'font-style': 1,
  'font-variant': 1,
  'font-weight': 1,
  'glyph-orientation-horizontal': 1,
  'glyph-orientation-vertical': 1,
  'image-rendering': 1,
  'kerning': 1,
  'letter-spacing': 1,
  'lighting-color': 1,
  'marker': 1,
  'marker-end': 1,
  'marker-mid': 1,
  'marker-start': 1,
  'mask': 1,
  'opacity': 1,
  'overflow': 1,
  'pointer-events': 1,
  'shape-rendering': 1,
  'stop-color': 1,
  'stop-opacity': 1,
  'stroke': 1,
  'stroke-dasharray': 1,
  'stroke-dashoffset': 1,
  'stroke-linecap': 1,
  'stroke-linejoin': 1,
  'stroke-miterlimit': 1,
  'stroke-opacity': 1,
  'stroke-width': LENGTH_ATTR,
  'text-anchor': 1,
  'text-decoration': 1,
  'text-rendering': 1,
  'unicode-bidi': 1,
  'visibility': 1,
  'word-spacing': 1,
  'writing-mode': 1
};


function getAttribute(node, name) {
  if (CSS_PROPERTIES[name]) {
    return node.style[name];
  } else {
    return node.getAttributeNS(null, name);
  }
}

function setAttribute(node, name, value) {
  var hyphenated = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

  var type = CSS_PROPERTIES[hyphenated];

  if (type) {

    // append pixel unit, unless present
    if (type === LENGTH_ATTR && typeof value === 'number') {
      value = String(value) + 'px';
    }

    node.style[hyphenated] = value;
  } else {
    node.setAttributeNS(null, name, value);
  }
}

function setAttributes(node, attrs) {

  var names = Object.keys(attrs), i, name;

  for (i = 0, name; (name = names[i]); i++) {
    setAttribute(node, name, attrs[name]);
  }
}

/**
 * Gets or sets raw attributes on a node.
 *
 * @param  {SVGElement} node
 * @param  {Object} [attrs]
 * @param  {String} [name]
 * @param  {String} [value]
 *
 * @return {String}
 */
function attr(node, name, value) {
  if (typeof name === 'string') {
    {
      return getAttribute(node, name);
    }
  } else {
    setAttributes(node, name);
  }

  return node;
}

var ns = {
  svg: 'http://www.w3.org/2000/svg'
};

/**
 * DOM parsing utility
 */


var SVG_START = '<svg xmlns="' + ns.svg + '"';

function parse(svg) {

  var unwrap = false;

  // ensure we import a valid svg document
  if (svg.substring(0, 4) === '<svg') {
    if (svg.indexOf(ns.svg) === -1) {
      svg = SVG_START + svg.substring(4);
    }
  } else {

    // namespace svg
    svg = SVG_START + '>' + svg + '</svg>';
    unwrap = true;
  }

  var parsed = parseDocument(svg);

  if (!unwrap) {
    return parsed;
  }

  var fragment = document.createDocumentFragment();

  var parent = parsed.firstChild;

  while (parent.firstChild) {
    fragment.appendChild(parent.firstChild);
  }

  return fragment;
}

function parseDocument(svg) {

  var parser;

  // parse
  parser = new DOMParser();
  parser.async = false;

  return parser.parseFromString(svg, 'text/xml');
}

/**
 * Create utility for SVG elements
 */



/**
 * Create a specific type from name or SVG markup.
 *
 * @param {String} name the name or markup of the element
 * @param {Object} [attrs] attributes to set on the element
 *
 * @returns {SVGElement}
 */
function create(name, attrs) {
  var element;

  name = name.trim();

  if (name.charAt(0) === '<') {
    element = parse(name).firstChild;
    element = document.importNode(element, true);
  } else {
    element = document.createElementNS(ns.svg, name);
  }

  if (attrs) {
    attr(element, attrs);
  }

  return element;
}

/**
 * @typedef {import('../util/Types').Dimensions} Dimensions
 *
 * @typedef { {
 *   top: number;
 *   left: number;
 *   right: number;
 *   bottom: number;
 * } } Padding
 *
 * @typedef { number | Partial<Padding> } PaddingConfig
 *
 * @typedef { {
 *   horizontal: 'center' | 'left' | 'right';
 *   vertical: 'top' | 'middle';
 * } } Alignment
 *
 *  @typedef { 'center-middle' | 'center-top' } AlignmentConfig
 *
 * @typedef { Partial<{
 *   align: AlignmentConfig;
 *   style: Record<string, number | string>;
 *   padding: PaddingConfig;
 * }> } BaseTextConfig
 *
 * @typedef { BaseTextConfig & Partial<{
 *   size: Dimensions;
 * }> } TextConfig
 *
 * @typedef { BaseTextConfig & Partial<{
 *   box: Dimensions;
 *   fitBox: boolean;
 * }> } TextLayoutConfig
 *
 *  @typedef { Dimensions & {
 *  text: string;
 * } } LineDescriptor
 */

var DEFAULT_BOX_PADDING = 0;

var DEFAULT_LABEL_SIZE$1 = {
  width: 150,
  height: 50
};


/**
 * @param {AlignmentConfig} align
 * @return {Alignment}
 */
function parseAlign(align) {

  var parts = align.split('-');

  return {
    horizontal: parts[0] || 'center',
    vertical: parts[1] || 'top'
  };
}

/**
 * @param {PaddingConfig} padding
 *
 * @return {Padding}
 */
function parsePadding(padding) {

  if (isObject(padding)) {
    return assign({ top: 0, left: 0, right: 0, bottom: 0 }, padding);
  } else {
    return {
      top: padding,
      left: padding,
      right: padding,
      bottom: padding
    };
  }
}

/** @type {CanvasRenderingContext2D | null} */
var _canvasContext = null;

/**
 * @return {CanvasRenderingContext2D | null}
 */
function getCanvasContext() {
  if (!_canvasContext) {
    _canvasContext = document.createElement('canvas').getContext('2d');
  }

  return _canvasContext;
}

/**
 * Build a CSS font string from a style object for use with the canvas
 * measureText API.
 *
 * @param {Record<string, number | string>} style
 *
 * @return {string}
 */
function buildFont(style) {
  var parts = [];

  if (style.fontStyle) {
    parts.push(style.fontStyle);
  }

  if (style.fontVariant) {
    parts.push(style.fontVariant);
  }

  if (style.fontWeight) {
    parts.push(style.fontWeight);
  }

  if (style.fontStretch) {
    parts.push(style.fontStretch);
  }

  parts.push(buildLength(style.fontSize) || '12px');
  parts.push(style.fontFamily || 'sans-serif');

  return parts.join(' ');
}

/**
 * Coerce a CSS length to a string with units, since canvas APIs
 * silently reject unitless lengths and keep the previous value.
 *
 * @param {number | string | undefined} value
 *
 * @return {string | undefined}
 */
function buildLength(value) {
  if (value == null) {
    return undefined;
  }

  if (typeof value === 'number' || /^-?\d+(\.\d+)?$/.test(value)) {
    return value + 'px';
  }

  return value;
}

/**
 * @param {string} text
 * @param {Record<string, number | string>} style
 *
 * @return {import('../util/Types').Dimensions}
 */
function getTextBBox(text, style) {
  var ctx = getCanvasContext();

  if (!ctx) {
    return { width: 0, height: 0 };
  }

  ctx.font = buildFont(style);

  if ('letterSpacing' in ctx) {
    ctx.letterSpacing = buildLength(style.letterSpacing) || '0px';
  }

  var emptyLine = text === '';

  // strip trailing whitespace so measurement matches the browser's
  // native rendering used by direct editing
  var measurable = emptyLine ? 'dummy' : text.replace(/\s+$/, '');
  var metrics = ctx.measureText(measurable);

  return {
    width: emptyLine ? 0 : metrics.width,
    height: 'fontBoundingBoxAscent' in metrics
      ? metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent
      : metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
  };
}


/**
 * Layout the next line and return the layouted element.
 *
 * Alters the lines passed.
 *
 * @param {string[]} lines
 * @param {number} maxWidth
 * @param {Record<string, number | string>} style
 *
 * @return {LineDescriptor} the line descriptor
 */
function layoutNext(lines, maxWidth, style) {

  var originalLine = lines.shift(),
      fitLine = originalLine;

  var textBBox;

  for (;;) {
    textBBox = getTextBBox(fitLine, style);

    textBBox.width = fitLine ? textBBox.width : 0;

    // try to fit
    if (fitLine === ' ' || fitLine === '' || textBBox.width < Math.round(maxWidth) || fitLine.length < 2) {
      return fit(lines, fitLine, originalLine, textBBox);
    }

    fitLine = shortenLine(fitLine, textBBox.width, maxWidth);
  }
}

/**
 * @param {string[]} lines
 * @param {string} fitLine
 * @param {string} originalLine
 * @param {Dimensions} textBBox
 *
 * @return {LineDescriptor}
 */
function fit(lines, fitLine, originalLine, textBBox) {
  if (fitLine.length < originalLine.length) {
    var remainder = originalLine.slice(fitLine.length).trim();

    lines.unshift(remainder);
  }

  return {
    width: textBBox.width,
    height: textBBox.height,
    text: fitLine
  };
}

var SOFT_BREAK = '\u00AD';


/**
 * Shortens a line based on spacing and hyphens.
 * Returns the shortened result on success.
 *
 * @param {string} line
 * @param {number} maxLength the maximum characters of the string
 *
 * @return {string} the shortened string
 */
function semanticShorten(line, maxLength) {

  var parts = line.split(/(\s|-|\u00AD)/g),
      part,
      shortenedParts = [],
      length = 0;

  // try to shorten via break chars
  if (parts.length > 1) {

    while ((part = parts.shift())) {
      if (part.length + length < maxLength) {
        shortenedParts.push(part);
        length += part.length;
      } else {

        // remove previous part, too if hyphen does not fit anymore
        if (part === '-' || part === SOFT_BREAK) {
          shortenedParts.pop();
        }

        break;
      }
    }
  }

  var last = shortenedParts[shortenedParts.length - 1];

  // translate trailing soft break to actual hyphen
  if (last && last === SOFT_BREAK) {
    shortenedParts[shortenedParts.length - 1] = '-';
  }

  return shortenedParts.join('');
}


/**
 * @param {string} line
 * @param {number} width
 * @param {number} maxWidth
 *
 * @return {string}
 */
function shortenLine(line, width, maxWidth) {
  var length = Math.max(line.length * (maxWidth / width), 1);

  // try to shorten semantically (i.e. based on spaces and hyphens)
  var shortenedLine = semanticShorten(line, length);

  if (!shortenedLine) {

    // force shorten by cutting the long word
    shortenedLine = line.slice(0, Math.max(Math.round(length - 1), 1));
  }

  return shortenedLine;
}


/**
 * Creates a new label utility
 *
 * @param {TextConfig} [config]
 */
function Text(config) {

  this._config = assign({}, {
    size: DEFAULT_LABEL_SIZE$1,
    padding: DEFAULT_BOX_PADDING,
    style: {},
    align: 'center-top'
  }, config || {});
}

/**
 * Returns the layouted text as an SVG element.
 *
 * @param {string} text
 * @param {TextLayoutConfig} options
 *
 * @return {SVGElement}
 */
Text.prototype.createText = function(text, options) {
  return this.layoutText(text, options).element;
};

/**
 * Returns a labels layouted dimensions.
 *
 * @param {string} text to layout
 * @param {TextLayoutConfig} options
 *
 * @return {Dimensions}
 */
Text.prototype.getDimensions = function(text, options) {
  return this.layoutText(text, options).dimensions;
};

/**
 * Creates and returns a label and its bounding box.
 *
 * @param {string} text the text to render on the label
 * @param {TextLayoutConfig} options
 *
 * @return { {
 *   element: SVGElement,
 *   dimensions: Dimensions
 * } }
 */
Text.prototype.layoutText = function(text, options) {
  var box = assign({}, this._config.size, options.box),
      style = assign({}, this._config.style, options.style),
      align = parseAlign(options.align || this._config.align),
      padding = parsePadding(options.padding !== undefined ? options.padding : this._config.padding),
      fitBox = options.fitBox || false;

  var lineHeight = getLineHeight(style);

  // we split text by lines and normalize
  // {soft break} + {line break} => { line break }
  var lines = text.split(/\u00AD?\r?\n/),
      layouted = [];

  var maxWidth = box.width - padding.left - padding.right;

  while (lines.length) {
    layouted.push(layoutNext(lines, maxWidth, style));
  }

  if (align.vertical === 'middle') {
    padding.top = padding.bottom = 0;
  }

  var totalHeight = reduce(layouted, function(sum, line, idx) {
    return sum + (lineHeight || line.height);
  }, 0) + padding.top + padding.bottom;

  var maxLineWidth = reduce(layouted, function(sum, line, idx) {
    return line.width > sum ? line.width : sum;
  }, 0);

  // the y position of the next line
  var y = padding.top;

  if (align.vertical === 'middle') {
    y += (box.height - totalHeight) / 2;
  }

  // magic number initial offset
  y -= (lineHeight || layouted[0].height) / 4;


  var textElement = create('text');

  attr(textElement, style);

  // layout each line taking into account that parent
  // shape might resize to fit text size
  forEach(layouted, function(line) {

    var x;

    y += (lineHeight || line.height);

    switch (align.horizontal) {
    case 'left':
      x = padding.left;
      break;

    case 'right':
      x = ((fitBox ? maxLineWidth : maxWidth)
        - padding.right - line.width);
      break;

    default:

      // aka center
      x = Math.max((((fitBox ? maxLineWidth : maxWidth)
        - line.width) / 2 + padding.left), 0);
    }

    var tspan = create('tspan');
    attr(tspan, { x: x, y: y });

    tspan.textContent = line.text;

    append(textElement, tspan);
  });

  var dimensions = {
    width: maxLineWidth,
    height: totalHeight
  };

  return {
    dimensions: dimensions,
    element: textElement
  };
};


function getLineHeight(style) {
  if ('fontSize' in style && 'lineHeight' in style) {
    return style.lineHeight * parseInt(style.fontSize, 10);
  }
}

/**
 * @typedef { import('../model/Types').Element } Element
 * @typedef { import('../model/Types').ModdleElement } ModdleElement
 */

/**
 * Is an element of the given BPMN type?
 *
 * @param  {Element|ModdleElement} element
 * @param  {string} type
 *
 * @return {boolean}
 */
function is(element, type) {
  var bo = getBusinessObject(element);

  return bo && (typeof bo.$instanceOf === 'function') && bo.$instanceOf(type);
}

/**
 * Return the business object for a given element.
 *
 * @param {Element|ModdleElement} element
 *
 * @return {ModdleElement}
 */
function getBusinessObject(element) {
  return (element && element.businessObject) || element;
}

/**
 * @typedef {import('diagram-js/lib/util/Types').Point} Point
 * @typedef {import('diagram-js/lib/util/Types').Rect} Rect
 *
 * @typedef {import('../model/Types').Element} Element
 * @typedef {import('../model/Types').ModdleElement} ModdleElement
 */

var DEFAULT_LABEL_SIZE = {
  width: 90};

var TEXT_ANNOTATION_PADDING = 7;

var DEFAULT_FONT_SIZE = 12;
var LINE_HEIGHT_RATIO = 1.2;

var MIN_TEXT_ANNOTATION_HEIGHT = 40;

/**
 * @typedef { {
 *   fontFamily: string;
 *   fontSize: number;
 *   fontWeight: string;
 *   lineHeight: number;
 * } } TextRendererStyle
 *
 * @typedef { {
 *   defaultStyle?: Partial<TextRendererStyle>;
 *   externalStyle?: Partial<TextRendererStyle>;
 * } } TextRendererConfig
 *
 * @typedef { import('diagram-js/lib/util/Text').TextLayoutConfig } TextLayoutConfig
 *
 * @typedef { import('diagram-js/lib/util/Types').Rect } Rect
 */


/**
 * Renders text and computes text bounding boxes.
 *
 * @param {TextRendererConfig} [config]
 */
function TextRenderer(config) {

  var defaultStyle = assign$1({
    fontFamily: 'Arial, sans-serif',
    fontSize: DEFAULT_FONT_SIZE,
    fontWeight: 'normal',
    lineHeight: LINE_HEIGHT_RATIO
  }, config && config.defaultStyle || {});

  var fontSize = parseInt(defaultStyle.fontSize, 10) - 1;

  var externalStyle = assign$1({}, defaultStyle, {
    fontSize: fontSize
  }, config && config.externalStyle || {});

  var textUtil = new Text({
    style: defaultStyle
  });

  /**
   * Get the new bounds of an externally rendered,
   * layouted label.
   *
   * @param {Rect} bounds
   * @param {string} text
   *
   * @return {Rect}
   */
  this.getExternalLabelBounds = function(bounds, text) {

    var box = {
      width: Math.max(bounds.width, DEFAULT_LABEL_SIZE.width),
      height: 30
    };

    var dimensions = getTextboxDimensions(text, box, {
      style: externalStyle
    });

    return {
      x: Math.round(bounds.x + bounds.width / 2 - dimensions.width / 2),
      y: bounds.y,
      width: Math.ceil(dimensions.width),
      height: Math.ceil(dimensions.height)
    };

  };

  /**
   * Get the new bounds of text annotation.
   *
   * @param {Rect} bounds
   * @param {string} text
   *
   * @return {Rect}
   */
  this.getTextAnnotationBounds = function(bounds, text) {

    var dimensions = getTextboxDimensions(text, bounds, {
      style: defaultStyle,
      align: 'left-top',
      padding: TEXT_ANNOTATION_PADDING
    });

    return {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: Math.max(MIN_TEXT_ANNOTATION_HEIGHT, Math.round(dimensions.height))
    };
  };

  /**
   * Get the dimensions of a text element.
   *
   * @param {string} text
   * @param {TextLayoutConfig} [options]
   *
   * @return {import('diagram-js/lib/util/Types').Dimensions}
   */
  this.getDimensions = function(text, options) {
    return textUtil.getDimensions(text, options || {});
  };

  /**
   * Compute dimension of text fitted inside a box.
   *
   * @param {string} text
   * @param {Rect} box
   * @param {TextLayoutConfig} layoutOptions
   *
   * @return {import('diagram-js/lib/util/Types').Dimensions}
   */
  function getTextboxDimensions(text, box, layoutOptions) {
    return textUtil.getDimensions(text, assign$1({ box: box }, layoutOptions));
  }

  /**
   * Create a layouted text element.
   *
   * @param {string} text
   * @param {TextLayoutConfig} [options]
   *
   * @return {SVGElement} rendered text
   */
  this.createText = function(text, options) {
    return textUtil.createText(text, options || {});
  };

  /**
   * Get default text style.
   */
  this.getDefaultStyle = function() {
    return defaultStyle;
  };

  /**
   * Get the external text style.
   */
  this.getExternalStyle = function() {
    return externalStyle;
  };

}

TextRenderer.$inject = [
  'config.textRenderer'
];

var DEFAULT_RENDER_PRIORITY = 1000;

/**
 * @typedef {import('../core/Types').ElementLike} Element
 * @typedef {import('../core/Types').ConnectionLike} Connection
 * @typedef {import('../core/Types').ShapeLike} Shape
 *
 * @typedef {import('../core/EventBus').default} EventBus
 */

/**
 * The base implementation of shape and connection renderers.
 *
 * @param {EventBus} eventBus
 * @param {number} [renderPriority=1000]
 */
function BaseRenderer(eventBus, renderPriority) {
  var self = this;

  renderPriority = renderPriority || DEFAULT_RENDER_PRIORITY;

  eventBus.on([ 'render.shape', 'render.connection' ], renderPriority, function(evt, context) {
    var type = evt.type,
        element = context.element,
        visuals = context.gfx,
        attrs = context.attrs;

    if (self.canRender(element)) {
      if (type === 'render.shape') {
        return self.drawShape(visuals, element, attrs);
      } else {
        return self.drawConnection(visuals, element, attrs);
      }
    }
  });

  eventBus.on([ 'render.getShapePath', 'render.getConnectionPath' ], renderPriority, function(evt, element) {
    if (self.canRender(element)) {
      if (evt.type === 'render.getShapePath') {
        return self.getShapePath(element);
      } else {
        return self.getConnectionPath(element);
      }
    }
  });
}

/**
 * Checks whether an element can be rendered.
 *
 * @param {Element} element The element to be rendered.
 *
 * @return {boolean} Whether the element can be rendered.
 */
BaseRenderer.prototype.canRender = function(element) {};

/**
 * Draws a shape.
 *
 * @param {SVGElement} visuals The SVG element to draw the shape into.
 * @param {Shape} shape The shape to be drawn.
 *
 * @return {SVGElement} The SVG element of the shape drawn.
 */
BaseRenderer.prototype.drawShape = function(visuals, shape) {};

/**
 * Draws a connection.
 *
 * @param {SVGElement} visuals The SVG element to draw the connection into.
 * @param {Connection} connection The connection to be drawn.
 *
 * @return {SVGElement} The SVG element of the connection drawn.
 */
BaseRenderer.prototype.drawConnection = function(visuals, connection) {};

/**
 * Gets the SVG path of the graphical representation of a shape.
 *
 * @param {Shape} shape The shape.
 *
 * @return {string} The SVG path of the shape.
 */
BaseRenderer.prototype.getShapePath = function(shape) {};

/**
 * Gets the SVG path of the graphical representation of a connection.
 *
 * @param {Connection} connection The connection.
 *
 * @return {string} The SVG path of the connection.
 */
BaseRenderer.prototype.getConnectionPath = function(connection) {};

function e(e,t){t&&(e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:false,writable:true,configurable:true}}));}

/**
 * UI and timing constants used across the application.
 * Centralizes magic numbers for easier maintenance and configuration.
 */
// =============================================================================
// UI Constants
// =============================================================================
/** Modal overlay z-index to ensure modals appear above other content */
/** Delay for BPMN renderer initialization in milliseconds */
var RENDER_DELAY_MS = 1500;

var img = "data:image/svg+xml,%3c%3fxml version='1.0' encoding='UTF-8' standalone='no'%3f%3e%3csvg xmlns:dc='http://purl.org/dc/elements/1.1/' xmlns:cc='http://creativecommons.org/ns%23' xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns%23' xmlns:svg='http://www.w3.org/2000/svg' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 202.4325 202.34125' height='202.34125' width='202.4325' xml:space='preserve' version='1.1' id='svg2'%3e%3cmetadata id='metadata8'%3e%3crdf:RDF%3e%3ccc:Work rdf:about=''%3e%3cdc:format%3eimage/svg%2bxml%3c/dc:format%3e%3cdc:type rdf:resource='http://purl.org/dc/dcmitype/StillImage' /%3e%3c/cc:Work%3e%3c/rdf:RDF%3e%3c/metadata%3e%3cdefs id='defs6'%3e%3cclipPath id='clipPath16' clipPathUnits='userSpaceOnUse'%3e%3cpath id='path18' d='m 0%2c161.873 161.946%2c0 L 161.946%2c0 0%2c0 0%2c161.873 Z' /%3e%3c/clipPath%3e%3c/defs%3e%3cg transform='matrix(1.25%2c0%2c0%2c-1.25%2c0%2c202.34125)' id='g10'%3e%3cg id='g12'%3e%3cg clip-path='url(%23clipPath16)' id='g14'%3e%3cg transform='translate(52.4477%2c88.1268)' id='g20'%3e%3cpath id='path22' style='fill:black%3bfill-opacity:1%3bfill-rule:nonzero%3bstroke:none' d='m 0%2c0 c 0%2c7.6 6.179%2c13.779 13.77%2c13.779 7.6%2c0 13.779%2c-6.179 13.779%2c-13.779 0%2c-2.769 -2.238%2c-5.007 -4.998%2c-5.007 -2.761%2c0 -4.999%2c2.238 -4.999%2c5.007 0%2c2.078 -1.695%2c3.765 -3.782%2c3.765 C 11.693%2c3.765 9.997%2c2.078 9.997%2c0 9.997%2c-2.769 7.76%2c-5.007 4.999%2c-5.007 2.238%2c-5.007 0%2c-2.769 0%2c0 m 57.05%2c-23.153 c 0%2c-2.771 -2.237%2c-5.007 -4.998%2c-5.007 l -46.378%2c0 c -2.761%2c0 -4.999%2c2.236 -4.999%2c5.007 0%2c2.769 2.238%2c5.007 4.999%2c5.007 l 46.378%2c0 c 2.761%2c0 4.998%2c-2.238 4.998%2c-5.007 M 35.379%2c-2.805 c -1.545%2c2.291 -0.941%2c5.398 1.35%2c6.943 l 11.594%2c7.83 c 2.273%2c1.58 5.398%2c0.941 6.943%2c-1.332 1.545%2c-2.29 0.941%2c-5.398 -1.35%2c-6.943 l -11.594%2c-7.83 c -0.852%2c-0.586 -1.829%2c-0.87 -2.788%2c-0.87 -1.607%2c0 -3.187%2c0.781 -4.155%2c2.202 m 31.748%2c-30.786 c 0%2c-0.945 -0.376%2c-1.852 -1.045%2c-2.522 l -8.617%2c-8.617 c -0.669%2c-0.668 -1.576%2c-1.045 -2.523%2c-1.045 l -52.833%2c0 c -0.947%2c0 -1.854%2c0.377 -2.523%2c1.045 l -8.617%2c8.617 c -0.669%2c0.67 -1.045%2c1.577 -1.045%2c2.522 l 0%2c52.799 c 0%2c0.947 0.376%2c1.854 1.045%2c2.522 l 8.617%2c8.619 c 0.669%2c0.668 1.576%2c1.044 2.523%2c1.044 l 52.833%2c0 c 0.947%2c0 1.854%2c-0.376 2.523%2c-1.044 l 8.617%2c-8.619 c 0.669%2c-0.668 1.045%2c-1.575 1.045%2c-2.522 l 0%2c-52.799 z m 7.334%2c61.086 -11.25%2c11.25 c -1.705%2c1.705 -4.018%2c2.663 -6.428%2c2.663 l -56.523%2c0 c -2.412%2c0 -4.725%2c-0.959 -6.43%2c-2.665 L -17.412%2c27.494 c -1.704%2c-1.705 -2.661%2c-4.016 -2.661%2c-6.427 l 0%2c-56.515 c 0%2c-2.411 0.958%2c-4.725 2.663%2c-6.428 l 11.25%2c-11.25 c 1.705%2c-1.705 4.017%2c-2.662 6.428%2c-2.662 l 56.515%2c0 c 2.41%2c0 4.723%2c0.957 6.428%2c2.662 l 11.25%2c11.25 c 1.705%2c1.703 2.663%2c4.017 2.663%2c6.428 l 0%2c56.514 c 0%2c2.412 -0.958%2c4.724 -2.663%2c6.429' /%3e%3c/g%3e%3c/g%3e%3c/g%3e%3c/g%3e%3c/svg%3e";

var RobotTaskRenderer = /** @class */ (function () {
    function RobotTaskRenderer(eventBus, bpmnRenderer) {
        this.$inject = [];
        this.bpmnRenderer = bpmnRenderer;
        /* @ts-expect-error BaseRenderer is a constructor-like function that requires this binding */
        BaseRenderer.call(this, eventBus, RENDER_DELAY_MS);
    }
    RobotTaskRenderer.prototype.canRender = function (element) {
        return is(element, 'bpmn:ServiceTask') && /robot/i.exec(element.id) !== null;
    };
    RobotTaskRenderer.prototype.drawShape = function (parent, element) {
        var _a, _b;
        (_b = (_a = this.bpmnRenderer.handlers)['bpmn:Task']) === null || _b === void 0 ? void 0 : _b.call(_a, parent, element);
        var gfx = create('image', {
            x: -1,
            y: -1,
            width: 32, // element.width,
            height: 32, //  element.height,
            href: img,
        });
        append(parent, gfx);
        return gfx;
    };
    return RobotTaskRenderer;
}());
/**
 * Factory function to create RobotTaskRenderer instances.
 * @param eventBus - The diagram event bus
 * @param bpmnRenderer - The BPMN renderer instance
 * @returns A configured RobotTaskRenderer instance
 */
function factory(eventBus, bpmnRenderer) {
    var instance = new RobotTaskRenderer(eventBus, bpmnRenderer);
    e(instance, BaseRenderer);
    instance.$inject = ['eventBus', 'bpmnRenderer'];
    return instance;
}

/**
 * Adjusts text options to ensure bounding box fits text.
 *
 * @param text - The text to render
 * @param options - Layout options
 * @returns Adjusted text options
 */
function adjustTextOptions(text, options) {
    var _a, _b, _c, _d;
    if (!(options === null || options === void 0 ? void 0 : options.box) || !text) {
        return options;
    }
    var words = text.split(/\s+/);
    var style = (_a = options.style) !== null && _a !== void 0 ? _a : {};
    var fontSize = '11px';
    if (typeof style.fontSize === 'number') {
        fontSize = "".concat(style.fontSize, "px");
    }
    else if (typeof style.fontSize === 'string') {
        fontSize = style.fontSize;
    }
    var fontFamily = (_b = style.fontFamily) !== null && _b !== void 0 ? _b : 'IBMPlexSans, open_sansregular, Helvetica, Arial, Verdana, sans-serif';
    var canvas = null;
    if (typeof document !== 'undefined') {
        canvas = document.createElement('canvas');
    }
    var ctx = canvas ? canvas.getContext('2d') : null;
    if (ctx) {
        ctx.font = "".concat(fontSize, " ").concat(fontFamily);
    }
    var maxWordW = 0;
    for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
        var w = words_1[_i];
        if (!w) {
            continue;
        }
        var wLen = ctx ? ctx.measureText(w).width : w.length * 8;
        if (wLen > maxWordW) {
            maxWordW = wLen;
        }
    }
    var pad = 0;
    if (typeof options.padding === 'number') {
        pad = options.padding * 2;
    }
    else if (options.padding && typeof options.padding === 'object') {
        var p = options.padding;
        pad = ((_c = p.left) !== null && _c !== void 0 ? _c : 0) + ((_d = p.right) !== null && _d !== void 0 ? _d : 0);
    }
    var neededW = Math.ceil(maxWordW + pad) + 4;
    if (options.box.width < neededW) {
        return __assign(__assign({}, options), { box: __assign(__assign({}, options.box), { width: neededW }) });
    }
    return options;
}
/**
 * Custom text renderer extending bpmn-js TextRenderer to ensure proper box width.
 */
var CustomTextRenderer = /** @class */ (function (_super) {
    __extends(CustomTextRenderer, _super);
    function CustomTextRenderer() {
        var _this = _super.call(this, {
            defaultStyle: {
                fontFamily: 'IBMPlexSans, open_sansregular, Helvetica, Arial, Verdana, sans-serif',
                fontSize: 12,
                lineHeight: 1.2,
            },
            externalStyle: {
                fontFamily: 'IBMPlexSans, open_sansregular, Helvetica, Arial, Verdana, sans-serif',
                fontSize: 11,
                lineHeight: 1.2,
            },
        }) || this;
        var origCreateText = _this.createText.bind(_this);
        var origGetDimensions = _this.getDimensions.bind(_this);
        _this.createText = function (text, options) {
            var adjusted = adjustTextOptions(text, options);
            return origCreateText(text, adjusted);
        };
        _this.getDimensions = function (text, options) {
            var adjusted = adjustTextOptions(text, options);
            return origGetDimensions(text, adjusted);
        };
        return _this;
    }
    return CustomTextRenderer;
}(TextRenderer));
var index = {
    __init__: ['RobotTaskRenderer'],
    RobotTaskRenderer: ['type', factory],
    textRenderer: ['type', CustomTextRenderer],
};

export { index as default };
