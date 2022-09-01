"use strict";

const { Contract } = require("fabric-contract-api");

class StudentRecord extends Contract {
  constructor() {
    super("org.student-record-system.student");
  }

  async AddStudent(ctx, firstName, lastName, email, mobile, address, city) {
    // Create a new composite key for the new student account
    const studentKey = ctx.stub.createCompositeKey(
      "org.student-record-system.student",
      [firstName, lastName]
    );

    // Create a student object to be stored in blockchain
    let newStudentObject = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      mobile: mobile,
      address: address,
      city: city,
      studentId: ctx.clientIdentity.getID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Convert the JSON object to a buffer and send it to blockchain for storage
    let dataBuffer = Buffer.from(JSON.stringify(newStudentObject));
    await ctx.stub.putState(studentKey, dataBuffer);

    // Return value of new account created to user
    return newStudentObject;
  }

  async EditStudent(ctx, firstName, lastName, email, mobile, address, city) {
    const studentKey = ctx.stub.createCompositeKey(
      "org.student-record-system.student",
      [firstName, lastName]
    );

    //fetch student details from the ledger.
    let studentBuffer = await ctx.stub
      .getState(studentKey)
      .catch(err => console.log(err));

    let studentObject = JSON.parse(studentBuffer.toString());

    studentObject.email = email;
    studentObject.mobile = mobile;
    studentObject.address = address;
    studentObject.city = city;

    let studentDataBuffer = Buffer.from(JSON.stringify(studentObject));
    await ctx.stub.putState(studentKey, studentDataBuffer);

    return studentObject;
  }

  async AllStudents(ctx) {
    const allResults = [];

    const iterator = await ctx.stub.getStateByRange("", "");
    let result = await iterator.next();

    while (!result.done) {
      const strValue = Buffer.from(result.value.toString()).toString("utf8");
      let record;

      try {
        record = JSON.parse(strValue);
      } catch (err) {
        console.log(err);
        record = strValue;
      }
      allResults.push(record);
      result = await iterator.next();
    }
    return JSON.stringify(allResults);
  }

  async ViewAStudent(ctx, firstName, lastName) {
    const studentKey = ctx.stub.createCompositeKey(
      "org.student-record-system.student",
      [firstName, lastName]
    );

    let studentBuffer = await ctx.stub
      .getState(studentKey)
      .catch(err => console.log(err));

    if (studentBuffer) {
      let studentObject = JSON.parse(studentBuffer.toString());
      return studentObject;
    } else {
      throw new Error(
        "Student is not available in network, please cross check details"
      );
    }
  }
}

module.exports = StudentRecord;
