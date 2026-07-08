import React from 'react';
import './DataCardsStyle.css';
import { Link } from 'react-router';

const DataCards = ({blog}) => {
  const limitText = (text, limit = 100) => {
  return text.length > limit ? text.slice(0, limit) + '...' : text;
};

  return (
    <div>

      <section>
        <div className='mainer-div'>
          <div className='carder-div'>
            <img id='ones-image' className='card-image'  src={blog.image} />
            <p id='lorem'>{limitText(blog.title,50)}  </p>
            <Link to={`/blog/${blog.id}`} id='button-read'>Read More</Link>
            <p id='anchor-tag'> {limitText(blog.description, 100)}</p>
            <div className='views-date'>
              <p>{blog.views} Views</p>
              <p>{blog.publishDate}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DataCards;