const orderTask = requestAnimationFrame
    ? (fn) => requestAnimationFrame(fn)
    : (fn) => setTimeout(fn, 0);

export const Task = {
    order: orderTask // заказать выполнение функции на следующий цикл EventLoop
};