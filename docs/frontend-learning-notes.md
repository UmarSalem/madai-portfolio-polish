# Frontend Learning Notes

These notes are for explaining and improving the Madai React frontend as a junior developer.

## React Components

A component is a reusable piece of UI. In Madai, examples include the navbar, buttons, cards, blog cards, and feature screens. Components can receive data through props and can keep local state for interactive behavior.

## Pages

Pages are larger components that represent app screens, such as login, register, home, profile, symptom checker, doctor search, and medical report upload. The project currently organizes many pages by feature folder.

## Routing

Routing decides which screen appears for a URL. Madai uses React Router with routes such as `/`, `/login`, `/register`, `/doctor`, `/symptomChecker`, `/doctorSearch`, and `/profile`.

In interviews, explain routing as: "The frontend is a single-page app. React Router maps URLs to page components without reloading the browser."

## Props

Props are values passed from a parent component to a child component. For example, a blog card can receive a `blog` prop and render the blog title, image, and date.

## State

State is data that changes while the user interacts with the app. Examples include form inputs, loading flags, search results, current user data, and symptom-checker results.

## Hooks

Hooks are React functions that let components use state and lifecycle behavior.

## useState

`useState` stores local component values. In Madai, form fields like email, password, symptoms, location, and specialty use state.

## useEffect

`useEffect` runs side effects such as fetching data after a component loads. Examples include loading blogs, loading profile data, or fetching medical history.

## API Calls With Axios

Axios is used to call backend or demo endpoints. The project has a shared Axios client in `src/api/httpClient.js`, which can attach a bearer token to requests.

Interview explanation: "I use a shared HTTP client so common API settings, like the base URL and auth header, are handled in one place."

## localStorage Token Handling

The frontend stores the login response in `localStorage` for demo authentication. The Axios interceptor reads it and adds `Authorization: Bearer <token>`.

This is acceptable for a portfolio demo, but it should be explained as demo-grade and not a complete production auth strategy.

## Loading and Error States

Some screens use `loading` state to disable buttons and show messages like "Searching..." or "Checking...". Errors are currently mostly shown with `alert(...)`. A future polish task should replace alerts with inline UI messages.

## Controlled Forms

A controlled form uses React state as the source of truth for input values. For example, typing into an email field updates `email` state, and submitting the form uses that state value.

## How To Explain This Frontend In Interviews

Short version:

"The frontend is a React single-page app for a healthcare assistant demo. It uses routes for major screens, local component state for forms and results, and Axios to communicate with the backend. My portfolio work is focused on cleaning up the API contracts, replacing unsafe demo data, improving documentation, and polishing features one by one."

Honest limitation:

"The project came from a bachelor group project, so some parts still show mixed approaches, like json-server style calls next to newer backend API calls. I identified those mismatches and planned a feature-by-feature refactor rather than rewriting everything."
