type Props = {
  errors: string[] | undefined;
};

export function FieldErrors({ errors }: Props) {
  if (!errors) return null;

  return (
    <ul className="list-inside list-disc text-xs text-destructive">
      {errors.map((error, index) => (
        <li key={index}>{error}</li>
      ))}
    </ul>
  );
}
