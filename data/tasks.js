import Task from "../models/task.js";
import levelMap from "../config/constants.js";
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
const tasks = [
   new Task(uuidv4(), 'An banh',levelMap.key.small),
   new Task(uuidv4(), 'Bn keo',levelMap.key.medium),
   new Task(uuidv4(), 'Cn trai cay',levelMap.key.hight),
];
export default tasks;