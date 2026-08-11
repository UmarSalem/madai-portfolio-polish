import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { ROUTE } from './ReactLinks';
import Register from '../register/Register';
import Login from '../login/Login';
import About from '../about/About';
import Home from '../home/Home';
import AIDoctor from '../aidoctor/AIDoctor';
import Contact from '../contact/Contact';
import Record from '../todo/Record';
import Recommendation from '../recommendation/Recommendation';
import SymptomChecker from '../symptomChecker/SymptomChecker';
import MedicalHistory from '../medicalHistory/MedicalHistory';
import DoctorSearch from '../doctorSearch/DoctorSearch';
import BlogDetail from '../blog-detail/BlogDetail';
import Profile from '../profile/Profile';
import ProtectedRoute from './ProtectedRoute';

const NotFound = () => (
  <div>
    <Home />
  </div>
);

const ReactRoute = () => {
  return (
    <div>
      <BrowserRouter>
    
      <Routes>
       <Route path={ROUTE.Home} element={<Home/>}/>
       <Route path={ROUTE.Register} element={<Register/>}/>
       <Route path={ROUTE.Login} element={<Login/>}/>
       <Route path={ROUTE.BlogDetail} element={<BlogDetail />} />
       <Route path={ROUTE.About} element={<About/>}/>
       <Route path={ROUTE.AiDoctor} element={<ProtectedRoute><AIDoctor/></ProtectedRoute>}/>
       <Route path={ROUTE.Contact} element={<Contact/>}/>
       <Route path={ROUTE.Record} element={<Record/>}/>
       <Route path={ROUTE.Recommendation} element={<Recommendation/>}/>
       <Route path={ROUTE.SymptomChecker} element={<ProtectedRoute><SymptomChecker/></ProtectedRoute>}/>
       <Route path={ROUTE.MedicalHistory} element={<ProtectedRoute><MedicalHistory/></ProtectedRoute>}/>
       <Route path={ROUTE.DoctorSearch} element={<ProtectedRoute><DoctorSearch/></ProtectedRoute>}/>
       <Route path={ROUTE.Profile} element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
       <Route path="*" element={<NotFound />} />
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default ReactRoute;
