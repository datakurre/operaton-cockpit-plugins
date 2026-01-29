/**
 * Jest polyfills setup file.
 *
 * This file runs before any tests and sets up polyfills required by MSW 2.x.
 * It must be listed in jest.config.js `setupFiles` (before `setupFilesAfterEnv`).
 *
 * @module
 */

const { TextDecoder, TextEncoder } = require('util');
const { ReadableStream, TransformStream, WritableStream } = require('stream/web');
const { MessageChannel, MessagePort } = require('worker_threads');

// Polyfill text encoding
Object.assign(globalThis, {
  TextDecoder,
  TextEncoder,
  ReadableStream,
  TransformStream,
  WritableStream,
  MessageChannel,
  MessagePort,
});

// Polyfill BroadcastChannel
class BroadcastChannelMock {
  constructor(name) {
    this.name = name;
    this.onmessage = null;
    this.onmessageerror = null;
  }
  postMessage() {}
  close() {}
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() {
    return true;
  }
}
globalThis.BroadcastChannel = BroadcastChannelMock;

// Import fetch APIs from undici and set them globally
const { fetch, FormData, Headers, Request, Response } = require('undici');

Object.assign(globalThis, {
  fetch,
  FormData,
  Headers,
  Request,
  Response,
});
