# Project Title

File Based Data-Store

## Getting Started

This is a File based data store where you can add key value pairs which can be retrived later on demand. 

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

## Create ->> 
 - This method take three parameters(The third one being optional);

```
 create(key, valueInJSON, ttl);
 ```
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






## Running the tests

Explain how to run the automated tests for this system

