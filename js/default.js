import { weather_init } from "./weather.js";
import { clock_init } from "./clock.js";
import { link_modify_init } from "./form.js";
import { icons_show_init } from "./icons.js";
import { todo_init, todolistOnOff } from "./todos.js";

//////////// Default
function bodyClicked(event) {
  const target = event.target;
  // todolist showing toggle
  const todolist = document.getElementById("list_wrapper");
  const todoShow = todolist.classList.contains("todolist-showing");
  if (
    todoShow &&
    target.id !== "todolistBtnIMG" &&
    target.id !== "todolistBtn"
  ) {
    todolistOnOff(event);
  }
}

/////////////////////////
////////// INIT /////////
/////////////////////////
function default_init() {
  document.body.addEventListener("click", bodyClicked);
}

function init() {
  default_init();
  weather_init();
  clock_init();
  icons_show_init();
  link_modify_init();
  todo_init();
}

init();

export { init as default_init };
