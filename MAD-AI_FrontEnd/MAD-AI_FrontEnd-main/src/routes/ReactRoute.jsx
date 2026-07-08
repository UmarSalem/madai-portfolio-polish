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

const ReactRoute = () => {
  return (
    <div>
      <BrowserRouter>
    
      <Routes>
       <Route path={"/"} element={<Home/>}/>
       <Route path={ROUTE.Register} element={<Register/>}/>
       <Route path={ROUTE.Login} element={<Login/>}/>
       <Route path="/blog/:id" element={<BlogDetail />} />
       <Route path={ROUTE.About} element={<About/>}/>
       <Route path={ROUTE.AiDoctor} element={<AIDoctor/>}/>
       <Route path={ROUTE.Contact} element={<Contact/>}/>
       <Route path={ROUTE.Record} element={<Record/>}/>
       <Route path={ROUTE.Recommendation} element={<Recommendation/>}/>
       <Route path={ROUTE.SymptomChecker} element={<SymptomChecker/>}/>
       <Route path={ROUTE.MedicalHistory} element={<MedicalHistory/>}/>
       <Route path={ROUTE.DoctorSearch} element={<DoctorSearch/>}/>
       <Route path={ROUTE.Profile} element={<Profile/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default ReactRoute;