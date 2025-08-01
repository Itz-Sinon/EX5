const firebaseConfig = {
  apiKey: "AIzaSyBZqpIm8KBnHYzX_EVyxsZiF8Tk7-8FQZw",
  authDomain: "test1-29602.firebaseapp.com",
  projectId: "test1-29602",
  appId: "1:965402988064:web:160925710944ca05e93645",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();

let allLists = [];
let UserID;

auth.onAuthStateChanged(async (user) => {
  if (user) {
    document.getElementById("userName").innerHTML =
      "Welcome " + user.displayName;
    document.getElementById("logInPlace").style.display = "none";
    document.getElementById("accountPlace").style.display = "";
    document.getElementById("inputPlace").style.display = "";
    document.getElementById("information").style.display = "";

    UserID = user.uid;
    const docRef = db.collection("User's Infor").doc(UserID);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      const data = docSnap.data();
      allLists = data["To-do List"];
      renderList(allLists);
    } else {
      allLists = [];
      renderList(allLists);
    }
  } else {
    allLists = [];
    document.getElementById("logInPlace").style.display = "";
    document.getElementById("accountPlace").style.display = "none";
    document.getElementById("inputPlace").style.display = "none";
    document.getElementById("information").style.display = "none";
  }
});

const loginBtn = document.getElementById("logInGoogle");
const logoutBtn = document.getElementById("logOut");

loginBtn.addEventListener("click", () => {
  auth
    .signInWithPopup(provider)
    .then((result) => {})
    .catch((error) => {
      alert("Fail to login");
    });
});

logoutBtn.addEventListener("click", () => {
  popUpLogOut.classList.add("openPopUp");
  popUpLogOutContent.classList.add("slideDown");
});

const btnAdd = document.getElementById("getInput");
const popUpAdd = document.getElementById("popUpAddToList");
const popUpAddContent = document.getElementById("popUpAddToList-Content");
const btnClosePopUpAdd = document.getElementById("closePopUpAdd");

const btnDelete = document.getElementById("deleteTrash");
const popUpDelete = document.getElementById("popUpDeleteTrash");
const popUpDeleteContent = document.getElementById("popUpDeleteTrash-Content");
const btnComfirmDelete = document.getElementById("comfirmDelete");
const btnClosePopUpDelete = document.getElementById("closePopUpDelete");

const popUpLogOut = document.getElementById("popUpLogOut");
const popUpLogOutContent = document.getElementById("popUpLogOut-Content");
const btnComfirmLogOut = document.getElementById("comfirmLogOut");
const btnClosePopUpLogOut = document.getElementById("closePopUpLogOut");

const input = document.getElementById("input");
const toDo = document.getElementById("to_doBox");
const doing = document.getElementById("doingBox");
const done = document.getElementById("doneBox");
const trash = document.getElementById("trashBox");

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
      const newData = { "To-do List": allLists };
      db.collection("User's Infor").doc(UserID).set(newData);
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

btnAdd.addEventListener("click", () => {
  if (input.value == "") {
    popUpAdd.classList.add("openPopUp");
    popUpAddContent.classList.add("slideDown");
    return false;
  }

  allLists.push({ name: input.value, status: "To_Do" });
  input.value = "";
  const newData = { "To-do List": allLists };
  db.collection("User's Infor").doc(UserID).set(newData);

  renderList(allLists);
});

btnDelete.addEventListener("click", () => {
  popUpDelete.classList.add("openPopUp");
  popUpDeleteContent.classList.add("slideDown");
});

btnClosePopUpAdd.addEventListener("click", () => {
  popUpAdd.classList.remove("openPopUp");
  popUpAddContent.classList.remove("slideDown");
});

btnComfirmDelete.addEventListener("click", () => {
  for (let i = allLists.length - 1; i > -1; i--) {
    if (allLists[i].status == "Trash") {
      allLists.splice(i, 1);
    }
  }
  renderList(allLists);
  const newData = { "To-do List": allLists };
  db.collection("User's Infor").doc(UserID).set(newData);
  popUpDelete.classList.remove("openPopUp");
  popUpDeleteContent.classList.remove("slideDown");
});

btnClosePopUpDelete.addEventListener("click", () => {
  popUpDelete.classList.remove("openPopUp");
  popUpDeleteContent.classList.remove("slideDown");
});

btnComfirmLogOut.addEventListener("click", () => {
  allLists = [];
  auth.signOut();
  popUpLogOut.classList.remove("openPopUp");
  popUpLogOutContent.classList.remove("slideDown");
});

btnClosePopUpLogOut.addEventListener("click", () => {
  popUpLogOut.classList.remove("openPopUp");
  popUpLogOutContent.classList.remove("slideDown");
});
