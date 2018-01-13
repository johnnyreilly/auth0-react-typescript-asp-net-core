# auth0-react-typescript-asp-net-core

A boilerplate illustrating Auth0 usage with a React / TypeScript client and an ASP.Net Server.

## Getting Started

You'll need node, yarn and ASP.NET Core 2 installed.

To install the Client (`ClientApp`) dependencies use `yarn install`
To install the Server (`Web`) dependencies use `dotnet restore`

## Auth0 Setup

- Login into Auth0 and go to the management portal.

- Create a Client with the name of your choice and use the Single Page Web Applications template.
- From the new Client Settings page take the Domain and Client ID and update the similarly named properties in the `appsettings.Development.json` and `appsettings.Production.json` files with these settings.
- To the Allowed Callback URLs setting add the URLs: http://localhost:3000/callback,http://localhost:5000/callback

- Create an API with the name of your choice (I recommend the same as the Client to avoid confusion), an identifier which can be anything you like; I like to use the URL of my app but it's your call.
- From the new API Settings page take the Identifier and update the `Audience` property in the `appsettings.Development.json` and `appsettings.Production.json` files with that value.

## Running in Production

Build the client app with `yarn build` in the `ClientApp` folder. Then, in the `Web` folder `dotnet run` and open your browser to http://localhost:5000

## Debugging

Run the client app using webpack-dev-server using `yarn start` in the `ClientApp` folder. Fire up VS Code in the root of the repo and hit F5 to debug the server.  Then open your browser to http://localhost:3000
