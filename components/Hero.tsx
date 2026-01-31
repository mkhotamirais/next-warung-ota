export default function Hero({ title, description }: { title: string; description?: string }) {
  return (
    <section className="container bg-primary/5">
      <article className="prose flex flex-col text-center max-w-2xl mx-auto p-8">
        <h1 className="mb-2">{title}</h1>
        <p>{description}</p>
      </article>
    </section>
  );
}
