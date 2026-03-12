"use client";

interface JobRoleSelectorProps {
  roles: string[];
  value: string;
  onChange: (role: string) => void;
}

export default function JobRoleSelector({ roles, value, onChange }: JobRoleSelectorProps) {
  return (
    <select className="input-field" id="job-role-select"
      value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">— Select a target job role —</option>
      {roles.map((role) => (
        <option key={role} value={role}>{role}</option>
      ))}
    </select>
  );
}
