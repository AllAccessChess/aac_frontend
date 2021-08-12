let prevTime = new Date().getTime();

setInterval(() => {
  let curTime = new Date().getTime();
  postMessage({ type: "interval", duration: curTime - prevTime });
  prevTime = curTime;
}, 100);
