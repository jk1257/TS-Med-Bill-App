import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

class CreateBillQueryDto {
  @IsString()
  @IsNotEmpty()
  public patient_name: string;

  @IsString()
  @IsNotEmpty()
  public patient_address: string;

}

export default CreateBillQueryDto;