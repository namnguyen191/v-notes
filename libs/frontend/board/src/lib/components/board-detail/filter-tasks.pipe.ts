import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../../services/task.service';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
 */
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
