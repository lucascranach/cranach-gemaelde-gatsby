import React from 'react';

import './image.scss';

const Image = ({
  src,
  alt,
  caption,
  classNamePrefix,
  modifierWithBox = false,
}) => {
  const classNameModifier = modifierWithBox ? '--with-box' : '';
  const capArray = (Array.isArray(caption) ? caption : [caption]);
  const captions = caption ? capArray : [];
  const className = `${classNamePrefix ? `${classNamePrefix} image${classNameModifier}` : `image${classNameModifier}`}`;

  return (
    <figure
      className={className}
      data-component="atoms/image"
    >
      <div
        className="image__holder"
      >
        <img
          src={src}
          alt={alt}
        ></img>
      </div>

      {caption && <figcaption
        className='image__caption'
      >{captions}
      </figcaption>
      }
    </figure>
  );
};

export default Image;
