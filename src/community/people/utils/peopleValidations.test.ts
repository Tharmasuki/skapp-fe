import { LeaveDurationTypes } from "~community/leave/enums/LeaveTypeEnums";

import {
  employeeEmploymentDetailsValidation,
  employeeEntitlementsDetailsValidation,
  employeeGeneralDetailsValidation,
  employeePrimaryEmergencyContactDetailsValidation,
  employeeSecondaryEmergencyContactDetailsValidation,
  quickAddEmployeeValidations
} from "./peopleValidations";

const translator = (suffixes: string[]) => suffixes[0];

describe("Emergency Contact Validation", () => {
  describe("Primary Emergency Contact", () => {
    const schema = employeePrimaryEmergencyContactDetailsValidation(translator);

    it("should validate valid primary emergency contact details", async () => {
      const validData = {
        name: "John Doe",
        relationship: "Father",
        phone: "1234567890"
      };
      await expect(schema.validate(validData)).resolves.toBeTruthy();
    });

    it("should reject invalid name format", async () => {
      const invalidData = {
        name: "123",
        relationship: "Father",
        phone: "1234567890"
      };
      await expect(schema.validate(invalidData)).rejects.toThrow();
    });

    it("should reject phone number that is too short", async () => {
      const invalidData = {
        name: "John Doe",
        relationship: "Father",
        phone: "123"
      };
      await expect(schema.validate(invalidData)).rejects.toThrow();
    });
  });

  describe("Secondary Emergency Contact", () => {
    const schema =
      employeeSecondaryEmergencyContactDetailsValidation(translator);

    it("should validate complete valid data", async () => {
      const validData = {
        name: "John Doe",
        relationship: "Father",
        phone: "1234567890"
      };
      await expect(schema.validate(validData)).resolves.toBeTruthy();
    });

    it("should require all fields if name is provided", async () => {
      const partialData = { name: "John Doe", relationship: "", phone: "" };
      await expect(schema.validate(partialData)).rejects.toThrow();
    });

    it("should require all fields if relationship is provided", async () => {
      const partialData = { name: "", relationship: "Father", phone: "" };
      await expect(schema.validate(partialData)).rejects.toThrow();
    });

    it("should reject invalid phone format", async () => {
      const invalidData = {
        name: "John Doe",
        relationship: "Father",
        phone: "123"
      };
      await expect(schema.validate(invalidData)).rejects.toThrow();
    });

    it("should reject invalid name format", async () => {
      const invalidData = {
        name: "@1gf02",
        relationship: "Father",
        phone: "123"
      };
      await expect(schema.validate(invalidData)).rejects.toThrow();
    });
  });
});

describe("General Details Validation", () => {
  const schema = employeeGeneralDetailsValidation(translator);

  it("should validate valid general details", async () => {
    const validData = {
      firstName: "John",
      lastName: "Doe",
      middleName: "Smith",
      gender: "Male",
      birthDate: new Date().toISOString(),
      nationality: "US",
      nin: "ABC123",
      passportNumber: "PASS123",
      maritalStatus: "Single"
    };
    await expect(schema.validate(validData)).resolves.toBeTruthy();
  });

  it("should reject missing required fields", async () => {
    const invalidData = { firstName: "", lastName: "" };
    await expect(schema.validate(invalidData)).rejects.toThrow();
  });

  it("should validate NIN format", async () => {
    const invalidData = {
      firstName: "John",
      lastName: "Doe",
      nin: "@invalid#"
    };
    await expect(schema.validate(invalidData)).rejects.toThrow();
  });
});

describe("Employment Details Validation", () => {
  const context = {
    isUniqueEmployeeNo: true,
    isUniqueEmail: true,
    isUpdate: false
  };

  const schema = employeeEmploymentDetailsValidation(context, translator);

  it("should validate valid employment details", async () => {
    const validData = {
      employeeNumber: "EMP123",
      workEmail: "test@example.com",
      employmentAllocation: "Full-time",
      teams: ["Team A"],
      joinedDate: new Date().toISOString(),
      workTimeZone: "UTC"
    };
    await expect(schema.validate(validData)).resolves.toBeTruthy();
  });

  it("should reject invalid email format", async () => {
    const invalidData = {
      employeeNumber: "EMP123",
      workEmail: "invalid-email"
    };
    await expect(schema.validate(invalidData)).rejects.toThrow();
  });
});

describe("Entitlements Details Validation", () => {
  const leaveTypesList = [
    {
      value: "1",
      label: "Full Day",
      leaveDuration: LeaveDurationTypes.FULL_DAY
    },
    {
      value: "2",
      label: "Half Day",
      leaveDuration: LeaveDurationTypes.HALF_DAY
    }
  ];
  const schema = employeeEntitlementsDetailsValidation(
    leaveTypesList,
    translator
  );

  it("should validate valid entitlements", async () => {
    const validData = {
      year: "2024",
      leaveType: "1",
      numDays: 10,
      effectiveFrom: "2024-01-01",
      expirationDate: "2024-12-31"
    };
    await expect(schema.validate(validData)).resolves.toBeTruthy();
  });

  it("should reject invalid number of days", async () => {
    const invalidData = {
      year: "2024",
      leaveType: "1",
      numDays: 366,
      effectiveFrom: "2024-01-01"
    };
    await expect(schema.validate(invalidData)).rejects.toThrow();
  });

  it("should validate half-day duration for appropriate leave types", async () => {
    const data = {
      year: "2024",
      leaveType: "2",
      numDays: 10.5,
      effectiveFrom: "2024-01-01"
    };
    await expect(schema.validate(data)).resolves.toBeTruthy();
  });
});

describe("Quick Add Employee Validation", () => {
  const schema = quickAddEmployeeValidations(translator);

  it("should validate valid quick add data", async () => {
    const validData = {
      firstName: "John",
      lastName: "Doe",
      workEmail: "john.doe@example.com"
    };
    await expect(schema.validate(validData)).resolves.toBeTruthy();
  });

  it("should reject invalid name characters", async () => {
    const invalidData = {
      firstName: "John123",
      lastName: "Doe",
      workEmail: "john.doe@example.com"
    };
    await expect(schema.validate(invalidData)).rejects.toThrow();
  });
});
