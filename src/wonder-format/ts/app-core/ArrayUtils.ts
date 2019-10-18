export class ArrayUtils {

    /**
     * getRandom - взять n рандомных элементов из массива
     * исходный массив не меняется
     * @param arr
     * @param n
     */
    static getRandom<T>(arr: Array<T>, n: number = 1): Array<T> {
        let result = new Array(n),
            len = arr.length,
            taken = new Array(len);

        if (n > len)
            throw new RangeError("getRandom: more elements taken than available");

        while (n--) {
            let x = Math.floor(Math.random() * len);
            result[n] = arr[x in taken ? taken[x] : x];
            taken[x] = --len in taken ? taken[len] : len;
        }
        return result;
    }

    /**
     * pushUnique - поместить элемент в массив, только если его там нет
     */
    static pushUnique<T>(arr: Array<T>, el: T): Array<T> {
        if (arr.indexOf(el) < 0) arr.push(el);
        return arr;
    }

    static removeChild<T>(arr: Array<T>, el: T) {
        const index = arr.indexOf(el);
        if (index > -1) {
            arr.splice(index, 1);
        }
    }

    static remove<T>(arr: Array<T>, index: number): T {
        if (index > -1) {
            return arr.splice(index, 1)[0];
        } else return null;
    }

    static removeLast<T>(arr: Array<T>, amount: number) {
        while (amount-- > 0) arr.pop();
    }

    /**
     * Перемешать массив, результат повторяется при каждом seed
     * @param arr
     * @param seed -
     */
    static shuffleWithSeed<T>(arr: Array<T>, seed: number = 17): Array<T> {
        let i: number, next: T, tmp: T;
        let length = arr.length;
        const seed2 = 31; // оба сида должны быть простыми числами
        let randomI: number;
        for (i = 0; i < length; i++) {
            randomI = (seed * i + seed2) % length;
            tmp = arr[randomI];
            arr[randomI] = arr[i];
            arr[i] = tmp;
        }
        return arr;
    }

    /**
     *  перемешать массив, мутабельно
     */
    static shuffle<T>(arr: Array<T>, order: string = ArrayShuffleOrder.random): Array<T> {
        switch (order) {
            case ArrayShuffleOrder.same:
                return arr;
            case ArrayShuffleOrder.chaos:
                return arr.sort((a, b) => Math.random() - 0.5);
            case ArrayShuffleOrder.random:
                return ArrayUtils.shuffleWithSeed(arr, 13);
        }
    }

    /**
     *  применить массив args к arr с помощью applyFn
     * @param arr
     * @param args
     * @param applyFn
     * @param useLast - если true, то последний из args используется для всех оставшихся элементов массива,
     *          если аргументов меньше по длине, чем arr - последний args используется до конца
     *          если false - обработка заканчивается с последним указанным из args
     */
    static updateArray<S, T>(arr: Array<S>, args: Array<T>, applyFn: (el: S, arg: T) => void, useLast = true) {
        if (arr == null || args == null || args.length == 0) return;

        let next: T;
        let last: T;
        arr.forEach((el, i) => {
            next = i < args.length ? args[i] : last;
            applyFn(el, next);
            last = next;
        });
    }
}

// порядок карт в колоде
export enum ArrayShuffleOrder {
    random = "random", // случайный по исходнику, повторяющийся каждую игру
    same = "same",      // такой же как в исходнике
    chaos = "chaos",    // случайный каждую игру
}
