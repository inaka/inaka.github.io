const fs = require('fs');
const whiskers = require('whiskers');
// Context is a data structure that will be use to replace the variables in the template.
const eventsContext = JSON.parse(fs.readFileSync('data/events.json'));
let mainContext = Object.assign(JSON.parse(fs.readFileSync('data/repose.json')), {maxCards: 3}, eventsContext);
// Template is just the template. Special tags will be replaced with the data in context.
const headerTemplate = {header: fs.readFileSync('templates/header.template.html').toString()};
const navigationTemplate = {navigation: fs.readFileSync('templates/navigation.template.html').toString()};
const headerSectionTemplate = {headerSection: fs.readFileSync('templates/header-section.template.html').toString()};
const whoWeAreSectionTemplate = {whoWeAreSection: fs.readFileSync('templates/who-we-are-section.template.html').toString()};
const ourHistorySectionTemplate = {ourHistorySection: fs.readFileSync('templates/our-history-section.template.html').toString()};
const contactUsSectionTemplate = {contactUsSection: fs.readFileSync('templates/contact-us-section.template.html').toString()};
const eventsSectionTemplate = {eventsSection: fs.readFileSync('templates/events-section.template.html').toString()};
const projectsSectionTemplate = {projectsSection: fs.readFileSync('templates/projects-section.template.html').toString()};

mainContext = Object.assign(mainContext, 
        headerTemplate, 
        navigationTemplate, 
        headerSectionTemplate,
        whoWeAreSectionTemplate,
        ourHistorySectionTemplate,
        contactUsSectionTemplate,
        eventsSectionTemplate,
        projectsSectionTemplate
    );
const template = fs.readFileSync('templates/index.template.html');



const result = whiskers.render(template, mainContext);

fs.writeFileSync('index.html', result);

console.log('RENDER DONE!!');