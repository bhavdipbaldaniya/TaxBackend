const StandardDeduction = require("../models/StandarizedDeduction.model")
const { ErrorHandler, ResponseOk } = require('../services/ResponseServices');
const mongoose = require('mongoose');


const SocialSecurityBenifit = async (req,res) =>{

    try {
        let SocialSecurityIncome = req.body.SocialSecurityIncome;
        let CombineIncome = req.body.CombineIncome;
        let MaritalStatus = req.body.MaritalStatus;

        let halfOfLine1 = SocialSecurityIncome / 2; 
        console.log("hey Half Of Line 1", halfOfLine1);
        let line4 = 0;
        let line5 = 0;
        let line6 = halfOfLine1 + CombineIncome + line4 + line5;

        console.log("hey line 6",line6)

        let line7 = 0;
        console.log("hey line 7",line7)

        let line8;

        if(line7 <= line6){
            line8 = Math.abs(line7 - line6);
        }else{
            line8 = 0;
        }
        console.log("line8 ",line8);

        let line9;
       console.log("poiu",MaritalStatus)
        if(MaritalStatus == "Married Filling Jointly"){
            line9 = 32000;
        }else{
            line9 = 25000;
        }
        console.log("line9 ",line9);

        let line10;
        if(line9 <= line8){
            line10 = Math.abs(line9 - line8);
        }else{
            line10 = 0;
        }
        console.log("line10 ",line10);

        let line11;
        if(MaritalStatus == "Married Filling Jointly"){
            line11 = 12000;
        }else{
            line11 = 9000;
        }
        console.log("line11 ",line11);

        let line12;
        line12 = Math.abs(line11 - line10);
        console.log("line12 ",line12);

        let line13 = Math.min(line10,line11)
        console.log("line13 Smaller",line13);

        let line14 = line13 / 2;
        console.log("line14",line14);

        let line15 = Math.min(line14,halfOfLine1)
        console.log("line15 Smaller",line15);

        let line16;
        if(line12 == 0){
            line16 = 0;
        }else{
            line16 = line12 * 0.85
        }
        console.log("line16 ",line16);

        let line17 = line15 + line16;
        console.log("line17",line17);


        let line18 = SocialSecurityIncome * 0.85;
        console.log("line18",line18);

        let line19 = Math.min(line17,line18)
        console.log("line19 Smaller final",line19);


        const Data = {
            LINE1 : SocialSecurityIncome,
            LINE2 : halfOfLine1,
            LINE3 : CombineIncome,
            LINE4 : line4,
            LINE5 : line5,
            LINE6 : line6,
            LINE7 : line7,
            LINE8 : line8,
            LINE9 : line9,
            LINE10 : line10,
            LINE11 : line11,
            LINE12 : line12,
            LINE13 : line13,
            LINE14 : line14,
            LINE15 : line15,
            LINE16 : line16,
            LINE17 : line17,
            LINE18 : line18,
            LINE19 : line19
        }

        console.log("hey final data ",Data)
        return ResponseOk(res, 'Social Security Calculator Details', Data);
    } catch (error) {
        console.log("error", error);
        return ErrorHandler(res, error);

    }
}


module.exports = {
    SocialSecurityBenifit
}