import 'dotenv/config';

import bcrypt from 'bcryptjs';

import prisma from './config/prisma';

async function main() {
  // =========================
  // Administrador
  // =========================
  const adminPassword = await bcrypt.hash(
    'admin123',
    10,
  );

  const administrator =
    await prisma.user.upsert({
      where: {
        employeeNumber: '1000',
      },
      update: {
        name: 'Administrador del comedor',
        passwordHash: adminPassword,
        role: 'MANAGER',
        department: 'Administración',
        active: true,
      },
      create: {
        employeeNumber: '1000',
        name: 'Administrador del comedor',
        passwordHash: adminPassword,
        role: 'MANAGER',
        department: 'Administración',
        active: true,
      },
    });

  // =========================
  // Empleado
  // =========================
  const employeePassword = await bcrypt.hash(
    'empleado123',
    10,
  );

  const employee =
    await prisma.user.upsert({
      where: {
        employeeNumber: '1001',
      },
      update: {
        name: 'Empleado de prueba',
        passwordHash: employeePassword,
        role: 'EMPLOYEE',
        department: 'Producción',
        active: true,
      },
      create: {
        employeeNumber: '1001',
        name: 'Empleado de prueba',
        passwordHash: employeePassword,
        role: 'EMPLOYEE',
        department: 'Producción',
        active: true,
      },
    });

  // =========================
  // Cuenta del comedor
  // =========================
  const comedorPassword = await bcrypt.hash(
    'comedor123',
    10,
  );

  const comedor =
    await prisma.user.upsert({
      where: {
        employeeNumber: '2000',
      },
      update: {
        name: 'Cuenta del comedor',
        passwordHash: comedorPassword,
        role: 'COMEDOR',
        department: 'Comedor',
        active: true,
      },
      create: {
        employeeNumber: '2000',
        name: 'Cuenta del comedor',
        passwordHash: comedorPassword,
        role: 'COMEDOR',
        department: 'Comedor',
        active: true,
      },
    });

  console.log('Usuarios listos');

  console.table([
    {
      employeeNumber:
        administrator.employeeNumber,
      role: administrator.role,
      name: administrator.name,
    },
    {
      employeeNumber:
        employee.employeeNumber,
      role: employee.role,
      name: employee.name,
    },
    {
      employeeNumber:
        comedor.employeeNumber,
      role: comedor.role,
      name: comedor.name,
    },
  ]);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });