console.log("This is starting point of my code ");

setImmediate(() => {
  console.log("This is setImmediate operation");
});

process.nextTick(() => {
  console.log("This is process.nextTick operation");
});

setTimeout(() => {
  console.log("This is first setTimeout operation");
}, 10000);

console.log("This is end point of my code");

setTimeout(() => {
  console.log("This is second setTimeout operation");
}, 5000);
