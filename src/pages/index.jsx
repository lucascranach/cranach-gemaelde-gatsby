import React, { useState } from 'react';
import Helmet from 'react-helmet';

import Navigation from '~/components/molecules/navigation';
import ArtefactOverview from '~/components/organisms/artefact-overview';

import i18n from '~/i18n';

const Index = () => {
  i18n('de');

  const [currentArtefactView, setCurrentArtefactView] = useState(ArtefactOverview.DefaultView);

  return (
    <div
      className="page"
      data-page="index"
    >
      <Helmet>
        <title>Cranach Digital Archive | Home</title>
      </Helmet>

      <div
        className="page-dark"
      >
        <Navigation>
          <ArtefactOverview.Switcher
            view={ currentArtefactView }
            handleChange={ setCurrentArtefactView }
          />
        </Navigation>

        <main
          className="main-content"
        >
         No overview!
        </main>
      </div>
    </div>
  );
};

export default Index;
