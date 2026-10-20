import { prisma } from "../../utils/prisma.js";
import { sendEmail } from "../../utils/emailService.js";
import {
  generateVerificationCode,
} from "../../utils/verificationCode.js";
import { hashPassword } from "../../utils/hashPassword.js";

const sendVerificationCode = async (email: string) => {
  const code = generateVerificationCode();
  const codeHash = await hashPassword(code);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await prisma.pendingRegistration.upsert({
    where: { email },
    create: {
      email,
      codeHash,
      expiresAt,
    },
    update: {
      codeHash,
      expiresAt,
      verifiedAt: null,
      attempts: 0,
    },
  });

  await sendEmail(
    email,
    "Verify your email - Course Platform",
    `Your verification code is: ${code}\nThis code expires in 5 minutes.`,
  );
};

export { sendVerificationCode };