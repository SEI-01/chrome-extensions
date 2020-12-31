import { default_init } from "./default.js";

const CONTAINER = document.getElementById("link_modify_container");
const LINK_INPUT = document.getElementById("link_input");
const NAME_INPUT = document.getElementById("name_input");
const INFO = document.getElementById("link_modify_info");

function link_modify_on(event) {
  event.preventDefault();
  const number = event.target.getAttribute("n");
  const link_input_btn = document.getElementById("link_input_btn");
  const name_input_btn = document.getElementById("name_input_btn");
  LINK_INPUT.setAttribute("n", number);
  link_input_btn.setAttribute("n", number);
  NAME_INPUT.setAttribute("n", number);
  name_input_btn.setAttribute("n", number);
  CONTAINER.classList.toggle("fade_in");
  inputText(number);
  nameText(number);
}

function link_modify_exit() {
  CONTAINER.classList.toggle("fade_in");
  INFO.innerText = "";
}

async function inputText(number) {
  let links = await loadLinks();
  if (links[number - 1] === undefined) {
    LINK_INPUT.value = "";
  } else {
    LINK_INPUT.value = links[number - 1].url;
  }
  LINK_INPUT.select();
}

async function nameText(number) {
  let links = await loadLinks();
  if (links[number - 1] === undefined) {
    NAME_INPUT.value = "";
  } else {
    NAME_INPUT.value = links[number - 1].title;
  }
}

function errorLink() {
  const input = document.getElementById("link_input");
  const info = document.getElementById("link_modify_info");
  info.innerText = "URL이 유효하지 않습니다.";
  input.select();
  saveLinkStart = 0;
}

