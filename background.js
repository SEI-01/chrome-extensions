const muteBtn = document.getElementById("mute");
const jsBtn = document.getElementById("js_toggle");
const optionsBtn = document.getElementById("option_tab_btn");
const pageBtn = document.getElementById("page_tab_btn");
const tabsBtn = document.getElementById("tabs_tab_btn");
const tabAddBtn = document.getElementById("page-add");
const tabRemoveBtn = document.getElementById("page-remove");
const tabsAddBtn = document.getElementById("tabs-add");
const tabsRemoveBtn = document.getElementById("tabs-remove");

////////////////////////// about mute functions
function mute() {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tab) {
    let current_state = tab[0].mutedInfo.muted;
    let should_mute = !current_state;
    chrome.tabs.update(tab[0].id, { muted: should_mute });
    updateUIState(should_mute);
  });
}

function updateUIState(should_mute) {
  let title = "MUTE TAB";
  if (should_mute) {
    title = "UNMUTE";
    muteBtn.innerText = title;
  } else {
    muteBtn.innerText = title;
  }
}

function muteBtnText() {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tab) {
    let current_state = tab[0].mutedInfo.muted;
    updateUIState(current_state);
  });
}
///////////////////////// about js functions
function jstoggle() {
  chrome.contentSettings.javascript.clear({}, () => {
    chrome.contentSettings.javascript.set({
      primaryPattern: "<all_urls>",
      setting: block,
    });
  });
}

////////////////////// about nav functions

///// Tab contents !NOT Btn!
const optionTab = document.getElementById("option_tab");
const pageTab = document.getElementById("page_tab");
const tabsTab = document.getElementById("tabs_tab");

function fixTab(event) {
  const BG = document.getElementById("contextMenuBG");
  console.log(event.target);
  const tab = event.target.innerText;
  console.log(tab);
  event.preventDefault();
  const x = event.x;
  const y = event.y;
  const contextMenu = document.createElement("button");
  contextMenu.innerHTML = "고정";
  contextMenu.className = "contextMenu";
  contextMenu.id = "contextMenu";
  contextMenu.style.position = "absolute";
  contextMenu.style.left = x + "px";
  contextMenu.style.top = y - 30 + "px";
  BG.appendChild(contextMenu);
  const CM = document.getElementById("contextMenu");
  CM.addEventListener("click", () => {
    chrome.storage.sync.set({ firstTab: tab });
    BG.removeChild(CM);
    BG.style.display = "none";
  });
  BG.style.display = "flex";
  BG.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    BG.removeChild(CM);
    BG.style.display = "none";
  });
  BG.addEventListener("click", (event) => {
    if (event.target === BG) {
      BG.removeChild(CM);
      BG.style.display = "none";
    }
  });
}

function tabBtnFocusOn(btn) {
  btn.style.backgroundColor = "white";
  btn.style.color = "black";
}

function tabBtnFocusOut(btn) {
  btn.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
  btn.style.color = "rgba(0, 0, 0, 0.5)";
}

function first_Tab_Show() {
  chrome.storage.sync.get("firstTab", (result) => {
    const txt = result["firstTab"];
    switch (txt) {
      case "OPTIONS":
        goOptionsTab();
        break;
      case "PAGE":
        goPageTab();
        break;
      case "TABS":
        goTabsTab();
        break;
    }
  });
}

function goOptionsTab() {
  optionTab.style.display = "flex";
  pageTab.style.display = "none";
  tabsTab.style.display = "none";
  tabBtnFocusOn(optionsBtn);
  tabBtnFocusOut(pageBtn);
  tabBtnFocusOut(tabsBtn);
  chrome.storage.sync.set({ firstTab: "OPTIONS" });
}

function goPageTab() {
  optionTab.style.display = "none";
  pageTab.style.display = "flex";
  tabsTab.style.display = "none";
  tabBtnFocusOn(pageBtn);
  tabBtnFocusOut(optionsBtn);
  tabBtnFocusOut(tabsBtn);
  chrome.storage.sync.set({ firstTab: "PAGE" });
}

function goTabsTab() {
  optionTab.style.display = "none";
  pageTab.style.display = "none";
  tabsTab.style.display = "flex";
  tabBtnFocusOn(tabsBtn);
  tabBtnFocusOut(optionsBtn);
  tabBtnFocusOut(pageBtn);
  chrome.storage.sync.set({ firstTab: "TABS" });
}

