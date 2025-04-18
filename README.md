# Barista App

This professional coffee dispensing application was built with Angular 18.

## Features

- Interactive coffee dispensing interface with animations
- Inventory management system
- Custom drink creation and editing
- Real-time stock monitoring
- Responsive design for all device sizes


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run build:prod` to build the project for production. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
Run `npm run test:ci` to run tests in CI environment.

## Deployment

### Deploying with Docker

1. Build the Docker image:
   ```
   docker build -t barista-app .
   ```

2. Run the container:
   ```
   docker run -p 8080:80 barista-app
   ```

3. Access the application at `http://localhost:8080`

### Deploying to a Web Server

1. Build the project:
   ```
   npm run build:prod
   ```

2. Copy the contents of `dist/barista-app/browser` to your web server's root directory.

3. Configure the web server to redirect all requests to `index.html` (for SPA routing).
   - For Apache: Use the provided `.htaccess` file
   - For Nginx: Use the provided `nginx.conf` file
   - For IIS: Use the provided `web.config` file

### Deploying to GitHub Pages

1. Install the gh-pages package:
   ```
   npm install -g angular-cli-ghpages
   ```

2. Build and deploy:
   ```
   ng build --configuration production --base-href="https://USERNAME.github.io/REPOSITORY_NAME/"
   npx angular-cli-ghpages --dir=dist/barista-app/browser
   ```

## Environment Configuration

The application uses environment-specific configuration files:
- `environment.ts` for development
- `environment.prod.ts` for production

  # Barista App Diagrams

## Flowchart: Barista App Workflow

```mermaid
flowchart TD
    Start([Start]) --> Menu[Display Drink Menu]
    Menu -->|Select Drink| Dispense[Dispense Drink]
    Dispense -->|Drink Ready| Inventory[Update Inventory]
    Inventory -->|Low Stock| Notify[Notify User]
    Inventory -->|Sufficient Stock| End([End])
    Notify --> End

    classDef blueNode fill:#4285F4,color:white,stroke:#2A56C6,stroke-width:2px
    classDef greenNode fill:#34A853,color:white,stroke:#1E8E3E,stroke-width:2px
    classDef yellowNode fill:#FBBC05,color:#333,stroke:#F9AB00,stroke-width:2px
    classDef redNode fill:#EA4335,color:white,stroke:#C5221F,stroke-width:2px
    
    class Start,End blueNode
    class Menu,Dispense greenNode
    class Inventory yellowNode
    class Notify redNode
```

## Layered Architecture Diagram

```mermaid
graph TB
    %% Define the subgraphs for each layer
    subgraph Presentation["Presentation Layer"]
        UI[User Interface]
        subgraph Components["Angular Components"]
            DMenu[Drink Menu Component]
            DEditor[Drink Editor Component]
            Disp[Dispenser Component]
            Inv[Inventory Component]
        end
    end

    subgraph Business["Business Logic Layer"]
        subgraph Services["Services"]
            BService[Barista Service]
            DService[Drink Menu Service]
        end
    end

    subgraph Data["Data Layer"]
        Models[Data Models]
        Assets[JSON Assets]
        Storage[Local Storage]
    end

    %% Define relationships between components
    UI --> Components
    Components --> Services
    Services --> Models
    Services --> Assets
    Services --> Storage

    %% Detailed connections
    DMenu --> BService
    DMenu --> DService
    DEditor --> DService
    Disp --> BService
    Inv --> BService
    BService --> Models
    DService --> Models
    DService --> Assets

    %% Styling
    classDef presentation fill:#2374ab,color:#fff,stroke:#1a5586,stroke-width:1px
    classDef business fill:#048a81,color:#fff,stroke:#036b65,stroke-width:1px
    classDef data fill:#734b5e,color:#fff,stroke:#5a3a4a,stroke-width:1px

    %% Apply styles
    class Presentation,UI,Components,DMenu,DEditor,Disp,Inv presentation
    class Business,Services,BService,DService business
    class Data,Models,Assets,Storage data
```

## Component Interaction Flow
```mermaid
flowchart LR
    User((User)) -->|Selects Drink| DrinkMenu[Drink Menu]
    DrinkMenu -->|Request Order| BaristaService[Barista Service]
    BaristaService -->|Check Inventory| InventoryService[Inventory Service]
    InventoryService -->|Confirm Stock| BaristaService
    BaristaService -->|Process Drink| Dispenser[Dispenser]
    Dispenser -->|Deliver Drink| User
    
    User -->|Payment| PaymentSystem[Payment System]
    PaymentSystem -->|Confirm Payment| BaristaService

    classDef user fill:#4062bb,color:white
    classDef component fill:#59c9a5,color:#333
    classDef service fill:#d81159,color:white
    classDef payment fill:#8a2be2,color:white

    class User user
    class DrinkMenu,Dispenser component
    class BaristaService,InventoryService service
    class PaymentSystem payment
```

## Technology Stack

```mermaid
flowchart TD
    subgraph Frontend["Frontend Technologies"]
        Angular[Angular Framework]
        TypeScript[TypeScript]
        Tailwind[Tailwind CSS]
        RxJS[RxJS]
    end

    subgraph Testing["Testing Framework"]
        Jasmine[Jasmine]
        Karma[Karma]
        Protractor[Protractor]
    end

    subgraph Backend["Backend/Storage"]
        LocalStorage[Local Storage]
        JSON[JSON Data Files]
    end

    Angular --> TypeScript
    Angular --> Tailwind
    Angular --> RxJS
    Angular --> Testing
    Angular --> Backend

    %% Styling
    classDef frontend fill:#3c91e6,color:white,stroke:#2a6aa8,stroke-width:1px
    classDef testing fill:#fa824c,color:white,stroke:#c9673d,stroke-width:1px
    classDef backend fill:#342e37,color:white,stroke:#221e24,stroke-width:1px

    %% Apply classes
    class Frontend,Angular,TypeScript,Tailwind,RxJS frontend
    class Testing,Jasmine,Karma,Protractor testing
    class Backend,LocalStorage,JSON backend
```

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
