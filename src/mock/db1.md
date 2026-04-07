✅ Final Design (Recommended)
🔹 1. First User = Tenant Creator (Admin)

Flow:
Enter Mobile → Verify OTP
↓
User exists? → NO
↓
Create User
Create Tenant
Assign role = ADMIN

👉 Yes — first user becomes Admin

🔹 2. Same User Table for Everyone

Doctors, staff, admin — all are users

{
\_id,
phone,
tenantId,
role: "admin | doctor | staff",
isApproved: true/false
}

🔄 3. How Doctor/Staff Login Works
Case 1: Existing user (doctor/staff)

Enter mobile → Verify OTP
↓
User exists → YES
↓
Return JWT with role + tenantId

👉 Role defines access

Case 2: New mobile number

Enter mobile → Verify OTP
↓
User exists → NO
↓
Create user as ADMIN + new tenant

⚠️ IMPORTANT RULE

👉 No random user can join a tenant automatically

Doctors/staff must be:

Created by Admin → then login allowed

👨‍⚕️ 4. How Admin Adds Doctor/Staff

Admin → Create User (doctor/staff)

{
phone: "9999999999",
role: "doctor",
tenantId: admin.tenantId,
isApproved: true
}

🔐 5. Role-Based Access (How You Differentiate)
Inside JWT:

{
userId,
tenantId,
role
}

In API:

if (request.user.role !== 'admin') {
return reply.code(403).send({
success: false,
errors: [{ code: 'FORBIDDEN', message: 'Access denied' }]
});
}

🧩 6. Access Matrix (Simple Version)

| Feature          | Admin | Doctor | Staff |
| ---------------- | ----- | ------ | ----- |
| Dashboard        | ✅    | ✅     | ✅    |
| Add Doctor       | ✅    | ❌     | ❌    |
| Create Patient   | ✅    | ✅     | ✅    |
| Book Appointment | ✅    | ✅     | ✅    |
| Settings         | ✅    | ❌     | ❌    |

🧠 Key Clarification (Your Confusion Point)

“Does one clinic have only one admin?”

👉 No — you can have multiple admins

role: "admin"

⚡ Better Model (Future Ready)

Instead of single role:

roles: ["admin"]

👉 Later you can support:

multi-role users
permissions system
🚨 Edge Case You Must Handle
❗ What if unknown user logs in?

👉 DO NOT auto-create tenant blindly in production

Better approach:

💡 My Recommendation (For You)

Since you're building MVP:

👉 Go with:

First login → create tenant + admin
Admin adds users manually

👉 Keep it simple

🔄 Final Flow Summary
New user → OTP → Create Tenant + Admin

Admin →
Add doctor/staff

Doctor/Staff →
Login → Use system (limited access)
