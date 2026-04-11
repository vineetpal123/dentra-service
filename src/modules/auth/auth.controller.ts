import { FastifyReply, FastifyRequest } from 'fastify';

import { ERROR_CODES } from '../../constants/errorCodes';
import { generateToken } from '../../utils/jwt';
import { errorResponse, successResponse } from '../../utils/response';
import { User } from '../users/models/user.model';
import { Otp } from './models/otp.model';
import { Tenant } from './models/tenant.model';
import { SendOtpInput } from './schemas/sendOtp.schema';
import { VerifyOtpInput } from './schemas/verifyOtp.schema';

export const sendOtp = async (
  request: FastifyRequest<{ Body: SendOtpInput }>,
  reply: FastifyReply,
) => {
  try {
    const { mobile } = request.body;

    if (!mobile) {
      return reply
        .status(400)
        .send(errorResponse('Mobile is required', ERROR_CODES.MOBILE_REQUIRED));
    }

    //const otp = generateOtp();
    const otp = '1234';

    await Otp.findOneAndUpdate(
      { mobile },
      {
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
      { upsert: true },
    );

    console.log('OTP:', otp);

    return reply.send(successResponse('OTP sent successfully'));
  } catch (err) {
    return reply.status(500).send(errorResponse('Server error', ERROR_CODES.SERVER_ERROR));
  }
};

export const verifyOtp = async (
  request: FastifyRequest<{ Body: VerifyOtpInput }>,
  reply: FastifyReply,
) => {
  try {
    const { mobile, otp } = request.body;

    const otpRecord: any = await Otp.findOne({ mobile });

    if (!otpRecord) {
      return reply.status(400).send(errorResponse('OTP not found', ERROR_CODES.OTP_NOT_FOUND));
    }

    if (otpRecord.otp !== otp) {
      return reply.status(400).send(errorResponse('Invalid OTP', ERROR_CODES.INVALID_OTP));
    }

    if (otpRecord.expiresAt < new Date()) {
      return reply.status(400).send(errorResponse('OTP expired', ERROR_CODES.OTP_EXPIRED));
    }

    let user = await User.findOne({ mobile });

    let tenant;

    if (!user) {
      tenant = await Tenant.create({
        name: 'My Clinic',
      });

      user = await User.create({
        mobile,
        tenantId: tenant._id,
        role: 'admin',
        isApproved: true,
        isDeleted: false,
      });
      tenant.ownerId = user._id;
      await tenant.save();
    }

    const token = generateToken(user);

    return reply.send(
      successResponse('Login successful', {
        token,
        user,
      }),
    );
  } catch (err) {
    return reply.status(500).send(errorResponse('Server error', ERROR_CODES.SERVER_ERROR));
  }
};
