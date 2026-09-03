import EventEmitter from "node:events";
const myEmitter = new EventEmitter();
myEmitter.on("greet", (teacher) => {
  console.log(`class is starting with ${teacher}`);
});

myEmitter.on("exit", (teacher) => {
  console.log(`class is ending with ${teacher}`);
});
myEmitter.emit("greet", "Mr. Chandrahas");
myEmitter.emit("exit", "Mr. Chandrahas");

myEmitter.on("hii", (ADT) => {
  console.log(`Shinigami loves apple ${ADT}`);
});
myEmitter.emit("hii", "ADT");