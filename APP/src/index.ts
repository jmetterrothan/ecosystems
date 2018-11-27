import Main from './app/Main';

const app = new Main();

const run = async () => {
  await app.init();
  app.run();
};

run();
