export default function NotionSection({ title, icon, children }) {
  return (
    <section className="mb-12">
      <div className="flex items-center space-x-2 mb-6">
        <span className="text-xl">{icon}</span>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}
