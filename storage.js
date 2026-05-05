/**
 * Storage layer for Produco
 * localStorage wrapper for data persistence
 */

class LocalStorage {
  constructor(prefix = 'produco') {
    this.prefix = prefix;
  }

  _getKey(key) {
    return `${this.prefix}_${key}`;
  }

  setItem(key, value) {
    try {
      localStorage.setItem(this._getKey(key), JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      return false;
    }
  }

  getItem(key) {
    try {
      const value = localStorage.getItem(this._getKey(key));
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Storage error:', error);
      return null;
    }
  }

  removeItem(key) {
    try {
      localStorage.removeItem(this._getKey(key));
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      return false;
    }
  }

  clear() {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(this.prefix))
        .forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      return false;
    }
  }

  getAllKeys() {
    return Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .map(key => key.replace(`${this.prefix}_`, ''));
  }
}

module.exports = LocalStorage;
