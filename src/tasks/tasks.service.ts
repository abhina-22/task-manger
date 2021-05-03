import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v1 as uuid} from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { Task } from './tasks.entity';
import { TaskStatus } from './task.status.enum';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRespository :TaskRepository,
    ){}

    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]>{
        return this.taskRespository.getTasks(filterDto)
    }
    

    async getTaskById(id: number): Promise<Task>{
        const found =  await this.taskRespository.findOne(id)
        if (!found){
            throw new NotFoundException("Task with id not found")
        }
        return found
    }

    async createTask(createTaskDto: CreateTaskDto): Promise <Task>{
       return this.taskRespository.createTask(createTaskDto)
    }

    async deleteTask(id:number): Promise<void>{
        const result =  await this.taskRespository.delete(id)
        if (!result.affected){
            throw new NotFoundException("Task with id not found")
        }
    }

    async updateTask(id: number, status: TaskStatus): Promise<Task>{
        let taskToUpdate = await this.getTaskById(id)
        taskToUpdate.status = status
        await taskToUpdate.save()
        return taskToUpdate
    }
}
