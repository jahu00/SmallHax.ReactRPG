export function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

export function getRandomItem<T>(array: Array<T>) {
    if (array.length === 0) {
        throw new Error("Array is empty");
    }
    const i = getRandomInt(array.length);
    return array[i];
}