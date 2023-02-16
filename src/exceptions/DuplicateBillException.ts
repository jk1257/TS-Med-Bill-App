import HttpException from './HttpException';

class DuplicateBillException extends HttpException {
  constructor() {
    super(400, 'Duplicate bill already exists.');
  }
}

export default DuplicateBillException;