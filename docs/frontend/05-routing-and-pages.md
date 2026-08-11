# Routing and Pages

## Routing Library

The frontend uses React Router packages:

- `react-router`
- `react-router-dom`

Routes are defined in `src/routes/ReactRoute.jsx`. Route constants live in `src/routes/ReactLinks.js`.

## Route List

| Route | Page/component | Public or protected | Notes |
| --- | --- | --- | --- |
| `/` | `Home` | Public | Home page. |
| `/register` | `Register` | Public | Redirects if already logged in. |
| `/login` | `Login` | Public | Redirects if already logged in. |
| `/blog/:id` | `BlogDetail` | Public | Blog detail route. Data source needs verification. |
| `/about` | `About` | Public | Static/about content. |
| `/doctor` | `AIDoctor` | Protected | Currently reuses safe report demo component. |
| `/contact` | `Contact` | Public | Contact page. |
| `/record` | `Record` | Public | Needs verification. |
| `/recommendation` | `Recommendation` | Public | Needs API/static-data cleanup later. |
| `/symptomChecker` | `SymptomChecker` | Protected | Backend requires bearer token. |
| `/admin/medicalHistory` | `MedicalHistory` | Protected | Report upload/history safe demo page. |
| `/doctorSearch` | `DoctorSearch` | Protected | Backend requires patient token. |
| `/profile` | `Profile` | Protected | Backend requires patient token. |
| `*` | `NotFound` fallback | Public | Falls back to the home page for unknown routes. |

## Protected Route Behavior

`ProtectedRoute.jsx` checks `getStoredAuthUser()`. If no token exists, it redirects to `/login` and stores the attempted route in router state.

Current behavior:

```jsx
if (!user?.token) {
  return <Navigate to={ROUTE.Login} replace state={{ from: location }} />;
}
```

After successful login, `Login.jsx` redirects back to the attempted protected route when that state exists. Otherwise it uses `/doctor` as the normal post-login destination.

This is frontend-only protection. The backend still must enforce authorization, and it currently does for aligned protected endpoints.

## Known Routing Issues

- Some imports use `react-router`, while others use `react-router-dom`. Standardizing later would reduce confusion.
- The fallback route currently renders the home page instead of a dedicated 404 screen.
- `Recommendation` remains public for now because it is an older demo/static-data style page. Needs verification before protecting or replacing it.
- Static hosting needs SPA fallback/rewrite configuration.

## Static Hosting Notes

For GitHub Pages, Vercel, Netlify, or Cloudflare Pages:

- Browser routing needs a fallback to `index.html`.
- GitHub Pages may need a special SPA fallback or hash routing.
- Vercel/Netlify/Cloudflare Pages can usually use rewrite rules.
- The API base URL should come from `REACT_APP_API_BASE_URL`.
- Do not put secrets in frontend environment variables.
