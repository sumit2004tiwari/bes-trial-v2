import otpGenerator from "otp-generator";
export default function uniqueIdGenerator(length=4){
    let id = otpGenerator.generate(length, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: true,
        specialChars: false,
      });
     return id
      
}