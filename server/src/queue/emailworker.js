import { Worker } from 'bullmq';
import { sendEmail } from './emailService.js';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL);

new Worker('emailQueue', async job => {
  const { to, subject, html } = job.data;
  await sendEmail(to, subject, html);
}, { connection });
