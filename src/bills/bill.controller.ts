import { Request, Response, NextFunction, Router } from 'express';
import BillNotFoundException from '../exceptions/BillNotFoundException';
import DuplicateBillException from '../exceptions/DuplicateBillException';
import Controller from '../interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import CreateBillDto from './bill.dto';
import CreateBillQueryDto from './billQuery.dto';

class BillController implements Controller {
  public path = '/items';
  public router = Router();
  private bills = [    //dummy data for testing and demo 
    {patient_name: "Peter", 
    patient_address: "New York City",
    hospital: "Mount Sinai",
    date: "2023-02-15",
    amount: "$100.00"}
  ]; 

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getBills);
    this.router.get(`${this.path}/:search`, validationMiddleware(CreateBillQueryDto), this.getBillsByNameAndAddress);
    this.router.post(this.path, validationMiddleware(CreateBillDto), this.createBill);
  }

  private getBills = async (request: Request, response: Response, next: NextFunction) => {
    response.json(this.bills)
  }

  private getBillsByNameAndAddress = async (request: Request, response: Response, next: NextFunction) => {
    const { patient_name, patient_address } = request.body
    const matches = this.bills.filter(
      o => {return (o.patient_name.toLowerCase() == patient_name.toLowerCase() 
        && o.patient_address.toLowerCase() == patient_address.toLowerCase())})

    if(matches.length === 0){
      next(new BillNotFoundException(patient_name, patient_address));
    }
    else{
      response.json(matches)
    }
  }

  private createBill = async (request: Request, response: Response, next: NextFunction) => {
    const { patient_name, patient_address, hospital, date, amount } = request.body

    const duplicate = this.bills.filter(
      Obj => {return (Obj.patient_name.toLowerCase() == patient_name.toLowerCase() 
        && Obj.patient_address.toLowerCase() == patient_address.toLowerCase())
        && Obj.hospital.toLowerCase() == hospital.toLowerCase()
        && Obj.date == date && Obj.amount == amount})
    
    if (duplicate && duplicate.length){
      next(new DuplicateBillException());

    } else {
      const newBill = request.body
      this.bills.push(newBill);
      response.json(newBill);
    }
  }

  public clearBills() {
    this.bills = [] 
  }
}

export default BillController;