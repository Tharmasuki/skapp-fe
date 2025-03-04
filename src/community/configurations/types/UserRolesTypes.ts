import { JSX } from "react";

import { Modules } from "~community/common/enums/CommonEnums";
import {
  AdminTypes,
  EmployeeTypes,
  ManagerTypes
} from "~community/common/types/AuthTypes";
import { DropdownListType } from "~community/common/types/CommonTypes";

export interface AllUserRolesResponseType {
  module: string;
  roles: string[];
}

export interface AllUserRolesType extends AllUserRolesResponseType {
  name: string;
}

export interface UserRoleTableType {
  id: string;
  module: JSX.Element;
  roles: JSX.Element[];
}

export interface UserRoleRestrictionsType {
  module: Modules;
  isAdmin: boolean;
  isManager: boolean;
}

export interface GrantableRoleTypes {
  name: string;
  role: Exclude<AdminTypes, "SUPER_ADMIN"> | ManagerTypes | EmployeeTypes;
}

export interface AllowedGrantableRolesResponseType {
  module: Exclude<Modules, "NONE">;
  roles: GrantableRoleTypes[];
}

export interface AllowedGrantableRolesType {
  leave: DropdownListType[];
  people: DropdownListType[];
  attendance: DropdownListType[];
  esign: DropdownListType[];
}
