import React from "react";

const Resume: React.FC = () => (
  <div className="max-w-4xl mx-auto p-6 font-sans">
    <h1 className="text-3xl font-bold mb-2">William McVay</h1>
    <p className="mb-4">
      Dover, DE | 302-670-1971 | mcvay.will@gmail.com |{' '}
      <a href="https://www.linkedin.com/in/willmcvay" className="text-blue-600 underline">linkedin.com/in/willmcvay</a>
    </p>

    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-1">Professional Summary</h2>
      <p>
        Versatile and experienced Full Stack Developer with 20+ years of experience designing and building scalable, secure, and user-centric web applications. Equally strong in frontend and backend technologies with expertise in modern frameworks and cloud platforms. Demonstrated leadership, problem-solving, and mentoring skills in both startup and enterprise environments.
      </p>
    </section>

    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-1">Technical Skills</h2>
      <ul className="list-disc list-inside">
        <li><strong>Languages:</strong> JavaScript, TypeScript, Java, Python, C#, PHP, SQL, Lua, Bash</li>
        <li><strong>Frameworks & Libraries:</strong> React, Angular, Node.js, Spring Boot, Django, .NET</li>
        <li><strong>Databases:</strong> PostgreSQL, MSSQL, MySQL, MongoDB</li>
        <li><strong>Cloud & DevOps:</strong> AWS, GCP, Docker, Jenkins, GitHub Actions</li>
        <li><strong>Version Control & Tools:</strong> Git, GitHub, GitLab, Jira, Teams, Slack</li>
        <li><strong>Testing:</strong> Jasmine, Jest, Unit Testing, Integration Testing</li>
      </ul>
    </section>

    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-1">Professional Experience</h2>
      <div className="mb-4">
        <h3 className="font-bold">Senior Software Developer – JBS Dev</h3>
        <p className="italic">Remote – Mar 2022 to Jan 2024</p>
        <ul className="list-disc list-inside">
          <li>Led development of AWS Lambda infrastructure using Node.js</li>
          <li>Built and maintained React CMS components with Next.js, including performance optimization and SEO</li>
          <li>Integrated Django/PostgreSQL backend with REST APIs and automated workflows</li>
          <li>Mentored junior developers and ensured 90%+ test coverage</li>
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="font-bold">Software Developer – American Systems</h3>
        <p className="italic">Remote – Feb 2019 to Jan 2022</p>
        <ul className="list-disc list-inside">
          <li>Developed and maintained full-stack applications with Angular and Spring Boot</li>
          <li>Created and optimized stored procedures for MSSQL databases</li>
          <li>Built secure and performant backend services with Java REST APIs</li>
          <li>Contributed to projects with 90%+ automated test coverage</li>
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="font-bold">Software Developer – Accenture Federal Services</h3>
        <p className="italic">Remote – Sep 2014 to Apr 2018</p>
        <ul className="list-disc list-inside">
          <li>Migrated legacy systems to Node.js microservices</li>
          <li>Developed Angular + Java applications for federal government clients</li>
          <li>Maintained and enhanced secure cloud-based systems</li>
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="font-bold">Independent School Management</h3>
        <p className="italic">Wilmington, DE – Jan 2012 to Aug 2014</p>
        <ul className="list-disc list-inside">
          <li>Created internal business management applications using C# and JavaScript</li>
          <li>Led development of reporting and scheduling tools with full-stack technologies</li>
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="font-bold">Software Developer – JackBe/Vizible</h3>
        <p className="italic">Bethesda, MD – Mar 2010 to Dec 2011</p>
        <ul className="list-disc list-inside">
          <li>Built dynamic dashboards using Flex/ActionScript and Java backends</li>
          <li>Implemented real-time data visualizations for enterprise clients</li>
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="font-bold">Technical Support Engineer – HostMySite</h3>
        <p className="italic">Newark, DE – Feb 2008 to Jan 2010</p>
        <ul className="list-disc list-inside">
          <li>Provided Tier 3 support for web hosting infrastructure</li>
          <li>Wrote tools in Python and Bash for internal support automation</li>
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="font-bold">Software Developer – EM Photonics</h3>
        <p className="italic">Newark, DE – Jul 2005 to Jan 2008</p>
        <ul className="list-disc list-inside">
          <li>Developed software tools in C++ and Python for scientific computing</li>
          <li>Worked on high-performance computing and simulation projects</li>
        </ul>
      </div>
    </section>

    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-1">Freelance & Personal Projects</h2>
      <ul className="list-disc list-inside">
        <li>3D Chess Engine built in Unity (C#) with Node.js server</li>
        <li>Discord Bot with MongoDB, social features, and Delaware legislative data</li>
        <li>Custom CPU Simulator created in C for educational purposes</li>
        <li>CI/CD Pipelines configured for Heroku, GCP, and Docker</li>
        <li>Automation Scripts developed in Python, Lua, and Bash</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-semibold mb-1">Education</h2>
      <ul className="list-disc list-inside">
        <li><strong>University of Delaware</strong> – B.S. in Computer Science, B.A. in Psychology, Minor in Political Science</li>
        <li><strong>Delaware Technical Community College</strong> – Paralegal Certificate, President of Student Paralegal Association</li>
      </ul>
    </section>
  </div>
);

export default Resume;