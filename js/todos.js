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

function save(n, text) {
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
  chrome.storage.sync.get({ todolist: new Array() }, (result) => {
    let array = result["todolist"];
    array.push(data);
    chrome.storage.sync.set({ todolist: array });
  });
  chrome.storage.sync.get({ numberOfTodo: 0 }, (result) => {
    let number = result["numberOfTodo"];
    number++;
    chrome.storage.sync.set({ numberOfTodo: number });
  });

  load(n);
}

function clear(n) {
  const todolistN = "todolist" + n;
  const todostateN = "todostate" + n;
  const tododateN = "tododate" + n;

  // delBtn = n=> null
  if (n) {
    console.log(n);
  }
}

function remove(n) {
  console.log("worked" + n);
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

async function load() {
  const empty = document.getElementById("listContentEmpty");
  const wrapper = document.getElementById("todolistWrapper");

  // const nnnn = await asdf2();
  let numberOfTodo = todolistNumber();
  const todo = await loadTodo();
  console.log(todo, numberOfTodo, todo["todolist"].length);
  if (numberOfTodo === 0) {
    empty.style.display = "flex";
    wrapper.style.display = "none";
  } else {
    for (let i = 1; i < numberOfTodo + 1; i++) {
      const todolist = document.getElementById(`list${i}`);
      const contentform = document.getElementById(`listC${i}`);

      // switch (state) {
      //   case "saved":
      //     todolist.setAttribute("state", "saved");
      //     contentform.classList.add("content-on");
      //     contentform.classList.remove("content-clear");
      //     contentform.setAttribute(
      //       "title",
      //       `저장한 시간 : ${datePrettify(date)}`
      //     );
      //     contentform.innerHTML = content;
      //     todolist.classList.remove("clear");
      //     break;
      //   case "default":
      //     todolist.setAttribute("state", "default");
      //     contentform.classList.remove("content-on");
      //     contentform.classList.remove("content-clear");
      //     todolist.classList.remove("clear");
      //     contentform.innerHTML = content;
      //     break;
      //   case "clear":
      //     todolist.setAttribute("state", "clear");
      //     contentform.classList.add("content-clear");
      //     contentform.innerHTML = content;
      //     todolist.classList.add("clear");
      //     btns.style.display = "none";
      // }
    }
  }
}

function loadTodo() {
  return new Promise((resolve) => {
    chrome.storage.sync.get({ todolist: new Array() }, (r) => {
      resolve(r);
    });
  });
}

function todolistNumber() {
  return new Promise((resolve) => {
    chrome.storage.sync.get({ numberOfTodo: 0 }, (r) => {
      const rr = r["numberOfTodo"];
      resolve(rr);
    });
  });
}
function asdf2() {
  return new Promise((resolve) => {
    chrome.storage.sync.get({ todolist: new Array() }, (r) => {
      const rr = r["todolist"].length;
      resolve(rr);
    });
  });
}

async function HTMLmake() {
  const n = await todolistNumber();
  const parent = document.getElementById("todolistWrapper");
  let html = "";
  let i = 1;
  while (i < n + 1) {
    html =
      html +
      `<div class="todolist" id="list${i}" state="default" n="${i}">
    <div
      class="todolistContents"
      id="listC${i}"
      n="${i}"
      style="display: flex"
    ></div>
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

async function list_init() {
  HTMLmake();
}

async function input_init() {
  const textarea = document.getElementById("todoInput");
  textarea.addEventListener("input", input);
  const inputBtn = document.getElementById("todoInputBtn");
  inputBtn.addEventListener("click", inputBtnClick);
  input();
}

// TEST REMOVEALL
async function TEST_REMOVE_ALL() {
  const n = await todolistNumber();
  let i = 1;
  while (i < n + 1) {
    const todolistN = "todolist" + i;
    const todostateN = "todostate" + i;
    const tododateN = "tododate" + i;

    chrome.storage.sync.remove([todolistN, todostateN, tododateN]);

    i++;
  }

  chrome.storage.sync.remove("numberOfTodo");
  chrome.storage.sync.remove("todolist");
}

async function init() {
  list_init();
  load();
  input_init();

  // TEST_REMOVE_ALL();
  const todolistBtn = document.getElementById("todolistBtn");
  todolistBtn.addEventListener("click", todolistOnOff);
  const number = await todolistNumber();
  for (let i = 1; i < number + 1; i++) {
    const todolist = document.getElementById(`list${i}`);
    const delBtn = document.getElementById(`listDel${i}`);
    todolist.addEventListener("click", (event) => {
      const n = event.target.getAttribute("n");
      clear(n);
    });
    delBtn.addEventListener("click", (event) => {
      const n = event.target.getAttribute("n");
      remove(n);
    });
    const todolistContent = document.getElementById(`listC${i}`);
  }
}

export { init as todo_init, todolistOnOff };

// function init() {

// const todolistClearBtn = document.getElementById(`listCL${i}`);
// const todolistDelBtn = document.getElementById(`listDel${i}`);
// const todolistClearBtn_IMG = document.getElementById(`listCL_img${i}`);
// const todolistDelBtn_IMG = document.getElementById(`listDel_img${i}`);
// todolistContent.addEventListener("click", todoModifyStart);
// todolistClearBtn.addEventListener("click", todoClear);
// todolistClearBtn_IMG.addEventListener("click", todoClear);
// todolistDelBtn.addEventListener("click", todoRemove);
// todolistDelBtn_IMG.addEventListener("click", todoRemove);
// todolist.addEventListener("mouseenter", todolisthover);
// todolist.addEventListener("mouseleave", todolistmouseleave);
// }

// function todoModifyStart(event) {
//   const n = event.target.getAttribute("n");
//   const todolist = document.getElementById(`list${n}`);
//   const dateform = document.getElementById(`listD${n}`);
//   const contentform = document.getElementById(`listC${n}`);
//   const modifyform = document.getElementById(`listM${n}`);
//   const stateform = document.getElementById(`listS${n}`);
//   const state = todolist.getAttribute("state");
//   stateform.classList.remove("on");
//   stateform.classList.remove("off");
//   stateform.classList.remove("blink");
//   if (state === "default") {
//     todolist.setAttribute("state", "modifying");
//     dateform.style.opacity = "0";
//     contentform.style.display = "none";
//     modifyform.style.display = "flex";
//     modifyform.select();
//   }
//   if (state === "saved") {
//     todolist.setAttribute("state", "modifying");
//     dateform.style.opacity = "0";
//     contentform.style.display = "none";
//     modifyform.style.display = "flex";
//     modifyform.value = contentform.innerText;
//     modifyform.select();
//     stateform.innerText = "수정중..";
//     stateform.classList.add("on");
//   }
// }

// function todoModify(event) {
//   const textarea = event.target;
//   const n = textarea.getAttribute("n");
//   const dateform = document.getElementById(`listD${n}`);
//   const contentform = document.getElementById(`listC${n}`);
//   if (textarea.value === "") {
//     if (event.key === "Enter") {
//       event.preventDefault();
//       textarea.placeholder = "내용을 입력하세요.";
//       return;
//     }
//   }
//   if (event.key === "Escape") {
//     textarea.placeholder = "최대 40자까지 입력할 수 있습니다.";
//     textarea.style.display = "none";
//     contentform.style.display = "flex";
//     dateform.style.opacity = "1";
//     return;
//   }
//   if (event.key === "Enter") {
//     todolistSave(n);
//     textarea.placeholder = "최대 40자까지 입력할 수 있습니다.";
//     dateform.style.opacity = "1";
//   }
//   if (event.key === "<" || event.key === ">") {
//     alert("특정문자(<, >)는 입력할 수 없습니다.");
//     event.preventDefault();
//   }
// }

// function todoClear(event) {
//   const n = event.target.getAttribute("n");
//   const todolist = document.getElementById(`list${n}`);
//   const state = todolist.getAttribute("state");
//   const todostateN = "todostate" + n;
//   const tododateN = "tododate" + n;
//   if (state === "clear") {
//     chrome.storage.sync.set({ [todostateN]: "saved" });
//     load(n);
//   } else {
//     chrome.storage.sync.set({ [todostateN]: "clear" });
//     load(n);
//   }
//   const btns = document.getElementById(`listBtns${n}`);
//   const todolistInfo = document.getElementById(`listINFO${n}`);
//   btns.classList.remove("mouseon");
//   btns.classList.remove("mouseleave");
//   todolistInfo.classList.remove("mouseon");
//   todolistInfo.classList.remove("mouseleave");
// }

// function todoRemove(event) {
//   const n = event.target.getAttribute("n");
//   const todolistN = "todolist" + n;
//   const todostateN = "todostate" + n;
//   const tododateN = "tododate" + n;

//   chrome.storage.sync.remove([todolistN, todostateN, tododateN]);
//   load(n);
// }

// let menu_btn_timer;
// function todolisthover(event) {
//   const n = event.target.getAttribute("n");
//   const btns = document.getElementById(`listBtns${n}`);
//   const todolistInfo = document.getElementById(`listINFO${n}`);
//   const todolist = document.getElementById(`list${n}`);
//   const state = todolist.getAttribute("state");
//   if (state === "saved") {
//     btns.style.display = "flex";
//     btns.classList.add("mouseon");
//     btns.classList.remove("mouseleave");
//     todolistInfo.classList.add("mouseon");
//     todolistInfo.classList.remove("mouseleave");
//   } else if (state === "clear") {
//     menu_btn_timer = setTimeout(() => {
//       btns.style.display = "flex";
//       btns.classList.add("mouseon");
//       btns.classList.remove("mouseleave");
//       todolistInfo.classList.add("mouseon");
//       todolistInfo.classList.remove("mouseleave");
//     }, 1000);
//   }
// }

// function todolistmouseleave(event) {
//   const n = event.target.getAttribute("n");
//   const btns = document.getElementById(`listBtns${n}`);
//   const todolistInfo = document.getElementById(`listINFO${n}`);
//   const todolist = document.getElementById(`list${n}`);
//   const state = todolist.getAttribute("state");
//   if (todolistInfo.classList.contains("mouseon")) {
//     if (state === "saved") {
//       btns.style.display = "none";
//       btns.classList.add("mouseleave");
//       btns.classList.remove("mouseon");
//       todolistInfo.classList.add("mouseleave");
//       todolistInfo.classList.remove("mouseon");
//     } else if (state === "clear") {
//       btns.style.display = "none";
//       btns.classList.add("mouseleave");
//       btns.classList.remove("mouseon");
//       todolistInfo.classList.add("mouseleave");
//       todolistInfo.classList.remove("mouseon");
//     }
//   }
//   clearTimeout(menu_btn_timer);
// }
