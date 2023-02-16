import { IsCurrency, IsDate, IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

class CreateBillDto {
  @IsString()
  @IsNotEmpty()
  public patient_name: string;

  @IsString()
  @IsNotEmpty()
  public patient_address: string;

  @IsString()
  @IsNotEmpty()
  public hospital: string;

  @IsDateString()
  @IsNotEmpty()
  public date: string;

  @IsCurrency()
  @IsNotEmpty()
  public amount: string; 
}

export default CreateBillDto;