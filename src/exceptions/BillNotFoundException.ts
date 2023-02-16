import HttpException from './HttpException';

class BillNotFoundException extends HttpException {
  constructor(patient_name: string, patient_address: string) {
    super(404, `Bill with patient name ${patient_name} and address ${patient_address} not found.`);
  }
}

export default BillNotFoundException;