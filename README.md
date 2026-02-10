# Apogee

**Apogee** is a comprehensive Human Spaceflight Mission Planning & Analysis Tool, developed for the [SD2905 Human Spaceflight](https://kth.se/utbildning/program/teknik/utbildningar/human-spaceflight) course at KTH Royal Institute of Technology. It provides a suite of calculators to analyze various aspects of space missions, from launch vehicle performance to life support systems and mission economics.

## Features

The application includes the following analytical tools:

*   **Rocket Calculator:** Analyze launch vehicle performance and staging.
*   **Orbit Calculator:** Calculate orbital parameters and maneuvers.
*   **Life Support Calculator:** Estimate consumables and life support system requirements.
*   **Cost Calculator:** Project mission costs based on mass and complexity models.
*   **Solar Panel Calculator:** Size solar arrays for power generation in space.

## Tech Stack

*   **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
*   **UI Library:** [React 19](https://react.dev/)
*   **Testing:** [Jest](https://jestjs.io/) & [Playwright](https://playwright.dev/)

## Getting Started

### Prerequisites

*   Node.js (LTS version recommended)
*   npm (comes with Node.js)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/dhruvhaldar/apogee.git
    cd apogee
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Development Server

To start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Testing

### Unit Tests (Jest)

To run unit tests:

```bash
npm run test
# or to run in watch mode
npm run test:watch
```

### End-to-End Tests (Playwright)

To run end-to-end tests:

```bash
npx playwright test
```

## License

This project is licensed under the MIT License.
