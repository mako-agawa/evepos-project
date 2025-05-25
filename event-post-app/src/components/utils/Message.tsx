type Props = {
  message: string;
};

export function Message({ message }: Props) {
  if (!message) return null;

  return <p className="mt-4 text-xl text-red-500">{message}</p>;
}