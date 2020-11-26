function time() {
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  let yoil = date.getDay();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let sec = date.getSeconds();
  const yoilKR = {
    0: "일",
    1: "월",
    2: "화",
    3: "수",
    4: "목",
    5: "금",
    6: "토",
  };
  const ampm = `${hours >= 12 ? "PM" : "AM"}`;
  if (hours > 12) {
    hours = hours - 12;
  } else {
    if (hours === 0) {
      hours = 12;
    }
  }
  minutes = `${minutes < 10 ? "0" + `${minutes}` : minutes}`;
  sec = `${sec < 10 ? "0" + `${sec}` : sec}`;
  yoil = yoilKR[yoil];
  return {
    month: month,
    day: day,
    yoil: yoil,
    hours: hours,
    minutes: minutes,
    ampm: ampm,
    sec: sec,
  };
}

function clock() {
  const hourform = document.getElementById("hour");
  const minuteform = document.getElementById("minute");
  const ampmform = document.getElementById("ampm");
  const secform = document.getElementById("second");
  hourform.innerHTML = time().hours;
  minuteform.innerHTML = time().minutes;
  ampmform.innerHTML = time().ampm;
  secform.innerHTML = time().sec;
}

function date() {
  const dateform = document.getElementById("date");
  const month = time().month;
  const day = time().day;
  const yoil = time().yoil;
  dateform.innerHTML = `${month}월 ${day}일 ${yoil}요일`;
}

function init() {
  clock();
  setInterval(clock, 1000);
  date();
  setInterval(date, 1000);
}

export { init as clock_init };
