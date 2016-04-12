## About
Sample demonstrating continuous deployment of a node.js+typescript app to Azure App Service Web Apps.

## Deploy the web app linked to a GitHub repository

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fretk%2Fenterprisejs-azuredeployment-sample%2Fmaster%2Fazuredeploy.json" target="_blank">
    <img src="http://azuredeploy.net/deploybutton.png"/>
</a>
<a href="http://armviz.io/#/?load=https%3A%2F%2Fraw.githubusercontent.com%2Fretk%2Fenterprisejs-azuredeployment-sample%2Fmaster%2Fazuredeploy.json" target="_blank">
    <img src="http://armviz.io/visualizebutton.png"/>
</a>

### Note about the deployment
Note also that IsManualIntegration is set to true. This property is necessary because you do not actually own this repository, and thus cannot actually grant permission to Azure to configure continuous delivery. You can use the default value false for the specified repository only if you have configured the GitHub credentials in the Azure portal before. See: https://azure.microsoft.com/en-gb/documentation/articles/app-service-deploy-complex-application-predictably/

## The deployment
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
* ci/cd setup steps
* ci/cd with vsts integration
* application insights
* test in production
