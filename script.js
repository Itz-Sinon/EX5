const btnAdd = document.getElementById("getInput");
const btnDelete = document.getElementById("deleteTrash");
const input = document.getElementById("input");
const toDo = document.getElementById("to_doBox");
const doing = document.getElementById("doingBox");
const done = document.getElementById("doneBox");
const trash = document.getElementById("trashBox");

let allLists = getList();
renderList(allLists);

let dragged = null;

[toDo, doing, done, trash].forEach((box) => {
  box.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
  box.addEventListener("drop", (e) => {
    if (dragged) {
      box.appendChild(dragged);

      const name = dragged.querySelector("p").textContent;
      let newStatus = "";
      if (box === toDo) {
        newStatus = "To_Do";
      } else if (box === doing) {
        newStatus = "Doing";
      } else if (box === done) {
        newStatus = "Done";
      } else if (box === trash) {
        newStatus = "Trash";
      }

      for (let i = 0; i < allLists.length; i++) {
        if (allLists[i].name === name) {
          allLists[i].status = newStatus;
          break;
        }
      }
      localStorage.setItem("todoList", JSON.stringify(allLists));
    }
    dragged = null;
  });
});

function addDragEvents() {
  const tasks = document.getElementsByClassName("task");
  for (let task of tasks) {
    task.addEventListener("dragstart", (e) => {
      dragged = task;
    });
  }
}

btnAdd.addEventListener("click", () => {
  if (input.value == "") {
    alert("Please enter input");
    return false;
  }

  allLists = getList();
  allLists.push({ name: input.value, status: "To_Do" });
  input.value = "";

  localStorage.setItem("todoList", JSON.stringify(allLists));

  renderList(allLists);
});

btnDelete.addEventListener("click", () => {
  let choice = confirm("Are you sure want to delete ?");
  if (choice) {
    allLists = getList();
    for (let i = allLists.length - 1; i > -1 ; i--) {
      if (allLists[i].status == "Trash") {
        allLists.splice(i, 1);
      }
    }
    localStorage.setItem("todoList", JSON.stringify(allLists));

    renderList(allLists);
  }
});

function renderList(list = []) {
  toDo.innerHTML = "";
  doing.innerHTML = "";
  done.innerHTML = "";
  trash.innerHTML = "";

  list.forEach((task) => {
    const todoItem = document.createElement("div");
    todoItem.classList.add("task");
    todoItem.setAttribute("draggable", "true");
    todoItem.innerHTML = `<div class="taskBox"><p>${task.name}</p></div>`;
    if (task.status == "To_Do") {
      toDo.appendChild(todoItem);
    } else if (task.status == "Doing") {
      doing.appendChild(todoItem);
    } else if (task.status == "Done") {
      done.appendChild(todoItem);
    } else {
      trash.appendChild(todoItem);
    }
  });
  addDragEvents();
}

function getList() {
  return localStorage.getItem("todoList")
    ? JSON.parse(localStorage.getItem("todoList"))
    : [];
}
