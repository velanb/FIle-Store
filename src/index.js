const Utils = require('./utils/Utils')
const {
  DataStoreError
} = require('../src/utils/ErrorHandlers')

class FileDB {
  constructor(path, opts = {}) {
    this._path = this._pathFunction(path);
    this._options = Object.assign({
      maxKeyChars: opts.maxKeyChars || 32, //Chars
      maxJSONSize: opts.maxJSONSize || 16, //In KB
      maxFileStoreSize: opts.maxFileStoreSize || 1024 // In GB
    });
  }

  create(key, value, ttl) {
    return Promise.resolve().then(() => {
      return (Utils.isValidKey(key, this._options.maxKeyChars) && Utils.isValidJSON(value) && Utils.validateJSONSize(value, this._options.maxJSONSize) && Utils.verifyFileSize(this._path, this._options.maxFileStoreSize)) ? true : false;
    }).then((status) => {
      return status ? Utils.signTtlObj(value, ttl) : false;
    }).then(data => {
      let fileData = Utils.jsonToMap(Utils.readFile(this._path));
      if (fileData.has(key)) {
        throw new DataStoreError(`The key -> ${key} already exists!`);
      } else {
        fileData.set(key, data)
        Utils.writeFile(this._path, Utils.mapToJson(fileData))
        return true;
      }
    }).then(success => {
      return success ? console.log(`Successfully added ${key} to store`) : console.log(`Issue adding ${key} to store`);
    }).catch(err => {
      throw err;
    })
  }

  read(key) {
    return Promise.resolve().then(() => {
      return Utils.jsonToMap(Utils.readFile(this._path));
    }).then(fileData => {
      return Utils.isValidKey(key, this._options.maxKeyChars) ? fileData : false;
    }).then((fileData) => {
      return Utils.hasEntry(key, fileData);
    }).then((fileData) => {
      let data = fileData.get(key);
      return Utils.verfiyTTL(data) ? data : false
    }).then((data) => data.value).catch(err => {
      throw err;
    })
  }

  delete(key) {
    return Promise.resolve().then(() => {
      return Utils.jsonToMap(Utils.readFile(this._path));
    }).then(fileData => {
      return Utils.hasEntry(key, fileData);
    }).then(fileData => {
      let data = fileData.get(key);
      return Utils.verfiyTTL(data) ? {
        fileData,
        data
      } : false;
    }).then(state => {
      state.fileData.delete(key);
      Utils.writeFile(this._path, Utils.mapToJson(state.fileData))
      return state.data;
    }).then((data) => {
      console.log(`Successfully deleted Key:${key} and Data:${data}`);
      return true;
    }).catch(err => {
      throw err;
    })
  }

  _pathFunction(path) {
    return (typeof path == 'undefined') ? Utils.defaultPath() : Utils.setPath(path);
  }
}

module.exports = FileDB;