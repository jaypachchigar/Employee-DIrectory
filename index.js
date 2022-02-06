// declaration of variable that holds the list of all the employees displayed on the screen
var employee_data = [];
//  if error occurs in api call then this will show up
const errorTitle = "Something Went Wrong";
const errorDescription =
  "Our servers are getting too many requests right now and we are currently unable to fetch the employee data please try again in some time.";

  const createApiURL= 'https://dummy.restapiexample.com/api/v1/create';
  const getEmployeesApiURL = 'https://dummy.restapiexample.com/api/v1/employees';
  const getEmployeeDetailApiURL = 'https://dummy.restapiexample.com/api/v1/employee/';

// fetching the api
var fetchEmployeeList = function () {
  axios
    .get(getEmployeesApiURL)
    .then(function (response) {
      employee_data = response.data.data;
      //api fetched now update the DOM
      updateEmployeeData();
    })
    .catch(function (error) {
      console.log(error);
      employee_data = [];
      showErrorToast();
    });
};
// fetch employee list once the DOM is ready
if (
  document.readyState === "complete" ||
  (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
  fetchEmployeeList();
} else {
  document.addEventListener("DOMContentLoaded", fetchEmployeeList);
}
var detailModal = document.getElementById("detailModal");
// on click of view more detail it will render the detailed model
detailModal.addEventListener("show.bs.modal", function (event) {
  // Button that triggered the modal
  var button = event.relatedTarget;
  // Extract employee id from data-bs-employee-id attribute
  var id = button.getAttribute("data-bs-employee-id");
  // do a api GET call to fetch empoloyee details for respective id
  axios
    .get(getEmployeeDetailApiURL + id)
    .then(function (response) {
        // if api call success then render the employee details
      const employee = response.data.data;
      var modalTitle = detailModal.querySelector(".modal-title");
      var modalBody = detailModal.querySelector(".modal-body");
      modalTitle.textContent = employee.employee_name + "'s" + " Details";
    //   it will all the details for respective user for the given id

      modalBody.innerHTML = `
      <div>id: ${employee.id} </div>
      <div>name: ${employee.employee_name} </div>
      <div>salary: ${employee.employee_salary} </div>
      <div>age: ${employee.employee_age} </div>
    `;
    })
    .catch(function (error) {
      showError(detailModal);
    });
});
// if too many request then this will show
function showError(modal) {
  var modalTitle = modal.querySelector(".modal-title");
  var modalBody = modal.querySelector(".modal-body");

  modalTitle.textContent = errorTitle;
  modalBody.textContent = errorDescription;
}
var formElement = document.getElementById("addForm");
formElement.addEventListener("submit", function (evt) {
  evt.preventDefault();
  addUser();
});
// to add user using POST call
function addUser() {
  var name = document.getElementById("inputName").value;
  var salary = document.getElementById("inputSalary").value;
  var age = document.getElementById("inputAge").value;

  axios
    .post(createApiURL, {
      name: name,
      salary: salary,
      age: age,
    })
    .then(function (response) {
      const newEmployee = response.data.data;
    //   push new employee details to existing data
      employee_data.push({
        employee_name: newEmployee.name,
        employee_salary: newEmployee.salary,
        employee_age: newEmployee.age,
        id: newEmployee.id,
      });
      updateEmployeeData();
    })
    .catch(function (error) {
      showErrorToast();
    });
}
//  update the employee details element with the list of employees
function updateEmployeeData() {
  const employeeDetails = document.getElementById("employeeDetails");
  employee_data.forEach((employee, idx) => {
    // Create card element
    
    // if no image found for the employee render, default image
    if (!employee.profile_image) {
      employee.profile_image =
        "https://www.tenforums.com/attachments/tutorials/146359d1501443008-change-default-account-picture-windows-10-a-user.png";
    }
    // Construct card content
    const content = `
                <div class="card employee-card" style="width: 18rem;">
                    <img class="card-image" src="${employee.profile_image}" class="card-img-top" alt="${employee.employee_name}">
                    <div class="card-body">
                    <h5 class="card-title">Name: ${employee.employee_name}</h5>
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#detailModal"
                            data-bs-employee-id="${employee.id}">Get more details</button>
                </div>
                `;
    // Append newyly created card element to the container
    employeeDetails.innerHTML += content;
  });
}
// if api runs into an error then it will show this message
function showErrorToast() {
  var toastLiveExample = document.getElementById("errorToast");
  var toast = new bootstrap.Toast(toastLiveExample);
  toast.show();
}
