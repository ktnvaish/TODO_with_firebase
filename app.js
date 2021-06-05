const todoList = document.querySelector("#todo-list");
const form = document.querySelector("#submit");
const updatebtn = document.querySelector("#update");
const logoutItems = document.querySelectorAll(".logged-out");
const loginItems = document.querySelectorAll(".logged-in");
let newtitle = "";
let updateId = null;
let currentUser = null;

function setUI(user) {
  if (user) {
    loginItems.forEach((item) => (item.style.display = "block"));
    logoutItems.forEach((item) => (item.style.display = "none"));
  } else {
    logoutItems.forEach((item) => (item.style.display = "block"));
    loginItems.forEach((item) => (item.style.display = "none"));
  }
}

function renderList(doc) {
  let li = document.createElement("li");
  li.className = "collection-item";
  li.setAttribute("data-id", doc.id);
  let div = document.createElement("div");
  let title = document.createElement("span");
  title.textContent = doc.data().title;
  let anchor = document.createElement("a");
  anchor.href = "#modal-edit";
  anchor.className = "modal-trigger secondary-content";
  let editBtn = document.createElement("i");
  editBtn.className = "material-icons";
  editBtn.innerText = "edit";
  let deleteBtn = document.createElement("i");
  deleteBtn.className = "material-icons secondary-content";
  deleteBtn.innerText = "delete";
  anchor.appendChild(editBtn);
  div.appendChild(title);
  div.appendChild(deleteBtn);
  div.appendChild(anchor);
  li.appendChild(div);

  deleteBtn.addEventListener("click", (e) => {
    let id = e.target.parentElement.parentElement.getAttribute("data-id");
    db.collection("alltodos")
      .doc(currentUser.uid)
      .collection("todos")
      .doc(id)
      .delete();
  });

  deleteBtn.addEventListener("mouseover", (e) => {
    deleteBtn.style.cursor = "pointer";
  });

  editBtn.addEventListener("click", (e) => {
    updateId =
      e.target.parentElement.parentElement.parentElement.getAttribute(
        "data-id"
      );
  });

  todoList.append(li);
}

updatebtn.addEventListener("click", (e) => {
  newtitle = document.getElementsByName("newtitle")[0].value;
  if (newtitle === "") {
    alert("Can't update to an empty task");
    return;
  }
  db.collection("alltodos")
    .doc(currentUser.uid)
    .collection("todos")
    .doc(updateId)
    .update({
      title: newtitle,
    });
});

form.addEventListener("click", (e) => {
  e.preventDefault();
  const tar = document.querySelector("#ip");
  if (tar.value == "") {
    alert("Please enter a non-empty task");
    return;
  }
  db.collection("alltodos").doc(currentUser.uid).collection("todos").add({
    title: tar.value,
  });
  tar.value = "";
});

function getTodos() {
  todoList.innerHTML = "";
  currentUser = auth.currentUser;
  document.querySelector("#user-email").innerHTML =
    currentUser != null ? "&nbsp&nbsp&nbspHello " + currentUser.email : "";
  if (currentUser === null) {
    todoList.innerHTML =
      '<h4 class="center-align">Login to view your TO-DOs</h4><h5 class="center-align">OR</h5><h5 class="center-align">You can SignUp to create your account</h5>';
    return;
  }
  db.collection("alltodos")
    .doc(currentUser.uid)
    .collection("todos")
    .orderBy("title")
    .onSnapshot((snapshot) => {
      let changes = snapshot.docChanges();
      changes.forEach((change) => {
        if (change.type == "added") {
          renderList(change.doc);
        } else if (change.type == "removed") {
          let li = todoList.querySelector(`[data-id = "${change.doc.id}"]`);
          todoList.removeChild(li);
        } else if (change.type == "modified") {
          let li = todoList.querySelector(`[data-id = "${change.doc.id}"]`);
          li.getElementsByTagName("span")[0].textContent = newtitle;
          newtitle = "";
        }
      });
    });
}
