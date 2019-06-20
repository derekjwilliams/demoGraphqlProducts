import React from "react";
import { render } from "react-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider, Query } from "react-apollo";
import gql from "graphql-tag";

const client = new ApolloClient({
  uri: "http://localhost:5000/graphql"
});

const productsStyle = {
  fontFamily: 'Lucida Grande',
  fontSize: '14px',
  backgroundColor: '#cdeaca',
  padding: '8px',
  margin: '8px',
  background: 'https://my.sit.nutrienagsolutions.com/static/media/registrationBackground-min.d6eb8897.jpg'
}
const footerStyle = {
  fontStyle: 'italic',
  fontSize: '0.8rem',
  marginTop: '0.8rem'
}
const termsStyle = {
  float: 'left',
  width: '30%',
  textAlign: 'right',
  padding: '.25em',
  clear: 'left',
}
const variantStyle = {
  margin: '1rem',
  padding: '1rem',
  color: '#eeeeee',
  backgroundColor: '#657763'
}


const Products = () => (
  <Query
    query={gql`
      {
        allProducts(first: 100) {
          nodes {
            guid
            name
            description
            enabled
            logo
            shortDescription
            arsKey
            manufacturerName
            commonName
            associatedCountry
            variantsByProductGuid {
              nodes {
                arsKey
                guid
                agrianId
                description
                unitQty
                unitSize
                unitMeasure
                associatedCountry
                agrianId
                enabled
              }
            }
          }
        }
      }
    `}
  >
  {({ loading, error, data }) => {
    if (loading) {
      return <p>Loading...</p>
    }
    if (error) {
      return <p>Error, Oh Noes, check the console</p>
    }
    return data.allProducts.nodes.map(({ 
      guid, 
      name,
      description,
      manufacturerName,
      variantsByProductGuid,
      commonName,
      associatedCountry
    }) => (
      <div key={guid} style={productsStyle}>
        <section>
          <h2>
            {name}{commonName ? `- ${commonName}`: ''}({associatedCountry})
          </h2>
          <h3>
            {manufacturerName ? `Made By ${manufacturerName}`: ''}
          </h3>
          <p>
            {description}
          </p>
          <Variants {...variantsByProductGuid}/>
            <footer style={footerStyle}>GUID: {guid}</footer>
        </section>
      </div>
    ));
  }}
  </Query>
);

const Variants = (variantsByProductGuid) => {
  const result = variantsByProductGuid.nodes.map(({
          arsKey,
          guid,
          agrianId,
          description,
          unitQty,
          unitSize,
          unitMeasure,
          associatedCountry,
          enabled,
          position,
          image,
          imageMobile
  }) => 
    <div key={guid} style={variantStyle}>
      <div>
        <div>{description}</div>
        <div>{`arsKey: ${arsKey}`}</div>
        <div>{`guid: ${guid}`}</div>
        <div>{`agrianId: ${agrianId}`}</div>
        <div>{`package: ${unitSize} ${unitMeasure}`}</div>
        <div>{`agrianId: ${agrianId}`}</div>
        <div>{`associatedCountry: ${associatedCountry}`}</div>
        <div>{`enabled: ${enabled}`}</div>
        <div>{`position: ${position}`}</div>
      </div>
      </div>
    )
  return <div><h3>Variants</h3>{result}</div>
  
}


const App = () => (
  <ApolloProvider client={client}>
    <Products />
  </ApolloProvider>
);

render(<App />, document.getElementById("root"));
