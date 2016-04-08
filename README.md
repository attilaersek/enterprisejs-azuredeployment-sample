## About
Sample demonstrating continuous deployment of a node.js+typescript app to Azure App Service Web Apps.

### The deployment
The app is built and deployed with Azure App Service KUDU deployment script that was modified to support additional steps. (credits: https://github.com/projectkudu/KuduScript/issues/13)
Steps of the deployment process
* selecting nodejs version
* install npm packages
* optionally install bower locally and install components by 'bower install'
* optionally install typings locally and install definitions by 'typings install'
* optionally install install grunt and run it with '--no-color clean common dist' parameters
* optionally install gulp and run 'gulp build' task
* KuduSync to target 

Notes
* If the project is not in the repository root (for example it's in the ./src  folder) and task runners (grunt/gulp) are used to generate a production-ready folder, such as  ./dist , which has all of the compiled and optimized folders, the KuduSync folders must be changed in deploy.sh.

### iisnode
Azure App Services Web Apps run nodejs applications within IIS with iisnode module. The iisnode specific settings could be found at iisnode.yml

## what's next
* typescript sample
* azure resource template to set up the hosting environment
* ci/cd setup steps
* ci/cd with vsts integration
* application insights
* test in production
