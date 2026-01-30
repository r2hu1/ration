import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
  memberAc,
  ownerAc,
} from "better-auth/plugins/organization/access";
import { organization } from "@/db/schema";

const statement = {
  ...defaultStatements,
  project: ["create", "share", "update", "delete"],
  organization: ["invite", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const member = ac.newRole({
  ...memberAc.statements,
  project: ["create", "update", "share"],
});

export const admin = ac.newRole({
  ...adminAc.statements,
  project: ["create", "update", "share"],
  organization: ["invite", "update"],
});

export const owner = ac.newRole({
  ...ownerAc.statements,
  project: ["create", "update", "delete", "share"],
  organization: ["invite", "update", "delete"],
});
