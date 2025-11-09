export default function Certifications() {
  const certificates = [
    {
      name: 'HackerRank — Software Engineer Certificate',
      date: 'Aug 2025',
      credentialId: '245ab05db2c0',
    },
    {
      name: 'HackerRank — JavaScript (Basic) Certificate',
      date: 'Aug 2025',
      credentialId: 'ceaf57b75922',
    },
    {
      name: 'HackerRank — JavaScript (Intermediate) Certificate',
      date: 'Aug 2025',
      credentialId: '11347597c1bf',
    },
  ];

  const certBaseUrl = 'https://www.hackerrank.com/certificates/';

  return (
    <section className="mb-4">
      <h2 className="text-2xl font-semibold mb-2">CERTIFICATIONS</h2>
      <ul className="list-disc list-inside">
        {
          certificates.map(
            (cert, index) => (
              <li key={index}>
                <span className="font-bold">{cert.name}: </span>
                <a
                  href={`${certBaseUrl}${cert.credentialId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-bold"
                >
                  {cert.credentialId}
                </a>
                <span className="italic text-gray-600">&nbsp;({cert.date})</span>
              </li>
            )
          )
        }
      </ul>
    </section>
  );
}