/////////////////// about page tab functions
function page(event) {
  const number = event.target.getAttribute("n");
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tab) {
    const myUrl = tab[0].url,
      title = tab[0].title,
      urlNumber = "url" + number,
      titleNumber = "title" + number;
    chrome.storage.sync.get([urlNumber, titleNumber], function (result) {
      if (result[urlNumber] === undefined) {
        chrome.storage.sync.set({ [urlNumber]: myUrl, [titleNumber]: title });
        pageBtnText(number);
        editDelBtnOn(number);
      } else {
        chrome.storage.sync.get([urlNumber], function (result) {
          chrome.tabs.create({ url: result[urlNumber] });
        });
      }
    });
  });
}

function pageEdit(event) {
  const number = event.target.getAttribute("n");
  const pageN = document.getElementById(`page${number}`);
  const pageNEditForm = document.getElementById(`page${number}EditForm`);
  const pageNEditBtn = document.getElementById(`page${number}Edit`);
  const pageNDelBtn = document.getElementById(`page${number}Del`);
  const title = "title" + number;
  chrome.storage.sync.get([title], (result) => {
    if (result[title] !== undefined) {
      if (pageNEditBtn.getAttribute("edit") === "off") {
        pageN.style.display = "none";
        pageNDelBtn.style.display = "none";
        pageNEditForm.value = pageN.innerText;
        pageNEditForm.style.display = "inline-block";
        pageNEditForm.select();
        pageNEditBtn.style.display = "inline-block";
        pageNEditBtn.innerText = "✔";
        pageNEditBtn.style.width = "34px";
        pageNEditBtn.setAttribute("edit", "on");
      } else {
        const text = pageNEditForm.value;
        if (text.length === 0) {
          pageNEditForm.style.border = "1.5px solid red";
          pageNEditForm.classList.add("placeholderRed");
          pageNEditForm.select();
        } else {
          chrome.storage.sync.set({ [title]: text });
          pageBtnText(number);
          pageNEditBtn.setAttribute("edit", "off");
          pageN.style.display = "inline-block";
          pageNDelBtn.style.display = "inline-block";
          pageNEditBtn.style.display = "none";
          pageNEditForm.style.display = "none";
          pageNEditForm.style.border = "1px solid black";
          pageNEditForm.classList.remove("placeholderRed");
        }
      }
    }
  });
}

function pageDel(event) {
  const number = event.target.getAttribute("n");
  const pageN = document.getElementById(`page${number}`);
  const pageNEditBtn = document.getElementById(`page${number}Edit`);
  const pageNDelBtn = document.getElementById(`page${number}Del`);
  const url = "url" + number;
  const title = "title" + number;
  if (pageNDelBtn.getAttribute("del") === "off") {
    pageNEditBtn.style.display = "none";
    pageNDelBtn.innerText = "✔";
    pageN.innerText = "정말로 삭제할까요?";
    pageN.style.color = "red";
    pageN.style.cursor = "unset";
    pageN.disabled = true;
    pageNDelBtn.setAttribute("del", "on");
  } else {
    chrome.storage.sync.remove([url, title]);
    pageNDelBtn.setAttribute("del", "off");
    pageNDelBtn.innerText = "X";
    pageN.style.color = "black";
    pageN.style.cursor = "pointer";
    pageN.disabled = false;
    pageBtnText(number);
    editDelBtnOn(number);
  }
}

function pageBtnText(number) {
  const url = "url" + number;
  const title = "title" + number;
  const pageNBtn = document.getElementById(`page${number}`);
  chrome.storage.sync.get([url], function (result) {
    if (result[url] === undefined) {
      pageNBtn.innerText = `PAGE ${number}`;
    } else {
      chrome.storage.sync.get([url, title], function (result) {
        const str = result[title];
        const realTitle = str.substring(0, 20);
        const realUrl = result[url];
        pageNBtn.innerText = realTitle;
        pageNBtn.setAttribute("title", realUrl);
      });
    }
  });
}

function editDelBtnOn(number) {
  const url = "url" + number;
  const editBtn = document.getElementById(`page${number}Edit`);
  const delBtn = document.getElementById(`page${number}Del`);
  const orderBtn = document.getElementById(`page${number}orderBtn`);
  chrome.storage.sync.get([url], function (result) {
    if (result[url] === undefined) {
      editBtn.style.display = "none";
      delBtn.style.display = "none";
      orderBtn.style.display = "none";
    } else {
      delBtn.style.display = "inline-block";
      orderBtn.style.display = "inline-block";
    }
  });
}

async function pageAdd() {
  const number = await pageBtnNumber();
  if (number !== 10) {
    const n = number + 1;
    chrome.storage.sync.set({ numberOfPage: n });
    init();
  }
}

