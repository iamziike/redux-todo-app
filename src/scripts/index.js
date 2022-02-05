import anime from 'animejs';

import '../styles/index.scss';
import {
  ADD,
  DELETE,
  attachSubscription,
  dispatchAction,
  getStoreState,
} from './store/taskStore';

const NONE = 'NONE';

const isLoading = {
  value: false,
  lastAction: NONE,
};

const getWeekDay = () => {
  const date = new Date();

  const dateDayElement = document.querySelector('.date');
  dateDayElement.textContent = date.toLocaleString('en-US', {
    weekday: 'long',
  });
};
getWeekDay();

const taskForm = document.querySelector('.task-form');
taskForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (isLoading.value) return;
  isLoading.value = true;
  isLoading.lastAction = ADD;

  const taskInputValue = taskForm.taskInput.value.trim();
  if (taskInputValue.length < 2) return;

  const action = {
    type: ADD,
    value: taskInputValue,
  };

  dispatchAction(action);
  taskForm.reset();
});

const attachExitEvent = (control, targets, onComplete) => {
  control.addEventListener('click', () => {
    if (isLoading.value) return;
    isLoading.value = true;
    isLoading.lastAction = DELETE;

    anime({
      targets: targets,
      translateX: '100vw',
      complete() {
        onComplete();
      },
      duration: 1500,
      easing: 'easeInElastic(1, .6)',
    });
  });
};

const renderTask = (tasks) => {
  const taskOutput = document.querySelector('.task-output');
  const additionalClassNames = 'default-border-radius';

  tasks.forEach(({ value: descr, id }) => {
    const taskElement = document.createElement('div');
    taskElement.dataset.id = id;
    taskElement.className = 'task ' + additionalClassNames;

    const taskDescElement = document.createElement('p');
    taskDescElement.className = 'task-descr ' + additionalClassNames;
    taskDescElement.textContent = descr;

    const exitImageWrapper = document.createElement('div');
    const binSVG = `<?xml version="1.0" encoding="iso-8859-1"?>
    <!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
       viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
    <g>
      <g>
        <path d="M395.636,279.273h-23.273h-31.03v186.182v23.273V512h54.303c12.853,0,23.273-10.422,23.273-23.273V279.273H395.636z"/>
      </g>
    </g>
    <g>
      <g>
        <polygon points="217.212,279.273 217.212,465.455 217.212,488.727 217.212,512 294.788,512 294.788,488.727 294.788,465.455 
          294.788,279.273 		"/>
      </g>
    </g>
    <g>
      <g>
        <path d="M139.636,279.273h-23.273H93.091v209.455c0,12.851,10.42,23.273,23.273,23.273h54.303v-23.273v-23.273V279.273H139.636z"
          />
      </g>
    </g>
    <g>
      <g>
        <path d="M442.182,186.182h-23.273v-69.818c0-12.853-10.42-23.273-23.273-23.273h-38.788V23.273C356.849,10.42,346.429,0,333.576,0
          H178.424c-12.853,0-23.273,10.42-23.273,23.273v69.818h-38.788c-12.853,0-23.273,10.42-23.273,23.273v69.818H69.818
          c-12.853,0-23.273,10.418-23.273,23.273c0,12.851,10.42,23.273,23.273,23.273h23.273h23.273h23.273h31.03h46.545h77.576h46.545
          h31.03h23.273h23.273h23.273c12.853,0,23.273-10.422,23.273-23.273C465.455,196.6,455.035,186.182,442.182,186.182z
           M310.303,93.091H201.697V46.545h108.606V93.091z"/>
      </g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    </svg>`;
    exitImageWrapper.className = 'exit-image-wrapper';
    exitImageWrapper.innerHTML = binSVG;

    const onComplete = () => {
      const action = {
        type: DELETE,
        value: id,
      };

      isLoading.value = false;
      taskElement.remove();
      dispatchAction(action);
    };
    attachExitEvent(exitImageWrapper, taskElement, onComplete);

    taskElement.append(taskDescElement, exitImageWrapper);
    taskOutput.append(taskElement);

    if (isLoading.lastAction === NONE) {
      // stager aniamtion occurs during first rendering of tasks
      anime({
        targets: '.task',
        translateX: ['100vw', 0],
        delay: anime.stagger(500),
      });
      return;
    }

    anime({
      targets: taskElement,
      translateX: ['100vw', 0],
      complete() {
        isLoading.value = false;
      },
    });
  });
};
renderTask(getStoreState());

attachSubscription(() => {
  const tasks = getStoreState();
  if (isLoading.lastAction === ADD) renderTask([tasks[tasks.length - 1]]);
});
