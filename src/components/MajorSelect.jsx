import { majors } from "../data/majors";

export default function MajorSelect() {
  return (
    <select className="profile_select" name="major" defaultValue="">
      <option value="" disabled>
      </option>

      {majors.map((major) => (
        <option key={major} value={major}>
          {major}
        </option>
      ))}
    </select>
  );
}
