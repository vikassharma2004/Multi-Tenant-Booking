import { emailQueue } from './../queue/emailqueue.js';

export const sendOtpEmail = async (user, otp) => {
  await emailQueue.add('sendOtp', {
    to: user.email,
    subject: 'Your OTP code',
    html: `<p>Your OTP is <b>${otp}</b></p>`
  });
};
