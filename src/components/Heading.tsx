function Heading({ title, extraText }: { title: string; extraText: string }) {
  return (
    <div className="flex justify-between">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-lg font-bold">{extraText}</p>
    </div>
  );
}

export default Heading;
