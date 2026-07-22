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
| `admin/medicalHistory` | `MedicalHistory` | Protected | Missing leading slash in route constant; works depending on router interpretation. Needs verification. |
| `/doctorSearch` | `DoctorSearch` | Protected | Backend requires patient token. |
| `/profile` | `Profile` | Protected | Backend requires patient token. |

## Protected Route Behavior

`ProtectedRoute.jsx` checks `getStoredAuthUser()`. If no token exists, it redirects to `/login`.

Current behavior:

```jsx
if (!user?.token) {
  return <Navigate to={ROUTE.Login} replace />;
}
```

This is frontend-only protection. The backend still must enforce authorization, and it currently does for aligned protected endpoints.

## Known Routing Issues

- `ROUTE.MedicalHistory` is `admin/medicalHistory` without a leading `/`. Needs verification.
- Some imports use `react-router`, while others use `react-router-dom`. Standardizing later would reduce confusion.
- No fallback `404` route is defined.
- Static hosting needs SPA fallback/rewrite configuration.

## Static Hosting Notes

For GitHub Pages, Vercel, Netlify, or Cloudflare Pages:

- Browser routing needs a fallback to `index.html`.
- GitHub Pages may need a special SPA fallback or hash routing.
- Vercel/Netlify/Cloudflare Pages can usually use rewrite rules.
- The API base URL should come from `REACT_APP_API_BASE_URL`.
- Do not put secrets in frontend environment variables.
