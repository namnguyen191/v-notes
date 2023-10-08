import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../../services/task.service';

@Pipe({ name: 'filterTasks', standalone: true })
export class FilterTasksPipe implements PipeTransform {
  transform(tasks: Task[], columnId: null | string = null): Task[] {
    if (!columnId) {
      return [];
    }

    const filteredTasks = tasks.filter((task) => task.boardColumn === columnId);

    return filteredTasks;
  }
}
