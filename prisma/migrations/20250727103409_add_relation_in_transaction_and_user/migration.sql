-- AddForeignKey
ALTER TABLE "dt_transaction" ADD CONSTRAINT "dt_transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "dt_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
