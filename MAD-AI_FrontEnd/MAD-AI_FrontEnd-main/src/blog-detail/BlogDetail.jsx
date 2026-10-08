import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Config, requireApiConfiguration, publicAsset } from '../constant';
import axios from 'axios';
import "./blogstyle.css"
import Navbar from '../components/layout/Navbar';

const BlogDetail = () => {

  
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState('');

 useEffect(() => {
    const fetchBlog = async () => {
      try {
        requireApiConfiguration();
        const response = await axios.get(`${Config.serverUrl}/blogs?id=${id}`);
        console.log("Fetched blog:", response.data);
        setBlog(response.data[0]);
      } catch (error) {
        setError('Unable to load this demo blog post. The backend may be unavailable.');
      }
    };

    fetchBlog();
  }, [id]);

  if (error) return <><Navbar /><p role="alert">{error}</p></>;
  if (!blog) return <p>Loading...</p>;

  return (
    <>
      <Navbar />

      <div className="blog-detail-container">
        <img style={{marginTop:"100px"}} src={publicAsset(blog.image)} alt={blog.title} className="blog-detail-image" />

        <h1 className="blog-title">{blog.title}</h1>

        <div className="blog-meta">
          <p>{blog.publishDate}</p>
          <p>{blog.views} Views</p>
        </div>

        <p className="blog-description">{blog.description}</p>
      </div>
    </>
  );
};

export default BlogDetail;
