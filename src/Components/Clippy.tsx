import React, { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { HiCheck, HiClipboardCopy } from 'react-icons/hi';

interface Props {
  value: string;
}

export const Clippy: React.FC<React.PropsWithChildren<Props>> = ({ value, children }) => {
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  return (
    <span
      onMouseOver={() => {
        if (!isMouseOver) {
          setIsMouseOver(true);
        }
      }}
      onMouseLeave={() => {
        setIsMouseOver(false);
        setHasCopied(false);
      }}
      onFocus={() => {
        setIsMouseOver(true);
      }}
      onBlur={() => {
        setIsMouseOver(false);
        setHasCopied(false);
      }}
      style={{ display: 'flex', alignItems: 'center' }}
      role="group"
      tabIndex={0}
    >
      {children}
      {isMouseOver ? (
        <CopyToClipboard
          text={value}
          onCopy={() => {
            setHasCopied(true);
          }}
        >
          <button
            type="button"
            onClick={e => {
              e.preventDefault();
            }}
            style={{
              fontSize: '120%',
              paddingLeft: '0.2em',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
            aria-label="Copy to clipboard"
          >
            {hasCopied ? (
              <HiCheck style={{ color: 'green', display: 'flex' }} />
            ) : (
              <HiClipboardCopy style={{ display: 'flex' }} />
            )}
          </button>
        </CopyToClipboard>
      ) : (
        <span style={{ fontSize: '120%', width: '1.2em' }} />
      )}
    </span>
  );
};
