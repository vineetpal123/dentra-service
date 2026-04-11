# 📅 Appointment Module – Functional Logic Document

## 🧠 Purpose

This document explains the **business logic** behind:

- Creating an appointment
- Updating (rescheduling/completing) an appointment

It focuses on **what the system does**, not how the code works.

---

# ➕ CREATE APPOINTMENT — What Happens?

The Create Appointment flow is designed to handle **real-world clinic scenarios**, where:

- Patient may or may not exist
- Doctor may not be assigned yet
- Time slot may not be decided

---

## 1. Identify the Patient

When a request comes in:

### Case A: Patient already exists

- If a patient ID is provided → system uses that patient

### Case B: Patient is new

- If no patient ID is provided:
  - System checks if a patient with the same phone (or name) already exists
  - If found → reuse existing patient
  - If not found → create a new patient

👉 This ensures:

- No duplicate patients
- Clean and consistent data

---

## 2. Determine Appointment Type

The system decides whether the appointment is:

### 🟡 Draft Appointment

- Created when:
  - Doctor is not assigned
  - OR time is not selected

👉 Represents:

- Walk-in entries
- Incomplete bookings

---

### 🟢 Booked Appointment

- Created when:
  - Doctor + Date + Time are all provided

👉 Represents:

- Confirmed appointment

---

## 3. Check Slot Availability (Only for Booked)

If the appointment is being booked:

- System checks if the doctor already has an appointment at the same time
- If yes → booking is rejected
- If no → booking proceeds

👉 Ensures:

- No double booking
- Proper scheduling

---

## 4. Create Appointment Record

Finally, the system stores:

- Patient reference
- Doctor (optional)
- Date & time (optional)
- Status (draft or booked)
- Tenant (clinic) information

---

## 🎯 Result of Create Flow

| Input Situation         | Outcome               |
| ----------------------- | --------------------- |
| Only patient info       | Draft appointment     |
| Patient + doctor + time | Booked appointment    |
| New patient             | Created automatically |
| Existing patient        | Reused                |

---

# ✏️ UPDATE APPOINTMENT — What Happens?

The Update flow is used to:

- Complete a draft booking
- Reschedule an appointment
- Modify details

---

## 1. Identify the Appointment

- System fetches appointment using ID
- Ensures it belongs to the same tenant (clinic)

---

## 2. Detect If Rescheduling

If update includes:

- Doctor
- Date
- Time

👉 Then system treats it as a **reschedule or booking action**

---

## 3. Check Slot Availability Again

Before updating:

- System checks if the new time slot is already booked
- Excludes the current appointment from this check

👉 Prevents:

- Double booking during reschedule

---

## 4. Update Appointment Status

If doctor + date + time are now present:

- Status is automatically changed to **Booked**

### Status Transition:

| From  | To     |
| ----- | ------ |
| Draft | Booked |

---

## 5. Save Updated Data

System updates:

- Doctor assignment
- Time/date
- Notes or other fields

---

## 🎯 Result of Update Flow

| Scenario                   | Outcome               |
| -------------------------- | --------------------- |
| Add doctor & time to draft | Becomes booked        |
| Change time                | Checked for conflicts |
| Update details             | Saved normally        |
| Invalid appointment        | Error returned        |

---

# 🔄 Appointment Lifecycle

Appointments move through these stages:

### 🟡 Draft

- Created without full details

### 🟢 Booked

- Fully confirmed with doctor & time

### 🔵 Completed

- Appointment finished

### 🔴 Cancelled

- Appointment cancelled

### ⚫ No-show

- Patient did not arrive

---

# ✅ Key Design Principles

## 1. Flexibility

- Supports incomplete bookings
- Allows gradual updates

---

## 2. Data Integrity

- Prevents duplicate patients
- Prevents double booking

---

## 3. Real-World Workflow Support

| Scenario            | Supported |
| ------------------- | --------- |
| Walk-in patient     | ✅        |
| Book later          | ✅        |
| Assign doctor later | ✅        |
| Reschedule          | ✅        |

---

## 4. Multi-Tenant Safety

- All data is isolated per clinic

---

# ⚠️ Current Limitations

The system currently does NOT handle:

### 1. Doctor Availability

- Does not check working hours or leaves

### 2. Time Overlap

- Only exact time conflicts are checked
- Overlapping slots are not handled

### 3. Time Validation

- Past dates not restricted
- Invalid time ranges not validated

---

# 🚀 Future Improvements

To make the system fully production-grade:

- Doctor availability & working hours
- Slot generation system
- Overlap detection
- Calendar view (day/week)
- Appointment reminders

---

# 🧠 Final Summary

### CREATE APPOINTMENT

→ Handles patient creation + decides draft vs booked + checks conflicts

### UPDATE APPOINTMENT

→ Completes or modifies booking safely with validation

---

This design ensures your system behaves like a **real clinic appointment system**, not just a CRUD API.

---