async function pageRemove() {
  const number = await pageBtnNumber();
  if (number > 4) {
    const n = number - 1;
    chrome.storage.sync.set({ numberOfPage: n });
    init();
  }
}

function pageShow(n) {
  const parent = document.getElementById("page_tab_list");
  let html = "";
  i = 1;
  while (i < n + 1) {
    html =
      html +
      `<div class="pageBox" id="page${i}Box"><div class="pageorderBtn" id="page${i}orderBtn" n="${i}" moving="off"></div> <button class="pageBtn" id="page${i}" n="${i}">PAGE ${i}</button><input type="text" name="EditForm" id="page${i}EditForm" class="editForm" n="${i}" placeholder="제목을 입력하세요 (20자 이내)" spellcheck="false" maxlength="20" style="display: none"/> <button class="editBtn" id="page${i}Edit" title="확인" n="${i}" edit="off" style="display: none">✔</button> <button class="delBtn" id="page${i}Del" n="${i}" title="삭제" del="off" style="display: none">X</button></div>`;
    i++;
  }
  parent.innerHTML = html;
}

function pageMove(event, firstN) {
  console.log("moved!");
  const secondN = event.target.getAttribute("n");
  console.log(firstN, secondN);

  const firsturl = "url" + firstN;
  const firsttitle = "title" + firstN;
  const secondurl = "url" + secondN;
  const secondtitle = "title" + secondN;
  const tempurl = "tempurl";
  const temptitle = " temptitle";

  chrome.storage.sync.get([firsturl, firsttitle], (r1) => {
    chrome.storage.sync.set({
      [tempurl]: r1[firsturl],
      [temptitle]: r1[firsttitle],
    });
    chrome.storage.sync.get([secondurl, secondtitle], (r2) => {
      chrome.storage.sync.set({
        [firsturl]: r2[secondurl],
        [firsttitle]: r2[secondtitle],
      });
      chrome.storage.sync.get([tempurl, temptitle], (r3) => {
        chrome.storage.sync.set({
          [secondurl]: r3[tempurl],
          [secondtitle]: r3[temptitle],
        });
        chrome.storage.sync.remove([tempurl, temptitle]);
        init();
      });
    });
  });

  orderBtnClicked = 0;
}

let orderBtnClicked = 0;
let orderBtnFirstN;
function pageMoveOn(event) {
  const moving = event.target.getAttribute("moving");
  const firstTarget = event.target;
  if (moving === "off") {
    if (orderBtnClicked === 1) {
      firstTarget.style.borderColor = "rgba(0, 0, 0, 0.2)";
      pageMove(event, orderBtnFirstN);
    } else {
      event.target.style.borderColor = "blue";
      event.target.setAttribute("moving", "on");
      orderBtnClicked++;
      orderBtnFirstN = event.target.getAttribute("n");
    }
  } else {
    event.target.style.borderColor = "rgba(0, 0, 0, 0.2)";
    event.target.setAttribute("moving", "off");
    orderBtnClicked = 0;
  }
}

// let pageMouse;

// function pageMoveOn(event) {
//   pageMouse = "ON";
// }
// function pageMoveOff(event) {
//   pageMouse = "OFF";
// }

// function pageMove(event) {
//   if (pageMouse === "ON") {
//     event.target.addEventListener("mouseover", (e) => {
//       e.target.style.borderColor = "blue";
//     });
//     event.target.addEventListener("mouseout", (e) => {
//       e.target.style.borderColor = "rgba(0, 0, 0, 0.2)";
//     });
//   }
// }
/////////////////// about tabs tab functions
function tabs(event) {
  const number = event.target.getAttribute("n");
  const tabsNumber = "tabs" + number;
  const tabsTitleNumber = "tabsTitle" + number;
  let urls = [];
  chrome.tabs.query({}, function (tabs) {
    tabs.forEach(function (tab) {
      urls.push(tab.url);
    });
  });

  chrome.storage.sync.get([tabsNumber, tabsTitleNumber], function (result) {
    if (result[tabsNumber] === undefined) {
      result[tabsNumber] = [];
      result[tabsNumber].push(urls);
      result[tabsTitleNumber] = `저장된 ${number}번 탭들`;
      chrome.storage.sync.set(result);
      tabsBtnText(number);
      TeditDelBtnOn(number);
    } else {
      result[tabsNumber][0].forEach(function (tab) {
        chrome.tabs.create({ url: tab });
      });
    }
  });
}

