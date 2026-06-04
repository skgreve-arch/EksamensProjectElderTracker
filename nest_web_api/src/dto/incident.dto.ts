export class CreateIncidentReportDto 
{
  Resident_ID: number;
  User_ID: number;
  Title: string;
  Description?: string;
}

export class UpdateIncidentReportDto 
{
  Title?: string;
  Description?: string;
  User_ID?: number;
}