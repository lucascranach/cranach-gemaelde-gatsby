import React, {
  useState,
  useEffect,
  useRef,
} from 'react';

import cranachCfg from '~/cranach.config';
import './viewer.scss';

import zoomInRest from './images/zoomin_rest.png';
import zoomInHover from './images/zoomin_hover.png';

import zoomOutRest from './images/zoomout_rest.png';
import zoomOutHover from './images/zoomout_hover.png';

import homeRest from './images/home_rest.png';
import homeHover from './images/home_hover.png';

import fullpageRest from './images/fullpage_rest.png';
import fullpageHover from './images/fullpage_hover.png';

const { imageServer } = cranachCfg;

const navImages = {
  zoomIn: {
    REST: zoomInRest,
    GROUP: zoomInHover,
    HOVER: zoomInHover,
    DOWN: zoomInHover,
  },
  zoomOut: {
    REST: zoomOutRest,
    GROUP: zoomOutHover,
    HOVER: zoomOutHover,
    DOWN: zoomOutHover,
  },
  home: {
    REST: homeRest,
    GROUP: homeHover,
    HOVER: homeHover,
    DOWN: homeHover,
  },
  fullpage: {
    REST: fullpageRest,
    GROUP: fullpageHover,
    HOVER: fullpageHover,
    DOWN: fullpageHover,
  },
};

export default ({
  artefact,
}) => {
  const figureElRef = useRef(null);
  const viewerRef = useRef(null);
  const [activeZoom, setActiveZoom] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    setActiveImage(artefact.images.find(
      (image) => image.selected,
    ));
  }, [artefact]);

  const getTilesUrl = (tiles) => tiles.src.replace(
    imageServer.urlImages,
    imageServer.baseUrlTiles,
  );

  const src = getTilesUrl(artefact.placeholder.sizes.tiles);

  const hideLoadIndicator = () => {
    setIsLoaded(true);
  };

  const showLoadIndicator = () => {
    setIsLoaded(false);
  };

  useEffect(() => {
    if (!figureElRef.current) {
      return () => {};
    }
    /* OpenSeaDragon references 'document',
    so we have to skip the import to prevent an error
    while building the site */
    if (!window || !window.document) {
      return () => {};
    }

    import('openseadragon').then((OpenSeaDragon) => {
      viewerRef.current = new OpenSeaDragon.default.Viewer({
        element: figureElRef.current,
        tileSources: src,
        prefixUrl: '',
        sequenceMode: false,
        navImages,
        showNavigator: true,
      });
      viewerRef.current.addOnceHandler('open', () => {
        setActiveZoom(true);
      });
      viewerRef.current.addHandler('open', () => {
        const tiledImage = viewerRef.current.world.getItemAt(0);

        if (tiledImage.getFullyLoaded()) {
          hideLoadIndicator();
        } else {
          tiledImage.addHandler('fully-loaded-change', hideLoadIndicator);
        }
      });
    });

    return function seadragonCleanUp() {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [src, figureElRef]);

  useEffect(() => {
    if (!viewerRef.current) return;

    showLoadIndicator();
    viewerRef.current.open(
      getTilesUrl(activeImage.sizes.tiles),
    );
  }, [viewerRef, activeImage]);

  return (<div
    className="viewer"
    data-component="organisms/viewer"
  >
    <figure
      ref={figureElRef}
      className={`zoom-image ${activeZoom ? 'has-active-zoom' : ''} ${isLoaded ? 'is-loaded' : ''}`}
    >
    </figure>

   <ul className="image-stripe-list">
      {artefact.images.map((image) => (
        <li key={image.id} onClick={() => setActiveImage(image)} className={(image === activeImage) ? 'image-stripe-list__item is-active' : 'image-stripe-list__item'}>
          <img src={image.thumbnail} alt={image.altText} />
        </li>
      ))}
    </ul>
  </div >);
};
