export class CreateResidentDto 
{
  Name: string;
  Address?: string;
  EmergencyContact?: string;
  HealthStatus?: string;
  Tracker_ID?: number;
}

export class UpdateResidentDto 
{
  Name?: string;
  Address?: string;
  EmergencyContact?: string;
  HealthStatus?: string;
  Tracker_ID?: number;
}