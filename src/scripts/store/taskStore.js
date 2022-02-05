export const ADD = 'ADD';
export const DELETE = 'DELETE';
export const UPDATE = 'UPDATE';
const ITEMS = 'ITEMS';

import { createStore } from 'redux';

const taskReducer = (currentState, action) => {
  const { value, type } = action;
  if (type === ADD) {
    const newItem = { value, id: Math.random() };
    currentState = [...currentState, newItem];
  } else if (type === UPDATE) {
    currentState = currentState.map((task) => {
      if (task.id === value.id) return value;
      return task;
    });
  } else if (type === DELETE) {
    currentState = currentState.filter((task) => task.id !== value);
  }

  const currenStateJSON = JSON.stringify(currentState);
  localStorage.setItem(ITEMS, currenStateJSON);

  return currentState;
};

const initialStore = JSON.parse(localStorage.getItem(ITEMS) || '[]');
const store = createStore(taskReducer, initialStore);

export const dispatchAction = (action) => {
  store.dispatch(action);
};

export const attachSubscription = (callback) => {
  store.subscribe(callback);
};

export const getStoreState = () => {
  return store.getState();
};
