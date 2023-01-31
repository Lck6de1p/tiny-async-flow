import { AsyncFlow } from "../lib/esm.js";

const asyncFlow = new AsyncFlow();

asyncFlow.addAsync(['a', 'b'], function () {
  alert("trigger a & b");
});

document.getElementById('btnA').addEventListener('click', () => {
  asyncFlow.trigger('a');
})
document.getElementById('btnB').addEventListener('click', () => {
  asyncFlow.trigger('b');
})