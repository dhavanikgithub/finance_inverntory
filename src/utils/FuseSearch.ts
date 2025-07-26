import Fuse from "fuse.js";

const baseFuseOptions = {
	isCaseSensitive: false,
	includeScore: false,
    shouldSort: true,
	threshold: 0.6,
};


function createFuseSearch<T>(data: T[], searchColumns: string[], options = baseFuseOptions): Fuse<T> {
    return new Fuse(data, {
        ...options,
        keys: searchColumns,
    });
}

function fuseSearch<T>(data: T[], searchTerm: string, searchColumns: any[], options = baseFuseOptions): T[] {
    if (!searchTerm) {
        return data;
    }
    const fuse = createFuseSearch(data, searchColumns, options);
    const results = fuse.search(searchTerm);
    return results.map(result => result.item);
}

export { createFuseSearch, fuseSearch, baseFuseOptions };