function tabsEdit(event) {
  const number = event.target.getAttribute("n");
  const tabsN = document.getElementById(`tabs${number}`);
  const tabsNEditForm = document.getElementById(`tabs${number}EditForm`);
  const editBtn = document.getElementById(`tabs${number}Edit`);
  const delBtn = document.getElementById(`tabs${number}Del`);
  const title = "tabsTitle" + number;
  chrome.storage.sync.get([title], (result) => {
    if (result[title] !== undefined) {
      if (editBtn.getAttribute("edit") === "off") {
        tabsN.style.display = "none";
        delBtn.style.display = "none";
        tabsNEditForm.value = tabsN.innerText;
        tabsNEditForm.style.display = "inline-block";
        tabsNEditForm.select();
        editBtn.style.display = "inline-block";
        editBtn.innerText = "✔";
        editBtn.style.width = "34px";
        editBtn.setAttribute("edit", "on");
      } else {
        const text = tabsNEditForm.value;
        if (text.length === 0) {
          tabsNEditForm.style.border = "1.5px solid red";
          tabsNEditForm.classList.add("placeholderRed");
          tabsNEditForm.select();
        } else {
          chrome.storage.sync.set({ [title]: text });
          tabsBtnText(number);
          editBtn.setAttribute("edit", "off");
          tabsN.style.display = "inline-block";
          delBtn.style.display = "inline-block";
          editBtn.style.display = "none";
          tabsNEditForm.style.display = "none";
          tabsNEditForm.style.border = "1px solid black";
          tabsNEditForm.classList.remove("placeholderRed");
        }
      }
    }
  });
}

function tabsDel(event) {
  const number = event.target.getAttribute("n");
  const tabsN = document.getElementById(`tabs${number}`);
  const editBtn = document.getElementById(`tabs${number}Edit`);
  const delBtn = document.getElementById(`tabs${number}Del`);
  const tabs = "tabs" + number;
  const title = "tabsTitle" + number;
  if (delBtn.getAttribute("del") === "off") {
    editBtn.style.display = "none";
    delBtn.innerText = "✔";
    tabsN.innerText = "정말로 삭제할까요?";
    tabsN.style.color = "red";
    tabsN.style.cursor = "unset";
    tabsN.disabled = true;
    delBtn.setAttribute("del", "on");
  } else {
    chrome.storage.sync.remove([tabs, title]);
    delBtn.setAttribute("del", "off");
    delBtn.innerText = "X";
    tabsN.style.color = "black";
    tabsN.style.cursor = "pointer";
    tabsN.disabled = false;
    tabsBtnText(number);
    TeditDelBtnOn(number);
  }
}

function tabsBtnText(number) {
  const tabs = "tabs" + number;
  const title = "tabsTitle" + number;
  const tabsNBtn = document.getElementById(`tabs${number}`);
  chrome.storage.sync.get([tabs], function (result) {
    if (result[tabs] === undefined) {
      tabsNBtn.innerText = `TABS ${number}`;
    } else {
      chrome.storage.sync.get([tabs, title], function (result) {
        const str = result[title];
        const realTitle = str.substring(0, 20);
        const realTabs = result[tabs];
        let realTab = "";
        tabsNBtn.innerText = realTitle;
        realTabs.forEach((tab) => {
          tab.forEach((tabTab) => {
            realTab = realTab + tabTab + "\n";
          });
        });
        tabsNBtn.setAttribute("title", realTab);
      });
    }
  });
}

function TeditDelBtnOn(number) {
  const tabs = "tabs" + number;
  const editBtn = document.getElementById(`tabs${number}Edit`);
  const delBtn = document.getElementById(`tabs${number}Del`);
  chrome.storage.sync.get([tabs], function (result) {
    if (result[tabs] === undefined) {
      editBtn.style.display = "none";
      delBtn.style.display = "none";
    } else {
      delBtn.style.display = "inline-block";
    }
  });
}

async function tabsAdd() {
  const number = await tabsBtnNumber();
  if (number !== 10) {
    const n = number + 1;
    chrome.storage.sync.set({ numberOfTabs: n });
    init();
  }
}

async function tabsRemove() {
  const number = await tabsBtnNumber();
  if (number > 4) {
    const n = number - 1;
    chrome.storage.sync.set({ numberOfTabs: n });
    init();
  }
}

function tabsShow(n) {
  const parent = document.getElementById("tabs_tab_list");
  let html = "";
  i = 1;
  while (i < n + 1) {
    html =
      html +
      `<div class="tabsBox" id="tabs${i}Box">
    <button class="tabsBtn" id="tabs${i}" n="${i}">TABS ${i}</button>
    <input
      type="text"
      name="EditForm"
      id="tabs${i}EditForm"
      class="TeditForm"
      n="${i}"
      placeholder="제목을 입력하세요 (20자 이내)"
      spellcheck="false"
      maxlength="20"
      style="display: none"
    />
    <button
      class="TeditBtn"
      id="tabs${i}Edit"
      title="이름 변경"
      n="${i}"
      edit="off"
      style="display: none"
    >
      ✔
    </button>
    <button
      class="TdelBtn"
      id="tabs${i}Del"
      n="${i}"
      title="삭제"
      del="off"
      style="display: none"
    >
      X
    </button>
  </div>`;
    i++;
  }
  parent.innerHTML = html;
}

