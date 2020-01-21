# File Based Data-Store
A File based data store where you can add key value pairs which can be retrived later on demand. 

### Initialization

You can initialize the library:

Note: Using the default constructor will create a file by itself in a optimal path of your computer
```
(async () => {
  try {
    let fileDB = new FileDB();
  } catch (err) {
    console.log(`Err->>`, err)
  }
})();
```

You can also provide your own path by passing in path while Initializing

Example:
```
(async () => {
  try {
    let path = '../yourpath';
    let fileDB = new FileDB(path);
  } catch (err) {
    console.log(`Err->>`, err)
  }
})();
```


Methods available - create(), read(), delete()

## create(key, valueInJSON, TTL)
 - This method take three parameters(The third one being optional);

Key -> Should be a String of max 32 Chars
Value -> Should be a JSON
ttl -> Time To Live -> OPTIONAL - in seconds.
After the TTL expires you cannot read or delete the entry.

Example: (With TTL) 
```
(async () => {
  try {
    let fileDB = new FileDB();
    await fileDB.create("thisKey", {"data": {
      "Name": "Author"
    }, 1000);
  } catch (err) {
    console.log(`Err->>`, err)
  }
})();
```

Example: (Without TTL) 
```
(async () => {
  try {
    let fileDB = new FileDB();
    await fileDB.create("thisKey", {"data": {
      "Name": "Author"
    });
  } catch (err) {
    console.log(`Err->>`, err)
  }
})();
```



## read(key); 
Please give in a valid key to retrive data from the file store

Example: 
```
(async () => {
  try {
    let fileDB = new FileDB();
    await fileDB.read("thisKey");
  } catch (err) {
    console.log(`Err->>`, err)
  }
})();
```

## delete(key); 
Please give in a valid key to retrive data from the file store

Example: 
```
(async () => {
  try {
    let fileDB = new FileDB();
    await fileDB.delete("thisKey");
  } catch (err) {
    console.log(`Err->>`, err)
  }
})();
```

## Running the tests

You can run the test by using this command 
```
npm run test
```
