# BlueCompute Web Application by IBM Cloud

*This project is part of the 'IBM Cloud Native Reference Architecture' suite, available at
https://github.com/ibm-cloud-architecture/refarch-cloudnative*

The BlueCompute Web application is built to demonstrate how to access the omnichannel APIs hosted on IBM Cloud. The application application provides the basic function to allow user to browse the Inventory items. It is built as a Node.js application that uses Express framework and Jade templates.


## Run the iOS application locally

Note this section requires an Apple computer running MacOS with Apple Xcode IDE installed.

1. Navigate to the web app folder `StoreWebApp` in the git repository.
2. Edit the config/default.json file to configure the API endpoints. You need to update following fields:
  - client_id
  - host  
  - org  

  ![Web App Configuration](static/imgs/bluemix_23.png?raw=true)

3. Run the Web application

   `$ cd StoreWebApp`  
   `$ npm install`  
   `$ npm start`  

   This will start the Node.js application on your local environment and open a browser with app homepage.

4. Validate the application.

   The application is lunched in a browser at:

   [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

   Click the "Browser ITEM INVENTORY" will load the list of items:

  ![BlueCompute List](static/imgs/bluemix_24.png?raw=true)

  Click on one of the items will bring you to the detail page:

  ![BlueCompute Detail](static/imgs/bluemix_25.png?raw=true)

Feel free to play around and explore the mobile inventory application.

## Deploy the application to Bluemix hosting:

You need to have Bluemix command line (bx or cf) installed, as well as Node.js runtime in your development environment.

- Configure the application

  This need to change the Cloud Foundry application route for your own web application hostname. Edit the `StoreWebApp/manefest.yml` file to update the name and host fields:

  ```yml
  applications:
  - path: .
    memory: 512M
    instances: 1
    domain: mybluemix.net
    name: bluecompute-web-app
    host: bluecompute-web-app
    disk_quota: 1024M
  ```

  Replace the `bluecompute-web-app` with your own application host name.

- Deploy the application:

  `$ cd StoreWebApp`  
  `$ cf login`
  `$ cf push`   

- Validate the application:

Once the application is deployed successfully to Bluemix, you can browse your Web app at:

[http://bluecompute-web-app.mybluemix.net/](http://bluecompute-web-app.mybluemix.net)