let saveLinkStart = 0;
function saveLink() {
  if (saveLinkStart === 0) {
    saveLinkStart = 1;

    const number = LINK_INPUT.getAttribute("n");
    let url = LINK_INPUT.value;
    INFO.innerText = "URL 유효성 검사중";

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
              const data = {
                url: url,
                title: titleText,
              };
              chrome.storage.sync.get({ links: new Array() }, (r) => {
                let links_data = r["links"];
                links_data.splice(number - 1, 1, data);
                chrome.storage.sync.set({ links: links_data });
                init();
              });
              INFO.innerText = "completed";
              INFO.innerText = "";
              icons_init();
              link_modify_exit();
              saveLinkStart = 0;
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
}

let saveNameStart = 0;
function saveName() {
  if (saveNameStart === 0) {
    saveNameStart = 1;
    const number = LINK_INPUT.getAttribute("n");
    let url = LINK_INPUT.value;
    let text = NAME_INPUT.value;
    if (text.length === 0) {
      INFO.innerText = "1자 이상 입력하세요.";
      saveNameStart = 0;
    } else {
      const data = {
        url: url,
        title: text,
      };
      chrome.storage.sync.get({ links: new Array() }, (r) => {
        let links_data = r["links"];
        links_data.splice(number - 1, 1, data);
        chrome.storage.sync.set({ links: links_data });
      });
      INFO.innerText = "";
      icons_init();
      link_modify_exit();
      saveNameStart = 0;
    }
  }
}

function delLink() {
  const number = LINK_INPUT.getAttribute("n");
  chrome.storage.sync.get("links", (r) => {
    let links_data = r["links"];
    links_data.splice(number - 1, 1);
    chrome.storage.sync.set({ links: links_data });
    init();
  });
  INFO.innerText = "";
  icons_init();
  link_modify_exit();
}

function loadLinks() {
  return new Promise((resolve) => {
    chrome.storage.sync.get({ links: new Array() }, (r) => {
      resolve(r["links"]);
    });
  });
}

function form_init() {
  const modify_container = document.getElementById("link_modify_container");
  modify_container.addEventListener("click", (event) => {
    if (event.target === modify_container) {
      link_modify_exit();
    }
  });
  const input_btn = document.getElementById("link_input_btn");
  const name_btn = document.getElementById("name_input_btn");
  const del_btn = document.getElementById("link_del_btn");
  const input = document.getElementById("link_input");
  const name = document.getElementById("name_input");
  input_btn.addEventListener("click", saveLink);
  name_btn.addEventListener("click", saveName);
  del_btn.addEventListener("click", delLink);
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

///////////////// ICONS///////////////// ICONS///////////////// ICONS///////////////// ICONS///////////////// ICONS///////////////// ICONS///////////////// ICONS///////////////// ICONS///////////////// ICONS///////////////// ICONS///////////////// ICONS///////////////// ICONS///////////////// ICONS
async function gotolink(event) {
  const number = event.target.getAttribute("n");
  if (event.target.className === "link_option_IMG noselect") {
  } else {
    let links = await loadLinks();
    const url = links[number - 1].url;
    location.href = url;
  }
}

async function loadFavicon(number) {
  const favicon = document.getElementById(`favicon${number}`);

  let links = await loadLinks();
  const url = links[number - 1].url;
  let favicon_path = `https://www.google.com/s2/favicons?sz=64&domain_url=${url}`;
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.send();
  xhr.onerror = () => {
    console.log(`${number}번째 URL에 연결할 수 없습니다.`);
    favicon_path = "icons/etc/favicon.png";
    favicon.setAttribute("src", favicon_path);
  };
  favicon.setAttribute("src", favicon_path);
}

async function loadTitle(number) {
  let links = await loadLinks();

  const titleText = document.getElementById(`title${number}`);
  console.log(titleText);
  titleText.innerText = links[number - 1].title;
}

let link_option_timer;

function link_option_view(event) {
  const number = event.target.getAttribute("n");
  const img = document.getElementById(`LOIMG${number}`);
  link_option_timer = setTimeout(() => {
    img.style.display = "block";
  }, 500);
}

function link_option_not_view(event) {
  const number = event.target.getAttribute("n");
  const img = document.getElementById(`LOIMG${number}`);
  clearTimeout(link_option_timer);
  img.style.display = "none";
}

function makeHTML(n) {
  const parent = document.getElementById("icons_box");
  let html = "";
  let i = 1;
  while (i < n + 1) {
    html =
      html +
      `<div class="icon_wrapper" id="icon_wrapper${i}" n="${i}">
    <div class="link_option" id="link_option${i}" n="${i}">
      <img
        class="link_option_IMG noselect"
        id="LOIMG${i}"
        src="icons/etc/op.png"
        style="display: none"
        n="${i}"
      />
    </div>
    <div class="icon" n="${i}">
      <img
        class="favicon noselect"
        id="favicon${i}"
        src="icons/etc/favicon.png"
        n="${i}"
      />
    </div>
    <div class="icon_title noselect" id="title${i}" n="${i}"></div>
    </div>`;
    i++;
  }
  if (i < 11) {
    html =
      html +
      `<div class="icon_wrapper" id="icon_add_wrapper" n="${i}">
  <div class="link_option" id="link_option" n="${i}"></div>
  <div class="icon" n="${i}">
    <img class="favicon noselect" src="icons/etc/link_plus.png" n="${i}" />
  </div>
  <div class="icon_title noselect" id="title" n="${i}">링크 추가</div>
</div>`;
  }

  parent.innerHTML = html;
}

function DELETE_ALL() {
  chrome.storage.sync.remove("links");
}

async function icons_init() {
  // DELETE_ALL();
  let links = await loadLinks();
  const icons = links.length;
  // const icons = 3;
  console.log(icons);
  console.log(links);
  makeHTML(icons);

  for (let i = 1; i < icons + 1; i++) {
    const wrapper = document.getElementById(`icon_wrapper${i}`);
    const OPTION = document.getElementById(`LOIMG${i}`);
    const favicon = document.getElementById(`favicon${i}`);
    wrapper.addEventListener("click", gotolink);
    wrapper.addEventListener("contextmenu", link_modify_on);
    wrapper.addEventListener("mouseenter", link_option_view);
    wrapper.addEventListener("mouseleave", link_option_not_view);
    OPTION.addEventListener("click", link_modify_on);
    favicon.onload = loadFavicon(i);
    loadTitle(i);
  }

  const link_add_btn = document.getElementById("icon_add_wrapper");
  if (link_add_btn) {
    link_add_btn.addEventListener("click", link_modify_on);
  }
}

function init() {
  form_init();
  icons_init();
}

export { init as link_init, icons_init };
