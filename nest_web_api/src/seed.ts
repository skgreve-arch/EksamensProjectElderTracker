import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { ResidentsService } from './residents/residents.service';
import { IncidentService } from './incident/incident.service';

async function seed() 
{
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const residentsService = app.get(ResidentsService);
  const incidentService = app.get(IncidentService);

  console.log('Seeding database...');

  // Roles
  console.log('Seeding roles...');
  const adminRole = await usersService.createRole({ Role: 'Admin' });
  const staffRole = await usersService.createRole({ Role: 'Staff' });
  console.log('Roles seeded');

  // Users
  console.log('Seeding users...');
  const admin = await usersService.createUser({
    Email: 'admin@caretrack.dk',
    Name: 'Admin User',
    Password: 'Admin1234!',
    Role_ID: adminRole.Role_ID,
  });

  const staff1 = await usersService.createUser({
    Email: 'staff1@caretrack.dk',
    Name: 'Staff User One',
    Password: 'Staff1234!',
    Role_ID: staffRole.Role_ID,
  });

  const staff2 = await usersService.createUser({
    Email: 'staff2@caretrack.dk',
    Name: 'Staff User Two',
    Password: 'Staff1234!',
    Role_ID: staffRole.Role_ID,
  });
  console.log('Users seeded');

  // Residents
  console.log('Seeding residents...');
  const resident1 = await residentsService.create({
    Name: 'John Doe',
    Address: 'Vejlevej 12, 6000 Kolding',
    EmergencyContact: '+45 12345678',
    HealthStatus: 'Diabetic',
  });

  const resident2 = await residentsService.create({
    Name: 'Jane Doe',
    Address: 'Nørregade 5, 6000 Kolding',
    EmergencyContact: '+45 87654321',
    HealthStatus: 'Hypertension',
  });

  const resident3 = await residentsService.create({
    Name: 'Hans Jensen',
    Address: 'Østergade 8, 6000 Kolding',
    EmergencyContact: '+45 11223344',
    HealthStatus: 'Healthy',
  });
  console.log('Residents seeded');

  // Incident reports
  console.log('Seeding incident reports...');
  await incidentService.create({
    Resident_ID: resident1.Resident_ID,
    User_ID: staff1.User_ID,
    Title: 'Fall incident',
    Description: 'Resident fell near the garden area, minor bruising on left knee.',
  });

  await incidentService.create({
    Resident_ID: resident2.Resident_ID,
    User_ID: staff2.User_ID,
    Title: 'Alarm triggered',
    Description: 'Resident pressed alarm button, was confused but unharmed.',
  });

  await incidentService.create({
    Resident_ID: resident1.Resident_ID,
    User_ID: admin.User_ID,
    Title: 'Medical check',
    Description: 'Routine medical check requested by family.',
  });
  console.log('Incident reports seeded');

  console.log('Seeding complete!');
  await app.close();
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});