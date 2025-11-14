import Certifications from './Certifications/Certifications';
import Education from './Education/Education';

export default function Resume() {
  return (
    <div className="max-w-3xl mx-auto p-8 text-gray-900">
      <h1 className="text-3xl font-bold mb-2">WILLIAM MCVAY</h1>
      <p className="mb-4">
        Dover, DE | 302-670-1971 |{' '}
        <a href="mailto:mcvay.will@gmail.com" className="text-blue-600 hover:underline">
          mcvay.will@gmail.com
        </a>
        <br />
        <a
          href="/resume"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline dl-link"
        >
          Download PDF Resume
        </a>
        <a href="https://www.willmcvay.com" className="text-blue-600 hover:underline pf-link">www.willmcvay.com</a>
        { ' | ' }
        <a
          href="https://linkedin.com/in/willmcvay"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          linkedin.com/in/willmcvay
        </a>
        { ' | ' }
        <a
          href="https://github.com/WillM810"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          github.com/WillM810
        </a>
        { ' | ' }
        <a
          href="https://blog.willmcvay.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          blog.willmcvay.com
        </a>
      </p>

      <section className="mb-4">
        <h2 className="text-2xl font-semibold mb-2">PROFESSIONAL SUMMARY | Full Stack Developer</h2>
        <ul className="list-disc list-outside mb-2">
          <li>20+ years of experience building scalable, secure, and user-centric web applications for the intel, health care, defense, education, and legal industries in public and private sector roles.</li>
          <li>Proficient across full stack architecture from CI/CD DevOps and IaC through databases and back ends to front end design, implementation, responsive styling and SEO.</li>
          <li>Proven success designing and deploying production systems on Heroku, AWS, and GCP with 99%+ uptime, rapid and reliable deployment, and low overhead costs.</li>
          <li>Strong communicator and mentor reliable on remote Agile teams and independent project delivery consistently on schedule and delivering high quality, fully tested code.</li>
          <li>Recent focus on modernizing internal IT processes in a legal setting through automated workflows integrating legacy application APIs to reduce time requirements and errors.</li>
        </ul>
      </section>

      <section className="mb-4">
        <h2 className="text-2xl font-semibold mb-2">TECHNICAL SKILLS</h2>
        <p><strong>Languages:</strong> JavaScript/TypeScript, Java, Python, C#, PHP, SQL, Lua, Bash, IBM 3270.</p>
        <p><strong>Frameworks:</strong> React/Next.js, Angular, Node.js, Spring Boot, Django, .NET, jQuery.</p>
        <p><strong>Databases:</strong> PostgreSQL, MSSQL, MySQL, MongoDB/NoSQL.</p>
        <p><strong>Tools:</strong> Git, Docker, GitHub/CoPilot, Jira, TFS, Slack, Teams, Discord, Office, Google Apps.</p>
        <p><strong>DevOps:</strong> AWS (Lambda, EC2, S3), GCP, Heroku, GitHub Actions, Jenkins, NPM, Apache, Tomcat.</p>
        <p><strong>Testing:</strong> Jasmine, Jest, Integration & Unit Testing.</p>
      </section>

      <Certifications />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">PROFESSIONAL EXPERIENCE</h2>

        <div className="mb-2">
          <h3 className="font-bold">Legal Administrative Specialist – Office of Conflicts Counsel (OCC)</h3>
          <p className="italic mb-2">Dover, DE | Aug 2025 – Present</p>
          <ul className="list-disc list-outside">
            <li>Developed Node.js and React apps to coordinate existing case management software.</li>
            <li>Achieved 99%+ reduction in labor and material costs to several automated tasks.</li>
            <li>Coordinated 20-30 clients per week for data entry, scheduling, case work, client communications, and conflict checks for public defender conflict services.</li>
          </ul>
        </div>

        <div className="mb-2">
          <h3 className="font-bold">Senior Software Developer – JBS Dev</h3>
          <p className="italic mb-2">Remote | Mar 2022 – Jan 2024</p>
          <ul className="list-disc list-outside">
            <li>Built 2-3 daily scalable AWS Lambda functions and CloudFormation scripts in Node.js.</li>
            <li>Created 3-10 weekly React components for graduate program search and matching platform.</li>
            <li>Achieved 30% boost to Google Lighthouse scores via performance and SEO optimizations.</li>
            <li>Developed 2-4 weekly full-stack CMS features combining Django/PostgreSQL with React.</li>
            <li>Mentored 3-5 junior developers, coordinating tasks, reviewing code, and meeting deadlines.</li>
            <li>Ensured 95%+ code coverage with unit and integration tests.</li>
          </ul>
        </div>

        <div className="mb-2">
          <h3 className="font-bold">Software Developer – American Systems</h3>
          <p className="italic mb-2">Remote | Feb 2019 – Jan 2022</p>
          <ul className="list-disc list-outside">
            <li>Built full-stack Angular + Spring Boot application for DoD childcare registration.</li>
            <li>Mentored 3-4 developers and led feature development from design to delivery.</li>
            <li>Ensured 95%+ test coverage integrating MSSQL procedures with Java and Angular layers.</li>
            <li>Delivered 4-10 completed user stories within biweekly sprints across distributed teams.</li>
          </ul>
        </div>

        <div className="mb-2">
          <h3 className="font-bold">Software Developer – Accenture Federal Services</h3>
          <p className="italic mb-2">Remote | Sep 2014 – Apr 2018</p>
          <ul className="list-disc list-outside">
            <li>Integrated 5+ legacy data sources using Node to improve EMR scalability and performance.</li>
            <li>Developed Angular + Java-based applications for AmTrak and FCC services.</li>
            <li>Mentored 2-3 junior engineers and led implementation of mission-critical features.</li>
          </ul>
        </div>

        <div className="mb-2">
          <h3 className="font-bold">Software Developer – Independent School Management</h3>
          <p className="italic mb-2">Wilmington, DE | Jul 2013 – Jul 2014</p>
          <ul className="list-disc list-outside">
            <li>Developed 2 complete Angular apps using LAMP stack for CRM and financial aid tools.</li>
            <li>Collaborated with ~10 member product and QA teams for successful feature delivery.</li>
          </ul>
        </div>
      </section>

      <Education />
    </div>
  );
}
