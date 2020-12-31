function todolistOnOff(event) {
  const wrapper = document.getElementById("list_wrapper");
  const input = document.getElementById("todoInput");
  if (!event.path.includes(wrapper)) {
    wrapper.classList.toggle("fade_in");
    wrapper.classList.toggle("todolist-showing");
    input.select();
  }
}

function todolistSaveDate() {
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  let yoil = date.getDay();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const milisec = date.getMilliseconds();
  const ampm = `${hours >= 12 ? "PM" : "AM"}`;
  hours = `${hours > 12 ? hours - 12 : hours}`;
  hours = `${hours == 0 ? 12 : hours}`;
  return {
    month: month,
    day: day,
    yoil: yoil,
    hours: hours,
    minutes: minutes,
    ampm: ampm,
    milisec: milisec,
  };
}

function datePrettify(date) {
  const yoilKR = {
    0: "일",
    1: "월",
    2: "화",
    3: "수",
    4: "목",
    5: "금",
    6: "토",
  };
  return `${date["month"]}/${date["day"]}(${yoilKR[date["yoil"]]}) ${
    date["ampm"]
  } ${date["hours"]} : ${
    date["minutes"] < 10 ? "0" + date["minutes"] : date["minutes"]
  }`;
}

function todoID() {
  const d = todolistSaveDate();
  const id = `${d["month"]}${d["day"]}${d["hours"]}${d["minutes"]}${d["milisec"]}`;
  return id;
}

async function save(n, text) {
  const todo = await loadTodo();

  const newDate = todolistSaveDate();
  const newID = todoID();

  if (text.includes("<") || text.includes(">")) {
    alert("특정문자(<, >)는 저장할 수 없습니다.");
    event.preventDefault();
    return;
  }

  const data = {
    id: newID,
    content: text,
    date: newDate,
    state: "saved",
  };

  chrome.storage.sync.get({ todolist: new Array() }, (r) => {
    let todo = r["todolist"];
    todo.push(data);
    chrome.storage.sync.set({ todolist: todo });
    init();
  });
}

function clear(n) {
  if (n) {
    console.log(n);
  }
}

function remove(n) {
  chrome.storage.sync.get("todolist", (r) => {
    let todo = r["todolist"];
    todo.splice(n, 1);
    chrome.storage.sync.set({ todolist: todo });
    init();
  });
}

function input() {
  const textarea = document.getElementById("todoInput");
  const btn = document.getElementById("todoInputBtn");
  textarea.addEventListener("keypress", preventEnter);
  if (textarea.value !== "") {
    btn.style.color = "black";
  } else {
    btn.style.color = "rgba(0,0,0,0.2)";
  }
}

function preventEnter(event) {
  if (!event.target.value) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  } else {
    if (event.key === "Enter") {
      const text = event.target.value;
      pressEnter(event, text);
    }
  }
}

function pressEnter(event, text) {
  event.preventDefault();
  for (var i = 1; i < 900; i++) {
    const check_list = document.getElementById(`listC${i}`);
    if (!check_list) {
      const input = document.getElementById("todoInput");
      const btn = document.getElementById("todoInputBtn");
      // HTMLmake();
      save(i, text);
      input.value = "";
      btn.style.color = "rgba(0,0,0,0.2)";
      return;
    }
  }
}

function inputBtnClick() {
  const input = document.getElementById("todoInput");
  const text = input.value;
  if (!text) {
    alert("1자 이상 입력하세요.");
    input.select();
  } else {
    pressEnter(event, text);
  }
}

function loadTodo() {
  return new Promise((resolve) => {
    chrome.storage.sync.get({ todolist: new Array() }, (r) => {
      resolve(r["todolist"]);
    });
  });
}

function HTMLmake(todo) {
  const empty = document.getElementById("listContentEmpty");
  const parent = document.getElementById("todolistWrapper");
  const n = todo.length;

  if (n === 0) {
    empty.style.display = "flex";
    parent.style.display = "none";
  } else {
    empty.style.display = "none";
    parent.style.display = "flex";
    let html = "";
    let i = 1;
    while (i < n + 1) {
      html =
        html +
        `<div class="todolist" id="list${i}" state="default" n="${i}">
      <div
        class="todolistContents content-on"
        id="listC${i}"
        n="${i}"
        style="display: flex"
      >${todo[i - 1].content}</div>
      <div class="todolistDelBtn" id="listDel${i}" n="${i}">
        <img
          class="todolistDelIMG"
          src="./icons/etc/listDel.png"
          alt="X"
          n="${i}"
        />
      </div>
    </div>`;
      i++;
    }
    parent.innerHTML = html;
  }
}

async function input_init() {
  const textarea = document.getElementById("todoInput");
  textarea.addEventListener("input", input);
  const inputBtn = document.getElementById("todoInputBtn");
  inputBtn.addEventListener("click", inputBtnClick);
  input();
}

async function init() {
  let todo = await loadTodo();

  HTMLmake(todo);
  input_init();

  const todolistBtn = document.getElementById("todolistBtn");
  todolistBtn.addEventListener("click", todolistOnOff);
  const number = todo.length;
  for (let i = 1; i < number + 1; i++) {
    const todolist = document.getElementById(`list${i}`);
    const delBtn = document.getElementById(`listDel${i}`);
    todolist.addEventListener("click", (event) => {
      const n = event.target.getAttribute("n");
      clear(n);
    });
    delBtn.addEventListener("click", (event) => {
      const n = event.target.getAttribute("n");
      remove(n - 1);
    });
    const todolistContent = document.getElementById(`listC${i}`);
  }
}

export { init as todo_init, todolistOnOff };
