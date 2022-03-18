function doValidate(inputs) {
  let isValid = true;
  inputs.forEach((input) => {
    clearInputMessage(input);
    switch (input.name) {
      case "name":
        if (!isTextValid(input.value)) {
          isValid = false;
          showAnError(input);
        } else {
          showSuccessMesage(input)
        }
        break
      case "age":
        if (!isAgeValid(input.value)) {
          isValid = false;
          showAnError(input);
        } else{
        showSuccessMesage(input)
        }
        break;
      case "position":
        if (!isTextValid(input.value)) {
          isValid = false;
          showAnError(input);
        } else{
        showSuccessMesage(input)
        }
        break;
    }
    return
  });
  return isValid;
}

const isTextValid = (text) => {
  const regExp = /^[A-Z][a-zA-z]*$/;
  return regExp.test(text.trim());
};

const isAgeValid = (age) => {
  const regExp = /^\d{1,3}$/;
  return regExp.test(age.trim());
};

const clearInputMessage = (input) => {
    if (input.classList.contains("is-valid")) {
      input.classList.remove("is-valid");
    }
    if (input.classList.contains("is-invalid")) {
      input.classList.remove("is-invalid");
    }
};
const showAnError = (input) => {
  if (input.classList.contains("is-valid")) {
    input.classList.remove("is-valid");
  }
  input.classList.add("is-invalid");
};

const showSuccessMesage = (input) => {
  if (input.classList.contains("is-invalid")) {
    input.classList.remove("is-invalid");
  }
  input.classList.add("is-valid");
};
