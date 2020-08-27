const showbtn = document.querySelector(".btn");
const questioncard = document.querySelector(".card");
const closeBtn = document.querySelector(".header");
const form = document.querySelector(".question-form");
const feedback = document.querySelector(".feedback");
const questionInput = document.querySelector("#question");
const answerInput = document.querySelector("#answer");
const optionsInput = document.querySelectorAll(".options");
const questionList = document.querySelector(".container2");
let questionId = document.querySelector("._id");
function eventxListener() {
  const ui = new UI();
  showbtn.addEventListener("click", function() {
    ui.showQuestion(questioncard);
  });
  closeBtn.addEventListener("click", function() {
    ui.hideQuestion(questioncard);
  });
  form.addEventListener("submit", e => {
    e.preventDefault();
    dataCollection();
  });

  const dataCollection = async () => {
    const formData = {};
    let name, value;
    let check = true;
    for (let i = 0; i < form.elements.length - 2; i++) {
      name = form.elements[i].name;
      value = form.elements[i].value.trim();
      if (value === "") {
        feedback.classList.add("showItem");
        feedback.textContent = `Cannot Add Empty ${name} Values`;
        check = false;
        setTimeout(() => {
          feedback.classList.remove("showItem");
        }, 4000);
        break;
      }
      formData[name] = value;
    }
    let id = questionId.innerHTML.trim();
    let questions;
    if (check) {
      if (id == 0) {
        id = await fetchData("url", formData, "POST");
      }
      questions = new Question(
        id,
        formData.question,
        formData.answer,
        formData.option1,
        formData.option2,
        formData.option3,
        formData.option4
      );
      ui.addQuestion(questionList, questions);
      ui.formFeild(form, "");
    }
    check = true;
  };
  questionList.addEventListener("click", async function(event) {
    event.preventDefault();
    if (event.target.classList.contains("delete")) {
      let id = event.target.dataset.id;
      const res = await deleteData(url, id);
      if (res == success) {
        questionList.removeChild(event.target.parentElement.parentElement);
      }
    } else if (event.target.classList.contains("edit")) {
      ui.showQuestion(questioncard);
      let id = event.target.dataset.id;
      const editData = event.target.parentElement.parentElement.querySelectorAll(
        ".editData"
      );
      questionInput.value = editData[0].innerHTML.trim();
      for (let i = 0; i < optionsInput.length; i++) {
        optionsInput[i].value = editData[i + 1].innerHTML.trim();
      }
      questionId.value = id;
      answerInput.value = editData[5].innerHTML.trim();
      questionList.removeChild(event.target.parentElement.parentElement);
    }
  });
}
function UI() {}
UI.prototype.showQuestion = function(e) {
  e.classList.add("show");
};
UI.prototype.hideQuestion = function(e) {
  e.classList.remove("show");
};
UI.prototype.formFeild = function(inputs, value) {
  for (let i = 0; i < inputs.elements.length - 1; i++) {
    inputs.elements[i].value = value;
  }
};
UI.prototype.addQuestion = function(element, question) {
  const div = document.createElement("div");
  div.classList.add("card2");
  div.innerHTML = `<h1>Question</h1>
        <h4 class="title editData">${question.title}</h4>
        <div class="display-option">
          <div>
            <h4>option 1</h4>
            <p class="editData">
                ${question.option1}
            </p>
          </div>
          <div>
            <h4>option 2</h4>
            <p class="editData">
                ${question.option2}
            </p>
          </div>
          <div>
            <h4>option 3</h4>
            <p class="editData">
                ${question.option3}
            </p>
          </div>
          <div>
            <h4>option 4</h4>
            <p class="editData">
              ${question.option4}
            </p>
          </div>
        </div>
        <h1>Answer</h1>
        <h4 class="title editData">${question.answer}</h4>
        <div class="btn1">
          <button class="edit" data-id=]${question.id}>Edit</button>
          <button class="delete" data-id=]${question.id}>Delete</button>
        </div>`;
  element.appendChild(div);
};
function Question(id, title, answer, option1, option2, option3, option4) {
  this.id = id;
  this.title = title;
  this.answer = answer;
  this.option1 = option1;
  this.option2 = option2;
  this.option3 = option3;
  this.option4 = option4;
}
document.addEventListener("DOMContentLoaded", function() {
  eventxListener();
});

const fetchData = (url, data, method) => {
  fetch(url, {
    method: method,
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json"
    }
  })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed");
      }
      return res.json();
    })
    .then(json => json)
    .catch(err => {
      feedback.classList.add("showItem");
      feedback.textContent = err;
      check = false;
      setTimeout(() => {
        feedback.classList.remove("showItem");
      }, 4000);
    });
};

const deleteData = (url, id) => {
  fetch(url, {
    method: "DELETE",
    body: JSON.stringify(id),
    headers: {
      "Content-type": "application/json"
    }
  })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed to delete");
      }
      return res.json();
    })
    .then(json => json)
    .catch(err => {
      feedback.classList.add("showItem");
      feedback.textContent = err;
      check = false;
      setTimeout(() => {
        feedback.classList.remove("showItem");
      }, 4000);
    });
};

let data;
const fetchData = url => {
  fetch(url)
    .then(response => response.json())
    .then(json => {
      data = json;
    })
    .catch(err => {
      console.log(err);
    });
};
