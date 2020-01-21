class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

class JSONValidation extends ValidationError {
  constructor(message) {
    super(message);
    this.name = "JSONValidation";
  }
}

class KeyValidation extends ValidationError {
  constructor(message) {
    super(message);
    this.name = "KeyValidation";
  }
}

class DataStoreError extends ValidationError {
  constructor(message) {
    super(message);
    this.name = "DataStoreError";
  }
}

class TypeError extends Error {
  constructor(message) {
    super(message);
    this.name = "TypeError";
  }
}

class FileError extends Error {
  constructor(message) {
    super(message);
    this.name = "FileError";
  }
}

class TTLError extends Error {
  constructor(message) {
    super(message);
    this.name = "TTLError";
  }
}

class DataUnavaliable extends Error {
  constructor(message) {
    super(message)
    this.name = 'DataUnavaliable';
  }
}


module.exports = {
  ValidationError,
  TypeError,
  FileError,
  TTLError,
  JSONValidation,
  DataStoreError,
  KeyValidation,
  DataUnavaliable
}