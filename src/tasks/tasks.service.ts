import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v1 as uuid} from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { Task } from './tasks.entity';
import { TaskStatus } from './task.status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRespository :TaskRepository,
    ){}

    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]>{
        return this.taskRespository.getTasks(filterDto, user)
    }
    

    async getTaskById(id: number, user: User): Promise<Task>{
        const found =  await this.taskRespository.findOne({where: {id, userId: user.id}})
        if (!found){
            throw new NotFoundException("Task with id not found")
        }
        return found
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise <Task>{
       return this.taskRespository.createTask(createTaskDto, user)
    }

    async deleteTask(id:number,  user: User): Promise<void>{
        const result =  await this.taskRespository.delete({id, userId: user.id})
        if (!result.affected){
            throw new NotFoundException("Task with id not found")
        }
    }

    async updateTask(id: number, status: TaskStatus, user: User): Promise<Task>{
        let taskToUpdate = await this.getTaskById(id, user)
        taskToUpdate.status = status
        await taskToUpdate.save()
        return taskToUpdate
    }
}
