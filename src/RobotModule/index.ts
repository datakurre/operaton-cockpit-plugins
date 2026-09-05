import TextRenderer from 'bpmn-js/lib/draw/TextRenderer';
import RobotTaskRenderer from './renderer';

function adjustTextOptions(text: string, options?: any) {
  if (!options || !options.box || !text) {
    return options;
  }
  const words = text.split(/\s+/);
  const style = options.style || {};
  const fontSize = style.fontSize
    ? (typeof style.fontSize === 'number' ? `${style.fontSize}px` : style.fontSize)
    : '11px';
  const fontFamily = style.fontFamily || 'IBMPlexSans, open_sansregular, Helvetica, Arial, Verdana, sans-serif';

  let canvas: HTMLCanvasElement | null = null;
  if (typeof document !== 'undefined') {
    canvas = document.createElement('canvas');
  }
  const ctx = canvas ? canvas.getContext('2d') : null;
  if (ctx) {
    ctx.font = `${fontSize} ${fontFamily}`;
  }

  let maxWordW = 0;
  for (const w of words) {
    if (!w) continue;
    const wLen = ctx ? ctx.measureText(w).width : w.length * 8;
    if (wLen > maxWordW) {
      maxWordW = wLen;
    }
  }

  const pad =
    (options.padding && typeof options.padding === 'object'
      ? (options.padding.left || 0) + (options.padding.right || 0)
      : (options.padding || 0) * 2) || 0;

  const neededW = Math.ceil(maxWordW + pad) + 4;
  if (options.box.width < neededW) {
    return {
      ...options,
      box: {
        ...options.box,
        width: neededW,
      },
    };
  }
  return options;
}

class CustomTextRenderer extends TextRenderer {
  constructor() {
    super({
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
    });

    const origCreateText = (this as any).createText.bind(this);
    const origGetDimensions = (this as any).getDimensions.bind(this);

    (this as any).createText = (text: string, options?: any) => {
      const adjusted = adjustTextOptions(text, options);
      return origCreateText(text, adjusted);
    };

    (this as any).getDimensions = (text: string, options?: any) => {
      const adjusted = adjustTextOptions(text, options);
      return origGetDimensions(text, adjusted);
    };
  }
}

export default {
  __init__: ['RobotTaskRenderer'],
  RobotTaskRenderer: ['type', RobotTaskRenderer],
  textRenderer: ['type', CustomTextRenderer],
};

