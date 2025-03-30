# On The Minute

Register a callback to execute every minute on the minute.

```javascript
const scheduler = new OnTheMinute();
scheduler.registerCallback(() => console.log(new Date().toString()));
```
