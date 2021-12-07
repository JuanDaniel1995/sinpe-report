import { Telegraf } from 'telegraf';
import axios from 'axios';

const start = async () => {
  if (!process.env.TELEGRAM_BOT_API_KEY) throw new Error('TELEGRAM_BOT_API_KEY must be defined');
  const botApiKey = process.env.TELEGRAM_BOT_API_KEY;
  const bot = new Telegraf(botApiKey);
  bot.on('photo', async (ctx) => {
    try {
      console.log(ctx.message.photo);
      const { file_id } = ctx.message.photo[2];
      const { data: fileMetadata } = await axios.get(`https://api.telegram.org/bot${botApiKey}/getFile?file_id=${file_id}`);
      const { result } = fileMetadata;
      const photoURL = `https://api.telegram.org/file/bot${botApiKey}/${result.file_path}`;
      const response = await axios.post(`http://localhost:3001/api/image`, { photoURL });
      ctx.reply('👍');
    } catch (err) {
      ctx.reply('Lo sentimos, hubo un error al procesar la imagen');
    }
  });
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
  bot.launch();
}

start();
