/**
 * Mock for query-string module.
 * The actual module is ESM-only which doesn't work with Jest.
 *
 * @module
 */

type ParsedQuery = Record<string, string | string[] | null | undefined>;

interface ParseOptions {
  parseNumbers?: boolean;
  parseBooleans?: boolean;
}

/**
 * Parse a query string into an object.
 *
 * @param query - The query string to parse (with or without leading ?)
 * @param _options - Parse options
 * @returns Parsed query object
 */
function parse(query: string, _options?: ParseOptions): ParsedQuery {
  const result: ParsedQuery = {};

  // Remove leading ? or # if present
  const cleanQuery = query.replace(/^[?#]/, '');

  if (cleanQuery.length === 0) {
    return result;
  }

  const pairs = cleanQuery.split('&');
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    if (key !== undefined) {
      const decodedKey = decodeURIComponent(key);
      const decodedValue = value !== undefined ? decodeURIComponent(value) : null;

      const existing = result[decodedKey];
      if (existing !== undefined) {
        // Convert to array if multiple values
        if (Array.isArray(existing)) {
          existing.push(decodedValue ?? '');
        } else {
          result[decodedKey] = [existing as string, decodedValue ?? ''];
        }
      } else {
        result[decodedKey] = decodedValue ?? '';
      }
    }
  }

  return result;
}

/**
 * Stringify an object into a query string.
 *
 * @param object - The object to stringify
 * @returns Query string (without leading ?)
 */
function stringify(object: Record<string, unknown>): string {
  const pairs: string[] = [];

  for (const [key, value] of Object.entries(object)) {
    if (value === null || value === undefined) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        let itemStr: string;
        if (typeof item === 'object' && item !== null) {
          itemStr = JSON.stringify(item);
        } else if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') {
          itemStr = String(item);
        } else {
          itemStr = JSON.stringify(item);
        }
        pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(itemStr)}`);
      }
    } else {
      // Value is not null, not undefined, and not an array at this point
      let valueStr: string;
      if (typeof value === 'object') {
        valueStr = JSON.stringify(value);
      } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        valueStr = String(value);
      } else {
        valueStr = JSON.stringify(value);
      }
      pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(valueStr)}`);
    }
  }

  return pairs.join('&');
}

export default { parse, stringify };
export { parse, stringify };
