function eventxListener() {
  const showbtn = document.querySelector(".btn");
  const questioncard = document.querySelector(".card");
  const closeBtn = document.querySelector(".header");
  const form = document.querySelector(".question-form");
  const feedback = document.querySelector(".feedback");
  const questionInput = document.querySelector("#question");
  const answerInput = document.querySelector("#answer");
  const questionList = document.querySelector(".container2");
  let data = [];
  let id = 1;
  const ui = new UI();
  showbtn.addEventListener("click", function() {
    ui.showQuestion(questioncard);
  });
  closeBtn.addEventListener("click", function() {
    ui.hideQuestion(questioncard);
  });
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    const question = questionInput.value.trim();
    const answer = answerInput.value.trim();
    if (question === "" || answer === "") {
      feedback.classList.add("showItem");
      feedback.textContent = "Cannot Add Empty Values";
      setTimeout(() => {
        feedback.classList.remove("showItem");
      }, 4000);
    } else {
      const questions = new Question(id, question, answer);
      data.push(questions);
      id++;
      ui.addQuestion(questionList, questions);
      ui.clearFeild(questionInput, answerInput);
    }
  });
  questionList.addEventListener("click", function(event) {
    event.preventDefault();
    if (event.target.classList.contains("delete")) {
      questionList.removeChild(event.target.parentElement.parentElement);
      let id = event.target.dataset.id;
      const tempdata = data.filter(function(item) {
        return item.id !== parseInt(id);
      });
      data = tempdata;
    } else if (event.target.classList.contains("hide")) {
      event.target.nextElementSibling.classList.toggle("showItem");
    } else if (event.target.classList.contains("edit")) {
      let id = event.target.dataset.id;
      questionList.removeChild(event.target.parentElement.parentElement);
      ui.showQuestion(questioncard);
      const tempQuestion = data.filter(function(item) {
        return item.id === parseInt(id);
      });
      const tempdata = data.filter(function(item) {
        return item.id !== parseInt(id);
      });
      data = tempdata;
        questionInput.value = tempQuestion[0].title;
        answerInput.value = tempQuestion[0].answer;
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
UI.prototype.clearFeild = function(question, answer) {
  question.value = "";
  answer.value = "";
};
UI.prototype.addQuestion = function(element, question) {
  const div = document.createElement("div");
  div.classList.add("card2");
  div.innerHTML = `<h2 class="title">${question.title}</h2>
        <a class="hide"  href="#">Show/Hide Answer</a>
        <h3 class="ansHide">${question.answer}</h3>
        <div class="btn1">
          <button data-id="${question.id}" class="edit">Edit</button>
          <button data-id="${question.id}" class="delete">Delete</button>
        </div>`;
  element.appendChild(div);
};
function Question(id, title, answer) {
  this.id = id;
  this.title = title;
  this.answer = answer;
}

document.addEventListener("DOMContentLoaded", function() {
  eventxListener();
});
