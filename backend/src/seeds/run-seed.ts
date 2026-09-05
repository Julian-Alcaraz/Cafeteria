import { DataSource } from 'typeorm';
import { AppDataSource } from '../config/typeorm.config.js';

import * as bcrypt from 'bcrypt';
import { User } from '../modules/users/entities/user.entity.js';
import { Menu } from '../modules/menus/entities/menu.entity.js';
import { Permission } from '../modules/permissions/entities/permission.entity.js';

export const runSeed = async () => {
  const dataSource: DataSource = await AppDataSource.initialize();
  
  console.log('Running seeds...');

  const permissionRepo = dataSource.getRepository(Permission);
  const menuRepo = dataSource.getRepository(Menu);
  const userRepo = dataSource.getRepository(User);

  // 1. Create Permissions
  let pConfig = await permissionRepo.findOneBy({ name: 'access_config' });
  if (!pConfig) pConfig = await permissionRepo.save({ name: 'access_config', description: 'Acceso a Configuraciones' });

  let pUsers = await permissionRepo.findOneBy({ name: 'access_users_crud' });
  if (!pUsers) pUsers = await permissionRepo.save({ name: 'access_users_crud', description: 'Acceso a ABM Usuarios' });

  let pMenus = await permissionRepo.findOneBy({ name: 'access_menus_crud' });
  if (!pMenus) pMenus = await permissionRepo.save({ name: 'access_menus_crud', description: 'Acceso a ABM Menús' });

  let pPerms = await permissionRepo.findOneBy({ name: 'access_permissions_crud' });
  if (!pPerms) pPerms = await permissionRepo.save({ name: 'access_permissions_crud', description: 'Acceso a ABM Permisos' });

  // 2. Create Menus
  let mConfig = await menuRepo.findOneBy({ label: 'Configuraciones' });
  if (!mConfig) {
    mConfig = await menuRepo.save({
      label: 'Configuraciones',
      icon: 'pi pi-cog',
      url: '/app/configuraciones',
      requiredPermission: pConfig
    });
  }

  let mUsers = await menuRepo.findOneBy({ label: 'Usuarios' });
  if (!mUsers) {
    mUsers = await menuRepo.save({
      label: 'Usuarios',
      icon: 'pi pi-users',
      url: '/app/configuraciones/usuarios',
      parent: mConfig,
      requiredPermission: pUsers
    });
  }

  let mMenus = await menuRepo.findOneBy({ label: 'Menús' });
  if (!mMenus) {
    mMenus = await menuRepo.save({
      label: 'Menús',
      icon: 'pi pi-list',
      url: '/app/configuraciones/menus',
      parent: mConfig,
      requiredPermission: pMenus
    });
  }

  let mPerms = await menuRepo.findOneBy({ label: 'Permisos' });
  if (!mPerms) {
    mPerms = await menuRepo.save({
      label: 'Permisos',
      icon: 'pi pi-key',
      url: '/app/configuraciones/permisos',
      parent: mConfig,
      requiredPermission: pPerms
    });
  }

  // 3. Create Superadmin User
  let admin = await userRepo.findOneBy({ username: 'superadmin' });
  if (!admin) {
    const password_hash = await bcrypt.hash('superadmin', 10);
    admin = await userRepo.save({
      username: 'superadmin',
      password_hash,
      permissions: [pConfig, pUsers, pMenus, pPerms]
    });
    console.log('Superadmin created!');
  } else {
    console.log('Superadmin already exists. Updating permissions...');
    admin.permissions = [pConfig, pUsers, pMenus, pPerms];
    await userRepo.save(admin);
  }

  console.log('Seeds executed successfully.');
  await dataSource.destroy();
};

runSeed().catch((err) => {
  console.error('Error during seeding:', err);
  process.exit(1);
});
