import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import { TrackersService } from './trackers/trackers.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));

  app.enableCors({
    origin: '*', // Allow all origins (for development only, consider restricting in production)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
  });

  await app.listen(process.env.PORT ?? 3000);
  const trackersService =
    app.get(TrackersService);
  setInterval(async () => {
    await trackersService.updateOfflineTrackers();
    console.log('Checked tracker statuses');
  }, 30000);// Check every 30 seconds
}
bootstrap();
