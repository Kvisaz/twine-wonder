#Логика сохранений  ДОДЕЛАЙ

Wonder LifeCycle
- GameLogic.preload();
- GameLogic.onStoryLoad(story);
- GameLogic.onStateLoad(state:IAppState);

GameLogic.preload
- эмитит для GameView сообщение показать preload-passage
    - обычная страница с контентом loaded    
- запускает async парсинг истории с коллбэками resolve, reject


- получает спарсенную историю
- исполняет пользовательские скрипты в ней, игнорируя команды
    - save
    - load
    
- просит SaveApi загрузить последнюю игру и передаёт коллбэки resolve, reject

- останавливается

