function Heading({ title, extraText }: { title: string; extraText?: string }) {
  return (
    <h3 className="mt-2 flex text-center justify-between">
      <span className="text-lg font-bold">{title}</span>
      <span className="text-lg font-semibold">{extraText}</span>
    </h3>
  );
}

export default Heading;
