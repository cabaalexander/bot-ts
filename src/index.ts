import app from './api';

app.get('/', c => c.text('👋 Hello there!'));

export default app;
