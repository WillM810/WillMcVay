export default function Education() {
  const education = [
    {
      institution: 'University of Delaware',
      location: 'Newark, DE',
      dates: 'Aug 2003 – Jun 2007',
      data: [
        'BS in Computer Science, BA in Psychology, Minor in Political Science',
        'Specialization in Intelligent Behavior',
      ],
    },
    {
      institution: 'Delaware Technical Community College',
      location: 'Dover, DE',
      dates: 'Aug 2017 – Jun 2019',
      data: [
        'Associate\'s Degree in Paralegal Studies',
        'President, Student Paralegal Association | Member, ATK Honor Society',
      ],
    },
  ];

  return (
    <section className="mb-4">
      <h2 className="text-2xl font-semibold mb-2">EDUCATION</h2>
      {
        education.map(
          (edu, index) => (
            <div key={index} className="mt-4">
              <h3 className="font-bold">{edu.institution}</h3>
              <p className="italic mb-2">{`${edu.location} | ${edu.dates}`}</p>
              <ul className="list-disc list-outside">
                {
                  edu.data.map(
                    (item, idx) => (
                      <li key={idx}>{item}</li>
                    )
                  )
                }
              </ul>
            </div>
          )
        )
      }
    </section>
  );
}