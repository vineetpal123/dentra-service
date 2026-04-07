1️⃣ Tenant (Clinic / Organization)
{
\_id: ObjectId,
name: "ABC Dental Clinic",
ownerId: ObjectId, // user
plan: "free | pro | enterprise",
createdAt: Date
}

2️⃣ User (Admin / Doctor / Staff)
{
\_id: ObjectId,
tenantId: ObjectId,

name: "Dr. John",
email: "john@gmail.com",
phone: "9999999999",

role: "admin | doctor | staff",
isApproved: true,

createdAt: Date
}

3️⃣ Patient

{
\_id: ObjectId,
tenantId: ObjectId,

name: "Rahul Sharma",
phone: "8888888888",
gender: "male",
age: 30,

createdBy: ObjectId, // staff/doctor
createdAt: Date
}

4️⃣ Appointment (Core Entity)
{
\_id: ObjectId,
tenantId: ObjectId,

patientId: ObjectId,
doctorId: ObjectId,

date: "2026-04-06",
startTime: "10:00",
endTime: "10:30",

status: "booked | cancelled | completed | no-show",

notes: "Follow-up visit",

createdAt: Date
}

5️⃣ Business Hours (Doctor Availability)
{
\_id: ObjectId,
tenantId: ObjectId,

doctorId: ObjectId,
day: "Monday",

startTime: "09:00",
endTime: "18:00",

slotDuration: 30
}

6️⃣ OTP / Auth (Optional)
{
\_id: ObjectId,
phone: "9999999999",
otp: "1234",
expiresAt: Date
}

🔗 Relationships (Important)
Tenant → Users (1:N)
Tenant → Patients (1:N)
Tenant → Appointments (1:N)
Doctor → Appointments (1:N)
Patient → Appointments (1:N)

Add indexes:
db.appointments.createIndex({ tenantId: 1, date: 1 });

🚀 Multi-Tenant Query Pattern

Every query MUST include:

{ tenantId: request.user.tenantId }
This prevents data leakage between clinics