////////////// pageBtnNumber
function pageBtnNumber() {
  return new Promise((resolve) => {
    chrome.storage.sync.get({ numberOfPage: 4 }, (r) => {
      const n = r["numberOfPage"];
      resolve(n);
    });
  });
}
function tabsBtnNumber() {
  return new Promise((resolve) => {
    chrome.storage.sync.get({ numberOfTabs: 4 }, (r) => {
      const n = r["numberOfTabs"];
      resolve(n);
    });
  });
}

///////////////////// about setting functions [initialization]

async function init() {
  //first Tab
  first_Tab_Show();
  // muteBtnText
  muteBtnText();

  let theNumberOfPage = await pageBtnNumber();
  pageShow(theNumberOfPage);
  let i = 1;
  while (i < theNumberOfPage + 1) {
    editDelBtnOn(i);
    pageBtnText(i);
    const pageNorderBtn = document.getElementById(`page${i}orderBtn`);
    const pageNBtn = document.getElementById(`page${i}`);
    const pageNDelBtn = document.getElementById(`page${i}Del`);
    const pageNEdit = document.getElementById(`page${i}Edit`);
    const pageNEditForm = document.getElementById(`page${i}EditForm`);
    pageNorderBtn.addEventListener("click", pageMoveOn);
    pageNBtn.addEventListener("click", page);
    pageNBtn.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      pageEdit(event);
    });
    pageNDelBtn.addEventListener("click", pageDel);
    pageNEdit.addEventListener("click", pageEdit);
    pageNEditForm.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        pageEdit(event);
      }
    });
    i++;
  }

  const theNumberOfTabs = await tabsBtnNumber();
  tabsShow(theNumberOfTabs);
  let ii = 1;
  while (ii < theNumberOfTabs + 1) {
    TeditDelBtnOn(ii);
    tabsBtnText(ii);
    const tabsNBtn = document.getElementById(`tabs${ii}`);
    const tabsNDelBtn = document.getElementById(`tabs${ii}Del`);
    const tabsNEdit = document.getElementById(`tabs${ii}Edit`);
    const tabsNEditForm = document.getElementById(`tabs${ii}EditForm`);
    tabsNBtn.addEventListener("click", tabs);
    tabsNBtn.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      tabsEdit(event);
    });
    tabsNDelBtn.addEventListener("click", tabsDel);
    tabsNEdit.addEventListener("click", tabsEdit);
    tabsNEditForm.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        tabsEdit(event);
      }
    });
    ii++;
  }

  muteBtn.addEventListener("click", mute);
  jsBtn.addEventListener("click", jstoggle);
  optionsBtn.addEventListener("click", goOptionsTab);
  optionsBtn.addEventListener("contextmenu", fixTab);
  pageBtn.addEventListener("click", goPageTab);
  pageBtn.addEventListener("contextmenu", fixTab);
  tabsBtn.addEventListener("click", goTabsTab);
  tabsBtn.addEventListener("contextmenu", fixTab);
  tabAddBtn.addEventListener("click", pageAdd);
  tabRemoveBtn.addEventListener("click", pageRemove);
  tabsAddBtn.addEventListener("click", tabsAdd);
  tabsRemoveBtn.addEventListener("click", tabsRemove);
}

init();

/// tabsBox
// `<div class="tabs${i}Box">
//     <button class="tabsBtn" id="tabs${i}" n="${i}">TABS ${i}</button>
//     <input
//       type="text"
//       name="EditForm"
//       id="tabs${i}EditForm"
//       class="TeditForm"
//       n="${i}"
//       placeholder="제목을 입력하세요 (20자 이내)"
//       maxlength="20"
//       style="display: none"
//     />
//     <button
//       class="TeditBtn"
//       id="tabs${i}Edit"
//       title="이름 변경"
//       n="${i}"
//       edit="off"
//       style="display: none"
//     >
//       ✔
//     </button>
//     <button
//       class="TdelBtn"
//       id="tabs${i}Del"
//       n="${i}"
//       title="삭제"
//       del="off"
//       style="display: none"
//     >
//       X
//     </button>
//   </div>`;
