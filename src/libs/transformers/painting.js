import cranachCfg from '~/cranach.config';

const { titleLength } = cranachCfg;

const getRepresentativeImage = (item) => {
  const emptyImageType = {
    infos: {
      maxDimensions: {
        width: 0,
        height: 0,
      },
    },
    images: [
      ['xsmall', 'small', 'medium', 'origin', 'tiles'].reduce(
        (acc, size) => {
          acc[size] = { src: '', dimensions: { width: 0, height: 0 } };
          return acc;
        },
        {},
      ),
    ],
  };
  const imageType = (item.images && item.images.overall) || emptyImageType;
  return imageType.images[imageType.images.length - 1];
};

const Painting = {
  flattenGraphQlEdges(rawItems) {
    return rawItems.edges.reduce((acc, edge) => {
      acc.push(...edge.node.items);
      return acc;
    }, []);
  },

  byImageExistence(item) {
    return !!item.images;
  },

  toArtefact(item) {
    const inventor = item.involvedPersons.find((person) => person.role === 'Inventor');
    const classificationLevel2 = (item.objectName) ? item.objectName.replace(/:.*/, '') : false;
    const classification = (item.objectName) ? `${item.classification.classification}, ${classificationLevel2}` : item.classification.classification;
    const title = (item.titles[0] && item.titles[0].title) || '';
    const titleShort = (title.length > titleLength) ? `${title.substr(0, titleLength)}…` : title;

    const imgSrc = item.representativeImage.small.src || '';

    return {
      inventoryNumber: item.inventoryNumber,
      title,
      titleShort,
      subtitle: inventor ? inventor.name : ' ',
      date: item.dating.dated || '',
      masterData: item,
      classification,
      to: `/${item.metadata.langCode}/${item.slug}`,
      imgSrc,
    };
  },

  toViewerArtefact(item, selectedImageId = null) {
    const images = Object.entries(item.images || {}).filter(
      (image) => !!image[1],
    ).reduce((acc, [imageType, imageTypeValue]) => {
      imageTypeValue.images.forEach((image) => {
        const imgData = {
          sizes: image.sizes,
          thumbnail: (image.sizes.small && image.sizes.small.src) || '',
          altText: imageType,
          id: image.id,
          selected: selectedImageId
            ? image.id === selectedImageId
            : image.id === item.representativeImage.id,
        };

        acc.push(imgData);
      });

      return acc;
    }, []);

    return {
      type: 'paintings',
      id: item.inventoryNumber,
      placeholder: item.representativeImage,
      images,
    };
  },

  toAddedRepresentativeImage(item) {
    return {
      ...item,
      representativeImage: getRepresentativeImage(item),
    };
  },
};

export default Painting;
