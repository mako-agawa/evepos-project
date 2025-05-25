import { Button } from '@/components/commons/button';

type Props = {
  label: string;
};

export function SubmitButton({ label }: Props) {
  return (
    <Button
      type="submit"
      className="w-full text-white bg-orange-400 hover:bg-orange-500 rounded p-3 text-xl"
    >
      {label}
    </Button>
  );
}
