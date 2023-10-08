import { Pipe, PipeTransform } from '@angular/core';
import { ListItem } from 'carbon-components-angular';
import { Column } from '../../services/column.service';

@Pipe({ name: 'columnsToListItem', standalone: true })
export class ColumnsToListItemPipe implements PipeTransform {
  transform(
    columns: Column[],
    fieldKey: keyof Column,
    selectedId: string
  ): ListItem[] {
    return columns.map((column) => ({
      columnId: column.id,
      content: column[fieldKey],
      selected: selectedId === column.id
    }));
  }
}

// type BasedListItem = Pick<ListItem, 'content' | 'selected'>;
// const BetterListItem = <T extends Record<string, unknown>>(
//   items: BasedListItem & T
// ): BasedListItem & T => items;
