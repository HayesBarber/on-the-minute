import { OnTheMinute } from "../src/index.ts";

const scheduler = new OnTheMinute();
scheduler.registerCallback(() => console.log(new Date().toString()));
