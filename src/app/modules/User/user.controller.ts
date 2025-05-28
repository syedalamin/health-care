import { Request, Response } from "express";
import { userServices } from "./user.service";

const createAdmin = async (req: Request, res: Response, ) => {
  try {
    const result = await userServices.createAdmin(req.file ,req.body);

    res.status(200).json({
      success: true,
      message: "Admin created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.name ||"Something went wrong", 
      error: err
    })
  }
};
const createDoctor = async (req: Request, res: Response, ) => {
  try {
  

    const result = await userServices.createDoctor(req.file ,req.body);


    res.status(200).json({
      success: true,
      message: "Doctor created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.name ||"Something went wrong", 
      error: err
    })
  }
};

const createPatient = async (req: Request, res: Response, ) => {
  try {


    const result = await userServices.createPatient(req.file ,req.body);


    res.status(200).json({
      success: true,
      message: "Patient created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.name ||"Something went wrong", 
      error: err
    })
  }
};



export const userController = {
  createAdmin,
  createDoctor,
  createPatient
};
