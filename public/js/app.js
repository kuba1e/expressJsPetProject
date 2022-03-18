"use strict";

const form = document.querySelector(".form-user");
const submitBtn = form.querySelector(".submit-btn");
const list = document.querySelector(".list-users .row");
const formTypeInput = document.querySelector(".form-type-input");
const toast = new bootstrap.Toast(document.querySelector(".toast"));
const toastBody = document.querySelector(".toast-body");
const modal = document.querySelector(".modal");
const preloader = document.querySelector(".loadingio-spinner-disk-8zk9ac25jjn");
const formImage = document.querySelector('.avatar')
const imgFileFormatArray = ['image/png', 'image/jpg', 'image/jpeg']
const baseImgUrl = "./uploads/images/";
let usersArray = [];


const clearForm = (name, type) => {
  submitBtn.value = name;
  formTypeInput.dataset.formType = type;
  form.reset();
};

const setEditFormValue = (id, usersArray) => {
  if (usersArray.length) {
    const userInfo = findUser(id, usersArray);
    form.elements.name.value = userInfo.name;
    form.elements.age.value = userInfo.age;
    form.elements.position.value = userInfo.position;
  }
};

const setFormType = (id) => {
  formTypeInput.dataset.id = id;
  formTypeInput.dataset.formType = "edit";
  submitBtn.value = "Edit";
};

const setUsersMarkup = (users) => {
  let strMarkup = "";
  if (!users.length) {
    list.innerHTML = "";
    return;
  }
  users.forEach(({ _id, name, age, position, img }) => {
    strMarkup += `
    <div class="col ">
        <div class="card button-container" data-id="${_id}" style="width: 18rem;">
        <img src="${baseImgUrl + img}" class="card-img-top" alt="avatar">
        <div class="card-body">
        <h5 class="card-title">Name: ${name}</h5>
        <p class="card-text">Age: ${age}</p>
        <p class="card-text">Position: ${position}</p>
        <div class="btn-container">
        <button  class="form-delete-btn btn btn-danger" type="button">Delete</button>
        <button class="form-edit-btn btn btn-success" type="button">Edit</button>
        </div>
        </div>
        </div>
        </div>
        `;
  });
  list.innerHTML = strMarkup;
  list.addEventListener("click", buttonHandler);
};

const fetchUpdatedUsers = async (method, formData) => {
  try {
    const response = await fetch(`http://localhost:3000/users/`, {
      method,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    await getUsers();
  } catch (error) {
    throw new Error(error.message);
  }
};

const fetchEditUsers = async (method, formData, id) => {
  formData.append("id", id);
  try {
    const response = await fetch(`http://localhost:3000/users/${id}`, {
      method,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    await getUsers();
  } catch (error) {
    throw new Error(error.message);
  }
};

const fetchUsersArray = async () => {
  try {
    const response = await fetch("http://localhost:3000/users");
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const users = await response.json();
    return users;
  } catch (error) {
    throw new Error(error.message);
  }
};

const fetchDeleteUser = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/users/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    await getUsers();
  } catch (error) {
    throw new Error(error.message);
  }
};

const getUsers = async () => {
  try {
    showPreloader();
    const users = await fetchUsersArray();
    usersArray = users;
    setUsersMarkup(users);
    hidePreloader();
  } catch (error) {
    throw new Error(error.message);
  }
};

const getUsersWrapper = async () => {
  try {
    await getUsers();
  } catch (error) {
    showMessage(error.message, toast);
  }
};

const findUser = (id, users) => {
  return users.find((element) => element._id === id);
};

const formHandler = async (event) => {
  event.preventDefault();
  try {
    const imgFile = formImage.files[0]?? false
    if (doValidate(getInputs()) && checkFileFormat(imgFile)) {
      const formType = formTypeInput.dataset.formType;
      const formData = new FormData(event.target);
      if (formType === "edit") {
        let elementId = formTypeInput.dataset.id;
        await fetchEditUsers("PUT", formData, elementId);
        clearForm("Add user", "send");
      } else {
        await fetchUpdatedUsers("POST", formData);
        form.reset();
      }
    }
  } catch (error) {
    showMessage(error.message, toast);
  }
};

const buttonHandler = async ({ target }) => {
  try {
    const elementClassList = target.classList;
    if (elementClassList.contains("form-delete-btn")) {
      showModalForm(modal);
      hideScroll()
      const id = target.closest(".button-container").dataset.id;
      modal.addEventListener("click", async function modalHandler({ target }) {
        if (target.closest(".cancel-btn") || target.closest(".btn-close")) {
          modal.classList.remove("show-modal");
          modal.removeEventListener("click", modalHandler)
          showScroll()
        }
        if (target.closest(".delete-btn")) {
          await fetchDeleteUser(id);
          modal.classList.remove("show-modal");
          modal.removeEventListener("click", modalHandler);
          showScroll()
        }
      });
    } else if (elementClassList.contains("form-edit-btn")) {
      const btnContainer = target.closest(".button-container");
      const id = btnContainer.dataset.id;
      setEditFormValue(id, usersArray);
      setFormType(id);
    }
  } catch (error) {
    showMessage(error.message, toast);
  }
};

const hidePreloader = () => {
  preloader.classList.add("hide-preloader");
};

const showPreloader = () => {
  preloader.classList.remove("hide-preloader");
};

const getInputs = () => {
  return document.querySelectorAll(".req");
};

const showModalForm = (modal) => {
  modal.classList.add("show-modal");
};

const hideModalForm = (modal) => {
  modal.classList.remove("show-modal");
};

const showMessage = (message, toast) => {
  toastBody.textContent = message;
  toast.show();
};

const hideScroll = ()=>{ 
  document.body.style.overflow = "hidden";
  document.body.style.paddingRight = "16px"
}

const showScroll = ()=>{
  document.body.style.overflow = "auto";
  document.body.style.paddingRight = "0"
}

const checkFileFormat = (file)=>{
  if(file.type){
    if(!imgFileFormatArray.includes(file.type)){
      showMessage('Please select an correct file type', toast)
      return false
    } 
    return true
  }
  return true
}



form.addEventListener("submit", formHandler);

getUsersWrapper();
