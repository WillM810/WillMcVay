import Certifications from './Certifications/Certifications';
import Education from './Education/Education';

import './Resume.css';

export default function Resume() {
  return (
    <div className="max-w-3xl mx-auto p-8 text-gray-900">
      <h1 className="text-3xl font-bold mb-2">WILLIAM MCVAY</h1>
      <p className="mb-6">
        Dover, DE | 302-670-1971 |{' '}
        <a href="mailto:mcvay.will@gmail.com" className="text-blue-600 hover:underline">
          mcvay.will@gmail.com
        </a>
        <br />
        <a
          href="https://linkedin.com/in/willmcvay"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          linkedin.com/in/willmcvay
        </a>
        {' | '}
        <a
          href="/resume"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline dl-link"
        >
          Download PDF Resume
        </a>
        <a href="https://www.willmcvay.com" className="text-blue-600 hover:underline pf-link">www.willmcvay.com</a>
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">PROFESSIONAL SUMMARY</h2>
        <p>
          Versatile and experienced Full Stack Developer with over 20 years of building scalable, secure, and user-centric web applications. Skilled in both front-end and back-end development across enterprise, government, and legal administration projects. Experienced in independently driving features from concept to deployment as well as collaborating in distributed remote teams. Strong problem solver with attention to detail, effective communication skills, and mentoring experience.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">TECHNICAL SKILLS</h2>
        <p><strong>Languages:</strong> JavaScript, TypeScript, Java, Python, C#, PHP, SQL, Lua, Bash.</p>
        <p><strong>Frameworks/Libraries:</strong> React, Angular, Node.js, Spring Boot, Django, .NET, jQuery.</p>
        <p><strong>Databases:</strong> PostgreSQL, MSSQL, MySQL, MongoDB.</p>
        <p><strong>Tools:</strong> Git, Docker, Jenkins, GitHub, Jira, Slack, TFS, Teams, Discord, MS Office, Google Docs.</p>
        <p><strong>Cloud/DevOps:</strong> AWS (Lambda, EC2, S3), GCP, Heroku, NPM, Apache, Tomcat.</p>
        <p><strong>Testing:</strong> Jasmine, Jest, Integration & Unit Testing.</p>
      </section>

      <Certifications />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">PROFESSIONAL EXPERIENCE</h2>

        <div className="mb-6">
          <h3 className="font-bold">Legal Administrative Specialist – Office of Conflicts Counsel (OCC)</h3>
          <p className="italic mb-2">Dover, DE | Aug 2025 – Present</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Developed Node.js and React apps to coordinate existing case management software.</li>
            <li>Provided admin support including calendar tracking for Family and Common Pleas Courts.</li>
            <li>Coordinated data entry, client communications, and conflict checks for defense services.</li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="font-bold">Senior Software Developer – JBS Dev</h3>
          <p className="italic mb-2">Remote | Mar 2022 – Jan 2024</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Built scalable AWS Lambda functions and CloudFormation scripts in Node.js.</li>
            <li>Created React components for a graduate program search and matching platform on AWS.</li>
            <li>Boosted Google Lighthouse score by 30% via performance and SEO optimizations.</li>
            <li>Developed full-stack CMS features combining Django/PostgreSQL with React and legacy JS.</li>
            <li>Mentored junior developers, coordinated tasks, and met sprint deadlines.</li>
            <li>Ensured 90%+ coverage with unit and integration tests.</li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="font-bold">Software Developer – American Systems</h3>
          <p className="italic mb-2">Remote | Feb 2019 – Jan 2022</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Built full-stack Angular + Spring Boot application for DoD childcare registration.</li>
            <li>Led features from design to delivery, mentoring 3-4 developers.</li>
            <li>Integrated MSSQL stored procedures and ensured test coverage exceeded 90%.</li>
            <li>Delivered timely results within biweekly sprints across distributed teams.</li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="font-bold">Software Developer – Accenture Federal Services</h3>
          <p className="italic mb-2">Remote | Sep 2014 – Apr 2018</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Migrated legacy Java code to Node.js to improve EMR scalability and performance.</li>
            <li>Developed Angular + Java-based applications for AmTrak and FCC services.</li>
            <li>Mentored junior engineers and led implementation of mission-critical features.</li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="font-bold">Software Developer – Independent School Management</h3>
          <p className="italic mb-2">Wilmington, DE | Jul 2013 – Jul 2014</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Developed Angular apps using LAMP stack for CRM and financial aid tools.</li>
            <li>Collaborated with product and QA teams for successful feature delivery.</li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="font-bold">Professional Service Engineer – Vizible / JackBe</h3>
          <p className="italic mb-2">Toronto, ON / Chevy Chase, MD | Jun 2007 – Aug 2010</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Developed 3D UIs using a proprietary JavaScript API for clients like AT&T and Showtime.</li>
            <li>Integrated enterprise systems into immersive front-end interfaces for data visualization.</li>
            <li>Delivered professional services both remotely and on-site.</li>
            <li>Created secure Java middleware and front-end UIs for DoD intelligence dashboards.</li>
            <li>Converted complex APIs to REST interfaces within highly secured environments.</li>
            <li>Worked on-site with DISA and ManTech under a now inactive Secret clearance.</li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="font-bold">Early Work Experience - Various Employers</h3>
          <p className="italic mb-2">Newark, DE | Aug 2003 – May 2007</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Tech Support for dorm residents ensuring connectivity and functionality across platforms.</li>
            <li>Internship coding Java/C++ simulation tools for proprietary hardware.</li>
            <li>Tech Support for Tomcat, Ruby on Rails, PHP, and static web hosting.</li>
            <li>Coordinated design and implementation of a full-featured Java Monopoly clone.</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">PERSONAL & FREELANCE PROJECTS</h2>
        <div>
          <h3 className="font-bold">Lead Developer | Freelance / Personal Projects</h3>
          <p className="italic mb-2">Jan 2024 – Present</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Built <a href="https://blog.willmcvay.com/2025/08/jrragon-chess.html" className="text-blue-600 hover:underline">3D Chess game</a> in Unity C#, including Node.js lobby server and internet multiplayer integration, plus a CLI for a standalone chess engine configured for StockFish integration.</li>
            <li>Created a <a href="https://github.com/WillM810/npd-app" className="text-blue-600 hover:underline">Node.js Discord bot</a> integrated with <a href="https://github.com/WillM810/npd-bot" className="text-blue-600 hover:underline">social media/GraphQL and Google/MongoDB</a> APIs, plus Delaware state legislature API integrations for bill tracking.</li>
            <li>Designed custom CPU architecture with assembly language and developed applications to perform automated tasks and minimize tick count.</li>
            <li>Developed CI/CD pipelines deploying to Heroku and GCP with DNS setup.</li>
            <li>Automated tasks using Python, Java, Lua, and <a href="https://blog.willmcvay.com/2025/08/the-law-of-cosines.html" className="text-blue-600 hover:underline">C#</a> across niche domains.</li>
          </ul>
        </div>
      </section>

      <Education />
    </div>
  );
}
