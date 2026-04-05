import { FastifyInstance } from "fastify";
import { sendOtp, verifyOtp } from "./auth.controller";


export default async function (fastify: FastifyInstance) {
  fastify.post("/send-otp", sendOtp);
  fastify.post("/verify-otp", verifyOtp);
}