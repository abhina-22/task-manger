import {  BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../task.status.enum";



export class TaskStatusValidationPipe implements PipeTransform{
    readonly allowedStatuses = [
        TaskStatus.DONE,
        TaskStatus.IN_PROGRESS,
        TaskStatus.OPEN
    ]

    private isStatusValid(status: any){
        const ind = this.allowedStatuses.indexOf(status)
        return ind !== -1
    }

    transform(value: any){
        value = value.toUpperCase()
        if (!this.isStatusValid(value)){
            throw new BadRequestException('The status value is invalid')
        }
        return value;
    }
}