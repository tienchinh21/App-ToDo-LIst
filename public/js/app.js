import tasks from "../../data/tasks.js"
import levelMap from "../../config/constants.js";
import Task from "../../models/task.js";
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
const sortType = {
    orderBy: 'title',
    orderDir: 'desc',
}

let TASK_DATA =[...getDataFromLocalStorage()];
let taskEditSelected = null;

const inputSortEL = document.querySelector('.sort-values');
inputSortEL.addEventListener('change', function(e) {
    const val = e.target.value
    const valSort = val.split('-');
    sortType.orderBy = valSort[0];
    sortType.orderDir = valSort[1];
    sortHandler(sortType.orderBy,sortType.orderDir);
    previewSort(sortType.orderBy,sortType.orderDir);
});
function getDataFromLocalStorage() {
    const data = localStorage.getItem('list_tasks');
    if (!data) {
        return [];
    }
    return JSON.parse(data);
}
function storeLocalStorage(data) {
    console.log(data);
    localStorage.setItem('list_tasks', JSON.stringify(data));
}
function renderTasks(tasks){
    const taskBodyEL = document.getElementById('task-body');
    const taskFomatted = tasks.map(function(task, index) {
        return `<tr>
            <td>${index + 1}</td>
            <td>${task.name}</td>
            <td>
                <span class="span">${levelMap.label[task.level]}</span>
                
            </td>
            <td>
                <button data-task-id="${task.id}" class="btn-delete" type="button">Delete</button>
                <button data-task-id="${task.id}" class="edit" type="button">edit</button>
            </td>
        </tr>`
    });
    const taskDom = taskFomatted.join('');
    taskBodyEL.innerHTML = taskDom;
}
function search() {
    const inputSearch = document.querySelector('[name=search]');
    inputSearch.addEventListener('keyup', function(event) {
        const valueSearch = event.target.value
        const newTask = TASK_DATA.filter(function(task) {
            if(task.name.toLowerCase().includes(valueSearch.toLowerCase())) {
                return true;
            } else return false;
        });
       renderTasks(newTask); 
    });
}
function sortHandler(orderBy, orderDir) {
    if(orderBy == 'name') {
        const tasksCopy = TASK_DATA.sort(function(a, b) {
            if(a.name > b.name) {
                return orderDir == 'asc' ? -1 : 1;
            } else if( a.name < b.name) {
                return orderDir == 'asc' ? 1 : 1;
            } else return 0;
        });
        renderTasks(tasksCopy);
    }
    if(orderBy == 'level') {
        const tasksCopy = TASK_DATA.sort(function(a, b) {
            if(a.level > b.level) {
                return orderDir == 'asc' ? -1 : 1;
            } else if( a.level < b.level) {
                return orderDir == 'asc' ? 1 : 1;
            } else return 0;
        });
        renderTasks(tasksCopy);
    }
}
function previewSort(orderBy, orderDir) {
    const sortPreviewEL = document.querySelector('.sort-preview');
    sortPreviewEL.innerHTML = (orderBy + '' + '-' + '' + orderDir).toUpperCase();
}
function deleteTask() {
    const btnDeleteELs = document.querySelectorAll('.btn-delete');
    btnDeleteELs.forEach(function(btnItem) {
        btnItem.addEventListener('click', function() {
            const comfirmDelete = confirm('Ban co chac chan muon xoa khong?');
                if(comfirmDelete) {
                    const taskID = this.getAttribute('data-task-id');
                const newTask = TASK_DATA.filter(function(task) {
                    return task.id != taskID;
                });
                TASK_DATA = newTask;
                storeLocalStorage(TASK_DATA);
                renderTasks(TASK_DATA);
                deleteTask(); 
                editTask();              
            }         
        });
   });
}
function addNewTask() {
    const formTaskEL = document.querySelector('#form-task');
    formTaskEL.addEventListener('submit', function(event) {
        event.preventDefault();
        const inputNameEL = document.querySelector('.input-name');
        const inputLevelEL = document.querySelector('.input-level'); 
        const inputNameVal = inputNameEL.value;
        const inputLevelVal = inputLevelEL.value;
        
       if(!inputNameVal.trim().length) {
            alert('Vui long nhap ten task');
       } else {
           if (taskEditSelected == null) {
                const newTask = new Task(uuidv4(), inputNameVal, +inputLevelVal);
                TASK_DATA.push(newTask);
                renderTasks(TASK_DATA);
                deleteTask();
                editTask();
                inputNameEL.value = '';
                inputLevelEL.value= 1;
                storeLocalStorage(TASK_DATA);

           } else {
                const newTask = new Task(taskEditSelected.id, inputNameVal, +inputLevelVal);
                const taskIndexFound = TASK_DATA.findIndex(function(taskItem) {
                    return taskItem.id === taskEditSelected.id;
                });
                TASK_DATA[taskIndexFound] = newTask;
                storeLocalStorage(TASK_DATA);
                renderTasks(TASK_DATA);
                deleteTask();
                editTask();
           }
           inputNameEL.value = '';
           inputLevelEL.value = 1;       
        }
    });
}
function editTask() {
    const btnDeleteEls = document.querySelectorAll('.edit');
    btnDeleteEls.forEach(function(btnItem) {
        btnItem.addEventListener('click', function() {
             // Chú ý nghiên cứu kỹ
            const taskID = this.getAttribute('data-task-id');
            const taskIndexFound = TASK_DATA.findIndex(function(taskItem) {
                return taskItem.id === taskID;
            });

            taskEditSelected = TASK_DATA[taskIndexFound];

            // // Append data to form
            const inputNameEL = document.querySelector('.input-name');
            const inputLevelEL = document.querySelector('.input-level'); 
            inputNameEL.value = taskEditSelected.name;
            inputLevelEL.value = taskEditSelected.level;
        });
    });
}
renderTasks(TASK_DATA);
search();
sortHandler(sortType.orderBy,sortType.orderDir);
deleteTask();
addNewTask();
editTask();