export class CreateTrackerDto {
  IP: string;
  Port: number;
}

export class UpdateTrackerDto {
  IP?: string;
  Port?: number;
  IsOnline?: boolean;
  Battery?: number;
  LastSeen?: Date;
}