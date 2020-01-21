const FileDB = require('../src/index');
const os = require('os');
const fs = require('fs')


describe('Initializing the FileDB class(Without passing any path)', () => {
  let fileInstance;
  beforeEach(() => {
    fileInstance = new FileDB();
  });

  test('The class is initialized', () => {
    expect(fileInstance).toBeDefined();
  });
  test('An optimal path is set', () => {
    expect(fileInstance).toMatchObject({
      "_options": {
        "maxFileStoreSize": 1024,
        "maxJSONSize": 16,
        "maxKeyChars": 32
      },
      "_path": `${os.homedir()}/data-store.txt`
    });
  })
});

describe('Initializing the FileDB class(Passing a custom path)', () => {
  let fileInstance;
  let path = __dirname;
  beforeEach(() => {
    fileInstance = new FileDB(path);
  });
  test('The class is initialized', () => {
    expect(fileInstance).toBeDefined();
  });

  test('Check if the path is added to the instance', () => {
    expect(fileInstance).toMatchObject({
      "_options": {
        "maxFileStoreSize": 1024,
        "maxJSONSize": 16,
        "maxKeyChars": 32
      },
      "_path": `${path}/data-store.txt`
    });
  });
});

describe('Edge cases that should fail on Initializing the class', () => {
  test('Should fail if the path is null', async () => {
    try {
      new FileDB(null);
    } catch (err) {
      expect(err.message).toEqual(`The path cannot be null/undefined`);
    }
  });

  test('Should fail if a invalid path is provided', async () => {
    try {
      new FileDB('');
    } catch (err) {
      expect(err.message).toEqual(`Invalid path. Please provide a valid path to continue.`);
    }
  });
});

describe(`Adding an entry to the data store`, () => {
  beforeEach(() => {
    fs.unlinkSync(__dirname + '/data-store.txt')
  })

  test('Should create an entry in the data store', () => {
    let fileInstance = new FileDB(__dirname);
    let status = fileInstance.create('test', {
      "hello": "test"
    });
    expect(status).toBeTruthy();
  });

  test('Should create an new entry with ttl', async () => {
    try {
      let fileInstance = new FileDB(__dirname);
      let status = await fileInstance.create('test', {
        "hello": "test"
      }, 1000);
    } catch (err) {
      expect(status).toBeTruthy();
    }
  });
});

describe('Edge case that should fail while creating a new entry', () => {
  beforeEach(async () => {
    await fs.unlinkSync(__dirname + '/data-store.txt')
  })
  test('Should fail when the input key is not of type string', async () => {
    try {
      let fileInstance = new FileDB(__dirname);
      await fileInstance.create(1, {
        "hello": "test"
      })
    } catch (err) {
      expect(err.message).toEqual(`Invaid key type! The key should be of type String.`);
    }
  });

  test('Should fail when the input key is greater than 32chars', async () => {
    try {
      let fileInstance = new FileDB(__dirname);
      await fileInstance.create("1234567890qwertyuioplkjhgfdsazxcvbnm", {
        "hello": "test"
      })
    } catch (err) {
      expect(err.message).toEqual(`The max key length should not exceed 32 Chars!`);
    }
  });

  test('Should fail when the input value is not of type JSON', async () => {
    try {
      let fileInstance = new FileDB(__dirname);
      await fileInstance.create("test", '')
    } catch (err) {
      expect(err.message).toEqual(`The input value must be of type JSON`);
    }
  });

  test('Should fail when the input value is null or undefined', async () => {
    try {
      let fileInstance = new FileDB(__dirname);
      await fileInstance.create("test", null)
    } catch (err) {
      expect(err.message).toEqual(`The input value cannot be null/undefined.`);
    }
  });

  test('Should fail when the input ttl value if not of type number', async () => {
    try {
      let fileInstance = new FileDB(__dirname);
      await fileInstance.create("test", {
        "hello": "test"
      }, null)
    } catch (err) {
      expect(err.message).toEqual(`The TTL should always be of type Integer`);
    }
  });
})

describe('Reading an entry', () => {
  let fileInstance;

  beforeEach(async () => {
    await fs.unlinkSync(__dirname + '/data-store.txt')
    fileInstance = new FileDB(__dirname);
  })
  test('This should throw an error if an invalid key is provided', async () => {
    try {
      await fileInstance.create('test10', {
        "hello": "test"
      });
      await fileInstance.read("testqwerty");
    } catch (err) {
      expect(err.message).toEqual(`Entry not found!`);
    }
  });

  test('This should throw ttl error if ttl expires', async () => {
    setTimeout(async () => {
      try {
        await fileInstance.create('test11', {
          "hello": "test"
        }, 1);
        let state = await fileInstance.read(key);
      } catch (err) {
        expect(err.message).toEqual(`Entry not found!`);
      }
    }, 10000);
  });
})


describe('Deleting an entry', () => {
  let fileInstance;

  beforeEach(async () => {
    await fs.unlinkSync(__dirname + '/data-store.txt')
    fileInstance = new FileDB(__dirname);
    let status = await fileInstance.create('test', {
      "hello": "test"
    });
  })
  test('This should throw an error if an invalid key is provided', async () => {
    try {
      await fileInstance.delete("test");
    } catch (err) {
      expect(err.message).toEqual(`Entry not found!`);
    }
  });

  test('This should delete the data from the data store on a valid key', async () => {
    let key = new Date().toISOString()
    await fileInstance.create(key, {
      "hello": "test"
    });
    let state = await fileInstance.delete(key);
    expect(state).toBeTruthy();
  });

  test('This should throw ttl error if ttl expires', async () => {
    let key = new Date().toISOString();
    await fileInstance.create(key, {
      "hello": "test"
    }, 100);
    setTimeout(async () => {
      try {
        let state = await fileInstance.delete(key);
      } catch (err) {
        expect(err.message).toEqual(`Entry not found!`);
      }
    }, 10000);
  });
})