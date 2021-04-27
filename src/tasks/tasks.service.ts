import { Injectable } from '@nestjs/common';
import { v1 as uuid} from 'uuid';
import { Task, TaskStatus } from './tasks.model';

@Injectable()
export class TasksService {
    private tasks:Task[] = []

    getAllTasks(): Task[]{
        return this.tasks
    }

    createTask(title: string, description: string): Task{
        const task: Task ={
            title, description, status: TaskStatus.OPEN, id: uuid()
        }
        this.tasks.push(task)
        return task
    }
}
