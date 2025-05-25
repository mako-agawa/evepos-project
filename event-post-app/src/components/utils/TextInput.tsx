type Props = {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function TextInput({ label, id, type = 'text', value, onChange }: Props) {
  return (
    <div>
      <label className="text-xl block mb-2" htmlFor={id}>
        {label}:
      </label>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required
        className="w-full border border-gray-300 rounded p-2"
      />
    </div>
  );
}