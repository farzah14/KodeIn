ALTER TABLE "PasswordResetToken" RENAME COLUMN "token" TO "tokenHash";

ALTER INDEX "PasswordResetToken_token_key" RENAME TO "PasswordResetToken_tokenHash_key";
