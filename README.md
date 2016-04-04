## About
Sample demonstrating continuous deployment of a node.js+typescript app to Azure App Service Web Apps.

### The deployment
The app is built and deployed with Azure App Service KUDU deployment script that was modified to support Gulp, Grunt and Bower. (credits: https://github.com/projectkudu/KuduScript/issues/13)
It will execute Gulp/Grunt/Bower from local npm installations, it is not required to be referenced in your own package.json.

Notes
* If the project is not in the repository root (for example it's in the ./src  folder) and Grunt is used to generate a production-ready folder, such as  ./dist , which has all of the compiled and optimized folders, the KuduSync folders must be changed.


## what's next
* typescript sample
* azure resource template to set up the hosting environment
* ci/cd setup steps
* ci/cd with vsts integration
* application insights
* test in production
