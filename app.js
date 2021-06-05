const todoList = document.querySelector("#todo-list");
const form = document.querySelector("#submit");
const updatebtn = document.querySelector("#update");
let newtitle = "";
let updateId = null;

function renderList(doc) {
  let li = document.createElement("li");
  li.className = "collection-item";
  li.setAttribute("data-id", doc.id);
  let div = document.createElement("div");
  let title = document.createElement("span");
  title.textContent = doc.data().title;
  let anchor = document.createElement("a");
  anchor.href = "#modal1";
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
    db.collection("todos").doc(id).delete();
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
  db.collection("todos").doc(updateId).update({
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
  db.collection("todos").add({
    title: tar.value,
  });
  tar.value = "";
});

db.collection("todos")
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
