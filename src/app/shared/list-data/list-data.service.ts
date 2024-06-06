import { Injectable } from "@angular/core";

@Injectable()
export class ListDataService {
  searchCaches: SearchCache[] = [];

  findOrCreate(page: string): number {
    let index: number = null;

    this.searchCaches.forEach((searchCache, i) => {
      if(page == searchCache.page) {
        index = i;
        return;
      }
    })

    if(index != null) return index;

    let searchCache = new SearchCache();
    searchCache.page = page;
    searchCache.index = 0;
    searchCache.searchValue = {};

    this.searchCaches.push(searchCache)
    return this.searchCaches.length - 1
  }

  getIndex(page: string): number {
    let arrayIndex: number = this.findOrCreate(page);
    return this.searchCaches[arrayIndex].index;
  }

  getSearchValue(page: string): any {
    let arrayIndex: number = this.findOrCreate(page);
    return this.searchCaches[arrayIndex].searchValue;
  }

  saveIndex(page: string, index: number) {
    let arrayIndex: number = this.findOrCreate(page);
    let searchCache = this.searchCaches[arrayIndex];
    searchCache.index = index;

    this.searchCaches[arrayIndex] = searchCache;
  }

  saveSearchValue(page: string, searchValue) {
    let arrayIndex: number = this.findOrCreate(page);
    let searchCache = this.searchCaches[arrayIndex];
    searchCache.searchValue = searchValue;

    this.searchCaches[arrayIndex] = searchCache;
  }
}

export class SearchCache {
  page: string
  index: number
  searchValue = {}
}
