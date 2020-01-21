const fs = require('fs');
const os = require('os');
const {
  JSONValidation,
  KeyValidation,
  DataUnavaliable,
  FileError,
  TTLError,
  DataStoreError
} = require('./ErrorHandlers')

class Utils {
  constructor() {
    this.bytes = 0;
  }
  sizeOfJSON(obj) {
    if (obj !== null && obj !== undefined) {
      var objClass = Object.prototype.toString.call(obj).slice(8, -1);
      if (objClass === 'Object' || objClass === 'Array') {
        for (var key in obj) {
          if (!obj.hasOwnProperty(key)) continue;
          this.sizeOfJSON(obj[key]);
        }
      } else this.bytes += obj.toString().length * 2;
    }
    return this.bytes;
  };

  static mapToJson(map) {
    return JSON.stringify([...map]);
  }

  static jsonToMap(jsonStr) {
    return new Map(JSON.parse(jsonStr));
  }

  static verifyFileSize(path, maxFileStoreSize) {
    let stats = fs.statSync(`${path}`);
    let fileSizeInBytes = stats["size"];
    let fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
    if ((fileSizeInMegabytes >= maxFileStoreSize)) {
      throw new FileError(`The file-store size exceeded the limit`);
    } else {
      return true;
    }
  }

  static signTtlObj(value, ttl) {
    let expiryTime = null;

    if (typeof ttl == 'undefined') {
      return {
        expiryTime,
        value
      }
    }

    if ((typeof ttl == 'number')) {
      if (ttl > 0) {
        expiryTime = (Date.now() + ttl * 1000);
        return {
          expiryTime,
          value
        }
      } else {
        throw new TTLError(`The TTL should be greater than 0`);
      }
    } else {
      throw new TTLError(`The TTL should always be of type Integer`);
    }
  }

  static hasEntry(key, data) {
    if (data.has(key)) {
      return data;
    } else {
      throw new DataUnavaliable(`Entry not found!`);
    }
  }

  static verfiyTTL(data) {
    if (typeof data.expiryTime == 'undefined' || data.expiryTime == null) {
      return true;
    } else {
      if ((Date.now() < data.expiryTime)) {
        return true;
      } else {
        throw new TTLError(`This Key has expired for read/delete operation`);
      }
    }
  }

  static isValidJSON(json) {
    if (json == null || typeof json == 'undefined') {
      throw new JSONValidation(`The input value cannot be null/undefined.`);
    }

    if (typeof json != 'object' || Array.isArray(json)) {
      throw new JSONValidation(`The input value must be of type JSON`);
    } else {
      return true;
    }
  }

  static isValidKey(key, maxKeyChars) {
    if (typeof key == 'undefined' || key == null) {
      throw new KeyValidation(`The key cannot be null or undefined.`);
    }
    if (typeof key == 'string') {
      let keyLength = key.length;
      if (keyLength == 0) {
        throw new KeyValidation(`The key cannot be empty.`);
      }
      if ((keyLength <= maxKeyChars)) {
        return true;
      } else {
        throw new KeyValidation(`The max key length should not exceed ${maxKeyChars} Chars!`)
      }
    } else {
      throw new KeyValidation(`Invaid key type! The key should be of type String.`);
    }
  }

  static isValidPath(path) {
    if (path == null || typeof path == 'undefined') {
      throw new DataStoreError(`The path cannot be null/undefined`);
    } else {
      return fs.existsSync(path);
    }
  }

  static initFile(path) {
    if (this.isValidPath(path)) {
      return false;
    } else {
      fs.writeFileSync(`${path}`, null, 'utf-8');
      return path;
    }
  }

  static validateJSONSize(value, maxJSONSize) {
    let jsonSize = new Utils();
    jsonSize = jsonSize.sizeOfJSON(value);
    let maxSize = 1024 * 1024 * maxJSONSize;

    if (jsonSize < maxSize) {
      return true;
    } else {
      throw new JSONValidation(`The JSON Value size has exceeded the limit of ${maxJSONSize}KB`)
    }
  }

  static setPath(path) {
    if (Utils.isValidPath(path)) {
      let newPath = `${path}/data-store.txt`
      Utils.initFile(newPath);
      return newPath;
    } else {
      throw new FileError(`Invalid path. Please provide a valid path to continue.`)
    }
  }

  static defaultPath() {
    let path = `${os.homedir()}/data-store.txt`
    Utils.initFile(path);
    return path;
  }

  static readFile(path) {
    return fs.readFileSync(`${path}`, {
      encoding: 'utf8'
    })
  }

  static writeFile(path, data) {
    return fs.writeFileSync(`${path}`, data);
  }
}

module.exports = Utils;