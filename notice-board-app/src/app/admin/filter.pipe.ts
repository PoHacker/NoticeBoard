import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items) return [];
        if (!searchText) return items;
        searchText = searchText.toLowerCase();
        return items.filter(it => {
            const value = Object.values(it);
            for (let val in value) {
                if (value[val] ? value[val].toString().toLocaleLowerCase().includes(searchText) : false) {
                    return it;
                }
            }
        });
    }
}