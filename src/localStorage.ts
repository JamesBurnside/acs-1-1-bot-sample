/**
 * Load a value from local storage
 * @param key - The key of the value to retrieve
 * @returns The parsed value if it exists, otherwise null
 */
export function getLocalStorageItem<T>(key: string): T | undefined {
  const stringValue = localStorage.getItem(key);
  if (stringValue) {
    try {
      return JSON.parse(stringValue) as T;
    } catch (e) {
      console.error('Error parsing JSON from local storage', e);
      return undefined;
    }
  }
  return undefined;
}

/**
 * Store a value in local storage
 * @param key - The key under which the value should be stored
 * @param value - The value to store; can be any type
 */
export function setLocalStorageItem(key: string, value: any): void {
  const stringValue = JSON.stringify(value);
  localStorage.setItem(key, stringValue);
}
