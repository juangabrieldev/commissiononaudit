export const personalDataSheet = {
  personalInformation: {
    firstName: null,
    middleName: null,
    lastName: null,
    nameExtension: null, //Jr., III, etc.
    dateOfBirth: null,
    placeOfBirth: null,
    sex: null,
    civilStatus: null,
    height: null, //in meters
    weight: null, //in kg
    bloodType: null,
    gsisIdNo: null,
    pagIbigIdNo: null,
    philHealthIdNo: null,
    sssNo: null,
    tinNo: null,
    agencyEmployeeNo: null,
    citizenship: null,
    residentialAddress: {
      houseBlockLotNo: null,
      street: null,
      subdivisionVillage: null,
      barangay: null,
      cityMunicipality: null,
      province: null,
      zipCode: null
    },
    permanentAddress: {
      houseBlockLotNo: null,
      street: null,
      subdivisionVillage: null,
      barangay: null,
      cityMunicipality: null,
      province: null,
      zipCode: null
    },
    telephoneNo: null,
    mobileNo: null,
    emailAddress: null
  },
  familyBackground: {
    spouseLastName: null,
    spouseFirstName: null,
    spouseMiddleName: null,
    spouseNameExtension: null,
    nameOfChildren: [], //example['Juan Dela Cruz', 'Andres Bonifcation']
    fatherLastName: null,
    fatherFirstName: null,
    fatherMiddleName: null,
    fatherNameExtension: null,
    motherMaidenName: null,
    motherFirstName: null,
    motherMiddleName: null,
    motherNameExtension: null,
  },
  educationalBackground: {
    elementary: {
      nameOfSchool: null,
      basicEducationDegreeCourse: null,
      periodOfAttendance: {
        from: null,
        to: null
      },
      highestLevelUnitsEarned: null, //if not graduated. for example 'Third year'
      yearGraduated: null,
      scholarshipAcademicHonorsReceived: null
    },
    secondary: {
      nameOfSchool: null,
      basicEducationDegreeCourse: null,
      periodOfAttendance: {
        from: null,
        to: null
      },
      highestLevelUnitsEarned: null, //if not graduated. for example 'Third year'
      yearGraduated: null,
      scholarshipAcademicHonorsReceived: null
    },
    vocational: {
      nameOfSchool: null,
      basicEducationDegreeCourse: null,
      periodOfAttendance: {
        from: null,
        to: null
      },
      highestLevelUnitsEarned: null, //if not graduated. for example 'Third year'
      yearGraduated: null,
      scholarshipAcademicHonorsReceived: null
    },
    college: {
      nameOfSchool: null,
      basicEducationDegreeCourse: null, //this is id. accountancy is 23
      periodOfAttendance: {
        from: null,
        to: null
      },
      highestLevelUnitsEarned: null, //if not graduated. for example 'Third year'
      yearGraduated: null,
      scholarshipAcademicHonorsReceived: null
    },
    graduateStudies: {
      nameOfSchool: null,
      basicEducationDegreeCourse: null,
      periodOfAttendance: {
        from: null,
        to: null
      },
      highestLevelUnitsEarned: null, //if not graduated. for example 'Third year'
      yearGraduated: null,
      scholarshipAcademicHonorsReceived: null
    },
  },
  trainings: [],
  // example format
  // {
  //   name: null
  //   attendance: {
  //     from: null,
  //     to: null
  //   },
  //   numberOfHours: null,
  //   typeOfLd: null,
  //   conductedSponsoredBy: null
  // }
};
