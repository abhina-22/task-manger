import { Test } from "@nestjs/testing";
import { TaskRepository } from "./task.repository";
import { TasksService } from "./tasks.service";
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from "./task.status.enum";
import { NotFoundException } from '@nestjs/common';

const mockTaskRespository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn()
});

const mockUser = {
    username:'test user',
    id: 12
};

const mockTask = { 
    title: 'test title',
    description: 'test desc'
};

describe('TasksService', ()=>{
    let tasksService;
    let taskRepository;

    beforeEach(async ()=>{
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TaskRepository, useFactory: mockTaskRespository}
            ],
        }).compile();
        
        tasksService = await module.get<TasksService>(TasksService);
        taskRepository = await module.get<TaskRepository>(TaskRepository);
    });

    describe('getTasks', ()=>{
        it('get all tasks from task respository', async () => {
            taskRepository.getTasks.mockResolvedValue('some value')

            expect(taskRepository.getTasks).not.toHaveBeenCalled()
            const filters:GetTasksFilterDto = { status:TaskStatus.IN_PROGRESS, search: 'some search query'}
            const result = await tasksService.getTasks(filters, mockUser) 
            expect(taskRepository.getTasks).toHaveBeenCalled()
            expect(result).toEqual('some value')
        });
    });

    describe('getTaskById', () => {
        it('calls taskRespository.findOne() and successfully retrieves the tasl', async ()=>{
            taskRepository.findOne.mockResolvedValue(mockTask)
            const result = await tasksService.getTaskById(1, mockUser)
            expect(result).toEqual(mockTask)
            expect(taskRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: 1,
                    userId: mockUser.id
                }
            })
        });
        it('throws an error when task is not found', ()=>{
            taskRepository.findOne.mockResolvedValue(null)
            expect(tasksService.getTaskById(1,mockUser)).rejects.toThrow(NotFoundException)
        });
    })

    describe('createTask', () => {
        it('calls taskRespository.createTask() and successfully returs the new task', async ()=>{
            taskRepository.createTask.mockResolvedValue('some task')
            const result = await tasksService.createTask(mockTask, mockUser)
            expect(result).toEqual('some task')
            expect(taskRepository.createTask).toHaveBeenCalledWith(
               mockTask, mockUser
            )
        });
    })

    describe('deleteTask', () => {
        it('calls taskRespository.deleteTask() to delete a task', async ()=>{
            taskRepository.delete.mockResolvedValue({affected: 1})
            await tasksService.deleteTask(1, mockUser)
            expect(taskRepository.delete).toHaveBeenCalledWith({
                id: 1, userId: mockUser.id
            })
        });

        it('throws an error when task is not found', ()=>{
            taskRepository.delete.mockResolvedValue({affected: 0})
            expect(tasksService.deleteTask(1,mockUser)).rejects.toThrow(NotFoundException)
        });
    })

    describe('updateTask', () => {
        it('calls taskServie.getTaskById() and updates the task status', async ()=>{
            tasksService.getTaskById = jest.fn().mockResolvedValue({
                status: 'IN PROGRESS',
                save: jest.fn().mockResolvedValue(true)
            })
            const result = await tasksService.updateTask(1, 'DONE', mockUser)
            expect(result.status).toEqual('DONE')
        });
    })
});
