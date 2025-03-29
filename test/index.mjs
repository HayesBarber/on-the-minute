import { OnTheMinute } from "../src/index.ts";

const callback = () => {
  console.log(new Date().toString());
};

const scheduler = new OnTheMinute();

scheduler.registerCallback(callback);
