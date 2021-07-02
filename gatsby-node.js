const path = require('path');

const paintingTemplate = path.resolve('src/templates/real-object-page.jsx');

const imageTypeStructure = `infos {
  maxDimensions {
    width
    height
  }
}
images {
  xsmall {
    dimensions {
      width
      height
    }
    src
  }
  small {
    dimensions {
      width
      height
    }
    src
  }
  medium {
    dimensions {
      width
      height
    }
    src
  }
  origin {
    dimensions {
      width
      height
    }
    src
  }
  tiles {
    dimensions {
      width
      height
    }
    src
  }
}`;

const pagesDataQuery = `
  query CranachPaintingsObjects {
    allPaintingsJson {
      edges {
        node {
          items {
            additionalTextInformation {
              author
              date
              type
              text
              year
            }
            bibliography
            catalogWorkReferences {
              description
              referenceNumber
              remarks
            }
            classification {
              classification
            }
            dating {
              begin
              dated
              end
              historicEventInformations {
                begin
                end
                eventType
                remarks
                text
              }
              remarks
            }
            description
            dimensions
            exhibitionHistory
            images{
              overall {
                ${imageTypeStructure}
              }
              detail {
                ${imageTypeStructure}
              }
              reverse {
                ${imageTypeStructure}
              }
              analysis {
                ${imageTypeStructure}
              }
              conservation {
                ${imageTypeStructure}
              }
              irr {
                ${imageTypeStructure}
              }
              koe {
                ${imageTypeStructure}
              }
              other {
                ${imageTypeStructure}
              }
              photomicrograph {
                ${imageTypeStructure}
              }
              rkd {
                ${imageTypeStructure}
              }
              uv_light {
                ${imageTypeStructure}
              }
              x_radiograph {
                ${imageTypeStructure}
              }
            }
            inscription
            inventoryNumber
            involvedPersons {
              alternativeName
              date
              displayOrder
              isUnknown
              name
              nameType
              prefix
              remarks
              role
              suffix
            }
            involvedPersonsNames {
              constituentId
              details {
                name
                nameType
              }
            }
            isBestOf
            markings
            locations {
              path
              term
              type
            }
            medium
            metadata {
              additionalInfos
              classification
              date
              entityType
              id
              imgSrc
              langCode
              subtitle
              title
            }
            objectId
            objectName
            owner
            provenance
            publications {
              pageNumber
              referenceId
              title
            }
            relatedWorks
            repository
            restorationSurveys {
              filenames
              involvedPersons {
                name
                role
              }
              overallAnalysis
              processingDates {
                beginDate
                endDate
              }
              project
              remarks
              signature {
                date
                name
              }
              tests {
                keywords {
                  additional
                  name
                }
                kind
                purpose
                text
              }
              type
              filenames
            }
            secondaryReferences {
              inventoryNumber
              remark
              text
            }
            signature
            sortingNumber
            structuredDimension {
              element
              height
              width
            }
            titles {
              remarks
              title
              type
            }
          }
        }
      }
    }
  }
`;

const getRepresentativeImageVariant = (item) => {
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


const createPaintingPages = function(items, actions) {
  const { createPage } = actions;

  const itemsWithImages = items
    .map((item) => ({
      ...item,
      representativeImage: getRepresentativeImageVariant(item),
    }));

  itemsWithImages.forEach((item) => {
    createPage({
      path: `${item.metadata.langCode}/${item.inventoryNumber}`,
      component: paintingTemplate,
      context: {
        ...item,
      },
    });
  });
};


exports.createPages = ({ graphql, actions }) => {

  return graphql(pagesDataQuery).then((res) => {
    if(res.errors) {
      console.error(res.errors);
      return;
    }

    const flattenedItems = res.data.allPaintingsJson.edges.reduce(
      (acc, edge) => acc.concat(...edge.node.items),
      [],
    );

    createPaintingPages(flattenedItems, actions);
  });

};
