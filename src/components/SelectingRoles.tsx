import { useHome } from "@/lib/content";
import { EditableText, useEdit } from "@/lib/edit-mode";

export function SelectingRoles() {
  const { data: home } = useHome();
  const { editing } = useEdit();
  const roles = home.site.heroRoles;

  // Edit mode freezes the rotator into a flat editable list.
  if (editing) {
    return (
      <span className="inline-flex flex-wrap justify-center gap-x-3 gap-y-1">
        {roles.map((role, i) => (
          <EditableText key={i} page="home" path={["site", "heroRoles", i]} value={role} />
        ))}
      </span>
    );
  }

  return (
    <span
      className="auto-select role-rotator"
      style={{
        display: "inline-block",
        minWidth: "18ch",
      }}
    >
      <span className="role-rotator-track" aria-live="polite">
        {roles.map((role) => (
          <span key={role} className="role-rotator-word">
            {role}
          </span>
        ))}
      </span>
    </span>
  );
}
