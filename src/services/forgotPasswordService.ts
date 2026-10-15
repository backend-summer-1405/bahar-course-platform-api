import { sendEmail } from "../utils/emailService.js";
import { hashPassword } from "../utils/hashPassword.js";
import { prisma } from "../utils/prisma.js";
import { generateVerificationCode } from "../utils/verificationCode.js";

const sendPasswordResetCode = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return;
  }

  const code = generateVerificationCode();
  const codeHash = await hashPassword(code);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await prisma.verificationCode.create({
    data: {
      codeHash,
      expiresAt,
      type: "PASSWORD_RESET",
      userId: user.id,
    },
  });

  await sendEmail(
    email,
    "Reset your password - Course Platform",
    `Your password reset code is: ${code}\nThis code expires in 5 minutes.`,
  );
};

export { sendPasswordResetCode };