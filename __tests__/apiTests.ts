
import App from "../src/app";
import BillController from "../src/bills/bill.controller";
import CreateBillDto from "../src/bills/bill.dto";
import * as request from 'supertest';
 
//GET ENDPOINT

describe('no bills populated', () => {
  it('there should be no bills in memory initially', async () => {
    const billController = new BillController();
    const app = new App([billController]);
    billController.clearBills(); //clear out dummy data for test
    const response = await request(app.getServer()).get('/items');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]); 
  })
});

describe('get bills', () => {
  it('should returns all bills', async () => {
    const billController = new BillController();
    const app = new App([billController]);
    const response = await request(app.getServer()).get('/items');
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1); 
  })
});

describe('search bills', () => {
  it('should returns all bills with matching name and address', async () => {
    const billController = new BillController();
    const app = new App([billController]);
    const response = await request(app.getServer()).get('/items/search').send({patient_name: "Peter", patient_address: "New York City"});
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1); 
  })
});

describe('search bills not found', () => {
  it('should returns error message', async () => {
    const billController = new BillController();
    const app = new App([billController]);
    const response = await request(app.getServer()).get('/items/search').send({patient_name: "Susan", patient_address: "New Jersey"});
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      message: 'Bill with patient name Susan and address New Jersey not found.',
      status: 404
    })
  })
});

//POST ENDPOINT

describe('create new bill', () => {
  it('validation should pass and return new bill', async () => {
    const bill: CreateBillDto = {
      patient_name: "Susan",
      patient_address: "Boston",
      hospital: "MGH",
      date: "2023-02-14",
      amount: "$1500.50",
    };

    const billController = new BillController();
    const app = new App([billController]);
    const response = await request(app.getServer()).post('/items').send(bill);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(bill); 
  })
})

describe('create bill with validation errors', () => {
  it('validation should not pass and return errors', async () => {
    const bill = {
      patient_name: "Peter",
      patient_address: "New York City",
      date: "2023-02-",
      amount: "$100.0000",
    };

    const billController = new BillController();
    const app = new App([billController]);
    const response = await request(app.getServer()).post('/items').send(bill);
    expect(response.statusCode).toBe(400);
    expect(response.body).not.toBeNull();
    expect(response.body).toEqual({
      message: 'hospital should not be empty,hospital must be a string, date must be a valid ISO 8601 date string, amount must be a currency',
      status: 400
    })
  })
})

describe('try to create duplicate', () => {
  it('should return error message', async () => {
    const bill = {
      patient_name: "Peter",
      patient_address: "New York City",
      hospital: "Mount Sinai",
      date: "2023-02-15",
      amount: "$100.00",
    };

    const billController = new BillController();
    const app = new App([billController]);
    const response = await request(app.getServer()).post('/items').send(bill);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      message: 'Duplicate bill already exists.',
      status: 400
    })
  })
})

