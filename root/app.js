const formulario = document.getElementById("formulario");
const lista_tareas = document.getElementById("lista-tareas");
const template = document.getElementById("template").content;
const fragment = document.createDocumentFragment();
let tareas = {};

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("tareas")) {
    tareas = JSON.parse(localStorage.getItem("tareas"));
  }
  pintarTareas();
});

lista_tareas.addEventListener("click", (e) => {
  btnAccion(e);
});

formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  setTarea(e);
});

const setTarea = (e) => {
  if (e.target[0].value.trim() === "") {
    alert("esta vacia la tarea, agrega un texto uwu");
    return;
  }

  const tarea = {
    id: Date.now(),
    texto: e.target[0].value,
    estado: false,
  };

  tareas[tarea.id] = tarea;

  formulario.reset();
  e.target[0].focus();

  pintarTareas();
};

const pintarTareas = () => {
  localStorage.setItem("tareas", JSON.stringify(tareas));

  if (Object.values(tareas).length === 0) {
    lista_tareas.innerHTML = `
        <div class="alert alert-dark text-center">
            <b> No hay tareas pendientes 📓 </b>
        </div>`;

    return;
  }
  lista_tareas.innerHTML = "";

  Object.values(tareas).forEach((tarea) => {
    const clone = template.cloneNode(true);
    clone.querySelector("p").textContent = tarea.texto;

    if (tarea.estado) {
      clone
        .querySelector(".alert")
        .classList.replace("alert-info", "alert-secondary");
      clone
        .querySelectorAll(".fas")[0]
        .classList.replace("fa-check-circle", "fa-undo-alt");
      clone.querySelector("p").style.textDecoration = "line-through";
    }

    clone.querySelectorAll(".fas")[0].dataset.id = tarea.id;
    clone.querySelectorAll(".fas")[1].dataset.id = tarea.id;

    fragment.appendChild(clone);
  });

  lista_tareas.appendChild(fragment);
};

const btnAccion = (e) => {
  if (e.target.classList.contains("text-success")) {
    tareas[e.target.dataset.id].estado = !tareas[e.target.dataset.id].estado;
    console.log(tareas);
    pintarTareas();
  }

  if (e.target.classList.contains("fa-minus-circle")) {
    delete tareas[e.target.dataset.id];
    pintarTareas();
  }

  e.stopPropagation();
};
