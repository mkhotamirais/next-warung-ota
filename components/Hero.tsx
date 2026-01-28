export default function Hero({ title, description }: { title: string; description?: string }) {
  return (
    <section className="container">
      <div className="flex flex-col text-center max-w-2xl mx-auto p-8">
        <h1 className="h1 mb-3">{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
