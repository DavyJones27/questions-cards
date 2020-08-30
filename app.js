const showbtn = document.querySelectorAll(".btn");
const moduleContainerCard = document.querySelector(".module-container-Card");
const questioncard = document.querySelector(".card");
const modulecard = document.querySelector(".card0");
const closeBtn = document.querySelector(".header");
const form = document.querySelector(".question-form");
const feedback = document.querySelector(".feedback");
const questionInput = document.querySelector("#question");
const answerInput = document.querySelector("#answer");
const optionsInput = document.querySelectorAll(".options");
const questionList = document.querySelector(".container2");
let questionId = document.querySelector("._id");
const formModule = document.querySelector(".form-module");
const numOfQuestion = document.querySelector(".headnum");
const addOptions = document.querySelector(".add-option");
const optionAreaQform = document.querySelector(".option-area");
const removeOption = document.querySelector(".remove-option");
const TextColor = document.querySelector(".TextColor");
const TextBackground = document.querySelector(".TextBackground ");
const BallColor = document.querySelector(".BallColor");
const NumberOfBalls = document.querySelector(".NumberOfBalls");
const CourseName = document.querySelector(".CourseName");
const ModuleName = document.querySelector(".ModuleName");
let AllQuestionofModule;
let numOfOptions = 2;
let questionnum = -1;
function eventxListener() {
  const ui = new UI();
  // showbtn[1].addEventListener("click", function() {
  //   ui.showQuestion(modulecard);
  // });
  showbtn[0].addEventListener("click", function() {
    ui.showQuestion(modulecard);
  });
  addOptions.addEventListener("click", function(e) {
    e.preventDefault();
    numOfOptions++;
    ui.addOption(optionAreaQform, numOfOptions);
  });
  removeOption.addEventListener("click", function(e) {
    e.preventDefault();
    ui.deleteOption(numOfOptions);
    numOfOptions--;
  });

  formModule.addEventListener("submit", e => {
    e.preventDefault();
    const moduleDetails = {};
    let name, value;
    let check = true;
    for (let i = 0; i < formModule.elements.length - 1; i++) {
      name = formModule.elements[i].name;
      value = formModule.elements[i].value.trim();
      if (value === "") {
        feedback.classList.add("showItem");
        feedback.textContent = `Cannot Add Empty ${name} Values`;
        check = false;
        setTimeout(() => {
          feedback.classList.remove("showItem");
        }, 4000);
      }
      moduleDetails[name] = value;
    }
    if (check) {
      ui.addModule(moduleContainerCard, moduleDetails);
      ui.formFeild(formModule, "");
    }
    check = true;
  });
  form.addEventListener("submit", e => {
    e.preventDefault();
    dataCollection();
  });
  const dataCollection = async () => {
    const formData = {};
    const Alloptions = {};
    let name, value;
    let check = true;
    for (let i = 0; i < form.elements.length - 4; i++) {
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
      if (!name.includes("option")) {
        formData[name] = value;
      } else {
        Alloptions[name] = value;
      }
    }
    formData["options"] = Alloptions;
    // console.log(formData);
    let id = questionId.value;
    let questions;
    if (check) {
      // if (id == 0) {
      //   console.log(55);
      //   id = await sendData(
      //     "http://ec2-13-232-39-98.ap-south-1.compute.amazonaws.com:3000/admin/questions",
      //     formData,
      //     "POST"
      //   );
      //   console.log(id);
      // } else {
      //   formData._id = id;
      //   id = await sendData(
      //     "http://ec2-13-232-39-98.ap-south-1.compute.amazonaws.com:3000/admin/questions",
      //     formData,
      //     "PUT"
      //   );
      //   console.log(id);
      // }
      if (id) {
        feedback.classList.add("showItem");
        feedback.classList.add("color");
        feedback.textContent = `Sucessfull Added`;
        check = false;
        setTimeout(() => {
          feedback.classList.remove("showItem");
          feedback.classList.remove("color");
        }, 4000);
        questions = new Question(
          id,
          formData.question,
          formData.answer,
          formData.options, //object
          formData.CourseName,
          formData.ModuleName,
          formData.textColor,
          formData.textBackground,
          formData.BallColor,
          formData.NumberOfBalls,
          formData.speed
        );
        ui.addQuestion(questionList, questions);
        questionnum++;
        const ele = document.querySelectorAll(".optionHere");
        ui.displayNewOptions(questions.options, ele[questionnum]);
        ui.formFeild(form, "");
      }
    }
    check = true;
    questionId.value = 0;
  };
  moduleContainerCard.addEventListener("click", async function(event) {
    event.preventDefault();
    const editDatamodule = event.target.parentElement.parentElement.querySelectorAll(
      ".editDatamodule"
    );
    if (event.target.classList.contains("module-Add-question")) {
      CourseName.value = editDatamodule[1].innerHTML.trim();
      ModuleName.value = editDatamodule[0].innerHTML.trim();
      ui.showQuestion(questioncard);
    } else if (event.target.classList.contains("delete-module")) {
      const moduleCourse = {
        module: editDatamodule[0].innerHTML.trim(),
        course: editDatamodule[1].innerHTML.trim()
      };
      const message = await deleteData(
        "http://ec2-13-232-39-98.ap-south-1.compute.amazonaws.com:3000/admin/questions",
        moduleCourse
      );
      if (message == "sucessfull") {
        moduleContainerCard.removeChild(
          event.target.parentElement.parentElement
        );
      }
    } else if (event.target.classList.contains("showAll")) {
      const moduleCourse = {
        module: editDatamodule[0].innerHTML.trim(),
        course: editDatamodule[1].innerHTML.trim()
      };
      AllQuestionofModule = await sendData(
        "http://ec2-13-232-39-98.ap-south-1.compute.amazonaws.com:3000/admin/questions",
        moduleCourse,
        "POST"
      );
    }
  });
  questionList.addEventListener("click", async function(event) {
    event.preventDefault();
    if (event.target.classList.contains("delete")) {
      let _id = event.target.dataset.id;
      const { id } = await deleteData(
        "http://ec2-13-232-39-98.ap-south-1.compute.amazonaws.com:3000/admin/questions",
        _id
      );
      if (id == _id) {
        questionnum--;
        questionList.removeChild(event.target.parentElement.parentElement);
      }
    } else if (event.target.classList.contains("edit")) {
      ui.showQuestion(questioncard);
      let id = event.target.dataset.id;
      const editData = event.target.parentElement.parentElement.querySelectorAll(
        ".editData"
      );
      questionnum--;
      let length = editData.length - 8;
      length = numOfOptions - length;
      while (length != 0) {
        if (length > 0) {
          ui.deleteOption(numOfOptions);
          numOfOptions--;
          length--;
        } else if (length < 0) {
          numOfOptions++;
          ui.addOption(optionAreaQform, numOfOptions);
          length++;
        }
      }

      for (let i = 0; i < editData.length; i++) {
        console.log(editData[i].innerHTML.trim() + " " + i);
      }
      questionInput.value = editData[0].innerHTML.trim();
      let i = 0;
      for (i = 0; i < optionsInput.length; i++) {
        optionsInput[i].value = editData[i + 1].innerHTML.trim();
      }
      i++;
      answerInput.value = editData[i].innerHTML.trim();
      i++;
      CourseName.value = editData[i].innerHTML.trim();
      i++;
      ModuleName.value = editData[i].innerHTML.trim();
      i++;
      TextColor.value = editData[i].innerHTML.trim();
      i++;
      TextBackground.value = editData[i].innerHTML.trim();
      i++;
      BallColor.value = editData[i].innerHTML.trim();
      i++;
      NumberOfBalls.value = editData[i].innerHTML.trim();
      i++;
      questionId.value = id;
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
UI.prototype.deleteOption = function(num) {
  let list = document.querySelector(`.op-${num}`);
  list.parentNode.removeChild(list);
};
UI.prototype.addOption = function(element, num) {
  const div = document.createElement("div");
  div.classList.add(`op-${num}`);
  div.innerHTML = `<label for="option-1" class="question-label">option ${num} </label>
              <textarea
                id="option-num"
                class="options"
                name="option${num}"
                rows="1"
              ></textarea>`;
  element.appendChild(div);
};
UI.prototype.addModule = function(element, data) {
  const div = document.createElement("div");
  div.classList.add("moduleCard");
  div.innerHTML = `<h1>Module Name</h1> 
        <h4 class="title editDatamodule">${data.ModuleName}</h4>
        <h1>Course Name</h1>
        <h4 class="title editDatamodule">${data.CourseName}</h4>
        <div class="module-button">
        <button class="module-Add-question">Add Question</button>
        <button class="showAll">Show All</button>
        <button class="delete-module">Delete Module</button>
        </div>`;
  element.appendChild(div);
};
UI.prototype.displayNewOptions = function(options, element) {
  const keyArray = Object.values(options);
  const div = document.createElement("div");
  div.classList.add("display-option");
  for (let i = 0; i < keyArray.length; i++) {
    let value = keyArray[i];
    // console.log(value);
    let optionHtml = `<div>
    <h4>option ${i + 1}</h4>
    <p class="editData">
    ${value}
    </p>
    </div>`;
    div.innerHTML += optionHtml;
  }
  // console.log(div);

  element.appendChild(div);
  // console.log(element);
};
UI.prototype.addQuestion = function(element, question) {
  const div = document.createElement("div");
  div.classList.add("card2");
  div.innerHTML = `<h2>Question</h2>
  <h5 class="title editData">${question.question}</h5>
  <div class="optionHere">
    </div>
    <h1>Answer</h1>
    <h4 class="title editData">${question.answer}</h4>
  <h2>Course Name</h2>
  <h5 class="editData">${question.CourseName}</h5>
        <h2>Module Name</h2>
        <h5 class="editData">${question.ModuleName}</h5>
         <h2>Text Color</h2>
        <h5 class="editData">${question.textColor}</h5>
         <h2>Text Background</h2>
        <h5 class="editData">${question.textBackground}</h5>
         <h2>BallColor</h2>
        <h5 class="editData">${question.BallColor}</h5>
        <h2>Number Of Balls</h2>
        <h5 class="editData">${question.NumberOfBalls}</h5>
        <h2>Speed</h2>
        <h5 class="editData">${question.speed}</h5>
        <div class="btn1">
          <button class="edit" data-id=${question.id}>Edit</button>
          <button class="delete" data-id=${question.id}>Delete</button>
        </div>`;
  element.appendChild(div);
};
function Question(
  id,
  question,
  answer,
  options,
  CourseName,
  ModuleName,
  textColor,
  textBackground,
  BallColor,
  NumberOfBalls,
  speed
) {
  this.id = id;
  this.question = question;
  this.answer = answer;
  this.options = options;
  this.CourseName = CourseName;
  this.ModuleName = ModuleName;
  this.textColor = textColor;
  this.textBackground = textBackground;
  this.BallColor = BallColor;
  this.NumberOfBalls = NumberOfBalls;
  this.speed = speed;
}
document.addEventListener("DOMContentLoaded", async function() {
  // const data = await fetchAllData(
  //   "http://ec2-13-232-39-98.ap-south-1.compute.amazonaws.com:3000/admin/questions"
  // );
  eventxListener();
  // numOfQuestion.innerHTML = `<h1>Questions:${data.length}</h1>`;
  // displayQuestionCard(data);
});

const sendData = async (url, data, method) => {
  let id;
  try {
    let res = await fetch(url, {
      method: method,
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json"
      }
    });
    // console.log(res);
    if (res.status !== 200 && res.status !== 201) {
      throw new Error("Failed");
    }
    res = await res.json();
    return res.id;
  } catch (err) {
    feedback.classList.add("showItem");
    feedback.textContent = err;
    check = false;
    setTimeout(() => {
      feedback.classList.remove("showItem");
    }, 10000);
  }
};

const deleteData = async (url, _id) => {
  try {
    let res = await fetch(url, {
      method: "DELETE",
      body: JSON.stringify({ _id }),
      headers: {
        "Content-type": "application/json"
      }
    });
    if (res.status !== 200 && res.status !== 201) {
      throw new Error("Failed to delete");
    }
    res = res.json();
    return res;
  } catch (err) {
    feedback.classList.add("showItem");
    feedback.textContent = err;
    check = false;
    setTimeout(() => {
      feedback.classList.remove("showItem");
    }, 4000);
  }
};

const fetchAllData = async url => {
  try {
    let response = await fetch(url);
    response = await response.json();
    return response;
  } catch (err) {
    // console.log(err);
  }
};

// const displayQuestionCard = data => {
//   const ui = new UI();
//   let questions;
//   for (let i = 0; i < data.length; i++) {
//     questions = new Question(
//       data[i]._id,
//       data[i].question,
//       data[i].solution,
//       data[i].option1,
//       data[i].option2,
//       data[i].option3,
//       data[i].option4
//     );
//     ui.addQuestion(questionList, questions);
//   }
// };
