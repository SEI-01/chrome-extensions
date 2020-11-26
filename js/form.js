import { icons_show_init } from "./icons.js";
// import { default_init } from "./default.js";

function link_modify_on(event) {
  event.preventDefault();
  const container = document.getElementById("link_modify_container");
  const number = event.target.getAttribute("n");
  const link_input = document.getElementById("link_input");
  const name_input = document.getElementById("name_input");
  const link_input_btn = document.getElementById("link_input_btn");
  const name_input_btn = document.getElementById("name_input_btn");
  link_input.setAttribute("n", number);
  link_input_btn.setAttribute("n", number);
  name_input.setAttribute("n", number);
  name_input_btn.setAttribute("n", number);
  container.classList.toggle("fade_in");
  inputText(number);
  nameText(number);
}

function link_modify_exit() {
  const container = document.getElementById("link_modify_container");
  const info = document.getElementById("link_modify_info");
  container.classList.toggle("fade_in");
  info.innerText = "";
}

function inputText(number) {
  const input = document.getElementById("link_input");
  const NT_URL_N = "New Tab url" + number;
  chrome.storage.sync.get([NT_URL_N], (result) => {
    input.value = result[NT_URL_N];
    input.select();
  });
}

function nameText(number) {
  const name = document.getElementById("name_input");
  const NT_TITLE_N = "New Tab title" + number;
  chrome.storage.sync.get([NT_TITLE_N], (result) => {
    name.value = result[NT_TITLE_N];
  });
}

function errorLink() {
  const input = document.getElementById("link_input");
  const info = document.getElementById("link_modify_info");
  info.innerText = "URL이 유효하지 않습니다.";
  input.select();
}

function saveLink() {
  const input = document.getElementById("link_input");
  const info = document.getElementById("link_modify_info");
  const number = input.getAttribute("n");
  let url = input.value;
  const NT_URL_N = "New Tab url" + number;
  const NT_TITLE_N = "New Tab title" + number;
  info.innerText = "URL 유효성 검사중";

  if (url === "") {
    errorLink();
  } else {
    if (!url.includes("http://") && !url.includes("https://")) {
      url = "https://" + url;
    }
    fetch(url)
      .then((res) => {
        res.text().then((text) => {
          if (text.includes("<title>")) {
            const titleText = text.split("<title>")[1].split("</title>")[0];
            chrome.storage.sync.set({
              [NT_URL_N]: url,
              [NT_TITLE_N]: titleText,
            });
            info.innerText = "completed";
            link_modify_exit();
            icons_show_init();
            info.innerText = "";
          } else {
            errorLink();
          }
        });
      })
      .catch(() => {
        errorLink();
      });
  }
}

function saveName() {
  const name = document.getElementById("name_input");
  const info = document.getElementById("link_modify_info");
  const number = name.getAttribute("n");
  let text = name.value;
  const NT_TITLE_N = "New Tab title" + number;
  if (text === "") {
    info.innerText = "1자 이상 입력하세요.";
  } else {
    chrome.storage.sync.set({ [NT_TITLE_N]: text });
    link_modify_exit();
    icons_show_init();
    info.innerText = "";
  }
}

function init() {
  const modify_container = document.getElementById("link_modify_container");
  modify_container.addEventListener("click", (event) => {
    if (event.target === modify_container) {
      link_modify_exit();
    }
  });
  const input_btn = document.getElementById("link_input_btn");
  const name_btn = document.getElementById("name_input_btn");
  const input = document.getElementById("link_input");
  const name = document.getElementById("name_input");
  input_btn.addEventListener("click", saveLink);
  name_btn.addEventListener("click", saveName);
  input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      saveLink();
    }
  });
  name.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      saveName();
    }
  });
}

export { init as link_modify_init, link_modify_on, link_modify_exit };
