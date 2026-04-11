/** Server-safe JSON-LD script. Pass a single object or @graph array. */
export default function JsonLd({ data }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
